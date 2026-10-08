import {SECTIONS,Q,DIM_LABELS,defaultState,gateDefs,dimensionScores as modelDimensions,computeConcepts,validateImportedState} from './model.js';
import {FoundrySync} from './shared-sync.js';
import {API_BASE} from './shared-config.js';
import {renderInterpretation,renderDirections,renderResearch,renderSharedBrief} from './insights.js';
let sharing=null, research=null, currentVersion=0, focusedField=null;
let state=loadState(); let founderIndex=0; let sectionIndex=0;

function loadState(){try{const cached=JSON.parse(localStorage.getItem('trinityFoundry')||'null');return cached?validateImportedState(cached):structuredClone(defaultState)}catch{return structuredClone(defaultState)}}
function save(){state.concepts=computeConcepts(state);sharing?.enqueue(state,focusedField);try{localStorage.setItem('trinityFoundry',JSON.stringify(state))}catch{}enforceAccess()}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const comparableBases=new WeakMap();
function inputPath(el){
 if(el.matches('[data-f]'))return ['founders',+el.dataset.f,el.dataset.key];
 if(el.matches('[data-textq]'))return ['answers',founderIndex,el.dataset.textq];
 if(el.matches('[data-vote]'))return ['votes',el.dataset.vote,+el.dataset.vf];
 if(el.matches('[data-gate]'))return ['market',el.dataset.gate];
 if(el.matches('[data-ci]'))return ['comparables'];
 if(['mvpMonths','mvpBudget','teamHours','engine'].includes(el.id))return ['shared',el.id];
 return null;
}
function readField(data,path){let value=data;for(const key of path){if(value==null||!Object.hasOwn(value,key))return {exists:false};value=value[key]}return {exists:true,value:structuredClone(value)}}
function inputValue(el,path){
 if(path[0]==='comparables'){
  const rows=[];$$('[data-ci]').forEach(input=>{const index=+input.dataset.ci;rows[index]??={};rows[index][input.dataset.ck]=input.value});return rows;
 }
 return path[0]==='votes'||path[0]==='market'||(path[0]==='shared'&&path[1]!=='engine')?Number(el.value):el.value;
}
document.addEventListener('focusin',e=>{
 const el=e.target,path=el.matches('input,textarea,select')&&!el.disabled?inputPath(el):null;
 focusedField=path?{path,expected:readField(state,path)}:null;
 if(focusedField?.expected.exists)focusedField.expected.value=path[0]==='comparables'?structuredClone(comparableBases.get(el)||inputValue(el,path)):inputValue(el,path);
});
document.addEventListener('focusout',()=>{setTimeout(()=>{if(!document.activeElement?.matches('input,textarea,select')){focusedField=null;refreshVisible()}},0)});
function updateFocusedBaseline(envelope){
 if(!focusedField)return;const el=document.activeElement;
 if(!el?.matches('input,textarea,select'))return;
 const current=readField(envelope.data,focusedField.path);
 if(current.exists&&JSON.stringify(current.value)===JSON.stringify(inputValue(el,focusedField.path)))focusedField.expected=current;
}

const views=['home','founders','questionnaire','analysis','concepts','market','brief'];
function renderNav(){ $('#nav').innerHTML=views.map((v,i)=>`<button data-go="${v}" class="${i===0?'active':''}">${String(i).padStart(2,'0')} ${v==='home'?'Foundry':v[0].toUpperCase()+v.slice(1)}</button>`).join(''); }
function go(id){ $$('.view').forEach(v=>v.classList.toggle('active',v.id===id)); $$('[data-go]').forEach(b=>b.classList.toggle('active',b.dataset.go===id)); if(id==='founders')renderFounders(); if(id==='questionnaire')renderQuestionnaire(); if(id==='analysis')renderAnalysis(); if(id==='concepts')renderConcepts(); if(id==='market')renderMarket(); if(id==='brief')renderBrief(); enforceAccess(); window.scrollTo({top:0,behavior:'smooth'}); }

document.addEventListener('click',e=>{const b=e.target.closest('[data-go]'); if(b)go(b.dataset.go)});

function renderFounders(){
 $('#founderSetup').innerHTML=state.founders.map((f,i)=>`<div class="founder-card"><div class="founder-num">FOUNDER 0${i+1}</div><input data-f="${i}" data-key="name" value="${esc(f.name)}"><label>Role / strength<input data-f="${i}" data-key="role" value="${esc(f.role)}"></label><label>Notes<textarea data-f="${i}" data-key="notes">${esc(f.notes)}</textarea></label></div>`).join('');
 $('#mvpMonths').value=state.shared.mvpMonths;$('#mvpBudget').value=state.shared.mvpBudget;$('#teamHours').value=state.shared.teamHours;$('#engine').value=state.shared.engine;
 $$('[data-f]').forEach(el=>el.oninput=()=>{state.founders[+el.dataset.f][el.dataset.key]=el.value;save()});
 ['mvpMonths','mvpBudget','teamHours','engine'].forEach(id=>$('#'+id).onchange=()=>{
  const input=$('#'+id),value=id==='engine'?input.value:Number(input.value);
  if(id!=='engine'&&(!input.value.trim()||!Number.isFinite(value)||value<Number(input.min)||value>Number(input.max||Number.MAX_SAFE_INTEGER))){
   input.value=state.shared[id];sharing.status('Vincolo non valido. Il valore precedente è stato conservato.',true);return;
  }
  state.shared[id]=value;save();
 });
}

function renderQuestionnaire(){
 $('#founderTabs').innerHTML=state.founders.map((f,i)=>`<button class="${i===founderIndex?'active':''}" data-fi="${i}">${esc(f.name)}</button>`).join('');
 $$('[data-fi]').forEach(b=>b.onclick=()=>{founderIndex=+b.dataset.fi;renderQuestionnaire()});
 $('#sectionSelect').innerHTML=SECTIONS.map((s,i)=>`<option value="${i}" ${i===sectionIndex?'selected':''}>${String(i+1).padStart(2,'0')} · ${s.title}</option>`).join('');
 $('#sectionSelect').onchange=()=>{sectionIndex=+$('#sectionSelect').value;renderQuestionnaire()};
 const sec=SECTIONS[sectionIndex]; const qs=Q.filter(q=>q.section===sec.id);
 $('#questionList').innerHTML=`<div class="q-section-head"><div class="eyebrow">${String(sectionIndex+1).padStart(2,'0')} / ${SECTIONS.length}</div><h3>${sec.title}</h3><p>${sec.desc}</p></div>`+qs.map(q=>renderQ(q)).join('');
 bindQuestions(); updateProgress(); enforceAccess();
}
function renderQ(q){ const ans=state.answers[founderIndex][q.id]; if(q.type==='scale')return `<div class="question"><div class="qtext"><b>${esc(q.text)}</b><small>${esc(q.low)} ← 1–7 → ${esc(q.high)}</small></div><div><div class="scale">${[1,2,3,4,5,6,7].map(n=>`<button data-q="${q.id}" data-v="${n}" class="${+ans===n?'sel':''}">${n}</button>`).join('')}</div><div class="scale-labels"><span>${esc(q.low)}</span><span>${esc(q.high)}</span></div></div></div>`;
 if(q.type==='multi'){const arr=Array.isArray(ans)?ans:[];return `<div class="question"><div class="qtext"><b>${esc(q.text)}</b><small>Select all that genuinely excite you.</small></div><div class="chips">${q.options.map(o=>`<button class="chip ${arr.includes(o)?'sel':''}" data-q="${q.id}" data-opt="${escAttr(o)}">${esc(o)}</button>`).join('')}</div></div>`}
 return `<div class="question"><div class="qtext"><b>${esc(q.text)}</b><small>Free text — concrete examples are better than adjectives.</small></div><textarea data-textq="${q.id}" rows="4">${esc(ans||'')}</textarea></div>`;
}
function bindQuestions(){
 $$('[data-v]').forEach(b=>b.onclick=()=>{state.answers[founderIndex][b.dataset.q]=+b.dataset.v;save();renderQuestionnaire()});
 $$('[data-opt]').forEach(b=>b.onclick=()=>{let a=state.answers[founderIndex][b.dataset.q];if(!Array.isArray(a))a=[]; const o=b.dataset.opt;a=a.includes(o)?a.filter(x=>x!==o):[...a,o];state.answers[founderIndex][b.dataset.q]=a;save();renderQuestionnaire()});
 $$('[data-textq]').forEach(t=>t.oninput=()=>{state.answers[founderIndex][t.dataset.textq]=t.value;save();updateProgress()});
}
function updateProgress(){const answered=state.answers.reduce((n,a)=>n+Object.values(a).filter(v=>Array.isArray(v)?v.length:!!v).length,0); const total=Q.length*3; $('#progressBadge').textContent=Math.round(answered/total*100)+'%';}
$('#prevSection').onclick=()=>{sectionIndex=Math.max(0,sectionIndex-1);renderQuestionnaire()};$('#nextSection').onclick=()=>{sectionIndex=Math.min(SECTIONS.length-1,sectionIndex+1);renderQuestionnaire()};

function dimensionScores(){return modelDimensions(state)}
function renderAnalysis(){ $('#analysisSummary').innerHTML=renderInterpretation(state,research,currentVersion); const d=dimensionScores(); const entries=Object.entries(d); const high=entries.filter(([,x])=>x.mean>=5.2&&x.sd<=1).sort((a,b)=>b[1].mean-a[1].mean); const conflicts=entries.filter(([,x])=>x.sd>1.35).sort((a,b)=>b[1].sd-a[1].sd); const avgConsensus=entries.reduce((s,[,x])=>s+Math.max(0,100-x.sd/3*100),0)/entries.length; const discipline=((d.scopecontrol?.score??50)+(d.mvpdiscipline?.score??50)+(d.marketdiscipline?.score??50))/3; const campaign=((d.pitchability?.score??50)+(d.kickstarter?.score??50)+(d.stylized?.score??50))/3;
 $('#kpis').innerHTML=[['Consensus',avgConsensus],['Build discipline',discipline],['Campaign fit',campaign],['Hard conflicts',conflicts.length]].map(([l,v],i)=>`<div class="kpi"><strong>${i===3?Math.round(v):Math.round(v)+'%'}</strong><span>${l}</span></div>`).join('');
 $('#dnaBars').innerHTML=high.slice(0,14).map(([k,x])=>bar(DIM_LABELS[k]||k,x.score)).join('') || '<p class="muted">Not enough answers yet.</p>';
 $('#conflicts').innerHTML=conflicts.slice(0,12).map(([k,x])=>`<div class="conflict-item"><b>${DIM_LABELS[k]||k}</b><p>${state.founders.map((f,i)=>`${esc(f.name)} ${x.vals[i].toFixed(1)}`).join(' · ')} · divergence ${x.sd.toFixed(2)}</p></div>`).join('') || '<p class="muted">No strong conflicts detected.</p>';
 $('#dimensionMatrix').innerHTML=entries.sort((a,b)=>b[1].mean-a[1].mean).map(([k,x])=>{const c=x.sd<=.8?'consensus':x.sd<=1.35?'compromise':'conflict';return `<div class="matrix-cell ${c}"><b>${DIM_LABELS[k]||k}</b><small>${x.mean.toFixed(1)}/7 · σ ${x.sd.toFixed(2)}</small></div>`}).join('');
}
function bar(label,v){return `<div class="bar-row"><label>${esc(label)}</label><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,v))}%"></div></div><em>${Math.round(v)}</em></div>`}
$('#recalcBtn').onclick=renderAnalysis;

function forge(){state.concepts=computeConcepts(state);renderConcepts();enforceAccess()}
function renderConcepts(){state.concepts=computeConcepts(state);$('#directionOutput').innerHTML=renderDirections(state,research);$('#conceptGrid').innerHTML=state.concepts.map((c,i)=>`<div class="concept"><div class="num">CONCEPT ${String(i+1).padStart(2,'0')}</div><h3>${esc(c.name)}</h3><div class="hook">${esc(c.hook)}</div><div class="tags">${c.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="metric-row"><div class="metric"><b>${Math.round(c.fit)}</b><small>FOUNDER FIT</small></div><div class="metric"><b>${Math.round(c.feasibility)}</b><small>FEASIBILITY</small></div><div class="metric"><b>${Math.round(c.campaign)}</b><small>KICKSTARTER</small></div></div></div>`).join('');
 $('#voteTable').innerHTML=state.concepts.map(c=>`<div class="vote-row"><div><b>${esc(c.name)}</b><div class="muted">Current model score ${Math.round(c.final)}</div></div>${state.founders.map((f,i)=>`<select data-vote="${c.id}" data-vf="${i}">${[1,2,3,4,5].map(n=>`<option value="${n}" ${(state.votes[c.id]?.[i]||3)==n?'selected':''}>${esc(f.name)} · ${n}</option>`).join('')}</select>`).join('')}<div><b>${voteAvg(c.id).toFixed(1)}/5</b></div></div>`).join('');
 $$('[data-vote]').forEach(s=>s.onchange=()=>{state.votes[s.dataset.vote]=state.votes[s.dataset.vote]||[3,3,3];state.votes[s.dataset.vote][+s.dataset.vf]=+s.value;save();renderConcepts()});}
function voteAvg(id){const a=state.votes[id]||[3,3,3];return a.reduce((x,y)=>x+y,0)/3}$('#forgeBtn').onclick=forge;


function renderMarket(){ $('#researchOutput').innerHTML=renderResearch(state,research);
 $('#gateFields').innerHTML=gateDefs.map(([id,l,d])=>`<div class="gate-field"><div class="gline"><label>${l}</label><b id="gv-${id}">${state.market[id]??d}</b></div><input type="range" min="0" max="100" value="${state.market[id]??d}" data-gate="${id}"></div>`).join('');
 $$('[data-gate]').forEach(r=>r.oninput=()=>{state.market[r.dataset.gate]=+r.value;$('#gv-'+r.dataset.gate).textContent=r.value;save()});renderCompTable();renderKill();calcMarket();}
function calcMarket(){const known=gateDefs.every(([id])=>Number.isFinite(state.market[id]));$('#marketScore').textContent=known?Math.round(gateDefs.reduce((n,[id])=>n+state.market[id],0)/gateDefs.length):'—'}
$('#calcMarket').onclick=calcMarket;
function renderCompTable(){const tb=$('#compTable tbody');tb.innerHTML=state.comparables.map((c,i)=>`<tr><td><input data-ci="${i}" data-ck="title" value="${esc(c.title||'')}"></td><td><select data-ci="${i}" data-ck="type"><option ${c.type==='Steam'?'selected':''}>Steam</option><option ${c.type==='Kickstarter'?'selected':''}>Kickstarter</option><option ${c.type==='Adjacent'?'selected':''}>Adjacent</option></select></td><td><input data-ci="${i}" data-ck="price" value="${esc(c.price||'')}"></td><td><input data-ci="${i}" data-ck="signal" value="${esc(c.signal||'')}"></td><td><input data-ci="${i}" data-ck="evidence" value="${esc(c.evidence||'')}"></td><td><button class="ghost" data-delc="${i}">×</button></td></tr>`).join('');const base=structuredClone(state.comparables);$$('[data-ci]').forEach(x=>{comparableBases.set(x,base);x.onchange=()=>{if(!state.comparables[+x.dataset.ci]){sharing.status('La riga è stata rimossa altrove. Ricarica i dati prima di modificare.',true);return}state.comparables[+x.dataset.ci][x.dataset.ck]=x.value;save()}});$$('[data-delc]').forEach(b=>b.onclick=()=>{state.comparables.splice(+b.dataset.delc,1);save();renderCompTable()})}
$('#addComp').onclick=()=>{state.comparables.push({title:'',type:'Steam',price:'',signal:'',evidence:''});save();renderCompTable()};
function renderKill(){const kills=[['No audience signal','No cluster of comparable games/campaigns shows meaningful demand.'],['MVP cannot sell the fantasy','The minimum convincing demo requires content or infrastructure beyond current reach.'],['Hook needs a paragraph','If the differentiator cannot be understood in one sentence, campaign conversion is at risk.'],['Founder veto','A core pillar lands in strong conflict territory for at least one founder.'],['Acquisition impossible','There is no identifiable community/channel where likely backers already gather.'],['Economics fail','Realistic price/pledge levels cannot support the production plan.']];$('#killGrid').innerHTML=kills.map(([a,b])=>`<div class="kill"><b>${a}</b><p>${b}</p></div>`).join('')}

function renderBrief(){$('#briefOutput').innerHTML=renderSharedBrief(state,research,currentVersion)}
$('#buildBrief').onclick=renderBrief;

$('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='trinity-game-foundry-data.json';a.click();URL.revokeObjectURL(a.href)};

function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}function escAttr(s){return esc(s).replace(/`/g,'&#096;')}
renderNav();initSharing();

function enforceAccess(){
 const p=sharing?.principal, edit=!!p&&!sharing.blocked;
 $$('[data-f]').forEach(el=>el.disabled=!edit||+el.dataset.f!==p.founder);
 ['mvpMonths','mvpBudget','teamHours','engine'].forEach(id=>$('#'+id).disabled=!edit||!p.admin);
 $$('[data-v],[data-opt],[data-textq]').forEach(el=>el.disabled=!edit||founderIndex!==p.founder);
 $$('[data-vote]').forEach(el=>el.disabled=!edit||+el.dataset.vf!==p.founder);
 $$('[data-gate],#compTable input,#compTable select,#compTable button,#addComp,#calcMarket').forEach(el=>el.disabled=!edit||!p.admin);
 $('#accessLabel').textContent=p?state.founders[p.founder].name+' · modifica il tuo profilo':'Consultazione condivisa';
 $('#logoutBtn').hidden=!p;$('#loginPanel').hidden=!!p;
}
function refreshVisible(){
 const focused=document.activeElement;
 if(focused?.matches('input,textarea,select')&&!focused.disabled){enforceAccess();return}
 const id=$('.view.active')?.id;
 ({founders:renderFounders,questionnaire:renderQuestionnaire,analysis:renderAnalysis,concepts:renderConcepts,market:renderMarket,brief:renderBrief}[id])?.();
 enforceAccess();
}
async function initSharing(){
 sharing=new FoundrySync({base:API_BASE,onState:(data,envelope)=>{updateFocusedBaseline(envelope);state=data;currentVersion=envelope.version;refreshVisible()},onStatus:(text,error)=>{const el=$('#syncStatus');el.textContent=text;el.classList.toggle('error',error);enforceAccess()},onAccess:principal=>{if(principal)founderIndex=principal.founder;refreshVisible()}});
 $('#reloadBtn').onclick=()=>sharing.reload().catch(e=>sharing.status(e.message,true));
 $('#logoutBtn').onclick=()=>sharing.disconnect();
 $('#loginBtn').onclick=async()=>{try{await sharing.connect($('#editToken').value.trim());$('#editToken').value='';go('questionnaire')}catch(error){sharing.status(error.message,true)}};
 try{
  const response=await fetch('./market-research.json',{cache:'no-store'});if(response.ok)research=await response.json();
 }catch{}
 try{
  await sharing.load();
  const hash=new URLSearchParams(location.hash.slice(1));const token=hash.get('edit')||localStorage.getItem('trinityEditToken');
  if(hash.has('edit'))history.replaceState(null,'',location.pathname+location.search);
  if(token){try{await sharing.connect(token)}catch(error){sharing.status(error.message,true)}}
  go(hash.has('edit')?'questionnaire':'analysis');
 }catch(error){sharing.status('Dati condivisi non disponibili. Riprova con “Ricarica dati”. '+error.message,true);enforceAccess()}
 sharing.start();
}
