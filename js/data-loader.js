// ═══════════════════════════════════════════════════════════
// OKYU HRM – Data Loader (Supabase)
// Replaces static data.js with live Supabase queries
// ═══════════════════════════════════════════════════════════

// Global cache: payment status for current month, keyed by emp_id
const PAY_STATUS_CACHE = {};
// Global set: closed months (DATE strings '2025-04-01') locked by Inhaber
const CLOSED_MONTHS = new Set();

/**
 * Load all data from Supabase into global variables.
 * Maps Supabase column names (snake_case) → JS property names (camelCase)
 * Returns true if successful, false if fallback to demo data needed.
 */
async function loadDataFromSupabase() {
  try {
    console.log('[Data] Loading from Supabase...');

    // Load user profiles (USERS array)
    const { data: profiles, error: profErr } = await sb.from('user_profiles').select('*');
    if (profErr) console.warn('[Data] user_profiles:', profErr.message);
    if (profiles && profiles.length > 0) {
      USERS.length = 0;
      profiles.forEach(p => USERS.push({
        id: p.user_id,
        name: p.name,
        role: p.role,
        location: p.location,
        avatar: p.avatar,
        empId: p.emp_id,
        lastLogin: new Date().toLocaleDateString('de-DE'),
        status: p.status || 'active',
        regBirthday: p.reg_birthday || null,
        regDept: p.reg_dept || null,
        regPosition: p.reg_position || null,
        regEmail: p.reg_email || null,
        bannerUrl: p.banner_url || null
      }));
    }

    // Load locations
    const { data: locs, error: locsErr } = await sb.from('locations').select('*');
    if (locsErr) throw new Error('locations: ' + locsErr.message);
    if (locs && locs.length > 0) {
      LOCS.length = 0;
      locs.forEach(l => {
        // Merge GPS coords: prefer DB value, fallback to GPS_COORDS constant
        const gps = GPS_COORDS[l.id] || {};
        const lat = l.lat ?? gps.lat ?? null;
        const lng = l.lng ?? gps.lng ?? null;
        const radius = l.radius_m ?? gps.radius_m ?? 50;
        LOCS.push({ ...l, lat, lng, radius_m: radius });
        // Sync GPS_COORDS object
        if (lat != null && lng != null) {
          GPS_COORDS[l.id] = { lat, lng, radius_m: radius };
        }
        // Sync LOCATION_SCHEDULE from DB
        const dbDayOff = Array.isArray(l.day_off) ? l.day_off : LOCATION_SCHEDULE[l.id]?.dayOff || [];
        const dbHalfDays = Array.isArray(l.half_days) ? l.half_days : LOCATION_SCHEDULE[l.id]?.halfDays || [];
        LOCATION_SCHEDULE[l.id] = { dayOff: dbDayOff, halfDays: dbHalfDays };
      });
    }

    // Load departments
    const { data: depts, error: deptsErr } = await sb.from('departments').select('*');
    if (deptsErr) throw new Error('departments: ' + deptsErr.message);
    if (depts && depts.length > 0) {
      DEPTS.length = 0;
      depts.forEach(d => DEPTS.push(d));
    }

    // Load employees (snake_case → camelCase mapping)
    const { data: emps, error: empsErr } = await sb.from('employees').select('*').order('id');
    if (empsErr) throw new Error('employees: ' + empsErr.message);
    if (emps && emps.length > 0) {
      EMPS.length = 0;
      emps.forEach(e => EMPS.push({
        id: e.id,
        name: escapeHtml(e.name),
        location: e.location,
        dept: escapeHtml(e.dept),
        position: escapeHtml(e.position),
        status: e.status,
        start: e.start_date,
        avatar: escapeHtml(e.avatar),
        vacTotal: e.vac_total,
        vacUsed: e.vac_used,
        sickDays: e.sick_days,
        lateCount: e.late_count,
        sollStunden: e.soll_stunden,
        bruttoGehalt: parseFloat(e.brutto_gehalt) || 0,
        schuleTage: e.schule_tage,
        birthday: e.birthday || '',
        probEnd: e.prob_end || '',
        // Beschäftigung
        employmentType: e.employment_type || 'Vollzeit',
        hourlyRate: parseFloat(e.hourly_rate) || 0,
        weeklyHours: parseFloat(e.weekly_hours) || 0,
        monthlyHours: parseFloat(e.monthly_hours) || 0,
        // Steuer & SV
        taxClass: escapeHtml(e.tax_class || ''),
        taxId: escapeHtml(e.tax_id || ''),
        svNumber: escapeHtml(e.sv_number || ''),
        healthInsurance: escapeHtml(e.health_insurance || ''),
        // Bankdaten
        iban: escapeHtml(e.iban || ''),
        // Persönlich
        nationality: escapeHtml(e.nationality || ''),
        address: escapeHtml(e.address || ''),
        // Aufenthalt
        residencePermit: escapeHtml(e.residence_permit || ''),
        workPermitUntil: e.work_permit_until || '',
        // Zahlung (BAR + Überweisung)
        barGehalt: parseFloat(e.bar_gehalt) || 0,
        nettoGehalt: parseFloat(e.netto_gehalt) || 0,
        bank: e.bank || ''
      }));
    }

    // Load vacations
    const { data: vacs, error: vacsErr } = await sb.from('vacations').select('*').order('id');
    if (vacsErr) throw new Error('vacations: ' + vacsErr.message);
    if (vacs && vacs.length > 0) {
      VACS.length = 0;
      vacs.forEach(v => VACS.push({
        id: v.id,
        empId: v.emp_id,
        empName: escapeHtml(v.emp_name),
        location: v.location,
        from: v.from_date,
        to: v.to_date,
        days: v.days,
        status: v.status,
        note: escapeHtml(v.note || '')
      }));
    }

    // Load sick leaves
    const { data: sicks, error: sicksErr } = await sb.from('sick_leaves').select('*').order('id');
    if (sicksErr) throw new Error('sick_leaves: ' + sicksErr.message);
    if (sicks && sicks.length > 0) {
      SICKS.length = 0;
      sicks.forEach(s => SICKS.push({
        id: s.id,
        empId: s.emp_id,
        empName: escapeHtml(s.emp_name),
        location: s.location,
        from: s.from_date,
        to: s.to_date,
        days: s.days,
        status: s.status,
        hasAU: s.has_au,
        note: escapeHtml(s.note || ''),
        auUrl: s.au_url || null
      }));
    }

    // Load documents
    const { data: docs, error: docsErr } = await sb.from('documents').select('*').order('id');
    if (docsErr) throw new Error('documents: ' + docsErr.message);
    if (docs && docs.length > 0) {
      DOCS.length = 0;
      docs.forEach(d => DOCS.push({
        id: d.id,
        empId: d.emp_id,
        empName: escapeHtml(d.emp_name),
        name: escapeHtml(d.name),
        type: d.type,
        date: d.doc_date,
        icon: d.icon,
        fileUrl: d.file_url || null,
        fileSize: d.file_size || 0,
        fileName: escapeHtml(d.file_name || d.name)
      }));
    }

    // Load shifts (2 weeks around current date)
    const shiftStart = new Date();
    shiftStart.setDate(shiftStart.getDate() - 7);
    const shiftEnd = new Date();
    shiftEnd.setDate(shiftEnd.getDate() + 14);
    const { data: shifts, error: shiftsErr } = await sb.from('shifts')
      .select('*')
      .gte('shift_date', shiftStart.toISOString().split('T')[0])
      .lte('shift_date', shiftEnd.toISOString().split('T')[0])
      .order('shift_date');
    if (shiftsErr) console.warn('[Data] shifts:', shiftsErr.message);
    if (shifts && shifts.length > 0) {
      SHIFTS.length = 0;
      shifts.forEach(s => SHIFTS.push({
        id: s.id,
        empId: s.emp_id,
        empName: s.emp_name,
        dept: s.dept,
        location: s.location,
        date: s.shift_date,
        from: s.shift_from?.substring(0,5) || '09:00',
        to: s.shift_to?.substring(0,5) || '17:00',
        label: s.label || '',
        colorClass: s.label === 'Schule' ? 'schule' : (s.color_class || getDeptColorClass(s.dept)),
        isSick: s.is_sick || false,
        isVacation: s.is_vacation || false,
        isLate: s.is_late || false,
        lateMin: s.late_min || 0,
        vacHalf: s.vac_half || false
      }));
      window._shiftsFromDB = true;
      console.log('[Data] ✓ ' + shifts.length + ' shifts loaded from Supabase');
    } else {
      window._shiftsFromDB = false;
    }

    // Load Azubi data: school schedule
    const { data: schule } = await sb.from('schule_schedule').select('*').order('id');
    if (schule) {
      SCHULE_SCHEDULE.length = 0;
      schule.forEach(s => SCHULE_SCHEDULE.push({
        id: s.id, empId: s.emp_id, wochentag: s.wochentag,
        schule: s.schule, klasse: s.klasse,
        von: s.von, bis: s.bis, aktiv: s.aktiv
      }));
    }

    // Load Azubi data: training logs
    const { data: nachweise } = await sb.from('ausbildungsnachweise').select('*').order('woche_start', { ascending: false });
    if (nachweise) {
      AUSBILDUNGSNACHWEISE.length = 0;
      nachweise.forEach(n => AUSBILDUNGSNACHWEISE.push({
        id: n.id, empId: n.emp_id, empName: n.emp_name,
        wocheStart: n.woche_start, wocheEnd: n.woche_end,
        betriebTaetigkeiten: n.betrieb_taetigkeiten || '',
        schuleThemen: n.schule_themen || '',
        betriebStunden: parseFloat(n.betrieb_stunden) || 0,
        schuleStunden: parseFloat(n.schule_stunden) || 0,
        notizen: n.notizen || '',
        status: n.status,
        ausbilderKommentar: n.ausbilder_kommentar || ''
      }));
    }

    // Load Azubi data: evaluations
    const { data: bewertungen } = await sb.from('azubi_bewertungen').select('*').order('datum', { ascending: false });
    if (bewertungen) {
      AZUBI_BEWERTUNGEN.length = 0;
      bewertungen.forEach(b => AZUBI_BEWERTUNGEN.push({
        id: b.id, empId: b.emp_id, empName: b.emp_name,
        datum: b.datum, bewerter: b.bewerter,
        kategorie: b.kategorie, note: b.note,
        kommentar: b.kommentar || ''
      }));
    }

    // Load time records (today + last 30 days for history)
    const trStart = new Date();
    trStart.setDate(trStart.getDate() - 30);
    const { data: timeRecs, error: trErr } = await sb.from('time_records')
      .select('*')
      .gte('check_in', trStart.toISOString())
      .order('check_in', { ascending: false });
    if (trErr) console.warn('[Data] time_records:', trErr.message);
    if (timeRecs && timeRecs.length > 0) {
      TIME_RECORDS.length = 0;
      timeRecs.forEach(r => TIME_RECORDS.push({
        id: r.id,
        empId: r.emp_id,
        location: r.location,
        checkIn: r.check_in,
        checkOut: r.check_out,
        checkInLat: r.check_in_lat,
        checkInLng: r.check_in_lng,
        checkOutLat: r.check_out_lat,
        checkOutLng: r.check_out_lng,
        distanceM: r.distance_m,
        shiftId: r.shift_id,
        isLate: r.is_late,
        lateMin: r.late_min,
        totalHours: r.total_hours,
        note: r.note,
        method: r.method || 'gps',
        qrLocation: r.qr_location,
        gpsVerified: r.gps_verified,
        gpsSuspicious: r.gps_suspicious
      }));
    }

    // Set activeCheckIn if user has open check-in today
    if (currentUser?.empId) {
      const today = isoDate(new Date());
      activeCheckIn = TIME_RECORDS.find(r =>
        r.empId === currentUser.empId &&
        r.checkIn?.startsWith(today) &&
        !r.checkOut
      ) || null;
    }

    // Load checklists (graceful – table may not exist yet)
    const { data: chkData, error: chkErr } = await sb
      .from('checklists').select('*').order('id');
    if (!chkErr && chkData && chkData.length > 0) {
      CHECKLISTS.length = 0;
      chkData.forEach(c => CHECKLISTS.push({
        id: c.id,
        type: c.type,
        empId: c.emp_id,
        empName: c.emp_name,
        location: c.location,
        items: Array.isArray(c.items) ? c.items : JSON.parse(c.items || '[]')
      }));
    }
    // else: keep static CHECKLISTS from data.js as fallback

    // Load shift templates (graceful – table may not exist yet)
    const { data: tplData, error: tplErr } = await sb
      .from('shift_templates').select('*').order('id');
    if (!tplErr && tplData && tplData.length > 0) {
      SAVED_TEMPLATES.length = 0;
      tplData.forEach(t => SAVED_TEMPLATES.push({
        id: t.id,
        location: t.location,
        name: t.name,
        shifts: Array.isArray(t.shifts) ? t.shifts : JSON.parse(t.shifts || '[]')
      }));
    }
    // else: keep static SAVED_TEMPLATES from data.js as fallback

    console.log(`[Data] ✓ Loaded: ${LOCS.length} locations, ${DEPTS.length} depts, ${EMPS.length} employees, ${VACS.length} vacations, ${SICKS.length} sick leaves, ${DOCS.length} documents, ${CHECKLISTS.length} checklists, ${SAVED_TEMPLATES.length} templates, ${SCHULE_SCHEDULE.length} school days, ${AUSBILDUNGSNACHWEISE.length} training logs, ${AZUBI_BEWERTUNGEN.length} evaluations, ${TIME_RECORDS.length} time records`);

    // Load payment_status for current month (for table display)
    const nowM = new Date();
    const curMonth = nowM.getFullYear() + '-' + String(nowM.getMonth()+1).padStart(2,'0') + '-01';
    const { data: payData } = await sb.from('payment_status')
      .select('*').eq('month', curMonth);
    if (payData) {
      Object.keys(PAY_STATUS_CACHE).forEach(k => delete PAY_STATUS_CACHE[k]);
      payData.forEach(p => { PAY_STATUS_CACHE[p.emp_id] = p; });
    }

    // Load closed_months (safe: table may not exist yet)
    try {
      const { data: closedData, error: closedErr } = await sb.from('closed_months').select('month');
      CLOSED_MONTHS.clear();
      if (!closedErr && closedData) closedData.forEach(r => CLOSED_MONTHS.add(r.month));
    } catch(_) { /* table not yet created – ignore */ }

    // Run auto-checkout after data load
    await runAutoCheckout();

    return true;

  } catch (err) {
    console.warn('[Data] ⚠️ Supabase load failed:', err.message);
    console.log('[Data] Using demo data from data.js');
    return false;
  }
}

// ═══ AUTO-CHECKOUT (30 min after shift end) ═══
const AUTO_CHECKOUT_BUFFER = 30; // minutes

async function runAutoCheckout() {
  const today = isoDate(new Date());
  const now = new Date();

  // Find open time_records (check_in today, no check_out)
  const openRecords = TIME_RECORDS.filter(r => r.checkIn?.startsWith(today) && !r.checkOut);
  if (openRecords.length === 0) return;

  // Find matching shifts
  const todayShifts = SHIFTS.filter(s => s.date === today);
  if (todayShifts.length === 0) return;

  let autoCount = 0;
  for (const rec of openRecords) {
    const shift = todayShifts.find(s => s.empId === rec.empId);
    if (!shift || !shift.to) continue;

    // Parse shift end
    const [endH, endM] = shift.to.split(':').map(Number);
    const shiftEnd = new Date(today + 'T00:00:00');
    shiftEnd.setHours(endH, endM, 0, 0);

    // 30 min buffer
    const deadline = new Date(shiftEnd.getTime() + AUTO_CHECKOUT_BUFFER * 60000);

    if (now >= deadline) {
      const checkOutTime = shiftEnd.toISOString();
      const totalHours = ((shiftEnd - new Date(rec.checkIn)) / 3600000).toFixed(2);

      const { error } = await sb.from('time_records').update({
        check_out: checkOutTime,
        total_hours: parseFloat(totalHours)
      }).eq('id', rec.id);

      if (!error) {
        rec.checkOut = checkOutTime;
        rec.totalHours = parseFloat(totalHours);
        autoCount++;
      }
    }
  }

  if (autoCount > 0) {
    console.log(`[Auto-Checkout] ✓ ${autoCount} Mitarbeiter automatisch ausgecheckt`);
  }
}

