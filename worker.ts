import { Q, computeConcepts, gateDefs, validateImportedState, type FoundryState } from './model.js';

interface Principal { founder: number; admin: boolean }
interface AuthKey extends Principal { hash: string }
interface Stored { version: number; data: string; updated_at: string }
interface Expected { exists: boolean; value?: unknown }
export interface Change { path: (string | number)[]; expected: Expected; value: unknown }
class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status }
}
function invalid(message: string): never { throw new ApiError(400, message) }
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function deriveState(state: FoundryState): FoundryState {
  const result = structuredClone(state);
  result.concepts = computeConcepts(result);
  if (gateDefs.every(([id]) => Number.isFinite(result.market[id]))) {
    result.market.score = Math.round(gateDefs.reduce((sum, [id]) => sum + result.market[id], 0) / gateDefs.length);
  } else delete result.market.score;
  return result;
}

function readPath(root: unknown, path: (string | number)[]): Expected {
  let current = root;
  for (const key of path) {
    if (typeof current !== 'object' || current === null || !Object.hasOwn(current, key)) return { exists: false };
    current = Reflect.get(current, key);
  }
  return { exists: true, value: current };
}

function writePath(root: object, path: (string | number)[], value: unknown) {
  let current = root;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    let child: unknown = Reflect.get(current, key);
    if (typeof child !== 'object' || child === null) {
      child = path[0] === 'votes' ? [3, 3, 3] : {};
      Reflect.set(current, key, child);
    }
    if (typeof child !== 'object' || child === null) invalid('Invalid path');
    current = child;
  }
  Reflect.set(current, path[path.length - 1], value);
}

function canEdit(path: Change['path'], principal: Principal): boolean {
  const [root, slot, key] = path;
  if (root === 'answers') return path.length === 3 && slot === principal.founder && Q.some(q => q.id === key);
  if (root === 'founders') return path.length === 3 && slot === principal.founder && ['name','role','notes'].includes(String(key));
  if (root === 'votes') return path.length === 3 && key === principal.founder && /^c\d+$/.test(String(slot));
  if (!principal.admin) return false;
  if (root === 'shared') return path.length === 2 && ['mvpMonths','mvpBudget','teamHours','engine'].includes(String(slot));
  if (root === 'market') return path.length === 2 && gateDefs.some(([id]) => id === slot);
  return root === 'comparables' && path.length === 1;
}

export function applyChanges(state: FoundryState, changes: Change[], principal: Principal): FoundryState {
  const next = structuredClone(state);
  for (const change of changes) {
    if (!canEdit(change.path, principal)) throw new ApiError(403, 'Puoi modificare soltanto il tuo profilo e i tuoi voti.');
    const current = readPath(next, change.path);
    const neutralVote=change.path[0]==='votes'&&!change.expected.exists&&current.exists&&current.value===3;
    if (!equal(current, change.expected)&&!neutralVote) throw new ApiError(409, 'Questo campo è stato modificato altrove. Ricarica i dati prima di riprovare.');
    writePath(next, change.path, change.value);
  }
  try { validateImportedState(next) } catch { invalid('Risposta o valore non valido. Nessuna modifica salvata.') }
  const derived = deriveState(next);
  if (new TextEncoder().encode(JSON.stringify(derived)).byteLength > 262144) invalid('Il dataset supera il limite consentito.');
  return derived;
}

function changesFrom(value: unknown): Change[] {
  if (!Array.isArray(value) || !value.length || value.length > 120) invalid('Invalid change batch');
  return value.map((entry: unknown) => {
    if (!isRecord(entry) || !Array.isArray(entry.path) || !isRecord(entry.expected) || typeof entry.expected.exists !== 'boolean' || !Object.hasOwn(entry,'value')) invalid('Invalid change');
    const keys = entry.path;
    if (keys.length < 1 || keys.length > 3 || keys.some((key: unknown) => !(typeof key === 'string' || Number.isInteger(key)) || ['__proto__','prototype','constructor'].includes(String(key)))) invalid('Invalid path');
    const path: (string | number)[] = keys;
    const expected: Expected = entry.expected.exists ? {exists:true,value:entry.expected.value} : {exists:false};
    return { path, expected, value: entry.value };
  });
}

async function digest(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,'0')).join('');
}
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i=0;i<a.length;i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
async function authenticate(request: Request, env: Env): Promise<Principal> {
  const authorization = request.headers.get('Authorization') || '';
  if (!/^Bearer [A-Za-z0-9_-]{40,100}$/.test(authorization)) throw new ApiError(401,'Accesso di modifica richiesto.');
  const hash = await digest(authorization.slice(7));
  const keys: AuthKey[] = JSON.parse(env.AUTH_KEYS);
  const matched = keys.find(key => safeEqual(key.hash,hash));
  if (!matched) throw new ApiError(401,'Link di modifica non valido.');
  return {founder:matched.founder,admin:matched.admin};
}
async function readState(env: Env): Promise<Stored> {
  const row = await env.DB.prepare('SELECT version, data, updated_at FROM foundry_state WHERE id = 1').first<Stored>();
  if (!row) throw new ApiError(503,'Il progetto condiviso non è ancora inizializzato.');
  return row;
}
const envelope = (row: Stored) => ({version:row.version, updatedAt:row.updated_at, data:JSON.parse(row.data)});

async function boundedJson(request: Request): Promise<unknown> {
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw new ApiError(415,'JSON richiesto.');
  const length=Number(request.headers.get('Content-Length') || 0);
  if(length>262144) throw new ApiError(413,'Richiesta troppo grande.');
  const reader=request.body?.getReader();
  if (!reader) invalid('Missing request body');
  let bytes=0; const chunks: Uint8Array[]=[];
  try {
    while(true){const item=await reader.read();if(item.done)break;bytes+=item.value.byteLength;if(bytes>262144){await reader.cancel();throw new ApiError(413,'Richiesta troppo grande.')}chunks.push(item.value)}
  } finally { reader.releaseLock() }
  const all=new Uint8Array(bytes);let offset=0;
  for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.byteLength}
  try {return JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:false}).decode(all))} catch {return invalid('Invalid JSON')}
}

async function patchState(request: Request, env: Env, principal: Principal) {
  const body=await boundedJson(request);
  if(!isRecord(body)||typeof body.id!=='string'||!/^[-A-Za-z0-9]{16,80}$/.test(body.id)) invalid('Invalid request ID');
  const id=body.id;
  const changes=changesFrom(body.changes);
  const requestHash=await digest(JSON.stringify(body));
  async function acknowledged(): Promise<boolean> {
    const receipt=await env.DB.prepare('SELECT actor, request_hash FROM foundry_receipts WHERE id = ?').bind(id).first<{actor:number;request_hash:string}>();
    if(!receipt)return false;
    if(receipt.actor!==principal.founder||!safeEqual(receipt.request_hash,requestHash))throw new ApiError(409,'Request ID already used');
    return true;
  }
  for(let attempt=0;attempt<6;attempt++){
    if(await acknowledged())return envelope(await readState(env));
    const row=await readState(env);
    const current=validateImportedState(JSON.parse(row.data));
    let next: FoundryState;
    try { next=applyChanges(current,changes,principal) }
    catch(error) { if(error instanceof ApiError&&error.status===409&&await acknowledged())return envelope(await readState(env)); throw error }
    const serialized=JSON.stringify(next), now=new Date().toISOString();
    const results=await env.DB.batch([
      env.DB.prepare('UPDATE foundry_state SET data = ?, version = version + 1, updated_at = ? WHERE id = 1 AND version = ? AND NOT EXISTS (SELECT 1 FROM foundry_receipts WHERE id = ?)').bind(serialized,now,row.version,id),
      env.DB.prepare('INSERT OR IGNORE INTO foundry_receipts (id, actor, request_hash, created_at) SELECT ?, ?, ?, ? WHERE changes() = 1').bind(id,principal.founder,requestHash,now),
      env.DB.prepare("DELETE FROM foundry_receipts WHERE created_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-2 days')")
    ]);
    if(results[0].meta.changes===1) return envelope(await readState(env));
    if(await acknowledged())return envelope(await readState(env));
  }
  throw new ApiError(503,'Salvataggio occupato. Riprova tra pochi secondi.');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin=request.headers.get('Origin');
    const allowed=env.ALLOWED_ORIGINS.split(',');
    const headers=new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'});
    if(origin&&allowed.includes(origin))headers.set('Access-Control-Allow-Origin',origin);
    const json=(body: unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
    try {
      if(origin&&!allowed.includes(origin))return json({error:'Origin not allowed'},403);
      const url=new URL(request.url);
      if(request.method==='OPTIONS'){
        headers.set('Access-Control-Allow-Methods','GET, PATCH, OPTIONS');
        headers.set('Access-Control-Allow-Headers','Authorization, Content-Type, If-None-Match');
        headers.set('Access-Control-Max-Age','600');
        return new Response(null,{status:204,headers});
      }
      if(url.pathname==='/api/state'&&request.method==='GET'){
        const row=await readState(env);headers.set('ETag',`"${row.version}"`);
        if(request.headers.get('If-None-Match')===`"${row.version}"`)return new Response(null,{status:304,headers});
        return json(envelope(row));
      }
      if(url.pathname==='/api/session'&&request.method==='GET')return json(await authenticate(request,env));
      if(url.pathname==='/api/state'&&request.method==='PATCH')return json(await patchState(request,env,await authenticate(request,env)));
      return json({error:'Not found'},404);
    } catch(error) {
      if(error instanceof ApiError)return json({error:error.message},error.status);
      console.error(JSON.stringify({event:'foundry_request_failed',path:new URL(request.url).pathname}));
      return json({error:'Servizio temporaneamente non disponibile. Le modifiche non sono confermate.'},503);
    }
  }
};
