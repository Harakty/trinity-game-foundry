const SECTIONS = [
  {id:'northstar',title:'North Star',desc:'What kind of experience is worth spending years building?'},
  {id:'play',title:'Player Experience',desc:'What should the player feel minute-to-minute?'},
  {id:'structure',title:'Game Structure',desc:'Session length, persistence and replayability.'},
  {id:'combat',title:'Combat & Challenge',desc:'The shape and intensity of conflict.'},
  {id:'world',title:'World & Atmosphere',desc:'Tone, presentation and world model.'},
  {id:'systems',title:'Systems & Progression',desc:'How much simulation, progression and economy?'},
  {id:'social',title:'Multiplayer & Social',desc:'Co-op, PvP and player dependency.'},
  {id:'content',title:'Content Model',desc:'Handcrafted, procedural and player-generated content.'},
  {id:'scope',title:'Production Reality',desc:'What complexity can we tolerate in the first product?'},
  {id:'business',title:'Business & Kickstarter',desc:'Commercial shape and campaign suitability.'},
  {id:'redlines',title:'Red Lines',desc:'What would make you hate building or playing it?'},
  {id:'anchors',title:'Game Anchors',desc:'Named references, fantasies and non-negotiables.'}
];

const Q = [];
const add=(section,text,dim,low='Not important',high='Essential',weight=1)=>Q.push({id:'q'+(Q.length+1),section,text,dim,low,high,weight,type:'scale'});
const multi=(section,text,options,dim=null)=>Q.push({id:'q'+(Q.length+1),section,text,options,dim,type:'multi'});
const textq=(section,text)=>Q.push({id:'q'+(Q.length+1),section,text,type:'text'});

// 84 scored preference questions + anchors.
add('northstar','I want the game to create memorable stories players tell each other.','emergence');
add('northstar','The game needs a strong authored story.','narrative');
add('northstar','Mastery should matter more than pure time investment.','skill');
add('northstar','Long-term character growth should be central.','progression');
add('northstar','I want players to discover systems rather than be heavily guided.','systems');
add('northstar','The game should be immediately understandable in a trailer.','pitchability');
add('northstar','A distinctive visual identity is more important than photorealism.','stylized');
add('northstar','I care about a strong fantasy/power fantasy more than realism.','fantasy');

add('play','Exploration should be one of the main reasons to play.','exploration');
add('play','Combat should dominate the minute-to-minute experience.','combat');
add('play','Planning and preparation should matter before action begins.','strategy');
add('play','Resource pressure and survival tension should be frequent.','survival');
add('play','Players should regularly make meaningful risk/reward decisions.','risk');
add('play','The game should encourage experimentation with builds or tools.','buildcraft');
add('play','Moment-to-moment controls should feel precise and expressive.','skill');
add('play','Downtime and atmosphere are valuable, not wasted time.','atmosphere');

add('structure','I prefer persistent progression across many sessions.','persistence');
add('structure','A run-based / roguelite structure appeals to me.','roguelite');
add('structure','The game should work well in 30–60 minute sessions.','shortsession');
add('structure','I am happy with sessions lasting multiple hours.','longsession');
add('structure','High replayability matters more than a 30-hour authored campaign.','replayability');
add('structure','Failure should have meaningful consequences.','stakes');
add('structure','Permadeath or partial loss can make the game better.','stakes');
add('structure','I want a clear endgame beyond finishing the main content.','endgame');

add('combat','Real-time action combat is attractive.','action');
add('combat','Tactical or turn-based combat is attractive.','tactical');
add('combat','Boss fights should be major showcase moments.','bosses');
add('combat','Enemy AI quality is critical to the identity of the game.','ai');
add('combat','PvP combat would improve the experience.','pvp');
add('combat','PvE should remain satisfying even without human opponents.','pve');
add('combat','High mechanical difficulty is desirable.','hardcore');
add('combat','Build knowledge should matter almost as much as reflexes.','buildcraft');

add('world','Dark, dangerous or mysterious worlds appeal to me.','dark');
add('world','Humour and lightness should have a meaningful place.','humour');
add('world','A seamless/open world is worth the production cost.','openworld');
add('world','A hub + missions structure is perfectly acceptable.','hub');
add('world','Environmental storytelling should reward attention.','narrative');
add('world','The world should react visibly to player decisions.','simulation');
add('world','Stylized art is acceptable if it creates a strong identity.','stylized');
add('world','High-end graphics are important for our commercial positioning.','graphics');

add('systems','Deep character progression is important.','progression');
add('systems','Loot should be a major source of excitement.','loot');
add('systems','Crafting should be a meaningful system, not decoration.','crafting');
add('systems','Base building would improve the game.','building');
add('systems','Trading/economy systems are attractive.','economy');
add('systems','Simulation depth is worth additional complexity.','simulation');
add('systems','Players should be able to create very different viable builds.','buildcraft');
add('systems','The game should expose enough information for theorycrafting.','systems');

add('social','I strongly want cooperative play.','coop');
add('social','The game should still be worthwhile solo.','solo');
add('social','Competitive PvP should be an important pillar.','pvp');
add('social','PvPvE / extraction-style tension is attractive.','pvpve');
add('social','A small fixed party (2–4 players) is an ideal social unit.','smallparty');
add('social','Large-scale multiplayer is worth the technical risk.','massive');
add('social','Players should benefit from complementary roles/classes.','roles');
add('social','Social systems should create reasons to return even without new content.','social');

add('content','Procedural generation is attractive for replayability.','procedural');
add('content','Handcrafted levels are worth the higher content cost.','handcrafted');
add('content','Randomized encounters/loot tables should create variation.','procedural');
add('content','User-generated content or modding would add major value.','ugc');
add('content','A small number of deep systems is better than many shallow features.','focus');
add('content','I prefer systemic interaction over scripted spectacle.','systems');
add('content','A strong narrative campaign can justify lower replayability.','narrative');
add('content','Seasonal/live content is attractive after launch.','liveops');

add('scope','I am comfortable shipping a visually modest MVP if the core loop is strong.','mvpdiscipline');
add('scope','We should avoid features requiring dedicated servers in the MVP.','scopecontrol');
add('scope','We should avoid large seamless worlds in our first project.','scopecontrol');
add('scope','We should design around reusable/procedural content wherever possible.','scopecontrol');
add('scope','Buying asset packs is acceptable if the final identity remains coherent.','scopecontrol');
add('scope','AI-assisted production is acceptable for prototyping and internal work.','scopecontrol');
add('scope','The MVP should prove one exceptional encounter/loop rather than breadth.','mvpdiscipline');
add('scope','I am willing to cut favourite features to protect schedule.','mvpdiscipline');

add('business','A premium one-time purchase is attractive.','premium');
add('business','Early Access is acceptable.','earlyaccess');
add('business','Kickstarter should finance expansion after a playable proof exists.','kickstarter');
add('business','The concept must be visually understandable within the first 10 seconds of a campaign video.','pitchability');
add('business','Physical rewards / collector tiers could fit the project.','kickstarter');
add('business','A niche but passionate audience is acceptable over broad appeal.','niche');
add('business','We should optimize for wishlists/community before maximizing feature count.','marketdiscipline');
add('business','We should kill the project if market evidence is weak even if we love it.','marketdiscipline');

add('redlines','Heavy grind would reduce my enthusiasm.','antigrind','No problem','Deal breaker');
add('redlines','Pay-to-win or aggressive monetization is unacceptable.','antip2w','No problem','Deal breaker');
add('redlines','A mandatory live-service treadmill would reduce my enthusiasm.','antilive','No problem','Deal breaker');
add('redlines','A project dependent on huge amounts of bespoke art content scares me.','scopecontrol');
add('redlines','A project dependent on complex networking scares me.','scopecontrol');
add('redlines','A game that is mostly dialogue/story with little systemic play would lose me.','systems');
add('redlines','A game with no meaningful progression would lose me.','progression');
add('redlines','A game with no replay value would lose me.','replayability');

multi('anchors','Pick the fantasies that excite you most.',['Becoming stronger','Surviving against odds','Exploring the unknown','Building something','Outsmarting opponents','Mastering a class/build','Leading a group','Uncovering mysteries','Collecting rare things','Changing a world']);
multi('anchors','Pick worlds you would enjoy inhabiting for years.',['Dark fantasy','High fantasy','Science fiction','Post-apocalypse','Historical','Occult / weird','Cyberpunk','Modern supernatural','Mythic','Stylized original']);
multi('anchors','Pick the strongest commercial hooks.',['Co-op adventure','Extraction','Roguelite','Survival crafting','Tactical RPG','Action RPG','Management/strategy','Narrative mystery','Boss-rush','Sandbox']);
textq('anchors','Name up to five games you love and what each one does exceptionally well.');
textq('anchors','Name games you enjoy playing but would never want to build. Why?');
textq('anchors','Describe one dream player moment you would love to see in a trailer.');
textq('anchors','What feature would you fight hardest to keep if scope had to be cut?');
textq('anchors','What feature category do you personally dislike enough to veto?');

const DIM_LABELS={emergence:'Emergent stories',narrative:'Narrative',skill:'Mechanical mastery',progression:'Progression',systems:'Systems depth',pitchability:'Trailer clarity',stylized:'Stylized identity',fantasy:'Power fantasy',exploration:'Exploration',combat:'Combat focus',strategy:'Planning',survival:'Survival pressure',risk:'Risk / reward',buildcraft:'Buildcraft',atmosphere:'Atmosphere',persistence:'Persistence',roguelite:'Run structure',shortsession:'Short sessions',longsession:'Long sessions',replayability:'Replayability',stakes:'Meaningful loss',endgame:'Endgame',action:'Action combat',tactical:'Tactical combat',bosses:'Boss focus',ai:'Enemy AI',pvp:'PvP',pve:'PvE',hardcore:'Difficulty',dark:'Dark tone',humour:'Humour',openworld:'Open world',hub:'Hub + missions',simulation:'Simulation',graphics:'High-end visuals',loot:'Loot',crafting:'Crafting',building:'Base building',economy:'Economy',coop:'Co-op',solo:'Solo viability',pvpve:'PvPvE',smallparty:'2–4 player party',massive:'Large-scale MP',roles:'Roles/classes',social:'Social retention',procedural:'Procedural content',handcrafted:'Handcrafted content',ugc:'UGC/modding',focus:'Feature focus',liveops:'Live ops',mvpdiscipline:'MVP discipline',scopecontrol:'Scope control',premium:'Premium model',earlyaccess:'Early Access',kickstarter:'Kickstarter fit',niche:'Niche focus',marketdiscipline:'Market discipline',antigrind:'Anti-grind',antip2w:'Anti-P2W',antilive:'Anti-live-service'};

const defaultState={founders:[{name:'Founder 1',role:'Vision / Product',notes:''},{name:'Founder 2',role:'Design / Tech',notes:''},{name:'Founder 3',role:'Art / Community',notes:''}],answers:[{}, {}, {}],shared:{mvpMonths:6,mvpBudget:15000,teamHours:60,engine:'Unreal Engine 5'},concepts:[],votes:{},market:{},comparables:[]};
let state=loadState(); let founderIndex=0; let sectionIndex=0;

function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem('trinityFoundry')||'{}')}}catch{return structuredClone(defaultState)}}
function save(){localStorage.setItem('trinityFoundry',JSON.stringify(state))}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const views=['home','founders','questionnaire','analysis','concepts','market','brief'];
function renderNav(){ $('#nav').innerHTML=views.map((v,i)=>`<button data-go="${v}" class="${i===0?'active':''}">${String(i).padStart(2,'0')} ${v==='home'?'Foundry':v[0].toUpperCase()+v.slice(1)}</button>`).join(''); }
function go(id){ $$('.view').forEach(v=>v.classList.toggle('active',v.id===id)); $$('[data-go]').forEach(b=>b.classList.toggle('active',b.dataset.go===id)); if(id==='founders')renderFounders(); if(id==='questionnaire')renderQuestionnaire(); if(id==='analysis')renderAnalysis(); if(id==='concepts')renderConcepts(); if(id==='market')renderMarket(); if(id==='brief')renderBrief(); window.scrollTo({top:0,behavior:'smooth'}); }

document.addEventListener('click',e=>{const b=e.target.closest('[data-go]'); if(b)go(b.dataset.go)});

function renderFounders(){
 $('#founderSetup').innerHTML=state.founders.map((f,i)=>`<div class="founder-card"><div class="founder-num">FOUNDER 0${i+1}</div><input data-f="${i}" data-key="name" value="${esc(f.name)}"><label>Role / strength<input data-f="${i}" data-key="role" value="${esc(f.role)}"></label><label>Notes<textarea data-f="${i}" data-key="notes">${esc(f.notes)}</textarea></label></div>`).join('');
 $('#mvpMonths').value=state.shared.mvpMonths;$('#mvpBudget').value=state.shared.mvpBudget;$('#teamHours').value=state.shared.teamHours;$('#engine').value=state.shared.engine;
 $$('[data-f]').forEach(el=>el.oninput=()=>{state.founders[+el.dataset.f][el.dataset.key]=el.value;save()});
 ['mvpMonths','mvpBudget','teamHours','engine'].forEach(id=>$('#'+id).onchange=()=>{
  const input=$('#'+id),value=id==='engine'?input.value:Number(input.value);
  if(id!=='engine'&&(!input.value.trim()||!Number.isFinite(value)||value<Number(input.min)||value>Number(input.max||Number.MAX_SAFE_INTEGER))){
   input.value=state.shared[id];importMessage('Invalid shared constraint. The previous saved value was kept.',true);return;
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
 bindQuestions(); updateProgress();
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

function dimensionScores(){
 const dims={}; Q.filter(q=>q.type==='scale'&&q.dim).forEach(q=>{if(!dims[q.dim])dims[q.dim]=[[],[],[]]; for(let f=0;f<3;f++){const v=+state.answers[f][q.id];if(v)dims[q.dim][f].push(v)}});
 const out={};Object.entries(dims).forEach(([d,byF])=>{const vals=byF.map(a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:4);const mean=vals.reduce((a,b)=>a+b,0)/3;const variance=vals.reduce((s,v)=>s+(v-mean)**2,0)/3;out[d]={vals,mean,sd:Math.sqrt(variance),score:(mean-1)/6*100}});return out;
}
function renderAnalysis(){ const d=dimensionScores(); const entries=Object.entries(d); const high=entries.filter(([,x])=>x.mean>=5.2&&x.sd<=1).sort((a,b)=>b[1].mean-a[1].mean); const conflicts=entries.filter(([,x])=>x.sd>1.35).sort((a,b)=>b[1].sd-a[1].sd); const avgConsensus=entries.reduce((s,[,x])=>s+Math.max(0,100-x.sd/3*100),0)/entries.length; const discipline=((d.scopecontrol?.score??50)+(d.mvpdiscipline?.score??50)+(d.marketdiscipline?.score??50))/3; const campaign=((d.pitchability?.score??50)+(d.kickstarter?.score??50)+(d.stylized?.score??50))/3;
 $('#kpis').innerHTML=[['Consensus',avgConsensus],['Build discipline',discipline],['Campaign fit',campaign],['Hard conflicts',conflicts.length]].map(([l,v],i)=>`<div class="kpi"><strong>${i===3?Math.round(v):Math.round(v)+'%'}</strong><span>${l}</span></div>`).join('');
 $('#dnaBars').innerHTML=high.slice(0,14).map(([k,x])=>bar(DIM_LABELS[k]||k,x.score)).join('') || '<p class="muted">Not enough answers yet.</p>';
 $('#conflicts').innerHTML=conflicts.slice(0,12).map(([k,x])=>`<div class="conflict-item"><b>${DIM_LABELS[k]||k}</b><p>${state.founders.map((f,i)=>`${esc(f.name)} ${x.vals[i].toFixed(1)}`).join(' · ')} · divergence ${x.sd.toFixed(2)}</p></div>`).join('') || '<p class="muted">No strong conflicts detected.</p>';
 $('#dimensionMatrix').innerHTML=entries.sort((a,b)=>b[1].mean-a[1].mean).map(([k,x])=>{const c=x.sd<=.8?'consensus':x.sd<=1.35?'compromise':'conflict';return `<div class="matrix-cell ${c}"><b>${DIM_LABELS[k]||k}</b><small>${x.mean.toFixed(1)}/7 · σ ${x.sd.toFixed(2)}</small></div>`}).join('');
}
function bar(label,v){return `<div class="bar-row"><label>${esc(label)}</label><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,v))}%"></div></div><em>${Math.round(v)}</em></div>`}
$('#recalcBtn').onclick=renderAnalysis;

const conceptTemplates=[
 {name:'BLACK TIDE',needs:['coop','exploration','dark','risk','progression'],avoid:['massive'],hook:'A 1–4 player occult expedition game where every journey trades safety for forbidden discoveries, and extraction changes the next voyage.',tags:['Co-op','Expedition','Occult','Persistent progression'],scope:78,kick:88},
 {name:'ASHEN COMPANY',needs:['smallparty','combat','roles','pve','progression'],avoid:['openworld'],hook:'A compact co-op mercenary action RPG built around dangerous contracts, complementary classes and a persistent company between missions.',tags:['Co-op ARPG','Contracts','Classes','Hub-based'],scope:84,kick:82},
 {name:'NULL FRONTIER',needs:['exploration','survival','procedural','systems','pve'],avoid:['narrative'],hook:'A systemic sci-fi survival expedition where unstable zones are regenerated, mapped and harvested before they collapse.',tags:['Sci-fi','Survival','Procedural','Exploration'],scope:74,kick:79},
 {name:'THE LAST COVENANT',needs:['narrative','dark','tactical','roles','replayability'],avoid:['action'],hook:'A tactical occult RPG where a small order investigates impossible events and every mission permanently reshapes the roster.',tags:['Tactical RPG','Occult','Roster','Consequences'],scope:86,kick:84},
 {name:'IRON VEIL',needs:['pvpve','risk','combat','loot','smallparty'],avoid:['solo'],hook:'A 3-player extraction action game where rival teams raid shifting strongholds for relics that alter future loadouts.',tags:['PvPvE','Extraction','3-player','Relics'],scope:63,kick:90},
 {name:'DEEPWARD',needs:['building','crafting','survival','coop','systems'],avoid:['shortsession'],hook:'A small-team survival builder about establishing a defensible outpost in a hostile underworld whose ecology learns from you.',tags:['Survival','Base building','Co-op','Adaptive world'],scope:59,kick:77},
 {name:'THREEFOLD',needs:['roguelite','buildcraft','bosses','replayability','shortsession'],avoid:['openworld'],hook:'A highly replayable action roguelite where three interlocking disciplines combine into radically different builds each run.',tags:['Roguelite','Buildcraft','Bosses','Runs'],scope:92,kick:76},
 {name:'GHOST SIGNAL',needs:['atmosphere','exploration','narrative','coop','pitchability'],avoid:['massive'],hook:'A two-to-four player anomalous investigation game where interpreting signals and surviving what answers are equally important.',tags:['Co-op mystery','Anomalies','Exploration','Atmosphere'],scope:88,kick:86}
];
function conceptBuildScores(c,d){return {feasibility:Math.max(25,Math.min(100,c.scope+((d.scopecontrol?.score??50)-50)*.2)),campaign:Math.max(25,Math.min(100,c.kick+((d.pitchability?.score??50)-50)*.18))}}
function finalConceptScore(fit,feasibility,campaign){return fit*.5+feasibility*.25+campaign*.25}
// Repair affected cached/exported concept scores when opened, retaining votes and text.
function refreshZeroConceptScores(){
 const d=dimensionScores();if(d.scopecontrol?.score!==0&&d.pitchability?.score!==0)return;
 let changed=false;
 state.concepts.forEach(c=>{
  const corrected=conceptBuildScores(c,d),feasibility=d.scopecontrol?.score===0?corrected.feasibility:c.feasibility,campaign=d.pitchability?.score===0?corrected.campaign:c.campaign;
  if(feasibility!==c.feasibility||campaign!==c.campaign){Object.assign(c,{feasibility,campaign,final:finalConceptScore(c.fit,feasibility,campaign)});changed=true}
 });
 if(changed)save();
}
function forge(){const d=dimensionScores();state.concepts=conceptTemplates.map((c,i)=>{let total=0,n=0;c.needs.forEach(k=>{total+=(d[k]?.score??50);n++});c.avoid.forEach(k=>{total+=100-(d[k]?.score??50);n++});const fit=total/n;const {feasibility,campaign}=conceptBuildScores(c,d);return {...c,id:'c'+i,fit,feasibility,campaign,final:finalConceptScore(fit,feasibility,campaign)}}).sort((a,b)=>b.final-a.final);save();renderConcepts()}
function renderConcepts(){if(!state.concepts?.length)forge();refreshZeroConceptScores();$('#conceptGrid').innerHTML=state.concepts.map((c,i)=>`<div class="concept"><div class="num">CONCEPT ${String(i+1).padStart(2,'0')}</div><h3>${esc(c.name)}</h3><div class="hook">${esc(c.hook)}</div><div class="tags">${c.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="metric-row"><div class="metric"><b>${Math.round(c.fit)}</b><small>FOUNDER FIT</small></div><div class="metric"><b>${Math.round(c.feasibility)}</b><small>FEASIBILITY</small></div><div class="metric"><b>${Math.round(c.campaign)}</b><small>KICKSTARTER</small></div></div></div>`).join('');
 $('#voteTable').innerHTML=state.concepts.map(c=>`<div class="vote-row"><div><b>${esc(c.name)}</b><div class="muted">Current model score ${Math.round(c.final)}</div></div>${state.founders.map((f,i)=>`<select data-vote="${c.id}" data-vf="${i}">${[1,2,3,4,5].map(n=>`<option value="${n}" ${(state.votes[c.id]?.[i]||3)==n?'selected':''}>${esc(f.name)} · ${n}</option>`).join('')}</select>`).join('')}<div><b>${voteAvg(c.id).toFixed(1)}/5</b></div></div>`).join('');
 $$('[data-vote]').forEach(s=>s.onchange=()=>{state.votes[s.dataset.vote]=state.votes[s.dataset.vote]||[3,3,3];state.votes[s.dataset.vote][+s.dataset.vf]=+s.value;save();renderConcepts()});}
function voteAvg(id){const a=state.votes[id]||[3,3,3];return a.reduce((x,y)=>x+y,0)/3}$('#forgeBtn').onclick=forge;

const gateDefs=[['demand','Demand evidence',55],['competition','Healthy competition',50],['differentiation','Differentiation strength',50],['kickfit','Kickstarter legibility',60],['community','Reachable community',45],['scope','MVP credibility',65],['economics','Price / pledge economics',50],['timing','Market timing',50]];
function renderMarket(){
 $('#gateFields').innerHTML=gateDefs.map(([id,l,d])=>`<div class="gate-field"><div class="gline"><label>${l}</label><b id="gv-${id}">${state.market[id]??d}</b></div><input type="range" min="0" max="100" value="${state.market[id]??d}" data-gate="${id}"></div>`).join('');
 $$('[data-gate]').forEach(r=>r.oninput=()=>{state.market[r.dataset.gate]=+r.value;$('#gv-'+r.dataset.gate).textContent=r.value;save()});renderCompTable();renderKill();calcMarket();}
function calcMarket(){const vals=gateDefs.map(([id,,d])=>state.market[id]??d);const score=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);$('#marketScore').textContent=score; state.market.score=score;save()}
$('#calcMarket').onclick=calcMarket;
function renderCompTable(){const tb=$('#compTable tbody');tb.innerHTML=state.comparables.map((c,i)=>`<tr><td><input data-ci="${i}" data-ck="title" value="${esc(c.title||'')}"></td><td><select data-ci="${i}" data-ck="type"><option ${c.type==='Steam'?'selected':''}>Steam</option><option ${c.type==='Kickstarter'?'selected':''}>Kickstarter</option><option ${c.type==='Adjacent'?'selected':''}>Adjacent</option></select></td><td><input data-ci="${i}" data-ck="price" value="${esc(c.price||'')}"></td><td><input data-ci="${i}" data-ck="signal" value="${esc(c.signal||'')}"></td><td><input data-ci="${i}" data-ck="evidence" value="${esc(c.evidence||'')}"></td><td><button class="ghost" data-delc="${i}">×</button></td></tr>`).join('');$$('[data-ci]').forEach(x=>x.onchange=()=>{state.comparables[+x.dataset.ci][x.dataset.ck]=x.value;save()});$$('[data-delc]').forEach(b=>b.onclick=()=>{state.comparables.splice(+b.dataset.delc,1);save();renderCompTable()})}
$('#addComp').onclick=()=>{state.comparables.push({title:'',type:'Steam',price:'',signal:'',evidence:''});save();renderCompTable()};
function renderKill(){const kills=[['No audience signal','No cluster of comparable games/campaigns shows meaningful demand.'],['MVP cannot sell the fantasy','The minimum convincing demo requires content or infrastructure beyond current reach.'],['Hook needs a paragraph','If the differentiator cannot be understood in one sentence, campaign conversion is at risk.'],['Founder veto','A core pillar lands in strong conflict territory for at least one founder.'],['Acquisition impossible','There is no identifiable community/channel where likely backers already gather.'],['Economics fail','Realistic price/pledge levels cannot support the production plan.']];$('#killGrid').innerHTML=kills.map(([a,b])=>`<div class="kill"><b>${a}</b><p>${b}</p></div>`).join('')}

function renderBrief(){refreshZeroConceptScores();const best=(state.concepts||[]).slice().sort((a,b)=>(b.final+voteAvg(b.id)*8)-(a.final+voteAvg(a.id)*8))[0]; if(!best){$('#briefOutput').innerHTML='<div class="brief-card">Generate concepts first.</div>';return} const d=dimensionScores();const tops=Object.entries(d).sort((a,b)=>b[1].mean-a[1].mean).slice(0,7).map(([k])=>DIM_LABELS[k]||k);$('#briefOutput').innerHTML=`<div class="brief-card"><div class="eyebrow">CURRENT LEAD</div><h3>${esc(best.name)}</h3><p><strong>One-line promise:</strong> ${esc(best.hook)}</p><p><strong>Why it fits Trinity:</strong> ${tops.join(', ')}.</p></div><div class="brief-card"><h3>MVP thesis</h3><ul><li>Prove one complete core loop from preparation → play → consequence.</li><li>One highly polished environment or mission family, not a wide content set.</li><li>Enough progression to demonstrate why a second session is better than the first.</li><li>One standout visual or systemic moment designed specifically for the campaign trailer.</li><li>Instrument the build to capture completion, replay, fail points and session length.</li></ul></div><div class="brief-card"><h3>Kickstarter gate</h3><p>Do not launch the campaign until the playable build can make a stranger understand the fantasy without a founder explaining it. Current manual Market Gate score: <strong>${esc(state.market.score??'not scored')}</strong>.</p></div><div class="brief-card"><h3>Prototype constraints</h3><p><strong>${esc(state.shared.mvpMonths)} months</strong> · <strong>€${Number(state.shared.mvpBudget||0).toLocaleString()}</strong> pre-crowdfunding cash · <strong>${esc(state.shared.teamHours)} team hours/week</strong> · ${esc(state.shared.engine)}.</p></div>`}
$('#buildBrief').onclick=renderBrief;

$('#demoBtn').onclick=()=>{state.answers=Q.reduce((acc,q,idx)=>{for(let f=0;f<3;f++){if(q.type==='scale'){const base=4+((idx+f*2)%4);acc[f][q.id]=Math.min(7,base)}else if(q.type==='multi'){acc[f][q.id]=q.options.slice(f, f+4)}else{acc[f][q.id]='Example founder note for '+q.text.toLowerCase()}}return acc},[{}, {}, {}]);state.founders=[{name:'Ottaviano',role:'Vision / Product',notes:''},{name:'Founder B',role:'Design / Systems',notes:''},{name:'Founder C',role:'Tech / Art',notes:''}];save();go('analysis')};
$('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='trinity-game-foundry-data.json';a.click();URL.revokeObjectURL(a.href)};

// Keep the v0.1 export shape. Import validates every field before touching storage.
function validateImportedState(data){
 const fail=message=>{throw new Error('Incompatible Trinity JSON: '+message)};
 const record=(value,keys,label,required=keys)=>{
  if(!value||typeof value!=='object'||Array.isArray(value))fail(label+' must be an object.');
  if(Object.keys(value).some(key=>!keys.includes(key))||required.some(key=>!Object.hasOwn(value,key)))fail(label+' has missing or unsupported fields.');
 };
 const string=(value,label)=>{if(typeof value!=='string'||value.length>100000)fail(label+' must be text (up to 100,000 characters).')};
 const number=(value,min,max,label,integer=false)=>{if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max||(integer&&!Number.isInteger(value)))fail(label+' is outside the allowed range.')};
 const array=(value,max,label)=>{if(!Array.isArray(value)||value.length>max)fail(label+' must be a compatible array.')};
 const strings=(value,allowed,label)=>{array(value,allowed.length,label);if(new Set(value).size!==value.length||value.some(item=>!allowed.includes(item)))fail(label+' contains unsupported or duplicate values.')};
 record(data,Object.keys(defaultState),'State');
 array(data.founders,3,'Founders');array(data.answers,3,'Answers');
 if(data.founders.length!==3||data.answers.length!==3)fail('Exactly three founders and answer sets are required.');
 data.founders.forEach((founder,i)=>{record(founder,['name','role','notes'],'Founder '+(i+1));Object.entries(founder).forEach(([key,value])=>string(value,'Founder '+key))});
 const questionIds=Q.map(q=>q.id);
 data.answers.forEach(answers=>{record(answers,questionIds,'Answers',[]);Object.entries(answers).forEach(([id,value])=>{const question=Q.find(q=>q.id===id);if(question.type==='scale')number(value,1,7,id,true);else if(question.type==='multi')strings(value,question.options,id);else string(value,id)})});
 record(data.shared,['mvpMonths','mvpBudget','teamHours','engine'],'Shared constraints');
 number(data.shared.mvpMonths,1,36,'MVP months');number(data.shared.mvpBudget,0,Number.MAX_SAFE_INTEGER,'Budget');number(data.shared.teamHours,1,240,'Team hours');
 if(!['Unreal Engine 5','Unity','Godot','Undecided'].includes(data.shared.engine))fail('Unsupported engine.');
 array(data.concepts,conceptTemplates.length,'Concepts');
 const conceptIds=conceptTemplates.map((_,i)=>'c'+i),seen=new Set();
 data.concepts.forEach(concept=>{
  record(concept,['name','needs','avoid','hook','tags','scope','kick','id','fit','feasibility','campaign','final'],'Concept');
  if(!conceptIds.includes(concept.id)||seen.has(concept.id))fail('Unsupported or duplicate concept ID.');seen.add(concept.id);
  string(concept.name,'Concept name');string(concept.hook,'Concept hook');
  strings(concept.needs,Object.keys(DIM_LABELS),'Concept needs');strings(concept.avoid,Object.keys(DIM_LABELS),'Concept avoid');
  array(concept.tags,30,'Concept tags');concept.tags.forEach(tag=>string(tag,'Concept tag'));
  ['scope','kick','fit','feasibility','campaign','final'].forEach(key=>number(concept[key],0,100,'Concept '+key));
 });
 record(data.votes,conceptIds,'Votes',[]);Object.values(data.votes).forEach(votes=>{array(votes,3,'Votes');if(votes.length!==3)fail('Each vote needs three founder scores.');votes.forEach(vote=>number(vote,1,5,'Vote',true))});
 record(data.market,[...gateDefs.map(([id])=>id),'score'],'Market',[]);Object.values(data.market).forEach(value=>number(value,0,100,'Market score'));
 array(data.comparables,1000,'Comparables');data.comparables.forEach(comparable=>{record(comparable,['title','type','price','signal','evidence'],'Comparable');Object.values(comparable).forEach(value=>string(value,'Comparable field'));if(!['Steam','Kickstarter','Adjacent'].includes(comparable.type))fail('Unsupported comparable type.')});
 return data;
}
function importMessage(message,error=false){const status=$('#importStatus');status.textContent=message;status.classList.toggle('error',error);status.hidden=false}
$('#importBtn').onclick=()=>{$('#importFile').value='';$('#importFile').click()};
$('#importFile').onchange=async()=>{
 const file=$('#importFile').files[0];if(!file)return;
 const button=$('#importBtn');button.disabled=true;
 try{
  if(!/\.json$/i.test(file.name))throw new Error('Choose a .json file exported by Trinity Game Foundry.');
  if(file.size>5*1024*1024)throw new Error('The JSON file is too large (maximum 5 MB).');
  let imported;try{imported=JSON.parse(await file.text())}catch{throw new Error('The file is not valid JSON. Your current data was kept.')}
  validateImportedState(imported);
  if(!window.confirm('Import this JSON and replace all Trinity Game Foundry data in this browser? Export your current data first if you need a backup.')){importMessage('Import cancelled. Your current data was kept.');return}
  // Persist first: a failed storage write must leave the in-memory state intact.
  try{localStorage.setItem('trinityFoundry',JSON.stringify(imported))}catch{throw new Error('Unable to save the import in this browser. Your current data was kept.')}
  state=imported;founderIndex=0;sectionIndex=0;
  renderFounders();go($('.view.active').id); // Other views render fresh when opened.
  importMessage('JSON imported successfully. Data saved in this browser.');
 }catch(error){importMessage(error.message,true)}finally{button.disabled=false;$('#importFile').value=''}
};

function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}function escAttr(s){return esc(s).replace(/`/g,'&#096;')}
renderNav();renderFounders();
