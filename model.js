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

const gateDefs=[['demand','Demand evidence',55],['competition','Healthy competition',50],['differentiation','Differentiation strength',50],['kickfit','Kickstarter legibility',60],['community','Reachable community',45],['scope','MVP credibility',65],['economics','Price / pledge economics',50],['timing','Market timing',50]];
function dimensionScores(state){
 const dims={}; Q.filter(q=>q.type==='scale'&&q.dim).forEach(q=>{if(!dims[q.dim])dims[q.dim]=[[],[],[]]; for(let f=0;f<3;f++){const v=+state.answers[f][q.id];if(v)dims[q.dim][f].push(v)}});
 const out={};Object.entries(dims).forEach(([d,byF])=>{const vals=byF.map(a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:4);const mean=vals.reduce((a,b)=>a+b,0)/3;const variance=vals.reduce((s,v)=>s+(v-mean)**2,0)/3;out[d]={vals,mean,sd:Math.sqrt(variance),score:(mean-1)/6*100}});return out;
}

function conceptBuildScores(c,d){return {feasibility:Math.max(25,Math.min(100,c.scope+((d.scopecontrol?.score??50)-50)*.2)),campaign:Math.max(25,Math.min(100,c.kick+((d.pitchability?.score??50)-50)*.18))}}
function finalConceptScore(fit,feasibility,campaign){return fit*.5+feasibility*.25+campaign*.25}

function computeConcepts(state){const d=dimensionScores(state);return conceptTemplates.map((c,i)=>{let total=0,n=0;c.needs.forEach(k=>{total+=(d[k]?.score??50);n++});c.avoid.forEach(k=>{total+=100-(d[k]?.score??50);n++});const fit=total/n;const {feasibility,campaign}=conceptBuildScores(c,d);return {...c,id:'c'+i,fit,feasibility,campaign,final:finalConceptScore(fit,feasibility,campaign)}}).sort((a,b)=>b.final-a.final);}

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

export {SECTIONS,Q,DIM_LABELS,defaultState,conceptTemplates,gateDefs,dimensionScores,conceptBuildScores,finalConceptScore,computeConcepts,validateImportedState};
