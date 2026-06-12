// ═══════════════════════════════════════════════════════════
// OKYU HRM – Configuration
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://zkxsyipyjqikqxswpbks.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreHN5aXB5anFpa3F4c3dwYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzgxOTMsImV4cCI6MjA5MTIxNDE5M30.oodwUnavIkmHS6W08OwpAoxxFoBPcJ6ZOizOQkaE5PY';

// ═══════════════════════════════════════════════════════════
// Feature-Flag: Gehalt/Lohn-Anzeige
// ───────────────────────────────────────────────────────────
// false  → ALLE Geld-/Lohn-Bereiche werden in der App ausgeblendet
//          (Lohnabrechnung, Gehalt, Gehaltshistorie, Zahlungsstatus,
//           Steuerberater-Export, Gehaltsspalten in der Mitarbeitertabelle,
//           Finanz-Kacheln im Dashboard).
//          Daten & GehaltsManager-Anbindung bleiben UNVERÄNDERT —
//          nur die Anzeige ist deaktiviert. Zum Wiedereinschalten: true.
// ═══════════════════════════════════════════════════════════
const SHOW_SALARY = false;

// ═══════════════════════════════════════════════════════════
// Feature-Flag: Mitarbeiter-Gruppierung (optische Zusammenfassung)
// ───────────────────────────────────────────────────────────
// true  → Duplikate (gleicher Name) werden in der Mitarbeiterliste als
//          EINE Zeile dargestellt, mit allen Standorten zusammengefasst.
//          Datenbank bleibt unverändert (nur Anzeige).
// false → Jeder DB-Record = eine eigene Zeile (alter Modus).
// ═══════════════════════════════════════════════════════════
const GROUP_EMPLOYEES = true;

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
  aushilfe_planung: 'Aushilfe Planung',
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
  origami:        { lat: 48.77024,    lng: 9.17621,    radius_m: 50 },
  omoistuttgart:  { lat: 48.7704374,  lng: 9.1766313,  radius_m: 50 },
  enso:           { lat: 48.7754637,  lng: 9.1818213,  radius_m: 50 },
  okyu:           { lat: 48.7752943,  lng: 9.1724394,  radius_m: 50 }
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

// ═══════════════════════════════════════════════════════════
// Standard-Wochenplan (Schicht-Vorlagen pro Bereich × Standort × Wochentag)
// ───────────────────────────────────────────────────────────
// Struktur: STANDARD_WEEK[locKind][dept][dow] = [ {from,to,label}, ... ]
//   dow (JS getDay()): 0=So 1=Mo 2=Di 3=Mi 4=Do 5=Fr 6=Sa
//   Leeres Array []  = an dem Tag kein Dienst (geschlossen).
// locKind: 'standard' (Okyu/Enso), 'origami', 'omoi' (O·MO·I Café)
// ═══════════════════════════════════════════════════════════
const _shift = (from, to, label) => ({ from, to, label });

// Abendschicht-Ende: Mo–Do & So = 22:00, Fr+Sa = 23:00
const _abend = (dow) => _shift('17:00', (dow === 5 || dow === 6) ? '23:00' : '22:00', 'Abend');

const STANDARD_WEEK = {
  // ── Okyu + Enso: geteilte Schichten, Mo–Sa offen, So geschlossen ──
  standard: {
    'Küche': {
      1: [_shift('10:30','15:00','Mittag'), _abend(1)],
      2: [_shift('11:00','15:30','Mittag'), _abend(2)],
      3: [_shift('10:30','15:00','Mittag'), _abend(3)],
      4: [_shift('10:30','15:00','Mittag'), _abend(4)],
      5: [_shift('10:30','15:00','Mittag'), _abend(5)],
      6: [_shift('11:00','15:30','Mittag'), _abend(6)],
      0: []
    },
    'Sushi': {
      1: [_shift('10:30','15:00','Mittag'), _abend(1)],
      2: [_shift('10:30','15:00','Mittag'), _abend(2)],
      3: [_shift('10:30','15:00','Mittag'), _abend(3)],
      4: [_shift('10:30','15:00','Mittag'), _abend(4)],
      5: [_shift('10:30','15:00','Mittag'), _abend(5)],
      6: [_shift('11:00','16:00','Mittag'), _abend(6)],
      0: []
    },
    'Service': {
      1: [_shift('10:30','15:00','Mittag'), _abend(1)],
      2: [_shift('10:30','15:00','Mittag'), _abend(2)],
      3: [_shift('10:30','15:00','Mittag'), _abend(3)],
      4: [_shift('10:30','15:00','Mittag'), _abend(4)],
      5: [_shift('10:30','15:00','Mittag'), _abend(5)],
      6: [_shift('11:00','16:00','Mittag'), _abend(6)],
      0: []
    }
  },
  // ── Origami: Mo geschlossen, Di–Fr ganztags, Sa+So halbtags (nur Mittag) ──
  origami: {
    'Küche': {
      1: [],
      2: [_shift('10:30','15:00','Mittag'), _abend(2)],
      3: [_shift('10:30','15:00','Mittag'), _abend(3)],
      4: [_shift('10:30','15:00','Mittag'), _abend(4)],
      5: [_shift('10:30','15:00','Mittag'), _abend(5)],
      6: [_shift('10:30','15:00','Halbtag')],
      0: [_shift('10:30','15:00','Halbtag')]
    },
    'Sushi': {
      1: [],
      2: [_shift('10:30','15:00','Mittag'), _abend(2)],
      3: [_shift('10:30','15:00','Mittag'), _abend(3)],
      4: [_shift('10:30','15:00','Mittag'), _abend(4)],
      5: [_shift('10:30','15:00','Mittag'), _abend(5)],
      6: [_shift('10:30','15:00','Halbtag')],
      0: [_shift('10:30','15:00','Halbtag')]
    },
    'Service': {
      1: [],
      2: [_shift('10:30','15:00','Mittag'), _abend(2)],
      3: [_shift('10:30','15:00','Mittag'), _abend(3)],
      4: [_shift('10:30','15:00','Mittag'), _abend(4)],
      5: [_shift('10:30','15:00','Mittag'), _abend(5)],
      6: [_shift('10:30','16:00','Halbtag')],
      0: [_shift('10:30','16:00','Halbtag')]
    }
  },
  // ── O·MO·I Café: Mo geschlossen, eine Schicht, Start 1h vor Öffnung (11:00) ──
  omoi: {
    '*': {
      1: [],
      2: [_shift('11:00','21:00','Tagschicht')],
      3: [_shift('11:00','21:00','Tagschicht')],
      4: [_shift('11:00','21:00','Tagschicht')],
      5: [_shift('11:00','22:00','Tagschicht')],
      6: [_shift('11:00','22:00','Tagschicht')],
      0: [_shift('11:00','20:00','Tagschicht')]
    }
  }
};

/** Standort-ID → Standort-Typ für den Standard-Wochenplan */
function getLocationKind(locationId) {
  if (!locationId) return null;
  const id = locationId.split(',')[0].trim();   // bei Multi-Standort: erster
  if (id === 'origami') return 'origami';
  if (id === 'omoistuttgart') return 'omoi';
  if (id === 'okyu' || id === 'enso' || id === 'okyu_central') return 'standard';
  return 'standard';   // Default
}

/**
 * Standard-Schichten für (Bereich, Standort, Wochentag) zurückgeben.
 * @returns {Array<{from,to,label}>} leeres Array = kein Dienst
 */
function getStandardShifts(dept, locationId, dow) {
  const kind = getLocationKind(locationId);
  if (!kind) return [];
  const tbl = STANDARD_WEEK[kind];
  if (!tbl) return [];
  const deptTbl = tbl[dept] || tbl['*'];   // omoi nutzt '*' für alle Bereiche
  if (!deptTbl) return [];
  return deptTbl[dow] || [];
}
