const clone = value => structuredClone(value);
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);

function field(object,path) {
  let value=object;
  for(const key of path){if(value===null||typeof value!=='object'||!Object.hasOwn(value,key))return {exists:false};value=value[key]}
  return {exists:true,value:clone(value)};
}
function write(object,path,value){let current=object;for(let i=0;i<path.length-1;i++){const key=path[i];if(!current[key]||typeof current[key]!=='object')current[key]=path[0]==='votes'?[3,3,3]:{};current=current[key]}current[path.at(-1)]=clone(value)}
export function editableChanges(before,after,principal){
  if(!principal)return [];
  const paths=[];const slot=principal.founder;
  for(const key of new Set([...Object.keys(before.answers[slot]),...Object.keys(after.answers[slot])]))paths.push(['answers',slot,key]);
  for(const key of ['name','role','notes'])paths.push(['founders',slot,key]);
  for(const id of new Set([...Object.keys(before.votes),...Object.keys(after.votes)]))paths.push(['votes',id,slot]);
  if(principal.admin){for(const key of Object.keys(after.shared))paths.push(['shared',key]);for(const key of Object.keys(after.market).filter(k=>k!=='score'))paths.push(['market',key]);paths.push(['comparables'])}
  return paths.flatMap(path=>{const expected=field(before,path),next=field(after,path);return next.exists&&!same(expected,next)?[{path,expected,value:next.value}]:[]});
}

export function mergePending(pending,changes){
  for(const change of changes){
    const index=pending.findIndex(item=>same(item.path,change.path));
    if(index<0)pending.push(change);
    else pending[index]={...pending[index],value:change.value};
  }
  return pending.filter(change=>!same(change.expected,{exists:true,value:change.value}));
}

export class FoundrySync {
  constructor({base,onState,onStatus,onAccess}) {
    this.base=base.replace(/\/$/,'');this.onState=onState;this.onStatus=onStatus;this.onAccess=onAccess;
    this.principal=null;this.token='';this.snapshot=null;this.pending=[];this.batch=null;this.sending=false;this.blocked=false;this.version=0;this.retryDelay=2000;
  }
  headers(json=false){const result={};if(this.token)result.Authorization='Bearer '+this.token;if(json)result['Content-Type']='application/json';return result}
  status(text,error=false){this.onStatus(text,error)}
  store(){if(!this.principal)return;try{localStorage.setItem('trinityPending:'+this.principal.founder,JSON.stringify({pending:this.pending,batch:this.batch}))}catch{this.status('Bozza non salvata sul dispositivo. Tieni aperta questa pagina.',true)}}
  apply(envelope){
    this.version=envelope.version;this.updatedAt=envelope.updatedAt;const data=clone(envelope.data);
    for(const change of [...(this.batch?.changes||[]),...this.pending])write(data,change.path,change.value);
    this.snapshot=clone(data);this.onState(data,envelope);
    try{localStorage.setItem('trinityFoundry',JSON.stringify(data))}catch{}
  }
  async request(path,options={}){
    const response=await fetch(this.base+path,{...options,signal:AbortSignal.timeout(12000),cache:'no-store'});
    if(response.status===304)return {unchanged:true};
    const body=await response.json();if(!response.ok){const error=new Error(body.error||'Servizio non disponibile');error.status=response.status;throw error}return body;
  }
  async load(){const envelope=await this.request('/api/state');this.apply(envelope);this.status('Dati condivisi aggiornati · '+new Date(envelope.updatedAt).toLocaleString('it-IT'));return envelope}
  async connect(token){
    const old=this.token,oldPrincipal=this.principal;this.token=token;
    try{
      const principal=await this.request('/api/session',{headers:this.headers()});
      if(this.principal&&(this.pending.length||this.batch)&&this.principal.founder!==principal.founder)throw new Error('Attendi il salvataggio delle modifiche prima di cambiare profilo.');
      const envelope=await this.request('/api/state');
      this.principal=principal;localStorage.setItem('trinityEditToken',token);this.onAccess(principal);
      try{const draft=JSON.parse(localStorage.getItem('trinityPending:'+principal.founder)||'null');if(draft&&Array.isArray(draft.pending)){this.pending=draft.pending;this.batch=draft.batch||null}}catch{}
      this.apply(envelope);this.status('Accesso personale attivo · dati condivisi aggiornati');if(this.pending.length||this.batch)this.schedule(0);return principal;
    }catch(error){this.token=old;this.principal=oldPrincipal;this.onAccess(oldPrincipal);throw error}
  }
  disconnect(){if(this.pending.length||this.batch){this.status('Attendi il salvataggio prima di uscire.',true);return}this.token='';this.principal=null;localStorage.removeItem('trinityEditToken');this.onAccess(null);this.status('Modalità consultazione · aggiornamento automatico')}
  enqueue(state,pinned=null){
    if(!this.principal||!this.snapshot||this.blocked)return;
    const changes=editableChanges(this.snapshot,state,this.principal);if(!changes.length)return;
    if(pinned&&!this.pending.some(c=>same(c.path,pinned.path))&&!this.batch?.changes.some(c=>same(c.path,pinned.path))){
      const change=changes.find(c=>same(c.path,pinned.path));if(change)change.expected=clone(pinned.expected);
    }
    this.pending=mergePending(this.pending,changes);this.snapshot=clone(state);this.store();this.status('Salvataggio in corso…');this.schedule(650);
  }
  schedule(delay){clearTimeout(this.timer);this.timer=setTimeout(()=>this.flush(),delay)}
  async flush(){
    if(this.sending||this.blocked||!this.principal)return;
    if(!this.batch&&this.pending.length){
      const id=crypto.randomUUID();let count=Math.min(120,this.pending.length);
      while(count>1&&new TextEncoder().encode(JSON.stringify({id,changes:this.pending.slice(0,count)})).byteLength>245760)count--;
      this.batch={id,changes:this.pending.splice(0,count)};
    }
    if(!this.batch)return;this.sending=true;this.store();
    try{
      const envelope=await this.request('/api/state',{method:'PATCH',headers:this.headers(true),body:JSON.stringify(this.batch)});
      this.batch=null;this.retryDelay=2000;this.store();this.apply(envelope);
      this.status(this.pending.length?'Salvataggio in corso…':'Salvato online · '+new Date(envelope.updatedAt).toLocaleTimeString('it-IT'));
    }catch(error){
      if([400,401,403,409,413,415].includes(error.status)){this.blocked=true;this.status(error.message+' · La bozza resta su questo dispositivo. Usa “Ricarica dati” per tornare alla versione condivisa.',true)}
      else{this.status('Connessione assente: bozza locale, salvataggio online da confermare. Riprovo automaticamente.',true);this.schedule(this.retryDelay);this.retryDelay=Math.min(this.retryDelay*2,30000)}
    }finally{this.sending=false;if(!this.blocked&&this.pending.length&&!this.batch)this.schedule(0)}
  }
  async reload(){
    if(this.sending)return;
    if(this.pending.length||this.batch)localStorage.setItem('trinityLastDiscardedDraft',JSON.stringify({founder:this.principal?.founder,pending:this.pending,batch:this.batch,at:new Date().toISOString()}));
    this.pending=[];this.batch=null;this.blocked=false;this.store();await this.load();
  }
  async poll(){
    if(document.hidden||this.sending||this.pending.length||this.batch||this.blocked)return;
    try{const result=await this.request('/api/state',{headers:{'If-None-Match':'"'+this.version+'"'}});if(!result.unchanged){this.apply(result);this.status('Aggiornato dalle modifiche del gruppo · '+new Date(result.updatedAt).toLocaleTimeString('it-IT'))}}
    catch{this.status('Aggiornamento online non disponibile. Ultimi dati ricevuti visibili.',true)}
  }
  start(){this.interval=setInterval(()=>this.poll(),10000);this.visibility=()=>{if(!document.hidden)this.poll()};document.addEventListener('visibilitychange',this.visibility);window.addEventListener('online',()=>{this.schedule(0);this.poll()});window.addEventListener('beforeunload',event=>{if(this.pending.length||this.batch){event.preventDefault();event.returnValue=''}})}
}
