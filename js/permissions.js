// ═══════════════════════════════════════════════════════════
// OKYU HRM – Permissions & Role System
// ═══════════════════════════════════════════════════════════
// Roles: inhaber (owner), manager, mitarbeiter (employee), azubi (apprentice)

const PERMS = {
  inhaber: {
    seeAllLocations: true, seeAllEmployees: true, editEmployees: true,
    seeDepartments: true, seeAllSchedules: true, editSchedules: true,
    seeAllVacations: true, approveVacations: true, seeAllSick: true,
    seeAllDocs: true, canExport: true, manageAccess: true, markLate: true,
    seeFinancials: true, editVacDays: true, editTraining: true
  },
  manager: {
    seeAllLocations: false, seeAllEmployees: true, editEmployees: true,
    seeDepartments: true, seeAllSchedules: true, editSchedules: true,
    seeAllVacations: true, approveVacations: true, seeAllSick: true,
    seeAllDocs: true, canExport: true, manageAccess: false, markLate: true,
    seeFinancials: false, editVacDays: false, editTraining: false
  },
  mitarbeiter: {
    seeAllLocations: false, seeAllEmployees: false, editEmployees: false,
    seeDepartments: true, seeAllSchedules: false, editSchedules: false,
    seeAllVacations: false, approveVacations: false, seeAllSick: false,
    seeAllDocs: false, canExport: false, manageAccess: false, markLate: false,
    seeFinancials: false, editVacDays: false, editTraining: false
  },
  azubi: {
    seeAllLocations: false, seeAllEmployees: false, editEmployees: false,
    seeDepartments: true, seeAllSchedules: false, editSchedules: false,
    seeAllVacations: false, approveVacations: false, seeAllSick: false,
    seeAllDocs: false, canExport: false, manageAccess: false, markLate: false,
    seeFinancials: false, editVacDays: false, editTraining: false
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
