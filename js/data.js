// ═══════════════════════════════════════════════════════════
// OKYU HRM – Demo Data (will be replaced by Supabase in Step 3-4)
// ═══════════════════════════════════════════════════════════

const LOCS = [
  { id: 'origami', name: 'Origami Restaurant',  city: 'Stuttgart' },
  { id: 'okyu',    name: 'Okyu Restaurant',     city: 'Stuttgart' },
  { id: 'enso',    name: 'Enso Sushi & Grill',   city: 'Stuttgart' }
];

const DEPTS = [
  { id: 1, name: 'Küche',      location: 'origami',      head: 'Minh Tran',    count: 6, color: '#fdcb6e' },
  { id: 2, name: 'Service',    location: 'origami',      head: 'Lisa Müller',  count: 5, color: '#74b9ff' },
  { id: 3, name: 'Bar',        location: 'origami',      head: 'Tom Weber',    count: 2, color: '#00b894' },
  { id: 4, name: 'Küche',      location: 'enso',         head: 'Duc Nguyen',   count: 5, color: '#fdcb6e' },
  { id: 5, name: 'Service',    location: 'enso',         head: 'Sarah Klein',  count: 4, color: '#74b9ff' },
  { id: 6, name: 'Bar',        location: 'enso',         head: 'Max Bauer',    count: 2, color: '#00b894' },
  { id: 7, name: 'Verwaltung', location: 'okyu',         head: 'Hai My',       count: 3, color: '#a29bfe' },
  { id: 8, name: 'Ausbildung', location: 'origami',      head: 'Minh Tran',    count: 3, color: '#e17055' },
  { id: 9, name: 'Ausbildung', location: 'enso',         head: 'Duc Nguyen',   count: 2, color: '#e17055' }
];

// Employees loaded from Supabase
let EMPS = [];

let VACS = [];

let SICKS = [];

let SHIFTS = [];

let DOCS = [];

let NOTIFS = [];

// USERS loaded from Supabase user_profiles
let USERS = [];

let SAVED_TEMPLATES = [
  { id: 1, location: 'origami', name: 'Origami Standard Mo-Fr', shifts: [
    { dept: 'Küche',   from: '09:00', to: '15:00', label: 'Frühschicht' },
    { dept: 'Küche',   from: '15:00', to: '23:00', label: 'Spätschicht' },
    { dept: 'Service', from: '11:00', to: '15:00', label: 'Mittag' },
    { dept: 'Service', from: '17:00', to: '23:00', label: 'Abend' },
    { dept: 'Bar',     from: '17:00', to: '23:00', label: 'Abend' }
  ]},
  { id: 2, location: 'origami', name: 'Origami Wochenende', shifts: [
    { dept: 'Küche',   from: '10:00', to: '22:00', label: 'Ganztags' },
    { dept: 'Service', from: '10:00', to: '16:00', label: 'Früh' },
    { dept: 'Service', from: '16:00', to: '23:00', label: 'Spät' },
    { dept: 'Bar',     from: '16:00', to: '23:00', label: 'Spät' }
  ]},
  { id: 3, location: 'enso', name: 'Enso Standard', shifts: [
    { dept: 'Küche',   from: '10:00', to: '15:00', label: 'Frühschicht' },
    { dept: 'Küche',   from: '15:00', to: '23:00', label: 'Spätschicht' },
    { dept: 'Service', from: '11:00', to: '23:00', label: 'Ganztags' }
  ]}
];

let CHECKLISTS = [
  { id: 1, type: 'onboarding', empId: 12, empName: 'Julia Braun',       location: 'origami', items: [
    { text: 'Arbeitsvertrag unterzeichnet', done: true },  { text: 'Gesundheitszeugnis vorgelegt', done: true },
    { text: 'Steuer-ID & SV-Nummer erhalten', done: true }, { text: 'Arbeitskleidung ausgegeben', done: true },
    { text: 'Einweisung Küchenhygiene', done: true },       { text: 'Einweisung Brandschutz', done: false },
    { text: 'Einweisung Kassensystem', done: false },        { text: 'Probeschicht absolviert', done: true },
    { text: 'Schlüssel/Zugang erhalten', done: false }
  ]},
  { id: 2, type: 'onboarding', empId: 16, empName: 'Nina Richter',      location: 'enso', items: [
    { text: 'Arbeitsvertrag unterzeichnet', done: true },  { text: 'Gesundheitszeugnis vorgelegt', done: false },
    { text: 'Steuer-ID & SV-Nummer erhalten', done: true }, { text: 'Arbeitskleidung ausgegeben', done: true },
    { text: 'Einweisung Serviceablauf', done: true },       { text: 'Einweisung Brandschutz', done: true },
    { text: 'Einweisung Kassensystem', done: true },         { text: 'Probeschicht absolviert', done: true },
    { text: 'Schlüssel/Zugang erhalten', done: true }
  ]},
  { id: 3, type: 'hygiene', empId: 0, empName: 'Alle Mitarbeiter', location: 'origami', items: [
    { text: 'Händehygiene-Schulung (Q1)', done: true },           { text: 'HACCP-Dokumentation aktualisiert', done: true },
    { text: 'Temperaturkontrollen Kühlräume', done: true },        { text: 'Reinigungsplan überprüft', done: false },
    { text: 'Schädlingsbekämpfung (Quartal)', done: true },        { text: 'Lebensmittelhygiene-Schulung (jährlich)', done: false }
  ]},
  { id: 4, type: 'hygiene', empId: 0, empName: 'Alle Mitarbeiter', location: 'enso', items: [
    { text: 'Händehygiene-Schulung (Q1)', done: true },           { text: 'HACCP-Dokumentation aktualisiert', done: false },
    { text: 'Temperaturkontrollen Kühlräume', done: true },        { text: 'Reinigungsplan überprüft', done: true },
    { text: 'Schädlingsbekämpfung (Quartal)', done: false },       { text: 'Lebensmittelhygiene-Schulung (jährlich)', done: false }
  ]},
  { id: 5, type: 'training', empId: 1, empName: 'Minh Tran', location: 'origami', items: [
    { text: 'Führungskräfte-Seminar 2026', done: false },
    { text: 'Sushi-Meisterklasse Advanced', done: true },
    { text: 'Ersthelfer-Auffrischung', done: false }
  ]},
  { id: 6, type: 'safety', empId: 0, empName: 'Alle Mitarbeiter', location: 'origami', items: [
    { text: 'Brandschutzunterweisung (jährlich)', done: true },    { text: 'Erste-Hilfe-Kasten geprüft', done: true },
    { text: 'Fluchtweg-Beschilderung geprüft', done: true },       { text: 'Unfallverhütungsvorschriften besprochen', done: false },
    { text: 'Arbeitsschutz-Begehung', done: false }
  ]}
];
