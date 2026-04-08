// ═══ THEME ═══
function toggleTheme(){const h=document.documentElement;const n=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',n);localStorage.setItem('okyu-theme',n);}
(function(){const s=localStorage.getItem('okyu-theme');if(s)document.documentElement.setAttribute('data-theme',s);})();

// ═══ AUTH ═══
// doLogin(), doLoginDemo(), doLogout(), checkExistingSession() → see auth.js

// ═══ DYNAMIC SIDEBAR ═══
function buildSidebar(){
  let html='';
  html+='<div class="nav-section">Übersicht</div>';
  html+='<div class="nav-item active" onclick="navigate(\'dashboard\',this)"><span class="nav-icon">📊</span> Dashboard</div>';

  if(can('seeAllEmployees')){
    html+='<div class="nav-section">Personal</div>';
    html+='<div class="nav-item" onclick="navigate(\'employees\',this)"><span class="nav-icon">👥</span> Mitarbeiter</div>';
  }
  if(can('seeDepartments')){
    if(!can('seeAllEmployees')) html+='<div class="nav-section">Personal</div>';
    html+='<div class="nav-item" onclick="navigate(\'departments\',this)"><span class="nav-icon">🏢</span> Bereiche</div>';
  }

  html+='<div class="nav-section">Planung</div>';
  html+='<div class="nav-item" onclick="navigate(\'schedule\',this)"><span class="nav-icon">📅</span> Arbeitsplan</div>';
  html+='<div class="nav-item" onclick="navigate(\'vacation\',this)"><span class="nav-icon">🏖️</span> '+(can('seeAllVacations')?'Urlaubsplan':'Mein Urlaub')+'<span class="nav-badge" id="vacBadge" style="display:none">0</span></div>';
  html+='<div class="nav-item" onclick="navigate(\'sick\',this)"><span class="nav-icon">🏥</span> '+(can('seeAllSick')?'Krankmeldungen':'Meine Krankmeldungen')+'<span class="nav-badge" id="sickBadge" style="display:none">0</span></div>';

  html+='<div class="nav-section">Dokumente</div>';
  html+='<div class="nav-item" onclick="navigate(\'documents\',this)"><span class="nav-icon">📁</span> '+(can('seeAllDocs')?'Unterlagen':'Meine Unterlagen')+'</div>';
  html+='<div class="nav-item" onclick="navigate(\'checklists\',this)"><span class="nav-icon">✅</span> Checklisten</div>';

  // Ausbildung: visible to azubi (own data) + manager/inhaber (all azubis)
  if(currentUser.role==='azubi' || can('seeAllEmployees')){
    html+='<div class="nav-section">Ausbildung</div>';
    html+='<div class="nav-item" onclick="navigate(\'ausbildung\',this)"><span class="nav-icon">🎓</span> '+(currentUser.role==='azubi'?'Meine Ausbildung':'Ausbildung')+'</div>';
  }

  if(can('seeAllEmployees')){
    html+='<div class="nav-section">Auswertung</div>';
    html+='<div class="nav-item" onclick="navigate(\'calendar\',this)"><span class="nav-icon">🗓️</span> Personalkalender</div>';
    html+='<div class="nav-item" onclick="navigate(\'reports\',this)"><span class="nav-icon">📈</span> Berichte</div>';
  }

  if(can('manageAccess')){
    html+='<div class="nav-section">System</div>';
    html+='<div class="nav-item" onclick="navigate(\'access\',this)"><span class="nav-icon">🔐</span> Zugangsverwaltung</div>';
  }
  document.getElementById('sidebarNav').innerHTML=html;
}

function buildLocationSelect(){
  const sel=document.getElementById('locationSelect');
  if(can('seeAllLocations')){
    sel.innerHTML='<option value="all">Alle Standorte</option>'+LOCS.map(l=>`<option value="${l.id}">${l.name}</option>`).join('');
    sel.style.display='';
  } else {
    sel.innerHTML=`<option value="${currentUser.location}">${getLocationName(currentUser.location)}</option>`;
    sel.style.display=currentUser.role==='mitarbeiter'?'none':'';
  }
  sel.value=currentLocation;
}

// permBanner() defined in utils.js

// ═══ NAVIGATION ═══
function navigate(page,el){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if(el)el.classList.add('active');
  document.getElementById('pageTitle').textContent=PAGE_TITLES[page]||page;
  // Auto-close sidebar on mobile
  if(window.innerWidth<=900) document.getElementById('sidebar').classList.remove('open');
  renderPage(page);
}
function renderPage(p){
  const c=document.getElementById('contentArea');
  c.innerHTML='<div class="page active" id="page-'+p+'"></div>';
  ({dashboard:renderDashboard,employees:renderEmployees,departments:renderDepts,schedule:renderSchedule,vacation:renderVacation,sick:renderSick,documents:renderDocuments,access:renderAccess,calendar:renderCalendar,reports:renderReports,checklists:renderChecklists,ausbildung:renderAusbildung})[p]?.();
}

// ═══ GENERATE SHIFTS ═══
function genShifts(){
  // Skip if shifts already loaded from Supabase
  if(window._shiftsFromDB && SHIFTS.length > 0) { console.log('[Shifts] Using', SHIFTS.length, 'shifts from Supabase'); return; }
  SHIFTS=[];const weekS=getWeekStart(scheduleDate);
  for(let d=0;d<14;d++){const day=new Date(weekS);day.setDate(day.getDate()+d);const ds=isoDate(day);
    EMPS.filter(e=>e.status==='active').forEach(emp=>{if(Math.random()>.35){const t=SHIFT_TEMPLATES[Math.floor(Math.random()*SHIFT_TEMPLATES.length)];
      SHIFTS.push({id:Date.now()+Math.random()*1e6|0,empId:emp.id,empName:emp.name,dept:emp.dept,location:emp.location,date:ds,from:t.from,to:t.to,label:t.label,colorClass:getDeptColorClass(emp.dept),isSick:false,isVacation:false,isLate:false,lateMin:0});}});}
  // Save generated shifts to Supabase
  syncBulkShifts(SHIFTS);
}

// ═══ ZEITERFASSUNG (GPS Check-in/out) ═══

function renderZeiterfassungCard(emp, todayShift) {
  if (!emp) return '';

  if (activeCheckIn) {
    // Already checked in → show timer + check-out button
    const cin = new Date(activeCheckIn.checkIn);
    const elapsed = Math.floor((Date.now() - cin.getTime()) / 1000);
    const hh = Math.floor(elapsed / 3600);
    const mm = Math.floor((elapsed % 3600) / 60);
    const ss = elapsed % 60;
    const locName = getLocationName(activeCheckIn.location);
    const lateBadge = activeCheckIn.isLate ? `<div style="color:#e74c3c;font-size:.8rem;margin-top:4px">⏰ ${activeCheckIn.lateMin} Min. verspätet</div>` : '';

    // Start live timer
    if (!checkInTimer) {
      checkInTimer = setInterval(() => {
        const el = document.getElementById('zeitTimer');
        if (!el) { clearInterval(checkInTimer); checkInTimer = null; return; }
        const now = Math.floor((Date.now() - cin.getTime()) / 1000);
        const h = Math.floor(now / 3600), m = Math.floor((now % 3600) / 60), s = now % 60;
        el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      }, 1000);
    }

    return `<div style="background:var(--bg-card);border-radius:16px;padding:20px;margin-bottom:20px;border:2px solid var(--success)">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="width:12px;height:12px;border-radius:50%;background:var(--success);animation:pulse 2s infinite"></div>
        <div style="font-size:.82rem;color:var(--success);font-weight:600;text-transform:uppercase;letter-spacing:.5px">Eingecheckt seit ${cin.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <div id="zeitTimer" style="font-family:'Space Mono',monospace;font-size:2.2rem;font-weight:700;color:var(--text-primary)">${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}</div>
          <div style="font-size:.78rem;color:var(--text-muted)">📍 ${locName}${lateBadge}</div>
        </div>
        <button onclick="doCheckOut()" style="background:var(--danger);color:#fff;border:none;padding:14px 28px;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(231,76,60,.3)">🔴 Ausstempeln</button>
      </div>
    </div>`;
  }

  if (!todayShift) {
    return `<div style="background:var(--bg-card);border-radius:16px;padding:20px;margin-bottom:20px;border:1px solid var(--border);text-align:center">
      <div style="font-size:.85rem;color:var(--text-muted)">📍 Keine Schicht heute – Check-in nicht erforderlich</div>
    </div>`;
  }

  // Not checked in yet → show check-in button
  return `<div style="background:var(--bg-card);border-radius:16px;padding:20px;margin-bottom:20px;border:2px dashed var(--accent)">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <div style="font-size:.82rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px">📍 Zeiterfassung</div>
        <div id="zeitGpsStatus" style="font-size:.78rem;color:var(--text-muted);margin-top:4px">GPS wird geladen...</div>
      </div>
      <button id="zeitCheckInBtn" onclick="doCheckIn()" style="background:var(--success);color:#fff;border:none;padding:14px 28px;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(46,204,113,.3)">🟢 Einstempeln</button>
    </div>
  </div>
  <script>updateGpsStatus()</script>`;
}

async function updateGpsStatus() {
  const el = document.getElementById('zeitGpsStatus');
  if (!el) return;
  try {
    const pos = await getCurrentGPS();
    const nearest = findNearestLocation(pos.lat, pos.lng);
    if (!nearest) { el.textContent = '⚠️ Kein Standort konfiguriert'; return; }
    const distTxt = nearest.distance > 1000 ? (Math.round(nearest.distance / 100) / 10) + ' km' : nearest.distance + 'm';
    if (nearest.distance <= (nearest.location.radius_m || 50)) {
      el.innerHTML = `✅ <strong>${nearest.location.name}</strong> · ${distTxt} entfernt`;
      el.style.color = 'var(--success)';
    } else {
      el.innerHTML = `⚠️ ${nearest.location.name} · <strong>${distTxt}</strong> entfernt (max ${nearest.location.radius_m || 50}m)`;
      el.style.color = 'var(--warning)';
    }
  } catch (err) {
    el.textContent = '❌ ' + err.message;
    el.style.color = 'var(--danger)';
  }
}

async function doCheckIn() {
  const btn = document.getElementById('zeitCheckInBtn');
  if (btn) { btn.disabled = true; btn.textContent = '📍 GPS prüfen...'; }

  try {
    const pos = await getCurrentGPS();
    const nearest = findNearestLocation(pos.lat, pos.lng);

    if (!nearest) { toast('Kein Standort gefunden', 'err'); return; }

    const maxDist = nearest.location.radius_m || 50;
    if (nearest.distance > maxDist) {
      toast(`Zu weit entfernt (${nearest.distance}m, max ${maxDist}m)`, 'err');
      if (btn) { btn.disabled = false; btn.textContent = '🟢 Einstempeln'; }
      return;
    }

    // Check for today's shift to detect late
    const today = isoDate(new Date());
    const me = EMPS.find(e => e.id === currentUser.empId);
    const todayShift = getVisibleShifts().find(s => s.empId === me?.id && s.date === today && !s.isSick && !s.isVacation);
    let isLate = false, lateMin = 0;
    if (todayShift) {
      const [sh, sm] = todayShift.from.split(':').map(Number);
      const shiftStart = new Date(); shiftStart.setHours(sh, sm, 0, 0);
      const diff = (Date.now() - shiftStart.getTime()) / 60000;
      if (diff > 5) { isLate = true; lateMin = Math.round(diff); }
    }

    // Create record
    const record = {
      empId: currentUser.empId,
      location: nearest.location.id,
      checkInLat: pos.lat,
      checkInLng: pos.lng,
      distanceM: nearest.distance,
      shiftId: todayShift?.id || null,
      isLate, lateMin
    };

    const data = await syncCheckIn(record);
    if (data) {
      activeCheckIn = { ...record, id: data.id, checkIn: data.check_in };
      TIME_RECORDS.unshift(activeCheckIn);
      toast(`✅ Eingecheckt (${nearest.location.name}, ${nearest.distance}m)`, 'success');
      if (isLate) toast(`⏰ ${lateMin} Min. verspätet`, 'warn');
      renderDashboard();
    } else {
      toast('Check-in fehlgeschlagen', 'err');
    }
  } catch (err) {
    toast('GPS Fehler: ' + err.message, 'err');
  }
  if (btn) { btn.disabled = false; btn.textContent = '🟢 Einstempeln'; }
}

async function doCheckOut() {
  if (!activeCheckIn) return;

  try {
    const pos = await getCurrentGPS();
    const cin = new Date(activeCheckIn.checkIn);
    const totalHours = Math.round(((Date.now() - cin.getTime()) / 3600000) * 100) / 100;

    const data = await syncCheckOut(activeCheckIn.id, {
      lat: pos.lat,
      lng: pos.lng,
      totalHours
    });

    if (data) {
      // Update local record
      const rec = TIME_RECORDS.find(r => r.id === activeCheckIn.id);
      if (rec) { rec.checkOut = data.check_out; rec.totalHours = totalHours; }

      if (checkInTimer) { clearInterval(checkInTimer); checkInTimer = null; }
      activeCheckIn = null;

      const hh = Math.floor(totalHours);
      const mm = Math.round((totalHours - hh) * 60);
      toast(`🔴 Ausgestempelt · ${hh}h ${mm}m gearbeitet`, 'success');
      renderDashboard();
    } else {
      toast('Check-out fehlgeschlagen', 'err');
    }
  } catch (err) {
    toast('GPS Fehler: ' + err.message, 'err');
  }
}

// ═══ DASHBOARD ═══
function renderDashboard(){
  const pg=document.getElementById('page-dashboard');
  const emps=getVisibleEmps();
  const isEmp=currentUser.role==='mitarbeiter'||currentUser.role==='azubi';
  const me=isEmp?EMPS.find(e=>e.id===currentUser.empId):null;

  if((isEmp||currentUser.role==='azubi')&&me){
    const vacRemain=me.vacTotal-me.vacUsed;
    const planned=VACS.filter(v=>v.empId===me.id&&(v.status==='approved'||v.status==='pending')&&v.from>='2026-03-20').reduce((s,v)=>s+v.days,0);
    const today=isoDate(new Date());
    const myShiftsAll=getVisibleShifts().filter(s=>s.empId===me.id&&s.date>=today&&!s.isSick&&!s.isVacation).sort((a,b)=>a.date.localeCompare(b.date)||a.from.localeCompare(b.from));
    const todayShift=myShiftsAll.find(s=>s.date===today);
    const upcoming=myShiftsAll.filter(s=>s.date>today).slice(0,5);

    // Today's shift card (prominent)
    let todayHtml;
    if(todayShift){
      todayHtml=`<div style="background:linear-gradient(135deg,var(--accent),#9b59b6);border-radius:16px;padding:24px;color:#fff;margin-bottom:20px;box-shadow:0 8px 32px rgba(102,126,234,.35)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <div style="font-size:2.2rem">🕐</div>
          <div>
            <div style="font-size:.78rem;opacity:.85;text-transform:uppercase;letter-spacing:1px">Heutige Schicht</div>
            <div style="font-size:1.6rem;font-weight:700">${todayShift.label}</div>
          </div>
        </div>
        <div style="display:flex;gap:20px;font-size:1rem;flex-wrap:wrap">
          <span>⏰ ${todayShift.from} – ${todayShift.to}</span>
          <span>🍳 ${todayShift.dept}</span>
          <span>📍 ${getLocationName(todayShift.location)}</span>
        </div>
      </div>`;
    } else {
      todayHtml=`<div style="background:var(--bg-card);border-radius:16px;padding:24px;margin-bottom:20px;border:2px dashed var(--border);text-align:center">
        <div style="font-size:2rem;margin-bottom:8px">😊</div>
        <div style="font-size:1.1rem;font-weight:600;color:var(--text-primary)">Heute kein Dienst</div>
        <div style="color:var(--text-muted);font-size:.85rem">Genieße deinen freien Tag!</div>
      </div>`;
    }

    // Upcoming shifts
    let upcomingHtml='';
    if(upcoming.length>0){
      upcomingHtml=`<div class="table-wrap" style="margin-bottom:20px"><div class="table-header"><span class="table-title">📅 Nächste Schichten</span></div><div style="padding:12px">`;
      upcoming.forEach(s=>{
        const dayName=['So','Mo','Di','Mi','Do','Fr','Sa'][new Date(s.date).getDay()];
        upcomingHtml+=`<div style="display:flex;align-items:center;gap:12px;padding:10px;border-radius:8px;margin-bottom:4px;background:var(--bg-input)">
          <div style="min-width:36px;text-align:center;font-weight:700;color:var(--accent)">${dayName}</div>
          <div style="flex:1">
            <div style="font-weight:600;font-size:.9rem">${formatDateDE(s.date)} – ${s.label}</div>
            <div style="font-size:.78rem;color:var(--text-muted)">${s.from}–${s.to} · ${s.dept}</div>
          </div>
        </div>`;
      });
      upcomingHtml+='</div></div>';
    }

    // Zeiterfassung card
    let zeitHtml = renderZeiterfassungCard(me, todayShift);

    // Last check-ins history
    const myRecords = TIME_RECORDS.filter(r => r.empId === me.id && r.checkOut).slice(0, 5);
    let historyHtml = '';
    if (myRecords.length > 0) {
      historyHtml = `<div class="table-wrap" style="margin-bottom:20px"><div class="table-header"><span class="table-title">📊 Letzte Arbeitszeiten</span></div><div style="padding:12px">`;
      myRecords.forEach(r => {
        const cin = new Date(r.checkIn);
        const hours = r.totalHours ? (Math.round(r.totalHours * 10) / 10) + 'h' : '—';
        const lateBadge = r.isLate ? `<span style="color:var(--danger);font-size:.72rem"> ⏰+${r.lateMin}m</span>` : '';
        historyHtml += `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)">
          <div style="min-width:36px;text-align:center;font-weight:700;color:var(--accent);font-size:.82rem">${['So','Mo','Di','Mi','Do','Fr','Sa'][cin.getDay()]}</div>
          <div style="flex:1;font-size:.85rem"><strong>${cin.toLocaleDateString('de-DE')}</strong> · ${cin.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}–${new Date(r.checkOut).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</div>
          <div style="font-family:'Space Mono',monospace;font-weight:700;font-size:.88rem">${hours}${lateBadge}</div>
        </div>`;
      });
      historyHtml += '</div></div>';
    }

    pg.innerHTML=`
      ${todayHtml}
      ${zeitHtml}
      ${upcomingHtml}
      ${historyHtml}
      <div class="stats-row">
        <div class="stat-card" style="border-left:3px solid var(--success)"><div class="stat-icon">🏖️</div><div class="stat-label">Resturlaub</div><div class="stat-value">${vacRemain-planned}</div><div class="stat-change">von ${me.vacTotal} · ${planned} geplant</div></div>
        <div class="stat-card" style="border-left:3px solid var(--danger)"><div class="stat-icon">🏥</div><div class="stat-label">Krankentage</div><div class="stat-value">${me.sickDays}</div><div class="stat-change">laufendes Jahr</div></div>
        <div class="stat-card" style="border-left:3px solid var(--warning)"><div class="stat-icon">⏰</div><div class="stat-label">Verspätungen</div><div class="stat-value">${me.lateCount}</div></div>
        <div class="stat-card"><div class="stat-icon">📄</div><div class="stat-label">Dokumente</div><div class="stat-value">${getVisibleDocs().length}</div></div>
      </div>`;
  } else {
    const today=isoDate(new Date());
    const now=new Date();
    const h=now.getHours();
    const greeting=h<12?'Guten Morgen':h<17?'Guten Tag':'Guten Abend';
    const timeStr=now.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
    const dateStr=now.toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});

    // Calculate sick/vacation dynamically from records (not stale status field)
    const allSicks=getVisibleSicks();
    const allVacs=getVisibleVacs();
    const sickEmpIds=new Set(allSicks.filter(s=>s.status==='active'&&s.from<=today&&s.to>=today).map(s=>s.empId));
    const vacEmpIds=new Set(allVacs.filter(v=>v.status==='approved'&&v.from<=today&&v.to>=today).map(v=>v.empId));
    const sickEmps=emps.filter(e=>sickEmpIds.has(e.id)).length;
    const vacEmps=emps.filter(e=>vacEmpIds.has(e.id)&&!sickEmpIds.has(e.id)).length;
    const activeEmps=emps.length - sickEmps - vacEmps;
    const pendingVacs=allVacs.filter(v=>v.status==='pending').length;
    const totalLate=emps.reduce((s,e)=>s+e.lateCount,0);
    const activeSick=allSicks.filter(s=>s.status==='active').length;
    const todayShifts=getVisibleShifts().filter(s=>s.date===today&&!s.isSick&&!s.isVacation);
    const todayCheckins=TIME_RECORDS.filter(r=>r.checkIn&&r.checkIn.startsWith(today));
    const scheduledCount=new Set(todayShifts.map(s=>s.empId)).size;
    const checkedInCount=todayCheckins.length;
    const attPct=scheduledCount>0?Math.round(checkedInCount/scheduledCount*100):0;
    const circ=2*Math.PI*22;
    const attOffset=circ-(attPct/100)*circ;

    const bannerKey = 'okyu_banner_'+currentUser.id;
    const bannerImg = localStorage.getItem(bannerKey) || '';
    const bannerStyle = bannerImg ? `background-image:url('${bannerImg}');background-size:cover;background-position:center;` : '';
    const locLogos = {origami:'🍣',enso:'🍜',okyu_central:'🏢'};
    const locLogo = locLogos[currentLocation] || locLogos[currentUser.location] || '🏢';

    pg.innerHTML=`
      <div class="dash-welcome" style="${bannerStyle}">
        <div class="dash-welcome-overlay"></div>
        <div class="dash-clock" id="dashClock">${timeStr}</div>
        <div style="position:relative;display:flex;align-items:center;gap:16px">
          <div class="dash-logo">${locLogo}</div>
          <div>
            <div class="dash-greeting">${greeting}, ${currentUser.name.split(' ')[0]} 👋</div>
            <div class="dash-subtitle">${dateStr} · ${getLocationName(currentLocation)} · ${emps.length} Mitarbeiter</div>
          </div>
        </div>
        ${can('editSchedules')?`<label class="dash-upload-btn" title="Hintergrundbild ändern">
          <input type="file" accept="image/*" style="display:none" onchange="changeDashBanner(this)">📷
        </label>`:''}
      </div>

      <div class="dash-stats-grid">
        <div class="dash-stat" style="--stat-accent:#27ae60" onclick="navigate('employees')">
          <div class="dash-stat-icon">👥</div>
          <div class="dash-stat-value">${activeEmps}</div>
          <div class="dash-stat-label">Aktive Mitarbeiter</div>
          <div class="dash-stat-sub">von ${emps.length} gesamt</div>
        </div>
        <div class="dash-stat" style="--stat-accent:#0984e3" onclick="navigate('vacation')">
          <div class="dash-stat-icon">🏖️</div>
          <div class="dash-stat-value">${vacEmps}</div>
          <div class="dash-stat-label">Im Urlaub</div>
          <div class="dash-stat-sub">${pendingVacs} ${pendingVacs===1?'Antrag':'Anträge'} offen</div>
        </div>
        <div class="dash-stat" style="--stat-accent:#e74c3c" onclick="navigate('sick')">
          <div class="dash-stat-icon">🏥</div>
          <div class="dash-stat-value">${sickEmps}</div>
          <div class="dash-stat-label">Krank</div>
          <div class="dash-stat-sub">${activeSick} aktive Meldungen</div>
        </div>
        <div class="dash-stat" style="--stat-accent:#fdcb6e" onclick="navigate('schedule')">
          <div class="dash-stat-icon">⏰</div>
          <div class="dash-stat-value">${totalLate}</div>
          <div class="dash-stat-label">Verspätungen</div>
          <div class="dash-stat-sub">laufendes Jahr</div>
        </div>
      </div>

      ${can('seeFinancials')?`<div class="dash-stats-grid">
        <div class="dash-stat" style="--stat-accent:#667eea">
          <div class="dash-stat-icon">💰</div>
          <div class="dash-stat-value">${formatEuro(emps.reduce((s,e)=>s+e.bruttoGehalt,0))}</div>
          <div class="dash-stat-label">Personalkosten / Monat</div>
        </div>
        <div class="dash-stat" style="--stat-accent:#00b894">
          <div class="dash-stat-icon">⏱️</div>
          <div class="dash-stat-value">${emps.reduce((s,e)=>s+calcPlanHours(e.id),0)}h</div>
          <div class="dash-stat-label">Plan-Stunden</div>
          <div class="dash-stat-sub">Soll: ${emps.reduce((s,e)=>s+e.sollStunden,0)}h</div>
        </div>
        <div class="dash-stat" style="--stat-accent:#a29bfe">
          <div class="dash-stat-icon">💶</div>
          <div class="dash-stat-value">${formatEuro(emps.filter(e=>e.sollStunden>0).length?emps.filter(e=>e.sollStunden>0).reduce((s,e)=>s+calcHourly(e),0)/emps.filter(e=>e.sollStunden>0).length:0)}</div>
          <div class="dash-stat-label">⌀ Gehalt / Stunde</div>
        </div>
        <div class="dash-stat" style="--stat-accent:#fd79a8">
          <div class="dash-stat-icon">🎓</div>
          <div class="dash-stat-value">${emps.reduce((s,e)=>s+e.schuleTage,0)}</div>
          <div class="dash-stat-label">Schule / Fortbildung</div>
          <div class="dash-stat-sub">${emps.filter(e=>e.schuleTage>0).length} Mitarbeiter</div>
        </div>
      </div>`:``}

      <div class="dash-grid">
        <div class="dash-card">
          <div class="dash-card-header">📍 Anwesenheit heute
            <div style="margin-left:auto;display:flex;align-items:center;gap:10px">
              <div class="dash-ring">
                <svg width="56" height="56"><circle class="dash-ring-bg" cx="28" cy="28" r="22" fill="none" stroke-width="4"/><circle class="dash-ring-fill" cx="28" cy="28" r="22" fill="none" stroke-width="4" stroke-dasharray="${circ}" stroke-dashoffset="${attOffset}" style="--ring-color:${attPct>=80?'var(--success)':attPct>=50?'var(--warning)':'var(--danger)'}"/></svg>
                <span class="dash-ring-text">${attPct}%</span>
              </div>
              <span style="font-size:.82rem;font-weight:400;color:var(--text-muted)">${checkedInCount}/${scheduledCount}</span>
            </div>
          </div>
          <div class="dash-card-body" id="dashAttendance"></div>
        </div>
        <div class="dash-card">
          <div class="dash-card-header">🔔 Meldungen</div>
          <div class="dash-card-body" id="dashNotifs"></div>
        </div>
      </div>

      <div class="dash-card" style="margin-bottom:20px">
        <div class="dash-card-header">📋 Heutige Schichten <span style="margin-left:auto;font-weight:400;color:var(--text-muted);font-size:.78rem">${todayShifts.length} Schichten</span></div>
        <div class="dash-card-body" id="dashShifts"></div>
      </div>`;

    // Start live clock
    if(window._dashClockTimer) clearInterval(window._dashClockTimer);
    window._dashClockTimer=setInterval(()=>{
      const el=document.getElementById('dashClock');
      if(el) el.textContent=new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      else clearInterval(window._dashClockTimer);
    },1000);

    // Populate notifications
    const notifs=getVisibleNotifs().slice(0,5);
    document.getElementById('dashNotifs').innerHTML=notifs.map(n=>`<div class="notif-item ${n.type} ${n.unread?'unread':''}"><div class="notif-item-title">${n.title}</div><div class="notif-item-text">${n.text}</div><div class="notif-item-time">${n.time}</div></div>`).join('')||'<p style="color:var(--text-muted)">Keine Meldungen</p>';

    // Populate today shifts
    document.getElementById('dashShifts').innerHTML=todayShifts.slice(0,8).map(s=>`<div class="emp-row"><div class="emp-avatar">${s.empName.split(' ').map(n=>n[0]).join('')}</div><div class="emp-details"><div class="emp-name-sm">${s.empName}${s.isLate?' <span class="badge badge-late">⏰+'+s.lateMin+'m</span>':''}</div><div class="emp-dept">${s.dept} · ${s.from}–${s.to}</div></div></div>`).join('')||'<p style="color:var(--text-muted)">Keine Schichten</p>';

    // Populate GPS attendance
    const todayShiftEmps = [...new Set(todayShifts.map(s => s.empId))];
    let attHtml = '';
    todayShiftEmps.forEach(empId => {
      const emp = EMPS.find(e => e.id === empId);
      if (!emp) return;
      const shift = todayShifts.find(s => s.empId === empId);
      const rec = todayCheckins.find(r => r.empId === empId);
      let statusIcon, statusText, statusColor, timeInfo = '';
      if (rec && rec.checkOut) {
        statusIcon = '✅'; statusColor = 'var(--text-muted)';
        const hrs = rec.totalHours ? (Math.round(rec.totalHours * 10) / 10) : 0;
        statusText = `${hrs}h gearbeitet`;
        timeInfo = new Date(rec.checkIn).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}) + '–' + new Date(rec.checkOut).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
      } else if (rec && !rec.checkOut) {
        statusIcon = '🟢'; statusColor = 'var(--success)';
        const elapsed = Math.round((Date.now() - new Date(rec.checkIn).getTime()) / 3600000 * 10) / 10;
        statusText = `${elapsed}h aktiv`;
        timeInfo = 'seit ' + new Date(rec.checkIn).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
      } else {
        const [sh, sm] = (shift?.from || '09:00').split(':').map(Number);
        const shiftStart = new Date(); shiftStart.setHours(sh, sm, 0, 0);
        if (Date.now() > shiftStart.getTime() + 5 * 60000) {
          statusIcon = '🔴'; statusColor = 'var(--danger)';
          const lateM = Math.round((Date.now() - shiftStart.getTime()) / 60000);
          statusText = `${lateM}m überfällig`;
        } else {
          statusIcon = '⚪'; statusColor = 'var(--text-muted)';
          statusText = `erwartet ${shift?.from || ''}`;
        }
        timeInfo = '—';
      }
      const lateBadge = rec?.isLate ? `<span style="color:var(--danger);font-size:.7rem"> ⏰+${rec.lateMin}m</span>` : '';
      attHtml += `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:1.1rem">${statusIcon}</div>
        <div class="emp-avatar" style="width:32px;height:32px;font-size:.7rem">${emp.avatar}</div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:.85rem;color:${statusColor}">${emp.name}${lateBadge}</div>
          <div style="font-size:.72rem;color:var(--text-muted)">${emp.dept} · ${shift?.from}–${shift?.to}</div>
        </div>
        <div style="font-family:'Space Mono',monospace;font-size:.78rem;color:var(--text-muted)">${timeInfo}</div>
      </div>`;
    });
    if (!todayShiftEmps.length) attHtml += '<p style="color:var(--text-muted)">Keine Schichten heute</p>';
    document.getElementById('dashAttendance').innerHTML = attHtml;
  }
  updateBadges();
}

function updateBadges(){
  const pv=can('seeAllVacations')?getVisibleVacs().filter(v=>v.status==='pending').length:0;
  const as=can('seeAllSick')?getVisibleSicks().filter(s=>s.status==='active').length:0;
  const vb=document.getElementById('vacBadge'),sb=document.getElementById('sickBadge');
  if(vb){vb.style.display=pv?'':'none';vb.textContent=pv;}
  if(sb){sb.style.display=as?'':'none';sb.textContent=as;}
  document.getElementById('notifDot').style.display=getVisibleNotifs().some(n=>n.unread)?'':'none';
}

// ═══ DASHBOARD BANNER UPLOAD ═══
function changeDashBanner(input){
  const file=input.files?.[0];
  if(!file) return;
  if(file.size > 5*1024*1024){toast('Bild zu groß (max 5 MB)','err');return;}
  const reader=new FileReader();
  reader.onload=async function(e){
    const dataUrl=e.target.result;
    const bannerKey='okyu_banner_'+currentUser.id;
    localStorage.setItem(bannerKey, dataUrl);
    // Apply immediately
    const welcome=document.querySelector('.dash-welcome');
    if(welcome){
      welcome.style.backgroundImage=`url('${dataUrl}')`;
      welcome.style.backgroundSize='cover';
      welcome.style.backgroundPosition='center';
    }
    toast('Hintergrundbild gespeichert ✓');

    // Also upload to Supabase Storage
    try {
      const ext=file.name.split('.').pop();
      const path=`banners/${currentUser.id}.${ext}`;
      const {data,error}=await sb.storage.from('uploads').upload(path, file, {upsert:true});
      if(!error){
        const {data:urlData}=sb.storage.from('uploads').getPublicUrl(path);
        if(urlData?.publicUrl){
          await sb.from('user_profiles').update({banner_url:urlData.publicUrl}).eq('user_id',currentUser.id);
          localStorage.setItem(bannerKey, urlData.publicUrl);
          console.log('[Banner] ✓ Uploaded:', urlData.publicUrl);
        }
      } else {
        console.warn('[Banner] Upload failed, using local only:', error.message);
      }
    } catch(e){ console.warn('[Banner] Storage not available, local only'); }
  };
  reader.readAsDataURL(file);
}

// ═══ EMPLOYEES ═══
function renderEmployees(){
  const pg=document.getElementById('page-employees');
  if(!can('seeAllEmployees')){pg.innerHTML=permBanner('Mitarbeiter-Ansicht ist nur für Manager und Inhaber verfügbar.');return;}
  const emps=getVisibleEmps();
  const isAdmin=can('seeFinancials');
  pg.innerHTML=`<div class="table-wrap"><div class="table-header"><span class="table-title">Mitarbeiterliste</span><div class="table-actions">
    <input class="form-input" style="width:200px;margin:0" placeholder="Suchen..." oninput="filterEmps(this.value)">
    ${can('editEmployees')?'<button class="btn btn-primary" onclick="openModal(\'addEmployee\')">+ Mitarbeiter</button>':''}
  </div></div><div style="overflow-x:auto"><table><thead><tr><th>Name</th><th>Standort</th><th>Bereich</th><th>Position</th><th>Resturlaub</th><th>Krankentage</th><th>Verspätungen</th>${isAdmin?'<th>🎓 Schule</th><th>Plan-Std.</th><th>Soll-Std.</th><th>Brutto</th><th>€/Std.</th>':''}<th>Status</th><th>Aktionen</th></tr></thead><tbody id="empTB"></tbody></table></div></div>`;
  renderEmpRows(emps);
}
function renderEmpRows(emps){
  const isAdmin=can('seeFinancials');
  document.getElementById('empTB').innerHTML=emps.map(e=>{
    const vr=e.vacTotal-e.vacUsed;const pl=VACS.filter(v=>v.empId===e.id&&(v.status==='approved'||v.status==='pending')&&v.from>='2026-03-20').reduce((s,v)=>s+v.days,0);
    const planH=calcPlanHours(e.id);
    const hourly=calcHourly(e);
    const sollDiff=e.sollStunden>0?planH-e.sollStunden:0;
    const sollColor=sollDiff>=0?'var(--success)':sollDiff>=-10?'var(--warning)':'var(--danger)';
    return`<tr><td><div style="display:flex;align-items:center;gap:10px"><div class="emp-avatar">${e.avatar}</div><strong style="color:var(--text-primary)">${e.name}</strong></div></td>
    <td>${getLocationName(e.location)}</td><td>${e.dept}</td><td>${e.position}</td>
    <td><span class="emp-pill vac">${vr-pl}/${e.vacTotal}</span></td>
    <td><span class="emp-pill sick">${e.sickDays}T</span></td>
    <td>${e.lateCount?`<span class="emp-pill late">${e.lateCount}×</span>`:'—'}</td>
    ${isAdmin?`<td>${e.schuleTage>0?`<span class="emp-pill" style="background:rgba(162,155,254,.12);color:#a29bfe">${e.schuleTage}T</span>`:'—'}</td>
    <td><span style="font-family:'Space Mono',monospace;font-size:.8rem;color:${sollColor}">${planH}h</span></td>
    <td><span style="font-family:'Space Mono',monospace;font-size:.8rem">${e.sollStunden}h</span></td>
    <td><span style="font-family:'Space Mono',monospace;font-size:.8rem">${formatEuro(e.bruttoGehalt)}</span></td>
    <td><span style="font-family:'Space Mono',monospace;font-size:.8rem">${formatEuro(hourly)}</span></td>`:''}
    <td>${statusBadge(e.status)}</td>
    <td><button class="btn btn-sm" onclick="viewEmp(${e.id})">Details</button>${can('markLate')?` <button class="btn btn-sm" onclick="openLateModal(${e.id})">⏰</button>`:''}</td></tr>`;
  }).join('');
}
function filterEmps(q){const emps=getVisibleEmps().filter(e=>e.name.toLowerCase().includes(q.toLowerCase())||e.dept.toLowerCase().includes(q.toLowerCase()));renderEmpRows(emps);}
function viewEmp(id){
  const e=EMPS.find(x=>x.id===id);if(!e)return;
  const ev=VACS.filter(v=>v.empId===id),es=SICKS.filter(s=>s.empId===id),ed=DOCS.filter(d=>d.empId===id);
  const vr=e.vacTotal-e.vacUsed,pl=ev.filter(v=>(v.status==='approved'||v.status==='pending')&&v.from>='2026-03-20').reduce((s,v)=>s+v.days,0);
  const planH=calcPlanHours(e.id);
  const hourly=calcHourly(e);
  const isAdmin=can('seeFinancials');

  let adminSection='';
  if(isAdmin){
    adminSection=`
    <hr style="border-color:var(--border);margin:16px 0">
    <h4 style="margin-bottom:12px">💰 Gehalt & Stunden <span class="badge badge-info" style="font-size:.6rem;vertical-align:middle">Nur Inhaber</span></h4>
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Soll-Stunden / Monat</label>
        <input class="form-input" type="number" id="edSoll" value="${e.sollStunden}" onchange="recalcSalary(${e.id},'soll')"></div>
      <div class="form-group"><label class="form-label">Plan-Stunden (aktueller Monat)</label>
        <div style="font-family:'Space Mono',monospace;font-size:1.1rem;padding:10px 0;color:${planH>=e.sollStunden?'var(--success)':'var(--danger)'}">${planH}h <span style="font-size:.75rem;color:var(--text-muted)">von ${e.sollStunden}h Soll</span></div></div>
      <div class="form-group"><label class="form-label">Brutto Gehalt / Monat</label>
        <input class="form-input" type="number" step="0.01" id="edBrutto" value="${e.bruttoGehalt}" onchange="recalcSalary(${e.id},'brutto')"></div>
      <div class="form-group"><label class="form-label">Gehalt / Stunde (berechnet)</label>
        <input class="form-input" type="number" step="0.01" id="edHourly" value="${hourly}" onchange="recalcSalary(${e.id},'hourly')"></div>
    </div>
    <hr style="border-color:var(--border);margin:16px 0">
    <h4 style="margin-bottom:12px">📅 Urlaubstage & 🎓 Schule/Fortbildung <span class="badge badge-info" style="font-size:.6rem;vertical-align:middle">Bearbeitbar</span></h4>
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Urlaubstage Gesamt / Jahr</label>
        <input class="form-input" type="number" id="edVacTotal" value="${e.vacTotal}" onchange="updateEmpField(${e.id},'vacTotal',this.value)"></div>
      <div class="form-group"><label class="form-label">Urlaubstage genommen</label>
        <input class="form-input" type="number" id="edVacUsed" value="${e.vacUsed}" onchange="updateEmpField(${e.id},'vacUsed',this.value)"></div>
      <div class="form-group"><label class="form-label">Schule / Fortbildung (Tage/Monat)</label>
        <input class="form-input" type="number" id="edSchule" value="${e.schuleTage}" onchange="updateEmpField(${e.id},'schuleTage',this.value)"></div>
      <div class="form-group"><label class="form-label">Verbleibender Resturlaub</label>
        <div style="font-family:'Space Mono',monospace;font-size:1.3rem;padding:10px 0;color:var(--success)" id="edVacRemain">${vr-pl} Tage</div></div>
    </div>`;
  }

  const deptOpts=DEPTS.map(d=>d.name).filter((v,i,a)=>a.indexOf(v)===i);
  const locOpts=LOCS;
  openModalC('Mitarbeiter: '+e.name,`
    <div class="form-grid">
      <div class="form-group"><div class="form-label">Position</div>
        <input class="form-input" value="${e.position}" onchange="updateEmpText(${e.id},'position',this.value)">
      </div>
      <div class="form-group"><div class="form-label">Standort</div>
        <select class="form-select" onchange="updateEmpText(${e.id},'location',this.value)">${locOpts.map(l=>`<option value="${l.id}" ${l.id===e.location?'selected':''}>${l.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><div class="form-label">Bereich</div>
        <select class="form-select" onchange="updateEmpText(${e.id},'dept',this.value)">${deptOpts.map(d=>`<option ${d===e.dept?'selected':''}>${d}</option>`).join('')}</select>
      </div>
      <div class="form-group"><div class="form-label">Eintritt</div>${formatDateDE(e.start)}</div>
    </div>
    <div class="stats-row" style="margin-top:16px">
      <div class="stat-card" style="border-left:3px solid var(--info)"><div class="stat-label">Resturlaub</div><div class="stat-value" style="font-size:1.4rem">${vr-pl}<small style="font-size:.7rem;color:var(--text-muted)">/${e.vacTotal}</small></div><div class="stat-change">${pl} geplant</div></div>
      <div class="stat-card" style="border-left:3px solid var(--danger)"><div class="stat-label">Krankentage</div><div class="stat-value" style="font-size:1.4rem">${e.sickDays}</div></div>
      <div class="stat-card" style="border-left:3px solid var(--late-color)"><div class="stat-label">Verspätungen</div><div class="stat-value" style="font-size:1.4rem">${e.lateCount}</div></div>
      ${isAdmin?`<div class="stat-card" style="border-left:3px solid var(--accent)"><div class="stat-label">Plan-Std.</div><div class="stat-value" style="font-size:1.4rem">${planH}h</div><div class="stat-change">Soll: ${e.sollStunden}h</div></div>`:''}
    </div>
    ${adminSection}
    <hr style="border-color:var(--border);margin:16px 0"><h4 style="margin-bottom:8px">Urlaub (${ev.length})</h4>
    ${ev.map(v=>`<div class="emp-row"><div class="emp-details"><div class="emp-name-sm">${formatDateDE(v.from)}–${formatDateDE(v.to)} (${v.days}T)</div><div class="emp-dept">${v.note||''}</div></div>${v.status==='approved'?'<span class="badge badge-success">OK</span>':v.status==='pending'?'<span class="badge badge-warning">Offen</span>':'<span class="badge badge-danger">Abg.</span>'}</div>`).join('')||'<p style="color:var(--text-muted);font-size:.82rem">—</p>'}
    <h4 style="margin:16px 0 8px">Krankmeldungen (${es.length})</h4>
    ${es.map(s=>`<div class="emp-row"><div class="emp-details"><div class="emp-name-sm">${formatDateDE(s.from)}–${formatDateDE(s.to)} (${s.days}T)</div><div class="emp-dept">${s.note||''}</div></div>${s.hasAU?'<span class="badge badge-success">AU</span>':'<span class="badge badge-neutral">—</span>'}</div>`).join('')||'<p style="color:var(--text-muted);font-size:.82rem">—</p>'}
    <h4 style="margin:16px 0 8px">Dokumente (${ed.length})</h4>
    ${ed.map(d=>`<div class="emp-row"><div style="font-size:1.3rem">${d.icon}</div><div class="emp-details"><div class="emp-name-sm">${d.name}</div><div class="emp-dept">${formatDateDE(d.date)}</div></div></div>`).join('')||'<p style="color:var(--text-muted);font-size:.82rem">—</p>'}
  `);
}

// Recalculate salary fields
function recalcSalary(empId, changed){
  const e=EMPS.find(x=>x.id===empId);if(!e)return;
  const soll=parseFloat(document.getElementById('edSoll').value)||0;
  const brutto=parseFloat(document.getElementById('edBrutto').value)||0;
  const hourly=parseFloat(document.getElementById('edHourly').value)||0;
  e.sollStunden=soll;
  if(changed==='brutto'){
    e.bruttoGehalt=brutto;
    const h=soll>0?Math.round(brutto/soll*100)/100:0;
    document.getElementById('edHourly').value=h;
  } else if(changed==='hourly'){
    const m=Math.round(hourly*soll*100)/100;
    e.bruttoGehalt=m;
    document.getElementById('edBrutto').value=m;
  } else if(changed==='soll'){
    e.sollStunden=soll;
    // Recalc hourly from existing brutto
    const h=soll>0?Math.round(e.bruttoGehalt/soll*100)/100:0;
    document.getElementById('edHourly').value=h;
  }
  // Save to Supabase
  syncEmployeeField(empId, 'sollStunden', e.sollStunden);
  syncEmployeeField(empId, 'bruttoGehalt', e.bruttoGehalt);
  toast('Gehaltsdaten gespeichert ✓');
}

// Update arbitrary employee field
function updateEmpField(empId, field, value){
  const e=EMPS.find(x=>x.id===empId);if(!e)return;
  e[field]=parseInt(value)||0;
  if(field==='vacTotal'||field==='vacUsed'){
    const pl=VACS.filter(v=>v.empId===empId&&(v.status==='approved'||v.status==='pending')&&v.from>='2026-03-20').reduce((s,v)=>s+v.days,0);
    const remain=e.vacTotal-e.vacUsed-pl;
    const el=document.getElementById('edVacRemain');
    if(el)el.innerHTML=`<span style="color:${remain<5?'var(--warning)':'var(--success)'}">${remain} Tage</span>`;
  }
  toast(field==='schuleTage'?'Schule/Fortbildung aktualisiert':'Aktualisiert');
  syncEmployeeField(empId, field, e[field]);
}
function updateEmpText(empId, field, value){
  const e=EMPS.find(x=>x.id===empId);if(!e)return;
  e[field]=value;
  syncEmployeeField(empId, field, value);
  toast('Aktualisiert: '+field);
}
function openLateModal(empId){
  const e=EMPS.find(x=>x.id===empId);
  document.getElementById('modalTitle').textContent='Verspätung – '+e.name;
  document.getElementById('modalBody').innerHTML=`<div class="form-grid"><div class="form-group"><label class="form-label">Datum</label><input class="form-input" type="date" id="mLD" value="${isoDate(new Date())}"></div><div class="form-group"><label class="form-label">Minuten</label><input class="form-input" type="number" id="mLM" min="1" value="15"></div><div class="form-group full"><label class="form-label">Bemerkung</label><input class="form-input" id="mLN"></div></div>`;
  document.getElementById('modalFooter').innerHTML=`<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="saveLate(${empId})">Vermerken</button>`;
  document.getElementById('modalOverlay').classList.remove('hidden');
}
function saveLate(empId){const e=EMPS.find(x=>x.id===empId);const m=parseInt(document.getElementById('mLM').value)||0;if(m<=0)return;e.lateCount++;syncEmployeeField(e.id,'lateCount',e.lateCount);const d=document.getElementById('mLD').value;const sh=SHIFTS.find(s=>s.empId===empId&&s.date===d);if(sh){sh.isLate=true;sh.lateMin=m;}addNotif('late','Verspätung',`${e.name}: ${m} Min.`);closeModal();toast(`Verspätung vermerkt`,'warn');renderPage(getCurrentPage());}

// ═══ DEPARTMENTS ═══
function renderDepts(){
  const pg=document.getElementById('page-departments');
  if(!can('seeAllEmployees')){pg.innerHTML=permBanner('Bereichsübersicht ist nur für Manager und Inhaber verfügbar.');return;}
  const depts=currentUser.location==='all'?(currentLocation==='all'?DEPTS:DEPTS.filter(d=>d.location===currentLocation)):DEPTS.filter(d=>d.location===currentUser.location);
  const isAdmin=can('seeFinancials');
  const today=isoDate(new Date());

  let html='<div style="display:grid;gap:16px">';
  depts.forEach(dept=>{
    const deptEmps=EMPS.filter(e=>e.dept===dept.name&&e.location===dept.location);
    const activeCount=deptEmps.filter(e=>e.status==='active').length;
    const sickCount=deptEmps.filter(e=>e.status==='sick').length;
    const vacCount=deptEmps.filter(e=>e.status==='vacation').length;
    const totalHours=deptEmps.reduce((s,e)=>s+calcPlanHours(e.id),0);
    const sollHours=deptEmps.reduce((s,e)=>s+e.sollStunden,0);
    const hoursPct=sollHours>0?Math.round(totalHours/sollHours*100):0;
    const totalCost=isAdmin?deptEmps.reduce((s,e)=>s+e.bruttoGehalt,0):0;
    const todayShifts=SHIFTS.filter(s=>s.dept===dept.name&&s.location===dept.location&&s.date===today&&!s.isSick&&!s.isVacation);
    const deptId='dept_'+dept.id;

    html+=`<div class="dash-card">
      <div class="dash-card-header" style="cursor:pointer;user-select:none" onclick="document.getElementById('${deptId}').style.display=document.getElementById('${deptId}').style.display==='none'?'block':'none';this.querySelector('.dept-arrow').textContent=document.getElementById('${deptId}').style.display==='none'?'▸':'▾'">
        <div style="width:4px;height:28px;border-radius:4px;background:${dept.color};margin-right:8px"></div>
        <div style="flex:1">
          <div style="font-size:.95rem">${dept.name} <span style="font-weight:400;color:var(--text-muted);font-size:.78rem">· ${LOCS.find(l=>l.id===dept.location)?.city||''}</span></div>
          <div style="font-size:.72rem;color:var(--text-muted);font-weight:400;margin-top:2px">Leitung: ${dept.head}</div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;font-size:.78rem;font-weight:400">
          <span title="Aktiv">👥 ${activeCount}</span>
          ${sickCount?`<span style="color:var(--danger)" title="Krank">🏥 ${sickCount}</span>`:''}
          ${vacCount?`<span style="color:var(--info)" title="Urlaub">🏖️ ${vacCount}</span>`:''}
          <span title="Heute im Dienst">📋 ${todayShifts.length}</span>
          ${isAdmin?`<span style="font-family:'Space Mono',monospace" title="Personalkosten">💰 ${formatEuro(totalCost)}</span>`:''}
        </div>
        <span class="dept-arrow" style="margin-left:12px;font-size:1rem;color:var(--text-muted)">▸</span>
      </div>
      <div id="${deptId}" style="display:none">
        <div style="padding:16px 20px;border-top:1px solid var(--border)">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="flex:1">
              <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:4px">Plan-Stunden: ${totalHours}h / ${sollHours}h Soll (${hoursPct}%)</div>
              <div style="background:var(--bg-input);border-radius:8px;height:8px;overflow:hidden">
                <div style="background:${hoursPct>=90?'var(--success)':hoursPct>=70?'var(--warning)':'var(--danger)'};height:100%;width:${Math.min(hoursPct,100)}%;border-radius:8px;transition:width .5s"></div>
              </div>
            </div>
          </div>
          <table style="width:100%"><thead><tr>
            <th style="text-align:left;font-size:.72rem;padding:6px 8px">Mitarbeiter</th>
            <th style="text-align:left;font-size:.72rem;padding:6px 8px">Position</th>
            <th style="text-align:center;font-size:.72rem;padding:6px 8px">Status</th>
            <th style="text-align:right;font-size:.72rem;padding:6px 8px">Plan-Std.</th>
            ${isAdmin?'<th style="text-align:right;font-size:.72rem;padding:6px 8px">Brutto</th>':''}
          </tr></thead><tbody>
          ${deptEmps.map(e=>{
            const planH=calcPlanHours(e.id);
            const pctH=e.sollStunden>0?Math.round(planH/e.sollStunden*100):0;
            return `<tr style="border-top:1px solid var(--border)">
              <td style="padding:8px"><div style="display:flex;align-items:center;gap:8px"><div class="emp-avatar" style="width:28px;height:28px;font-size:.65rem">${e.avatar}</div><strong style="font-size:.82rem;color:var(--text-primary)">${e.name}</strong></div></td>
              <td style="padding:8px;font-size:.78rem;color:var(--text-muted)">${e.position}</td>
              <td style="padding:8px;text-align:center">${statusBadge(e.status)}</td>
              <td style="padding:8px;text-align:right"><span style="font-family:'Space Mono',monospace;font-size:.78rem;color:${pctH>=90?'var(--success)':pctH>=70?'var(--warning)':'var(--text-muted)'}">${planH}h</span><span style="font-size:.65rem;color:var(--text-muted)">/${e.sollStunden}h</span></td>
              ${isAdmin?`<td style="padding:8px;text-align:right;font-family:'Space Mono',monospace;font-size:.78rem">${formatEuro(e.bruttoGehalt)}</td>`:''}
            </tr>`;
          }).join('')}
          </tbody></table>
          ${todayShifts.length?`<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
            <div style="font-size:.75rem;color:var(--text-muted);font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">📋 Heute im Dienst</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px">${todayShifts.map(s=>`<div style="display:flex;align-items:center;gap:6px;padding:4px 10px;background:var(--bg-input);border-radius:8px;font-size:.78rem"><strong>${s.empName.split(' ')[0]}</strong><span style="color:var(--text-muted)">${s.from}–${s.to}</span></div>`).join('')}</div>
          </div>`:''}
        </div>
      </div>
    </div>`;
  });
  html+='</div>';
  pg.innerHTML=html;
}

// ═══ SCHEDULE ═══
function setView(v,btn){scheduleView=v;document.querySelectorAll('.view-toggle .btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderSchedule();}
function schedNav(dir){if(scheduleView==='day')scheduleDate.setDate(scheduleDate.getDate()+dir);else if(scheduleView==='week')scheduleDate.setDate(scheduleDate.getDate()+7*dir);else scheduleDate.setMonth(scheduleDate.getMonth()+dir);renderSchedule();}

function renderSchedule(){
  const pg=document.getElementById('page-schedule');
  const canEdit=can('editSchedules');const canExp=can('canExport');
  const isEmp=currentUser.role==='mitarbeiter';
  const me=EMPS.find(e=>e.id===currentUser.empId);

  let banner=isEmp?permBanner(`Du siehst den Arbeitsplan deines Bereichs (${me?.dept||''} – ${getLocationName(me?.location||'')})`).trim():'';
  let controls=`<div class="schedule-controls">
    <div class="view-toggle"><button class="btn${scheduleView==='day'?' active':''}" onclick="setView('day',this)">Tag</button><button class="btn${scheduleView==='week'?' active':''}" onclick="setView('week',this)">Woche</button><button class="btn${scheduleView==='month'?' active':''}" onclick="setView('month',this)">Monat</button></div>
    <div class="calendar-nav"><button onclick="schedNav(-1)">◀</button><span class="calendar-month" id="schedLabel"></span><button onclick="schedNav(1)">▶</button></div>
    <div style="flex:1"></div>
    ${canEdit?`<select class="form-select" style="width:150px" id="schedDept" onchange="scheduleDept=this.value;renderSchedule()"><option value="all"${scheduleDept==='all'?' selected':''}>Alle Bereiche</option>${[...new Set(DEPTS.map(d=>d.name))].sort().map(d=>`<option value="${d}"${scheduleDept===d?' selected':''}>${d}</option>`).join('')}</select>`:''}    ${canEdit?`<select class="form-select" style="width:140px" id="schedSort" onchange="scheduleSort=this.value;renderSchedule()"><option value="name"${scheduleSort==='name'?' selected':''}>↕ Name</option><option value="dept"${scheduleSort==='dept'?' selected':''}>↕ Bereich</option><option value="hours"${scheduleSort==='hours'?' selected':''}>↕ Stunden ↓</option></select>`:''}
    ${canEdit?'<button class="btn" onclick="openModal(\'addShift\')">+ Schicht</button><button class="btn" onclick="copyWeek()">📋 Woche kopieren</button>':''}
    ${canEdit?`<select class="form-select" style="width:180px" id="schedTmplSel" onchange="applySavedTemplate()"><option value="">📂 Vorlage laden...</option>${SAVED_TEMPLATES.filter(t=>currentUser.location==='all'||t.location===(currentUser.location||currentLocation)).map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select><button class="btn" onclick="openModal('saveTemplate')" title="Aktuelle Woche als Vorlage speichern">💾 Vorlage</button>`:''}
    ${canExp?'<button class="btn btn-primary" onclick="exportPDF()">📄 PDF Export</button>':''}
  </div>`;

  pg.innerHTML=banner+controls+'<div id="schedC"></div>';
  let shifts=getVisibleShifts();
  if(scheduleDept!=='all')shifts=shifts.filter(s=>s.dept===scheduleDept);

  const c=document.getElementById('schedC');
  if(scheduleView==='week'){
    const weekS=getWeekStart(scheduleDate);const weekE=new Date(weekS);weekE.setDate(weekE.getDate()+6);
    document.getElementById('schedLabel').textContent=`${formatDateDE(isoDate(weekS))} – ${formatDateDE(isoDate(weekE))}`;
    let emps=[...new Set(shifts.filter(s=>{const d=new Date(s.date);return d>=weekS&&d<=weekE;}).map(s=>s.empName))];
    const dayD=[];for(let i=0;i<7;i++){const d=new Date(weekS);d.setDate(d.getDate()+i);dayD.push(isoDate(d));}
    // Add employees with approved vacation or active sick in this week
    VACS.filter(v=>v.status==='approved'&&v.to>=dayD[0]&&v.from<=dayD[6]).forEach(v=>{if(!emps.includes(v.empName))emps.push(v.empName);});
    SICKS.filter(s=>s.status==='active'&&s.to>=dayD[0]&&s.from<=dayD[6]).forEach(s=>{if(!emps.includes(s.empName))emps.push(s.empName);});
    emps.sort();
    // Sort by selected criteria
    const sortBy=scheduleSort;
    if(sortBy==='dept'){
      emps.sort((a,b)=>{
        const da=EMPS.find(e=>e.name===a)?.dept||'';const db=EMPS.find(e=>e.name===b)?.dept||'';
        return da.localeCompare(db)||a.localeCompare(b);
      });
    } else if(sortBy==='hours'){
      emps.sort((a,b)=>{
        const ha=shifts.filter(s=>s.empName===a&&!s.isSick&&!s.isVacation&&dayD.includes(s.date)).reduce((sum,s)=>{const[fh,fm]=s.from.split(':').map(Number);const[th,tm]=s.to.split(':').map(Number);return sum+(th+tm/60)-(fh+fm/60);},0);
        const hb=shifts.filter(s=>s.empName===b&&!s.isSick&&!s.isVacation&&dayD.includes(s.date)).reduce((sum,s)=>{const[fh,fm]=s.from.split(':').map(Number);const[th,tm]=s.to.split(':').map(Number);return sum+(th+tm/60)-(fh+fm/60);},0);
        return hb-ha;
      });
    }
    const showH=can('seeFinancials');
    let h='<div class="table-wrap" style="overflow-x:auto"><table><thead><tr><th style="min-width:140px">Mitarbeiter</th>';
    dayD.forEach((ds,i)=>{const d=new Date(ds);h+=`<th>${DAYS_DE[i]} ${d.getDate()}.${d.getMonth()+1}</th>`;});
    if(showH)h+='<th style="text-align:right">Σ Std.</th>';
    h+='</tr></thead><tbody>';
    emps.forEach(emp=>{
      h+=`<tr><td><strong style="color:var(--text-primary)">${emp}</strong></td>`;
      let weekH=0;
      dayD.forEach(ds=>{
        const dayS=shifts.filter(s=>s.date===ds&&s.empName===emp);
        dayS.forEach(s=>{if(!s.isSick&&!s.isVacation){const[fh,fm]=s.from.split(':').map(Number);const[th,tm]=s.to.split(':').map(Number);weekH+=(th+tm/60)-(fh+fm/60);}});
        h+=`<td class="shift-cell" data-date="${ds}" data-emp="${emp}" ${canEdit?'ondragover="onDragOver(event)" ondrop="onDrop(event)" ondragleave="onDragLeave(event)"':''}>`;
        let cellHas = dayS.length > 0;
        dayS.forEach(s=>{
          // Cross-reference with GPS check-in
          const tr = TIME_RECORDS.find(r => r.shiftId === s.id || (r.empId === s.empId && r.checkIn && r.checkIn.startsWith(ds)));
          if (tr && tr.isLate && !s.isLate) { s.isLate = true; s.lateMin = tr.lateMin || 0; }
          // Compact mode for special days
          if (s.isSick) {
            h+=`<div class="shift-block compact-block is-sick"
              ${canEdit?`draggable="true" ondragstart="onDragStart(event,${s.id})" ondragend="onDragEnd(event)"`:''}  data-sid="${s.id}">
              <span class="compact-letter">K</span>
              ${canEdit?`<div class="shift-actions"><button class="shift-action-btn sick-btn" onclick="event.stopPropagation();markSick(${s.id})" title="Gesund">✅</button><button class="shift-action-btn" onclick="event.stopPropagation();deleteShift(${s.id})" title="Löschen" style="color:var(--danger)">🗑️</button></div>`:''}</div>`;
          } else if (s.isVacation) {
            const vLetter = s.vacHalf ? 'A' : 'B';
            const vClass = s.vacHalf ? 'is-vacation vac-half' : 'is-vacation';
            h+=`<div class="shift-block compact-block ${vClass}"
              ${canEdit?`draggable="true" ondragstart="onDragStart(event,${s.id})" ondragend="onDragEnd(event)"`:''}  data-sid="${s.id}">
              <span class="compact-letter">${vLetter}</span>
              ${canEdit?`<div class="shift-actions"><button class="shift-action-btn vac-btn" onclick="event.stopPropagation();markVac(${s.id})" title="Aufheben">✅</button><button class="shift-action-btn" onclick="event.stopPropagation();deleteShift(${s.id})" title="Löschen" style="color:var(--danger)">🗑️</button></div>`:''}</div>`;
          } else if (s.label === 'Schule' || s.colorClass === 'schule') {
            h+=`<div class="shift-block compact-block schule"
              ${canEdit?`draggable="true" ondragstart="onDragStart(event,${s.id})" ondragend="onDragEnd(event)"`:''}  data-sid="${s.id}">
              <span class="compact-letter">S</span>
              <div class="shift-time">${s.from}–${s.to}</div>
              ${canEdit?`<div class="shift-actions"><button class="shift-action-btn sick-btn" onclick="event.stopPropagation();markSick(${s.id})" title="Krank">🏥</button><button class="shift-action-btn" onclick="event.stopPropagation();deleteShift(${s.id})" title="Löschen" style="color:var(--danger)">🗑️</button></div>`:''}</div>`;
          } else {
            h+=`<div class="shift-block ${s.colorClass} ${s.isLate?'is-late':''}"
              ${canEdit?`draggable="true" ondragstart="onDragStart(event,${s.id})" ondragend="onDragEnd(event)"`:''}  data-sid="${s.id}">
              <div class="shift-name">${s.label}${s.isLate?' <span class="late-marker">⏰+'+s.lateMin+'m</span>':''}</div>
              <div class="shift-time">${s.from}–${s.to}</div>
              ${canEdit?`<div class="shift-actions"><button class="shift-action-btn sick-btn" onclick="event.stopPropagation();markSick(${s.id})" title="Krank">🏥</button><button class="shift-action-btn vac-btn" onclick="event.stopPropagation();markVac(${s.id})" title="Urlaub">🏖️</button><button class="shift-action-btn late-btn" onclick="event.stopPropagation();markLateShift(${s.id})" title="Verspätet">⏰</button><button class="shift-action-btn" onclick="event.stopPropagation();deleteShift(${s.id})" title="Löschen" style="color:var(--danger)">🗑️</button></div>`:''}</div>`;
          }
        });

        // Show approved vacations for this emp+date (if no shift already marked)
        const empObj = EMPS.find(e=>e.name===emp);
        if (empObj && !dayS.some(s=>s.isVacation)) {
          const vac = VACS.find(v=>v.empId===empObj.id && v.status==='approved' && ds>=v.from && ds<=v.to);
          if (vac) {
            const vType = getVacTypeForDate(ds, empObj.location);
            if (vType) {
              const vClass = vType === 'A' ? 'is-vacation vac-half' : 'is-vacation';
              h+=`<div class="shift-block compact-block ${vClass}"><span class="compact-letter">${vType}</span></div>`;
              cellHas = true;
            }
          }
        }
        // Show active sick leaves for this emp+date (if no shift already marked)
        if (empObj && !dayS.some(s=>s.isSick)) {
          const sick = SICKS.find(s=>s.empId===empObj.id && s.status==='active' && ds>=s.from && ds<=s.to);
          if (sick) {
            const sType = getVacTypeForDate(ds, empObj.location);
            if (sType) {
              h+=`<div class="shift-block compact-block is-sick"><span class="compact-letter">K</span></div>`;
              cellHas = true;
            }
          }
        }

        if(!cellHas){
          // Check if this is a Ruhetag for employee's location
          const ruheEmp = empObj || EMPS.find(e=>e.name===emp);
          const ruheLoc = ruheEmp?.location || '';
          const ruheType = getVacTypeForDate(ds, ruheLoc);
          if(!ruheType){
            h+='<div class="ruhetag-cell"><span class="ruhetag-label">Ruhetag</span></div>';
          } else {
            h+='<span style="color:var(--text-muted);font-size:.7rem">—</span>';
          }
        }
        h+='</td>';
      });
      if(showH)h+=`<td style="text-align:right;font-family:'Space Mono',monospace;font-size:.82rem;font-weight:700">${Math.round(weekH*10)/10}h</td>`;
      h+='</tr>';
    });
    if(!emps.length)h+=`<tr><td colspan="${8+(showH?1:0)}" style="text-align:center;color:var(--text-muted)">Keine Schichten</td></tr>`;
    h+='</tbody></table></div>';c.innerHTML=h;
  } else if(scheduleView==='day'){
    document.getElementById('schedLabel').textContent=scheduleDate.toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
    const ds=isoDate(scheduleDate);const dayS=shifts.filter(s=>s.date===ds);const seen=new Set();
    let h='<div class="table-wrap"><table><thead><tr><th>Mitarbeiter</th><th>Bereich</th><th>Schicht</th><th>Status</th>'+(canEdit?'<th>Aktionen</th>':'')+'</tr></thead><tbody>';
    dayS.forEach(s=>{if(seen.has(s.empId))return;seen.add(s.empId);
      const st=s.isSick?'<span class="badge badge-danger">Krank</span>':s.isVacation?'<span class="badge badge-info">Urlaub</span>':s.isLate?`<span class="badge badge-late">⏰+${s.lateMin}m</span>`:'<span class="badge badge-success">Aktiv</span>';
      h+=`<tr><td><strong style="color:var(--text-primary)">${s.empName}</strong></td><td>${s.dept}</td><td><div class="shift-block ${s.colorClass} ${s.isSick?'is-sick':''} ${s.isVacation?'is-vacation':''}">${s.label} (${s.from}–${s.to})</div></td><td>${st}</td>`;
      if(canEdit)h+=`<td><button class="btn btn-sm" onclick="markSick(${s.id})">🏥</button> <button class="btn btn-sm" onclick="markVac(${s.id})">🏖️</button> <button class="btn btn-sm" onclick="markLateShift(${s.id})">⏰</button></td>`;
      h+='</tr>';});
    if(!seen.size)h+='<tr><td colspan="'+(canEdit?5:4)+'" style="text-align:center;color:var(--text-muted)">Keine Schichten</td></tr>';
    h+='</tbody></table></div>';c.innerHTML=h;
  } else {
    document.getElementById('schedLabel').textContent=MONTHS_DE[scheduleDate.getMonth()]+' '+scheduleDate.getFullYear();
    const y=scheduleDate.getFullYear(),m=scheduleDate.getMonth();const fd=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),so=fd===0?6:fd-1;
    let h='<div class="calendar-grid">';DAYS_DE.forEach(d=>h+=`<div class="cal-day-header">${d}</div>`);
    for(let i=0;i<so;i++)h+='<div class="cal-day other-month"></div>';
    for(let d=1;d<=dim;d++){const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const cnt=shifts.filter(s=>s.date===ds).length;
      h+=`<div class="cal-day${ds===isoDate(new Date())?' today':''}"><div class="cal-day-num">${d}</div>${cnt?`<div class="cal-event vacation">${cnt} Schichten</div>`:''}`;h+='</div>';}
    h+='</div>';c.innerHTML=h;
  }
}

// Drag & Drop (only if canEdit)
function onDragStart(e,sid){dragData={sid};e.dataTransfer.effectAllowed='move';e.target.classList.add('dragging');}
function onDragEnd(e){e.target.classList.remove('dragging');dragData=null;}
function onDragOver(e){e.preventDefault();e.currentTarget.classList.add('drag-over');}
function onDragLeave(e){e.currentTarget.classList.remove('drag-over');}
function onDrop(e){e.preventDefault();e.currentTarget.classList.remove('drag-over');if(!dragData)return;
  const cell=e.currentTarget,nd=cell.dataset.date,ne=cell.dataset.emp,sh=SHIFTS.find(s=>s.id===dragData.sid);if(!sh)return;sh.date=nd;
  if(ne&&ne!==sh.empName){const emp=EMPS.find(x=>x.name===ne);if(emp){sh.empId=emp.id;sh.empName=emp.name;sh.dept=emp.dept;sh.location=emp.location;sh.colorClass=getDeptColorClass(emp.dept);}}
  toast('Schicht verschoben');renderSchedule();}
function markSick(id){const s=SHIFTS.find(x=>x.id===id);if(!s)return;s.isSick=!s.isSick;s.isVacation=false;const e=EMPS.find(x=>x.id===s.empId);if(s.isSick){if(e){e.sickDays++;syncEmployeeField(e.id,'sickDays',e.sickDays);}addNotif('sick','Krank',`${s.empName}: ${formatDateDE(s.date)}`);}else{if(e){e.sickDays=Math.max(0,e.sickDays-1);syncEmployeeField(e.id,'sickDays',e.sickDays);}}syncUpdateShift(s);renderSchedule();}
function markVac(id){
  const s=SHIFTS.find(x=>x.id===id);if(!s)return;
  if(s.isVacation){
    // Toggle off
    s.isVacation=false;s.vacHalf=false;
  } else {
    // Auto-detect based on location + day of week
    const emp=EMPS.find(e=>e.id===s.empId);
    const loc=emp?.location||s.location||'okyu';
    const vType=getVacTypeForDate(s.date, loc);
    if(!vType){
      toast('Dieser Tag ist ein Ruhetag – kein Urlaub möglich','warn');
      return;
    }
    s.isVacation=true;s.isSick=false;
    s.vacHalf=(vType==='A');
    const label=vType==='A'?'Halber Urlaub':'Urlaub';
    toast(`${label} für ${s.empName}`);
    addNotif('vacation',label,`${s.empName}: ${formatDateDE(s.date)}`);
  }
  syncUpdateShift(s);renderSchedule();
}
function markLateShift(id){const s=SHIFTS.find(x=>x.id===id);if(!s)return;const m=prompt('Minuten verspätet:','15');if(!m||isNaN(m))return;s.isLate=true;s.lateMin=parseInt(m);const e=EMPS.find(x=>x.id===s.empId);if(e){e.lateCount++;syncEmployeeField(e.id,'lateCount',e.lateCount);}addNotif('late','Verspätung',`${s.empName}: ${m} Min.`);syncUpdateShift(s);toast('Verspätung vermerkt','warn');renderSchedule();}
function copyWeek(){const ws2=getWeekStart(scheduleDate);const nw=new Date(ws2);nw.setDate(nw.getDate()+7);let c=0;
  for(let d=0;d<7;d++){const sd=new Date(ws2);sd.setDate(sd.getDate()+d);const dd=new Date(nw);dd.setDate(dd.getDate()+d);const sds=isoDate(sd),dds=isoDate(dd);
    const src=getVisibleShifts().filter(s=>s.date===sds);SHIFTS=SHIFTS.filter(s=>s.date!==dds);
    src.forEach(s=>{const ns={...s,id:Date.now()+Math.random()*1e6|0,date:dds,isSick:false,isVacation:false,isLate:false,lateMin:0};SHIFTS.push(ns);syncAddShift(ns);c++;});}
  toast(`${c} Schichten auf Folgewoche kopiert`);renderSchedule();}
function deleteShift(id){const s=SHIFTS.find(x=>x.id===id);if(!s)return;if(!confirm(`${s.empName}: ${s.label} (${formatDateDE(s.date)}) löschen?`))return;SHIFTS=SHIFTS.filter(x=>x.id!==id);syncDeleteShift(id);toast('Schicht gelöscht','warn');renderSchedule();}
function exportPDF(){if(!can('canExport'))return;const pc=document.getElementById('schedC').innerHTML;const lbl=document.getElementById('schedLabel').textContent;const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Arbeitsplan</title><style>body{font-family:'Segoe UI',Arial,sans-serif;padding:24px;color:#222}h1{font-size:20px}h2{font-size:14px;color:#666;font-weight:normal;margin-bottom:16px}table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;border:1px solid #ddd;font-size:12px;text-align:left}th{background:#f5f5f5;font-weight:700;text-transform:uppercase;font-size:10px}.shift-block{padding:3px 6px;border-radius:3px;font-size:11px;margin:2px 0;background:#f0f0f0;border-left:3px solid #666}.shift-block.kitchen{border-left-color:#e17055;background:#fef3ef}.shift-block.service{border-left-color:#74b9ff;background:#eef5ff}.shift-block.bar{border-left-color:#00b894;background:#eefaf6}.shift-block.is-sick{border-left-color:#d63031;background:#ffeaea}.shift-block.is-vacation{border-left-color:#0984e3;background:#eaf2ff}.shift-block.is-late{border-right:3px solid #e84393}.shift-name{font-weight:600}.shift-time{font-size:10px;color:#888}.shift-actions{display:none}.table-wrap{border:none}.table-header{display:none}.late-marker{color:#e84393;font-size:9px}.calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.cal-day{border:1px solid #ddd;padding:4px;min-height:50px;font-size:11px}.cal-day-header{font-size:10px;font-weight:700;text-align:center;padding:4px;background:#f5f5f5}.cal-day-num{font-weight:700}.cal-event{font-size:9px;padding:1px 4px;background:#eef;border-radius:2px;margin-top:2px}@media print{body{padding:0}}</style></head><body><h1>Arbeitsplan – ${currentUser.role==='inhaber'?'Alle Standorte':getLocationName(currentUser.location)}</h1><h2>${lbl}</h2>${pc}<script>window.print();<\/script></body></html>`);w.document.close();}

// ═══ VACATION ═══
function renderVacation(){
  const pg=document.getElementById('page-vacation');const isEmp=currentUser.role==='mitarbeiter';const me=EMPS.find(e=>e.id===currentUser.empId);
  let banner=isEmp?permBanner(`Du siehst nur deinen eigenen Urlaub. Resturlaub: <strong>${me.vacTotal-me.vacUsed} Tage</strong>`):'';
  let tabs=can('seeAllVacations')?`<div class="tabs"><div class="tab${vacationTab==='calendar'?' active':''}" onclick="vacationTab='calendar';renderVacation()">Kalender</div><div class="tab${vacationTab==='requests'?' active':''}" onclick="vacationTab='requests';renderVacation()">Anträge</div><div class="tab${vacationTab==='overview'?' active':''}" onclick="vacationTab='overview';renderVacation()">Übersicht</div></div>`:'';
  let content='<div id="vacC"></div><button class="btn btn-primary" onclick="openModal(\'addVacation\')" style="margin-top:16px">+ Urlaubsantrag</button>';
  pg.innerHTML=banner+tabs+content;

  const vc=document.getElementById('vacC');const vacs=getVisibleVacs();
  if(isEmp){
    vacationTab='requests'; // force requests for employee
    let h=`<div class="stats-row"><div class="stat-card" style="border-left:3px solid var(--info)"><div class="stat-label">Gesamtanspruch</div><div class="stat-value" style="font-size:1.4rem">${me.vacTotal}</div></div>
    <div class="stat-card" style="border-left:3px solid var(--warning)"><div class="stat-label">Genommen</div><div class="stat-value" style="font-size:1.4rem">${me.vacUsed}</div></div>
    <div class="stat-card" style="border-left:3px solid var(--success)"><div class="stat-label">Verbleibend</div><div class="stat-value" style="font-size:1.4rem">${me.vacTotal-me.vacUsed}</div></div></div>`;
    h+='<div class="table-wrap"><table><thead><tr><th>Von</th><th>Bis</th><th>Tage</th><th>Bemerkung</th><th>Status</th></tr></thead><tbody>';
    vacs.forEach(v=>{h+=`<tr><td>${formatDateDE(v.from)}</td><td>${formatDateDE(v.to)}</td><td>${v.days}</td><td>${v.note||'—'}</td><td>${v.status==='approved'?'<span class="badge badge-success">Genehmigt</span>':v.status==='pending'?'<span class="badge badge-warning">Offen</span>':'<span class="badge badge-danger">Abgelehnt</span>'}</td></tr>`;});
    h+='</tbody></table></div>';vc.innerHTML=h;
  } else if(vacationTab==='requests'){
    let h='<div class="table-wrap"><table><thead><tr><th>Mitarbeiter</th><th>Von</th><th>Bis</th><th>Tage</th><th>Status</th>'+(can('approveVacations')?'<th>Aktionen</th>':'')+'</tr></thead><tbody>';
    vacs.forEach(v=>{h+=`<tr><td><strong style="color:var(--text-primary)">${v.empName}</strong></td><td>${formatDateDE(v.from)}</td><td>${formatDateDE(v.to)}</td><td>${v.days}</td>
    <td>${v.status==='approved'?'<span class="badge badge-success">OK</span>':v.status==='pending'?'<span class="badge badge-warning">Offen</span>':'<span class="badge badge-danger">Abg.</span>'}</td>
    ${can('approveVacations')?`<td>${v.status==='pending'?`<button class="btn btn-sm btn-success" onclick="appVac(${v.id})">✓</button> <button class="btn btn-sm btn-danger" onclick="rejVac(${v.id})">✕</button>`:'—'}</td>`:''}</tr>`;});
    h+='</tbody></table></div>';vc.innerHTML=h;
  } else if(vacationTab==='overview'){
    const emps=getVisibleEmps();
    let h='<div class="table-wrap"><table><thead><tr><th>Mitarbeiter</th><th>Gesamt</th><th>Genommen</th><th>Geplant</th><th>Rest</th></tr></thead><tbody>';
    emps.forEach(e=>{const pl=VACS.filter(v=>v.empId===e.id&&(v.status==='approved'||v.status==='pending')&&v.from>='2026-03-20').reduce((s,v)=>s+v.days,0);const r=e.vacTotal-e.vacUsed-pl;
      h+=`<tr><td><strong style="color:var(--text-primary)">${e.name}</strong></td><td>${e.vacTotal}</td><td>${e.vacUsed}</td><td>${pl}</td><td><strong style="color:${r<5?'var(--warning)':'var(--success)'}">${r}</strong></td></tr>`;});
    h+='</tbody></table></div>';vc.innerHTML=h;
  } else { // calendar
    const y=vacationCalendarMonth.getFullYear(),m=vacationCalendarMonth.getMonth();const fd=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),so=fd===0?6:fd-1;
    let h=`<div class="calendar-header"><div class="calendar-nav"><button onclick="vacationCalendarMonth.setMonth(vacationCalendarMonth.getMonth()-1);renderVacation()">◀</button><span class="calendar-month">${MONTHS_DE[m]} ${y}</span><button onclick="vacationCalendarMonth.setMonth(vacationCalendarMonth.getMonth()+1);renderVacation()">▶</button></div></div><div class="calendar-grid">`;
    DAYS_DE.forEach(d=>h+=`<div class="cal-day-header">${d}</div>`);
    for(let i=0;i<so;i++)h+='<div class="cal-day other-month"></div>';
    for(let d=1;d<=dim;d++){const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dv=vacs.filter(v=>v.from<=ds&&v.to>=ds&&v.status==='approved');const dk=getVisibleSicks().filter(s=>s.from<=ds&&s.to>=ds&&s.status==='active');
      h+=`<div class="cal-day${ds===isoDate(new Date())?' today':''}"><div class="cal-day-num">${d}</div>`;
      dv.forEach(v=>h+=`<div class="cal-event vacation">${v.empName.split(' ')[0]}</div>`);dk.forEach(s=>h+=`<div class="cal-event sick">${s.empName.split(' ')[0]} 🏥</div>`);
      h+='</div>';}h+='</div>';vc.innerHTML=h;}
}
function appVac(id){const v=VACS.find(x=>x.id===id);if(v){v.status='approved';syncVacationStatus(v.id,'approved');const e=EMPS.find(x=>x.id===v.empId);if(e){e.vacUsed+=v.days;syncEmployeeField(e.id,'vacUsed',e.vacUsed);}addNotif('vacation','Urlaub genehmigt',v.empName);toast('Genehmigt');renderVacation();updateBadges();}}
function rejVac(id){const v=VACS.find(x=>x.id===id);if(v){v.status='rejected';syncVacationStatus(v.id,'rejected');addNotif('vacation','Urlaub abgelehnt',v.empName);toast('Abgelehnt','err');renderVacation();updateBadges();}}

// ═══ SICK ═══
function renderSick(){
  const pg=document.getElementById('page-sick');const isEmp=currentUser.role==='mitarbeiter';const me=EMPS.find(e=>e.id===currentUser.empId);
  const sicks=getVisibleSicks();
  let banner=isEmp?permBanner(`Du siehst nur deine eigenen Krankmeldungen. Bisherige Krankentage: <strong>${me?.sickDays||0}</strong>`):'';
  let stats=!isEmp?`<div class="stats-row"><div class="stat-card"><div class="stat-label">Aktiv</div><div class="stat-value">${sicks.filter(s=>s.status==='active').length}</div></div><div class="stat-card"><div class="stat-label">Diesen Monat</div><div class="stat-value">${sicks.length}</div></div><div class="stat-card"><div class="stat-label">⌀ Tage</div><div class="stat-value">${sicks.length?(sicks.reduce((a,s)=>a+s.days,0)/sicks.length).toFixed(1):'0'}</div></div></div>`:
    `<div class="stats-row"><div class="stat-card" style="border-left:3px solid var(--danger)"><div class="stat-label">Meine Krankentage (Jahr)</div><div class="stat-value">${me?.sickDays||0}</div></div><div class="stat-card"><div class="stat-label">Aktive Meldungen</div><div class="stat-value">${sicks.filter(s=>s.status==='active').length}</div></div></div>`;
  pg.innerHTML=`${banner}${stats}<div class="table-wrap"><div class="table-header"><span class="table-title">Krankmeldungen</span><button class="btn btn-primary" onclick="openModal('addSick')">+ Krankmeldung</button></div>
    <table><thead><tr>${!isEmp?'<th>Mitarbeiter</th>':''}<th>Von</th><th>Bis</th><th>Tage</th><th>Status</th><th>AU</th><th>Aktion</th></tr></thead><tbody>
    ${sicks.map(s=>`<tr>${!isEmp?`<td><strong style="color:var(--text-primary)">${s.empName}</strong></td>`:''}<td>${formatDateDE(s.from)}</td><td>${formatDateDE(s.to)}</td><td>${s.days}</td>
    <td>${s.status==='active'?'<span class="badge badge-danger">Aktiv</span>':'<span class="badge badge-neutral">Abgeschl.</span>'}</td>
    <td>${s.hasAU?'<span class="badge badge-success">AU ✓</span>':'<span class="badge badge-warning">Offen</span>'}</td>
    <td><label class="btn btn-sm" style="cursor:pointer;margin:0"><input type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="uploadAU(${s.id},this)">📤 AU hochladen</label>${s.auUrl?` <a href="${s.auUrl}" target="_blank" class="btn btn-sm">📥 Ansehen</a>`:''}</td></tr>`).join('')}
    </tbody></table></div>`;
}

// ═══ DOCUMENTS ═══
function renderDocuments(){
  const pg=document.getElementById('page-documents');const isEmp=currentUser.role==='mitarbeiter';
  let banner=isEmp?permBanner('Du siehst nur deine eigenen Unterlagen.'):'';
  let tabs=!isEmp?`<div class="tabs"><div class="tab${documentTab==='all'?' active':''}" onclick="documentTab='all';renderDocuments()">Alle</div><div class="tab${documentTab==='contracts'?' active':''}" onclick="documentTab='contracts';renderDocuments()">Verträge</div><div class="tab${documentTab==='certs'?' active':''}" onclick="documentTab='certs';renderDocuments()">Zeugnisse</div><div class="tab${documentTab==='health'?' active':''}" onclick="documentTab='health';renderDocuments()">Gesundheit</div><div class="tab${documentTab==='tax'?' active':''}" onclick="documentTab='tax';renderDocuments()">Steuer</div></div>`:'';
  let actions=`<div class="table-actions" style="margin-bottom:16px"><input class="form-input" style="width:240px" placeholder="Suchen..." id="docS" oninput="renderDocuments()">
    ${can('seeAllDocs')?'<button class="btn btn-primary" onclick="openModal(\'addDoc\')">+ Hochladen</button>':''}</div>`;
  pg.innerHTML=banner+tabs+actions+'<div id="docG" class="doc-grid"></div>';

  let docs=getVisibleDocs();
  if(documentTab!=='all'&&!isEmp)docs=docs.filter(d=>d.type===documentTab);
  const q=(document.getElementById('docS')?.value||'').toLowerCase();
  if(q)docs=docs.filter(d=>d.name.toLowerCase().includes(q)||d.empName.toLowerCase().includes(q));
  const isEmpView=isEmp;
  document.getElementById('docG').innerHTML=docs.map(d=>{
    const sizeKB=d.fileSize?Math.round(d.fileSize/1024):0;
    const sizeTxt=sizeKB>1024?(Math.round(sizeKB/102.4)/10+' MB'):(sizeKB?sizeKB+' KB':'');
    return `<div class="doc-card" ${d.fileUrl?`onclick="window.open('${d.fileUrl}','_blank')" style="cursor:pointer"`:''}>
      <div class="doc-icon">${d.icon}</div>
      <div class="doc-name">${d.name}</div>
      <div class="doc-meta">${isEmpView?'':d.empName+' · '}${formatDateDE(d.date)}${sizeTxt?' · '+sizeTxt:''}</div>
      ${d.fileUrl?'<div style="font-size:.7rem;color:var(--accent);margin-top:4px">📥 Herunterladen</div>':''}
    </div>`;
  }).join('')||'<p style="color:var(--text-muted)">Keine Dokumente</p>';
}

// ═══ ACCESS ═══
function renderAccess(){
  const pg=document.getElementById('page-access');
  if(!can('manageAccess')){pg.innerHTML=permBanner('Zugangsverwaltung ist nur für Inhaber verfügbar.');return;}

  const roleOpts = ['inhaber','manager','mitarbeiter','azubi'];
  const locOpts = [{id:'all',name:'Alle Standorte'},...LOCS];

  // Pending registrations
  const pending = USERS.filter(u => u.status === 'pending');
  let pendingHtml = '';
  if (pending.length > 0) {
    pendingHtml = `<div class="table-wrap" style="margin-bottom:20px;border-left:3px solid var(--warning)">
      <div class="table-header"><span class="table-title">🔔 Neue Registrierungen (${pending.length})</span></div>
      <div style="padding:0 20px 16px">`;
    pending.forEach(u => {
      pendingHtml += `<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)">
        <div class="emp-avatar" style="width:44px;height:44px;font-size:1rem">${u.avatar}</div>
        <div style="flex:1">
          <strong style="font-size:.95rem">${u.name}</strong>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;font-size:.78rem;color:var(--text-secondary)">
            <span>📧 ${u.regEmail||'—'}</span>
            <span>🎂 ${u.regBirthday?formatDateDE(u.regBirthday):'—'}</span>
            <span>📍 ${getLocationName(u.location)}</span>
            <span>🏷️ ${u.regDept||'—'}</span>
            <span>💼 ${u.regPosition||'—'}</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-shrink:0">
          <button class="btn btn-sm btn-success" onclick="approveRegistration('${u.id}')" style="font-size:.8rem">✓ Genehmigen</button>
          <button class="btn btn-sm btn-danger" onclick="rejectRegistration('${u.id}')" style="font-size:.8rem">✕ Ablehnen</button>
        </div>
      </div>`;
    });
    pendingHtml += '</div></div>';
  }

  // Active users only in main table
  let rows = USERS.filter(u => u.status !== 'pending').map(u => {
    const emp = u.empId ? EMPS.find(e=>e.id===u.empId) : null;
    const roleSelect = `<select class="form-select" style="min-width:120px" onchange="changeUserRole('${u.id}',this.value)">
      ${roleOpts.map(r => `<option value="${r}" ${u.role===r?'selected':''}>${r==='inhaber'?'👑 Inhaber':r==='manager'?'🏢 Manager':r==='mitarbeiter'?'👤 Mitarbeiter':'🎓 Azubi'}</option>`).join('')}
    </select>`;
    const locSelect = `<select class="form-select" style="min-width:140px" onchange="changeUserLocation('${u.id}',this.value)">
      ${locOpts.map(l => `<option value="${l.id}" ${u.location===l.id?'selected':''}>${l.name}</option>`).join('')}
    </select>`;
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:10px">
        <div class="emp-avatar">${u.avatar}</div>
        <input class="form-input" style="width:150px;font-weight:600;font-size:.85rem" value="${u.name}" onblur="changeUserName('${u.id}',this.value)" onkeydown="if(event.key==='Enter')this.blur()">
      </div></td>
      <td><input class="form-input" style="width:140px;font-size:.82rem" value="${emp?.position||u.regPosition||''}" placeholder="Position..." onblur="changeUserPosition('${u.id}',this.value)" onkeydown="if(event.key==='Enter')this.blur()"></td>
      <td>${roleSelect}</td>
      <td>${locSelect}</td>
      <td>${u.empId ? (emp?.name||'—') : '—'}</td>
      <td>${statusBadge(u.status)}</td>
    </tr>`;
  }).join('');

  pg.innerHTML=`${pendingHtml}<div class="table-wrap"><div class="table-header"><span class="table-title">Zugangsverwaltung (${USERS.filter(u=>u.status!=='pending').length} Benutzer)</span></div>
  <div style="overflow-x:auto"><table><thead><tr><th>Name</th><th>Position</th><th>Rolle</th><th>Standort</th><th>Mitarbeiter</th><th>Status</th></tr></thead><tbody>
  ${rows}
  </tbody></table></div></div>
  <div style="margin-top:12px;padding:12px;background:var(--bg-input);border-radius:8px;font-size:.82rem;color:var(--text-muted)">
    💡 Name, Position, Rolle und Standort direkt in der Tabelle ändern. Änderungen werden sofort gespeichert.
  </div>`;
}

async function changeUserRole(userId, newRole) {
  const u = USERS.find(x => x.id === userId);
  if (!u) return;
  u.role = newRole;
  try {
    const { error } = await sb.from('user_profiles').update({ role: newRole }).eq('user_id', userId);
    if (error) { toast('Fehler: ' + error.message, 'err'); return; }
    toast(`${u.name} → ${newRole}`, 'success');
    console.log('[Sync] ✓ Role updated:', u.name, '→', newRole);
  } catch (e) { toast('Sync-Fehler', 'err'); }
}

async function changeUserLocation(userId, newLoc) {
  const u = USERS.find(x => x.id === userId);
  if (!u) return;
  u.location = newLoc;
  try {
    const { error } = await sb.from('user_profiles').update({ location: newLoc }).eq('user_id', userId);
    if (error) { toast('Fehler: ' + error.message, 'err'); return; }
    toast(`${u.name} → ${newLoc === 'all' ? 'Alle' : getLocationName(newLoc)}`, 'success');
    console.log('[Sync] ✓ Location updated:', u.name, '→', newLoc);
  } catch (e) { toast('Sync-Fehler', 'err'); }
}

async function changeUserName(userId, newName) {
  const u = USERS.find(x => x.id === userId);
  if (!u || !newName.trim()) return;
  const old = u.name;
  u.name = newName.trim();
  // Update avatar
  const parts = u.name.split(' ');
  u.avatar = parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
  // Also update linked employee
  if (u.empId) {
    const emp = EMPS.find(e => e.id === u.empId);
    if (emp) {
      emp.name = u.name;
      emp.avatar = u.avatar;
      syncEmployeeField(emp.id, 'name', u.name);
    }
  }
  try {
    const { error } = await sb.from('user_profiles').update({ name: u.name, avatar: u.avatar }).eq('user_id', userId);
    if (error) { console.warn('[Sync] Name error:', error.message); toast('Fehler: ' + error.message, 'err'); }
    else toast(`${old} → ${u.name}`);
  } catch (e) { toast('Sync-Fehler', 'err'); }
}

async function changeUserPosition(userId, newPos) {
  const u = USERS.find(x => x.id === userId);
  if (!u) return;
  if (u.empId) {
    const emp = EMPS.find(e => e.id === u.empId);
    if (emp) {
      emp.position = newPos.trim();
      syncEmployeeField(emp.id, 'position', emp.position);
      toast(`${u.name}: ${emp.position}`);
    }
  }
}

async function approveRegistration(userId) {
  const u = USERS.find(x => x.id === userId);
  if (!u) return;
  if (!confirm(`${u.name} genehmigen und als Mitarbeiter anlegen?`)) return;

  try {
    // 1. Create employee from registration data
    const newEmp = {
      name: u.name,
      location: u.location,
      dept: u.regDept || 'Service',
      position: u.regPosition || 'Mitarbeiter',
      status: 'active',
      start_date: isoDate(new Date()),
      avatar: u.avatar,
      vac_total: 26,
      vac_used: 0,
      sick_days: 0,
      late_count: 0,
      soll_stunden: 160,
      brutto_gehalt: 0,
      schule_tage: 0,
      birthday: u.regBirthday || null,
      prob_end: null
    };

    const { data: empData, error: empErr } = await sb.from('employees').insert(newEmp).select().single();
    if (empErr) { toast('Fehler: ' + empErr.message, 'err'); return; }

    // 2. Update user_profile: status='active', emp_id linked, role stays mitarbeiter
    const { error: profErr } = await sb.from('user_profiles').update({
      status: 'active',
      emp_id: empData.id
    }).eq('user_id', userId);
    if (profErr) { toast('Profil-Fehler: ' + profErr.message, 'err'); return; }

    // 3. Update local data
    u.status = 'active';
    u.empId = empData.id;
    EMPS.push({
      id: empData.id,
      name: u.name,
      location: u.location,
      dept: u.regDept || 'Service',
      position: u.regPosition || 'Mitarbeiter',
      status: 'active',
      start: isoDate(new Date()),
      avatar: u.avatar,
      vacTotal: 26, vacUsed: 0,
      sickDays: 0, lateCount: 0,
      sollStunden: 160, bruttoGehalt: 0, schuleTage: 0,
      birthday: u.regBirthday || '',
      probEnd: ''
    });

    addNotif('info', 'Neuer Mitarbeiter', `${u.name} wurde genehmigt und angelegt`);
    toast(`✓ ${u.name} genehmigt!`, 'success');
    renderAccess();
    updateBadges();

  } catch (e) {
    console.error('[Approve]', e);
    toast('Fehler beim Genehmigen', 'err');
  }
}

async function rejectRegistration(userId) {
  const u = USERS.find(x => x.id === userId);
  if (!u) return;
  if (!confirm(`${u.name} ablehnen? Das Konto wird gelöscht.`)) return;

  try {
    // Delete user_profile
    const { error } = await sb.from('user_profiles').delete().eq('user_id', userId);
    if (error) { toast('Fehler: ' + error.message, 'err'); return; }

    // Remove from local array
    const idx = USERS.findIndex(x => x.id === userId);
    if (idx >= 0) USERS.splice(idx, 1);

    toast(`${u.name} abgelehnt`, 'warn');
    renderAccess();
  } catch (e) {
    console.error('[Reject]', e);
    toast('Fehler beim Ablehnen', 'err');
  }
}

// ═══ NOTIFICATIONS ═══
function toggleNotifications(){document.getElementById('notifPanel').classList.toggle('open');document.getElementById('notifOverlay').classList.toggle('open');renderNotifs();}
function renderNotifs(){document.getElementById('notifList').innerHTML=getVisibleNotifs().map(n=>`<div class="notif-item ${n.type} ${n.unread?'unread':''}" onclick="markRead(${n.id})"><div class="notif-item-title">${n.title}</div><div class="notif-item-text">${n.text}</div><div class="notif-item-time">${n.time}</div></div>`).join('')||'<p style="padding:16px;color:var(--text-muted)">Keine Benachrichtigungen</p>';}
function markRead(id){const n=NOTIFS.find(x=>x.id===id);if(n){n.unread=false;renderNotifs();updateBadges();}}
function addNotif(type,title,text){NOTIFS.unshift({id:Date.now(),type,title,text,time:'Gerade eben',unread:true,forRole:['inhaber','manager']});updateBadges();}

// ═══ MODALS ═══
function openModal(type){
  const b=document.getElementById('modalBody'),f=document.getElementById('modalFooter'),t=document.getElementById('modalTitle');
  if(type==='addEmployee'){
    t.textContent='Neuen Mitarbeiter';
    const adm=can('seeFinancials');
    b.innerHTML=`<div class="form-grid"><div class="form-group"><label class="form-label">Vorname</label><input class="form-input" id="mF"></div><div class="form-group"><label class="form-label">Nachname</label><input class="form-input" id="mL"></div><div class="form-group"><label class="form-label">Standort</label><select class="form-select" id="mLoc">${LOCS.map(l=>`<option value="${l.id}"${l.id===currentUser.location?' selected':''}>${l.name}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Bereich</label><select class="form-select" id="mDpt">${[...new Set(DEPTS.map(d=>d.name))].sort().map(d=>`<option>${d}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Position</label><input class="form-input" id="mPos"></div><div class="form-group"><label class="form-label">Geburtstag</label><input class="form-input" type="date" id="mBday"></div><div class="form-group"><label class="form-label">Urlaubstage / Jahr</label><input class="form-input" type="number" id="mVT" value="26"></div>
    ${adm?`<div class="form-group"><label class="form-label">Soll-Stunden / Monat</label><input class="form-input" type="number" id="mSollH" value="160"></div>
    <div class="form-group"><label class="form-label">Brutto Gehalt / Monat</label><input class="form-input" type="number" step="0.01" id="mBrutto" value="0"></div>
    <div class="form-group"><label class="form-label">Schule/Fortbildung (Tage/Monat)</label><input class="form-input" type="number" id="mSchule" value="0"></div>`:''}</div>`;
    f.innerHTML='<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="saveEmp()">Speichern</button>';
  } else if(type==='addShift'){
    const emps=can('seeAllSchedules')?getVisibleEmps().filter(e=>e.status==='active'):getVisibleEmps();
    const ws=getWeekStart(scheduleDate);const wDates=[];for(let i=0;i<7;i++){const d=new Date(ws);d.setDate(d.getDate()+i);wDates.push(isoDate(d));}
    const dayNames=['Mo','Di','Mi','Do','Fr','Sa','So'];
    const allLocs=[...new Set(emps.map(e=>e.location))];
    const allDepts=[...new Set(emps.map(e=>e.dept))].sort();
    t.textContent='Schicht hinzufügen';
    b.innerHTML=`<div class="form-grid">
      <div class="form-group"><label class="form-label">Standort</label><select class="form-select" id="mSLoc" onchange="filterShiftEmps()"><option value="all">Alle Standorte</option>${allLocs.map(l=>`<option value="${l}">${getLocationName(l)}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Bereich</label><select class="form-select" id="mSDept" onchange="filterShiftEmps()"><option value="all">Alle Bereiche</option>${allDepts.map(d=>`<option value="${d}">${d}</option>`).join('')}</select></div>
      <div class="form-group full"><label class="form-label">Mitarbeiter</label><select class="form-select" id="mSE">${emps.map(e=>`<option value="${e.id}" data-loc="${e.location}" data-dept="${e.dept}">${e.name} (${e.dept})</option>`).join('')}</select></div>
      <div class="form-group full"><label class="form-label">Modus</label>
        <div style="display:flex;gap:0;border-radius:8px;overflow:hidden;border:1px solid var(--border)">
          <button class="btn shift-mode-btn active" data-mode="day" onclick="toggleShiftMode('day')" style="flex:1;border:none;border-radius:0;font-size:.78rem">📅 Ein Tag</button>
          <button class="btn shift-mode-btn" data-mode="week" onclick="toggleShiftMode('week')" style="flex:1;border:none;border-radius:0;font-size:.78rem">📋 Gleiche Zeit</button>
          <button class="btn shift-mode-btn" data-mode="plan" onclick="toggleShiftMode('plan')" style="flex:1;border:none;border-radius:0;font-size:.78rem">📊 Wochenplan</button>
        </div>
      </div>
      <div id="shiftModeDay"><div class="form-group full"><label class="form-label">Datum</label><input class="form-input" type="date" id="mSD" value="${isoDate(scheduleDate)}"></div></div>
      <div id="shiftModeWeek" style="display:none"><div class="form-group full"><label class="form-label">Woche ab ${formatDateDE(wDates[0])}</label>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">${dayNames.map((d,i)=>`<label style="display:flex;align-items:center;gap:4px;font-size:.82rem;cursor:pointer;padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input)"><input type="checkbox" class="weekday-cb" data-date="${wDates[i]}" ${i<5?'checked':''}> ${d} ${new Date(wDates[i]).getDate()}.${new Date(wDates[i]).getMonth()+1}</label>`).join('')}</div>
      </div></div>
      <div id="shiftModePlan" style="display:none"><div class="form-group full"><label class="form-label">Wochenplan – individuelle Zeiten</label>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px">${dayNames.map((d,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input)">
          <label style="display:flex;align-items:center;gap:4px;width:60px;font-size:.82rem;font-weight:600;cursor:pointer"><input type="checkbox" class="plan-day-cb" data-idx="${i}" data-date="${wDates[i]}" ${i<5?'checked':''}  onchange="this.closest('div').querySelector('.plan-times').style.opacity=this.checked?1:.3"> ${d}</label>
          <span style="font-size:.72rem;color:var(--text-muted);width:40px">${new Date(wDates[i]).getDate()}.${new Date(wDates[i]).getMonth()+1}</span>
          <div class="plan-times" style="display:flex;gap:6px;align-items:center;flex:1;${i>=5?'opacity:.3':''}">
            <input class="form-input plan-von" data-idx="${i}" type="time" value="${i<5?'09:00':''}" style="font-size:.8rem;padding:4px 6px;flex:1">
            <span style="font-size:.75rem;color:var(--text-muted)">–</span>
            <input class="form-input plan-bis" data-idx="${i}" type="time" value="${i<5?'17:00':''}" style="font-size:.8rem;padding:4px 6px;flex:1">
            <select class="form-select plan-tmpl" data-idx="${i}" onchange="applyPlanTmpl(${i})" style="font-size:.72rem;padding:3px 4px;width:70px"><option value="">—</option>${SHIFT_TEMPLATES.map((t,j)=>`<option value="${j}">${t.label}</option>`).join('')}</select>
          </div>
        </div>`).join('')}</div>
      </div></div>
      <div id="shiftTimesGlobal">
        <div class="form-group"><label class="form-label">Vorlage</label><select class="form-select" id="mST" onchange="applyTmpl()"><option value="">Manuell</option>${SHIFT_TEMPLATES.map((t,i)=>`<option value="${i}">${t.label}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Von</label><input class="form-input" type="time" id="mSF" value="09:00"></div>
        <div class="form-group"><label class="form-label">Bis</label><input class="form-input" type="time" id="mSTo" value="17:00"></div>
      </div>
    </div>`;
    f.innerHTML='<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="saveShift()">Speichern</button>';
  } else if(type==='addVacation'){
    const isEmp=currentUser.role==='mitarbeiter';
    const emps=isEmp?[EMPS.find(e=>e.id===currentUser.empId)]:getVisibleEmps();
    t.textContent='Urlaubsantrag';
    b.innerHTML=`<div class="form-grid">${isEmp?`<input type="hidden" id="mVE" value="${currentUser.empId}"><div class="form-group full"><div class="form-label">Für</div><strong>${emps[0]?.name}</strong> (Rest: ${emps[0]?.vacTotal-emps[0]?.vacUsed} Tage)</div>`:`<div class="form-group full"><label class="form-label">Mitarbeiter</label><select class="form-select" id="mVE">${emps.map(e=>`<option value="${e.id}">${e.name} (Rest: ${e.vacTotal-e.vacUsed})</option>`).join('')}</select></div>`}
    <div class="form-group"><label class="form-label">Von</label><input class="form-input" type="date" id="mVF"></div><div class="form-group"><label class="form-label">Bis</label><input class="form-input" type="date" id="mVTo"></div><div class="form-group full"><label class="form-label">Bemerkung</label><textarea class="form-textarea" id="mVN"></textarea></div></div>`;
    f.innerHTML='<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="saveVac()">Antrag stellen</button>';
  } else if(type==='addSick'){
    const isEmp=currentUser.role==='mitarbeiter';
    const emps=isEmp?[EMPS.find(e=>e.id===currentUser.empId)]:getVisibleEmps();
    t.textContent='Krankmeldung';
    b.innerHTML=`<div class="form-grid">${isEmp?`<input type="hidden" id="mKE" value="${currentUser.empId}"><div class="form-group full"><div class="form-label">Für</div><strong>${emps[0]?.name}</strong></div>`:`<div class="form-group full"><label class="form-label">Mitarbeiter</label><select class="form-select" id="mKE">${emps.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select></div>`}
    <div class="form-group"><label class="form-label">Von</label><input class="form-input" type="date" id="mKF"></div><div class="form-group"><label class="form-label">Bis</label><input class="form-input" type="date" id="mKTo"></div><div class="form-group full"><label class="form-label">Grund</label><textarea class="form-textarea" id="mKN"></textarea></div>
    <div class="form-group"><label class="form-label">AU vorhanden?</label><select class="form-select" id="mKAU"><option value="0">Nein</option><option value="1">Ja</option></select></div>
    <div class="form-group full" id="mKFileWrap">
      <label class="form-label">📋 AU-Bescheinigung hochladen</label>
      <div style="position:relative">
        <input type="file" id="mKFile" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="document.getElementById('mKAU').value='1';document.getElementById('mKFileLabel').innerHTML=this.files[0]?'<div style=\\'font-size:1.5rem;margin-bottom:4px\\'>✅</div><div style=\\'font-size:.85rem;color:var(--success)\\'>'+this.files[0].name+'</div>':'<div style=\\'font-size:2rem;margin-bottom:8px\\'>📂</div><div style=\\'font-size:.85rem;color:var(--text-secondary)\\'>Klicke oder ziehe eine Datei hierher</div>'">
        <div id="mKFileLabel" onclick="document.getElementById('mKFile').click()" style="border:2px dashed var(--border);border-radius:var(--radius);padding:20px;text-align:center;cursor:pointer;transition:all .2s;background:var(--bg-input)">
          <div style="font-size:2rem;margin-bottom:8px">📂</div>
          <div style="font-size:.85rem;color:var(--text-secondary)">Klicke oder ziehe eine Datei hierher</div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">PDF, JPG, PNG (max. 10 MB)</div>
        </div>
      </div>
    </div>
    </div>`;
    f.innerHTML='<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="saveSickL()">Speichern</button>';
  } else if(type==='addDoc'){
    const emps=getVisibleEmps();t.textContent='Dokument hochladen';
    b.innerHTML=`<div class="form-grid">
      <div class="form-group full"><label class="form-label">Mitarbeiter</label><select class="form-select" id="mDoE">${emps.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Dokumentname</label><input class="form-input" id="mDoN" placeholder="z.B. Arbeitsvertrag 2026"></div>
      <div class="form-group"><label class="form-label">Kategorie</label><select class="form-select" id="mDoT"><option value="contracts">Vertrag</option><option value="certs">Zeugnis</option><option value="health">Gesundheitszeugnis</option><option value="tax">Steuer</option><option value="other">Sonstiges</option></select></div>
      <div class="form-group full"><label class="form-label">Datei auswählen</label>
        <div style="position:relative">
          <input type="file" id="mDoFile" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls" style="display:none" onchange="updateFileName(this)">
          <div id="mDoFileLabel" onclick="document.getElementById('mDoFile').click()" style="border:2px dashed var(--border);border-radius:var(--radius);padding:24px;text-align:center;cursor:pointer;transition:all .2s;background:var(--bg-input)">
            <div style="font-size:2rem;margin-bottom:8px">📂</div>
            <div style="font-size:.85rem;color:var(--text-secondary)">Klicke oder ziehe eine Datei hierher</div>
            <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">PDF, DOC, JPG, PNG, XLS (max. 10 MB)</div>
          </div>
        </div>
      </div>
    </div>`;
    f.innerHTML='<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="saveDoc()">Hochladen</button>';
  } else if(type==='addAccess'){
    t.textContent='Zugang erstellen';
    b.innerHTML=`<div class="form-grid"><div class="form-group"><label class="form-label">Benutzername</label><input class="form-input" id="mAU"></div><div class="form-group"><label class="form-label">Rolle</label><select class="form-select" id="mAR"><option value="inhaber">Inhaber</option><option value="manager">Manager</option><option value="mitarbeiter" selected>Mitarbeiter</option></select></div><div class="form-group"><label class="form-label">Standort</label><select class="form-select" id="mAL"><option value="all">Alle</option>${LOCS.map(l=>`<option value="${l.id}">${l.name}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Mitarbeiter zuweisen</label><select class="form-select" id="mAE"><option value="">— keiner —</option>${EMPS.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select></div></div>`;
    f.innerHTML='<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="saveAccess()">Erstellen</button>';
  } else if(type==='addDept'){
    t.textContent='Neuen Bereich';
    b.innerHTML=`<div class="form-grid"><div class="form-group"><label class="form-label">Bezeichnung</label><input class="form-input" id="mDN"></div><div class="form-group"><label class="form-label">Standort</label><select class="form-select" id="mDL">${LOCS.map(l=>`<option value="${l.id}">${l.name}</option>`).join('')}</select></div><div class="form-group full"><label class="form-label">Leitung</label><input class="form-input" id="mDH"></div></div>`;
    f.innerHTML='<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="saveDept()">Speichern</button>';
  } else if(type==='saveTemplate'){
    openSaveTemplateModal();return;
  } else if(type==='addChecklist'){
    const emps=getVisibleEmps();const loc=currentUser.location==='all'?currentLocation:currentUser.location;
    t.textContent='Neue Checkliste erstellen';
    b.innerHTML=`<div class="form-grid">
      <div class="form-group"><label class="form-label">Typ</label><select class="form-select" id="mCLType">${CHECKLIST_TYPES.map(ct=>`<option value="${ct.id}">${ct.icon} ${ct.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Für</label><select class="form-select" id="mCLEmp"><option value="0">Alle Mitarbeiter</option>${emps.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Standort</label><select class="form-select" id="mCLLoc">${LOCS.map(l=>`<option value="${l.id}"${l.id===loc?' selected':''}>${l.name}</option>`).join('')}</select></div>
      <div class="form-group full"><label class="form-label">Aufgaben (eine pro Zeile)</label><textarea class="form-textarea" id="mCLItems" rows="6" placeholder="Aufgabe 1\nAufgabe 2\nAufgabe 3"></textarea></div>
    </div>`;
    f.innerHTML='<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="saveChecklist()">Erstellen</button>';
  }
  document.getElementById('modalOverlay').classList.remove('hidden');
}
function openModalC(title,bodyH){document.getElementById('modalTitle').textContent=title;document.getElementById('modalBody').innerHTML=bodyH;document.getElementById('modalFooter').innerHTML='<button class="btn" onclick="closeModal()">Schließen</button>';document.getElementById('modalOverlay').classList.remove('hidden');}
function closeModal(){document.getElementById('modalOverlay').classList.add('hidden');}

function filterShiftEmps(){
  const loc=document.getElementById('mSLoc')?.value||'all';
  const dept=document.getElementById('mSDept')?.value||'all';
  const sel=document.getElementById('mSE');
  if(!sel)return;
  [...sel.options].forEach(o=>{
    const oLoc=o.getAttribute('data-loc');
    const oDept=o.getAttribute('data-dept');
    const show=(loc==='all'||oLoc===loc)&&(dept==='all'||oDept===dept);
    o.hidden=!show;
  });
  // Select first visible option
  const first=[...sel.options].find(o=>!o.hidden);
  if(first)sel.value=first.value;
}
function applyTmpl(){const i=document.getElementById('mST').value;if(i!==''){document.getElementById('mSF').value=SHIFT_TEMPLATES[i].from;document.getElementById('mSTo').value=SHIFT_TEMPLATES[i].to;}}
function saveEmp(){const f=document.getElementById('mF').value.trim(),l=document.getElementById('mL').value.trim();if(!f||!l)return;
  const adm=can('seeFinancials');
  EMPS.push({id:Date.now(),name:f+' '+l,location:document.getElementById('mLoc').value,dept:document.getElementById('mDpt').value,position:document.getElementById('mPos').value||'Mitarbeiter',status:'active',start:isoDate(new Date()),avatar:f[0]+l[0],vacTotal:parseInt(document.getElementById('mVT').value)||26,vacUsed:0,sickDays:0,lateCount:0,
    sollStunden:adm?parseInt(document.getElementById('mSollH')?.value)||160:160,
    bruttoGehalt:adm?parseFloat(document.getElementById('mBrutto')?.value)||0:0,
    schuleTage:adm?parseInt(document.getElementById('mSchule')?.value)||0:0,
    birthday:document.getElementById('mBday')?.value||'',
    probEnd:''
  });syncAddEmployee(EMPS[EMPS.length-1]);closeModal();toast('Mitarbeiter angelegt');renderPage('employees');}
function toggleShiftMode(mode){
  const d=id=>document.getElementById(id);
  if(d('shiftModeDay'))d('shiftModeDay').style.display=mode==='day'?'':'none';
  if(d('shiftModeWeek'))d('shiftModeWeek').style.display=mode==='week'?'':'none';
  if(d('shiftModePlan'))d('shiftModePlan').style.display=mode==='plan'?'':'none';
  if(d('shiftTimesGlobal'))d('shiftTimesGlobal').style.display=mode==='plan'?'none':'';
  document.querySelectorAll('.shift-mode-btn').forEach(b=>{
    b.style.background=b.dataset.mode===mode?'var(--accent)':'var(--bg-card)';
    b.style.color=b.dataset.mode===mode?'#fff':'var(--text-secondary)';
  });
  window._shiftMode=mode;
}
function applyPlanTmpl(idx){
  const sel=document.querySelector(`.plan-tmpl[data-idx="${idx}"]`);
  if(!sel||sel.value==='')return;
  const tmpl=SHIFT_TEMPLATES[sel.value];
  if(!tmpl)return;
  const von=document.querySelector(`.plan-von[data-idx="${idx}"]`);
  const bis=document.querySelector(`.plan-bis[data-idx="${idx}"]`);
  if(von)von.value=tmpl.from;
  if(bis)bis.value=tmpl.to;
}
function saveShift(){
  const eid=parseInt(document.getElementById('mSE').value);
  const emp=EMPS.find(e=>e.id===eid);
  const mode=window._shiftMode||'day';
  
  let shifts=[];
  
  if(mode==='plan'){
    // Wochenplan: each day has its own times
    document.querySelectorAll('.plan-day-cb:checked').forEach(cb=>{
      const idx=cb.dataset.idx;
      const date=cb.dataset.date;
      const von=document.querySelector(`.plan-von[data-idx="${idx}"]`)?.value;
      const bis=document.querySelector(`.plan-bis[data-idx="${idx}"]`)?.value;
      if(!von||!bis)return;
      const tmplSel=document.querySelector(`.plan-tmpl[data-idx="${idx}"]`);
      const lbl=tmplSel&&tmplSel.value!==''?SHIFT_TEMPLATES[tmplSel.value].label:'Manuell';
      shifts.push({date,from:von,to:bis,label:lbl});
    });
  } else {
    const ti=document.getElementById('mST').value;
    const lbl=ti!==''?SHIFT_TEMPLATES[ti].label:'Manuell';
    const from=document.getElementById('mSF').value;
    const to=document.getElementById('mSTo').value;
    
    if(mode==='week'){
      document.querySelectorAll('.weekday-cb:checked').forEach(cb=>shifts.push({date:cb.dataset.date,from,to,label:lbl}));
    } else {
      shifts=[{date:document.getElementById('mSD').value,from,to,label:lbl}];
    }
  }
  
  if(!shifts.length){toast('Keine Tage ausgewählt','err');return;}
  
  // Filter out Ruhetag days
  const blocked = [];
  shifts = shifts.filter(s => {
    const vt = getVacTypeForDate(s.date, emp.location);
    if (!vt) { blocked.push(formatDateDE(s.date)); return false; }
    return true;
  });
  if (blocked.length) toast(`Ruhetag übersprungen: ${blocked.join(', ')}`, 'warn');
  if (!shifts.length) { toast('Alle gewählten Tage sind Ruhetage', 'err'); return; }

  shifts.forEach(s=>{
    const cc = s.label === 'Schule' ? 'schule' : getDeptColorClass(emp.dept);
    const ns={id:Date.now()+Math.random()*1e6|0,empId:emp.id,empName:emp.name,dept:emp.dept,location:emp.location,date:s.date,from:s.from,to:s.to,label:s.label,colorClass:cc,isSick:false,isVacation:false,isLate:false,lateMin:0,vacHalf:false};
    SHIFTS.push(ns);syncAddShift(ns);
  });
  closeModal();toast(`${shifts.length} Schicht${shifts.length>1?'en':''} gespeichert`);renderSchedule();
}
function saveVac(){const eid=parseInt(document.getElementById('mVE').value);const emp=EMPS.find(e=>e.id===eid);const fr=document.getElementById('mVF').value,to=document.getElementById('mVTo').value;if(!fr||!to)return;const days=Math.ceil((new Date(to)-new Date(fr))/864e5)+1;const nv={id:Date.now(),empId:eid,empName:emp.name,location:emp.location,from:fr,to,days,status:'pending',note:document.getElementById('mVN').value};VACS.push(nv);syncAddVacation(nv);addNotif('vacation','Urlaubsantrag',`${emp.name}: ${formatDateDE(fr)}–${formatDateDE(to)} (${days}T)`);closeModal();toast('Antrag gestellt');renderVacation();}
async function saveSickL(){
  const eid=parseInt(document.getElementById('mKE').value);
  const emp=EMPS.find(e=>e.id===eid);
  const fr=document.getElementById('mKF').value,to=document.getElementById('mKTo').value;
  if(!fr||!to)return;
  const days=Math.ceil((new Date(to)-new Date(fr))/864e5)+1;
  const hasAU=document.getElementById('mKAU').value==='1';
  const fileInput=document.getElementById('mKFile');
  const file=fileInput?.files?.[0];
  let auUrl=null;

  // Upload AU file if provided
  if(hasAU && file){
    toast('AU wird hochgeladen...');
    try {
      const ext=file.name.split('.').pop();
      const path=`au/au_${eid}_${Date.now()}.${ext}`;
      const {data,error}=await sb.storage.from('documents').upload(path,file,{upsert:true});
      if(!error){
        const {data:urlData}=sb.storage.from('documents').getPublicUrl(path);
        auUrl=urlData?.publicUrl||null;
      } else {
        console.warn('[AU Upload]',error.message);
        auUrl=URL.createObjectURL(file);
      }
    } catch(e){
      console.warn('[AU]',e.message);
      auUrl=URL.createObjectURL(file);
    }
  }

  const ns={id:Date.now(),empId:eid,empName:emp.name,location:emp.location,from:fr,to,days,status:'active',hasAU,note:document.getElementById('mKN').value,auUrl};
  SICKS.push(ns);syncAddSick(ns);
  emp.status='sick';emp.sickDays+=days;
  syncEmployeeField(emp.id,'sickDays',emp.sickDays);
  syncEmployeeField(emp.id,'status','sick');
  addNotif('sick','Krankmeldung',`${emp.name}: ${document.getElementById('mKN').value||'—'}`);
  closeModal();toast('Krankmeldung erfasst','err');renderPage('sick');
}

async function uploadAU(sickId, input) {
  const file = input.files[0];
  if (!file) return;
  const sick = SICKS.find(s => s.id === sickId);
  if (!sick) return;

  toast('Wird hochgeladen...', 'info');
  try {
    const ext = file.name.split('.').pop();
    const fileName = `au_${sickId}_${Date.now()}.${ext}`;
    const { data, error } = await sb.storage
      .from('documents')
      .upload(`au/${fileName}`, file, { upsert: true });

    if (error) {
      // If bucket doesn't exist, save locally
      console.warn('[AU Upload]', error.message);
      sick.hasAU = true;
      sick.auUrl = URL.createObjectURL(file);
      sick.auFileName = file.name;
    } else {
      const { data: urlData } = sb.storage
        .from('documents')
        .getPublicUrl(`au/${fileName}`);
      sick.hasAU = true;
      sick.auUrl = urlData.publicUrl;
      sick.auFileName = file.name;
      // Update in DB
      await sb.from('sick_leaves').update({
        has_au: true,
        au_url: sick.auUrl
      }).eq('id', sickId);
    }
    toast('AU hochgeladen ✓');
    renderPage('sick');
  } catch (e) {
    console.warn('[AU]', e.message);
    // Fallback: local blob URL
    sick.hasAU = true;
    sick.auUrl = URL.createObjectURL(file);
    toast('AU lokal gespeichert');
    renderPage('sick');
  }
}
function updateFileName(input){
  const label=document.getElementById('mDoFileLabel');
  if(input.files.length>0){
    const f=input.files[0];
    const sizeKB=Math.round(f.size/1024);
    const sizeTxt=sizeKB>1024?(Math.round(sizeKB/102.4)/10+' MB'):(sizeKB+' KB');
    label.innerHTML=`<div style="font-size:1.5rem;margin-bottom:4px">✅</div>
      <div style="font-size:.88rem;font-weight:600;color:var(--text-primary)">${f.name}</div>
      <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">${sizeTxt} · Klicke um zu ändern</div>`;
    if(!document.getElementById('mDoN').value) document.getElementById('mDoN').value=f.name.replace(/\.[^.]+$/,'');
  }
}
async function saveDoc(){
  const eid=parseInt(document.getElementById('mDoE').value);
  const emp=EMPS.find(e=>e.id===eid);
  const n=document.getElementById('mDoN').value.trim();
  if(!n)return alert('Bitte Dokumentname eingeben.');
  const tp=document.getElementById('mDoT').value;
  const icons={contracts:'📄',certs:'🎓',health:'🏥',tax:'💰',other:'📎'};
  const fileInput=document.getElementById('mDoFile');
  const file=fileInput?.files?.[0];
  
  let fileUrl=null;
  let fileSize=0;
  let fileName='';
  
  if(file){
    // Validate size (10MB max)
    if(file.size>10*1024*1024){toast('Datei zu groß (max 10 MB)','err');return;}
    
    // Upload to Supabase Storage
    const ext=file.name.split('.').pop().toLowerCase();
    const path=`emp_${eid}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
    
    toast('Wird hochgeladen...');
    const {data:upData,error:upErr}=await sb.storage.from('documents').upload(path,file,{
      cacheControl:'3600',
      upsert:false
    });
    
    if(upErr){
      console.warn('[Upload]',upErr.message);
      // If bucket doesn't exist, still save doc record without file
      toast('Datei-Upload fehlgeschlagen: '+upErr.message,'err');
    } else {
      const {data:urlData}=sb.storage.from('documents').getPublicUrl(path);
      fileUrl=urlData?.publicUrl||null;
      fileSize=file.size;
      fileName=file.name;
      console.log('[Upload] ✓',path);
    }
  }
  
  const newDoc = {
    id:Date.now(),empId:eid,empName:emp.name,name:n,type:tp,
    date:isoDate(new Date()),icon:icons[tp],
    fileUrl,fileSize,fileName:fileName||n
  };
  DOCS.push(newDoc);
  syncAddDocument(newDoc);
  closeModal();toast(file&&fileUrl?'Dokument hochgeladen ✓':'Dokument gespeichert');renderDocuments();
}
function saveAccess(){const u=document.getElementById('mAU').value.trim();if(!u)return;USERS.push({id:u,name:u,role:document.getElementById('mAR').value,location:document.getElementById('mAL').value,avatar:u.substring(0,2).toUpperCase(),empId:parseInt(document.getElementById('mAE').value)||null,lastLogin:'—',status:'active'});closeModal();toast('Zugang erstellt');renderAccess();}
function saveDept(){const n=document.getElementById('mDN').value.trim();if(!n)return;DEPTS.push({id:Date.now(),name:n,location:document.getElementById('mDL').value,head:document.getElementById('mDH').value||'—',count:0,color:'#a29bfe'});closeModal();toast('Bereich angelegt');renderDepts();}

// ═══ SAVED SHIFT TEMPLATES ═══
function applySavedTemplate(){
  const sel=document.getElementById('schedTmplSel');
  const tmpl=SAVED_TEMPLATES.find(t=>t.id===parseInt(sel.value));
  if(!tmpl){return;}
  const weekS=getWeekStart(scheduleDate);
  const empsInLoc=EMPS.filter(e=>e.location===tmpl.location&&e.status==='active');
  let count=0;
  for(let d=0;d<7;d++){
    const day=new Date(weekS);day.setDate(day.getDate()+d);const ds=isoDate(day);
    tmpl.shifts.forEach(ts=>{
      const matching=empsInLoc.filter(e=>e.dept===ts.dept);
      matching.forEach(emp=>{
        if(!SHIFTS.find(s=>s.empId===emp.id&&s.date===ds)){
          SHIFTS.push({id:Date.now()+Math.random()*1e6|0,empId:emp.id,empName:emp.name,dept:emp.dept,location:emp.location,date:ds,from:ts.from,to:ts.to,label:ts.label,colorClass:getDeptColorClass(emp.dept),isSick:false,isVacation:false,isLate:false,lateMin:0});
          count++;
        }
      });
    });
  }
  sel.value='';
  toast(`Vorlage "${tmpl.name}" angewendet (${count} Schichten)`);
  renderSchedule();
}

function openSaveTemplateModal(){
  const loc=currentUser.location==='all'?currentLocation:currentUser.location;
  if(loc==='all'){alert('Bitte zuerst einen Standort wählen.');return;}
  document.getElementById('modalTitle').textContent='Wochenplan als Vorlage speichern';
  document.getElementById('modalBody').innerHTML=`<div class="form-grid">
    <div class="form-group full"><label class="form-label">Vorlagenname</label><input class="form-input" id="mTName" placeholder="z.B. Standardwoche Mo-Fr"></div>
    <div class="form-group full"><label class="form-label">Standort</label><div style="padding:8px 0;font-weight:600">${getLocationName(loc)}</div></div>
    <div class="form-group full"><div class="form-label">Enthaltene Schichten</div><div style="font-size:.82rem;color:var(--text-secondary)">Alle eindeutigen Schichtmuster der aktuellen Woche werden gespeichert.</div></div>
  </div>`;
  document.getElementById('modalFooter').innerHTML=`<button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="doSaveTemplate('${loc}')">Speichern</button>`;
  document.getElementById('modalOverlay').classList.remove('hidden');
}
function doSaveTemplate(loc){
  const name=document.getElementById('mTName').value.trim();if(!name)return;
  const weekS=getWeekStart(scheduleDate);const weekE=new Date(weekS);weekE.setDate(weekE.getDate()+6);
  const wShifts=SHIFTS.filter(s=>s.location===loc&&new Date(s.date)>=weekS&&new Date(s.date)<=weekE&&!s.isSick&&!s.isVacation);
  const patterns=[];const seen=new Set();
  wShifts.forEach(s=>{const key=s.dept+s.from+s.to;if(!seen.has(key)){seen.add(key);patterns.push({dept:s.dept,from:s.from,to:s.to,label:s.label});}});
  SAVED_TEMPLATES.push({id:Date.now(),location:loc,name,shifts:patterns});
  closeModal();toast(`Vorlage "${name}" gespeichert (${patterns.length} Muster)`);
}

// ═══ PERSONAL CALENDAR ═══
function renderCalendar(){
  const pg=document.getElementById('page-calendar');
  if(!can('seeAllEmployees')){pg.innerHTML=permBanner('Personalkalender ist nur für Manager und Inhaber verfügbar.');return;}
  const emps=getVisibleEmps();
  const today=new Date();

  // Upcoming events
  function getUpcoming(){
    const events=[];
    emps.forEach(e=>{
      if(e.birthday){
        const bd=new Date(e.birthday);
        const thisYear=new Date(today.getFullYear(),bd.getMonth(),bd.getDate());
        if(thisYear<today)thisYear.setFullYear(thisYear.getFullYear()+1);
        const age=thisYear.getFullYear()-bd.getFullYear();
        const daysUntil=Math.ceil((thisYear-today)/864e5);
        events.push({date:thisYear,dateStr:isoDate(thisYear),type:'birthday',icon:'🎂',label:`${e.name} wird ${age}`,daysUntil,emp:e});
      }
      if(e.start){
        const sd=new Date(e.start);
        const years=today.getFullYear()-sd.getFullYear();
        const nextAnni=new Date(today.getFullYear(),sd.getMonth(),sd.getDate());
        if(nextAnni<today)nextAnni.setFullYear(nextAnni.getFullYear()+1);
        const anniYears=nextAnni.getFullYear()-sd.getFullYear();
        if(anniYears>0){
          const daysUntil=Math.ceil((nextAnni-today)/864e5);
          events.push({date:nextAnni,dateStr:isoDate(nextAnni),type:'anniversary',icon:'🏆',label:`${e.name} – ${anniYears}. Dienstjubiläum`,daysUntil,emp:e});
        }
      }
      if(e.probEnd&&new Date(e.probEnd)>today){
        const pe=new Date(e.probEnd);
        const daysUntil=Math.ceil((pe-today)/864e5);
        events.push({date:pe,dateStr:e.probEnd,type:'probation',icon:'📋',label:`${e.name} – Probezeit endet`,daysUntil,emp:e});
      }
    });
    return events.sort((a,b)=>a.daysUntil-b.daysUntil);
  }

  const events=getUpcoming();
  const soon=events.filter(e=>e.daysUntil<=30);
  const later=events.filter(e=>e.daysUntil>30&&e.daysUntil<=90);

  pg.innerHTML=`
    <div class="stats-row">
      <div class="stat-card" style="border-left:3px solid #fdcb6e"><div class="stat-icon">🎂</div><div class="stat-label">Nächste Geburtstage</div><div class="stat-value" style="font-size:1.3rem">${events.filter(e=>e.type==='birthday'&&e.daysUntil<=30).length}</div><div class="stat-change">in den nächsten 30 Tagen</div></div>
      <div class="stat-card" style="border-left:3px solid var(--accent)"><div class="stat-icon">🏆</div><div class="stat-label">Jubiläen</div><div class="stat-value" style="font-size:1.3rem">${events.filter(e=>e.type==='anniversary'&&e.daysUntil<=90).length}</div><div class="stat-change">in den nächsten 90 Tagen</div></div>
      <div class="stat-card" style="border-left:3px solid var(--warning)"><div class="stat-icon">📋</div><div class="stat-label">Probezeit-Ende</div><div class="stat-value" style="font-size:1.3rem">${events.filter(e=>e.type==='probation').length}</div><div class="stat-change">ausstehend</div></div>
    </div>

    <div class="table-wrap"><div class="table-header"><span class="table-title">📅 Nächsten 30 Tage</span></div>
    <table><thead><tr><th></th><th>Datum</th><th>Ereignis</th><th>In</th></tr></thead><tbody>
    ${soon.length?soon.map(e=>`<tr><td style="font-size:1.3rem">${e.icon}</td><td>${formatDateDE(e.dateStr)}</td><td><strong style="color:var(--text-primary)">${e.label}</strong></td>
    <td>${e.daysUntil===0?'<span class="badge badge-success">Heute!</span>':e.daysUntil===1?'<span class="badge badge-warning">Morgen</span>':`<span class="badge badge-neutral">${e.daysUntil} Tage</span>`}</td></tr>`).join(''):'<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Keine Ereignisse</td></tr>'}
    </tbody></table></div>

    <div class="table-wrap"><div class="table-header"><span class="table-title">📆 31–90 Tage</span></div>
    <table><thead><tr><th></th><th>Datum</th><th>Ereignis</th><th>In</th></tr></thead><tbody>
    ${later.length?later.map(e=>`<tr><td style="font-size:1.3rem">${e.icon}</td><td>${formatDateDE(e.dateStr)}</td><td><strong style="color:var(--text-primary)">${e.label}</strong></td><td><span class="badge badge-neutral">${e.daysUntil} Tage</span></td></tr>`).join(''):'<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Keine Ereignisse</td></tr>'}
    </tbody></table></div>

    <div class="table-wrap"><div class="table-header"><span class="table-title">🎂 Alle Geburtstage</span></div>
    <table><thead><tr><th>Name</th><th>Geburtstag</th><th>Alter</th><th>Standort</th><th>Bereich</th></tr></thead><tbody>
    ${emps.filter(e=>e.birthday).sort((a,b)=>{const am=new Date(a.birthday).getMonth()*100+new Date(a.birthday).getDate();const bm=new Date(b.birthday).getMonth()*100+new Date(b.birthday).getDate();return am-bm;}).map(e=>{const bd=new Date(e.birthday);const age=today.getFullYear()-bd.getFullYear();return`<tr><td><strong style="color:var(--text-primary)">${e.name}</strong></td><td>${bd.getDate()}.${bd.getMonth()+1}.${bd.getFullYear()}</td><td>${age}</td><td>${getLocationName(e.location)}</td><td>${e.dept}</td></tr>`;}).join('')}
    </tbody></table></div>`;
}

// ═══ REPORTS & ANALYTICS ═══
function renderReports(){
  const pg=document.getElementById('page-reports');
  if(!can('seeAllEmployees')){pg.innerHTML=permBanner('Berichte sind nur für Manager und Inhaber verfügbar.');return;}
  const emps=getVisibleEmps();
  const isAdmin=can('seeFinancials');

  // Dept distribution
  const deptCount={};emps.forEach(e=>{deptCount[e.dept]=(deptCount[e.dept]||0)+1;});
  const deptEntries=Object.entries(deptCount).sort((a,b)=>b[1]-a[1]);
  const maxDept=Math.max(...deptEntries.map(d=>d[1]),1);

  // Status distribution
  const statusCount={active:0,vacation:0,sick:0};emps.forEach(e=>{statusCount[e.status]=(statusCount[e.status]||0)+1;});

  // Hours by dept (admin only)
  let hoursSection='';
  if(isAdmin){
    const deptHours={};emps.forEach(e=>{const h=calcPlanHours(e.id);deptHours[e.dept]=(deptHours[e.dept]||0)+h;});
    const deptSoll={};emps.forEach(e=>{deptSoll[e.dept]=(deptSoll[e.dept]||0)+e.sollStunden;});
    const deptHEntries=Object.entries(deptHours).sort((a,b)=>b[1]-a[1]);
    const maxH=Math.max(...deptHEntries.map(d=>d[1]),1);
    const totalBrutto=emps.reduce((s,e)=>s+e.bruttoGehalt,0);
    const deptCost={};emps.forEach(e=>{deptCost[e.dept]=(deptCost[e.dept]||0)+e.bruttoGehalt;});

    hoursSection=`
    <div class="table-wrap"><div class="table-header"><span class="table-title">💰 Personalkosten nach Bereich <span class="badge badge-info" style="font-size:.6rem">Nur Inhaber</span></span>
    ${can('canExport')?'<button class="btn btn-primary" onclick="exportReport()">📄 Report PDF</button>':''}</div>
    <div style="padding:20px">
    ${Object.entries(deptCost).sort((a,b)=>b[1]-a[1]).map(([dept,cost])=>{const pct=totalBrutto>0?Math.round(cost/totalBrutto*100):0;
      return`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-weight:600">${dept}</span><span style="font-family:'Space Mono',monospace;font-size:.82rem">${formatEuro(cost)} (${pct}%)</span></div>
      <div style="background:var(--bg-input);border-radius:4px;height:20px;overflow:hidden"><div style="height:100%;width:${pct}%;background:var(--accent);border-radius:4px;transition:width .5s ease"></div></div></div>`;
    }).join('')}
    <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between;font-weight:700"><span>Gesamt</span><span style="font-family:'Space Mono',monospace">${formatEuro(totalBrutto)}</span></div>
    </div></div>

    <div class="table-wrap"><div class="table-header"><span class="table-title">⏱️ Plan- vs. Soll-Stunden nach Bereich</span></div>
    <div style="padding:20px">
    ${deptHEntries.map(([dept,hours])=>{const soll=deptSoll[dept]||0;const pct=soll>0?Math.round(hours/soll*100):0;const color=pct>=95?'var(--success)':pct>=75?'var(--warning)':'var(--danger)';
      return`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-weight:600">${dept}</span><span style="font-family:'Space Mono',monospace;font-size:.82rem;color:${color}">${Math.round(hours)}h / ${soll}h (${pct}%)</span></div>
      <div style="background:var(--bg-input);border-radius:4px;height:16px;overflow:hidden;position:relative"><div style="height:100%;width:${Math.min(pct,100)}%;background:${color};border-radius:4px;transition:width .5s ease"></div></div></div>`;
    }).join('')}
    </div></div>`;
  }

  pg.innerHTML=`
    <div class="stats-row">
      <div class="stat-card"><div class="stat-label">Gesamt MA</div><div class="stat-value">${emps.length}</div></div>
      <div class="stat-card" style="border-left:3px solid var(--success)"><div class="stat-label">Aktiv</div><div class="stat-value" style="color:var(--success)">${statusCount.active||0}</div></div>
      <div class="stat-card" style="border-left:3px solid var(--info)"><div class="stat-label">Urlaub</div><div class="stat-value" style="color:var(--info)">${statusCount.vacation||0}</div></div>
      <div class="stat-card" style="border-left:3px solid var(--danger)"><div class="stat-label">Krank</div><div class="stat-value" style="color:var(--danger)">${statusCount.sick||0}</div></div>
      <div class="stat-card" style="border-left:3px solid var(--late-color)"><div class="stat-label">Verspätungen Ges.</div><div class="stat-value" style="color:var(--late-color)">${emps.reduce((s,e)=>s+e.lateCount,0)}</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div class="table-wrap"><div class="table-header"><span class="table-title">👥 Mitarbeiter nach Bereich</span></div>
    <div style="padding:20px">
    ${deptEntries.map(([dept,count])=>`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-weight:600">${dept}</span><span style="font-family:'Space Mono',monospace">${count}</span></div>
    <div style="background:var(--bg-input);border-radius:4px;height:20px;overflow:hidden"><div style="height:100%;width:${Math.round(count/maxDept*100)}%;background:var(--accent);border-radius:4px;transition:width .5s ease"></div></div></div>`).join('')}
    </div></div>

    <div class="table-wrap"><div class="table-header"><span class="table-title">🏥 Top Krankentage</span></div>
    <div style="padding:20px">
    ${emps.filter(e=>e.sickDays>0).sort((a,b)=>b.sickDays-a.sickDays).slice(0,8).map(e=>{const maxS=Math.max(...emps.map(x=>x.sickDays),1);
      return`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-weight:600">${e.name}</span><span style="font-family:'Space Mono',monospace">${e.sickDays} Tage</span></div>
      <div style="background:var(--bg-input);border-radius:4px;height:14px;overflow:hidden"><div style="height:100%;width:${Math.round(e.sickDays/maxS*100)}%;background:var(--danger);border-radius:4px"></div></div></div>`;
    }).join('')||'<p style="color:var(--text-muted)">Keine Krankentage</p>'}
    </div></div>
    </div>

    ${hoursSection}

    <div class="table-wrap"><div class="table-header"><span class="table-title">⏰ Top Verspätungen</span></div>
    <table><thead><tr><th>Mitarbeiter</th><th>Standort</th><th>Bereich</th><th>Anzahl</th></tr></thead><tbody>
    ${emps.filter(e=>e.lateCount>0).sort((a,b)=>b.lateCount-a.lateCount).map(e=>`<tr><td><strong style="color:var(--text-primary)">${e.name}</strong></td><td>${getLocationName(e.location)}</td><td>${e.dept}</td><td><span class="emp-pill late">${e.lateCount}×</span></td></tr>`).join('')||'<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Keine Verspätungen</td></tr>'}
    </tbody></table></div>`;
}

function exportReport(){
  const emps=getVisibleEmps();const isAdmin=can('seeFinancials');
  const w=window.open('','_blank');
  const totalBrutto=emps.reduce((s,e)=>s+e.bruttoGehalt,0);
  let rows=emps.map(e=>`<tr><td>${e.name}</td><td>${getLocationName(e.location)}</td><td>${e.dept}</td><td>${e.position}</td><td>${e.vacTotal-e.vacUsed}</td><td>${e.sickDays}</td><td>${e.lateCount}</td>${isAdmin?`<td>${e.sollStunden}h</td><td>${formatEuro(e.bruttoGehalt)}</td><td>${formatEuro(calcHourly(e))}</td>`:''}</tr>`).join('');
  w.document.write(`<!DOCTYPE html><html><head><title>Personalbericht</title><style>body{font-family:'Segoe UI',sans-serif;padding:24px;color:#222;font-size:12px}h1{font-size:18px}h2{font-size:13px;color:#666;font-weight:normal;margin-bottom:16px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{padding:6px 10px;border:1px solid #ddd;text-align:left}th{background:#f5f5f5;font-weight:700;font-size:10px;text-transform:uppercase}.total{font-weight:700;background:#f9f9f9}@media print{body{padding:0}}</style></head><body>
  <h1>Personalbericht – OKYU HRM</h1><h2>Stand: ${formatDateDE(isoDate(new Date()))} · ${emps.length} Mitarbeiter</h2>
  <table><thead><tr><th>Name</th><th>Standort</th><th>Bereich</th><th>Position</th><th>Resturlaub</th><th>Krankentage</th><th>Verspätungen</th>${isAdmin?'<th>Soll-Std.</th><th>Brutto</th><th>€/Std.</th>':''}</tr></thead><tbody>${rows}
  ${isAdmin?`<tr class="total"><td colspan="7">Gesamt</td><td>${emps.reduce((s,e)=>s+e.sollStunden,0)}h</td><td>${formatEuro(totalBrutto)}</td><td>—</td></tr>`:''}</tbody></table>
  <script>window.print();<\/script></body></html>`);w.document.close();
}

// ═══ CHECKLISTS ═══
function renderChecklists(){
  const pg=document.getElementById('page-checklists');
  const isEmp=currentUser.role==='mitarbeiter';
  const me=EMPS.find(e=>e.id===currentUser.empId);
  let cls=CHECKLISTS;
  if(isEmp){cls=cls.filter(c=>c.empId===currentUser.empId||c.empId===0);}
  else{const loc=currentUser.location==='all'?(currentLocation==='all'?null:currentLocation):currentUser.location;if(loc)cls=cls.filter(c=>c.location===loc);}

  const banner=isEmp?permBanner('Du siehst nur deine eigenen und allgemeinen Checklisten.'):'';

  pg.innerHTML=`${banner}
    <div class="stats-row">${CHECKLIST_TYPES.map(ct=>{const items=cls.filter(c=>c.type===ct.id);const total=items.reduce((s,c)=>s+c.items.length,0);const done=items.reduce((s,c)=>s+c.items.filter(i=>i.done).length,0);const pct=total>0?Math.round(done/total*100):0;
    return`<div class="stat-card" style="border-left:3px solid ${ct.color}"><div class="stat-icon">${ct.icon}</div><div class="stat-label">${ct.name}</div><div class="stat-value" style="font-size:1.3rem">${pct}%</div><div class="stat-change">${done}/${total} erledigt</div></div>`;}).join('')}</div>
    <div id="clContent"></div>
    ${can('editEmployees')?'<button class="btn btn-primary" onclick="openModal(\'addChecklist\')" style="margin-top:16px">+ Checkliste erstellen</button>':''}`;

  const cc=document.getElementById('clContent');
  let h='';
  cls.forEach(cl=>{
    const ct=CHECKLIST_TYPES.find(t=>t.id===cl.type);
    const done=cl.items.filter(i=>i.done).length;const total=cl.items.length;const pct=total>0?Math.round(done/total*100):0;
    const canManage=can('editEmployees');
    h+=`<div class="table-wrap" style="margin-bottom:16px"><div class="table-header">
      <span class="table-title">${ct?.icon||'✅'} ${ct?.name||cl.type} – ${cl.empName}</span>
      <span style="display:flex;align-items:center;gap:8px">
        <span class="badge ${pct===100?'badge-success':pct>=50?'badge-warning':'badge-danger'}">${pct}%</span>
        <span style="font-size:.75rem;color:var(--text-muted)">${done}/${total}</span>
        ${canManage?`<button class="btn btn-sm" onclick="resetChecklist(${cl.id})" title="Zurücksetzen" style="font-size:.7rem">🔄</button>
        <button class="btn btn-sm" style="font-size:.7rem;color:var(--danger)" onclick="deleteChecklist(${cl.id})" title="Löschen">🗑️</button>`:''}
      </span>
    </div>
    <div style="padding:4px 20px 4px"><div style="background:var(--bg-input);border-radius:4px;height:6px;margin:8px 0;overflow:hidden"><div style="height:100%;width:${pct}%;background:${ct?.color||'var(--accent)'};border-radius:4px;transition:width .3s"></div></div></div>
    <div style="padding:0 20px 16px">`;
    cl.items.forEach((item,idx)=>{
      h+=`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(42,42,58,.2)">
        <div style="width:22px;height:22px;border-radius:4px;border:2px solid ${item.done?ct?.color||'var(--success)':'var(--border)'};background:${item.done?(ct?.color||'var(--success)'):'transparent'};display:flex;align-items:center;justify-content:center;font-size:.7rem;color:#fff;flex-shrink:0;transition:all .2s;cursor:pointer" onclick="toggleCLItem(${cl.id},${idx})">
          ${item.done?'✓':''}
        </div>
        <span style="flex:1;font-size:.88rem;${item.done?'text-decoration:line-through;color:var(--text-muted)':''}" ${canManage?`ondblclick="editCLItem(${cl.id},${idx},this)"`:''} title="${canManage?'Doppelklick zum Bearbeiten':''}">${item.text}</span>
        ${canManage?`<button style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:.8rem;padding:2px 4px;opacity:.4" onclick="removeCLItem(${cl.id},${idx})" title="Entfernen">✕</button>`:''}
      </div>`;
    });
    // Add item input (inline)
    if(canManage){
      h+=`<div style="display:flex;gap:8px;margin-top:8px;padding-top:8px;border-top:1px dashed var(--border)">
        <input class="form-input" style="flex:1;font-size:.82rem;padding:6px 10px" placeholder="Neue Aufgabe..." id="newCLItem_${cl.id}" onkeydown="if(event.key==='Enter')addCLItem(${cl.id})">
        <button class="btn btn-sm" onclick="addCLItem(${cl.id})" style="font-size:.75rem">+ Hinzufügen</button>
      </div>`;
    }
    h+='</div></div>';
  });
  if(!cls.length)h='<p style="color:var(--text-muted);padding:20px">Keine Checklisten vorhanden.</p>';
  cc.innerHTML=h;
}

function toggleCLItem(clId,idx){
  const cl=CHECKLISTS.find(c=>c.id===clId);
  if(cl)cl.items[idx].done=!cl.items[idx].done;
  renderChecklists();
}
function deleteChecklist(clId){
  if(!confirm('Checkliste wirklich löschen?'))return;
  CHECKLISTS=CHECKLISTS.filter(c=>c.id!==clId);
  toast('Checkliste gelöscht','warn');renderChecklists();
}
function resetChecklist(clId){
  const cl=CHECKLISTS.find(c=>c.id===clId);
  if(!cl||!confirm('Alle Punkte zurücksetzen?'))return;
  cl.items.forEach(i=>i.done=false);
  toast('Checkliste zurückgesetzt');renderChecklists();
}
function addCLItem(clId){
  const inp=document.getElementById('newCLItem_'+clId);
  if(!inp||!inp.value.trim())return;
  const cl=CHECKLISTS.find(c=>c.id===clId);
  if(!cl)return;
  cl.items.push({text:inp.value.trim(),done:false});
  toast('Aufgabe hinzugefügt');renderChecklists();
}
function removeCLItem(clId,idx){
  const cl=CHECKLISTS.find(c=>c.id===clId);
  if(!cl)return;
  cl.items.splice(idx,1);
  toast('Aufgabe entfernt','warn');renderChecklists();
}
function editCLItem(clId,idx,el){
  const cl=CHECKLISTS.find(c=>c.id===clId);
  if(!cl)return;
  const old=cl.items[idx].text;
  el.innerHTML=`<input class="form-input" style="font-size:.85rem;padding:4px 8px" value="${old.replace(/"/g,'&quot;')}" onblur="saveCLEdit(${clId},${idx},this.value)" onkeydown="if(event.key==='Enter')this.blur();if(event.key==='Escape'){this.value='${old.replace(/'/g,"\\'")}';this.blur();}">`;
  el.querySelector('input').focus();
}
function saveCLEdit(clId,idx,val){
  const cl=CHECKLISTS.find(c=>c.id===clId);
  if(cl&&val.trim())cl.items[idx].text=val.trim();
  renderChecklists();
}

function saveDept2(){const n=document.getElementById('mDN').value.trim();if(!n)return;DEPTS.push({id:Date.now(),name:n,location:document.getElementById('mDL').value,head:document.getElementById('mDH').value||'—',count:0,color:'#a29bfe'});closeModal();toast('Bereich angelegt');renderDepts();}
function saveChecklist(){
  const type=document.getElementById('mCLType').value;
  const empId=parseInt(document.getElementById('mCLEmp').value);
  const emp=empId?EMPS.find(e=>e.id===empId):null;
  const loc=document.getElementById('mCLLoc').value;
  const lines=document.getElementById('mCLItems').value.trim().split('\n').filter(l=>l.trim());
  if(!lines.length)return alert('Bitte mindestens eine Aufgabe eingeben.');
  CHECKLISTS.push({id:Date.now(),type,empId,empName:emp?emp.name:'Alle Mitarbeiter',location:loc,items:lines.map(l=>({text:l.trim(),done:false}))});
  closeModal();toast('Checkliste erstellt');renderChecklists();
}
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

  function tlCard(item, expanded){
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

  // Progress
  const totalWeeks = 40+24; // Phase1=40w, Phase2=24w
  const startDate = new Date(emp.start);
  const now = new Date();
  const weeksDone = Math.max(0,Math.floor((now-startDate)/(7*864e5)));
  const pct = Math.min(100, Math.round(weeksDone/totalWeeks*100));

  h += `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
    <div class="stat-card" style="flex:1;min-width:140px;text-align:center"><div style="font-size:.65rem;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase">Phase 1</div><div style="font-size:1.4rem;font-weight:800;color:var(--info)">${Math.min(100,Math.round(Math.min(weeksDone,40)/40*100))}%</div><div style="height:4px;border-radius:99px;background:var(--border);overflow:hidden;margin-top:4px"><div style="height:100%;width:${Math.min(100,Math.round(Math.min(weeksDone,40)/40*100))}%;background:var(--info);border-radius:99px"></div></div><div style="font-size:.65rem;color:var(--text-muted);margin-top:4px">${Math.min(weeksDone,40)}/40 Wochen</div></div>
    <div class="stat-card" style="flex:1;min-width:140px;text-align:center"><div style="font-size:.65rem;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase">Phase 2</div><div style="font-size:1.4rem;font-weight:800;color:var(--success)">${weeksDone>40?Math.min(100,Math.round((weeksDone-40)/24*100)):0}%</div><div style="height:4px;border-radius:99px;background:var(--border);overflow:hidden;margin-top:4px"><div style="height:100%;width:${weeksDone>40?Math.min(100,Math.round((weeksDone-40)/24*100)):0}%;background:var(--success);border-radius:99px"></div></div><div style="font-size:.65rem;color:var(--text-muted);margin-top:4px">${weeksDone>40?Math.min(weeksDone-40,24):0}/24 Wochen</div></div>
    <div class="stat-card" style="flex:1;min-width:140px;text-align:center"><div style="font-size:.65rem;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase">Gesamt</div><div style="font-size:1.4rem;font-weight:800;color:var(--accent)">${pct}%</div><div style="height:4px;border-radius:99px;background:var(--border);overflow:hidden;margin-top:4px"><div style="height:100%;width:${pct}%;background:var(--accent);border-radius:99px"></div></div><div style="font-size:.65rem;color:var(--text-muted);margin-top:4px">${weeksDone}/${totalWeeks} Wochen</div></div>
  </div>`;

  // Legend
  h += `<div style="display:flex;flex-wrap:wrap;gap:10px;padding:12px 16px;background:var(--bg-card);border-radius:var(--radius);margin-bottom:16px;border:1px solid var(--border)">
    ${[{c:'var(--warning)',l:'Gäste & Team'},{c:'#92400e',l:'Warenannahme'},{c:'var(--danger)',l:'Küche'},{c:'var(--success)',l:'Wirtschaftsdienst'},{c:'var(--info)',l:'Service'},{c:'var(--accent)',l:'Verkaufsförderung'}].map(i=>`<span style="display:flex;align-items:center;gap:5px;font-size:.72rem;font-weight:500;color:var(--text-secondary)"><span style="width:8px;height:8px;border-radius:50%;background:${i.c}"></span>${i.l}</span>`).join('')}
  </div>`;

  // Phase 1
  h += `<div style="padding:12px 16px;display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,var(--info),#0984e3);border-radius:var(--radius);color:#fff;margin-bottom:16px">
    <div style="font-size:2rem;font-weight:900;opacity:.3">1</div>
    <div><div style="font-size:.95rem;font-weight:700">Erstes Ausbildungsjahr</div><div style="font-size:.65rem;opacity:.7;letter-spacing:1px;margin-top:2px">MONAT 1–12 · GRUNDLAGEN & ORIENTIERUNG</div></div>
  </div>`;
  PLAN_DATA.phase1.forEach(item => h += tlCard(item));

  // Phase 2
  h += `<div style="padding:12px 16px;display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,var(--success),#059669);border-radius:var(--radius);color:#fff;margin:20px 0 16px">
    <div style="font-size:2rem;font-weight:900;opacity:.3">2</div>
    <div><div style="font-size:.95rem;font-weight:700">Zweites Ausbildungsjahr</div><div style="font-size:.65rem;opacity:.7;letter-spacing:1px;margin-top:2px">MONAT 13–24 · VERTIEFUNG & SCHWERPUNKT</div></div>
  </div>`;
  PLAN_DATA.phase2.forEach(item => h += tlCard(item));

  // Schwerpunkt
  h += `<div style="text-align:center;margin:20px 0 12px;position:relative"><div style="position:absolute;top:50%;left:0;right:0;height:1px;background:var(--border)"></div><span style="position:relative;background:var(--bg-primary);padding:4px 14px;font-size:.6rem;letter-spacing:3px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Schwerpunkt: Restaurantservice</span></div>`;
  PLAN_DATA.schwerpunktR.forEach(item => h += tlCard(item));

  // Integrativ
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
        <td>${s.von?.substring(0,5) || '08:00'} – ${s.bis?.substring(0,5) || '15:00'}</td>
      </tr>`;
    });
    h += '</tbody></table></div>';

    // Weekly summary
    const totalSchuleH = schedule.reduce((sum,s)=>{
      const v = s.von ? parseInt(s.von) : 8;
      const b = s.bis ? parseInt(s.bis) : 15;
      return sum + (b-v);
    }, 0);
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
      const st = statusMap[n.status] || statusMap.entwurf;
      h += `<div class="stat-card" style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <strong>KW ${getWeekNumber(n.wocheStart)}: ${formatDateDE(n.wocheStart)} – ${formatDateDE(n.wocheEnd)}</strong>
          <span class="badge ${st.cls}">${st.label}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:4px">🍣 Betrieb (${n.betriebStunden} Std.)</div>
            <div style="font-size:.88rem">${n.betriebTaetigkeiten || '—'}</div>
          </div>
          <div>
            <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:4px">🏫 Schule (${n.schuleStunden} Std.)</div>
            <div style="font-size:.88rem">${n.schuleThemen || '—'}</div>
          </div>
        </div>
        ${n.ausbilderKommentar ? `<div style="margin-top:8px;padding:8px;background:var(--bg-input);border-radius:6px;font-size:.82rem"><strong>Ausbilder:</strong> ${n.ausbilderKommentar}</div>` : ''}
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

  // Group by date
  const byDate = {};
  evals.forEach(e=>{
    if(!byDate[e.datum]) byDate[e.datum]=[];
    byDate[e.datum].push(e);
  });

  const noteColor = n => n<=2?'var(--success)':n<=3?'var(--warning)':n<=4?'var(--danger)':'var(--danger)';
  const noteLabel = n => ({1:'Sehr gut',2:'Gut',3:'Befriedigend',4:'Ausreichend',5:'Mangelhaft',6:'Ungenügend'})[n]||'—';

  Object.keys(byDate).sort().reverse().forEach(datum=>{
    const items = byDate[datum];
    const avg = (items.reduce((s,i)=>s+i.note,0)/items.length).toFixed(1);
    h += `<div class="stat-card" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong>📅 ${formatDateDE(datum)} · Bewerter: ${items[0].bewerter}</strong>
        <span style="font-size:1.1rem;font-weight:700;color:${noteColor(Math.round(avg))}">⌀ ${avg}</span>
      </div>`;

    items.forEach(ev=>{
      const pct = Math.max(0, (6-ev.note)/5*100);
      h += `<div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:2px">
          <span>${ev.kategorie}</span>
          <span style="font-weight:600;color:${noteColor(ev.note)}">${ev.note} – ${noteLabel(ev.note)}</span>
        </div>
        <div style="height:6px;background:var(--bg-input);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${noteColor(ev.note)};border-radius:3px;transition:width .3s"></div>
        </div>
        ${ev.kommentar ? `<div style="font-size:.78rem;color:var(--text-muted);margin-top:2px">${ev.kommentar}</div>` : ''}
      </div>`;
    });
    h += '</div>';
  });

  return h;
}

function getWeekNumber(dateStr){
  const d = new Date(dateStr);
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// ═══ INIT ═══
function initApp(){
  document.getElementById('dateDisplay').textContent=new Date().toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  genShifts();renderPage('dashboard');renderNotifs();
  if(window.innerWidth<=900)document.getElementById('menuBtn').style.display='';
  window.addEventListener('resize',()=>{document.getElementById('menuBtn').style.display=window.innerWidth<=900?'':'none';});
}
