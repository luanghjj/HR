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
    if (error) console.warn('[Sync] Vacation status error:', error.message);
    else console.log('[Sync] ✓ Vacation', vacId, '→', status);
  } catch (e) { console.warn('[Sync]', e.message); }
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
      taxClass: 'tax_class', taxId: 'tax_id', svNumber: 'sv_number',
      healthInsurance: 'health_insurance', iban: 'iban',
      nationality: 'nationality', address: 'address',
      residencePermit: 'residence_permit', workPermitUntil: 'work_permit_until',
      barGehalt: 'bar_gehalt'
    };
    const col = colMap[field] || field;
    const { error } = await sb.from('employees').update({ [col]: value }).eq('id', empId);
    if (error) console.warn('[Sync] Field error:', error.message);
    else console.log('[Sync] ✓', field, '=', value, 'for emp', empId);
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Save a salary change to salary_history in Supabase
 */
async function syncSalaryHistory(empId, oldBrutto, newBrutto, oldBar, newBar, note) {
  try {
    const changedBy = currentUser?.name || currentUser?.email || 'Unbekannt';
    const { error } = await sb.from('salary_history').insert({
      emp_id: empId,
      old_brutto: parseFloat(oldBrutto) || 0,
      new_brutto: parseFloat(newBrutto) || 0,
      old_bar:    parseFloat(oldBar)    || 0,
      new_bar:    parseFloat(newBar)    || 0,
      note: note || '',
      changed_by: changedBy
    });
    if (error) console.warn('[Sync] SalaryHistory error:', error.message);
    else console.log('[Sync] ✓ Salary history saved');
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Load salary history for an employee from Supabase
 */
async function loadSalaryHistory(empId) {
  try {
    const { data, error } = await sb.from('salary_history')
      .select('*').eq('emp_id', empId).order('changed_at', { ascending: false });
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
 * Save Ausbildungsnachweis to Supabase
 */
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

/**
 * Add a single shift to Supabase
 */
async function syncAddShift(shift) {
  try {
    const { data, error } = await sb.from('shifts').insert({
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
      late_min: shift.lateMin || 0
    }).select().single();
    if (error) console.warn('[Sync] Shift error:', error.message);
    else { shift.id = data.id; console.log('[Sync] ✓ Shift added:', shift.empName, shift.date); }
  } catch (e) { console.warn('[Sync]', e.message); }
}

/**
 * Update shift flags (sick, vacation, late) in Supabase
 */
async function syncUpdateShift(shift) {
  try {
    if (!shift.id || typeof shift.id !== 'number') return;
    const { error } = await sb.from('shifts').update({
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
    }).eq('id', shift.id);
    if (error) console.warn('[Sync] Shift update error:', error.message);
    else console.log('[Sync] ✓ Shift updated:', shift.id);
  } catch (e) { console.warn('[Sync]', e.message); }
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
    if (error) { console.warn('[Sync] Bulk shifts error:', error.message); return; }
    // Update local IDs
    if (data) {
      data.forEach((row, i) => { if (shiftsArray[i]) shiftsArray[i].id = row.id; });
    }
    console.log('[Sync] ✓', rows.length, 'shifts saved to Supabase');
  } catch (e) { console.warn('[Sync]', e.message); }
}

// ═══ TIME RECORDS (GPS Check-in/out) ═══

/**
 * Check-in: create new time_record in Supabase
 */
async function syncCheckIn(record) {
  try {
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
