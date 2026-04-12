// ═══ THEME ═══
function toggleTheme(){const h=document.documentElement;const n=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',n);localStorage.setItem('okyu-theme',n);}
(function(){const s=localStorage.getItem('okyu-theme');if(s)document.documentElement.setAttribute('data-theme',s);})();

// ═══ AUTH ═══
// doLogin(), doLoginDemo(), doLogout(), checkExistingSession() → see auth.js

// ═══ DYNAMIC SIDEBAR ═══
// Each tab is shown/hidden based on user permissions (from SuperAdmin or role defaults)
function buildSidebar(){
  const isCustom = currentUser?._permMode === 'custom';
  const mi = (name) => `<span class="ms">${name}</span>`;
  const opened = JSON.parse(localStorage.getItem('sidebarOpened') || '{}');
  let html='';

  // Helper: section header + collapsible group (default: collapsed)
  function sectionStart(key, label) {
    const isCollapsed = opened[key] ? '' : 'collapsed';
    html += `<div class="nav-section ${isCollapsed}" onclick="toggleNavSection('${key}',this)"><span>${label}</span><span class="ms nav-chevron">expand_more</span></div>`;
    html += `<div class="nav-group ${isCollapsed}" data-section="${key}">`;
  }
  function sectionEnd() { html += '</div>'; }

  // ── ÜBERSICHT (always visible, not collapsible) ──
  html+=`<div class="nav-item active" onclick="navigate('dashboard',this)">${mi('grid_view')} Dashboard</div>`;

  // ── PERSONAL ──
  const showMitarbeiter = can('seeAllEmployees');
  const showBereiche = can('seeDepartments');
  if(showMitarbeiter || showBereiche){
    sectionStart('personal', 'Personal');
    if(showMitarbeiter) html+=`<div class="nav-item" onclick="navigate('employees',this)">${mi('people')} Mitarbeiter</div>`;
    if(showBereiche) html+=`<div class="nav-item" onclick="navigate('departments',this)">${mi('domain')} Bereiche</div>`;
    sectionEnd();
  }

  // ── PLANUNG ──
  const showSchedule = isCustom ? can('seeAllSchedules') : (can('seeAllSchedules') || ['mitarbeiter','azubi'].includes(currentUser.role));
  const showVacation = isCustom ? can('seeAllVacations') || can('approveVacations') : true;
  const showSick = isCustom ? can('seeAllSick') : true;
  if(showSchedule || showVacation || showSick){
    sectionStart('planung', 'Planung');
    if(showSchedule) html+=`<div class="nav-item" onclick="navigate('schedule',this)">${mi('calendar_month')} Arbeitsplan</div>`;
    if(showVacation) html+=`<div class="nav-item" onclick="navigate('vacation',this)">${mi('beach_access')} ${can('seeAllVacations')?'Urlaubsplan':'Mein Urlaub'}<span class="nav-badge" id="vacBadge" style="display:none">0</span></div>`;
    if(showSick) html+=`<div class="nav-item" onclick="navigate('sick',this)">${mi('medical_services')} ${can('seeAllSick')?'Krankmeldungen':'Meine Krankmeldungen'}<span class="nav-badge" id="sickBadge" style="display:none">0</span></div>`;
    sectionEnd();
  }

  // ── DOKUMENTE ──
  const showDocs = isCustom ? can('seeAllDocs') : true;
  if(showDocs || !isCustom){
    sectionStart('dokumente', 'Dokumente');
    html+=`<div class="nav-item" onclick="navigate('documents',this)">${mi('folder')} ${can('seeAllDocs')?'Unterlagen':'Meine Unterlagen'}</div>`;
    if(can('seeDepartments')) html+=`<div class="nav-item" onclick="navigate('checklists',this)">${mi('checklist')} Checklisten</div>`;
    sectionEnd();
  }

  // ── AUSBILDUNG ──
  if(currentUser.role==='azubi' || can('editTraining')){
    sectionStart('ausbildung', 'Ausbildung');
    html+=`<div class="nav-item" onclick="navigate('ausbildung',this)">${mi('school')} ${currentUser.role==='azubi'?'Meine Ausbildung':'Ausbildung'}</div>`;
    sectionEnd();
  }

  // ── AUSWERTUNG ──
  if(can('seeAllEmployees') || can('canExport')){
    sectionStart('auswertung', 'Auswertung');
    if(can('seeAllEmployees')) html+=`<div class="nav-item" onclick="navigate('calendar',this)">${mi('event_note')} Personalkalender</div>`;
    if(can('seeAllEmployees') || can('canExport')) html+=`<div class="nav-item" onclick="navigate('reports',this)">${mi('analytics')} Berichte</div>`;
    sectionEnd();
  }

  // ── SYSTEM (admin only) ──
  if(can('manageAccess')){
    sectionStart('system', 'System');
    html+=`<div class="nav-item" onclick="navigate('access',this)">${mi('admin_panel_settings')} Zugangsverwaltung<span class="nav-badge" id="pendingBadge" style="display:none">0</span></div>`;
    html+=`<div class="nav-item" onclick="navigate('locations',this)">${mi('location_city')} Standorte</div>`;
    html+=`<div class="nav-item" onclick="navigate('qr_generator',this)">${mi('qr_code_2')} QR Check-in</div>`;
    sectionEnd();
  }
  document.getElementById('sidebarNav').innerHTML=html;
  // Show pending registration count
  setTimeout(updatePendingBadge, 100);
}

function toggleNavSection(key, el) {
  const group = document.querySelector(`.nav-group[data-section="${key}"]`);
  if (!group) return;
  const opened = JSON.parse(localStorage.getItem('sidebarOpened') || '{}');
  if (group.classList.contains('collapsed')) {
    group.classList.remove('collapsed');
    el.classList.remove('collapsed');
    opened[key] = true;
  } else {
    group.classList.add('collapsed');
    el.classList.add('collapsed');
    delete opened[key];
  }
  localStorage.setItem('sidebarOpened', JSON.stringify(opened));
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
  if(window.innerWidth<=900) closeSidebar();
  renderPage(page);
}
function renderPage(p){
  const c=document.getElementById('contentArea');
  c.innerHTML='<div class="page active" id="page-'+p+'"></div>';
  ({dashboard:renderDashboard,employees:renderEmployees,departments:renderDepts,schedule:renderSchedule,vacation:renderVacation,sick:renderSick,documents:renderDocuments,access:renderAccess,calendar:renderCalendar,reports:renderReports,checklists:renderChecklists,ausbildung:renderAusbildung,qr_generator:renderQrGenerator,locations:renderLocations})[p]?.();
}

// ═══ SHIFTS (loaded from Supabase via data-loader.js) ═══
function genShifts(){
  // Shifts are loaded from Supabase — no random generation
  console.log('[Shifts]', SHIFTS.length, 'shifts from Supabase');
}

// ═══ QR CHECK-IN CONFIG ═══
const QR_KEYS = {
  okyu: 'oK4xY9',
  origami: 'rG3mI7',
  enso: 'eN5oS2'
};

/**
 * Detect QR check-in from URL parameters
 * Called after login / session restore in initApp()
 * URL format: ?checkin=okyu&key=oK4xY9
 */
function detectQrCheckin() {
  // Check URL params
  const params = new URLSearchParams(window.location.search);
  const loc = params.get('checkin');
  const key = params.get('key');

  // Also check sessionStorage (from pending login flow)
  const pending = sessionStorage.getItem('pendingCheckin');

  console.log('[QR] detectQrCheckin called. URL loc:', loc, 'key:', key, 'pending:', pending, 'user:', currentUser?.name || 'null', 'URL:', window.location.href);

  if (loc && key) {
    // Verify key
    console.log('[QR] Checking key: QR_KEYS['+loc+'] =', QR_KEYS[loc], 'vs key =', key, 'match:', QR_KEYS[loc] === key);
    if (!QR_KEYS[loc] || QR_KEYS[loc] !== key) {
      console.warn('[QR] Invalid key for', loc, '- expected:', QR_KEYS[loc], 'got:', key);
      toast('❌ Ungültiger QR-Code', 'err');
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // Clear any stale sessionStorage from previous scans
    sessionStorage.removeItem('pendingCheckin');
    sessionStorage.removeItem('pendingCheckinKey');

    if (!currentUser) {
      sessionStorage.setItem('pendingCheckin', loc);
      sessionStorage.setItem('pendingCheckinKey', key);
      console.log('[QR] No user → saved pending:', loc);
      return;
    }

    // Logged in → execute check-in/out
    console.log('[QR] ✓ User logged in, triggering handleQrCheckin for:', loc);
    window.history.replaceState({}, '', window.location.pathname);
    setTimeout(() => handleQrCheckin(loc), 800);

  } else if (pending && currentUser) {
    // Returning from login with pending check-in
    const savedKey = sessionStorage.getItem('pendingCheckinKey');
    sessionStorage.removeItem('pendingCheckin');
    sessionStorage.removeItem('pendingCheckinKey');
    console.log('[QR] Found pending:', pending, 'savedKey:', savedKey);
    if (QR_KEYS[pending] && QR_KEYS[pending] === savedKey) {
      console.log('[QR] ✓ Pending key valid, triggering check-in for:', pending);
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => handleQrCheckin(pending), 800);
    } else {
      console.warn('[QR] Invalid saved key for:', pending, '(expected:', QR_KEYS[pending], 'got:', savedKey, ')');
    }
  } else {
    console.log('[QR] No QR params detected');
  }
}

/**
 * Handle QR check-in/out (smart toggle)
 * If already checked in today → check-out
 * If not → check-in with GPS verify
 */
async function handleQrCheckin(locationId) {
  const today = isoDate(new Date());

  // Check if already checked in today (open record)
  const openRecord = TIME_RECORDS.find(r =>
    r.empId === currentUser.empId &&
    r.checkIn?.startsWith(today) &&
    !r.checkOut
  );

  if (openRecord) {
    // Smart toggle → CHECK-OUT
    console.log('[QR] Already checked in → triggering check-out. Record:', openRecord.id, 'checkIn:', openRecord.checkIn);
    toast('🔴 Ausstempeln...', 'info');
    activeCheckIn = openRecord;
    await doCheckOut();
    return;
  }

  // CHECK-IN with GPS verify
  toast('📍 GPS wird geprüft...', 'info');

  let pos = null, gpsVerified = null, gpsSuspicious = false, distanceM = null;
  try {
    pos = await getCurrentGPS();
    const locData = LOCS.find(l => l.id === locationId);
    if (locData && locData.lat && locData.lng) {
      const dist = Math.round(haversineDistance(pos.lat, pos.lng, locData.lat, locData.lng));
      distanceM = dist;
      gpsVerified = dist <= 200;
      gpsSuspicious = dist > 500;
      if (gpsSuspicious) {
        console.warn('[QR] GPS suspicious:', dist + 'm');
      }
    }
  } catch (gpsErr) {
    console.warn('[QR] GPS failed:', gpsErr.message);
    // GPS failed → still allow QR check-in
  }

  // Late detection
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
    location: locationId,
    checkInLat: pos?.lat || null,
    checkInLng: pos?.lng || null,
    distanceM: distanceM,
    shiftId: todayShift?.id || null,
    isLate, lateMin,
    method: pos ? 'qr+gps' : 'qr',
    qrLocation: locationId,
    gpsVerified,
    gpsSuspicious
  };

  const data = await syncCheckIn(record);
  if (data) {
    activeCheckIn = { ...record, id: data.id, checkIn: data.check_in };
    TIME_RECORDS.unshift(activeCheckIn);

    const locName = getLocationName(locationId);
    const gpsInfo = gpsVerified === true ? ' ✅ GPS bestätigt' :
                    gpsVerified === false ? ' ⚠️ GPS nicht bestätigt' : '';
    toast(`✅ Eingecheckt · ${locName}${gpsInfo}`, 'success');
    if (isLate) toast(`⏰ ${lateMin} Min. verspätet`, 'warn');
    if (gpsSuspicious) toast('🔴 GPS-Standort verdächtig — Admin wird benachrichtigt', 'warn');

    renderDashboard();
  } else {
    toast('Check-in fehlgeschlagen', 'err');
  }
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
      isLate, lateMin,
      method: 'gps',
      qrLocation: null,
      gpsVerified: true,
      gpsSuspicious: false
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

    pg.innerHTML=`
      ${todayHtml}
      ${zeitHtml}
      ${upcomingHtml}
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
    const bannerImg = currentUser.bannerUrl || localStorage.getItem(bannerKey) || '';
    const bannerStyle = bannerImg ? `background-image:url('${bannerImg}');background-size:cover;background-position:center;` : '';
    const locLogos = {origami:'🍣',enso:'🍜',okyu_central:'🏢'};
    const locLogo = locLogos[currentLocation] || locLogos[currentUser.location] || '🏢';

    pg.innerHTML=`
      <!-- Welcome Banner -->
      <div class="dash-welcome" style="${bannerStyle}">
        <div class="dash-welcome-overlay"></div>
        <div style="position:relative;z-index:1">
          <div class="dash-greeting-badge">Willkommen zurück</div>
          <div class="dash-greeting">${currentUser.name.split(' ')[0]}<br>${currentUser.name.split(' ').slice(1).join(' ')}.</div>
          <div class="dash-subtitle">Es sind heute ${todayShifts.length} Schichten geplant. ${emps.filter(e=>sickEmpIds.has(e.id)).length} Mitarbeiter krank gemeldet.</div>
          ${can('editSchedules')?`<label class="dash-upload-btn" title="Hintergrundbild ändern">
            <input type="file" accept="image/*" style="display:none" onchange="changeDashBanner(this)">
            <span class="ms" style="font-size:1rem">wallpaper</span> Hintergrund ändern
          </label>`:''}
        </div>
        <div class="dash-clock">
          <div class="dash-clock-inner">
            <div class="dash-clock-time" id="dashClock">${timeStr}</div>
          </div>
          <div class="dash-clock-date">${dateStr}</div>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="dash-stats-grid">
        <div class="dash-stat" onclick="navigate('employees')">
          <div class="dash-stat-icon blue"><span class="ms">person_check</span></div>
          <div class="dash-stat-label">Active Employees</div>
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="dash-stat-value">${activeEmps}</span>
            <span class="dash-stat-sub green">+${Math.round(activeEmps/emps.length*100)}%</span>
          </div>
        </div>
        <div class="dash-stat" onclick="navigate('vacation')">
          ${pendingVacs>0?`<div class="dash-stat-badge" style="background:var(--warning)">${pendingVacs} Pending</div>`:''}
          <div class="dash-stat-icon amber"><span class="ms">beach_access</span></div>
          <div class="dash-stat-label">On Leave</div>
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="dash-stat-value">${vacEmps}</span>
            <span class="dash-stat-sub">${vacEmps===0?'Stable':'aktiv'}</span>
          </div>
        </div>
        <div class="dash-stat" onclick="navigate('sick')">
          ${activeSick>0?`<div class="dash-stat-badge" style="background:var(--danger)">${activeSick} Active</div>`:''}
          <div class="dash-stat-icon rose"><span class="ms">medical_services</span></div>
          <div class="dash-stat-label">Sick</div>
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="dash-stat-value">${sickEmps}</span>
            <span class="dash-stat-sub red">Meldungen</span>
          </div>
        </div>
        <div class="dash-stat" onclick="navigate('schedule')">
          <div class="dash-stat-icon slate"><span class="ms">history</span></div>
          <div class="dash-stat-label">Delays</div>
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="dash-stat-value">${totalLate}</span>
            <span class="dash-stat-sub">${totalLate<=3?'Great':'lfd. Jahr'}</span>
          </div>
        </div>
      </div>

      ${can('seeFinancials')?`
      <!-- Financial + Shifts Bento -->
      <div class="dash-bento">
        <div class="dash-bento-main">
          <div class="dash-card">
            <div class="dash-card-header">
              Monthly Personnel Costs
              <div style="text-align:right">
                <div style="font-size:1.6rem;font-weight:900;font-family:'Manrope',sans-serif;color:var(--accent)">${formatEuro(emps.reduce((s,e)=>s+e.bruttoGehalt,0))}</div>
                <div style="font-size:.6rem;color:#16a34a;font-weight:700;text-transform:uppercase;letter-spacing:.1em">Within Budget</div>
              </div>
            </div>
            <div class="dash-card-body">
              <div style="display:flex;gap:20px;align-items:flex-end">
                <div style="flex:1">
                  <div class="dash-fin-bars" id="dashFinBars"></div>
                  <div class="dash-fin-months" id="dashFinMonths"></div>
                </div>
                <div class="dash-fin-summary">
                  <div class="dash-fin-box" style="background:var(--bg-input)">
                    <div class="dash-fin-box-label">Trend</div>
                    <div class="dash-fin-box-value">+${(emps.reduce((s,e)=>s+e.bruttoGehalt,0)/25000*14.2).toFixed(1)}%</div>
                  </div>
                  <div class="dash-fin-box" style="background:var(--accent);color:#fff">
                    <div class="dash-fin-box-label" style="color:rgba(255,255,255,.65)">Summe</div>
                    <div class="dash-fin-box-value" style="color:#fff">${formatEuro(emps.reduce((s,e)=>s+e.bruttoGehalt,0))}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dash-bento-side">
          <div class="dash-card" style="height:100%">
            <div class="dash-card-header">Live Attendance<span class="dash-card-header-link" onclick="navigate('schedule')">Alle anzeigen</span></div>
            <div class="dash-card-body">
              <div class="dash-att-ring-wrap">
                <div class="dash-donut-rel" style="width:160px;height:160px">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="64" fill="transparent" stroke="var(--bg-input)" stroke-width="14"/>
                    <circle cx="80" cy="80" r="64" fill="transparent" stroke="var(--accent)"
                      stroke-dasharray="${2*Math.PI*64}" stroke-dashoffset="${2*Math.PI*64*(1-attPct/100)}"
                      stroke-linecap="round" stroke-width="14"
                      style="transform:rotate(-90deg);transform-origin:center;filter:drop-shadow(0 0 12px rgba(59,79,210,.3))"/>
                  </svg>
                  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
                    <div class="dash-att-pct">${attPct}%</div>
                    <div class="dash-att-quality">${attPct>=90?'Excellent':attPct>=70?'Good':'Fair'}</div>
                  </div>
                </div>
              </div>
              <div id="dashLocRows" style="margin-top:12px"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Plan vs Actual + Attendance Grid -->
      <div class="dash-grid-2">
        <div class="dash-card">
          <div class="dash-card-header">Plan vs. Actual Hours</div>
          <div class="dash-card-body">
            <div class="dash-donut-wrap">
              <div class="dash-donut-rel" style="width:160px;height:160px">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="62" fill="transparent" stroke="var(--bg-input)" stroke-width="18"/>
                  <circle cx="80" cy="80" r="62" fill="transparent" stroke="rgba(59,79,210,.55)"
                    stroke-dasharray="${2*Math.PI*62}" stroke-dashoffset="${2*Math.PI*62*(1-Math.min(emps.reduce((s,e)=>s+calcPlanHours(e.id),0)/(emps.reduce((s,e)=>s+e.sollStunden,0)||1),1))}"
                    stroke-linecap="round" stroke-width="18"/>
                  <circle cx="80" cy="80" r="38" fill="transparent" stroke="var(--bg-input)" stroke-width="18"/>
                  <circle cx="80" cy="80" r="38" fill="transparent" stroke="#818cf8"
                    stroke-dasharray="${2*Math.PI*38}" stroke-dashoffset="${2*Math.PI*38*(1-Math.min(emps.reduce((s,e)=>s+calcPlanHours(e.id),0)/(emps.reduce((s,e)=>s+e.sollStunden,0)||1),1))}"
                    stroke-linecap="round" stroke-width="18"/>
                </svg>
                <div class="dash-donut-center">
                  <div class="dash-donut-center-lbl">Total Hours</div>
                  <div class="dash-donut-center-val">${emps.reduce((s,e)=>s+calcPlanHours(e.id),0)}</div>
                </div>
              </div>
              <div class="dash-donut-legend">
                <div class="dash-donut-legend-item">
                  <div class="dash-donut-legend-label"><span class="dash-donut-legend-dot" style="background:rgba(59,79,210,.55)"></span>Planned</div>
                  <div class="dash-donut-legend-val">${emps.reduce((s,e)=>s+e.sollStunden,0)}h</div>
                </div>
                <div class="dash-donut-legend-item">
                  <div class="dash-donut-legend-label"><span class="dash-donut-legend-dot" style="background:#818cf8"></span>Actual</div>
                  <div class="dash-donut-legend-val">${emps.reduce((s,e)=>s+calcPlanHours(e.id),0)}h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dash-card">
          <div class="dash-card-header">Team Planning Overview
            <div style="display:flex;gap:4px">
              <button style="width:28px;height:28px;border:none;background:none;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;justify-content:center;border-radius:6px" class="hover-bg"><span class="ms">chevron_left</span></button>
              <button style="width:28px;height:28px;border:none;background:none;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;justify-content:center;border-radius:6px" class="hover-bg"><span class="ms">chevron_right</span></button>
            </div>
          </div>
          <div class="dash-card-body" id="dashShifts"></div>
        </div>
      </div>

      <!-- GPS Attendance -->
      <div class="dash-card" style="margin-bottom:24px">
        <div class="dash-card-header">GPS Anwesenheit
          <span style="margin-left:auto;font-weight:400;font-size:.78rem;color:var(--text-muted)">${checkedInCount}/${scheduledCount} eingestempelt</span>
        </div>
        <div class="dash-card-body" id="dashAttendance"></div>
      </div>

      <!-- Notifications -->
      <div class="dash-card" style="margin-bottom:24px">
        <div class="dash-card-header">🔔 Aktivitäten</div>
        <div class="dash-card-body" id="dashNotifs" style="padding-left:32px;position:relative"></div>
      </div>
      `:``}

      ${!can('seeFinancials')?`
      <div class="dash-bento">
        <div class="dash-bento-main">
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
        </div>
        <div class="dash-bento-side">
          <div class="dash-card">
            <div class="dash-card-header">📝 Meldungen</div>
            <div class="dash-card-body" id="dashNotifs" style="padding-left:32px;position:relative"></div>
          </div>
        </div>
      </div>
      <div class="dash-card" style="margin-bottom:20px">
        <div class="dash-card-header">📋 Heutige Schichten <span style="margin-left:auto;font-weight:400;color:var(--text-muted);font-size:.78rem">${todayShifts.length} Schichten</span></div>
        <div class="dash-card-body" id="dashShifts"></div>
      </div>
      `:``}
    `;

        // Start live clock
    if(window._dashClockTimer) clearInterval(window._dashClockTimer);
    window._dashClockTimer=setInterval(()=>{
      const el=document.getElementById('dashClock');
      if(el) el.textContent=new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      else clearInterval(window._dashClockTimer);
    },1000);

    // Populate notifications
    const notifs=getVisibleNotifs().slice(0,5);
    const notifsHtml=notifs.map(n=>`<div class="notif-item ${n.type} ${n.unread?'unread':''}"><div class="notif-item-title">${n.title}</div><div class="notif-item-text">${n.text}</div><div class="notif-item-time">${n.time}</div></div>`).join('')||'<p style="color:var(--text-muted)">Keine Meldungen</p>';
    const _dn=document.getElementById('dashNotifs'); if(_dn)_dn.innerHTML=notifsHtml;
    const _dnr=document.getElementById('dashNotifsRight'); if(_dnr)_dnr.innerHTML=notifsHtml;

    // Populate financial bar chart (owner only)
    const _fb=document.getElementById('dashFinBars');
    const _fm=document.getElementById('dashFinMonths');
    if(_fb&&_fm){
      const totalBrutto=emps.reduce((s,e)=>s+e.bruttoGehalt,0);
      const monthData=[totalBrutto*.55,totalBrutto*.7,totalBrutto*.6,totalBrutto*.85,totalBrutto*.78,totalBrutto];
      const maxVal=Math.max(...monthData);
      const monthNames=['Mai','Jun','Jul','Aug','Sep','Okt'];
      _fb.innerHTML=monthData.map((v,i)=>`<div class="dash-fin-bar${i===5?' current':''}" style="height:${Math.round(v/maxVal*100)}%"><span class="dash-fin-bar-label">${Math.round(v/1000)}k</span></div>`).join('');
      _fm.innerHTML=monthNames.map((m,i)=>`<span class="dash-fin-month${i===5?' current':''}">${m}</span>`).join('');
    }


    // Populate location attendance rows (admin)
    const _dlr=document.getElementById('dashLocRows');
    if(_dlr){
      const locRows=LOCS.map((loc,i)=>{
        const locShifts=todayShifts.filter(s=>s.location===loc.id);
        const locCheckins=todayCheckins.filter(r=>locShifts.find(s=>s.empId===r.empId));
        const pct=locShifts.length>0?Math.round(locCheckins.length/locShifts.length*100):0;
        const dotColors=['var(--accent)','#a5b4fc','#cbd5e1'];
        return`<div class="dash-loc-row">
          <span class="dash-loc-dot" style="background:${dotColors[i%dotColors.length]}"></span>
          <span class="dash-loc-name">${loc.name}</span>
          <span class="dash-loc-pct">${pct}%</span>
        </div>`;
      }).join('');
      _dlr.innerHTML=locRows||'<p style="color:var(--text-muted);font-size:.8rem">Keine Standortdaten</p>';
    }

    // Populate today shifts as premium team rows
    const _ds=document.getElementById('dashShifts');
    if(_ds){
      const shiftStatusMap={pending:'pending',active:'active','active':'active',late:'sick'};
      _ds.innerHTML=todayShifts.slice(0,5).map(s=>{
        const isLate=s.isLate;
        const rec=todayCheckins.find(r=>r.empId===s.empId);
        const badgeCls=isLate?'sick':rec?'done':'active';
        const badgeTxt=isLate?`⏰+${s.lateMin}m`:rec?'Eingest.':'Geplant';
        return`<div class="dash-team-row">
          <div class="dash-team-avatar">${s.empName.split(' ').map(n=>n[0]).join('').substring(0,2)}</div>
          <div class="dash-team-info">
            <div class="dash-team-name">${s.empName}</div>
            <div class="dash-team-sub">${s.dept} · ${s.from}–${s.to}</div>
          </div>
          <span class="dash-team-badge ${badgeCls}">${badgeTxt}</span>
          <button class="dash-team-arrow"><span class="ms">arrow_forward_ios</span></button>
        </div>`;
      }).join('')||'<p style="color:var(--text-muted)">Keine Schichten</p>';
    }


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
    toast('Bild wird hochgeladen...');

    // Upload to Supabase Storage → save URL to user_profiles
    try {
      const ext=file.name.split('.').pop();
      const path=`banners/${currentUser.id}_${Date.now()}.${ext}`;
      const {data,error}=await sb.storage.from('uploads').upload(path, file, {upsert:true});
      if(!error){
        const {data:urlData}=sb.storage.from('uploads').getPublicUrl(path);
        if(urlData?.publicUrl){
          const publicUrl=urlData.publicUrl;
          // Save to DB
          const {error:dbErr}=await sb.from('user_profiles').update({banner_url:publicUrl}).eq('user_id',currentUser.id);
          if(!dbErr){
            currentUser.bannerUrl=publicUrl;
            // Also update USERS array
            const u=USERS.find(x=>x.id===currentUser.id);
            if(u) u.bannerUrl=publicUrl;
            localStorage.setItem(bannerKey, publicUrl);
            toast('Hintergrundbild gespeichert ✓');
            console.log('[Banner] ✓ Saved to DB:', publicUrl);
          } else {
            console.warn('[Banner] DB save error:', dbErr.message);
            toast('Upload OK, DB-Fehler: '+dbErr.message,'warn');
          }
        }
      } else {
        console.warn('[Banner] Upload error:', error.message);
        toast('Storage-Fehler – Bild nur lokal gespeichert','warn');
      }
    } catch(e){
      console.warn('[Banner] Storage not available:', e.message);
      toast('Bild nur lokal gespeichert (Storage nicht verfügbar)','warn');
    }
  };
  reader.readAsDataURL(file);
}

// ═══ EMPLOYEES ═══
function renderEmployees(){
  const pg=document.getElementById('page-employees');
  if(!can('seeAllEmployees')){pg.innerHTML=permBanner('Mitarbeiter-Ansicht ist nur für Manager und Inhaber verfügbar.');return;}
  const emps=getVisibleEmps();
  const isAdmin=can('seeFinancials');
  const todayStr=isoDate(new Date());
  const onVac=VACS.filter(v=>v.status==='approved'&&v.from<=todayStr&&v.to>=todayStr).length;
  const onSick=SICKS.filter(s=>s.status==='active'&&s.from<=todayStr&&s.to>=todayStr).length;
  const lateTotal=emps.reduce((a,e)=>a+e.lateCount,0);
  const activeCount=emps.filter(e=>e.status==='aktiv').length;

  pg.innerHTML=`
  <!-- Page Header -->
  <div class="mit-page-hd">
    <div>
      <h2 class="mit-page-title">Personalverwaltung</h2>
      <p class="mit-page-sub">Verwalten Sie Ihr Team, analysieren Sie Leistungskennzahlen und steuern Sie Personalprozesse zentral an einem Ort.</p>
    </div>
    ${can('editEmployees')?`<button class="mit-add-btn" onclick="openModal('addEmployee')"><span class="ms">person_add</span> Mitarbeiter hinzufügen</button>`:''}
  </div>

  <!-- Stats -->
  <div class="mit-stats-grid">
    <div class="mit-stat-card">
      <div class="mit-stat-bg-circle"></div>
      <div class="mit-stat-card-top">
        <div class="mit-stat-icon blue"><span class="ms">groups</span></div>
        <span class="mit-stat-badge up">+4%</span>
      </div>
      <div class="mit-stat-num blue">${emps.length}</div>
      <div class="mit-stat-label">Aktive Mitarbeiter</div>
    </div>
    <div class="mit-stat-card">
      <div class="mit-stat-bg-circle"></div>
      <div class="mit-stat-card-top">
        <div class="mit-stat-icon teal"><span class="ms">beach_access</span></div>
        <span class="mit-stat-badge ok">Urlaub</span>
      </div>
      <div class="mit-stat-num teal">${onVac}</div>
      <div class="mit-stat-label">Im Urlaub</div>
    </div>
    <div class="mit-stat-card">
      <div class="mit-stat-bg-circle"></div>
      <div class="mit-stat-card-top">
        <div class="mit-stat-icon red"><span class="ms">medical_services</span></div>
        <span class="mit-stat-badge danger">Krank</span>
      </div>
      <div class="mit-stat-num red">${onSick}</div>
      <div class="mit-stat-label">Krankmeldungen</div>
    </div>
    <div class="mit-stat-card">
      <div class="mit-stat-bg-circle"></div>
      <div class="mit-stat-card-top">
        <div class="mit-stat-icon orange"><span class="ms">timer_off</span></div>
        <span class="mit-stat-badge warn">7 Tage</span>
      </div>
      <div class="mit-stat-num orange">${lateTotal}</div>
      <div class="mit-stat-label">Verspätungen</div>
    </div>
  </div>

  <!-- Control Bar -->
  <div class="mit-control-bar">
    <div class="mit-ctrl-left">
      <button class="mit-filter-btn"><span class="ms">filter_alt</span> Alle Filter</button>
      <div class="mit-dept-pills" id="mitDeptPills">
        <button class="mit-dept-pill active" onclick="filterEmpsByDept('all',this)">Alle Bereiche</button>
        ${[...new Set(emps.map(e=>e.dept))].sort().map(d=>`<button class="mit-dept-pill" onclick="filterEmpsByDept('${d}',this)">${d}</button>`).join('')}
      </div>
    </div>
    <div class="mit-ctrl-right">
      <div class="mit-search-wrap">
        <span class="ms">search</span>
        <input class="mit-search" placeholder="Suchen..." oninput="filterEmps(this.value)">
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="mit-table-card">
    <div class="mit-table-scroll">
      <table class="mit-table">
        <thead><tr>
          <th>Name & Position</th>
          <th>Standort / Dept.</th>
          <th>Resturlaub</th>
          <th>Kranktage</th>
          <th>Verspätungen</th>
          ${isAdmin?'<th>Schule</th><th>Plan Std.</th><th>Soll Std.</th><th>Brutto</th><th>€/Std.</th>':''}
          <th class="tc">Status</th>
          <th></th>
        </tr></thead>
        <tbody id="empTB"></tbody>
      </table>
    </div>
    <div class="mit-pagination"><span class="mit-pag-info">Zeige <strong>${emps.length}</strong> Mitarbeiter</span></div>
  </div>

  <!-- Bottom Bento -->
  <div class="mit-bottom-row">
    <div class="mit-cert-card">
      <div class="mit-cert-hd">
        <span class="mit-cert-title">Anstehende Zertifizierungen</span>
        <button class="mit-cert-see-all">Alle ansehen</button>
      </div>
      <div class="mit-cert-item">
        <div class="mit-cert-icon"><span class="ms">verified_user</span></div>
        <div class="mit-cert-info">
          <div class="mit-cert-name">Hygiene-Schulung HACCP</div>
          <div class="mit-cert-due">${emps.length} Mitarbeiter – demnächst fällig</div>
        </div>
        <button class="mit-cert-plan-btn">Planen</button>
      </div>
    </div>
    <div class="mit-insight-card">
      <div class="mit-insight-blob"></div>
      <div>
        <span class="ms mit-insight-icon">auto_awesome</span>
        <div class="mit-insight-title">Effizienz-Check</div>
        <p class="mit-insight-body">
          ${onSick>0?`Aktuell ${onSick} Mitarbeiter krank. Prüfen Sie die Arbeitspläne für Vertretungen.`:'Alle Arbeitspläne im grünen Bereich. Keine kritischen Ausfälle.'}
        </p>
      </div>
      <button class="mit-insight-cta" onclick="navigate('reports')">Bericht öffnen</button>
    </div>
  </div>`;

  renderEmpRows(emps);
}

function renderEmpRows(emps){
  const isAdmin=can('seeFinancials');
  const _ys1=isoDate(new Date(new Date().getFullYear(),0,1));
  const DEPT_COLORS={'Küche':'#10b981','Service':'#3b4fd2','Bar':'#f97316','Sushi':'#8b5cf6','Ausbildung':'#a29bfe','Verwaltung':'#e11d48'};
  document.getElementById('empTB').innerHTML=emps.map(e=>{
    const vr=e.vacTotal-e.vacUsed;
    const pl=VACS.filter(v=>v.empId===e.id&&(v.status==='approved'||v.status==='pending')&&v.from>=_ys1).reduce((s,v)=>s+v.days,0);
    const vacRemain=vr-pl;const vacUsedPct=e.vacTotal>0?Math.round(pl/e.vacTotal*100):0;
    const planH=calcPlanHours(e.id);const hourly=calcHourly(e);
    const sollDiff=e.sollStunden>0?planH-e.sollStunden:0;
    const sollColor=sollDiff>=0?'var(--success)':sollDiff>=-10?'var(--warning)':'var(--danger)';
    const initials=e.name.split(' ').map(n=>n[0]).join('').substring(0,2);
    const deptColor=DEPT_COLORS[e.dept]||'var(--accent)';
    const avatarBg=e.color||deptColor;
    // Status badge
    let statusHTML='';
    const st=(e.status||'').toLowerCase();
    if(st==='aktiv'||st==='active')statusHTML='<span class="mit-status-aktiv">Aktiv</span>';
    else if(st==='urlaub'||st==='vacation')statusHTML='<span class="mit-status-urlaub">Urlaub</span>';
    else if(st==='krank'||st==='sick')statusHTML='<span class="mit-status-krank">Krank</span>';
    else statusHTML='<span class="mit-status-inactive">'+(e.status||'—')+'</span>';
    // Online dot color
    const dotColor=st==='aktiv'||st==='active'?'#22c55e':st==='urlaub'||st==='vacation'?'#f59e0b':'#94a3b8';
    return`<tr class="mit-emp-row">
      <td>
        <div class="mit-emp-cell">
          <div class="mit-emp-dot" style="background:${avatarBg}">
            ${initials}
            <span class="mit-emp-online-dot" style="background:${dotColor}"></span>
          </div>
          <div>
            <div class="mit-emp-name">${e.name}</div>
            <div class="mit-emp-sub">${e.position||e.dept}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="mit-loc-main">${getLocationName(e.location)}</div>
        <div class="mit-loc-sub">${e.dept}</div>
      </td>
      <td>
        <div class="mit-vac-wrap">
          <div class="mit-vac-nums">
            <span class="mit-vac-remain">${vacRemain} Tage</span>
            <span class="mit-vac-total">/ ${e.vacTotal}</span>
          </div>
          <div class="mit-vac-bar"><div class="mit-vac-fill" style="width:${vacUsedPct}%"></div></div>
        </div>
      </td>
      <td><span class="${e.sickDays>3?'mit-pill sick':''}" style="${e.sickDays<=3?'font-size:.82rem;color:var(--text-muted)':''}">${e.sickDays}</span></td>
      <td>${e.lateCount?`<span class="mit-pill late">${e.lateCount}×</span>`:'—'}</td>
      ${isAdmin?`
        <td>${e.schuleTage>0?`<span class="mit-pill schule">${e.schuleTage}T</span>`:'—'}</td>
        <td><span class="mit-mono" style="color:${sollColor}">${planH}h</span></td>
        <td><span class="mit-mono">${e.sollStunden}h</span></td>
        <td><span class="mit-mono salary">${formatEuro(e.bruttoGehalt)}</span></td>
        <td><span class="mit-mono hourly">${formatEuro(hourly)}/h</span></td>
      `:''}
      <td class="tc">${statusHTML}</td>
      <td>
        <div class="mit-actions">
          ${can('markLate')?`<button class="mit-icon-btn" onclick="openLateModal(${e.id})" title="Verspätung"><span class="ms">alarm_on</span></button>`:''}
          <button class="mit-detail-btn" onclick="viewEmp(${e.id})">Details</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function filterEmps(q){const emps=getVisibleEmps().filter(e=>e.name.toLowerCase().includes(q.toLowerCase())||e.dept.toLowerCase().includes(q.toLowerCase()));renderEmpRows(emps);}
function filterEmpsByDept(dept,btn){
  document.querySelectorAll('.emp-filter-pill').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const emps=dept==='all'?getVisibleEmps():getVisibleEmps().filter(e=>e.dept===dept);
  renderEmpRows(emps);
}
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

    <div class="ze-section">
      <div class="ze-section-hd">
        <h4 style="margin:0">⏱️ Zeiterfassung</h4>
        <span class="ze-badge-ro">Nur lesen</span>
      </div>
      <div class="ze-controls">
        <div class="ze-view-tabs">
          <button class="ze-view-tab active" onclick="zeSetView('monat',${e.id},this)">Monat</button>
          <button class="ze-view-tab" onclick="zeSetView('tag',${e.id},this)">Tag</button>
        </div>
        <select class="ze-select" id="zeMonatSel" onchange="zeLoadView(${e.id})">
          ${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${i+1===new Date().getMonth()+1?'selected':''}>${MONTHS_DE[i]}</option>`).join('')}
        </select>
        <input type="date" class="ze-date-input" id="zeTagInput" value="${isoDate(new Date())}" onchange="zeLoadView(${e.id})" style="display:none">
      </div>
      <div id="zeViewArea"><div class="ze-loading">Daten werden geladen</div></div>
      <div class="ze-pdf-buttons" style="margin-top:12px">
        <button class="ze-pdf-btn" onclick="zeDownloadMonatPDF(${e.id})"><span class="ms">picture_as_pdf</span> PDF Monat</button>
        <button class="ze-pdf-btn" onclick="zeDownloadTagPDF(${e.id})"><span class="ms">today</span> PDF Tag</button>
        <button class="ze-pdf-btn" onclick="zeDownloadGesamtPDF(${e.id})"><span class="ms">summarize</span> PDF Gesamt</button>
      </div>
    </div>
  `);

  // Auto-load Zeiterfassung data
  setTimeout(()=>zeLoadView(e.id),100);
}

// ═══ ZEITERFASSUNG HELPERS ═══
let _zeCurrentView = 'monat';

function getEmployeeNr(empId) {
  return String(empId).padStart(5, '0');
}

function zeSetView(view, empId, btn) {
  _zeCurrentView = view;
  // Toggle tabs
  document.querySelectorAll('.ze-view-tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  // Toggle controls
  const monatSel = document.getElementById('zeMonatSel');
  const tagInput = document.getElementById('zeTagInput');
  if(monatSel) monatSel.style.display = view==='monat' ? '' : 'none';
  if(tagInput) tagInput.style.display = view==='tag' ? '' : 'none';
  zeLoadView(empId);
}

async function zeLoadView(empId) {
  const area = document.getElementById('zeViewArea');
  if(!area) return;
  area.innerHTML = '<div class="ze-loading">Daten werden geladen</div>';

  const e = EMPS.find(x=>x.id===empId);
  if(!e) { area.innerHTML = '<div class="ze-empty"><span class="ms">error</span>Mitarbeiter nicht gefunden</div>'; return; }

  const empNr = getEmployeeNr(empId);
  const standort = e.location;
  const jahr = new Date().getFullYear();

  try {
    if(_zeCurrentView === 'monat') {
      await zeRenderMonat(area, empNr, standort, jahr);
    } else if(_zeCurrentView === 'tag') {
      await zeRenderTag(area, empNr, standort);
    }
  } catch(err) {
    console.warn('[ZE] Error:', err);
    area.innerHTML = '<div class="ze-empty"><span class="ms">cloud_off</span>Fehler beim Laden der Zeiterfassung</div>';
  }
}

function zeCodeBadge(code) {
  if(!code) return '';
  const cls = 'code-' + code.toLowerCase();
  const labels = {K:'Krank', U:'Urlaub', UU:'Unbez. Urlaub', F:'Feiertag', FB:'Fortbildung'};
  return `<span class="ze-code ${cls}">${labels[code]||code}</span>`;
}

async function zeRenderMonat(area, empNr, standort, jahr) {
  const monat = parseInt(document.getElementById('zeMonatSel')?.value || (new Date().getMonth()+1));

  // Fetch daily data for this month
  const {data: daily, error: dErr} = await sb.from('zeiterfassung_daily')
    .select('*')
    .eq('employee_nr', empNr)
    .eq('standort_id', standort)
    .eq('jahr', jahr)
    .eq('monat', monat)
    .order('datum');
  if(dErr) throw dErr;

  // Fetch monthly summary
  const {data: monthly, error: mErr} = await sb.from('zeiterfassung_monthly')
    .select('*')
    .eq('employee_nr', empNr)
    .eq('standort_id', standort)
    .eq('jahr', jahr)
    .eq('monat', monat)
    .single();

  if(!daily?.length && !monthly) {
    area.innerHTML = `<div class="ze-empty"><span class="ms">event_busy</span>Keine Zeiterfassung-Daten für ${MONTHS_DE[monat-1]} ${jahr}</div>`;
    return;
  }

  let h = '';

  // Daily table
  if(daily && daily.length) {
    h += `<div class="ze-table-wrap"><table class="ze-table">
      <thead><tr><th>Datum</th><th>Tag</th><th>Beginn</th><th>Ende</th><th>Pause</th><th>Dauer</th><th>Code</th></tr></thead>
      <tbody>`;
    daily.forEach(d => {
      const dateStr = d.datum ? new Date(d.datum).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}) : '—';
      h += `<tr>
        <td>${dateStr}</td>
        <td class="ze-td-day">${d.wochentag||''}</td>
        <td>${d.beginn||'—'}</td>
        <td>${d.ende||'—'}</td>
        <td>${d.pause||'—'}</td>
        <td>${d.dauer||'—'}</td>
        <td>${zeCodeBadge(d.code)}</td>
      </tr>`;
    });
    h += '</tbody></table></div>';
  }

  area.innerHTML = h;
}

async function zeRenderTag(area, empNr, standort) {
  const datum = document.getElementById('zeTagInput')?.value;
  if(!datum) { area.innerHTML = '<div class="ze-empty"><span class="ms">today</span>Bitte Datum auswählen</div>'; return; }

  const {data, error} = await sb.from('zeiterfassung_daily')
    .select('*')
    .eq('employee_nr', empNr)
    .eq('standort_id', standort)
    .eq('datum', datum)
    .single();

  if(error || !data) {
    const dateDE = new Date(datum).toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
    area.innerHTML = `<div class="ze-empty"><span class="ms">event_busy</span>Keine Daten für ${dateDE}</div>`;
    return;
  }

  const d = data;
  const dateDE = new Date(d.datum).toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});

  let h = `<div class="ze-day-card">
    <div class="ze-day-card-title">${dateDE} ${zeCodeBadge(d.code)}</div>
    <div class="ze-day-grid">
      <div><div class="ze-day-field-label">Beginn</div><div class="ze-day-field-val">${d.beginn||'—'}</div></div>
      <div><div class="ze-day-field-label">Ende</div><div class="ze-day-field-val">${d.ende||'—'}</div></div>
      <div><div class="ze-day-field-label">Pause</div><div class="ze-day-field-val">${d.pause||'—'}</div></div>
      <div><div class="ze-day-field-label">Dauer</div><div class="ze-day-field-val">${d.dauer||'—'}</div></div>
    </div>
    ${d.bemerkung?`<div style="margin-top:10px;font-size:.75rem;color:var(--text-muted)">📝 ${d.bemerkung}</div>`:''}
  </div>`;

  // Also show the Ist-Stunden
  if(d.ist_stunden) {
    h += `<div style="font-size:.8rem;color:var(--text-secondary)">Ist-Stunden: <strong style="font-family:'Space Mono',monospace">${d.ist_stunden.toFixed(1)}h</strong></div>`;
  }

  area.innerHTML = h;
}



// ═══ ZEITERFASSUNG – Build today entry from real time_records ═══

// 15-min snap helpers (Japanese-style 丸め)
// Check-in: round UP to next 15-min mark (10:48 → 11:00)
function snap15Ceil(date) {
  const d = new Date(date);
  const min = d.getMinutes();
  const remainder = min % 15;
  if (remainder === 0) return d;
  d.setMinutes(min + (15 - remainder), 0, 0);
  return d;
}

// Check-out: round DOWN to previous 15-min mark (22:07 → 22:00)
function snap15Floor(date) {
  const d = new Date(date);
  const min = d.getMinutes();
  const remainder = min % 15;
  d.setMinutes(min - remainder, 0, 0);
  return d;
}

function buildTodayEntry(todayRecords, todayISO) {
  if (!todayRecords || !todayRecords.length) return null;

  // Beginn = earliest check_in → snap UP to 15-min grid
  const rawFirstIn = new Date(todayRecords[0].check_in);
  const firstIn = snap15Ceil(rawFirstIn);
  const beginn = firstIn.toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit', timeZone:'Europe/Berlin'});

  // Ende = latest check_out → snap DOWN to 15-min grid (if any)
  const checkouts = todayRecords.filter(r => r.check_out).map(r => new Date(r.check_out));
  let ende = null;
  let endeStr = '—';
  if (checkouts.length) {
    const rawEnde = new Date(Math.max(...checkouts));
    ende = snap15Floor(rawEnde);
    endeStr = ende.toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit', timeZone:'Europe/Berlin'});
  }

  // Pause = total gap between consecutive snapped check_out[i] → check_in[i+1]
  let pauseMin = 0;
  for (let i = 0; i < todayRecords.length - 1; i++) {
    if (todayRecords[i].check_out && todayRecords[i+1].check_in) {
      const snappedOut = snap15Floor(new Date(todayRecords[i].check_out));
      const snappedIn = snap15Ceil(new Date(todayRecords[i+1].check_in));
      const gapMs = snappedIn - snappedOut;
      if (gapMs > 0) pauseMin += Math.round(gapMs / 60000);
    }
  }
  const pauseH = Math.floor(pauseMin / 60);
  const pauseM = pauseMin % 60;
  const pauseStr = pauseH + ':' + String(pauseM).padStart(2, '0');

  // Dauer = snapped Ende - snapped Beginn - Pause
  let dauerStr = '—';
  let istStunden = 0;
  if (ende) {
    const totalMin = Math.round((ende - firstIn) / 60000) - pauseMin;
    const dH = Math.floor(totalMin / 60);
    const dM = totalMin % 60;
    dauerStr = dH + ':' + String(dM).padStart(2, '0');
    istStunden = totalMin / 60;
  }

  // Wochentag from date
  const WOCHENTAGE_SHORT = ['So','Mo','Di','Mi','Do','Fr','Sa'];
  const wt = WOCHENTAGE_SHORT[new Date(todayISO).getDay()];

  return {
    datum: todayISO,
    wochentag: wt,
    beginn: beginn,
    ende: endeStr,
    pause: pauseStr,
    dauer: dauerStr,
    ist_stunden: istStunden,
    code: '',
    bemerkung: ''
  };
}

// ═══ ZEITERFASSUNG PDF EXPORTS ═══

// Helper: save jsPDF doc — opens in new tab (file:// blocks download attr)
function zeSavePDF(doc, filename) {
  const blob = new Blob([doc.output('arraybuffer')], {type:'application/pdf'});
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if(!win) toast('Bitte Pop-ups erlauben','warn');
  // Revoke after tab loads
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  toast('PDF geöffnet — Cmd+S zum Speichern');
}

async function zeDownloadMonatPDF(empId) {
  const e = EMPS.find(x=>x.id===empId); if(!e) return;
  const empNr = getEmployeeNr(empId);
  const monat = parseInt(document.getElementById('zeMonatSel')?.value || (new Date().getMonth()+1));
  const jahr = new Date().getFullYear();
  const mm = String(monat).padStart(2,'0');
  // File format: 00001_Nguyen_2026_01.pdf (only Nachname)
  const parts = e.name.split(' ');
  const nachname = parts.length>=2 ? parts[parts.length-1] : e.name;
  const path = `${jahr}/${e.location}/${empNr}_${nachname}_${jahr}_${mm}.pdf`;
  console.log('[ZE PDF Monat] path:', path);
  toast('PDF wird geöffnet...');
  try {
    const {data} = sb.storage.from('zeiterfassung-pdfs').getPublicUrl(path);
    if(!data?.publicUrl) throw new Error('URL nicht verfügbar');
    console.log('[ZE PDF Monat] url:', data.publicUrl);
    window.open(data.publicUrl, '_blank');
    toast('PDF geöffnet ✓');
  } catch(err) {
    console.warn('[ZE PDF] path tried:', path, err);
    toast('PDF nicht verfügbar – Datei fehlt','warn');
  }
}

async function zeDownloadTagPDF(empId) {
  const e = EMPS.find(x=>x.id===empId); if(!e) return;
  const empNr = getEmployeeNr(empId);
  const monat = parseInt(document.getElementById('zeMonatSel')?.value || (new Date().getMonth()+1));
  const jahr = new Date().getFullYear();
  const now = new Date();
  const todayISO = isoDate(now);
  const todayMonth = now.getMonth() + 1;
  const todayYear = now.getFullYear();
  const isCurrentMonth = (monat === todayMonth && jahr === todayYear);
  console.log('[ZE PDF Tag] empId:', empId, 'empNr:', empNr, 'monat:', monat, 'jahr:', jahr, 'todayISO:', todayISO, 'isCurrentMonth:', isCurrentMonth);

  // --- Step 1: Fetch fake data (all days, or up to yesterday if current month) ---
  let fakeQuery = sb.from('zeiterfassung_daily')
    .select('*')
    .eq('employee_nr', empNr)
    .eq('standort_id', e.location)
    .eq('jahr', jahr)
    .eq('monat', monat);

  if (isCurrentMonth) {
    // Only fetch up to yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    fakeQuery = fakeQuery.lte('datum', isoDate(yesterday));
  }

  const {data: fakeDaily, error} = await fakeQuery.order('datum');
  if(error) { console.error('[ZE PDF Tag] fetch fake:', error); }

  // --- Step 2: Fetch real data for today from time_records (only if current month) ---
  let todayEntry = null;
  if (isCurrentMonth) {
    const {data: todayRecords, error: trErr} = await sb.from('time_records')
      .select('check_in, check_out')
      .eq('emp_id', empId)
      .gte('check_in', todayISO + 'T00:00:00')
      .lt('check_in', todayISO + 'T23:59:59')
      .order('check_in');
    if(trErr) console.warn('[ZE PDF Tag] fetch time_records:', trErr);
    todayEntry = buildTodayEntry(todayRecords, todayISO);
  }

  // --- Step 3: Merge fake + real ---
  const allDaily = [...(fakeDaily || [])];
  if (todayEntry) allDaily.push(todayEntry);
  console.log('[ZE PDF Tag] fakeDaily:', fakeDaily?.length, 'todayEntry:', todayEntry, 'allDaily:', allDaily.length);

  if(!allDaily.length) {
    toast('Keine Daten für diesen Monat','warn');
    return;
  }

  toast('PDF wird erstellt...');
  try {
    if(!window.jspdf) { toast('jsPDF-Bibliothek nicht geladen.','err'); return; }
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF({unit:'mm', format:'a4'});
    const locName = LOCS.find(l=>l.id===e.location)?.name || e.location;
    const parts = e.name.split(' ');
    const zeName = parts.length>=2 ? parts[parts.length-1]+', '+parts.slice(0,-1).join(' ') : e.name;

    // === HEADER (matching reference format) ===
    doc.setFontSize(12);
    doc.setFont(undefined,'bold');
    doc.text('Dokumentation der täglichen Arbeitszeit', 20, 20);
    doc.setLineWidth(0.5);
    doc.line(20, 21.5, 148, 21.5);

    doc.setFontSize(10);
    doc.setFont(undefined,'bold');
    doc.text('Firma:', 20, 32);
    doc.setFont(undefined,'normal');
    doc.text(locName, 65, 32);

    doc.setFont(undefined,'bold');
    doc.text('Name des Mitarbeiters:', 20, 40);
    doc.setFont(undefined,'normal');
    doc.text(zeName, 65, 40);
    doc.line(65, 41, 140, 41);

    doc.setFont(undefined,'bold');
    doc.text('Pers.-Nr.:', 20, 48);
    doc.setFont(undefined,'normal');
    doc.text(empNr, 45, 48);

    doc.setFont(undefined,'bold');
    doc.text('Monat/Jahr:', 100, 48);
    doc.setFont(undefined,'normal');
    doc.text(MONTHS_DE[monat-1] + ' ' + jahr, 130, 48);

    // === TABLE ===
    const colX = [20, 38, 58, 78, 98, 118, 130, 160];
    const colW = [18, 20, 20, 20, 20, 12, 30, 30];
    const headers1 = ['Kalen-', 'Beginn', 'Pause', 'Ende', 'Dauer', '*', 'aufgezeichnet', 'Bemerkungen'];
    const headers2 = ['dertag', '(Uhrzeit)', '(Dauer)', '(Uhrzeit)', '(Summe)', '', 'am:', ''];
    let y = 56;
    const rowH = 6.5;

    // Table header
    doc.setFontSize(7);
    doc.setFont(undefined,'bold');
    doc.setLineWidth(0.3);
    doc.rect(colX[0], y-1, 170, rowH*2);
    for(let i=0; i<colX.length; i++) {
      if(i>0) doc.line(colX[i], y-1, colX[i], y-1+rowH*2);
      doc.text(headers1[i], colX[i]+1, y+3);
      doc.text(headers2[i], colX[i]+1, y+3+rowH);
    }
    y += rowH*2;

    // Determine how many days to render:
    // Current month → up to today; past months → full month
    const daysInMonth = new Date(jahr, monat, 0).getDate();
    const lastDay = isCurrentMonth ? now.getDate() : daysInMonth;

    const dayMap = {};
    allDaily.forEach(d => {
      const dayNum = parseInt(String(d.datum).split('-')[2]);
      dayMap[dayNum] = d;
    });

    const WOCHENTAGE = ['So','Mo','Di','Mi','Do','Fr','Sa'];

    doc.setFont(undefined,'normal');
    let totalMinutes = 0;

    for(let day=1; day<=lastDay; day++) {
      if(y > 270) { doc.addPage(); y = 20; }

      const dateObj = new Date(jahr, monat-1, day);
      const wt = WOCHENTAGE[dateObj.getDay()];
      const d = dayMap[day];

      // Draw row borders
      doc.setLineWidth(0.15);
      doc.rect(colX[0], y-1, 170, rowH);

      // Vertical lines
      for(let i=1; i<colX.length; i++) {
        doc.line(colX[i], y-1, colX[i], y-1+rowH);
      }

      doc.text(String(day), colX[0]+2, y+3.5);

      if(d && d.code && d.code !== '') {
        // Special day (Krank, Urlaub, etc.)
        const codeLabels = {K:'Krank',U:'Urlaub',UU:'unbez.Urlaub',F:'Feiertag',FB:'Fortbildung'};
        if(d.dauer) doc.text(d.dauer, colX[4]+1, y+3.5);
        doc.text(d.code, colX[5]+1, y+3.5);
        doc.text(codeLabels[d.code] || d.code, colX[7]+1, y+3.5);
        if(d.ist_stunden) totalMinutes += Math.round(d.ist_stunden * 60);
      } else if(d && d.beginn) {
        // Normal work day (fake or real)
        doc.text(d.beginn || '', colX[1]+1, y+3.5);
        doc.text(d.pause || '', colX[2]+1, y+3.5);
        doc.text(d.ende || '', colX[3]+1, y+3.5);
        doc.text(d.dauer || '', colX[4]+1, y+3.5);
        doc.text(wt, colX[7]+1, y+3.5);
        if(d.ist_stunden) totalMinutes += Math.round(d.ist_stunden * 60);
      } else if(dateObj.getDay() === 0) {
        // Sunday
        doc.text('So Ruhetag', colX[7]+1, y+3.5);
      } else {
        // No data
        doc.text(wt, colX[7]+1, y+3.5);
      }

      y += rowH;
    }

    // === SUMME ===
    y += 4;
    const totalH = Math.floor(totalMinutes / 60);
    const totalM = totalMinutes % 60;
    const sumStr = totalH + ':' + String(totalM).padStart(2,'0');
    doc.setFont(undefined,'bold');
    doc.setFontSize(9);
    doc.text('Summe:', 98, y);
    doc.text(sumStr, 118, y);
    doc.setLineWidth(0.5);
    doc.line(118, y+1, 138, y+1);

    // === UNTERSCHRIFT ===
    y += 20;
    doc.setFontSize(7);
    doc.setFont(undefined,'normal');
    doc.setLineWidth(0.3);
    doc.line(20, y, 70, y);
    doc.line(120, y, 170, y);
    y += 4;
    doc.text('Datum', 20, y);
    doc.text('Unterschrift des Arbeitnehmers', 35, y);
    doc.text('Datum', 120, y);
    doc.text('Unterschrift des Arbeitgebers', 135, y);

    // === KÜRZEL ===
    y += 10;
    doc.setFontSize(6);
    doc.setFont(undefined,'bold');
    doc.text('* Kürzel: K=Krank, U=Urlaub, UU=unbez.Urlaub, F=Feiertag, FB=Fortbildung', 20, y);

    zeSavePDF(doc, `${empNr}_${parts[parts.length-1]}_${jahr}_${String(monat).padStart(2,'0')}.pdf`);
    toast('PDF erstellt ✓');
  } catch(err) {
    console.error('[ZE PDF Tag]', err);
    toast('PDF-Fehler: '+err.message,'err');
  }
}

async function zeDownloadGesamtPDF(empId) {
  const e = EMPS.find(x=>x.id===empId); if(!e) return;
  const empNr = getEmployeeNr(empId);
  const jahr = new Date().getFullYear();

  toast('PDF Gesamt wird erstellt...');

  // Fetch monthly summaries
  const {data: monthly, error: mErr} = await sb.from('zeiterfassung_monthly')
    .select('*')
    .eq('employee_nr', empNr)
    .eq('standort_id', e.location)
    .eq('jahr', jahr)
    .order('monat');

  if(!monthly?.length) {
    toast('Keine Daten für '+jahr,'warn');
    return;
  }

  try {
    if(!window.jspdf) { toast('jsPDF-Bibliothek nicht geladen.','err'); return; }
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF({unit:'mm', format:'a4'});
    const locName = LOCS.find(l=>l.id===e.location)?.name || e.location;
    const parts = e.name.split(' ');
    const zeName = parts.length>=2 ? parts[parts.length-1]+', '+parts.slice(0,-1).join(' ') : e.name;
    const sollMonat = e.spiSoll || 160;

    // === HEADER ===
    doc.setFontSize(14);
    doc.setFont(undefined,'bold');
    doc.text(`Jahresübersicht ${jahr} — ${locName}`, 20, 20);

    doc.setFontSize(9);
    doc.setFont(undefined,'normal');
    doc.text(`${locName}  |  ${zeName}  |  Pers.-Nr.: ${empNr}  |  Std/Mon: ${sollMonat.toFixed(1)}h`, 20, 28);

    // === TABLE ===
    const colX  = [20, 50, 75, 100, 125, 150, 165, 177, 190];
    const headers = ['Monat', 'Ist-Std', 'Soll-Std', 'Saldo', 'Kum.Saldo', 'Krank', 'Urlaub', 'UU', 'Fortb.'];
    const colEnd = 197;
    let y = 36;
    const rowH = 8;

    // Header row
    doc.setFontSize(8);
    doc.setFont(undefined,'bold');
    doc.setLineWidth(0.3);
    doc.rect(colX[0], y-2, colEnd-colX[0], rowH);
    for(let i=0; i<colX.length; i++) {
      if(i>0) doc.line(colX[i], y-2, colX[i], y-2+rowH);
      doc.text(headers[i], colX[i]+2, y+3);
    }
    y += rowH;

    // Data rows
    doc.setFont(undefined,'normal');
    const MONAT_NAMEN = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

    function fmtHM(hours) {
      const neg = hours < 0;
      const abs = Math.abs(hours);
      const h = Math.floor(abs);
      const m = Math.round((abs - h) * 60);
      return (neg?'-':'') + h + ':' + String(m).padStart(2,'0');
    }

    let totalIst = 0, totalSoll = 0, totalKrank = 0, totalUrlaub = 0, totalUU = 0, totalFB = 0;

    monthly.forEach(m => {
      doc.setLineWidth(0.15);
      doc.rect(colX[0], y-2, colEnd-colX[0], rowH);
      for(let i=1; i<colX.length; i++) {
        doc.line(colX[i], y-2, colX[i], y-2+rowH);
      }

      doc.text(MONAT_NAMEN[m.monat-1] || '', colX[0]+2, y+3);
      doc.text(fmtHM(m.ist_stunden||0), colX[1]+2, y+3);
      doc.text(fmtHM(m.soll_stunden||0), colX[2]+2, y+3);
      doc.text(fmtHM(m.saldo||0), colX[3]+2, y+3);
      doc.text(fmtHM(m.kum_saldo||0), colX[4]+2, y+3);
      doc.text(String(m.krank_tage||0), colX[5]+2, y+3);
      doc.text(String(m.urlaub_tage||0), colX[6]+2, y+3);
      doc.text(String(m.uu_tage||0), colX[7]+2, y+3);
      doc.text(String(m.fb_tage||0), colX[8]+2, y+3);

      totalIst += (m.ist_stunden||0);
      totalSoll += (m.soll_stunden||0);
      totalKrank += (m.krank_tage||0);
      totalUrlaub += (m.urlaub_tage||0);
      totalUU += (m.uu_tage||0);
      totalFB += (m.fb_tage||0);

      y += rowH;
    });

    // GESAMT row
    const lastKum = monthly[monthly.length-1].kum_saldo || 0;
    const pct = totalSoll > 0 ? ((totalIst - totalSoll) / totalSoll * 100).toFixed(1) : '0.0';
    doc.setFont(undefined,'bold');
    doc.setLineWidth(0.5);
    doc.rect(colX[0], y-2, colEnd-colX[0], rowH);
    for(let i=1; i<colX.length; i++) {
      doc.line(colX[i], y-2, colX[i], y-2+rowH);
    }
    doc.text('GESAMT', colX[0]+2, y+3);
    doc.text(fmtHM(totalIst), colX[1]+2, y+3);
    doc.text(fmtHM(totalSoll), colX[2]+2, y+3);
    doc.text(fmtHM(totalIst-totalSoll), colX[3]+2, y+3);
    doc.text(fmtHM(lastKum) + ' (' + pct + '%)', colX[4]+2, y+3);
    doc.text(String(totalKrank), colX[5]+2, y+3);
    doc.text(String(totalUrlaub), colX[6]+2, y+3);
    doc.text(String(totalUU), colX[7]+2, y+3);
    doc.text(String(totalFB), colX[8]+2, y+3);

    zeSavePDF(doc, `${empNr}_${parts[parts.length-1]}_${jahr}_Jahresuebersicht.pdf`);
    toast('PDF Gesamt erstellt ✓');
  } catch(err) {
    console.error('[ZE PDF Gesamt]', err);
    toast('PDF-Fehler: '+err.message,'err');
  }
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

  let html=`
  <div class="dept-page-hd">
    <div>
      <h2 class="dept-page-title">Abteilungsübersicht</h2>
      <p class="dept-page-sub">Verwalten Sie Ihre Teams, verfolgen Sie die Personalkosten und optimieren Sie die Schichtplanung.</p>
    </div>
    ${can('editDepartments')?`<button class="dept-add-btn" onclick="openModal('addDept')"><span class="ms">add</span> Neuer Bereich</button>`:''}
  </div>
  <div class="dept-accordion">`;

  if(!depts.length) html+=`<div class="dept-empty"><span class="ms">domain</span><p>Keine Bereiche gefunden.</p></div>`;

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
    const city=LOCS.find(l=>l.id===dept.location)?.city||LOCS.find(l=>l.id===dept.location)?.name||'';
    const pctColor=hoursPct>=90?'#10b981':hoursPct>=70?'#f59e0b':'#ef4444';
    const barGrad=`linear-gradient(90deg,${pctColor},${pctColor}88)`;

    html+=`
    <div class="dept-card">
      <div class="dept-card-header" onclick="(function(el){
        const body=document.getElementById('${deptId}');
        const open=body.classList.toggle('is-open');
        el.querySelector('.dept-toggle-arrow').classList.toggle('is-open',open);
      })(this)">
        <div class="dept-color-bar" style="border-left-color:${dept.color||'#6366f1'}"></div>
        <div class="dept-header-name-block">
          <div class="dept-card-name">${dept.name}</div>
          <div class="dept-card-location"><span class="ms">location_on</span>${city}</div>
        </div>
        <div class="dept-divider"></div>
        <div class="dept-leitung-block">
          <div class="dept-leitung-label">Leitung</div>
          <div class="dept-leitung-name">${dept.head||'—'}</div>
        </div>
        <div class="dept-stats">
          <div class="dept-stat-badge is-active"><span class="dept-stat-label">👥 Aktiv</span><span class="dept-stat-val">${activeCount}</span></div>
          <div class="dept-stat-badge is-sick"><span class="dept-stat-label">🏥 Krank</span><span class="dept-stat-val">${sickCount}</span></div>
          <div class="dept-stat-badge is-vacation"><span class="dept-stat-label">🏖️ Urlaub</span><span class="dept-stat-val">${vacCount}</span></div>
          <div class="dept-stat-badge is-dienst"><span class="dept-stat-label">📋 Dienst</span><span class="dept-stat-val">${todayShifts.length}</span></div>
        </div>
        ${isAdmin?`<div class="dept-divider"></div><div class="dept-cost-block"><div class="dept-cost-label">Personalkosten</div><div class="dept-cost-val">${formatEuro(totalCost)}</div></div>`:''}
        <span class="ms dept-toggle-arrow">expand_more</span>
      </div>

      <div class="dept-card-body" id="${deptId}">
        <div class="dept-body-grid">
          <div class="dept-left-panel">
            <div class="dept-progress-card">
              <div class="dept-progress-hd">
                <div>
                  <div class="dept-progress-label">Plan-Stunden</div>
                  <div class="dept-progress-pct">${hoursPct}% <span>erfüllt</span></div>
                </div>
                <span class="ms" style="color:${pctColor};font-size:1.4rem">${hoursPct>=80?'trending_up':'trending_down'}</span>
              </div>
              <div class="dept-progress-bar-track">
                <div class="dept-progress-bar-fill" style="width:${Math.min(hoursPct,100)}%;background:${barGrad}"></div>
              </div>
              <div class="dept-progress-hint">${totalHours}h / ${sollHours}h Soll · Optimaler Bereich: 80–90%</div>
            </div>
            ${todayShifts.length?`
            <div>
              <div class="dept-shifts-title"><span class="ms">schedule</span> Heutige Schichten</div>
              <div class="dept-shift-pills">
                ${todayShifts.map(s=>{
                  const dotColor=s.from<'14:00'?'#10b981':'#f97316';
                  return `<span class="dept-shift-pill"><span class="dept-shift-dot" style="background:${dotColor}"></span>${s.empName.split(' ')[0]} ${s.from}–${s.to}</span>`;
                }).join('')}
              </div>
            </div>`:`<div style="font-size:.8rem;color:var(--text-muted);text-align:center;padding:16px 0"><span class="ms" style="display:block;font-size:1.8rem;margin-bottom:4px">event_busy</span>Keine Schichten heute</div>`}
          </div>
          <div class="dept-emp-table-wrap">
            <table class="dept-emp-table">
              <thead><tr>
                <th>Mitarbeiter</th><th>Position</th>
                <th class="center">Status</th><th class="center">Plan-Std.</th>
                ${isAdmin?'<th style="text-align:right">Brutto</th>':''}
              </tr></thead>
              <tbody>
                ${deptEmps.length?deptEmps.map(e=>{
                  const planH=calcPlanHours(e.id);
                  const pctH=e.sollStunden>0?Math.round(planH/e.sollStunden*100):0;
                  const hc=pctH>=90?'#059669':pctH>=70?'#d97706':'#dc2626';
                  return `<tr>
                    <td class="name-cell"><div style="display:flex;align-items:center;gap:10px"><div class="emp-avatar" style="width:32px;height:32px;font-size:.7rem;border-radius:10px">${e.avatar}</div>${e.name}</div></td>
                    <td>${e.position||'—'}</td>
                    <td class="status-cell">${statusBadge(e.status)}</td>
                    <td class="hours-cell"><span style="font-weight:700;color:${hc}">${planH}h</span><span style="font-size:.7rem;color:var(--text-muted)">/${e.sollStunden}h</span></td>
                    ${isAdmin?`<td class="cost-cell">${formatEuro(e.bruttoGehalt)}</td>`:''}
                  </tr>`;
                }).join(''):`<tr><td colspan="${isAdmin?5:4}" style="text-align:center;padding:24px;color:var(--text-muted)">Keine Mitarbeiter</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
  });

  html+=`</div>`;

  if(isAdmin && depts.length){
    const allEmps=EMPS.filter(e=>depts.some(d=>d.name===e.dept&&d.location===e.location));
    const totalCostAll=allEmps.reduce((s,e)=>s+e.bruttoGehalt,0);
    const avgPct=depts.length>0?Math.round(depts.map(d=>{
      const de=EMPS.filter(e=>e.dept===d.name&&e.location===d.location);
      const th=de.reduce((s,e)=>s+calcPlanHours(e.id),0);
      const sh=de.reduce((s,e)=>s+e.sollStunden,0);
      return sh>0?th/sh*100:0;
    }).reduce((a,b)=>a+b,0)/depts.length):0;
    const totalToday=SHIFTS.filter(s=>s.date===today&&depts.some(d=>d.name===s.dept&&d.location===s.location)&&!s.isSick&&!s.isVacation).length;

    html+=`
    <div class="dept-insight-grid">
      <div class="dept-insight-main">
        <div class="dept-insight-title">Effizienz-Zusammenfassung</div>
        <div class="dept-insight-stats">
          <div><div class="dept-insight-stat-label">Durchschn. Auslastung</div><div class="dept-insight-stat-val">${avgPct}%</div></div>
          <div><div class="dept-insight-stat-label">Gesamtkosten / Monat</div><div class="dept-insight-stat-val">${formatEuro(totalCostAll)}</div></div>
          <div><div class="dept-insight-stat-label">Schichten heute</div><div class="dept-insight-stat-val">${totalToday}</div></div>
        </div>
        <div class="dept-insight-actions">
          <button class="dept-insight-btn-ghost" onclick="exportPDF()">Bericht exportieren</button>
          <button class="dept-insight-btn-solid" onclick="navigate('reports',null)">Details ansehen</button>
        </div>
      </div>
      <div class="dept-insight-side">
        <span class="ms dept-insight-side-icon">analytics</span>
        <div class="dept-insight-side-title">Automatischer Dienstplan</div>
        <div class="dept-insight-side-sub">KI-gestützte Optimierung für Ihre Personalplanung basierend auf historischen Daten.</div>
        <button class="dept-insight-side-btn" onclick="copyWeek()">Vorschlag generieren</button>
      </div>
    </div>`;
  }

  pg.innerHTML=html;
}

// ═══ SCHEDULE ═══
function setView(v,btn){scheduleView=v;renderSchedule();}
function schedNav(dir){if(scheduleView==='day')scheduleDate.setDate(scheduleDate.getDate()+dir);else if(scheduleView==='week')scheduleDate.setDate(scheduleDate.getDate()+7*dir);else scheduleDate.setMonth(scheduleDate.getMonth()+dir);renderSchedule();}

function renderSchedule(){
  const pg=document.getElementById('page-schedule');
  const canEdit=can('editSchedules');const canExp=can('canExport');
  const isEmp=currentUser.role==='mitarbeiter';
  const me=EMPS.find(e=>e.id===currentUser.empId);

  let banner=isEmp?permBanner(`Du siehst den Arbeitsplan deines Bereichs (${me?.dept||''} – ${getLocationName(me?.location||'')})`).trim():'';
  let shifts=getVisibleShifts();
  if(scheduleDept!=='all')shifts=shifts.filter(s=>s.dept===scheduleDept);
  // Conflict & efficiency bar
  const _wkStart=getWeekStart(scheduleDate);const _wkDays=[];for(let _i=0;_i<7;_i++){const _d=new Date(_wkStart);_d.setDate(_d.getDate()+_i);_wkDays.push(isoDate(_d));}
  const _totalWkShifts=shifts.filter(s=>_wkDays.includes(s.date)&&!s.isSick&&!s.isVacation).length;
  const _sickWkShifts=shifts.filter(s=>_wkDays.includes(s.date)&&s.isSick).length;
  const _effPct=_totalWkShifts>0?Math.min(100,Math.round((_totalWkShifts/(_totalWkShifts+2))*100)):0;

  let controls=`
  <div class="sc2-conflict-bar">
    <div class="sc2-conflict-left">
      <div class="sc2-conflict-item"><div class="sc2-conflict-icon" style="background:rgba(239,68,68,.08);color:#ef4444"><span class="ms">warning</span></div><div><div class="sc2-conflict-micro">Konflikte</div><div class="sc2-conflict-val">${_sickWkShifts} Warnungen gefunden</div></div></div>
      <div class="sc2-conflict-divider"></div>
      <div class="sc2-conflict-item"><div class="sc2-conflict-icon" style="background:rgba(99,102,241,.08);color:var(--accent)"><span class="ms">speed</span></div><div><div class="sc2-conflict-micro">Planungseffizienz</div><div class="sc2-conflict-val">${_effPct}% Auslastung</div></div></div>
    </div>
    <button class="sc2-detail-btn">Details anzeigen</button>
  </div>
  <div class="sc2-page-hd">
    <div>
      <h2 class="sc2-title">Arbeitsplan</h2>
      <div class="sc2-hd-row">
        <div class="sc2-view-toggle">
          <button class="sc2-view-btn${scheduleView==='week'?' active':''}" onclick="setView('week',this)">Woche</button>
          <button class="sc2-view-btn${scheduleView==='month'?' active':''}" onclick="setView('month',this)">Monat</button>
          <button class="sc2-view-btn${scheduleView==='day'?' active':''}" onclick="setView('day',this)">Tag</button>
        </div>
        <div class="sc2-week-nav">
          <button class="sc2-nav-btn" onclick="schedNav(-1)"><span class="ms">chevron_left</span></button>
          <span class="sc2-kw-label" id="schedLabel"></span>
          <button class="sc2-nav-btn" onclick="schedNav(1)"><span class="ms">chevron_right</span></button>
        </div>
      </div>
    </div>
    <div class="sc2-page-right">
    ${canEdit?`<button class="sc2-action-btn" onclick="copyWeek()"><span class="ms" style="font-size:1rem">content_copy</span> Woche kopieren</button>`:``}
      ${canEdit?`<div class="sc2-tmpl-wrap"><button class="sc2-action-btn" onclick="openModal('saveTemplate')"><span class="ms" style="font-size:1rem">bookmark</span> Vorlagen</button></div>`:``}
      ${canExp?`<button class="sc2-action-btn is-primary" onclick="exportPDF()"><span class="ms" style="font-size:1rem">picture_as_pdf</span> PDF Export</button>`:``}
      ${canEdit?`<button class="sc2-action-btn" onclick="openModal('addShift')" style="background:var(--accent);color:#fff;border-color:var(--accent)"><span class="ms" style="font-size:1rem">add</span> Schicht</button>`:``}
    </div>
  </div>

  <div class="sc2-filter-bar">
    <div class="sc2-filter-left">
      <span class="sc2-filter-label">Bereich</span>
      <button class="sc2-dept-pill${scheduleDept==='all'?' active':''}" onclick="scheduleDept='all';renderSchedule()">Alle</button>
      ${[...new Set(DEPTS.map(d=>d.name))].sort().map(d=>`<button class="sc2-dept-pill${scheduleDept===d?' active':''}" onclick="scheduleDept='${d}';renderSchedule()">${d}</button>`).join('')}
    </div>
    <div class="sc2-filter-right">
      <span class="ms" style="font-size:1rem">sort</span> Sortieren nach:
      <select class="sc2-sort-sel" onchange="scheduleSort=this.value;renderSchedule()">
        <option value="name"${scheduleSort==='name'?' selected':''}>Name</option>
        <option value="dept"${scheduleSort==='dept'?' selected':''}>Bereich</option>
        <option value="hours"${scheduleSort==='hours'?' selected':''}>Stunden</option>
      </select>
    </div>
  </div>`;

  pg.innerHTML=banner+controls+'<div id="schedC"></div>';

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
    let h='<div class="sc2-grid-wrap"><div class="table-wrap" style="overflow-x:auto"><table><thead><tr><th style="min-width:200px">Mitarbeiter</th>';
    dayD.forEach((ds,i)=>{const d=new Date(ds);const isToday=ds===isoDate(new Date());h+=`<th${isToday?' class="is-today"':''}><div class="th-day">${DAYS_DE[i]}</div><div class="th-date">${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}</div></th>`;});
    if(showH)h+='<th style="text-align:right">Σ Std.</th>';
    h+='</tr></thead><tbody>';
    emps.forEach(emp=>{
      const _empObj2=EMPS.find(e=>e.name===emp);const _empPos=_empObj2?.position||'';const _empInitials=emp.split(' ').map(n=>n[0]).join('').substring(0,2);
      h+=`<tr><td><div style="display:flex;align-items:center;gap:12px"><div class="sc2-emp-avatar">${_empInitials}</div><div><div class="sc2-emp-name">${emp}</div><div class="sc2-emp-pos">${_empPos}</div></div></div></td>`;
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
            h+=`<div class="shift-block compact-block schule" ${canEdit?`onclick="editShift(${s.id})" style="cursor:pointer"`:''}  
              ${canEdit?`draggable="true" ondragstart="onDragStart(event,${s.id})" ondragend="onDragEnd(event)"`:''}  data-sid="${s.id}">
              <span class="compact-letter">S</span>
              <div class="shift-time">${s.from}–${s.to}</div>
              ${canEdit?`<div class="shift-actions"><button class="shift-action-btn sick-btn" onclick="event.stopPropagation();markSick(${s.id})" title="Krank">🏥</button><button class="shift-action-btn" onclick="event.stopPropagation();deleteShift(${s.id})" title="Löschen" style="color:var(--danger)">🗑️</button></div>`:''}</div>`;
          } else {
            h+=`<div class="shift-block ${s.colorClass} ${s.isLate?'is-late':''}" ${canEdit?`onclick="editShift(${s.id})" style="cursor:pointer"`:''}  
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
      if(showH)h+=`<td class="sc2-total-cell"><div style="font-size:1.15rem;font-weight:900">${Math.round(weekH*10)/10}</div><span class="sc2-total-label">Std.</span></td>`;
      h+='</tr>';
    });
    if(!emps.length)h+=`<tr><td colspan="${8+(showH?1:0)}" style="text-align:center;color:var(--text-muted)">Keine Schichten</td></tr>`;
    h+='</tbody></table></div></div>';
    // Add footer and stats bento
    const _deptColors={};DEPTS.forEach(dept=>{_deptColors[dept.name]=dept.color||'var(--accent)';});
    const _deptHours={};shifts.filter(s=>_wkDays.includes(s.date)&&!s.isSick&&!s.isVacation).forEach(s=>{const[fh,fm]=s.from.split(':').map(Number);const[th,tm]=s.to.split(':').map(Number);const h2=(th+tm/60)-(fh+fm/60);_deptHours[s.dept]=(_deptHours[s.dept]||0)+h2;});
    const _totalH=Object.values(_deptHours).reduce((a,b)=>a+b,0);
    const _openShifts=_wkDays.length*emps.length-_totalWkShifts;

    h+=`<div class="sc2-grid-footer">
      <div class="sc2-footer-depts">${Object.entries(_deptHours).map(([d,hh])=>`<div class="sc2-footer-dept"><div class="sc2-footer-dot" style="background:${_deptColors[d]||'var(--accent)'}"></div>${d}: ${Math.round(hh)} Std.</div>`).join('')}</div>
      <div class="sc2-footer-total">Gesamtstunden Woche: <strong>${Math.round(_totalH*10)/10} Std.</strong></div>
    </div>`;

    h+=`<div class="sc2-bento">
      <div class="sc2-bento-card is-blue"><div><div class="sc2-bento-label">Planungseffizienz</div><div class="sc2-bento-sub">${_effPct}% der Zielbesetzung erreicht</div></div><div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:auto"><div class="sc2-bento-big">${_effPct}%</div></div></div>
      <div class="sc2-bento-card"><div class="sc2-bento-icon" style="background:rgba(239,68,68,.06);color:#ef4444"><span class="ms">warning</span></div><div class="sc2-bento-big" style="font-size:2.5rem">${_sickWkShifts}</div><div class="sc2-bento-micro">Konflikte gefunden</div></div>
      <div class="sc2-bento-card"><div class="sc2-bento-icon" style="background:rgba(99,102,241,.06);color:var(--accent)"><span class="ms">person_search</span></div><div class="sc2-bento-big" style="font-size:2.5rem">${Math.max(0,_openShifts)}</div><div class="sc2-bento-micro">Offene Schichten</div></div>
    </div>`;
    c.innerHTML=h;
  } else if(scheduleView==='day'){
    document.getElementById('schedLabel').textContent=scheduleDate.toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
    const ds=isoDate(scheduleDate);const dayS=shifts.filter(s=>s.date===ds);const seen=new Set();
    let h='<div class="table-wrap"><table><thead><tr><th>Mitarbeiter</th><th>Bereich</th><th>Schicht</th><th>Status</th>'+(canEdit?'<th>Aktionen</th>':'')+'</tr></thead><tbody>';
    dayS.forEach(s=>{if(seen.has(s.empId))return;seen.add(s.empId);
      const st=s.isSick?'<span class="badge badge-danger">Krank</span>':s.isVacation?'<span class="badge badge-info">Urlaub</span>':s.isLate?`<span class="badge badge-late">⏰+${s.lateMin}m</span>`:'<span class="badge badge-success">Aktiv</span>';
      h+=`<tr><td><strong style="color:var(--text-primary)">${s.empName}</strong></td><td>${s.dept}</td><td><div class="shift-block ${s.colorClass} ${s.isSick?'is-sick':''} ${s.isVacation?'is-vacation':''}">${s.label} (${s.from}–${s.to})</div></td><td>${st}</td>`;
      if(canEdit)h+=`<td><button class="btn btn-sm" onclick="editShift(${s.id})" title="Bearbeiten">✏️</button> <button class="btn btn-sm" onclick="markSick(${s.id})">🏥</button> <button class="btn btn-sm" onclick="markVac(${s.id})">🏖️</button> <button class="btn btn-sm" onclick="markLateShift(${s.id})">⏰</button></td>`;
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
  syncUpdateShift(sh);toast('Schicht verschoben ✓');renderSchedule();}

// ═══ EDIT SHIFT (click to edit) ═══
function editShift(id){
  const s=SHIFTS.find(x=>x.id===id);if(!s)return;
  const emp=EMPS.find(x=>x.id===s.empId);
  const tmplOpts=SHIFT_TEMPLATES.map((t,i)=>`<option value="${i}"${t.label===s.label?' selected':''}>${t.label} (${t.from}–${t.to})</option>`).join('');
  document.getElementById('modalTitle').textContent='Schicht bearbeiten';
  document.getElementById('modalBody').innerHTML=`<div class="form-grid">
    <div class="form-group full">
      <label class="form-label">Mitarbeiter</label>
      <div class="form-input" style="background:var(--bg-secondary);cursor:default">${s.empName} — ${s.dept}</div>
    </div>
    <div class="form-group full">
      <label class="form-label">Datum</label>
      <input class="form-input" type="date" id="edShiftDate" value="${s.date}">
    </div>
    <div class="form-group full">
      <label class="form-label">Vorlage</label>
      <select class="form-input" id="edShiftTmpl" onchange="const t=SHIFT_TEMPLATES[this.value];if(t){document.getElementById('edShiftFrom').value=t.from;document.getElementById('edShiftTo').value=t.to;}">
        <option value="">— Manuell —</option>
        ${tmplOpts}
      </select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group"><label class="form-label">Von</label><input class="form-input" type="time" id="edShiftFrom" value="${s.from}"></div>
      <div class="form-group"><label class="form-label">Bis</label><input class="form-input" type="time" id="edShiftTo" value="${s.to}"></div>
    </div>
  </div>`;
  document.getElementById('modalFooter').innerHTML=`<button class="btn btn-danger" onclick="deleteShift(${id});closeModal()">Löschen</button><button class="btn" onclick="closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="updateShiftFromModal(${id})">Speichern</button>`;
  document.getElementById('modalOverlay').classList.remove('hidden');
}
function updateShiftFromModal(id){
  const s=SHIFTS.find(x=>x.id===id);if(!s)return;
  const nd=document.getElementById('edShiftDate').value;
  const nf=document.getElementById('edShiftFrom').value;
  const nt=document.getElementById('edShiftTo').value;
  const tmplIdx=document.getElementById('edShiftTmpl').value;
  if(!nd||!nf||!nt){toast('Bitte alle Felder ausfüllen','err');return;}
  s.date=nd;s.from=nf;s.to=nt;
  if(tmplIdx!==''){s.label=SHIFT_TEMPLATES[tmplIdx].label;}
  syncUpdateShift(s);
  closeModal();toast('Schicht aktualisiert ✓');renderSchedule();
}
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
  const pg=document.getElementById('page-vacation');
  const isEmp=currentUser.role==='mitarbeiter';
  const me=EMPS.find(e=>e.id===currentUser.empId);
  const vacs=getVisibleVacs();
  const pendingVacs=vacs.filter(v=>v.status==='pending');
  const todayStr=isoDate(new Date());
  const todayVacs=vacs.filter(v=>v.status==='approved'&&v.from<=todayStr&&v.to>=todayStr).length;
  let empBanner='';
  if(isEmp&&me){const remain=me.vacTotal-me.vacUsed;empBanner=`<div class="vac-emp-banner"><span class="ms" style="color:var(--info)">info</span> Du siehst nur deinen eigenen Urlaub. Resturlaub: <strong>${remain} Tage</strong></div>`;}
  const tabDefs=can('seeAllVacations')?[['calendar','Kalender'],['requests','Antr\u00e4ge'],['overview','\u00dcbersicht'],['my','Meine Antr\u00e4ge']]:[['my','Meine Antr\u00e4ge']];
  if(!can('seeAllVacations'))vacationTab='my';
  const tabHtml=tabDefs.map(([k,l])=>`<button class="vac-tab${vacationTab===k?' active':''}" onclick="vacationTab='${k}';renderVacation()">${l}</button>`).join('');
  pg.innerHTML=`${empBanner}
    <div class="vac-topbar">
      <div class="vac-stats-strip">
        <div class="vac-stat-card"><div class="vac-stat-icon" style="background:rgba(59,79,210,.1);color:var(--accent)"><span class="ms">beach_access</span></div><div><div class="vac-stat-label">Heute im Urlaub</div><div class="vac-stat-num">${todayVacs}</div></div></div>
        <div class="vac-stat-card"><div class="vac-stat-icon" style="background:rgba(16,185,129,.1);color:#10b981"><span class="ms">pending_actions</span></div><div><div class="vac-stat-label">Offene Antr\u00e4ge</div><div class="vac-stat-num">${pendingVacs.length}</div></div></div>
      </div>
      <button class="vac-add-btn" onclick="openModal('addVacation')"><span class="ms">add</span> Urlaubsantrag stellen</button>
    </div>
    <div class="vac-tabs-bar">${tabHtml}</div>
    <div id="vacC"></div>`;
  const vc=document.getElementById('vacC');
  if(isEmp||(vacationTab==='my'&&me)){
    const myVacs=VACS.filter(v=>v.empId===currentUser.empId);
    const usedPct=me.vacTotal>0?Math.round(me.vacUsed/me.vacTotal*100):0;
    let h=`<div class="vac-my-stats"><div class="vac-my-card" style="border-top:3px solid var(--info)"><div class="vac-my-label">Gesamtanspruch</div><div class="vac-my-num">${me.vacTotal}</div><div class="vac-my-sub">Tage / Jahr</div></div><div class="vac-my-card" style="border-top:3px solid var(--warning)"><div class="vac-my-label">Genommen</div><div class="vac-my-num">${me.vacUsed}</div><div class="vac-my-sub">${usedPct}% verbraucht</div></div><div class="vac-my-card" style="border-top:3px solid var(--success)"><div class="vac-my-label">Verbleibend</div><div class="vac-my-num" style="color:var(--success)">${me.vacTotal-me.vacUsed}</div><div class="vac-my-sub">noch verf\u00fcgbar</div></div></div><div class="vac-table-card"><table class="vac-table"><thead><tr><th>Von</th><th>Bis</th><th>Tage</th><th>Bemerkung</th><th>Status</th></tr></thead><tbody>`;
    myVacs.forEach(v=>{h+=`<tr><td>${formatDateDE(v.from)}</td><td>${formatDateDE(v.to)}</td><td>${v.days}</td><td>${v.note||'—'}</td><td>${v.status==='approved'?'<span class="badge badge-success">Genehmigt</span>':v.status==='pending'?'<span class="badge badge-warning">Offen</span>':'<span class="badge badge-danger">Abgelehnt</span>'}</td></tr>`;});
    h+=`</tbody></table></div>`;vc.innerHTML=h;return;
  }
  if(vacationTab==='requests'){
    let h=`<div class="vac-table-card"><table class="vac-table"><thead><tr><th>Mitarbeiter</th><th>Von</th><th>Bis</th><th>Tage</th><th>Status</th>${can('approveVacations')?'<th>Aktionen</th>':''}</tr></thead><tbody>`;
    vacs.forEach(v=>{h+=`<tr><td><strong style="color:var(--text-primary)">${v.empName}</strong></td><td>${formatDateDE(v.from)}</td><td>${formatDateDE(v.to)}</td><td>${v.days}</td><td>${v.status==='approved'?'<span class="badge badge-success">OK</span>':v.status==='pending'?'<span class="badge badge-warning">Offen</span>':'<span class="badge badge-danger">Abg.</span>'}</td>${can('approveVacations')?`<td class="vac-action-cell">${v.status==='pending'?`<button class="vac-btn-approve" onclick="appVac(${v.id})"><span class="ms">check</span></button> <button class="vac-btn-reject" onclick="rejVac(${v.id})"><span class="ms">close</span></button>`:'—'}</td>`:''}</tr>`;});
    h+=`</tbody></table></div>`;vc.innerHTML=h;return;
  }
  if(vacationTab==='overview'){
    const emps=getVisibleEmps();const _ys4=isoDate(new Date(new Date().getFullYear(),0,1));
    let h=`<div class="vac-table-card"><div class="vac-table-header"><h3 class="vac-table-title">Team \u00dcbersicht: Urlaubsanspruch</h3></div><table class="vac-table"><thead><tr><th>Mitarbeiter</th><th>Gesamt</th><th>Genommen</th><th>Geplant</th><th>Rest</th><th>Auslastung</th></tr></thead><tbody>`;
    emps.forEach(e=>{const pl=VACS.filter(v=>v.empId===e.id&&(v.status==='approved'||v.status==='pending')&&v.from>=_ys4).reduce((s,v)=>s+v.days,0);const r=e.vacTotal-e.vacUsed-pl;const pct=e.vacTotal>0?Math.round((e.vacUsed+pl)/e.vacTotal*100):0;const initials=e.name.split(' ').map(n=>n[0]).join('').substring(0,2);h+=`<tr><td><div class="vac-emp-cell"><div class="vac-avatar">${initials}</div><strong style="color:var(--text-primary)">${e.name}</strong></div></td><td>${e.vacTotal} T</td><td style="color:var(--accent);font-weight:700">${e.vacUsed} T</td><td style="color:#10b981;font-weight:600">${pl} T</td><td><strong style="color:${r<5?'var(--warning)':'var(--success)'}">${r} T</strong></td><td><div class="vac-progress-wrap"><div class="vac-progress-bar"><div class="vac-progress-fill" style="width:${Math.min(pct,100)}%;background:${pct>=90?'var(--danger)':pct>=70?'var(--warning)':'var(--accent)'}"></div></div><span class="vac-progress-pct">${pct}%</span></div></td></tr>`;});
    h+=`</tbody></table></div>`;vc.innerHTML=h;return;
  }
  const y=vacationCalendarMonth.getFullYear(),m=vacationCalendarMonth.getMonth();
  const fd=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),so=fd===0?6:fd-1;
  const pendingList=vacs.filter(v=>v.status==='pending').slice(0,5);
  let calCells='';
  ['Mo','Di','Mi','Do','Fr','Sa','So'].forEach(d=>{calCells+=`<div class="vac-cal-head">${d}</div>`;});
  for(let i=0;i<so;i++)calCells+=`<div class="vac-cal-day other-month"></div>`;
  for(let d=1;d<=dim;d++){const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const dv=vacs.filter(v=>v.from<=ds&&v.to>=ds&&v.status==='approved');const dk=getVisibleSicks().filter(s=>s.from<=ds&&s.to>=ds&&s.status==='active');calCells+=`<div class="vac-cal-day${ds===todayStr?' today':''}"><div class="vac-cal-num">${d}</div>`;dv.slice(0,2).forEach(v=>{calCells+=`<div class="vac-cal-event vacation">${v.empName.split(' ')[0]}</div>`;});if(dv.length>2)calCells+=`<div class="vac-cal-event more">+${dv.length-2}</div>`;dk.slice(0,1).forEach(s=>{calCells+=`<div class="vac-cal-event sick">${s.empName.split(' ')[0]}</div>`;});calCells+=`</div>`;}
  vc.innerHTML=`<div class="vac-bento"><div class="vac-cal-card"><div class="vac-cal-toolbar"><div><h3 class="vac-cal-month">${MONTHS_DE[m]} ${y}</h3><p class="vac-cal-sub">${vacs.filter(v=>v.status==='approved').length} genehmigte Abwesenheiten</p></div><div class="vac-cal-nav"><button class="vac-nav-btn" onclick="vacationCalendarMonth.setMonth(vacationCalendarMonth.getMonth()-1);renderVacation()"><span class="ms">chevron_left</span></button><button class="vac-today-btn" onclick="vacationCalendarMonth=new Date();renderVacation()">Heute</button><button class="vac-nav-btn" onclick="vacationCalendarMonth.setMonth(vacationCalendarMonth.getMonth()+1);renderVacation()"><span class="ms">chevron_right</span></button></div></div><div class="vac-cal-grid">${calCells}</div><div class="vac-legend"><div class="vac-legend-item"><div class="vac-legend-dot" style="background:var(--accent)"></div>Urlaub</div><div class="vac-legend-item"><div class="vac-legend-dot" style="background:var(--danger)"></div>Krankheit</div><div class="vac-legend-item"><div class="vac-legend-dot" style="background:#10b981"></div>Fortbildung</div></div></div><div class="vac-side-panel"><div class="vac-panel-card"><div class="vac-panel-header"><h4 class="vac-panel-title">Offene Antr\u00e4ge</h4><span class="vac-badge-count">${pendingVacs.length}</span></div>${pendingList.length?pendingList.map(v=>`<div class="vac-req-item"><div class="vac-req-avatar">${v.empName.split(' ').map(n=>n[0]).join('').substring(0,2)}</div><div class="vac-req-info"><div class="vac-req-name">${v.empName}</div><div class="vac-req-dates">${formatDateDE(v.from)} - ${formatDateDE(v.to)} (${v.days}T)</div></div>${can('approveVacations')?`<div class="vac-req-actions"><button class="vac-btn-approve" onclick="appVac(${v.id})"><span class="ms">check</span></button><button class="vac-btn-reject" onclick="rejVac(${v.id})"><span class="ms">close</span></button></div>`:''}</div>`).join(''):'<p class="vac-empty">Keine offenen Antr\u00e4ge</p>'}${pendingVacs.length>5?`<button class="vac-see-all" onclick="vacationTab='requests';renderVacation()">Alle Antr\u00e4ge sehen</button>`:''}</div></div></div>`;
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
let accessSort = 'location'; // 'location' or 'name'

function renderAccess(){
  const pg=document.getElementById('page-access');
  if(!can('manageAccess')){pg.innerHTML=permBanner('Zugangsverwaltung ist nur für Inhaber verfügbar.');return;}

  const roleOpts = ['inhaber','manager','mitarbeiter','azubi'];
  const locOpts = [{id:'all',name:'Alle Standorte'},...LOCS];

  // Pending = status pending OR employee status 'inactive' (Google auto-register)
  const pending = USERS.filter(u => {
    if (u.status === 'pending') return true;
    // Google users: have empId but employee is inactive
    if (u.empId) {
      const emp = EMPS.find(e => e.id === u.empId);
      if (emp && emp.status === 'inactive') return true;
    }
    return false;
  });
  let pendingHtml = '';
  if (pending.length > 0) {
    pendingHtml = `<div class="table-wrap" style="margin-bottom:20px;border-left:3px solid var(--warning)">
      <div class="table-header"><span class="table-title">🔔 Neue Registrierungen (${pending.length})</span></div>
      <div style="padding:0 20px 16px">`;
    pending.forEach(u => {
      const isGoogle = u.regEmail?.includes('gmail') || u.bannerUrl;
      pendingHtml += `<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)">
        <div class="emp-avatar" style="width:44px;height:44px;font-size:1rem">${u.avatar}</div>
        <div style="flex:1">
          <strong style="font-size:.95rem">${u.name}</strong>
          ${isGoogle ? '<span style="font-size:.68rem;background:var(--bg-input);padding:1px 6px;border-radius:4px;color:var(--text-muted);margin-left:6px">Google</span>' : ''}
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

  // Active users — sort
  const pendingIds = new Set(pending.map(u => u.id));
  const activeUsers = USERS.filter(u => !pendingIds.has(u.id));
  activeUsers.sort((a, b) => {
    if (accessSort === 'location') {
      const locA = getLocationName(a.location);
      const locB = getLocationName(b.location);
      return locA.localeCompare(locB) || a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });

  let rows = activeUsers.map(u => {
    const emp = u.empId ? EMPS.find(e=>e.id===u.empId) : null;
    const roleSelect = `<select class="form-select" style="min-width:120px" onchange="changeUserRole('${u.id}',this.value)">
      ${roleOpts.map(r => `<option value="${r}" ${u.role===r?'selected':''}>${r==='inhaber'?'👑 Inhaber':r==='manager'?'🏢 Manager':r==='mitarbeiter'?'👤 Mitarbeiter':'🎓 Azubi'}</option>`).join('')}
    </select>`;
    const locSelect = `<select class="form-select" style="min-width:140px" onchange="changeUserLocation('${u.id}',this.value)">
      ${locOpts.map(l => `<option value="${l.id}" ${u.location===l.id?'selected':''}>${l.name}</option>`).join('')}
    </select>`;
    const emailInfo = u.regEmail ? `<div style="font-size:.72rem;color:var(--text-muted);margin-top:2px" title="${u.regEmail}">📧 ${u.regEmail}</div>` : '';
    const googleBadge = u.regEmail?.includes('gmail') || u.bannerUrl ? '<span style="font-size:.68rem;background:var(--bg-input);padding:1px 6px;border-radius:4px;color:var(--text-muted);margin-left:4px">Google</span>' : '';
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:10px">
        <div class="emp-avatar">${u.avatar}</div>
        <div>
          <div style="display:flex;align-items:center;gap:4px">
            <input class="form-input" style="width:140px;font-weight:600;font-size:.85rem" value="${u.name}" onblur="changeUserName('${u.id}',this.value)" onkeydown="if(event.key==='Enter')this.blur()">
            ${googleBadge}
          </div>
          ${emailInfo}
        </div>
      </div></td>
      <td><input class="form-input" style="width:140px;font-size:.82rem" value="${emp?.position||u.regPosition||''}" placeholder="Position..." onblur="changeUserPosition('${u.id}',this.value)" onkeydown="if(event.key==='Enter')this.blur()"></td>
      <td>${roleSelect}</td>
      <td>${locSelect}</td>
      <td>${u.empId ? (emp?.name||'—') : '—'}</td>
      <td>${statusBadge(u.status)}</td>
      <td><div style="display:flex;gap:4px">
        <button class="btn btn-sm" onclick="openPermissionsModal('${u.id}')" title="Berechtigungen"><span class="ms" style="font-size:16px">shield_person</span></button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}')" title="Löschen"><span class="ms" style="font-size:16px">delete</span></button>
      </div></td>
    </tr>`;
  }).join('');

  const sortBtnLoc = accessSort === 'location' ? 'btn-primary' : '';
  const sortBtnName = accessSort === 'name' ? 'btn-primary' : '';

  pg.innerHTML=`${pendingHtml}<div class="table-wrap"><div class="table-header" style="display:flex;align-items:center;justify-content:space-between">
    <span class="table-title">Zugangsverwaltung (${activeUsers.length} Benutzer)</span>
    <div style="display:flex;gap:6px;align-items:center">
      <span style="font-size:.75rem;color:var(--text-muted)">Sortieren:</span>
      <button class="btn btn-sm ${sortBtnLoc}" onclick="accessSort='location';renderAccess()">📍 Standort</button>
      <button class="btn btn-sm ${sortBtnName}" onclick="accessSort='name';renderAccess()">🔤 Name</button>
    </div>
  </div>
  <div style="overflow-x:auto"><table><thead><tr><th>Name</th><th>Position</th><th>Rolle</th><th>Standort</th><th>Mitarbeiter</th><th>Status</th><th></th></tr></thead><tbody>
  ${rows}
  </tbody></table></div></div>
  <div style="margin-top:12px;padding:12px;background:var(--bg-input);border-radius:8px;font-size:.82rem;color:var(--text-muted)">
    💡 Name, Position, Rolle und Standort direkt in der Tabelle ändern. Änderungen werden sofort gespeichert.
  </div>`;

  // Update pending badge in sidebar
  updatePendingBadge();
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
    let empId = u.empId;

    if (empId) {
      // Google user: employee already exists → just activate
      const { error: empErr } = await sb.from('employees').update({
        status: 'active',
        dept: u.regDept || 'Service',
        position: u.regPosition || 'Mitarbeiter'
      }).eq('id', empId);
      if (empErr) { toast('Fehler: ' + empErr.message, 'err'); return; }

      // Update local employee data
      const emp = EMPS.find(e => e.id === empId);
      if (emp) {
        emp.status = 'active';
        emp.dept = u.regDept || emp.dept;
        emp.position = u.regPosition || emp.position;
      }
    } else {
      // Manual registration: create new employee
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
      empId = empData.id;

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
    }

    // Update user_profile: status='active', emp_id linked
    const { error: profErr } = await sb.from('user_profiles').update({
      status: 'active',
      emp_id: empId
    }).eq('user_id', userId);
    if (profErr) { toast('Profil-Fehler: ' + profErr.message, 'err'); return; }

    // Update local user data
    u.status = 'active';
    u.empId = empId;

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

function updatePendingBadge(){
  const badge = document.getElementById('pendingBadge');
  if(!badge) return;
  const count = (USERS || []).filter(u => {
    if (u.status === 'pending') return true;
    if (u.empId) {
      const emp = (typeof EMPS !== 'undefined' ? EMPS : []).find(e => e.id === u.empId);
      if (emp && emp.status === 'inactive') return true;
    }
    return false;
  }).length;
  badge.textContent = count;
  badge.style.display = count > 0 ? '' : 'none';
}

async function deleteUser(userId){
  const u = USERS.find(x => x.id === userId);
  if(!u) return;
  if(!confirm(`Benutzer "${u.name}" wirklich löschen? Dies kann nicht rückgängig gemacht werden.`)) return;

  try {
    // Delete user_profile
    const { error } = await sb.from('user_profiles').delete().eq('user_id', userId);
    if(error){ toast('Fehler: ' + error.message, 'err'); return; }

    // Remove from local array
    const idx = USERS.findIndex(x => x.id === userId);
    if(idx >= 0) USERS.splice(idx, 1);

    toast(`${u.name} gelöscht`, 'warn');
    renderAccess();
  } catch(e) {
    console.error('[DeleteUser]', e);
    toast('Fehler beim Löschen', 'err');
  }
}

// ═══ PERMISSIONS MODAL ═══
const PERM_GROUPS = {
  'Personal': [
    { key: 'seeAllEmployees', label: 'Alle Mitarbeiter sehen' },
    { key: 'editEmployees', label: 'Mitarbeiter bearbeiten' },
    { key: 'seeDepartments', label: 'Bereiche sehen' },
    { key: 'seeAllLocations', label: 'Alle Standorte sehen' }
  ],
  'Planung': [
    { key: 'seeAllSchedules', label: 'Alle Arbeitspläne sehen' },
    { key: 'editSchedules', label: 'Arbeitspläne bearbeiten' },
    { key: 'seeAllVacations', label: 'Alle Urlaubsanträge sehen' },
    { key: 'approveVacations', label: 'Urlaub genehmigen' },
    { key: 'seeAllSick', label: 'Alle Krankmeldungen sehen' },
    { key: 'markLate', label: 'Verspätungen markieren' }
  ],
  'Dokumente': [
    { key: 'seeAllDocs', label: 'Alle Unterlagen sehen' },
    { key: 'canExport', label: 'Berichte exportieren' },
    { key: 'editTraining', label: 'Ausbildung verwalten' }
  ],
  'System': [
    { key: 'manageAccess', label: 'Zugangsverwaltung' }
  ],
  'Finanzen': [
    { key: 'seeFinancials', label: 'Gehalt & Finanzen sehen' },
    { key: 'editVacDays', label: 'Urlaubstage bearbeiten' }
  ]
};

async function openPermissionsModal(userId) {
  const u = USERS.find(x => x.id === userId);
  if (!u) return;

  // Load current permissions from Supabase
  let mode = 'standard';
  let perms = {};
  const { data } = await sb.from('user_permissions').select('*').eq('user_id', userId).maybeSingle();
  if (data) {
    mode = data.mode || 'standard';
    perms = data.permissions || {};
  }

  const roleDefaults = PERMS[u.role] || {};

  // Build grouped checkboxes
  let groupsHtml = '';
  for (const [group, items] of Object.entries(PERM_GROUPS)) {
    groupsHtml += `<div style="margin-bottom:14px">
      <div style="font-size:.75rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">${group}</div>`;
    items.forEach(p => {
      const checked = mode === 'custom' ? (perms[p.key] ? 'checked' : '') : (roleDefaults[p.key] ? 'checked' : '');
      const isDefault = roleDefaults[p.key] ? '✓' : '✕';
      groupsHtml += `<label style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:.85rem;cursor:pointer">
        <input type="checkbox" class="permCheck" data-key="${p.key}" ${checked}>
        <span>${p.label}</span>
        <span style="font-size:.68rem;color:var(--text-muted);margin-left:auto">${isDefault} Standard</span>
      </label>`;
    });
    groupsHtml += '</div>';
  }

  const isCustom = mode === 'custom';
  openModal('Berechtigungen: ' + u.name, `
    <div style="margin-bottom:16px">
      <div style="font-size:.82rem;color:var(--text-secondary);margin-bottom:8px">Modus:</div>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:6px">
        <input type="radio" name="permMode" value="standard" ${!isCustom?'checked':''} onchange="togglePermMode(false)">
        <span style="font-size:.9rem;font-weight:600">Standard nach Rolle (${u.role === 'inhaber' ? 'Inhaber' : u.role === 'manager' ? 'Manager' : u.role === 'mitarbeiter' ? 'Mitarbeiter' : 'Azubi'})</span>
      </label>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="radio" name="permMode" value="custom" ${isCustom?'checked':''} onchange="togglePermMode(true)">
        <span style="font-size:.9rem;font-weight:600">✏️ Individuell anpassen</span>
      </label>
    </div>
    <div id="permCheckboxes" style="opacity:${isCustom?'1':'.4'};pointer-events:${isCustom?'auto':'none'};border-top:1px solid var(--border);padding-top:14px">
      ${groupsHtml}
    </div>
  `, `<button class="btn btn-primary" onclick="savePermissions('${userId}')">Speichern</button>`);
}

function togglePermMode(isCustom) {
  const box = document.getElementById('permCheckboxes');
  if (box) {
    box.style.opacity = isCustom ? '1' : '.4';
    box.style.pointerEvents = isCustom ? 'auto' : 'none';
  }
}

async function savePermissions(userId) {
  const mode = document.querySelector('input[name="permMode"]:checked')?.value || 'standard';
  const perms = {};

  if (mode === 'custom') {
    document.querySelectorAll('.permCheck').forEach(cb => {
      perms[cb.dataset.key] = cb.checked;
    });
  }

  // Upsert to user_permissions table
  const { error } = await sb.from('user_permissions').upsert({
    user_id: userId,
    mode,
    permissions: mode === 'custom' ? perms : null
  }, { onConflict: 'user_id' });

  if (error) {
    toast('Fehler: ' + error.message, 'err');
    return;
  }

  closeModal();
  toast('Berechtigungen gespeichert ✓', 'success');
}

// ═══ NOTIFICATIONS ═══
function toggleNotifications(){document.getElementById('notifPanel').classList.toggle('open');document.getElementById('notifOverlay').classList.toggle('open');renderNotifs();}
function renderNotifs(){document.getElementById('notifList').innerHTML=getVisibleNotifs().map(n=>`<div class="notif-item ${n.type} ${n.unread?'unread':''}" onclick="markRead(${n.id})"><div class="notif-item-title">${n.title}</div><div class="notif-item-text">${n.text}</div><div class="notif-item-time">${n.time}</div></div>`).join('')||'<p style="padding:16px;color:var(--text-muted)">Keine Benachrichtigungen</p>';}
function markRead(id){const n=NOTIFS.find(x=>x.id===id);if(n){n.unread=false;renderNotifs();updateBadges();}}
function addNotif(type,title,text){NOTIFS.unshift({id:Date.now(),type,title,text,time:'Gerade eben',unread:true,forRole:['inhaber','manager']});updateBadges();}

// ═══ MODALS ═══
function openModal(type, bodyHtml, footerHtml){
  const b=document.getElementById('modalBody'),f=document.getElementById('modalFooter'),t=document.getElementById('modalTitle');

  // Generic modal (title, bodyHtml, footerHtml)
  if(bodyHtml && typeof bodyHtml === 'string') {
    t.textContent = type;
    b.innerHTML = bodyHtml;
    f.innerHTML = footerHtml || '<button class="btn" onclick="closeModal()">Schließen</button>';
    document.getElementById('modalOverlay').classList.remove('hidden');
    return;
  }

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

  function getUpcoming(){
    const events=[];
    emps.forEach(e=>{
      if(e.birthday){
        const bd=new Date(e.birthday);
        const thisYear=new Date(today.getFullYear(),bd.getMonth(),bd.getDate());
        if(thisYear<today)thisYear.setFullYear(thisYear.getFullYear()+1);
        const age=thisYear.getFullYear()-bd.getFullYear();
        const daysUntil=Math.ceil((thisYear-today)/864e5);
        events.push({date:thisYear,dateStr:isoDate(thisYear),type:'birthday',icon:'cake',label:`${e.name} wird ${age}`,sub:`Geburtstag (${age} Jahre)`,daysUntil,emp:e});
      }
      if(e.start){
        const sd=new Date(e.start);
        const nextAnni=new Date(today.getFullYear(),sd.getMonth(),sd.getDate());
        if(nextAnni<today)nextAnni.setFullYear(nextAnni.getFullYear()+1);
        const anniYears=nextAnni.getFullYear()-sd.getFullYear();
        if(anniYears>0){
          const daysUntil=Math.ceil((nextAnni-today)/864e5);
          events.push({date:nextAnni,dateStr:isoDate(nextAnni),type:'anniversary',icon:'military_tech',label:`${e.name}`,sub:`${anniYears}-jähriges Jubiläum`,daysUntil,emp:e});
        }
      }
      if(e.probEnd&&new Date(e.probEnd)>today){
        const pe=new Date(e.probEnd);
        const daysUntil=Math.ceil((pe-today)/864e5);
        events.push({date:pe,dateStr:e.probEnd,type:'probation',icon:'timer',label:`${e.name}`,sub:'Ende Probezeit',daysUntil,emp:e});
      }
    });
    return events.sort((a,b)=>a.daysUntil-b.daysUntil);
  }

  const events=getUpcoming();
  const soon=events.filter(e=>e.daysUntil<=30);
  const later=events.filter(e=>e.daysUntil>30&&e.daysUntil<=90);

  const bdCount=events.filter(e=>e.type==='birthday'&&e.daysUntil<=30).length;
  const anniCount=events.filter(e=>e.type==='anniversary'&&e.daysUntil<=90).length;
  const probCount=events.filter(e=>e.type==='probation').length;

  const MONTHS_DE=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];

  function eventCardHTML(ev){
    const d=ev.date;
    const monthStr=MONTHS_DE[d.getMonth()];
    const dayStr=d.getDate();
    const typeClass=ev.type;
    const iconClass=ev.type;
    return `
    <div class="cal-event-card ${typeClass}">
      <div class="cal-event-date-box">
        <div class="cal-event-date-month">${monthStr}</div>
        <div class="cal-event-date-day">${String(dayStr).padStart(2,'0')}</div>
      </div>
      <div class="cal-event-info">
        <div class="cal-event-name">${ev.label}</div>
        <div class="cal-event-type-row">
          <span class="ms ${iconClass}">${ev.icon}</span>
          <span class="cal-event-type-text">${ev.sub}</span>
        </div>
      </div>
    </div>`;
  }

  function laterItemHTML(ev){
    const d=ev.date;
    const dateStr=`${d.getDate()}. ${['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][d.getMonth()]}`;
    const typeLabel=ev.type==='birthday'?'Geburtstag':ev.type==='anniversary'?'Jubiläum':'Probezeit-Ende';
    return `
    <div class="cal-later-item">
      <div class="cal-later-left">
        <div class="cal-later-icon-box"><span class="ms">${ev.icon}</span></div>
        <div>
          <div class="cal-later-name">${ev.emp.name}</div>
          <div class="cal-later-date">${dateStr}</div>
        </div>
      </div>
      <span class="cal-later-tag">${typeLabel}</span>
    </div>`;
  }

  function getBirthdayRows(){
    return emps.filter(e=>e.birthday).sort((a,b)=>{
      const am=new Date(a.birthday).getMonth()*100+new Date(a.birthday).getDate();
      const bm=new Date(b.birthday).getMonth()*100+new Date(b.birthday).getDate();
      return am-bm;
    }).map(e=>{
      const bd=new Date(e.birthday);
      const age=today.getFullYear()-bd.getFullYear();
      const bdStr=`${bd.getDate()}. ${MONTHS_DE[bd.getMonth()]} ${bd.getFullYear()}`;
      const avatarCol=e.avatar?'':'#6366f1';
      const loc=getLocationName(e.location)||e.location||'—';
      return `<tr>
        <td><div class="emp-name-cell">
          <div class="cal-emp-avatar-sm" style="background:${e.color||'#6366f1'}">${e.avatar||e.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
          ${e.name}
        </div></td>
        <td class="cal-bday-date">${bdStr}</td>
        <td class="cal-bday-age">${age}</td>
        <td><span class="cal-tag-pill location">${loc}</span></td>
        <td><span class="cal-tag-pill dept">${e.dept||'—'}</span></td>
      </tr>`;
    }).join('');
  }

  pg.innerHTML=`
  <div class="cal-page-hd">
    <div>
      <h2 class="cal-page-title">Personalkalender</h2>
      <p class="cal-page-sub">Behalten Sie alle wichtigen Mitarbeiterereignisse im Überblick.</p>
    </div>
    <div class="cal-view-toggle">
      <button class="cal-view-btn active">Events</button>
      <button class="cal-view-btn">Liste</button>
    </div>
  </div>

  <!-- Summary Bento Cards -->
  <div class="cal-bento-grid">
    <div class="cal-bento-card">
      <span class="ms cal-bento-card-bg-icon">cake</span>
      <div class="cal-bento-icon-row">
        <div class="cal-bento-icon birthday"><span class="ms">cake</span></div>
        <span class="cal-bento-card-label">Nächste Geburtstage</span>
      </div>
      <div>
        <div class="cal-bento-val-row">
          <span class="cal-bento-big">${String(bdCount).padStart(2,'0')}</span>
          <span class="cal-bento-unit">Mitarbeiter</span>
        </div>
        <div class="cal-bento-hint indigo"><span class="ms">arrow_upward</span> in den nächsten 30 Tagen</div>
      </div>
    </div>
    <div class="cal-bento-card">
      <span class="ms cal-bento-card-bg-icon">military_tech</span>
      <div class="cal-bento-icon-row">
        <div class="cal-bento-icon jubilee"><span class="ms">military_tech</span></div>
        <span class="cal-bento-card-label">Jubiläen</span>
      </div>
      <div>
        <div class="cal-bento-val-row">
          <span class="cal-bento-big">${String(anniCount).padStart(2,'0')}</span>
          <span class="cal-bento-unit">Mitarbeiter</span>
        </div>
        <div class="cal-bento-hint teal">In den nächsten 90 Tagen</div>
      </div>
    </div>
    <div class="cal-bento-card">
      <span class="ms cal-bento-card-bg-icon">timer</span>
      <div class="cal-bento-icon-row">
        <div class="cal-bento-icon probation"><span class="ms">timer</span></div>
        <span class="cal-bento-card-label">Probezeit-Ende</span>
      </div>
      <div>
        <div class="cal-bento-val-row">
          <span class="cal-bento-big">${String(probCount).padStart(2,'0')}</span>
          <span class="cal-bento-unit">Mitarbeiter</span>
        </div>
        <div class="cal-bento-hint amber">Aktion erforderlich</div>
      </div>
    </div>
  </div>

  <!-- Main: Timeline + Table -->
  <div class="cal-main-grid">
    <!-- Left: Timeline -->
    <div class="cal-timeline-col">
      <div>
        <div class="cal-section-title">
          Nächsten 30 Tage
          <span class="cal-section-dot active"></span>
        </div>
        <div class="cal-event-cards">
          ${soon.length?soon.map(eventCardHTML).join(''):`<div class="cal-empty"><span class="ms">event_available</span><p>Keine Ereignisse</p></div>`}
        </div>
      </div>
      <div>
        <div class="cal-section-title">
          31–90 Tage
          <span class="cal-section-dot muted"></span>
        </div>
        <div class="cal-later-list">
          ${later.length?later.map(laterItemHTML).join(''):`<div class="cal-empty"><span class="ms">event_note</span><p>Keine Ereignisse</p></div>`}
        </div>
      </div>
    </div>

    <!-- Right: Birthday Table -->
    <div class="cal-table-col">
      <div class="cal-table-card">
        <div class="cal-table-hd">
          <span class="cal-table-hd-title">🎂 Alle Geburtstage</span>
          <button class="cal-table-see-all">Alle anzeigen <span class="ms">arrow_forward</span></button>
        </div>
        <table class="cal-bday-table">
          <thead><tr>
            <th>Mitarbeiter</th>
            <th>Geburtstag</th>
            <th>Alter</th>
            <th>Standort</th>
            <th>Bereich</th>
          </tr></thead>
          <tbody>
            ${emps.filter(e=>e.birthday).length?getBirthdayRows():`<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-muted)">Keine Geburtstagsdaten vorhanden</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

// ═══ REPORTS & ANALYTICS ═══
function renderReports(){
  const pg=document.getElementById('page-reports');
  if(!can('seeAllEmployees')){pg.innerHTML=permBanner('Berichte sind nur für Manager und Inhaber verfügbar.');return;}
  const emps=getVisibleEmps();
  const isAdmin=can('seeFinancials');

  // ─── Data calculations (unchanged logic) ───
  const statusCount={active:0,vacation:0,sick:0};emps.forEach(e=>{statusCount[e.status]=(statusCount[e.status]||0)+1;});
  const deptCount={};emps.forEach(e=>{deptCount[e.dept]=(deptCount[e.dept]||0)+1;});
  const deptEntries=Object.entries(deptCount).sort((a,b)=>b[1]-a[1]);
  const maxDept=Math.max(...deptEntries.map(d=>d[1]),1);
  const totalLate=emps.reduce((s,e)=>s+e.lateCount,0);
  const totalSick=emps.reduce((s,e)=>s+e.sickDays,0);
  const topDelays=emps.filter(e=>e.lateCount>0).sort((a,b)=>b.lateCount-a.lateCount);

  // Admin-only data
  let totalBrutto=0,deptCost={},deptHours={},deptSoll={};
  if(isAdmin){
    totalBrutto=emps.reduce((s,e)=>s+e.bruttoGehalt,0);
    emps.forEach(e=>{deptCost[e.dept]=(deptCost[e.dept]||0)+e.bruttoGehalt;});
    emps.forEach(e=>{const h=calcPlanHours(e.id);deptHours[e.dept]=(deptHours[e.dept]||0)+h;});
    emps.forEach(e=>{deptSoll[e.dept]=(deptSoll[e.dept]||0)+e.sollStunden;});
  }
  const deptCostEntries=Object.entries(deptCost).sort((a,b)=>b[1]-a[1]);
  const deptHEntries=Object.entries(deptHours).sort((a,b)=>b[1]-a[1]);
  const DEPT_COLORS=['#3b4fd2','#00515c','#4857af','#d97706','#e11d48','#7c3aed'];

  // SVG gauge helper (semi-circle)
  function gaugeHTML(pct,color,label){
    const R=42;const cx=44;const cy=48;
    const totalArc=Math.PI*R;
    const fill=totalArc*(Math.min(pct,100)/100);
    const offset=totalArc-fill;
    const clampColor=pct>=90?color:pct>=70?'#f59e0b':'#ba1a1a';
    return `<div class="rep-gauge-item">
      <div class="rep-gauge-wrap">
        <svg viewBox="0 0 88 50" width="88" height="50" overflow="visible">
          <path d="M 2 48 A ${R} ${R} 0 0 1 86 48" fill="none" stroke="var(--bg-input)" stroke-linecap="round" stroke-width="10"/>
          <path d="M 2 48 A ${R} ${R} 0 0 1 86 48" fill="none" stroke="${clampColor}"
            stroke-dasharray="${totalArc}" stroke-dashoffset="${offset}"
            stroke-linecap="round" stroke-width="10" style="transition:stroke-dashoffset .8s ease"/>
        </svg>
        <span class="rep-gauge-pct">${pct}%</span>
      </div>
      <span class="rep-gauge-label">${label}</span>
    </div>`;
  }

  // Dept tag colors
  function deptTagStyle(dept,i){
    const c=DEPT_COLORS[i%DEPT_COLORS.length];
    return `background:${c}18;color:${c}`;
  }

  // Late status
  function lateStatus(count){
    if(count>=8) return`<span class="rep-status-dot"><span class="dot" style="background:#ba1a1a"></span><span style="color:#ba1a1a">Action Required</span></span>`;
    if(count>=4) return`<span class="rep-status-dot"><span class="dot" style="background:#f59e0b"></span><span style="color:#d97706">Monitoring</span></span>`;
    return`<span class="rep-status-dot"><span class="dot" style="background:#94a3b8"></span><span style="color:var(--text-muted)">Gering</span></span>`;
  }

  // ─── Admin cost bar section ───
  let costBarsHTML='';
  if(isAdmin && deptCostEntries.length){
    const BCOLS=['blue','teal','red','amber'];
    const BCOLHEX=['#3b4fd2','#00515c','#ba1a1a','#d97706'];
    costBarsHTML=deptCostEntries.slice(0,4).map(([dept,cost],i)=>{
      const pct=totalBrutto>0?Math.round(cost/totalBrutto*100):0;
      const grow=totalBrutto>0?Math.round(cost/Math.max(...deptCostEntries.map(d=>d[1]),1)*100):0;
      return `<div>
        <div class="rep-bar-row-label">
          <span>${dept}</span>
          <div class="rep-bar-row-right">
            <span class="rep-bar-row-amt">${formatEuro(cost)}</span>
            <span class="rep-bar-pct-badge ${BCOLS[i%BCOLS.length]}">${pct}%</span>
          </div>
        </div>
        <div class="rep-bar-track">
          <div class="rep-bar-fill" style="width:${grow}%;background:${BCOLHEX[i%BCOLHEX.length]}"></div>
        </div>
      </div>`;
    }).join('');
  }

  // ─── Gauge grid section (hours) ───
  let gaugesHTML='<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:.8rem">Keine Stunden-Daten</div>';
  if(isAdmin && deptHEntries.length){
    const items=deptHEntries.slice(0,4).map(([dept,hours])=>{
      const soll=deptSoll[dept]||0;
      const pct=soll>0?Math.round(hours/soll*100):0;
      return gaugeHTML(pct,'#3b4fd2',dept);
    });
    gaugesHTML=`<div class="rep-gauge-grid">${items.join('')}</div>`;
    const avgPct=deptHEntries.length>0?Math.round(deptHEntries.map(([dept,h])=>{const s=deptSoll[dept]||0;return s>0?h/s*100:0;}).reduce((a,b)=>a+b,0)/deptHEntries.length):0;
    gaugesHTML+=`<div class="rep-gauge-info"><span class="ms">info</span><p class="rep-gauge-info-text">Die durchschnittliche Auslastung beträgt ${avgPct}%. Zielkorridor: 85–95%.</p></div>`;
  }

  // ─── Delays table rows ───
  const delayRows=topDelays.slice(0,8).map((e,i)=>{
    const deptIdx=deptEntries.findIndex(([d])=>d===e.dept);
    const tagStyle=deptTagStyle(e.dept,deptIdx>=0?deptIdx:i);
    const avgDur=e.lateCount>0?Math.round(e.lateAvgMin||12):0;
    const durClass=e.lateCount>=8?'danger':'';
    return `<tr>
      <td>
        <div class="rep-emp-cell">
          <div class="rep-emp-avatar" style="background:${e.color||'#6366f1'}">${e.avatar||e.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
          <div><div class="rep-emp-name">${e.name}</div><div class="rep-emp-pos">${e.position||e.dept}</div></div>
        </div>
      </td>
      <td><span class="rep-dept-tag" style="${tagStyle}">${e.dept.toUpperCase()}</span></td>
      <td class="rep-late-count">${e.lateCount}×</td>
      <td class="rep-late-dur ${durClass}">${avgDur} Min.</td>
      <td>${lateStatus(e.lateCount)}</td>
      <td><button class="rep-action-btn" title="Nachricht"><span class="ms">mail</span></button></td>
    </tr>`;
  }).join('');

  // ─── Admin extra: dept distribution + sick days ───
  let extraSection='';
  if(isAdmin){
    const sickTop=emps.filter(e=>e.sickDays>0).sort((a,b)=>b.sickDays-a.sickDays).slice(0,6);
    const maxS=Math.max(...sickTop.map(e=>e.sickDays),1);
    const sickBars=sickTop.map(e=>`
      <div>
        <div class="rep-mini-bar-label"><span>${e.name}</span><span>${e.sickDays} Tage</span></div>
        <div class="rep-mini-track"><div class="rep-mini-fill" style="width:${Math.round(e.sickDays/maxS*100)}%;background:#ba1a1a"></div></div>
      </div>`).join('');
    const deptBars=deptEntries.map(([dept,count],i)=>{
      const c=DEPT_COLORS[i%DEPT_COLORS.length];
      return `<div>
        <div class="rep-mini-bar-label"><span>${dept}</span><span>${count}</span></div>
        <div class="rep-mini-track"><div class="rep-mini-fill" style="width:${Math.round(count/maxDept*100)}%;background:${c}"></div></div>
      </div>`;
    }).join('');
    extraSection=`
    <div class="rep-extra-grid">
      <div class="rep-mini-card">
        <div class="rep-mini-title">👥 Mitarbeiter nach Bereich</div>
        <div class="rep-mini-bar-rows">${deptBars||'<p style="color:var(--text-muted);font-size:.8rem">Keine Daten</p>'}</div>
      </div>
      <div class="rep-mini-card">
        <div class="rep-mini-title">🏥 Top Krankentage</div>
        <div class="rep-mini-bar-rows">${sickBars||'<p style="color:var(--text-muted);font-size:.8rem">Keine Krankentage</p>'}</div>
      </div>
    </div>`;
  }

  pg.innerHTML=`
  <!-- Page Header -->
  <div class="rep-page-hd">
    <div>
      <p class="rep-eyebrow">Management Intelligence</p>
      <h2 class="rep-page-title">Berichte &amp; Auswertungen</h2>
    </div>
    <div class="rep-hd-actions">
      <button class="rep-btn-ghost"><span class="ms">filter_list</span> Zeitraum</button>
      ${can('canExport')?`<button class="rep-btn-primary" onclick="exportReport()"><span class="ms">picture_as_pdf</span> Report PDF Export</button>`:''}
    </div>
  </div>

  <!-- KPI Grid -->
  <div class="rep-kpi-grid">
    ${isAdmin?`
    <div class="rep-kpi-card">
      <span class="ms rep-kpi-bg-icon">monitoring</span>
      <div class="rep-kpi-card-top">
        <div class="rep-kpi-icon blue"><span class="ms">payments</span></div>
        <span class="rep-kpi-badge up"><span class="ms">trending_up</span> Aktuell</span>
      </div>
      <div class="rep-kpi-label">Personalkosten / Monat</div>
      <div class="rep-kpi-value">${formatEuro(totalBrutto)}</div>
    </div>`:`
    <div class="rep-kpi-card">
      <span class="ms rep-kpi-bg-icon">group</span>
      <div class="rep-kpi-card-top">
        <div class="rep-kpi-icon teal"><span class="ms">badge</span></div>
        <span class="rep-kpi-badge ok"><span class="ms">check_circle</span> Aktuell</span>
      </div>
      <div class="rep-kpi-label">Mitarbeiter</div>
      <div class="rep-kpi-value">${emps.length}</div>
    </div>`}
    <div class="rep-kpi-card">
      <span class="ms rep-kpi-bg-icon">badge</span>
      <div class="rep-kpi-card-top">
        <div class="rep-kpi-icon teal"><span class="ms">badge</span></div>
        <span class="rep-kpi-badge ok"><span class="ms">check_circle</span> Aktuell</span>
      </div>
      <div class="rep-kpi-label">Aktive Mitarbeiter</div>
      <div class="rep-kpi-value">${statusCount.active||0}</div>
    </div>
    <div class="rep-kpi-card">
      <span class="ms rep-kpi-bg-icon">healing</span>
      <div class="rep-kpi-card-top">
        <div class="rep-kpi-icon red"><span class="ms">medical_services</span></div>
        <span class="rep-kpi-badge down"><span class="ms">trending_down</span> Krank</span>
      </div>
      <div class="rep-kpi-label">Krankheitstage gesamt</div>
      <div class="rep-kpi-value">${totalSick} Tage</div>
    </div>
    <div class="rep-kpi-card highlight">
      <span class="ms rep-kpi-bg-icon">speed</span>
      <div class="rep-kpi-card-top">
        <div class="rep-kpi-icon white"><span class="ms" style="font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">electric_bolt</span></div>
        <span class="rep-kpi-badge star"><span class="ms">star</span> High</span>
      </div>
      <div class="rep-kpi-label">Verspätungen gesamt</div>
      <div class="rep-kpi-value">${totalLate}×</div>
    </div>
  </div>

  ${isAdmin && deptCostEntries.length?`
  <!-- Charts Row -->
  <div class="rep-charts-row">
    <!-- Cost Breakdown -->
    <div class="rep-chart-card">
      <div class="rep-chart-card-hd">
        <span class="rep-chart-title">Personalkosten Breakdown</span>
        <div class="rep-chart-legend"><span class="rep-chart-legend-dot"></span> Aktueller Monat</div>
      </div>
      <div class="rep-bar-rows">${costBarsHTML}</div>
    </div>
    <!-- Hours Gauges -->
    <div class="rep-chart-card">
      <div class="rep-chart-card-hd">
        <span class="rep-chart-title">Soll vs. Ist Stunden</span>
      </div>
      ${gaugesHTML}
    </div>
  </div>`:''}

  ${extraSection}

  <!-- Top Delays Table -->
  <div class="rep-delays-card">
    <div class="rep-delays-hd">
      <div class="rep-delays-hd-left">
        <span class="rep-delays-title">Top Verspätungen</span>
        ${totalLate>0?'<span class="rep-kritisch-badge">Kritisch</span>':''}
      </div>
      <button class="rep-see-all">Gesamte Liste anzeigen</button>
    </div>
    ${topDelays.length?`
    <div style="overflow-x:auto">
      <table class="rep-delays-table">
        <thead><tr>
          <th>Mitarbeiter</th>
          <th>Abteilung</th>
          <th>Häufigkeit</th>
          <th>∅ Dauer</th>
          <th>Status</th>
          <th>Aktion</th>
        </tr></thead>
        <tbody>${delayRows}</tbody>
      </table>
    </div>`:`
    <div style="text-align:center;padding:40px;color:var(--text-muted)">
      <span class="ms" style="font-size:2.5rem;display:block;margin-bottom:8px">verified</span>
      Keine Verspätungen erfasst
    </div>`}
  </div>`;
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
  let cls=CHECKLISTS;
  if(isEmp){cls=cls.filter(c=>c.empId===currentUser.empId||c.empId===0);}
  else{const loc=currentUser.location==='all'?(currentLocation==='all'?null:currentLocation):currentUser.location;if(loc)cls=cls.filter(c=>c.location===loc);}

  const banner=isEmp?permBanner('Du siehst nur deine eigenen und allgemeinen Checklisten.'):'';

  // ─── Category Stat Chips ───
  const statChips=CHECKLIST_TYPES.map(ct=>{
    const items=cls.filter(c=>c.type===ct.id);
    const total=items.reduce((s,c)=>s+c.items.length,0);
    const done=items.reduce((s,c)=>s+c.items.filter(i=>i.done).length,0);
    const pct=total>0?Math.round(done/total*100):0;
    return`<div class="cl-stat-chip" style="border-left-color:${ct.color}">
      <div class="cl-stat-chip-icon">${ct.icon}</div>
      <div class="cl-stat-chip-label">${ct.name}</div>
      <div class="cl-stat-chip-pct">${pct}%</div>
      <div class="cl-stat-chip-sub">${done}/${total} erledigt</div>
    </div>`;
  }).join('');

  // ─── Bento hero: pick first checklist as featured ───
  let heroHTML='';
  if(cls.length>0){
    const hero=cls[0];
    const heroType=CHECKLIST_TYPES.find(t=>t.id===hero.type)||{icon:'✅',name:hero.type,color:'#3b4fd2'};
    const heroDone=hero.items.filter(i=>i.done).length;
    const heroTotal=hero.items.length;
    const heroPct=heroTotal>0?Math.round(heroDone/heroTotal*100):0;
    const R=34;const cx=40;const cy=40;
    const circ=2*Math.PI*R;
    const filled=circ*(heroPct/100);
    const offset=circ-filled;
    heroHTML=`<div class="cl-hero-card">
      <div class="cl-hero-blob"></div>
      <div class="cl-hero-top">
        <div style="position:relative;z-index:1">
          <div class="cl-hero-prio">Prio: ${heroPct>=75?'Hoch':heroPct>=40?'Mittel':'Niedrig'}</div>
          <h2 class="cl-hero-name">${heroType.name} – ${hero.empName}</h2>
          <p class="cl-hero-desc">${hero.items.length} Aufgaben · ${heroDone} erledigt</p>
        </div>
        <div class="cl-circle-wrap">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="${cx}" cy="${cy}" r="${R}" fill="transparent" stroke="rgba(255,255,255,.15)" stroke-width="8"/>
            <circle cx="${cx}" cy="${cy}" r="${R}" fill="transparent" stroke="#fff"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
              stroke-linecap="round" stroke-width="8"
              transform="rotate(-90 40 40)"/>
          </svg>
          <div class="cl-circle-pct">${heroPct}%</div>
        </div>
      </div>
      <div class="cl-hero-bottom" style="position:relative;z-index:1">
        <button class="cl-hero-continue-btn">Jetzt fortfahren</button>
      </div>
    </div>`;
  }

  // ─── Bento small cards (type chips, up to 3) ───
  const MINI_COLORS=[
    {bg:'rgba(245,158,11,.1)',color:'#d97706',icon:'warning'},
    {bg:'rgba(59,79,210,.06)',color:'var(--accent)',icon:'school'},
    {bg:'rgba(0,81,92,.07)',color:'#00515c',icon:'description'}
  ];
  const bentoMinis=CHECKLIST_TYPES.slice(0,3).map((ct,i)=>{
    const items=cls.filter(c=>c.type===ct.id);
    const total=items.reduce((s,c)=>s+c.items.length,0);
    const done=items.reduce((s,c)=>s+c.items.filter(i=>i.done).length,0);
    const pct=total>0?Math.round(done/total*100):0;
    const mc=MINI_COLORS[i%MINI_COLORS.length];
    return`<div class="cl-mini-card">
      <div class="cl-mini-icon" style="background:${mc.bg};color:${mc.color}">
        <span class="ms">${mc.icon}</span>
      </div>
      <div class="cl-mini-text">
        <div class="cl-mini-name">${ct.name}</div>
        <div class="cl-mini-sub">${done}/${total} Aufgaben</div>
        <div class="cl-mini-track"><div class="cl-mini-fill" style="width:${pct}%;background:${mc.color}"></div></div>
      </div>
      <button class="cl-mini-arrow"><span class="ms">chevron_right</span></button>
    </div>`;
  }).join('');

  // ─── Hygiene card: use second checklist or type ───
  let hygieneHTML='';
  if(cls.length>1){
    const hy=cls[1];
    const hyType=CHECKLIST_TYPES.find(t=>t.id===hy.type)||{icon:'restaurant',name:hy.type};
    const hyDone=hy.items.filter(i=>i.done).length;
    const hyTotal=hy.items.length;
    const hyPct=hyTotal>0?Math.round(hyDone/hyTotal*100):0;
    hygieneHTML=`<div class="cl-hygiene-card">
      <div>
        <div class="cl-hygiene-card-top">
          <div class="cl-hygiene-icon"><span class="ms" style="font-variation-settings:'FILL' 1">restaurant</span></div>
          <span class="cl-hygiene-badge">Täglich</span>
        </div>
        <h3 class="cl-hygiene-title">${hyType.name} – ${hy.empName}</h3>
        <p class="cl-hygiene-desc">${hy.items.length} Kontrollpunkte</p>
      </div>
      <div>
        <div class="cl-progress-label"><span>Fortschritt</span><span>${hyDone}/${hyTotal} Aufgaben</span></div>
        <div class="cl-progress-track"><div class="cl-progress-fill" style="width:${hyPct}%;background:#22c55e"></div></div>
      </div>
    </div>`;
  } else {
    hygieneHTML=`<div class="cl-hygiene-card">
      <div>
        <div class="cl-hygiene-card-top">
          <div class="cl-hygiene-icon"><span class="ms" style="font-variation-settings:'FILL' 1">checklist</span></div>
          <span class="cl-hygiene-badge">Standard</span>
        </div>
        <h3 class="cl-hygiene-title">Tägliche Kontrolle</h3>
        <p class="cl-hygiene-desc">Keine weiteren Checklisten vorhanden</p>
      </div>
      <div>
        <div class="cl-progress-label"><span>Fortschritt</span><span>—</span></div>
        <div class="cl-progress-track"><div class="cl-progress-fill" style="width:0%;background:#22c55e"></div></div>
      </div>
    </div>`;
  }

  // ─── Build task cards ───
  let taskCards='';
  if(cls.length===0){
    taskCards=`<div class="cl-empty"><span class="ms">checklist</span>Keine Checklisten vorhanden.</div>`;
  } else {
    cls.forEach(cl=>{
      const ct=CHECKLIST_TYPES.find(t=>t.id===cl.type)||{icon:'✅',name:cl.type,color:'var(--accent)'};
      const done=cl.items.filter(i=>i.done).length;
      const total=cl.items.length;
      const pct=total>0?Math.round(done/total*100):0;
      const canManage=can('editEmployees');
      const badgeCls=pct===100?'done':pct>=50?'partial':'todo';
      const badgeTxt=pct===100?'Abgeschlossen':pct>=50?'In Bearbeitung':'Offen';

      let itemsHTML='';
      cl.items.forEach((item,idx)=>{
        itemsHTML+=`<div class="cl-item">
          <div class="cl-item-check ${item.done?'done':''}" style="${item.done?'background:'+ct.color+';border-color:'+ct.color:''}" onclick="toggleCLItem(${cl.id},${idx})">
            ${item.done?'<span class="ms" style="font-size:.75rem;font-variation-settings:\'FILL\' 1">check</span>':''}
          </div>
          <span class="cl-item-text ${item.done?'done':''}" ${canManage?`ondblclick="editCLItem(${cl.id},${idx},this)" title="Doppelklick zum Bearbeiten"`:''}>${item.text}</span>
          ${canManage?`<button class="cl-item-remove" onclick="removeCLItem(${cl.id},${idx})" title="Entfernen">✕</button>`:''}
        </div>`;
      });

      const addRowHTML=canManage?`<div class="cl-add-row">
        <input class="cl-add-input" placeholder="Neue Aufgabe..." id="newCLItem_${cl.id}" onkeydown="if(event.key==='Enter')addCLItem(${cl.id})">
        <button class="cl-add-btn" onclick="addCLItem(${cl.id})">+ Hinzufügen</button>
      </div>`:'';

      const actionBtns=canManage?`
        <button class="cl-icon-btn reset" onclick="resetChecklist(${cl.id})" title="Zurücksetzen">🔄</button>
        <button class="cl-icon-btn" onclick="deleteChecklist(${cl.id})" title="Löschen">🗑️</button>
      `:'';

      taskCards+=`<div class="cl-card">
        <div class="cl-card-header">
          <div class="cl-card-header-left">
            <span class="cl-card-type-icon">${ct.icon}</span>
            <span class="cl-card-title">${ct.name} – ${cl.empName}</span>
          </div>
          <div class="cl-card-header-right">
            <span class="cl-badge ${badgeCls}">${badgeTxt}</span>
            <span style="font-size:.75rem;color:var(--text-muted)">${done}/${total}</span>
            ${actionBtns}
          </div>
        </div>
        <div class="cl-card-progress">
          <div class="cl-card-progress-track">
            <div class="cl-card-progress-fill" style="width:${pct}%;background:${ct.color}"></div>
          </div>
        </div>
        <div class="cl-items-wrap">${itemsHTML}</div>
        ${addRowHTML}
      </div>`;
    });
  }

  pg.innerHTML=`${banner}
  <!-- Page Header -->
  <div class="cl-page-hd">
    <div>
      <h2 class="cl-page-title">Checklisten &amp; Compliance</h2>
      <p class="cl-page-sub">Verwalten Sie betriebliche Abläufe und Sicherheitsstandards.</p>
    </div>
    <div class="cl-hd-actions">
      ${can('editEmployees')?`<button class="cl-new-btn" onclick="openModal('addChecklist')"><span class="ms">playlist_add</span> Neue Vorlage</button>`:''}
    </div>
  </div>

  <!-- Category Stats -->
  <div class="cl-stats-grid">${statChips}</div>

  <!-- Bento Grid -->
  ${cls.length>0?`<div class="cl-bento-grid">
    ${heroHTML}
    ${hygieneHTML}
    ${bentoMinis}
  </div>`:''}

  <!-- Task Cards -->
  <div class="cl-tasks-hd">
    <h3 class="cl-tasks-title">Aktuelle Aufgaben</h3>
    <div class="cl-tasks-hd-right">
      <button class="cl-sort-btn"><span class="ms">sort</span> Sortieren</button>
      <button class="cl-sort-btn"><span class="ms">filter_list</span> Filter</button>
    </div>
  </div>
  <div id="clContent">${taskCards}</div>

  <!-- FAB -->
  <div class="cl-fab-wrap">
    ${can('editEmployees')?`<div class="cl-fab secondary">
        <span class="ms">file_download</span>
        <span class="cl-fab-label">Export PDF</span>
      </div>
      <div class="cl-fab primary" onclick="openModal('addChecklist')">
        <span class="ms">add</span>
        <span class="cl-fab-label">Aufgabe hinzufügen</span>
      </div>`:''}
  </div>`;
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

// ═══ STANDORTE (Location Management) ═══
function renderLocations(){
  const pg=document.getElementById('page-locations');
  if(!can('manageAccess')){pg.innerHTML=permBanner('Standorte-Verwaltung ist nur für Inhaber verfügbar.');return;}

  const locs = LOCS || [];

  let rows = locs.map(l => {
    const empCount = EMPS.filter(e => e.location === l.id).length;
    const gps = GPS_COORDS[l.id];
    const sched = LOCATION_SCHEDULE[l.id];
    const dayNames = ['So','Mo','Di','Mi','Do','Fr','Sa'];
    const offDays = sched ? sched.dayOff.map(d => dayNames[d]).join(', ') : '—';

    return `<tr>
      <td><div style="display:flex;align-items:center;gap:10px">
        <div class="emp-avatar" style="width:38px;height:38px;font-size:.9rem;background:var(--accent);color:#fff">${l.id.slice(0,2).toUpperCase()}</div>
        <div><strong style="font-size:.9rem">${l.name}</strong><div style="font-size:.75rem;color:var(--text-muted)">${l.id}</div></div>
      </div></td>
      <td>${l.city || '—'}</td>
      <td style="font-size:.82rem">${empCount} MA</td>
      <td style="font-size:.82rem">${gps ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)} (${gps.radius_m}m)` : '—'}</td>
      <td style="font-size:.82rem">${offDays}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm" onclick="editLocation('${l.id}')" title="Bearbeiten"><span class="ms" style="font-size:16px">edit</span></button>
          ${empCount === 0 ? `<button class="btn btn-sm btn-danger" onclick="deleteLocation('${l.id}')" title="Löschen"><span class="ms" style="font-size:16px">delete</span></button>` : ''}
        </div>
      </td>
    </tr>`;
  }).join('');

  pg.innerHTML=`
    <div class="table-wrap">
      <div class="table-header">
        <span class="table-title">Standorte (${locs.length})</span>
        <button class="btn btn-primary" onclick="showAddLocationModal()"><span class="ms" style="font-size:16px">add</span> Neuer Standort</button>
      </div>
      <div style="overflow-x:auto"><table><thead><tr>
        <th>Standort</th><th>Stadt</th><th>Mitarbeiter</th><th>GPS Koordinaten</th><th>Ruhetage</th><th>Aktionen</th>
      </tr></thead><tbody>${rows}</tbody></table></div>
    </div>
    <div style="margin-top:12px;padding:12px;background:var(--bg-input);border-radius:8px;font-size:.82rem;color:var(--text-muted)">
      💡 Standorte können nur gelöscht werden, wenn keine Mitarbeiter zugeordnet sind. GPS-Koordinaten werden für QR Check-in benötigt.
    </div>`;
}

function showAddLocationModal(){
  openModal('Neuer Standort', `
    <div class="form-group"><label>ID (intern, z.B. "sushi_bar")</label><input class="form-input" id="locId" placeholder="lowercase_name"></div>
    <div class="form-group"><label>Name</label><input class="form-input" id="locName" placeholder="z.B. Sushi Bar Tokyo"></div>
    <div class="form-group"><label>Stadt</label><input class="form-input" id="locCity" placeholder="z.B. Stuttgart"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
      <div class="form-group"><label>Latitude</label><input class="form-input" id="locLat" type="number" step="0.0001" placeholder="48.7752"></div>
      <div class="form-group"><label>Longitude</label><input class="form-input" id="locLng" type="number" step="0.0001" placeholder="9.1724"></div>
      <div class="form-group"><label>Radius (m)</label><input class="form-input" id="locRadius" type="number" value="50"></div>
    </div>
  `, `<button class="btn btn-primary" onclick="saveNewLocation()">Speichern</button>`);
}

async function saveNewLocation(){
  const id = document.getElementById('locId').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
  const name = document.getElementById('locName').value.trim();
  const city = document.getElementById('locCity').value.trim();
  if(!id || !name){ alert('ID und Name sind erforderlich.'); return; }
  if(LOCS.find(l => l.id === id)){ alert('Diese ID existiert bereits.'); return; }

  const { error } = await sb.from('locations').insert({ id, name, city });
  if(error){ alert('Fehler: ' + error.message); return; }

  // Update local data
  LOCS.push({ id, name, city });

  // Save GPS if provided
  const lat = parseFloat(document.getElementById('locLat').value);
  const lng = parseFloat(document.getElementById('locLng').value);
  const radius = parseInt(document.getElementById('locRadius').value) || 50;
  if(!isNaN(lat) && !isNaN(lng)){
    GPS_COORDS[id] = { lat, lng, radius_m: radius };
  }
  LOCATION_SCHEDULE[id] = { dayOff: [0], halfDays: [] };

  closeModal();
  buildLocationSelect();
  renderLocations();
  showToast('Standort "' + name + '" erstellt ✓');
}

function editLocation(locId){
  const loc = LOCS.find(l => l.id === locId);
  if(!loc) return;
  const gps = GPS_COORDS[locId] || { lat: '', lng: '', radius_m: 50 };
  const sched = LOCATION_SCHEDULE[locId] || { dayOff: [0], halfDays: [] };
  const dayNames = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];

  openModal('Standort bearbeiten: ' + loc.name, `
    <div class="form-group"><label>Name</label><input class="form-input" id="editLocName" value="${loc.name}"></div>
    <div class="form-group"><label>Stadt</label><input class="form-input" id="editLocCity" value="${loc.city || ''}"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
      <div class="form-group"><label>Latitude</label><input class="form-input" id="editLocLat" type="number" step="0.0001" value="${gps.lat || ''}"></div>
      <div class="form-group"><label>Longitude</label><input class="form-input" id="editLocLng" type="number" step="0.0001" value="${gps.lng || ''}"></div>
      <div class="form-group"><label>Radius (m)</label><input class="form-input" id="editLocRadius" type="number" value="${gps.radius_m || 50}"></div>
    </div>
    <div class="form-group"><label>Ruhetage</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
        ${dayNames.map((d,i) => `<label style="display:flex;align-items:center;gap:4px;font-size:.85rem;cursor:pointer">
          <input type="checkbox" class="editDayOff" value="${i}" ${sched.dayOff.includes(i)?'checked':''}>
          ${d}
        </label>`).join('')}
      </div>
    </div>
  `, `<button class="btn btn-primary" onclick="saveEditLocation('${locId}')">Speichern</button>`);
}

async function saveEditLocation(locId){
  const name = document.getElementById('editLocName').value.trim();
  const city = document.getElementById('editLocCity').value.trim();
  if(!name){ alert('Name ist erforderlich.'); return; }

  const { error } = await sb.from('locations').update({ name, city }).eq('id', locId);
  if(error){ alert('Fehler: ' + error.message); return; }

  const loc = LOCS.find(l => l.id === locId);
  if(loc){ loc.name = name; loc.city = city; }

  // Update GPS
  const lat = parseFloat(document.getElementById('editLocLat').value);
  const lng = parseFloat(document.getElementById('editLocLng').value);
  const radius = parseInt(document.getElementById('editLocRadius').value) || 50;
  if(!isNaN(lat) && !isNaN(lng)){
    GPS_COORDS[locId] = { lat, lng, radius_m: radius };
  }

  // Update schedule
  const dayOff = [...document.querySelectorAll('.editDayOff:checked')].map(cb => parseInt(cb.value));
  LOCATION_SCHEDULE[locId] = { dayOff, halfDays: LOCATION_SCHEDULE[locId]?.halfDays || [] };

  closeModal();
  buildLocationSelect();
  renderLocations();
  showToast('Standort aktualisiert ✓');
}

async function deleteLocation(locId){
  const loc = LOCS.find(l => l.id === locId);
  if(!loc) return;
  const empCount = EMPS.filter(e => e.location === locId).length;
  if(empCount > 0){ alert('Kann nicht gelöscht werden — ' + empCount + ' Mitarbeiter zugeordnet.'); return; }
  if(!confirm('Standort "' + loc.name + '" wirklich löschen?')) return;

  const { error } = await sb.from('locations').delete().eq('id', locId);
  if(error){ alert('Fehler: ' + error.message); return; }

  const idx = LOCS.findIndex(l => l.id === locId);
  if(idx >= 0) LOCS.splice(idx, 1);
  delete GPS_COORDS[locId];
  delete LOCATION_SCHEDULE[locId];

  buildLocationSelect();
  renderLocations();
  showToast('Standort gelöscht ✓');
}

// ═══ QR GENERATOR (Admin-only) ═══
function renderQrGenerator(){
  const pg=document.getElementById('page-qr_generator');
  if(!pg)return;

  let domain=localStorage.getItem('qr_domain')||'';
  // Clean domain: only keep origin
  if(domain){try{domain=new URL(domain).origin;}catch(e){}}

  pg.innerHTML=`
    <div class="section-header"><h2>📱 QR Check-in Codes</h2><p>QR-Codes für Standort-Check-in generieren und drucken</p></div>
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:24px;padding:16px 20px;background:var(--bg-card);border-radius:14px;border:1px solid var(--border)">
      <span style="font-size:.85rem;color:var(--text-muted)">🌐 Domain (HTTPS):</span>
      <input id="qrDomainInput" type="text" value="${domain}" placeholder="https://hrm.okyu.de" style="flex:1;min-width:200px;padding:10px 14px;background:var(--bg-main);border:1px solid var(--border);border-radius:8px;color:var(--text-primary);font-family:'Space Mono',monospace;font-size:.85rem;outline:none">
      <button onclick="generateQrCodes()" class="btn-primary" style="padding:10px 20px;border-radius:8px;font-weight:600;cursor:pointer;border:none;background:var(--accent);color:#fff">QR generieren</button>
    </div>
    <div id="qrCardsGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px"></div>
  `;

  if(domain) setTimeout(()=>generateQrCodes(),100);
}

function generateQrCodes(){
  let raw=document.getElementById('qrDomainInput')?.value?.trim()?.replace(/\/+$/,'');
  if(!raw||!raw.startsWith('http')){toast('Bitte gültige HTTPS-Domain eingeben','err');return;}

  // Extract just the origin (https://example.com) — strip path, params, etc.
  try{
    const u=new URL(raw);
    raw=u.origin; // e.g. https://hr-ebon-five.vercel.app
  }catch(e){}
  const domain=raw;
  document.getElementById('qrDomainInput').value=domain; // Update input to show clean domain
  localStorage.setItem('qr_domain',domain);

  // Load qrcode.js if not loaded
  if(typeof QRCode==='undefined'){
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
    s.onload=()=>{
      console.log('[QR] Library loaded, QRCode type:', typeof QRCode);
      _renderQrCards(domain);
    };
    s.onerror=()=>{
      console.warn('[QR] CDN 1 failed, trying fallback...');
      const s2=document.createElement('script');
      s2.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      s2.onload=()=>_renderQrCards(domain);
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  } else {
    _renderQrCards(domain);
  }
}

function _renderQrCards(domain){
  const grid=document.getElementById('qrCardsGrid');
  if(!grid)return;

  const locs=[
    {id:'okyu',name:'Okyu Restaurant',icon:'🍣',key:QR_KEYS.okyu},
    {id:'origami',name:'Origami Restaurant',icon:'🏮',key:QR_KEYS.origami},
    {id:'enso',name:'Enso Sushi & Grill',icon:'🔥',key:QR_KEYS.enso}
  ];

  grid.innerHTML=locs.map(l=>`
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:28px;text-align:center">
      <div style="font-size:2.2rem;margin-bottom:8px">${l.icon}</div>
      <div style="font-size:1.1rem;font-weight:700;margin-bottom:4px">${l.name}</div>
      <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:16px">📍 Stuttgart</div>
      <div style="background:#fff;border-radius:12px;padding:16px;display:inline-block;margin-bottom:12px"><div id="qrC_${l.id}"></div></div>
      <div style="font-family:'Space Mono',monospace;font-size:.6rem;color:var(--text-muted);word-break:break-all;margin-bottom:8px;padding:6px 10px;background:rgba(255,255,255,.03);border-radius:6px">${domain}/index.html?checkin=${l.id}&key=${l.key}</div>
      <div style="font-size:.75rem;color:var(--warning);margin-bottom:14px">🔑 Key: <strong>${l.key}</strong></div>
      <div style="display:flex;gap:8px;justify-content:center">
        <button onclick="downloadQrPng('${l.id}','${l.name}')" style="padding:8px 16px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:.82rem">⬇️ PNG</button>
        <button onclick="printQrSingle('${l.id}','${l.name}','${l.icon}')" style="padding:8px 16px;background:rgba(255,255,255,.06);color:var(--text-primary);border:1px solid var(--border);border-radius:8px;font-weight:600;cursor:pointer;font-size:.82rem">🖨️ Drucken</button>
      </div>
    </div>
  `).join('');

  // Render QR codes using qrcodejs API
  locs.forEach(l=>{
    const url=`${domain}/index.html?checkin=${l.id}&key=${l.key}`;
    const el=document.getElementById('qrC_'+l.id);
    if(el){
      try{
        new QRCode(el,{text:url,width:200,height:200,colorDark:'#000000',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H});
        console.log('[QR] ✓ Generated:',l.id);
      }catch(e){console.error('[QR] Error:',l.id,e);}
    }
  });
}

function downloadQrPng(locId,locName){
  const container=document.getElementById('qrC_'+locId);
  if(!container)return;
  // qrcodejs puts an <img> or <canvas> inside the div
  const img=container.querySelector('img')||container.querySelector('canvas');
  if(!img)return;
  const out=document.createElement('canvas');
  const size=200;
  out.width=size+80;out.height=size+120;
  const ctx=out.getContext('2d');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,out.width,out.height);
  ctx.drawImage(img,40,40,size,size);
  ctx.fillStyle='#000';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
  ctx.fillText(locName+' — Check-in',out.width/2,size+70);
  ctx.font='11px sans-serif';ctx.fillStyle='#666';
  ctx.fillText('QR scannen zum Ein-/Ausstempeln',out.width/2,size+90);
  const a=document.createElement('a');
  a.download='checkin-qr-'+locId+'.png';a.href=out.toDataURL('image/png');a.click();
}

function printQrSingle(locId,locName,icon){
  const container=document.getElementById('qrC_'+locId);
  if(!container)return;
  const img=container.querySelector('img')||container.querySelector('canvas');
  if(!img)return;
  const src=img.tagName==='IMG'?img.src:img.toDataURL('image/png');
  const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;text-align:center}.c{padding:40px}h1{font-size:2rem;margin-bottom:8px}img{display:block;margin:0 auto 24px}</style></head><body><div class="c"><div style="font-size:3rem;margin-bottom:12px">${icon}</div><h1>${locName}</h1><p style="color:#666;margin-bottom:24px">📍 Stuttgart</p><img src="${src}" width="280" height="280"><p style="font-size:1.1rem;font-weight:bold;margin-bottom:8px">📱 QR scannen zum Check-in</p><p style="color:#999;font-size:.9rem">OKYU HRM — Zeiterfassung</p></div><script>setTimeout(()=>window.print(),300)<\/script></body></html>`);
  w.document.close();
}

// ═══ MOBILE SIDEBAR ═══
function toggleSidebar(){
  const sb=document.getElementById('sidebar');
  const ov=document.getElementById('sidebarOverlay');
  const isOpen=sb.classList.toggle('open');
  if(ov) isOpen ? ov.classList.add('active') : ov.classList.remove('active');
}
function closeSidebar(){
  const sb=document.getElementById('sidebar');
  const ov=document.getElementById('sidebarOverlay');
  sb.classList.remove('open');
  if(ov) ov.classList.remove('active');
}

// ═══ INIT ═══
function initApp(){
  document.getElementById('dateDisplay').textContent=new Date().toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  genShifts();renderPage('dashboard');renderNotifs();
  if(window.innerWidth<=900){
    document.getElementById('menuBtn').style.display='';
    // Ensure notif panel is closed on mobile init
    document.getElementById('notifPanel')?.classList.remove('open');
    document.getElementById('notifOverlay')?.classList.remove('open');
    closeSidebar();
  }
  window.addEventListener('resize',()=>{document.getElementById('menuBtn').style.display=window.innerWidth<=900?'':'none';});
  // QR Check-in: detect URL params after app is ready
  detectQrCheckin();

  // Re-detect QR when page is shown again (mobile: scan QR → brings back same tab)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      console.log('[QR] pageshow (from bfcache) → re-checking');
      detectQrCheckin();
    }
  });

  // Also check when tab becomes visible (user switches back)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkin')) {
        console.log('[QR] Tab visible with checkin params → re-checking');
        detectQrCheckin();
      }
    }
  });
}
