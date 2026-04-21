// ═══════════════════════════════════════════════════════════
// OKYU HRM – Utility Functions
// ═══════════════════════════════════════════════════════════

/** Escape HTML to prevent XSS */
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/** Format Date to ISO string YYYY-MM-DD */
function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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

/** Get location name by ID */
function getLocationName(locationId) {
  return LOCS.find(l => l.id === locationId)?.name || locationId;
}

/** Map department name to CSS class */
function getDeptColorClass(deptName) {
  return { Küche: 'kitchen', Service: 'service', Bar: 'bar', Ausbildung: 'azubi' }[deptName] || '';
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

/** Calculate planned hours for an employee (current month) */
function calcPlanHours(employeeId) {
  const now = new Date(); // BUG FIX: was hardcoded
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthShifts = SHIFTS.filter(s => s.empId === employeeId && !s.isSick && !s.isVacation);
  let total = 0;
  monthShifts.forEach(shift => {
    const shiftDate = new Date(shift.date);
    if (shiftDate.getFullYear() === year && shiftDate.getMonth() === month) {
      const [fromHour, fromMin] = shift.from.split(':').map(Number);
      const [toHour, toMin] = shift.to.split(':').map(Number);
      total += (toHour + toMin / 60) - (fromHour + fromMin / 60);
    }
  });
  return Math.round(total * 10) / 10;
}

/** Calculate hourly rate from monthly salary */
function calcHourly(employee) {
  if (!employee.sollStunden || employee.sollStunden === 0) return 0;
  return Math.round(employee.bruttoGehalt / employee.sollStunden * 100) / 100;
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
      return currentLocation === 'all' ? emps : emps.filter(e => empHasLoc(e, currentLocation));
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
  const myDepts = (me.dept || '').split(',').map(d => d.trim()).filter(Boolean);
  return SHIFTS.filter(s => empHasLoc(s, me.location) && myDepts.some(d => d === 'Alle' || d === s.dept));
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
