import { dimensionScores, DIM_LABELS } from './model.js';

const directions = [
  {id:'frontiera',name:'FRONTIER SIGNAL',world:'Science fiction',tags:['Sci-fi','Co-op','Exploration','Progression','Roles'],needs:['coop','exploration','progression','persistence','roles','shortsession'],
    promise:'In 2–4 esplorate una frontiera scientifica instabile: le scoperte e i moduli recuperati trasformano il vostro avamposto e le possibilità della spedizione successiva.',
    loop:'Preparazione nell’avamposto → spedizione di 30–45 minuti → scoperta / problema ambientale → ritorno o recupero → nuove opzioni e cambiamento visibile dell’ambiente.',
    hook:'Il gruppo risolve un’anomalia usando strumenti complementari e vede cambiare il territorio: la progressione modifica ciò che può esplorare.',
    proof:'Un avamposto, una regione compatta ma esplorabile, tre strumenti complementari, due obiettivi di spedizione e un cambiamento ambientale visibile. Prova prima il ciclo completo in solo e co-op a due; quattro giocatori soltanto dopo il test di rete.',
    risk:'Vicino a Planet Crafter, Abiotic Factor e ASTRONEER. La trasformazione del territorio deve distinguersi in un video breve; crafting e contenuti possono espandere troppo lo scope.',
    trailer:'Un’anomalia blocca il passaggio; due strumenti cooperano, la barriera cede e l’area cambia. Stacco sull’avamposto trasformato dal ritrovamento.',
    cut:'Universo senza confini, MMO, PvP, tech tree lungo, economia tra giocatori, simulazione ecologica completa.'},
  {id:'rifugio',name:'THE SHELTER ROUTE',world:'Post-apocalypse',tags:['Co-op','Survival','Building','Exploration','Atmosphere'],needs:['coop','survival','exploration','atmosphere','persistence','building'],
    promise:'In 2–4 attraversate una zona post-apocalittica attorno a un rifugio mobile che evolve con le vostre scelte e conserva ciò che avete conquistato.',
    loop:'Scegliere un obiettivo → esplorare una zona aperta contenuta → affrontare un imprevisto → rientrare → migliorare il rifugio e aprire una nuova possibilità.',
    hook:'Il rifugio è un personaggio condiviso: cambia visibilmente grazie alle scoperte, non soltanto per accumulare statistiche.',
    proof:'Un rifugio, una zona, due percorsi alternativi, un rischio ambientale e tre miglioramenti visibili. Fine sessione sicura e ripresa persistente da dimostrare nella demo.',
    risk:'Raft, Forever Skies e Voidtrain occupano già territori vicini. Occorre un motivo specifico per scegliere questo rifugio; guida e fisica aggiungono complessità.',
    trailer:'Il rifugio incompleto attraversa una tempesta; il gruppo torna con un componente e lo vede trasformarsi in un luogo riconoscibile e abitabile.',
    cut:'Mappa enorme, guida simulativa, fisica completa del veicolo, PvP, fame e manutenzione continue.'},
  {id:'archivio',name:'ANOMALY ARCHIVE',world:'Occult / weird',tags:['Co-op','Exploration','Atmosphere','Narrative'],needs:['coop','exploration','atmosphere','systems','shortsession','narrative'],
    promise:'In 2–4 indagate luoghi anomali: ogni scoperta entra in un archivio persistente e sblocca nuovi strumenti per leggere fenomeni prima incomprensibili.',
    loop:'Scegliere un’indagine → osservare e combinare strumenti → interpretare un fenomeno → tornare all’archivio → nuove conoscenze e possibilità.',
    hook:'La cooperazione cambia ciò che riuscite a percepire: le informazioni dei diversi strumenti diventano una scoperta soltanto se combinate.',
    proof:'Un luogo memorabile, tre strumenti, due fenomeni risolvibili in modi diversi e un archivio che dimostri l’effetto della seconda sessione.',
    risk:'Pericolo di scivolare in una sequenza di puzzle consumabili. L’atmosfera da sola non prova la rigiocabilità; vanno testate variazioni realmente sistemiche.',
    trailer:'Un giocatore vede un segnale che un altro non può vedere; combinando le osservazioni il gruppo rivela un luogo prima invisibile.',
    cut:'Campagna lunga, doppiaggio esteso, combattimento fantasy, contenuti stagionali obbligatori.'}
];

export function buildInsights(state,research) {
  const dims=dimensionScores(state);
  const consensus=Object.entries(dims).filter(([,d])=>d.mean>=5.2&&d.sd<=1).sort((a,b)=>b[1].mean-a[1].mean);
  const conflicts=Object.entries(dims).filter(([,d])=>d.sd>1.35).sort((a,b)=>b[1].sd-a[1].sd);
  const worldCounts={};state.answers.forEach(a=>(a.q90||[]).forEach(world=>{worldCounts[world]=(worldCounts[world]||0)+1}));
  const options=directions.map(direction=>{
    const fit=Math.round(direction.needs.reduce((sum,id)=>sum+(dims[id]?.score??50),0)/direction.needs.length);
    const worldSupport=worldCounts[direction.world]||0;
    const comparables=(research?.titles||[]).map(title=>({...title,overlap:title.tags.filter(tag=>direction.tags.includes(tag)).length})).sort((a,b)=>b.overlap-a.overlap||b.reviews-a.reviews).slice(0,6);
    return {...direction,fit,worldSupport,comparables,priority:fit+worldSupport*3};
  }).sort((a,b)=>b.priority-a.priority);
  const researchCurrent=research?.baselineAnswers&&JSON.stringify(research.baselineAnswers)===JSON.stringify(state.answers);
  const completed=state.answers.map(a=>Object.values(a).filter(v=>Array.isArray(v)?v.length:typeof v==='string'?v.trim().length:!!v).length);
  const alerts=[];
  const supported=options[0].fit>=60&&options[0].worldSupport>0&&(dims.coop?.score??0)>=50;
  if(!supported)alerts.push('Le nuove risposte escono dal perimetro delle tre proposte curate: il ranking si aggiorna, ma serve una nuova sintesi prima di scegliere un prototipo.');
  if(completed.some(n=>n<96))alerts.push('Questionari incompleti: il modello usa un punto neutro per i valori mancanti. Completare le risposte prima di interpretare il ranking.');
  state.answers.forEach((a,i)=>{
    const name=state.founders[i].name;
    if(a.q72<=2)alerts.push(name+' è poco disposto a tagliare funzionalità: accordare un limite di scope prima di impegnare il budget.');
    if(a.q79<=2||a.q80<=2)alerts.push(name+' attribuisce poco peso alla validazione commerciale: concordare quali evidenze faranno continuare o fermare il progetto.');
    if(Math.abs((a.q6||4)-(a.q76||4))>=4)alerts.push(name+' ha risposte distanti sulla chiarezza del trailer e del video Kickstarter: chiarire la differenza.');
    if(a.q96)alerts.push(name+' — veto dichiarato: '+a.q96);
  });
  return {dims,consensus,conflicts,worldCounts,options,lead:options[0],researchCurrent,completed,alerts,supported};
}

const escape = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = values => '<ul>'+values.map(value=>'<li>'+escape(value)+'</li>').join('')+'</ul>';
const safeURL = value => {try{const url=new URL(value);return url.protocol==='https:'?url.href:'#'}catch{return '#'}};
const link = (url,label) => `<a href="${escape(safeURL(url))}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`;

export function renderInterpretation(state,research,version){
  const x=buildInsights(state,research);
  const sharedWorlds=Object.entries(x.worldCounts).filter(([,n])=>n===3).map(([world])=>world);
  return `<div class="brief-card"><div class="eyebrow">LETTURA DELLE RISPOSTE · REVISIONE ${version}</div><h3>Una base comune, decisioni ancora aperte</h3><p>${state.founders.map((f,i)=>escape(f.name)+' '+x.completed[i]+'/96').join(' · ')}</p><p>Il gruppo converge su ${escape(x.consensus.slice(0,6).map(([id])=>DIM_LABELS[id]||id).join(', '))}. ${sharedWorlds.length?'Ambientazioni selezionate da tutti: '+escape(sharedWorlds.join(', '))+'.':'Nessuna ambientazione è stata selezionata da tutti.'}</p><p>I punteggi descrivono preferenze e distanza tra risposte. La decisione richiede anche una prova giocabile e riscontri dal pubblico.</p></div><div class="brief-card"><h3>Decisioni da prendere insieme</h3>${list(x.conflicts.slice(0,6).map(([id,d])=>(DIM_LABELS[id]||id)+': '+state.founders.map((f,i)=>f.name+' '+d.vals[i].toFixed(1)+'/7').join(' · ')))}${list(x.alerts)}</div>`;
}

export function renderDirections(state,research){
  const x=buildInsights(state,research);
  return `<div class="brief-card"><p>Tre proposte curate sulle risposte iniziali: ordine e fit si ricalcolano automaticamente. Il testo progettuale è una proposta dell’autore; un cambio radicale di preferenze richiede nuove proposte. ${x.supported?'':'Le risposte correnti richiedono una nuova sintesi prima di scegliere.'}</p></div>`+x.options.map((d,i)=>`<article class="brief-card"><div class="eyebrow">${i===0&&x.supported?'PRIMA IPOTESI DA PROTOTIPARE':'ALTERNATIVA DA DISCUTERE'} · FIT PREFERENZE ${d.fit}/100</div><h3>${escape(d.name)}</h3><p>${escape(d.promise)}</p><p><strong>Ciclo:</strong> ${escape(d.loop)}</p><p><strong>Differenza da dimostrare:</strong> ${escape(d.hook)}</p><p><strong>Prova giocabile:</strong> ${escape(d.proof)}</p><p><strong>Rischio commerciale e produttivo:</strong> ${escape(d.risk)}</p><p><strong>Ambientazione:</strong> ${d.worldSupport}/3 founder hanno selezionato ${escape(d.world)}.</p></article>`).join('');
}

export function renderResearch(state,research){
  const x=buildInsights(state,research),d=x.lead;
  if(!research)return '<div class="brief-card">Ricerca non disponibile. Nessun punteggio commerciale verificato.</div>';
  const titles=[...research.titles].sort((a,b)=>b.tags.filter(t=>d.tags.includes(t)).length-a.tags.filter(t=>d.tags.includes(t)).length);
  return `<div class="brief-card"><div class="eyebrow">RICERCA VERIFICATA IL ${escape(research.date)}</div><h3>Domanda presente, differenziazione da provare</h3><p>20 comparabili: 10 diretti e 10 adiacenti. Il loro ordine si aggiorna rispetto alla proposta corrente, ${escape(d.name)}. Sono casi selezionati: non misurano la probabilità che un nuovo progetto abbia successo.</p><p>${escape(research.reviewMethod)}</p><p><strong>Stato della valutazione:</strong> ${x.researchCurrent?'le valutazioni iniziali si riferiscono a queste risposte.':'le risposte sono cambiate: ranking e brief aggiornati; la valutazione commerciale dell’autore va riesaminata.'}</p><p>I valori del Market Gate sono giudizi iniziali, non dati Steam né probabilità di profitto.</p></div><div class="brief-card"><h3>Cosa sappiamo e cosa manca</h3>${list(['Esiste interesse documentato per esplorazione, survival e cooperazione; il segmento contiene concorrenti forti.','La nostra differenza e il nostro pubblico raggiungibile non sono ancora dimostrati.','Wishlist, conversione della demo, costo di acquisizione e disponibilità a pagare per questo progetto non sono misurati.','Mesi, budget, ore del team ed engine provengono dai valori comuni degli export: devono essere confermati prima di impegnare una produzione.','Passaggio richiesto: una demo visivamente convincente, test con giocatori esterni e una pagina che misuri l’interesse. Nessuna decisione di lancio Kickstarter è già giustificata.'])}</div><div class="brief-card"><h3>Comparabili ordinati per affinità con la proposta</h3><div class="table-wrap"><table><thead><tr><th>Gioco / fonte</th><th>Gruppo</th><th>Prezzo attuale IT</th><th>Recensioni acquisti Steam</th><th>Lezione / limite</th></tr></thead><tbody>${titles.map(t=>`<tr><td>${link(t.url,t.title)}<br><small>${escape(t.release)}</small></td><td>${escape(t.kind)}</td><td>${escape(t.currentPrice)}${t.discount?' · sconto '+t.discount+'%':''}</td><td>${Number(t.reviews).toLocaleString('it-IT')} · ${t.positivePercent}% positive</td><td>${escape(t.note)}</td></tr>`).join('')}</tbody></table></div></div><div class="brief-card"><h3>Campagne di riferimento</h3>${research.campaigns.map(c=>`<p>${link(c.url,c.title)} — ${escape(c.result)}. ${escape(c.lesson)}</p>`).join('')}<p>Campagne storiche selezionate: importi raccolti non equivalgono a profitto o costo totale di produzione.</p></div>`;
}

export function renderSharedBrief(state,research,version){
  const x=buildInsights(state,research),d=x.lead;
  const business=(x.dims.premium?.score??0)>=60?'Acquisto premium come prima ipotesi: esperienza completa e giocabile anche da soli; la co-op aggiunge valore. Valutare espansioni a pagamento soltanto dopo avere dimostrato il valore del gioco base. Prezzo, margine e ricavi restano da misurare.':'Il modello premium non ha più consenso sufficiente: rivalutare prezzo e modello commerciale prima di fissare il piano.';
  const commercial=`<div class="brief-card"><h3>Modello commerciale da testare</h3><p>${escape(business)}</p><p>Kickstarter finanzia una promessa dimostrata nella demo: proporre ricompense digitali con costi sostenibili. Nessun pay-to-win, perdita dei progressi per trattenere il giocatore o promessa di aggiornamenti infiniti.</p>${x.supported?'':'<p>Le nuove preferenze richiedono una nuova sintesi del concept prima di impegnare risorse.</p>'}</div>`;
  return `<div class="brief-card"><div class="eyebrow">BRIEF AGGIORNATO DALLE RISPOSTE · REVISIONE ${version}</div><h3>${escape(d.name)}</h3><p>${escape(d.promise)}</p><p><strong>Ipotesi iniziale:</strong> PC, acquisto premium da verificare con pubblico e comparabili. Coop piccolo e progressione persistente sono la base da testare.</p></div><div class="brief-card"><h3>Vertical slice per convincere nel Kickstarter</h3><p>${escape(d.proof)}</p><p><strong>Scena da trailer:</strong> ${escape(d.trailer)}</p><p>Qualità visiva concentrata su un luogo, illuminazione, VFX e interazione leggibile. Un test completo deve dimostrare ritorno, salvataggio e ripresa entro una sessione di un’ora.</p></div>${commercial}<div class="brief-card"><h3>Limite di produzione</h3><p><strong>Da tagliare inizialmente:</strong> ${escape(d.cut)}</p><p>Vincoli importati, da confermare: ${escape(state.shared.mvpMonths)} mesi · €${Number(state.shared.mvpBudget).toLocaleString('it-IT')} · ${escape(state.shared.teamHours)} ore/settimana · ${escape(state.shared.engine)}. Non sono un preventivo verificato.</p></div><div class="brief-card"><h3>Gate prima di una campagna</h3>${list(['Allineare i tre founder sui veto e sulla differenza tra ampiezza desiderata e prima prova finanziabile.','Stimare lavoro, asset, rete e contenuti della vertical slice con chi li produrrà.','Far giocare persone esterne al team e misurare completamento, ritorno volontario, frizioni e comprensione del concept.','Misurare interesse e disponibilità a pagare con una pagina del progetto; fissare i criteri di decisione prima del test.','Rivedere differenziazione, budget completo e costo delle ricompense prima di fissare l’obiettivo Kickstarter.'])}<p>${x.researchCurrent?'Ricerca iniziale riferita alle risposte correnti.':'Preferenze cambiate: aggiornare anche la valutazione commerciale prima di usare questo brief per una decisione finanziaria.'}</p></div>`;
}
