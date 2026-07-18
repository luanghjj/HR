// ═══════════════════════════════════════════════════════════
// OKYU HRM – Utility Functions
// ═══════════════════════════════════════════════════════════

/** Escape HTML to prevent XSS */
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/** Format Date to ISO string YYYY-MM-DD (browser-local time) */
function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Format any date/timestamp to YYYY-MM-DD in Europe/Berlin (TZ-safe).
 *  Supabase gibt TIMESTAMPTZ als UTC-String zurück (z.B. '2026-07-17T22:30:00Z');
 *  ein Check-in 18.07. 00:30 CEST liegt in Berlin am 18.07., als UTC aber am 17.07.
 *  startsWith('2026-07-18') würde falsch sein → deshalb Berlin-Datum benutzen.
 *  @param {Date|string|number} date - Date object, ISO string or epoch ms
 *  @returns {string} YYYY-MM-DD in Europe/Berlin */
function isoDateBerlin(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '';
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(d);
  const y = p.find(x => x.type === 'year').value;
  const m = p.find(x => x.type === 'month').value;
  const day = p.find(x => x.type === 'day').value;
  return `${y}-${m}-${day}`;
}

/** Schicht-Stunden aus 'HH:MM'-Strings. Behandelt Schichten über Mitternacht
 *  (to <= from → +24h) und liefert nie negative Werte (Math.max(0,…)).
 *  @param {string} fromStr - 'HH:MM'
 *  @param {string} toStr   - 'HH:MM'
 *  @returns {number} Stunden (brutto) */
function calcShiftSpanH(fromStr, toStr) {
  if (!fromStr || !toStr) return 0;
  const [fh, fm] = fromStr.split(':').map(Number);
  const [th, tm] = toStr.split(':').map(Number);
  let h = (th + tm / 60) - (fh + fm / 60);
  if (h < 0) h += 24; // über Mitternacht
  return Math.max(0, h);
}

/** Berlin-Offset gegenüber UTC in Millisekunden (DST-sicher) für einen Zeitpunkt.
 *  Positiv = Berlin voraus. Dient dazu, ein Berliner Wanduhr-Datum ('YYYY-MM-DD' +
 *  'HH:MM') in einen absoluten Epoch-Wert umzuwandeln, unabhängig von der
 *  Browser-Zeitzone (z.B. Auto-Checkout auf nicht-Berlin-Geräten).
 *  @param {Date} [d] - Zeitpunkt (Default: jetzt)
 *  @returns {number} ms */
function berlinOffsetMs(d) {
  const dt = d instanceof Date ? d : new Date();
  const utcMs = Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(),
    dt.getUTCHours(), dt.getUTCMinutes());
  // Berliner Wanduhr als "lokale" Zeit interpretieren:
  const blnStr = dt.toLocaleString('en-US', { timeZone: 'Europe/Berlin', hour12: false });
  const bln = new Date(blnStr);
  const blnUtcMs = Date.UTC(bln.getFullYear(), bln.getMonth(), bln.getDate(),
    bln.getHours(), bln.getMinutes());
  return blnUtcMs - utcMs;
}

/** Absoluten Epoch-Wert (ms) aus Berliner Datum + 'HH:MM' Wanduhr berechnen.
 *  TZ-sicher: funktioniert auf jedem Browser, nicht nur Europe/Berlin.
 *  @param {string} dateStr - 'YYYY-MM-DD' (Berliner Kalendertag)
 *  @param {string} hhmm    - 'HH:MM'
 *  @returns {number} epoch ms */
function berlinWallMs(dateStr, hhmm) {
  if (!dateStr || !hhmm) return NaN;
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = hhmm.split(':').map(Number);
  return Date.UTC(y, m - 1, d, hh, mm, 0, 0) - berlinOffsetMs(new Date());
}

/** Pause-Minuten für einen Check-in-Record: Schicht-Pause hat Vorrang,
 *  sonst MA-Default (pauseMinutes ?? 30).
 *  @param {number} empId
 *  @param {number|null} shiftId
 *  @returns {number} Pause in Minuten */
function pauseForRecord(empId, shiftId) {
  if (shiftId != null && typeof SHIFTS !== 'undefined') {
    const sh = SHIFTS.find(s => s.id === shiftId);
    if (sh && sh.pauseMinutes != null) return sh.pauseMinutes;
  }
  const emp = (typeof EMPS !== 'undefined') ? EMPS.find(e => e.id === empId) : null;
  return emp?.pauseMinutes ?? 30;
}

/** Netto-Stunden EINER Schicht (gemapptes Shift-Objekt mit s.from/s.to/…).
 *  Krank / ganzer Urlaub → 0 h. Halber Urlaub → halbe Stunden (ohne Pause/Verspätung).
 *  Sonst: brutto − Pause (Schicht > MA-Default > 30) − Verspätung.
 *  @param {object} shift - gemapptes Shift-Objekt {from,to,isSick,isVacation,vacHalf,isLate,lateMin,pauseMinutes}
 *  @param {object} [emp]  - gemapptes MA-Objekt (für pauseMinutes-Default)
 *  @returns {number} Netto-Stunden (1 Dezimalstelle) */
function calcShiftNetH(shift, emp) {
  if (!shift) return 0;
  if (shift.isSick || (shift.isVacation && !shift.vacHalf)) return 0;
  const brutto = calcShiftSpanH(shift.from, shift.to);
  if (shift.isVacation && shift.vacHalf) {
    return Math.max(0, Math.round(brutto / 2 * 10) / 10);
  }
  const pauseMin = shift.pauseMinutes != null ? shift.pauseMinutes : (emp?.pauseMinutes ?? 30);
  const lateMin = shift.isLate ? (shift.lateMin || 0) : 0;
  const net = brutto - pauseMin / 60 - lateMin / 60;
  return Math.max(0, Math.round(net * 10) / 10);
}

/** Format date string to German locale (DD.MM.YYYY) */
function formatDateDE(dateStr) {
  return new Date(dateStr).toLocaleDateString('de-DE');
}

/** Get Monday of the week for a given date */
function getWeekStart(date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

/** Get ISO week number */
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/** Get location name by ID – supports comma-separated multi-location */
function getLocationName(locationId) {
  if (!locationId) return '—';
  if (locationId === 'all') return 'Alle Standorte';
  // Multi-location: join names
  return locationId.split(',').map(id => {
    const l = LOCS.find(l => l.id === id.trim());
    return l ? l.name : id.trim();
  }).join(', ');
}

/** Map department name to CSS class */
function getDeptColorClass(deptName) {
  return { Küche: 'kitchen', Service: 'service', Bar: 'bar', Sushi: 'sushi', Ausbildung: 'azubi', Verwaltung: 'verwaltung', Minijob: 'minijob', Aushilfe: 'aushilfe' }[deptName] || '';
}

/** Generate status badge HTML */
function statusBadge(status) {
  const map = {
    active: ['Aktiv', 'success'],
    vacation: ['Urlaub', 'info'],
    sick: ['Krank', 'danger']
  };
  const [label, color] = map[status] || ['—', 'neutral'];
  return `<span class="badge badge-${color}">${label}</span>`;
}

/** Generate role tag HTML */
function roleTag(role) {
  const map = {
    inhaber: ['Inhaber', 'inhaber'],
    manager: ['Manager', 'manager'],
    mitarbeiter: ['Mitarbeiter', 'mitarbeiter'],
    azubi: ['Azubi', 'azubi']
  };
  const [label, cssClass] = map[role] || ['—', ''];
  return `<span class="role-tag ${cssClass}">${label}</span>`;
}

/** Show toast notification */
function toast(message, type) {
  const container = document.getElementById('toastContainer');
  const toastEl = document.createElement('div');
  toastEl.className = 'toast ' + (type || '');
  toastEl.textContent = message;
  container.appendChild(toastEl);
  setTimeout(() => toastEl.remove(), 3000);
}

/**
 * Show the full-screen loading overlay
 * @param {string} [msg] - Optional message (default: 'Laden...')
 */
function showLoading(msg) {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;
  const msgEl = document.getElementById('loadingMsg');
  if (msgEl) msgEl.textContent = msg || 'Laden...';
  overlay.style.opacity = '1';
  overlay.style.display = 'flex';
  overlay.style.pointerEvents = 'all';
}

/**
 * Hide the full-screen loading overlay (fade out then remove from flow)
 */
function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
  // Remove from view after transition
  setTimeout(() => { overlay.style.display = 'none'; }, 400);
}

/** Get currently active page ID */
function getCurrentPage() {
  const activePage = document.querySelector('.page.active');
  return activePage ? activePage.id.replace('page-', '') : 'dashboard';
}

/** Set active tab in a tab group */
function setActiveTab(element) {
  element.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  element.classList.add('active');
}

/** Generate permission banner HTML */
function permBanner(message) {
  return `<div class="perm-banner"><span class="perm-icon">ℹ️</span>${message}</div>`;
}

/** Format number as Euro currency */
function formatEuro(value) {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' €';
}

/** Calculate planned hours for an employee (current month)
 *  Halber Urlaub (isVacation && vacHalf) zählt mit halben Stunden.
 *  TZ-sicher + mitternachtübergreifend (calcShiftSpanH). */
function calcPlanHours(employeeId) {
  const now = new Date(); // BUG FIX: was hardcoded
  const year = now.getFullYear();
  const month = now.getMonth();
  // Krank + ganzer Urlaub raus; halber Urlaub bleibt (halbe Stunden)
  const monthShifts = SHIFTS.filter(s => s.empId === employeeId && !s.isSick && !(s.isVacation && !s.vacHalf));
  let total = 0;
  monthShifts.forEach(shift => {
    const shiftDate = new Date(shift.date);
    if (shiftDate.getFullYear() === year && shiftDate.getMonth() === month) {
      const h = calcShiftSpanH(shift.from, shift.to);
      total += (shift.isVacation && shift.vacHalf) ? h / 2 : h;
    }
  });
  return Math.round(total * 10) / 10;
}

/** Calculate hourly rate from monthly salary */
function calcHourly(employee) {
  if (!employee.sollStunden || employee.sollStunden === 0) return 0;
  return Math.round(employee.bruttoGehalt / employee.sollStunden * 100) / 100;
}

/** Anzahl Schichten im aktuellen Monat (ohne krank/Urlaub) */
function calcMonthShiftCount(employeeId) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  return SHIFTS.filter(s => s.empId === employeeId && !s.isSick && !s.isVacation
    && (() => { const d = new Date(s.date); return d.getFullYear() === year && d.getMonth() === month; })()
  ).length;
}

/** Summe Verspätungs-Minuten im aktuellen Monat */
function calcMonthLateMinutes(employeeId) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  return SHIFTS.filter(s => s.empId === employeeId && s.isLate && !s.isSick && !s.isVacation
    && (() => { const d = new Date(s.date); return d.getFullYear() === year && d.getMonth() === month; })()
  ).reduce((sum, s) => sum + (s.lateMin || 0), 0);
}

/** Summe Pause-Minuten im aktuellen Monat (pro Schicht eigene Pause, sonst MA-Default) */
function calcMonthPauseMinutes(employee) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const def = employee.pauseMinutes ?? 30;
  return SHIFTS.filter(s => s.empId === employee.id && !s.isSick && !s.isVacation
    && (() => { const d = new Date(s.date); return d.getFullYear() === year && d.getMonth() === month; })()
  ).reduce((sum, s) => sum + (s.pauseMinutes != null ? s.pauseMinutes : def), 0);
}

/** Netto-Stunden aktueller Monat = Plan-Stunden − Pause (pro Schicht) − Verspätung */
function calcNetHours(employee) {
  const gross = calcPlanHours(employee.id);
  const pauseTotal = calcMonthPauseMinutes(employee);
  const lateMin = calcMonthLateMinutes(employee.id);
  const net = gross - (pauseTotal / 60) - (lateMin / 60);
  return Math.max(0, Math.round(net * 10) / 10);
}

/** Calculate monthly salary from hourly rate */
function calcMonthlyFromHourly(hourlyRate, plannedHours) {
  return Math.round(hourlyRate * plannedHours * 100) / 100;
}

// ═══ Data Filter Functions ═══

/** Check if location is allowed by custom permissions */
function _isLocAllowed(loc) {
  const locs = currentUser?._allowedLocations;
  if (!locs || locs.includes('all')) return true;
  return locs.includes(loc);
}

/** Check if entity's location(s) overlap with a location filter
 *  Supports comma-separated multi-location (like dept)
 *  @param {object} entity - Object with .location property
 *  @param {string|string[]} locFilter - Single ID, comma-separated IDs, array, or 'all'
 *  @returns {boolean}
 */
function empHasLoc(entity, locFilter) {
  if (!entity?.location) return false;
  if (entity.location === 'all' || locFilter === 'all') return true;
  const eLocs = entity.location.split(',').map(l => l.trim());
  if (Array.isArray(locFilter)) return eLocs.some(el => locFilter.includes(el));
  const fLocs = locFilter.split(',').map(l => l.trim());
  return eLocs.some(el => fLocs.includes(el));
}

/** Prüft, ob ein Bereich-Wert (kann komma-separiert sein, z.B. "Küche,Service")
 *  einen gesuchten Bereich enthält. "Alle" matcht immer.
 *  @param {string} deptValue - z.B. "Küche,Service" oder "Küche"
 *  @param {string} target - gesuchter Bereich
 */
function deptMatches(deptValue, target) {
  if (!deptValue) return false;
  if (target === 'all' || target === 'Alle') return true;
  const ds = deptValue.split(',').map(d => d.trim());
  return ds.includes(target) || ds.includes('Alle');
}

/** Get employees visible to current user */
function getVisibleEmps() {
  if (can('seeAllEmployees')) {
    let emps = EMPS;
    // Apply custom location restriction
    const locs = currentUser?._allowedLocations;
    if (locs && !locs.includes('all')) {
      emps = emps.filter(e => empHasLoc(e, locs));
    }
    // Apply UI location filter
    if (currentUser.location === 'all') {
      if (currentLocation === 'all') return emps;
      return emps.filter(e => {
        // Employee's own location matches
        if (empHasLoc(e, currentLocation)) return true;
        // Linked user has access (e.g. Inhaber with location='all')
        const u = USERS.find(u => u.empId === e.id);
        return u && empHasLoc(u, currentLocation);
      });
    }
    return emps.filter(e => empHasLoc(e, currentUser.location));
  }
  return EMPS.filter(e => e.id === currentUser.empId);
}

/** Get vacations visible to current user */
function getVisibleVacs() {
  if (can('seeAllVacations')) {
    let vacs = VACS;
    const locs = currentUser?._allowedLocations;
    if (locs && !locs.includes('all')) {
      vacs = vacs.filter(v => empHasLoc(v, locs));
    }
    if (currentUser.location === 'all') {
      return currentLocation === 'all' ? vacs : vacs.filter(v => empHasLoc(v, currentLocation));
    }
    return vacs.filter(v => empHasLoc(v, currentUser.location));
  }
  return VACS.filter(v => v.empId === currentUser.empId);
}

/** Get sick leaves visible to current user */
function getVisibleSicks() {
  if (can('seeAllSick')) {
    let sicks = SICKS;
    const locs = currentUser?._allowedLocations;
    if (locs && !locs.includes('all')) {
      sicks = sicks.filter(s => empHasLoc(s, locs));
    }
    if (currentUser.location === 'all') {
      return currentLocation === 'all' ? sicks : sicks.filter(s => empHasLoc(s, currentLocation));
    }
    return sicks.filter(s => empHasLoc(s, currentUser.location));
  }
  return SICKS.filter(s => s.empId === currentUser.empId);
}

/** Get shifts visible to current user */
function getVisibleShifts() {
  if (can('seeAllSchedules')) {
    let shifts = SHIFTS;
    const locs = currentUser?._allowedLocations;
    if (locs && !locs.includes('all')) {
      shifts = shifts.filter(s => empHasLoc(s, locs));
    }
    if (currentUser.location === 'all') {
      return currentLocation === 'all' ? shifts : shifts.filter(s => empHasLoc(s, currentLocation));
    }
    return shifts.filter(s => empHasLoc(s, currentUser.location));
  }
  const me = EMPS.find(e => e.id === currentUser.empId);
  if (!me) return [];
  // Stufe 3: nur eigene Schichten (wenn aktiviert)
  if (can('seeOwnSchedule')) {
    return SHIFTS.filter(s => s.empId === currentUser.empId);
  }
  // Stufe 2 (Standard): Schichten des eigenen Bereichs am eigenen Standort
  const myDepts = (me.dept || '').split(',').map(d => d.trim()).filter(Boolean);
  return SHIFTS.filter(s => empHasLoc(s, me.location) && myDepts.some(d => d === 'Alle' || deptMatches(s.dept, d)));
}

/** Get documents visible to current user */
function getVisibleDocs() {
  if (can('seeAllDocs')) {
    const locationFilter = currentUser.location === 'all'
      ? (currentLocation === 'all' ? null : currentLocation)
      : currentUser.location;
    if (!locationFilter) return DOCS;
    return DOCS.filter(d => {
      const emp = EMPS.find(x => x.id === d.empId);
      return emp && empHasLoc(emp, locationFilter);
    });
  }
  return DOCS.filter(d => d.empId === currentUser.empId);
}

/** Get notifications visible to current user */
function getVisibleNotifs() {
  return NOTIFS.filter(n => !n.forRole || n.forRole.includes(currentUser.role));
}

// ═══ GPS Utilities ═══

/**
 * Haversine formula – distance between 2 GPS points in meters
 * @param {number} lat1 - Latitude point 1
 * @param {number} lng1 - Longitude point 1
 * @param {number} lat2 - Latitude point 2
 * @param {number} lng2 - Longitude point 2
 * @returns {number} Distance in meters
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Get current GPS position (returns Promise)
 * @returns {Promise<{lat: number, lng: number, accuracy: number}>}
 */
function getCurrentGPS() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation nicht unterstützt'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      }),
      err => reject(new Error(
        err.code === 1 ? 'Standortzugriff verweigert. Bitte in den Einstellungen erlauben.' :
        err.code === 2 ? 'GPS nicht verfügbar.' :
        'GPS Zeitüberschreitung.'
      )),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/**
 * Find nearest location from GPS coordinates
 * @param {number} lat
 * @param {number} lng
 * @returns {{location: object, distance: number}|null}
 */
function findNearestLocation(lat, lng) {
  let nearest = null;
  let minDist = Infinity;
  LOCS.forEach(loc => {
    if (!loc.lat || !loc.lng) return;
    const dist = haversineDistance(lat, lng, loc.lat, loc.lng);
    if (dist < minDist) { minDist = dist; nearest = loc; }
  });
  return nearest ? { location: nearest, distance: Math.round(minDist) } : null;
}

// ═══ MINIJOB-GRENZE ═══
// 538 € ist die gesetzliche Geringfügigkeitsgrenze (Minijob, seit 2024).
// 43,5 h ist der historische Default (538 € / ~12,32 € Mindestlohn 2024).
// Wenn ein MA einen echten EUR/Std-Satz hat, ist die Stundengrenze
// GERINGER: 538 / hourlyRate. Fallback ohne Satz: 43,5 h.
const MINIJOB_LIMIT_EUR = 538;
const MINIJOB_MAX_H = 43.5; // Fallback, wenn kein EUR/Std-Satz vorhanden

/** Stundengrenze für Minijob-Warnung pro Mitarbeiter (EUR-basiert, falls Satz vorhanden).
 *  @param {object} emp - gemapptes MA-Objekt (hourlyRate optional)
 *  @returns {number} max. Netto-Stunden im Monat */
function minijobMaxHours(emp) {
  if (emp?.hourlyRate && emp.hourlyRate > 0) {
    return Math.floor((MINIJOB_LIMIT_EUR / emp.hourlyRate) * 10) / 10;
  }
  return MINIJOB_MAX_H;
}

// ═══ ZEITERFASSUNG – 15-Minuten-Raster ═══
// Regel: Check-in wird AUFgerundet (↑), Check-out wird ABgerundet (↓).
// Dadurch zählt nur die volle 15-Min-Arbeitszeit (zugunsten des Betriebs).
// Pause: Standardmäßig wird die MA-/Schicht-Pause abgezogen (Netto, wie Plan-Stunden),
//        damit Ist- und Plan-Stunden dieselbe Definition haben (Issue #3).

/** Date auf 15-Min-Raster runden. dir: 'ceil' (Check-in) | 'floor' (Check-out) */
function round15(date, dir) {
  const ms = 15 * 60 * 1000;
  const t = new Date(date).getTime();
  return new Date(dir === 'ceil' ? Math.ceil(t / ms) * ms : Math.floor(t / ms) * ms);
}

/** Gearbeitete Stunden mit 15-Min-Raster (Check-in↑, Check-out↓).
 *  Optionaler pauseMin wird abgezogen (Netto wie Plan-Stunden).
 *  @param {Date|string|number} checkIn
 *  @param {Date|string|number} checkOut
 *  @param {number} [pauseMin] - Pause in Minuten (wird abgezogen, nie <0) */
function workedHours15(checkIn, checkOut, pauseMin) {
  const inR  = round15(checkIn, 'ceil');
  const outR = round15(checkOut, 'floor');
  let h = (outR - inR) / 3600000;
  if (pauseMin && pauseMin > 0) h -= pauseMin / 60;
  return Math.max(0, Math.round(h * 100) / 100);
}
