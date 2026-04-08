// ═══════════════════════════════════════════════════════════
// OKYU HRM – Global State
// ═══════════════════════════════════════════════════════════

// Current session
let currentUser = null;
let currentLocation = 'all';

// Schedule state
let scheduleView = 'week';
let scheduleDate = new Date();
let scheduleSort = 'name';
let scheduleDept = 'all';
let dragData = null;

// Vacation calendar state
let vacationCalendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let vacationTab = 'calendar';

// Document filter state
let documentTab = 'all';

// Azubi data (loaded from Supabase)
let SCHULE_SCHEDULE = [];
let AUSBILDUNGSNACHWEISE = [];
let AZUBI_BEWERTUNGEN = [];
let azubiTab = 'plan';

// Zeiterfassung (GPS Check-in)
let TIME_RECORDS = [];
let activeCheckIn = null; // Current open check-in for this user
let checkInTimer = null;  // Interval for live timer
