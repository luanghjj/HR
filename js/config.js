// ═══════════════════════════════════════════════════════════
// OKYU HRM – Configuration
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://zkxsyipyjqikqxswpbks.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreHN5aXB5anFpa3F4c3dwYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzgxOTMsImV4cCI6MjA5MTIxNDE5M30.oodwUnavIkmHS6W08OwpAoxxFoBPcJ6ZOizOQkaE5PY';

// German locale constants
const DAYS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

// Page title mapping
const PAGE_TITLES = {
  dashboard: 'Dashboard',
  employees: 'Mitarbeiter',
  departments: 'Bereiche',
  schedule: 'Arbeitsplan',
  vacation: 'Urlaubsplan',
  sick: 'Krankmeldungen',
  documents: 'Unterlagen',
  access: 'Zugangsverwaltung',
  calendar: 'Personalkalender',
  reports: 'Berichte & Auswertungen',
  checklists: 'Checklisten',
  ausbildung: 'Ausbildung',
  qr_generator: 'QR Check-in',
  locations: 'Standorte',
  gehalt_dash: 'Gehalt Dashboard',
  gehalt_abr: 'Gehaltsabrechnung',
  gehalt_ma: 'Mitarbeiter (Gehalt)',
  gehalt_banken: 'Banken & Zahlungen',
  gehalt_hrm: 'HRM Intern',
  gehalt_smart: 'Smart Money'
};

// Shift templates
const SHIFT_TEMPLATES = [
  { label: 'Frühschicht',    from: '09:00', to: '15:00' },
  { label: 'Spätschicht',    from: '15:00', to: '23:00' },
  { label: 'Mittagsschicht', from: '11:00', to: '15:00' },
  { label: 'Abendschicht',   from: '17:00', to: '23:00' },
  { label: 'Ganztags',       from: '10:00', to: '22:00' },
  { label: 'Schule',         from: '08:00', to: '15:00' },
  { label: 'Manuell',        from: '09:00', to: '17:00' }
];

// Checklist types
const CHECKLIST_TYPES = [
  { id: 'onboarding', name: 'Einarbeitung',        icon: '🚀', color: 'var(--accent)' },
  { id: 'hygiene',    name: 'Hygiene & HACCP',      icon: '🧼', color: 'var(--success)' },
  { id: 'training',   name: 'Schulung & Fortbildung', icon: '🎓', color: 'var(--info)' },
  { id: 'safety',     name: 'Arbeitssicherheit',    icon: '🦺', color: 'var(--warning)' }
];

// Restaurant operating schedules
// dayOff: day(s) of week closed (0=Sun,1=Mon,...6=Sat)
// halfDays: day(s) with half-day schedule
const LOCATION_SCHEDULE = {
  origami:        { dayOff: [1], halfDays: [6, 0] },  // Mo frei, Sa+So halbtags
  omoistuttgart:  { dayOff: [1], halfDays: [] }        // Mo frei
};

// GPS coordinates for each location (used for check-in proximity check)
// Source: GPS Zeiterfassung SKILL.md – update with real coords via Google Maps
const GPS_COORDS = {
  origami:        { lat: 48.77024,   lng: 9.17621,   radius_m: 50 },
  omoistuttgart:  { lat: 48.7704374,  lng: 9.1766313,  radius_m: 50 }
};

/**
 * Get vacation display type for a given date + location
 * Returns: 'B' (full day), 'A' (half day), or null (closed / no vacation)
 */
function getVacTypeForDate(dateStr, locationId) {
  const d = new Date(dateStr);
  const dow = d.getDay(); // 0=Sun...6=Sat
  // Resolve multi-location: use first matching schedule, or currentLocation
  let resolvedLoc = locationId;
  if (!locationId || locationId === 'all') {
    resolvedLoc = (typeof currentLocation !== 'undefined' && currentLocation !== 'all') ? currentLocation : '';
  } else if (locationId.includes(',')) {
    // Multi-loc: use currentLocation if set, else first in list
    if (typeof currentLocation !== 'undefined' && currentLocation !== 'all') {
      resolvedLoc = currentLocation;
    } else {
      resolvedLoc = locationId.split(',')[0].trim();
    }
  }
  const sched = LOCATION_SCHEDULE[resolvedLoc] || { dayOff: [], halfDays: [] };
  if (sched.dayOff.includes(dow)) return null;     // closed day → skip
  if (sched.halfDays.includes(dow)) return 'A';     // half day
  return 'B';                                        // full day
}
