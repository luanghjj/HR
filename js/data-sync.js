// ═══════════════════════════════════════════════════════════
// OKYU HRM – Data Sync (Write to Supabase)
// Syncs local changes back to Supabase database
// ═══════════════════════════════════════════════════════════

/**
 * Save employee changes to Supabase
 */
async function syncEmployee(emp) {
  try {
    const { error } = await sb.from('employees').update({
      name: emp.name,
      location: emp.location,
      dept: emp.dept,
      position: emp.position,
      status: emp.status,
      start_date: emp.start,
      avatar: emp.avatar,
      vac_total: emp.vacTotal,
      vac_used: emp.vacUsed,
      sick_days: emp.sickDays,
      late_count: emp.lateCount,
      soll_stunden: emp.sollStunden,
      brutto_gehalt: emp.bruttoGehalt,
      schule_tage: emp.schuleTage,
      employment_type: emp.employmentType || 'Vollzeit',
      birthday: emp.birthday || null,
      prob_end: emp.probEnd || null
    }).eq('id', emp.id);
    if (error) console.warn('[Sync] Employee error:', error.message);
    else console.log('[Sync] ✓ Employee updated:', emp.name);
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Add new employee to Supabase
 */
async function syncAddEmployee(emp) {
  try {
    const { data, error } = await sb.from('employees').insert({
      name: emp.name,
      location: emp.location,
      dept: emp.dept,
      position: emp.position,
      status: emp.status,
      start_date: emp.start,
      avatar: emp.avatar,
      vac_total: emp.vacTotal,
      vac_used: emp.vacUsed || 0,
      sick_days: emp.sickDays || 0,
      late_count: emp.lateCount || 0,
      soll_stunden: emp.sollStunden || 160,
      brutto_gehalt: emp.bruttoGehalt || 0,
      schule_tage: emp.schuleTage || 0,
      birthday: emp.birthday || null,
      prob_end: emp.probEnd || null
    }).select().single();
    if (error) console.warn('[Sync] Add employee error:', error.message);
    else { emp.id = data.id; console.log('[Sync] ✓ Employee added:', emp.name, '→ id', data.id); }
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Add new vacation to Supabase
 */
async function syncAddVacation(vac) {
  try {
    const { data, error } = await sb.from('vacations').insert({
      emp_id: vac.empId,
      emp_name: vac.empName,
      location: vac.location,
      from_date: vac.from,
      to_date: vac.to,
      days: vac.days,
      status: vac.status,
      note: vac.note || ''
    }).select().single();
    if (error) console.warn('[Sync] Vacation error:', error.message);
    else { vac.id = data.id; console.log('[Sync] ✓ Vacation added:', vac.empName); }
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Update vacation status in Supabase
 */
async function syncVacationStatus(vacId, status) {
  try {
    const { error } = await sb.from('vacations').update({ status }).eq('id', vacId);
    if (error) { console.warn('[Sync] Vacation status error:', error.message); return false; }
    console.log('[Sync] ✓ Vacation', vacId, '→', status);
    return true;
  } catch (e) { console.warn('[Sync]', e.message); return false; }
}

/**
 * Add new sick leave to Supabase
 */
async function syncAddSick(sick) {
  try {
    const { data, error } = await sb.from('sick_leaves').insert({
      emp_id: sick.empId,
      emp_name: sick.empName,
      location: sick.location,
      from_date: sick.from,
      to_date: sick.to,
      days: sick.days,
      status: sick.status,
      has_au: sick.hasAU || false,
      note: sick.note || '',
      au_url: sick.auUrl || null
    }).select().single();
    if (error) console.warn('[Sync] Sick error:', error.message);
    else { sick.id = data.id; console.log('[Sync] ✓ Sick leave added:', sick.empName); }
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Update employee sick days / late count in Supabase (quick field update)
 */
async function syncEmployeeField(empId, field, value) {
  try {
    const colMap = {
      sickDays: 'sick_days', lateCount: 'late_count', vacUsed: 'vac_used',
      vacTotal: 'vac_total', status: 'status', dept: 'dept', position: 'position',
      name: 'name', location: 'location', avatar: 'avatar',
      sollStunden: 'soll_stunden', bruttoGehalt: 'brutto_gehalt',
      schuleTage: 'schule_tage', birthday: 'birthday', probEnd: 'prob_end',
      start: 'start_date',
      // New detail fields
      employmentType: 'employment_type', hourlyRate: 'hourly_rate',
      weeklyHours: 'weekly_hours', monthlyHours: 'monthly_hours',
      pauseMinutes: 'pause_minutes',
      taxClass: 'tax_class', taxId: 'tax_id', svNumber: 'sv_number',
      healthInsurance: 'health_insurance', iban: 'iban',
      nationality: 'nationality', address: 'address',
      firstName: 'first_name', lastName: 'last_name',
      street: 'street', zip: 'zip', city: 'city',
      residencePermit: 'residence_permit', workPermitUntil: 'work_permit_until',
      barGehalt: 'bar_gehalt', nettoGehalt: 'netto_gehalt',
      personalNr: 'personal_nr'
    };
    const col = colMap[field] || field;
    const { error } = await sb.from('employees').update({ [col]: value }).eq('id', empId);
    if (error) { console.warn('[Sync] Field error:', error.message); return false; }
    console.log('[Sync] ✓', field, '=', value, 'for emp', empId);
    return true;
  } catch (e) { console.warn('[Sync]', e.message); return false; }
}

/**
 * Save a salary change to salary_history in Supabase
 */
async function syncSalaryHistory(empId, oldBrutto, newBrutto, oldBar, newBar, note) {
  try {
    const changedBy = currentUser?.name || currentUser?.email || 'Unbekannt';
    const payload = {
      emp_id: empId,
      old_brutto: parseFloat(oldBrutto) || 0,
      new_brutto: parseFloat(newBrutto) || 0,
      old_bar:    parseFloat(oldBar)    || 0,
      new_bar:    parseFloat(newBar)    || 0,
      note: note || '',
      changed_by: changedBy
    };
    console.log('[Sync] Inserting salary_history:', JSON.stringify(payload));
    const { error } = await sb.from('salary_history').insert(payload);
    if (error) {
      console.warn('[Sync] SalaryHistory error:', error.message);
      if (typeof toast === 'function') toast('⚠️ Gehaltshistorie Fehler: ' + error.message, 'danger');
      return false;
    }
    console.log('[Sync] ✓ Salary history saved');
    return true;
  } catch (e) {
    console.warn('[Sync] SalaryHistory exception:', e.message);
    if (typeof toast === 'function') toast('⚠️ Gehaltshistorie: ' + e.message, 'danger');
    return false;
  }
}

/**
 * Load salary history for an employee from Supabase
 * @param {number} empId
 * @param {number|null} monthsLimit - if set, only load entries from last N months
 */
async function loadSalaryHistory(empId, monthsLimit) {
  try {
    let query = sb.from('salary_history')
      .select('*').eq('emp_id', empId).order('changed_at', { ascending: false });

    // Limit by date if monthsLimit is set (Manager: 3 months)
    if (monthsLimit) {
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - monthsLimit);
      query = query.gte('changed_at', cutoff.toISOString());
    }

    const { data, error } = await query;
    if (error) { console.warn('[Sync] SalaryHistory load error:', error.message); return []; }
    return data || [];
  } catch (e) { console.warn('[Sync]', e.message); return []; }
}

/**
 * Load payment status for an employee + month from Supabase
 * @param {number} empId
 * @param {string} monthStr - 'YYYY-MM' e.g. '2025-05'
 */
async function loadPaymentStatus(empId, monthStr) {
  try {
    const monthDate = monthStr + '-01';
    const { data, error } = await sb.from('payment_status')
      .select('*').eq('emp_id', empId).eq('month', monthDate).maybeSingle();
    if (error) { console.warn('[Sync] PayStatus load:', error.message); return null; }
    return data;
  } catch (e) { console.warn('[Sync]', e.message); return null; }
}

/**
 * Upsert payment status for an employee + month
 * @param {number} empId
 * @param {string} monthStr - 'YYYY-MM'
 * @param {string} barStatus - 'bezahlt' | 'ausstehend'
 * @param {string} uebStatus - 'bezahlt' | 'ausstehend'
 * @param {string} [barComment] - optional comment for BAR payment
 */
async function syncPaymentStatus(empId, monthStr, barStatus, uebStatus, barComment) {
  try {
    const monthDate = monthStr + '-01';
    const updatedBy = currentUser?.name || currentUser?.email || 'Unbekannt';
    const payload = {
      emp_id: empId,
      month: monthDate,
      bar_status: barStatus,
      ueb_status: uebStatus,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy
    };
    if (barComment !== undefined) payload.bar_comment = barComment;
    const { error } = await sb.from('payment_status').upsert(payload, { onConflict: 'emp_id,month' });
    if (error) console.warn('[Sync] PayStatus save:', error.message);
    else console.log('[Sync] ✓ PayStatus saved:', empId, monthStr);
  } catch (e) { console.warn('[Sync]', e.message); }
}

// ── Month Lock (Inhaber only) ──────────────────────────────────
function isMonthClosed(monthStr) {
  return CLOSED_MONTHS.has(monthStr + '-01');
}

async function closeMonth(monthStr) {
  const monthDate = monthStr + '-01';
  const closedBy = currentUser?.name || currentUser?.email || 'Inhaber';
  try {
    const { error } = await sb.from('closed_months').upsert(
      { month: monthDate, closed_by: closedBy, closed_at: new Date().toISOString() },
      { onConflict: 'month' }
    );
    if (error) { console.warn('[Sync] closeMonth:', error.message); return false; }
    CLOSED_MONTHS.add(monthDate);
    return true;
  } catch (e) { console.warn('[Sync]', e.message); return false; }
}

async function openMonth(monthStr) {
  const monthDate = monthStr + '-01';
  try {
    const { error } = await sb.from('closed_months').delete().eq('month', monthDate);
    if (error) { console.warn('[Sync] openMonth:', error.message); return false; }
    CLOSED_MONTHS.delete(monthDate);
    return true;
  } catch (e) { console.warn('[Sync]', e.message); return false; }
}

/**
 * Save actual BAR Betrag + Comment for a specific month
 * @param {number} empId
 * @param {string} monthStr - 'YYYY-MM'
 * @param {number|null} barBetrag - actual amount paid (null = use bar_gehalt)
 * @param {string} barComment - free text comment
 */
async function saveBarBetrag(empId, monthStr, barBetrag, barComment) {
  try {
    const monthDate = monthStr + '-01';
    const updatedBy = currentUser?.name || currentUser?.email || 'Unbekannt';
    const ps = PAY_STATUS_CACHE[empId] || {};
    const { error } = await sb.from('payment_status').upsert({
      emp_id: empId,
      month: monthDate,
      bar_status: ps.bar_status || 'ausstehend',
      ueb_status: ps.ueb_status || 'ausstehend',
      bar_betrag: barBetrag,
      bar_comment: barComment,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy
    }, { onConflict: 'emp_id,month' });
    if (error) console.warn('[Sync] saveBarBetrag:', error.message);
    else {
      PAY_STATUS_CACHE[empId] = { ...ps, bar_betrag: barBetrag, bar_comment: barComment };
      console.log('[Sync] ✓ bar_betrag saved', empId, barBetrag, barComment);
    }
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Save Ü-Datum or BAR-Datum for a specific month
 * @param {number} empId
 * @param {string} monthStr - 'YYYY-MM'
 * @param {'ueb'|'bar'} type
 * @param {string} dateVal - 'YYYY-MM-DD' or ''
 */
async function savePayDatum(empId, monthStr, type, dateVal) {
  try {
    const monthDate = monthStr + '-01';
    const updatedBy = currentUser?.name || currentUser?.email || 'Unbekannt';
    const ps = PAY_STATUS_CACHE[empId] || {};
    const field = type === 'ueb' ? 'ue_datum' : 'bar_datum';
    const { error } = await sb.from('payment_status').upsert({
      emp_id: empId,
      month: monthDate,
      bar_status: ps.bar_status || 'ausstehend',
      ueb_status: ps.ueb_status || 'ausstehend',
      [field]: dateVal || null,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy
    }, { onConflict: 'emp_id,month' });
    if (error) console.warn('[Sync] savePayDatum:', error.message);
    else {
      PAY_STATUS_CACHE[empId] = { ...ps, [field]: dateVal };
      toast(`✓ ${type === 'ueb' ? 'Ü' : 'BAR'}-Datum: ${dateVal || '—'}`);
    }
  } catch (e) { console.warn('[Sync]', e.message); }
}


async function syncNachweis(n) {
  try {
    if (n.id && typeof n.id === 'number') {
      await sb.from('ausbildungsnachweise').update({
        betrieb_taetigkeiten: n.betriebTaetigkeiten,
        schule_themen: n.schuleThemen,
        betrieb_stunden: n.betriebStunden,
        schule_stunden: n.schuleStunden,
        notizen: n.notizen,
        status: n.status,
        ausbilder_kommentar: n.ausbilderKommentar,
        updated_at: new Date().toISOString()
      }).eq('id', n.id);
    }
    console.log('[Sync] ✓ Nachweis updated');
  } catch (e) { console.warn('[Sync]', e.message); }
}

// ═══ BERUFSSCHULE (schule_schedule CRUD) ═══
/** Neuen Schultag in Supabase anlegen; setzt row.id aus dem Ergebnis. */
async function syncAddSchule(row) {
  try {
    const { data, error } = await sb.from('schule_schedule').insert({
      emp_id:    row.empId,
      wochentag: row.wochentag || null,
      datum:     row.datum || null,
      schule:    row.schule || 'Berufsschule',
      klasse:    row.klasse || '',
      von:       row.von || '08:00',
      bis:       row.bis || '15:00',
      aktiv:     row.aktiv !== false
    }).select().single();
    if (error) { console.warn('[Sync] Add Schule error:', error.message); return; }
    row.id = data.id;
    console.log('[Sync] ✓ Schultag added:', row.datum || row.wochentag, 'for emp', row.empId);
  } catch (e) { console.warn('[Sync]', e.message); }
}

/** Bestehenden Schultag aktualisieren (per id). */
async function syncUpdateSchule(row) {
  try {
    if (!row.id || typeof row.id !== 'number') return;
    const { error } = await sb.from('schule_schedule').update({
      wochentag: row.wochentag || null,
      datum:     row.datum || null,
      schule:    row.schule || 'Berufsschule',
      klasse:    row.klasse || '',
      von:       row.von || '08:00',
      bis:       row.bis || '15:00',
      aktiv:     row.aktiv !== false
    }).eq('id', row.id);
    if (error) console.warn('[Sync] Update Schule error:', error.message);
    else console.log('[Sync] ✓ Schultag updated:', row.id);
  } catch (e) { console.warn('[Sync]', e.message); }
}

/** Schultag löschen (per id). */
async function syncDeleteSchule(id) {
  try {
    if (!id || typeof id !== 'number') return;
    const { error } = await sb.from('schule_schedule').delete().eq('id', id);
    if (error) console.warn('[Sync] Delete Schule error:', error.message);
    else console.log('[Sync] ✓ Schultag deleted:', id);
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Add a single shift to Supabase
 */
async function syncAddShift(shift) {
  try {
    const payload = {
      emp_id: shift.empId,
      emp_name: shift.empName,
      dept: shift.dept,
      location: shift.location,
      shift_date: shift.date,
      shift_from: shift.from,
      shift_to: shift.to,
      label: shift.label || '',
      color_class: shift.colorClass || '',
      is_sick: shift.isSick || false,
      is_vacation: shift.isVacation || false,
      is_late: shift.isLate || false,
      late_min: shift.lateMin || 0,
      vac_half: shift.vacHalf || false
    };
    // Nur mitschicken, wenn eine eigene Pause gesetzt ist (sonst kein Bruch,
    // falls die Spalte noch nicht existiert – MA-Default gilt).
    if (shift.pauseMinutes != null) payload.pause_minutes = shift.pauseMinutes;
    const { data, error } = await sb.from('shifts').insert(payload).select().single();
    if (error) { console.warn('[Sync] Shift error:', error.message); return { ok:false, error: error.message }; }
    shift.id = data.id; console.log('[Sync] ✓ Shift added:', shift.empName, shift.date);
    return { ok:true };
  } catch (e) { console.warn('[Sync]', e.message); return { ok:false, error: e.message }; }
}

/**
 * Update shift flags (sick, vacation, late) in Supabase
 */
async function syncUpdateShift(shift) {
  try {
    if (!shift.id || typeof shift.id !== 'number') return;
    const payload = {
      is_sick: shift.isSick || false,
      is_vacation: shift.isVacation || false,
      is_late: shift.isLate || false,
      late_min: shift.lateMin || 0,
      vac_half: shift.vacHalf || false,
      emp_id: shift.empId,
      emp_name: shift.empName,
      dept: shift.dept,
      location: shift.location,
      shift_date: shift.date,
      shift_from: shift.from,
      shift_to: shift.to,
      label: shift.label || ''
    };
    // Eigene Pause nur mitschicken, wenn gesetzt (Spalte evtl. noch nicht da → kein Bruch)
    if (shift.pauseMinutes != null) payload.pause_minutes = shift.pauseMinutes;
    const { error } = await sb.from('shifts').update(payload).eq('id', shift.id);
    if (error) { console.warn('[Sync] Shift update error:', error.message); return false; }
    console.log('[Sync] ✓ Shift updated:', shift.id);
    return true;
  } catch (e) { console.warn('[Sync]', e.message); return false; }
}

// Eigene Schicht-Pause setzen ODER auf Standard zurücksetzen (null). Separat,
// da null nur nach Migration (Spalte vorhanden) sinnvoll geschrieben werden kann.
async function syncShiftPause(shiftId, pauseMinutes) {
  try {
    if (!shiftId || typeof shiftId !== 'number') return false;
    const { error } = await sb.from('shifts').update({ pause_minutes: pauseMinutes }).eq('id', shiftId);
    if (error) { console.warn('[Sync] Shift pause error:', error.message); return false; }
    return true;
  } catch (e) { console.warn('[Sync]', e.message); return false; }
}

/**
 * Delete a shift from Supabase
 */
async function syncDeleteShift(shiftId) {
  try {
    if (!shiftId || typeof shiftId !== 'number') return;
    await sb.from('shifts').delete().eq('id', shiftId);
    console.log('[Sync] ✓ Shift deleted:', shiftId);
  } catch (e) { console.warn('[Sync]', e.message); }
}

// ═══ VERFÜGBARKEIT (Nicht verfügbar) ═══
async function syncAddAvailability(av) {
  try {
    const { data, error } = await sb.from('availability').insert({
      emp_id: av.empId, emp_name: av.empName, location: av.location || null,
      date: av.date, reason: av.reason || ''
    }).select().single();
    if (error) { console.warn('[Sync] Availability error:', error.message); return null; }
    av.id = data.id;
    console.log('[Sync] ✓ Availability added:', av.empName, av.date);
    return data.id;
  } catch (e) { console.warn('[Sync]', e.message); return null; }
}
async function syncDeleteAvailability(avId) {
  try {
    if (avId == null) return;
    await sb.from('availability').delete().eq('id', avId);
    console.log('[Sync] ✓ Availability deleted:', avId);
  } catch (e) { console.warn('[Sync]', e.message); }
}

// ═══ MITTEILUNGEN / ANNOUNCEMENTS ═══
async function syncAddAnnouncement(a) {
  try {
    const { data, error } = await sb.from('announcements').insert({
      title: a.title, message: a.message,
      location: a.location || null, created_by: a.createdBy || null, active: true,
      attachment_url: a.attachmentUrl || null, attachment_name: a.attachmentName || null,
      priority: a.priority || 'normal', mandatory: a.mandatory || false
    }).select().single();
    if (error) { console.warn('[Sync] Announcement error:', error.message); return { ok:false, error: error.message }; }
    a.id = data.id; a.createdAt = data.created_at;
    console.log('[Sync] ✓ Announcement added:', a.title);
    return { ok:true, id: data.id };
  } catch (e) { console.warn('[Sync]', e.message); return { ok:false, error: e.message }; }
}
async function syncDeleteAnnouncement(annId) {
  try {
    if (annId == null) return;
    // Soft-delete: active=false (bleibt in DB, verschwindet bei allen)
    await sb.from('announcements').update({ active: false }).eq('id', annId);
    console.log('[Sync] ✓ Announcement zurückgezogen:', annId);
  } catch (e) { console.warn('[Sync]', e.message); }
}
async function syncMarkAnnouncementRead(annId, userId, empId, name) {
  try {
    if (annId == null || !userId) return;
    await sb.from('announcement_reads').upsert({
      announcement_id: annId, user_id: userId, emp_id: empId ?? null, name: name || '',
      read_at: new Date().toISOString()
    }, { onConflict: 'announcement_id,user_id' });
    console.log('[Sync] ✓ Mitteilung gelesen:', annId, userId);
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Save all generated shifts to Supabase (bulk insert)
 */
async function syncBulkShifts(shiftsArray) {
  try {
    const rows = shiftsArray.map(s => ({
      emp_id: s.empId,
      emp_name: s.empName,
      dept: s.dept,
      location: s.location,
      shift_date: s.date,
      shift_from: s.from,
      shift_to: s.to,
      label: s.label || '',
      color_class: s.colorClass || '',
      is_sick: s.isSick || false,
      is_vacation: s.isVacation || false,
      is_late: s.isLate || false,
      late_min: s.lateMin || 0
    }));
    const { data, error } = await sb.from('shifts').insert(rows).select();
    if (error) { console.warn('[Sync] Bulk shifts error:', error.message); return { ok:false, error: error.message }; }
    // Update local IDs
    if (data) {
      data.forEach((row, i) => { if (shiftsArray[i]) shiftsArray[i].id = row.id; });
    }
    console.log('[Sync] ✓', rows.length, 'shifts saved to Supabase');
    return { ok:true };
  } catch (e) { console.warn('[Sync]', e.message); return { ok:false, error: e.message }; }
}

// ═══ TIME RECORDS (GPS Check-in/out) ═══

/**
 * Check-in: create new time_record in Supabase
 */
async function syncCheckIn(record) {
  try {
    // Idempotenz: existiert bereits ein offener Check-in für diesen MA?
    const { data: open } = await sb.from('time_records')
      .select('*').eq('emp_id', record.empId).is('check_out', null)
      .order('check_in', { ascending: false }).limit(1).maybeSingle();
    if (open) {
      // Offener Check-in eines VORTAGS (vergessen auszustempeln) nicht weiterführen
      // → würde Stunden über zwei Tage ziehen. Alten Datensatz automatisch schließen
      // und neuen Check-in für heute anlegen (Issue #5).
      const todayBerlin = isoDateBerlin(new Date());
      const openDay = isoDateBerlin(open.check_in);
      if (openDay !== todayBerlin) {
        const staleOut = new Date(new Date(open.check_in).getTime() + STALE_CHECKIN_MAX_H * 3600000);
        const pauseMin = pauseForRecord(open.emp_id, open.shift_id);
        const staleH = workedHours15(open.check_in, staleOut, pauseMin);
        await sb.from('time_records').update({
          check_out: staleOut.toISOString(), total_hours: parseFloat(staleH),
          note: (open.note ? open.note + ' · ' : '') + 'auto-geschlossen (neuer Check-in am ' + todayBerlin + ')'
        }).eq('id', open.id);
        console.log('[Sync] verwaister Check-in vom', openDay, 'geschlossen → neuer Check-in');
      } else {
        // Tatsächlich derselbe Tag → bestehenden Datensatz weiter nutzen
        console.log('[Sync] Check-in bereits offen → bestehenden Datensatz nutzen:', open.id);
        record.id = open.id;
        record.checkIn = open.check_in;
        return open;
      }
    }
    const { data, error } = await sb.from('time_records').insert({
      emp_id: record.empId,
      location: record.location,
      check_in_lat: record.checkInLat,
      check_in_lng: record.checkInLng,
      distance_m: record.distanceM,
      shift_id: record.shiftId || null,
      is_late: record.isLate || false,
      late_min: record.lateMin || 0,
      method: record.method || 'gps',
      qr_location: record.qrLocation || null,
      gps_verified: record.gpsVerified ?? null,
      gps_suspicious: record.gpsSuspicious || false
    }).select().single();
    if (error) {
      // 23505 = unique_violation → ein paralleler Check-in war schneller
      if (error.code === '23505') {
        const { data: existing } = await sb.from('time_records')
          .select('*').eq('emp_id', record.empId).is('check_out', null)
          .order('check_in', { ascending: false }).limit(1).maybeSingle();
        if (existing) { record.id = existing.id; record.checkIn = existing.check_in; return existing; }
      }
      console.warn('[Sync] Check-in error:', error.message);
      return null;
    }
    record.id = data.id;
    record.checkIn = data.check_in;
    console.log('[Sync] ✓ Check-in:', data.check_in);
    return data;
  } catch (e) {
    console.warn('[Sync] Check-in failed:', e.message);
    return null;
  }
}

/**
 * Check-out: update existing time_record
 */
async function syncCheckOut(recordId, checkOutData) {
  try {
    const { data, error } = await sb.from('time_records').update({
      check_out: new Date().toISOString(),
      check_out_lat: checkOutData.lat,
      check_out_lng: checkOutData.lng,
      total_hours: checkOutData.totalHours
    }).eq('id', recordId).select().single();
    if (error) {
      console.warn('[Sync] Check-out error:', error.message);
      return null;
    }
    console.log('[Sync] ✓ Check-out:', data.total_hours, 'h');
    return data;
  } catch (e) {
    console.warn('[Sync] Check-out failed:', e.message);
    return null;
  }
}

/**
 * Save document record to Supabase
 */
async function syncAddDocument(doc) {
  try {
    const { error } = await sb.from('documents').insert({
      emp_id: doc.empId,
      emp_name: doc.empName,
      name: doc.name,
      type: doc.type,
      doc_date: doc.date,
      icon: doc.icon,
      file_url: doc.fileUrl || null,
      file_size: doc.fileSize || 0,
      file_name: doc.fileName || doc.name
    });
    if (error) console.warn('[Sync] Document error:', error.message);
    else console.log('[Sync] ✓ Document saved:', doc.name);
  } catch (e) { console.warn('[Sync] Document:', e.message); }
}

// ═══ CHECKLISTS ═══

/**
 * Update checklist items in Supabase
 */
async function syncChecklist(checklist) {
  try {
    if (!checklist.id || typeof checklist.id !== 'number') return;
    const { error } = await sb.from('checklists').update({
      items: checklist.items,
      updated_at: new Date().toISOString()
    }).eq('id', checklist.id);
    if (error) console.warn('[Sync] Checklist update error:', error.message);
    else console.log('[Sync] ✓ Checklist updated:', checklist.id);
  } catch (e) { console.warn('[Sync] Checklist:', e.message); }
}

/**
 * Add new checklist to Supabase
 */
async function syncAddChecklist(checklist) {
  try {
    const { data, error } = await sb.from('checklists').insert({
      type:     checklist.type,
      emp_id:   checklist.empId || null,
      emp_name: checklist.empName || 'Alle Mitarbeiter',
      location: checklist.location || null,
      items:    checklist.items || []
    }).select().single();
    if (error) console.warn('[Sync] Add checklist error:', error.message);
    else { checklist.id = data.id; console.log('[Sync] ✓ Checklist added:', data.id); }
  } catch (e) { console.warn('[Sync] Checklist add:', e.message); }
}

// ═══ SHIFT TEMPLATES ═══

/**
 * Save a new shift template to Supabase
 */
async function syncAddTemplate(template) {
  try {
    const { data, error } = await sb.from('shift_templates').insert({
      location:   template.location,
      name:       template.name,
      shifts:     template.shifts || [],
      created_by: window.currentUser?.id || null
    }).select().single();
    if (error) console.warn('[Sync] Add template error:', error.message);
    else { template.id = data.id; console.log('[Sync] ✓ Template saved:', template.name); }
  } catch (e) { console.warn('[Sync] Template add:', e.message); }
}

/**
 * Delete a shift template from Supabase
 */
async function syncDeleteTemplate(templateId) {
  try {
    if (!templateId || typeof templateId !== 'number') return;
    const { error } = await sb.from('shift_templates').delete().eq('id', templateId);
    if (error) console.warn('[Sync] Delete template error:', error.message);
    else console.log('[Sync] ✓ Template deleted:', templateId);
  } catch (e) { console.warn('[Sync] Template delete:', e.message); }
}

// ═══ AUSHILFE SLOTS ═══

/**
 * Create a new Aushilfe slot in Supabase
 * @param {Object} slot - { location, date, shiftLabel, shiftFrom, shiftTo, dept, note }
 * @returns {Object|null} created slot data
 */
async function syncCreateAushilfeSlot(slot) {
  try {
    const { data, error } = await sb.from('aushilfe_slots').insert({
      location:    slot.location,
      slot_date:   slot.date,
      shift_label: slot.shiftLabel,
      shift_from:  slot.shiftFrom,
      shift_to:    slot.shiftTo,
      dept:        slot.dept,
      note:        slot.note || '',
      status:      'open',
      created_by:  (await sb.auth.getUser())?.data?.user?.id || null
    }).select().single();
    if (error) {
      console.warn('[Sync] Create Aushilfe slot error:', error.message);
      return null;
    }
    console.log('[Sync] ✓ Aushilfe slot created:', data.id);
    return data;
  } catch (e) {
    console.warn('[Sync] Aushilfe slot create:', e.message);
    return null;
  }
}

/**
 * Delete an Aushilfe slot from Supabase
 * @param {string} slotId - UUID
 */
async function syncDeleteAushilfeSlot(slotId) {
  try {
    const { error } = await sb.from('aushilfe_slots').delete().eq('id', slotId);
    if (error) console.warn('[Sync] Delete Aushilfe slot error:', error.message);
    else console.log('[Sync] ✓ Aushilfe slot deleted:', slotId);
  } catch (e) { console.warn('[Sync] Aushilfe slot delete:', e.message); }
}

/**
 * Clear booking from an Aushilfe slot (reset to 'open')
 * @param {string} slotId - UUID
 */
async function syncClearAushilfeBooking(slotId) {
  try {
    const { error } = await sb.from('aushilfe_slots').update({
      status:         'open',
      aushilfe_name:  null,
      aushilfe_phone: null,
      aushilfe_email: null,
      aushilfe_note:  null
    }).eq('id', slotId);
    if (error) console.warn('[Sync] Clear Aushilfe booking error:', error.message);
    else console.log('[Sync] ✓ Aushilfe booking cleared:', slotId);
  } catch (e) { console.warn('[Sync] Aushilfe booking clear:', e.message); }
}

/**
 * Save Aushilfe max shifts per week setting to Supabase
 * @param {number} maxShifts
 */
async function syncSaveAushilfeMaxShifts(maxShifts) {
  try {
    const updatedBy = currentUser?.name || currentUser?.email || 'Inhaber';
    const { error } = await sb.from('aushilfe_settings').upsert({
      id: 1,
      max_shifts_per_week: maxShifts,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy
    }, { onConflict: 'id' });
    if (error) {
      console.warn('[Sync] Aushilfe settings error:', error.message);
      return false;
    }
    AUSHILFE_MAX_SHIFTS_PER_WEEK = maxShifts;
    console.log('[Sync] ✓ Aushilfe max shifts saved:', maxShifts);
    return true;
  } catch (e) {
    console.warn('[Sync] Aushilfe settings:', e.message);
    return false;
  }
}

// ═══ MITARBEITER-UMZUG: zukünftige Schichten mitziehen ═══
/**
 * Wenn ein Mitarbeiter den Standort/Bereich wechselt, sollen seine
 * ZUKÜNFTIGEN Schichten (ab heute) mitwandern. Vergangene Schichten
 * bleiben unverändert (korrekte Stunden-/Lohnhistorie).
 * @param {number} empId
 * @param {'location'|'dept'} field
 * @param {string} value - neuer Wert (z.B. 'enso' oder 'origami,enso')
 * @returns {Promise<number>} Anzahl aktualisierter Schichten
 */
async function syncFutureShiftsForEmp(empId, field, value) {
  const colMap = { location: 'location', dept: 'dept' };
  const col = colMap[field];
  if (!col) return 0;
  const today = isoDate(new Date());
  const affected = SHIFTS.filter(s => s.empId === empId && s.date >= today);
  if (affected.length === 0) return 0;
  // Bei Bereichswechsel: Farb-Klasse mitführen (sonst zeigt der Plan die alte Farbe)
  const newColor = field === 'dept' ? getDeptColorClass(value) : null;
  // 1. Lokalen State sofort aktualisieren
  affected.forEach(s => {
    s[field] = value;
    if (newColor && s.label !== 'Schule' && s.colorClass !== 'schule') s.colorClass = newColor;
  });
  // 2. In Supabase persistieren (bulk: emp_id + Datum >= heute)
  try {
    const payload = { [col]: value };
    if (newColor) payload.color_class = newColor;
    const { error } = await sb.from('shifts')
      .update(payload)
      .eq('emp_id', empId)
      .gte('shift_date', today);
    if (error) console.warn('[Sync] Future shifts update error:', error.message);
    else console.log('[Sync] ✓', affected.length, 'future shifts', field, '→', value, 'for emp', empId);
  } catch (e) { console.warn('[Sync]', e.message); }
  return affected.length;
}

/**
 * Beim Standortwechsel auch ZUKÜNFTIGE Urlaubs- & Krankmeldungen mitziehen
 * (Einträge, deren Enddatum heute oder später liegt). Vergangene Einträge
 * bleiben am alten Standort (korrekte Historie). Bereich (dept) ist hier
 * irrelevant – Urlaub/Krank hängen nur am Standort.
 * @param {number} empId
 * @param {string} newLoc - neuer Standort (z.B. 'enso' oder 'origami,enso')
 * @returns {Promise<number>} Anzahl aktualisierter Einträge (Urlaub + Krank)
 */
async function syncFutureVacsSicksForEmp(empId, newLoc) {
  const today = isoDate(new Date());
  let count = 0;

  // ── Urlaub ──
  const futureVacs = VACS.filter(v => v.empId === empId && v.to >= today);
  if (futureVacs.length > 0) {
    futureVacs.forEach(v => { v.location = newLoc; });
    try {
      const { error } = await sb.from('vacations')
        .update({ location: newLoc })
        .eq('emp_id', empId)
        .gte('to_date', today);
      if (error) console.warn('[Sync] Future vacations update error:', error.message);
      else { count += futureVacs.length; console.log('[Sync] ✓', futureVacs.length, 'future vacations →', newLoc, 'for emp', empId); }
    } catch (e) { console.warn('[Sync]', e.message); }
  }

  // ── Krankmeldungen ──
  const futureSicks = SICKS.filter(s => s.empId === empId && s.to >= today);
  if (futureSicks.length > 0) {
    futureSicks.forEach(s => { s.location = newLoc; });
    try {
      const { error } = await sb.from('sick_leaves')
        .update({ location: newLoc })
        .eq('emp_id', empId)
        .gte('to_date', today);
      if (error) console.warn('[Sync] Future sick_leaves update error:', error.message);
      else { count += futureSicks.length; console.log('[Sync] ✓', futureSicks.length, 'future sick_leaves →', newLoc, 'for emp', empId); }
    } catch (e) { console.warn('[Sync]', e.message); }
  }

  return count;
}


