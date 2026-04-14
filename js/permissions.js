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
    seeZeiterfassung: true, seeOwnDetail: true,
  },
  manager: {
    // ── OKYU HRM ──
    seeAllLocations: false, seeAllEmployees: true, editEmployees: true,
    seeDepartments: true, seeAllSchedules: true, editSchedules: true,
    seeAllVacations: true, approveVacations: true, seeAllSick: true,
    seeAllDocs: true, canExport: true, manageAccess: false, markLate: true,
    seeFinancials: false, editVacDays: false, editTraining: false,
    seeZeiterfassung: false, seeOwnDetail: true,
  },
  mitarbeiter: {
    // ── OKYU HRM ──
    seeAllLocations: false, seeAllEmployees: false, editEmployees: false,
    seeDepartments: true, seeAllSchedules: false, editSchedules: false,
    seeAllVacations: false, approveVacations: false, seeAllSick: false,
    seeAllDocs: false, canExport: false, manageAccess: false, markLate: false,
    seeFinancials: false, editVacDays: false, editTraining: false,
    seeZeiterfassung: false, seeOwnDetail: true,
  },
  azubi: {
    // ── OKYU HRM ──
    seeAllLocations: false, seeAllEmployees: false, editEmployees: false,
    seeDepartments: true, seeAllSchedules: false, editSchedules: false,
    seeAllVacations: false, approveVacations: false, seeAllSick: false,
    seeAllDocs: false, canExport: false, manageAccess: false, markLate: false,
    seeFinancials: false, editVacDays: false, editTraining: false,
    seeZeiterfassung: false, seeOwnDetail: true,
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
