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
let scheduleShiftFilter = 'all'; // 'all' | 'on' (hat Schicht) | 'off' (ohne Schicht)
let scheduleSearch = '';         // Suche nach Mitarbeitername
let dragData = null;
let copyShiftId = null;   // ID der Schicht im "Kopieren"-Modus

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

// Verfügbarkeit (Nicht verfügbar – Self-Service)
let AVAILABILITY = [];

// Schichtvorschläge (Minijob schlägt Tage/Schichten vor → Admin genehmigt)
let SHIFT_PROPOSALS = [];
let proposalTab = 'pending'; // 'pending' | 'approved' | 'rejected' | 'mine'

// Mitteilungen / Announcements (Admin → alle)
let ANNOUNCEMENTS = [];
let ANNOUNCEMENT_READS = [];   // wer hat welche Pflicht-Mitteilung gelesen

// Aushilfe Planung
let AUSHILFE_SLOTS = [];
let aushilfePlanungMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let AUSHILFE_SUBMISSIONS = [];       // from employee_submissions table
let AUSHILFE_MAX_SHIFTS_PER_WEEK = 1; // configurable by owner, default 1
let aushilfeSubmissionsFilter = 'all'; // filter for submissions list

