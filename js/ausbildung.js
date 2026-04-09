// ═══════════════════════════════════════════════════════════
// OKYU HRM – Ausbildung (Azubi Features)
// Extracted from app-core.js – F refactor step
// ═══════════════════════════════════════════════════════════

// ═══ AUSBILDUNG (Azubi Features) ═══
function renderAusbildung(){
  const c=document.getElementById('page-ausbildung');
  if(!c)return;

  // Determine which azubis to show
  const isAzubi = currentUser.role==='azubi';
  const azubis = isAzubi
    ? EMPS.filter(e=>e.id===currentUser.empId)
    : getVisibleEmps().filter(e=>e.dept==='Ausbildung' || e.position.toLowerCase().includes('azubi'));

  if(azubis.length===0){
    c.innerHTML=permBanner('Keine Azubis vorhanden.');
    return;
  }

  // Selected azubi (for admin view)
  const selEmpId = isAzubi ? currentUser.empId : (window._azubiSelId || azubis[0].id);
  const selEmp = azubis.find(e=>e.id===selEmpId) || azubis[0];
  window._azubiSelId = selEmp.id;

  // Azubi selector (admin only)
  let selHtml = '';
  if(!isAzubi && azubis.length > 1){
    selHtml = '<select class="location-select" onchange="window._azubiSelId=+this.value;renderAusbildung()" style="margin-bottom:16px">';
    azubis.forEach(a => {
      selHtml += `<option value="${a.id}" ${a.id===selEmp.id?'selected':''}>${a.avatar} ${a.name} – ${a.position} (${getLocationName(a.location)})</option>`;
    });
    selHtml += '</select>';
  }

  // Tab bar
  const tabs = [
    {id:'plan',label:'📋 Ausbildungsplan'},
    {id:'schule',label:'🏫 Berufsschule'},
    {id:'nachweis',label:'📝 Ausbildungsnachweis'},
    {id:'bewertung',label:'⭐ Bewertungen'}
  ];
  let tabHtml = '<div class="tabs">';
  tabs.forEach(t=>{
    tabHtml+=`<div class="tab ${azubiTab===t.id?'active':''}" onclick="azubiTab='${t.id}';renderAusbildung()">${t.label}</div>`;
  });
  tabHtml+='</div>';

  // Card header
  let h = `<div class="stat-card" style="margin-bottom:16px;padding:16px">
    <div style="display:flex;align-items:center;gap:12px">
      <div class="avatar" style="width:48px;height:48px;font-size:1.1rem">${selEmp.avatar}</div>
      <div>
        <strong style="font-size:1.1rem">${selEmp.name}</strong><br>
        <span style="color:var(--text-muted)">${selEmp.position} · ${getLocationName(selEmp.location)} · seit ${formatDateDE(selEmp.start)}</span>
      </div>
    </div>
  </div>`;

  h += selHtml + tabHtml + '<div style="margin-top:16px">';

  if(azubiTab==='plan'){
    h += renderAzubiPlan(selEmp);
  } else if(azubiTab==='schule'){
    h += renderAzubiSchule(selEmp);
  } else if(azubiTab==='nachweis'){
    h += renderAzubiNachweis(selEmp);
  } else {
    h += renderAzubiBewertung(selEmp);
  }

  h += '</div>';
  c.innerHTML = h;
}

function renderAzubiPlan(emp){
  const PLAN_DATA = {
    phase1: [
      {weeks:8,color:'var(--warning)',badge:'A·1',title:'Umgang mit Gästen & Teammitgliedern',desc:'Professionelles Verhalten, Gäste empfangen, im Team kommunizieren.',skills:['Persönliches Erscheinungsbild gestalten','Digitale Kommunikation korrekt nutzen','Teamorientiert: Feedback geben & annehmen','Gäste empfangen und Erwartungen ermitteln','Gäste beraten, kulturelle Bedürfnisse berücksichtigen','Reklamationen entgegennehmen und reagieren','Konflikte erkennen, vermeiden und lösen','Einfache Auskünfte in Fremdsprache']},
      {weeks:10,color:'#92400e',badge:'A·2',title:'Annahme und Einlagerung von Waren',desc:'Lagerbestände kontrollieren, Waren entgegennehmen, Qualität & Kühlkette prüfen.',skills:['Lagerbestände nach Quantität und Qualität kontrollieren','Differenzen dokumentieren, bei Inventuren mitwirken','Waren annehmen: Lieferschein, Gewicht, Qualität','Kühlkette und Haltbarkeit prüfen','Waren werterhaltend einlagern','Arbeitsschutz- und Hygienevorschriften beachten']},
      {weeks:14,color:'var(--danger)',badge:'A·3',title:'Grundlegende Aufgaben in der Küche',desc:'Speisen zubereiten, Rezepturen umsetzen, Hygiene einhalten.',skills:['Arbeitsaufgaben erfassen und Schritte planen','Lebensmittel bedarfsgerecht auswählen','Geräte sicher und nachhaltig einsetzen','Arbeitsplatz hygienisch vorbereiten','Lebensmittel auf Allergene prüfen','Speisen nach Rezepturen herstellen','Verschiedene Ernährungsformen berücksichtigen','Speisen portionieren und anrichten']},
      {weeks:8,color:'var(--success)',badge:'A·4',title:'Grundlegende Aufgaben im Wirtschaftsdienst',desc:'Gasträume reinigen, pflegen, herrichten. Abfallentsorgung.',skills:['Gestaltung, Pflege und Reinigung von Gasträumen','Reinigungs- und Desinfektionsmaßnahmen dokumentieren','Räume auf Sicherheit kontrollieren','Geschirr, Besteck anlassbezogen bereitstellen','Abfallentsorgung unter Hygiene- und Umweltaspekten']}
    ],
    phase2: [
      {weeks:12,color:'var(--info)',badge:'A·5',title:'Grundlegende Aufgaben im Service',desc:'Service von Speisen und Getränken, Kassenbedienung.',skills:['Arbeitsbereich anlassbezogen vorbereiten','Verkaufsfähigkeit von Produkten prüfen','Getränke ausschenken (alkoholisch/nicht)','Heißgetränke nach Vorgaben zubereiten','Service nach Serviceform durchführen','Betriebliches Kassensystem bedienen']},
      {weeks:12,color:'var(--accent)',badge:'A·6',title:'Verkaufsfördernde Maßnahmen',desc:'Aktionen umsetzen, Gasträume dekorieren, digitale Werbemittel.',skills:['Verkaufsfördernde Maßnahmen im Gastkontakt','Gastbereiche für Anlässe dekorieren','Dekoration, Beleuchtung, Musik beachten','Mit digitalen Medien Marketing mitwirken','Erfolgskontrolle von Maßnahmen']}
    ],
    schwerpunktR: [
      {weeks:4,color:'var(--danger)',badge:'B·1',title:'Wirtschaftsdienst im Restaurant',desc:'Gasträume anlass- und saisongerecht herrichten.',skills:['Gasträume anlass- und saisonbezogen herrichten','Vor- und Nacharbeiten ausführen','Textilien auf Verwendungszustand prüfen','Reinigung und Pflege unter Werterhalt']},
      {weeks:12,color:'var(--danger)',badge:'B·2',title:'Service im Restaurantbetrieb',desc:'Reservierungen, Tische eindecken, Gäste beraten, servieren.',skills:['Reservierungen entgegennehmen und bearbeiten','Gasträume vorbereiten, Tische eindecken','Gäste empfangen und platzieren','Gäste über Speisen und Allergene beraten','Produkte aktiv anbieten, Zusatzverkäufe','Speisen und Getränke servieren','Gästerückmeldungen bearbeiten','Kasse bedienen, Zahlungen abwickeln']}
    ],
    integrative: [
      {id:'D·1',icon:'🏢',title:'Organisation & Berufsbildung',desc:'Betriebsaufbau, Ausbildungsvertrag, Arbeits- und Tarifrecht.'},
      {id:'D·2',icon:'⛑',title:'Sicherheit & Gesundheit',desc:'Arbeitsschutz, Unfallverhütung, ergonomisches Arbeiten.'},
      {id:'D·3',icon:'🌿',title:'Umweltschutz & Nachhaltigkeit',desc:'Ressourcen schonen, Abfall vermeiden, nachhaltig handeln.'},
      {id:'D·4',icon:'💻',title:'Digitalisierte Arbeitswelt',desc:'Datenschutz, digitale Kommunikation, selbstgesteuertes Lernen.'},
      {id:'D·5',icon:'🧼',title:'Hygienemaßnahmen',desc:'HACCP-Konzept, Personalhygiene, Schädlingsbefall erkennen.'}
    ]
  };

  function tlCard(item){
    let skillsH = item.skills ? item.skills.map(s=>`<li style="display:flex;align-items:flex-start;gap:6px;font-size:.82rem;padding:4px 0;border-bottom:1px dashed var(--border)"><span style="color:${item.color};font-weight:700;flex-shrink:0">✓</span>${s}</li>`).join('') : '';
    return `<div style="display:grid;grid-template-columns:50px 2px 1fr;gap:0 12px;margin-bottom:4px">
      <div style="text-align:right;padding-top:14px"><span style="font-size:.65rem;font-weight:600;letter-spacing:1px;color:var(--text-muted);line-height:1.3"><strong style="display:block;font-size:1rem;color:var(--text-primary)">${item.weeks}</strong>Wochen</span></div>
      <div style="display:flex;flex-direction:column;align-items:center"><div style="width:10px;height:10px;border-radius:50%;border:2px solid var(--bg-card);box-shadow:0 0 0 2px ${item.color};flex-shrink:0;margin-top:18px"></div><div style="width:2px;flex:1;background:linear-gradient(to bottom,${item.color},transparent);opacity:.2;min-height:16px"></div></div>
      <div style="background:var(--bg-card);border-radius:var(--radius);padding:14px 16px;margin:6px 0 10px;border-left:3px solid ${item.color};box-shadow:var(--shadow);cursor:pointer" onclick="this.classList.toggle('ap-open')">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
          <strong style="font-size:.88rem">${item.title}</strong>
          <span style="flex-shrink:0;font-size:.6rem;font-weight:700;letter-spacing:1px;padding:2px 8px;border-radius:20px;background:${item.color};color:#fff">${item.badge}</span>
        </div>
        <p style="font-size:.78rem;color:var(--text-secondary);line-height:1.6;margin-bottom:6px">${item.desc}</p>
        <button style="font-size:.7rem;font-weight:600;color:var(--text-muted);background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;gap:4px" onclick="event.stopPropagation();this.closest('[onclick]').classList.toggle('ap-open')">Details <span style="transition:transform .2s">▼</span></button>
        <ul class="ap-skills" style="display:none;list-style:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">${skillsH}</ul>
      </div>
    </div>`;
  }

  let h = `<style>
    .ap-open .ap-skills{display:block!important}
    .ap-open button span{transform:rotate(180deg)}
  </style>`;

  const totalWeeks = 40+24;
  const startDate = new Date(emp.start);
  const now = new Date();
  const weeksDone = Math.max(0,Math.floor((now-startDate)/(7*864e5)));
  const pct = Math.min(100, Math.round(weeksDone/totalWeeks*100));

  h += `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
    <div class="stat-card" style="flex:1;min-width:140px;text-align:center"><div style="font-size:.65rem;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase">Phase 1</div><div style="font-size:1.4rem;font-weight:800;color:var(--info)">${Math.min(100,Math.round(Math.min(weeksDone,40)/40*100))}%</div><div style="height:4px;border-radius:99px;background:var(--border);overflow:hidden;margin-top:4px"><div style="height:100%;width:${Math.min(100,Math.round(Math.min(weeksDone,40)/40*100))}%;background:var(--info);border-radius:99px"></div></div><div style="font-size:.65rem;color:var(--text-muted);margin-top:4px">${Math.min(weeksDone,40)}/40 Wochen</div></div>
    <div class="stat-card" style="flex:1;min-width:140px;text-align:center"><div style="font-size:.65rem;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase">Phase 2</div><div style="font-size:1.4rem;font-weight:800;color:var(--success)">${weeksDone>40?Math.min(100,Math.round((weeksDone-40)/24*100)):0}%</div><div style="height:4px;border-radius:99px;background:var(--border);overflow:hidden;margin-top:4px"><div style="height:100%;width:${weeksDone>40?Math.min(100,Math.round((weeksDone-40)/24*100)):0}%;background:var(--success);border-radius:99px"></div></div><div style="font-size:.65rem;color:var(--text-muted);margin-top:4px">${weeksDone>40?Math.min(weeksDone-40,24):0}/24 Wochen</div></div>
    <div class="stat-card" style="flex:1;min-width:140px;text-align:center"><div style="font-size:.65rem;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase">Gesamt</div><div style="font-size:1.4rem;font-weight:800;color:var(--accent)">${pct}%</div><div style="height:4px;border-radius:99px;background:var(--border);overflow:hidden;margin-top:4px"><div style="height:100%;width:${pct}%;background:var(--accent);border-radius:99px"></div></div><div style="font-size:.65rem;color:var(--text-muted);margin-top:4px">${weeksDone}/${totalWeeks} Wochen</div></div>
  </div>`;

  h += `<div style="display:flex;flex-wrap:wrap;gap:10px;padding:12px 16px;background:var(--bg-card);border-radius:var(--radius);margin-bottom:16px;border:1px solid var(--border)">
    ${[{c:'var(--warning)',l:'Gäste & Team'},{c:'#92400e',l:'Warenannahme'},{c:'var(--danger)',l:'Küche'},{c:'var(--success)',l:'Wirtschaftsdienst'},{c:'var(--info)',l:'Service'},{c:'var(--accent)',l:'Verkaufsförderung'}].map(i=>`<span style="display:flex;align-items:center;gap:5px;font-size:.72rem;font-weight:500;color:var(--text-secondary)"><span style="width:8px;height:8px;border-radius:50%;background:${i.c}"></span>${i.l}</span>`).join('')}
  </div>`;

  h += `<div style="padding:12px 16px;display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,var(--info),#0984e3);border-radius:var(--radius);color:#fff;margin-bottom:16px">
    <div style="font-size:2rem;font-weight:900;opacity:.3">1</div>
    <div><div style="font-size:.95rem;font-weight:700">Erstes Ausbildungsjahr</div><div style="font-size:.65rem;opacity:.7;letter-spacing:1px;margin-top:2px">MONAT 1–12 · GRUNDLAGEN & ORIENTIERUNG</div></div>
  </div>`;
  PLAN_DATA.phase1.forEach(item => h += tlCard(item));

  h += `<div style="padding:12px 16px;display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,var(--success),#059669);border-radius:var(--radius);color:#fff;margin:20px 0 16px">
    <div style="font-size:2rem;font-weight:900;opacity:.3">2</div>
    <div><div style="font-size:.95rem;font-weight:700">Zweites Ausbildungsjahr</div><div style="font-size:.65rem;opacity:.7;letter-spacing:1px;margin-top:2px">MONAT 13–24 · VERTIEFUNG & SCHWERPUNKT</div></div>
  </div>`;
  PLAN_DATA.phase2.forEach(item => h += tlCard(item));

  h += `<div style="text-align:center;margin:20px 0 12px;position:relative"><div style="position:absolute;top:50%;left:0;right:0;height:1px;background:var(--border)"></div><span style="position:relative;background:var(--bg-primary);padding:4px 14px;font-size:.6rem;letter-spacing:3px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Schwerpunkt: Restaurantservice</span></div>`;
  PLAN_DATA.schwerpunktR.forEach(item => h += tlCard(item));

  h += `<div style="text-align:center;margin:24px 0 12px;position:relative"><div style="position:absolute;top:50%;left:0;right:0;height:1px;background:var(--border)"></div><span style="position:relative;background:var(--bg-primary);padding:4px 14px;font-size:.6rem;letter-spacing:3px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Abschnitt D · Integrativ vermittelt</span></div>`;
  h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;margin-bottom:16px">';
  PLAN_DATA.integrative.forEach(item => {
    h += `<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:14px">
      <div style="font-size:.55rem;letter-spacing:2px;padding:2px 8px;border-radius:10px;background:var(--accent-dark);color:#fff;display:inline-block;margin-bottom:6px;font-weight:600">${item.id}</div>
      <h4 style="font-size:.85rem;font-weight:700;color:var(--accent-light);margin-bottom:4px">${item.icon} ${item.title}</h4>
      <p style="font-size:.75rem;color:var(--text-secondary);line-height:1.6">${item.desc}</p>
    </div>`;
  });
  h += '</div>';
  return h;
}

function renderAzubiSchule(emp){
  const schedule = SCHULE_SCHEDULE.filter(s=>s.empId===emp.id && s.aktiv);
  let h = '<div class="stat-grid" style="grid-template-columns:1fr">';
  if(schedule.length===0){
    h += '<div class="stat-card"><p style="color:var(--text-muted)">Kein Berufsschulplan hinterlegt.</p></div>';
  } else {
    h += '<div class="stat-card"><h3 style="margin-bottom:12px">📅 Berufsschultage</h3>';
    h += '<div class="table-wrap"><table><thead><tr><th>Tag</th><th>Schule</th><th>Klasse</th><th>Zeit</th></tr></thead><tbody>';
    schedule.forEach(s=>{
      h += `<tr>
        <td><strong>${s.wochentag}</strong></td>
        <td>${s.schule}</td>
        <td><span class="badge badge-info">${s.klasse}</span></td>
        <td>${s.von?.substring(0,5)||'08:00'} – ${s.bis?.substring(0,5)||'15:00'}</td>
      </tr>`;
    });
    h += '</tbody></table></div>';
    const totalSchuleH = schedule.reduce((sum,s)=>{
      const v=s.von?parseInt(s.von):8;
      const b=s.bis?parseInt(s.bis):15;
      return sum+(b-v);
    },0);
    h += `<div style="margin-top:12px;padding:12px;background:var(--bg-input);border-radius:8px">
      <span style="color:var(--text-muted)">📊 ${schedule.length} Schultage/Woche · ca. ${totalSchuleH} Std. Schule · ${emp.schuleTage} Schultage gesamt</span>
    </div>`;
    h += '</div>';
  }
  h += '</div>';
  return h;
}

function renderAzubiNachweis(emp){
  const logs = AUSBILDUNGSNACHWEISE.filter(n=>n.empId===emp.id);
  let h = '<div class="stat-grid" style="grid-template-columns:1fr">';
  if(logs.length===0){
    h += '<div class="stat-card"><p style="color:var(--text-muted)">Keine Ausbildungsnachweise vorhanden.</p></div>';
  } else {
    logs.forEach(n=>{
      const statusMap = {
        entwurf:    {label:'Entwurf',    cls:'badge-neutral'},
        eingereicht:{label:'Eingereicht',cls:'badge-info'},
        genehmigt:  {label:'Genehmigt',  cls:'badge-success'},
        abgelehnt:  {label:'Abgelehnt',  cls:'badge-danger'}
      };
      const st = statusMap[n.status]||statusMap.entwurf;
      h += `<div class="stat-card" style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <strong>KW ${getWeekNumber(n.wocheStart)}: ${formatDateDE(n.wocheStart)} – ${formatDateDE(n.wocheEnd)}</strong>
          <span class="badge ${st.cls}">${st.label}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:4px">🍣 Betrieb (${n.betriebStunden} Std.)</div>
            <div style="font-size:.88rem">${n.betriebTaetigkeiten||'—'}</div>
          </div>
          <div>
            <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:4px">🏫 Schule (${n.schuleStunden} Std.)</div>
            <div style="font-size:.88rem">${n.schuleThemen||'—'}</div>
          </div>
        </div>
        ${n.ausbilderKommentar?`<div style="margin-top:8px;padding:8px;background:var(--bg-input);border-radius:6px;font-size:.82rem"><strong>Ausbilder:</strong> ${n.ausbilderKommentar}</div>`:''}
      </div>`;
    });
  }
  h += '</div>';
  return h;
}

function renderAzubiBewertung(emp){
  const evals = AZUBI_BEWERTUNGEN.filter(b=>b.empId===emp.id);
  let h = '';
  if(evals.length===0){
    h += '<div class="stat-card"><p style="color:var(--text-muted)">Keine Bewertungen vorhanden.</p></div>';
    return h;
  }
  const byDate = {};
  evals.forEach(e=>{
    if(!byDate[e.datum])byDate[e.datum]=[];
    byDate[e.datum].push(e);
  });
  const noteColor=n=>n<=2?'var(--success)':n<=3?'var(--warning)':'var(--danger)';
  const noteLabel=n=>({1:'Sehr gut',2:'Gut',3:'Befriedigend',4:'Ausreichend',5:'Mangelhaft',6:'Ungenügend'})[n]||'—';
  Object.keys(byDate).sort().reverse().forEach(datum=>{
    const items=byDate[datum];
    const avg=(items.reduce((s,i)=>s+i.note,0)/items.length).toFixed(1);
    h+=`<div class="stat-card" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong>📅 ${formatDateDE(datum)} · Bewerter: ${items[0].bewerter}</strong>
        <span style="font-size:1.1rem;font-weight:700;color:${noteColor(Math.round(avg))}">⌀ ${avg}</span>
      </div>`;
    items.forEach(ev=>{
      const pct=Math.max(0,(6-ev.note)/5*100);
      h+=`<div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:2px">
          <span>${ev.kategorie}</span>
          <span style="font-weight:600;color:${noteColor(ev.note)}">${ev.note} – ${noteLabel(ev.note)}</span>
        </div>
        <div style="height:6px;background:var(--bg-input);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${noteColor(ev.note)};border-radius:3px;transition:width .3s"></div>
        </div>
        ${ev.kommentar?`<div style="font-size:.78rem;color:var(--text-muted);margin-top:2px">${ev.kommentar}</div>`:''}
      </div>`;
    });
    h+='</div>';
  });
  return h;
}

function getWeekNumber(dateStr){
  const d=new Date(dateStr);
  const dayNum=d.getUTCDay()||7;
  d.setUTCDate(d.getUTCDate()+4-dayNum);
  const yearStart=new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d-yearStart)/86400000)+1)/7);
}
