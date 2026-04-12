// ═══════════════════════════════════════════════════════════
// OKYU HRM – Permissions & Role System (58 keys)
// ═══════════════════════════════════════════════════════════
// Roles: inhaber (owner), manager, mitarbeiter (employee), azubi (apprentice)
// Includes 16 OKYU HRM keys + 42 GehaltsManager keys (prefix: gm_)

const PERMS = {
  inhaber: {
    // ── OKYU HRM (16 keys) ──
    seeAllLocations: true, seeAllEmployees: true, editEmployees: true,
    seeDepartments: true, seeAllSchedules: true, editSchedules: true,
    seeAllVacations: true, approveVacations: true, seeAllSick: true,
    seeAllDocs: true, canExport: true, manageAccess: true, markLate: true,
    seeFinancials: true, editVacDays: true, editTraining: true,
    // ── GehaltsManager — Seiten (5 keys) ──
    gm_see_dash: true, gm_see_abr: true, gm_see_banken: true, gm_see_ma: true, gm_see_smart: true,
    // ── GehaltsManager — Spalten (12 keys) ──
    gm_see_gehalt: true, gm_see_brutto: true, gm_see_netto: true, gm_see_ueberw: true,
    gm_see_ue_status: true, gm_see_bar: true, gm_see_bar_status: true, gm_see_summe: true,
    gm_see_ziel: true, gm_see_notiz: true, gm_see_typ: true, gm_see_extras: true,
    // ── GehaltsManager — Popup (7 keys) ──
    gm_see_popup: true, gm_pop_kpi: true, gm_pop_stamm: true, gm_pop_chart: true,
    gm_pop_history: true, gm_pop_table: true, gm_pop_cross: true,
    // ── GehaltsManager — Bearbeitung (6 keys) ──
    gm_edit_brutto: true, gm_edit_status: true, gm_edit_bar: true,
    gm_edit_notiz: true, gm_edit_values: true, gm_edit_stamm: true,
    // ── GehaltsManager — Funktionen (7 keys) ──
    gm_fn_create_ma: true, gm_fn_deactivate: true, gm_fn_abrechnung: true,
    gm_fn_import: true, gm_fn_export: true, gm_fn_betrieb: true, gm_fn_users: true,
    // ── GehaltsManager — HRM-Modul (6 keys) ──
    gm_see_hrm: true, gm_ansicht_hrm_intern: true, gm_ansicht_hrm_stb: true,
    gm_ansicht_hrm_gehalt: true, gm_ansicht_hrm_summen: true, gm_hrm_daten_import: true,
    // ── Einstellungen (1 key) ──
    gm_edit_hrm_status: true,
  },
  manager: {
    // ── OKYU HRM ──
    seeAllLocations: false, seeAllEmployees: true, editEmployees: true,
    seeDepartments: true, seeAllSchedules: true, editSchedules: true,
    seeAllVacations: true, approveVacations: true, seeAllSick: true,
    seeAllDocs: true, canExport: true, manageAccess: false, markLate: true,
    seeFinancials: false, editVacDays: false, editTraining: false,
    // ── GehaltsManager — Seiten ──
    gm_see_dash: true, gm_see_abr: true, gm_see_banken: true, gm_see_ma: true, gm_see_smart: true,
    // ── Spalten (view most) ──
    gm_see_gehalt: true, gm_see_brutto: true, gm_see_netto: true, gm_see_ueberw: true,
    gm_see_ue_status: true, gm_see_bar: true, gm_see_bar_status: true, gm_see_summe: true,
    gm_see_ziel: false, gm_see_notiz: true, gm_see_typ: true, gm_see_extras: false,
    // ── Popup ──
    gm_see_popup: true, gm_pop_kpi: true, gm_pop_stamm: true, gm_pop_chart: true,
    gm_pop_history: true, gm_pop_table: true, gm_pop_cross: true,
    // ── Bearbeitung ──
    gm_edit_brutto: false, gm_edit_status: true, gm_edit_bar: true,
    gm_edit_notiz: true, gm_edit_values: false, gm_edit_stamm: false,
    // ── Funktionen ──
    gm_fn_create_ma: false, gm_fn_deactivate: false, gm_fn_abrechnung: false,
    gm_fn_import: false, gm_fn_export: true, gm_fn_betrieb: false, gm_fn_users: false,
    // ── HRM ──
    gm_see_hrm: true, gm_ansicht_hrm_intern: true, gm_ansicht_hrm_stb: false,
    gm_ansicht_hrm_gehalt: true, gm_ansicht_hrm_summen: true, gm_hrm_daten_import: false,
    gm_edit_hrm_status: true,
  },
  mitarbeiter: {
    // ── OKYU HRM ──
    seeAllLocations: false, seeAllEmployees: false, editEmployees: false,
    seeDepartments: true, seeAllSchedules: false, editSchedules: false,
    seeAllVacations: false, approveVacations: false, seeAllSick: false,
    seeAllDocs: false, canExport: false, manageAccess: false, markLate: false,
    seeFinancials: false, editVacDays: false, editTraining: false,
    // ── GehaltsManager — alles deaktiviert ──
    gm_see_dash: false, gm_see_abr: false, gm_see_banken: false, gm_see_ma: false, gm_see_smart: false,
    gm_see_gehalt: false, gm_see_brutto: false, gm_see_netto: false, gm_see_ueberw: false,
    gm_see_ue_status: false, gm_see_bar: false, gm_see_bar_status: false, gm_see_summe: false,
    gm_see_ziel: false, gm_see_notiz: false, gm_see_typ: false, gm_see_extras: false,
    gm_see_popup: false, gm_pop_kpi: false, gm_pop_stamm: false, gm_pop_chart: false,
    gm_pop_history: false, gm_pop_table: false, gm_pop_cross: false,
    gm_edit_brutto: false, gm_edit_status: false, gm_edit_bar: false,
    gm_edit_notiz: false, gm_edit_values: false, gm_edit_stamm: false,
    gm_fn_create_ma: false, gm_fn_deactivate: false, gm_fn_abrechnung: false,
    gm_fn_import: false, gm_fn_export: false, gm_fn_betrieb: false, gm_fn_users: false,
    gm_see_hrm: false, gm_ansicht_hrm_intern: false, gm_ansicht_hrm_stb: false,
    gm_ansicht_hrm_gehalt: false, gm_ansicht_hrm_summen: false, gm_hrm_daten_import: false,
    gm_edit_hrm_status: false,
  },
  azubi: {
    // ── OKYU HRM ──
    seeAllLocations: false, seeAllEmployees: false, editEmployees: false,
    seeDepartments: true, seeAllSchedules: false, editSchedules: false,
    seeAllVacations: false, approveVacations: false, seeAllSick: false,
    seeAllDocs: false, canExport: false, manageAccess: false, markLate: false,
    seeFinancials: false, editVacDays: false, editTraining: false,
    // ── GehaltsManager — alles deaktiviert ──
    gm_see_dash: false, gm_see_abr: false, gm_see_banken: false, gm_see_ma: false, gm_see_smart: false,
    gm_see_gehalt: false, gm_see_brutto: false, gm_see_netto: false, gm_see_ueberw: false,
    gm_see_ue_status: false, gm_see_bar: false, gm_see_bar_status: false, gm_see_summe: false,
    gm_see_ziel: false, gm_see_notiz: false, gm_see_typ: false, gm_see_extras: false,
    gm_see_popup: false, gm_pop_kpi: false, gm_pop_stamm: false, gm_pop_chart: false,
    gm_pop_history: false, gm_pop_table: false, gm_pop_cross: false,
    gm_edit_brutto: false, gm_edit_status: false, gm_edit_bar: false,
    gm_edit_notiz: false, gm_edit_values: false, gm_edit_stamm: false,
    gm_fn_create_ma: false, gm_fn_deactivate: false, gm_fn_abrechnung: false,
    gm_fn_import: false, gm_fn_export: false, gm_fn_betrieb: false, gm_fn_users: false,
    gm_see_hrm: false, gm_ansicht_hrm_intern: false, gm_ansicht_hrm_stb: false,
    gm_ansicht_hrm_gehalt: false, gm_ansicht_hrm_summen: false, gm_hrm_daten_import: false,
    gm_edit_hrm_status: false,
  }
};

/**
 * Check if current user has a specific permission
 * Checks custom permissions first (from user_permissions table),
 * falls back to role-based defaults if mode is 'standard' or no custom data.
 * @param {string} perm - Permission key from PERMS
 * @returns {boolean}
 */
function can(perm) {
  if (!currentUser) return false;

  // If user has custom permissions (mode='custom') → use those
  if (currentUser._permMode === 'custom' && currentUser._customPerms) {
    return !!currentUser._customPerms[perm];
  }

  // Fallback: role-based defaults
  return !!PERMS[currentUser.role]?.[perm];
}
