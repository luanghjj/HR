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

    // Lite-Load: normale Mitarbeiter/Azubi laden NICHT die admin-/finanzlastigen
    // Tabellen (gehaelter, payment_status, employee_submissions, closed_months,
    // checklists, shift_templates). Azubi behält die Ausbildungstabellen.
    const _role = currentUser?.role;
    const liteLoad = !!currentUser && _role !== 'inhaber' && _role !== 'manager'
      && !(typeof can === 'function' && can('seeAllEmployees'));
    const isAzubi = _role === 'azubi';

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
        authUserId: p.auth_user_id || null,
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
        pauseMinutes: e.pause_minutes ?? 30,
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
        // Steuerberater fields (split name + address)
        firstName: escapeHtml(e.first_name || ''),
        lastName: escapeHtml(e.last_name || ''),
        street: escapeHtml(e.street || ''),
        zip: escapeHtml(e.zip || ''),
        city: escapeHtml(e.city || ''),
        // Aufenthalt
        residencePermit: escapeHtml(e.residence_permit || ''),
        workPermitUntil: e.work_permit_until || '',
        // Zahlung (BAR + Überweisung)
        barGehalt: parseFloat(e.bar_gehalt) || 0,
        nettoGehalt: parseFloat(e.netto_gehalt) || 0,
        gesBrutto: parseFloat(e.ges_brutto) || 0,
        actualNetto: parseFloat(e.netto) || 0,
        zielGehalt: parseFloat(e.ziel_gehalt) || 0,
        bank: e.bank || '',
        personalNr: escapeHtml(e.personal_nr || '')
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

    // Load shifts: gesamter aktueller Monat + 14 Tage Vorschau (vorher nur ±7/+14,
    // dadurch fehlten Schichten am Monatsanfang in "Stunden diesen Monat", Reports etc.).
    const now = new Date();
    const shiftStart = new Date(now.getFullYear(), now.getMonth(), 1); // 1. des aktuellen Monats
    shiftStart.setDate(shiftStart.getDate() - 7);                      // kleine Rückkehr-Puffer
    const shiftEnd = new Date();
    shiftEnd.setDate(shiftEnd.getDate() + 14);
    const { data: shifts, error: shiftsErr } = await sb.from('shifts')
      .select('*')
      .gte('shift_date', isoDate(shiftStart))
      .lte('shift_date', isoDate(shiftEnd))
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
        vacHalf: s.vac_half || false,
        pauseMinutes: (s.pause_minutes ?? null)   // null = MA-Default verwenden
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
        datum: s.datum || null,
        schule: s.schule, klasse: s.klasse,
        von: s.von, bis: s.bis, aktiv: s.aktiv
      }));
    }

    // Load Azubi data: training logs (nur Azubi/Admin)
    if (!liteLoad || isAzubi) {
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
    } // end Azubi-Daten

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

    // Set activeCheckIn if user has open check-in today (TZ-safe via Europe/Berlin)
    if (currentUser?.empId) {
      const today = isoDateBerlin(new Date());
      activeCheckIn = TIME_RECORDS.find(r =>
        r.empId === currentUser.empId &&
        isoDateBerlin(r.checkIn) === today &&
        !r.checkOut
      ) || null;
    }

    // Load checklists (graceful – table may not exist yet); nur Admin
    if (!liteLoad) {
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
    } // end Admin-only (checklists, templates)


    console.log(`[Data] ✓ Loaded: ${LOCS.length} locations, ${DEPTS.length} depts, ${EMPS.length} employees, ${VACS.length} vacations, ${SICKS.length} sick leaves, ${DOCS.length} documents, ${CHECKLISTS.length} checklists, ${SAVED_TEMPLATES.length} templates, ${SCHULE_SCHEDULE.length} school days, ${AUSBILDUNGSNACHWEISE.length} training logs, ${AZUBI_BEWERTUNGEN.length} evaluations, ${TIME_RECORDS.length} time records`);

    // Finanz-/Admin-Tabellen: nur für Admin/Manager laden
    if (!liteLoad) {
    // Load payment_status for current month (for table display)
    const nowM = new Date();
    const curMonth = nowM.getFullYear() + '-' + String(nowM.getMonth()+1).padStart(2,'0') + '-01';
    const { data: payData } = await sb.from('payment_status')
      .select('*').eq('month', curMonth);
    if (payData) {
      Object.keys(PAY_STATUS_CACHE).forEach(k => delete PAY_STATUS_CACHE[k]);
      payData.forEach(p => { PAY_STATUS_CACHE[p.emp_id] = p; });
    }

    // Load ziel_gehalt + notiz from gehaelter for current month
    const curMonatLabel = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][nowM.getMonth()] + ' ' + nowM.getFullYear();
    try {
      const { data: ghData } = await sb.from('gehaelter')
        .select('emp_id,ziel_gehalt,notiz').eq('monat', curMonatLabel);
      if (ghData) {
        ghData.forEach(g => {
          if (!PAY_STATUS_CACHE[g.emp_id]) PAY_STATUS_CACHE[g.emp_id] = {};
          PAY_STATUS_CACHE[g.emp_id].ziel_gehalt = parseFloat(g.ziel_gehalt) || 0;
          if (g.notiz) PAY_STATUS_CACHE[g.emp_id].gh_notiz = g.notiz;
        });
      }
    } catch(_) { /* gehaelter table may not exist */ }

    // Load closed_months (safe: table may not exist yet)
    try {
      const { data: closedData, error: closedErr } = await sb.from('closed_months').select('month');
      CLOSED_MONTHS.clear();
      if (!closedErr && closedData) closedData.forEach(r => CLOSED_MONTHS.add(r.month));
    } catch(_) { /* table not yet created – ignore */ }
    } // end Finanz-/Admin-Tabellen


    // Load Aushilfe slots (3 months history + 3 months future)
    const aushilfeStart = new Date();
    aushilfeStart.setMonth(aushilfeStart.getMonth() - 3); // 3 Monate zurück (Verlauf)
    aushilfeStart.setDate(1);
    const aushilfeEnd = new Date();
    aushilfeEnd.setMonth(aushilfeEnd.getMonth() + 3);
    try {
      const { data: slots, error: slotsErr } = await sb.from('aushilfe_slots')
        .select('*')
        .gte('slot_date', aushilfeStart.toISOString().split('T')[0])
        .lte('slot_date', aushilfeEnd.toISOString().split('T')[0])
        .order('slot_date');
      if (!slotsErr && slots) {
        AUSHILFE_SLOTS.length = 0;
        slots.forEach(s => AUSHILFE_SLOTS.push({
          id: s.id,
          location: s.location,
          date: s.slot_date,
          shiftLabel: s.shift_label,
          shiftFrom: s.shift_from,
          shiftTo: s.shift_to,
          dept: s.dept,
          note: s.note || '',
          status: s.status,
          aushilfeName: s.aushilfe_name || '',
          aushilfePhone: s.aushilfe_phone || '',
          aushilfeEmail: s.aushilfe_email || '',
          aushilfeNote: s.aushilfe_note || '',
          createdAt: s.created_at
        }));
        console.log('[Data] ✓ ' + AUSHILFE_SLOTS.length + ' Aushilfe slots loaded');
      }
    } catch (_) { /* table may not exist yet */ }

    // Load Aushilfe settings (max shifts per week)
    try {
      const { data: settings } = await sb.from('aushilfe_settings').select('*').single();
      if (settings) {
        AUSHILFE_MAX_SHIFTS_PER_WEEK = settings.max_shifts_per_week || 1;
        console.log('[Data] ✓ Aushilfe max shifts/week:', AUSHILFE_MAX_SHIFTS_PER_WEEK);
      }
    } catch (_) { /* table may not exist yet, use default 1 */ }

    // Load Verfügbarkeit (Nicht verfügbar) – aktueller + nächste 3 Monate
    try {
      const avStart = new Date(); avStart.setDate(1);
      const avEnd = new Date(); avEnd.setMonth(avEnd.getMonth() + 3);
      const { data: avs, error: avErr } = await sb.from('availability')
        .select('*')
        .gte('date', avStart.toISOString().split('T')[0])
        .lte('date', avEnd.toISOString().split('T')[0]);
      if (!avErr && avs) {
        AVAILABILITY.length = 0;
        avs.forEach(a => AVAILABILITY.push({
          id: a.id, empId: a.emp_id, empName: a.emp_name || '',
          location: a.location || '', date: a.date, reason: a.reason || ''
        }));
        console.log('[Data] ✓ ' + AVAILABILITY.length + ' Verfügbarkeits-Einträge geladen');
      }
    } catch (_) { /* table may not exist yet */ }

    // Load Schichtvorschläge (Minijob-Angebote) – aktueller + nächste 3 Monate
    try {
      const spStart = new Date(); spStart.setDate(1);
      const spEnd = new Date(); spEnd.setMonth(spEnd.getMonth() + 3);
      const { data: props, error: spErr } = await sb.from('shift_proposals')
        .select('*')
        .gte('prop_date', spStart.toISOString().split('T')[0])
        .lte('prop_date', spEnd.toISOString().split('T')[0])
        .order('prop_date');
      if (!spErr && props) {
        SHIFT_PROPOSALS.length = 0;
        props
          // Abgelehnte Vorschläge werden wie gelöscht behandelt → nicht laden.
          // (Alt-Datensätze aus DB verschwinden dadurch aus Plan & Admin-Liste.)
          .filter(p => p.status !== 'rejected')
          .forEach(p => SHIFT_PROPOSALS.push({
            id: p.id, empId: p.emp_id, empName: escapeHtml(p.emp_name || ''),
            location: p.location || '', dept: p.dept || '',
            date: p.prop_date, shiftLabel: p.shift_label || '',
            from: p.shift_from, to: p.shift_to,
            status: p.status, note: escapeHtml(p.note || ''),
            decidedBy: p.decided_by || '', decidedAt: p.decided_at || null,
            createdAt: p.created_at
          }));
        console.log('[Data] ✓ ' + SHIFT_PROPOSALS.length + ' Schichtvorschläge geladen');
      }
    } catch (_) { /* table may not exist yet */ }

    // Load Mitteilungen / Announcements (aktive)
    try {
      const { data: anns, error: annErr } = await sb.from('announcements')
        .select('*').eq('active', true).order('created_at', { ascending: false });
      if (!annErr && anns) {
        ANNOUNCEMENTS.length = 0;
        anns.forEach(a => ANNOUNCEMENTS.push({
          id: a.id, title: a.title || '', message: a.message || '',
          location: a.location || null, createdBy: a.created_by || '',
          createdAt: a.created_at,
          attachmentUrl: a.attachment_url || null, attachmentName: a.attachment_name || null,
          priority: a.priority || 'normal',
          mandatory: a.mandatory || false
        }));
        console.log('[Data] ✓ ' + ANNOUNCEMENTS.length + ' Mitteilungen geladen');
      }
    } catch (_) { /* table may not exist yet */ }

    // Load Lesebestätigungen für Pflicht-Mitteilungen
    try {
      const { data: reads, error: rErr } = await sb.from('announcement_reads').select('*');
      if (!rErr && reads) {
        ANNOUNCEMENT_READS.length = 0;
        reads.forEach(r => ANNOUNCEMENT_READS.push({
          announcementId: r.announcement_id, userId: r.user_id,
          empId: r.emp_id, name: r.name || '', readAt: r.read_at
        }));
        console.log('[Data] ✓ ' + ANNOUNCEMENT_READS.length + ' Lesebestätigungen geladen');
      }
    } catch (_) { /* table may not exist yet */ }

    // Load employee_submissions (Aushilfe worker list for admin view); nur Admin
    if (!liteLoad) {
    try {
      const { data: subs, error: subsErr } = await sb.from('employee_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!subsErr && subs) {
        AUSHILFE_SUBMISSIONS.length = 0;
        subs.forEach(s => AUSHILFE_SUBMISSIONS.push({
          id:               s.id,
          vorname:          s.vorname,
          familienname:     s.familienname,
          telefon:          s.telefon,
          email:            s.email,
          iban:             s.iban,
          steuerklasse:     s.steuerklasse,
          steuer_id:        s.steuer_id,
          sv_nummer:        s.sv_nummer,
          krankenversicherung: s.krankenversicherung,
          geburtstag:       s.geburtstag,
          geburtsort:       s.geburtsort || '',
          nationalitaet:    s.nationalitaet,
          tshirt_groesse:   s.tshirt_groesse,
          adresse:          s.adresse,
          status:           s.status || 'neu',
          createdAt:        s.created_at
        }));
        console.log('[Data] ✓ ' + AUSHILFE_SUBMISSIONS.length + ' Aushilfe submissions loaded');
      }
    } catch (_) { /* employee_submissions may not exist */ }
    } // end Admin-only (employee_submissions)



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
const STALE_CHECKIN_MAX_H = 24;  // offener Check-in älter als 24h → automatisch schließen

async function runAutoCheckout() {
  const today = isoDateBerlin(new Date());
  const now = new Date();

  // 1) Verwaiste offene Check-ins schließen (gestern vergessen auszustempeln o.ä.).
  //    Ein offener Check-in älter als 24h würde sonst die Stunden über zwei Tage ziehen.
  const stale = TIME_RECORDS.filter(r => !r.checkOut && r.checkIn &&
    (now - new Date(r.checkIn)) / 3600000 > STALE_CHECKIN_MAX_H);
  for (const rec of stale) {
    const staleOut = new Date(new Date(rec.checkIn).getTime() + STALE_CHECKIN_MAX_H * 3600000);
    const pauseMin = pauseForRecord(rec.empId, rec.shiftId);
    const th = workedHours15(rec.checkIn, staleOut, pauseMin);
    const outIso = staleOut.toISOString();
    const { error } = await sb.from('time_records').update({
      check_out: outIso, total_hours: parseFloat(th)
    }).eq('id', rec.id);
    if (!error) { rec.checkOut = outIso; rec.totalHours = parseFloat(th); console.log('[Auto-Checkout] verwaister Check-in geschlossen:', rec.id); }
  }

  // 2) Find open time_records (check_in today in Berlin, no check_out)
  const openRecords = TIME_RECORDS.filter(r => !r.checkOut && isoDateBerlin(r.checkIn) === today);
  if (openRecords.length === 0) return;

  // Find matching shifts
  const todayShifts = SHIFTS.filter(s => s.date === today);
  if (todayShifts.length === 0) return;

  let autoCount = 0;
  for (const rec of openRecords) {
    // Vorzug: exakte Schicht über rec.shiftId; sonst Schicht des MAs, die am
    // nächsten am Check-in-Zeitpunkt beginnt (bei mehreren Schichten/Tag, Issue #4).
    let shift = rec.shiftId != null ? todayShifts.find(s => s.id === rec.shiftId) : null;
    if (!shift) {
      const ciMs = new Date(rec.checkIn).getTime();
      shift = todayShifts
        .filter(s => s.empId === rec.empId)
        .sort((a, b) => Math.abs(_shiftStartMs(a, today) - ciMs) - Math.abs(_shiftStartMs(b, today) - ciMs))[0];
    }
    if (!shift || !shift.to) continue;

    // Parse shift end als absoluten Epoch-Wert im Berliner Wanduhr-System (TZ-sicher,
    // funktioniert auch auf Nicht-Berlin-Browsern). Ca-Ende kann am Folgetag liegen.
    const [endH, endM] = shift.to.split(':').map(Number);
    const [stH, stM] = (shift.from || '00:00').split(':').map(Number);
    const overnight = endH < stH || (endH === stH && endM < stM);
    let shiftEndMs = berlinWallMs(today, shift.to);
    if (overnight) shiftEndMs += 24 * 3600000; // über Mitternacht → Folgetag
    const shiftEnd = new Date(shiftEndMs);

    // 30 min buffer
    const deadline = new Date(shiftEnd.getTime() + AUTO_CHECKOUT_BUFFER * 60000);

    if (now >= deadline) {
      const checkOutTime = shiftEnd.toISOString();
      const pauseMin = shift.pauseMinutes != null ? shift.pauseMinutes
        : (EMPS.find(e => e.id === rec.empId)?.pauseMinutes ?? 30);
      const totalHours = workedHours15(rec.checkIn, shiftEnd, pauseMin);

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

/** Millisekunden des Schicht-Beginns (Berliner Wanduhr, TZ-sicher) für Auto-Checkout-Sortierung. */
function _shiftStartMs(shift, dateStr) {
  return berlinWallMs(dateStr, shift.from || '00:00');
}

