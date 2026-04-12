// ═══════════════════════════════════════════════════════════
// gehalt-constants.js — GehaltsManager Constants (Global)
// Converted from ES modules for OKYU HRM integration
// ═══════════════════════════════════════════════════════════

// ── Betriebe (Restaurants) ──
var GM_BETRIEBE = ['Blossom', 'Enso', 'Okyu', 'Origami'];

var GM_BETRIEB_COLORS = {
  Blossom: '#3b7ddd',
  Enso:    '#4f46e5',
  Okyu:    '#10b981',
  Origami: '#d97706',
};

// ── Beschäftigungstypen ──
var GM_BESCHAEFTIGUNGS_TYPEN = ['Vollzeit', 'Teilzeit', 'Minijob', 'Azubi', 'Werkstudent'];

// ── Monate ──
var GM_MONAT_NAMEN = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
var GM_MONAT_INDEX = { Jan:0,Feb:1,Mär:2,Apr:3,Mai:4,Jun:5,Jul:6,Aug:7,Sep:8,Okt:9,Nov:10,Dez:11 };

// ── Status Config ──
var GM_UE_STATUS_FLOW = ['offen', 'dauerauftrag', 'ueberwiesen'];
var GM_BAR_STATUS_FLOW = ['offen', 'vorbereitet', 'gezahlt'];

function gmGetStatusConfig() {
  return {
    offen:        { bg: 'rgba(239,68,68,0.08)', c: '#ef4444', l: 'Offen',        i: '○'  },
    dauerauftrag: { bg: 'rgba(59,125,221,0.1)',  c: '#3b7ddd', l: 'Dauerauftrag', i: '🔄' },
    ueberwiesen:  { bg: 'rgba(16,185,129,0.08)', c: '#10b981', l: 'Überwiesen',   i: '✅' },
    vorbereitet:  { bg: 'rgba(217,119,6,0.08)',  c: '#d97706', l: 'Vorbereitet',  i: '📋' },
    gezahlt:      { bg: 'rgba(16,185,129,0.08)', c: '#10b981', l: 'Gezahlt',      i: '💵' },
  };
}

function gmGetTypFarben() {
  return {
    Vollzeit:     '#10b981',
    Teilzeit:     '#3b7ddd',
    Minijob:      '#a78bfa',
    Azubi:        '#d97706',
    Werkstudent:  '#f59e0b',
  };
}

// ── Sozialversicherungs-Sätze (AG-Anteil) ──
var GM_SV_SAETZE = {
  kv: 7.3, rv: 9.3, av: 1.3, pv: 1.7, u1: 1.6, u2: 0.44, insolvenz: 0.06,
};

var GM_SV_LABELS = {
  kv: 'Krankenversicherung', rv: 'Rentenversicherung', av: 'Arbeitslosenversicherung',
  pv: 'Pflegeversicherung', u1: 'Umlage U1', u2: 'Umlage U2', insolvenz: 'Insolvenzumlage',
};

// ── Smart Money / Benefits ──
var GM_BENEFITS = [
  { k:'kita',       l:'Kita-Zuschuss',    icon:'🏒', desc:'Betreuung nicht schulpflichtiger Kinder', steuer:'Steuerfrei', sv:'SV-frei', max:null, period:'monat', unit:'€/Monat', paragraph:'§3 Nr.33 EStG' },
  { k:'jobticket',  l:'Jobticket',         icon:'🚇', desc:'Deutschlandticket / ÖPNV-Zuschuss', steuer:'Steuerfrei', sv:'SV-frei', max:null, period:'monat', unit:'€/Monat', paragraph:'§3 Nr.15 EStG' },
  { k:'jobrad',     l:'Jobrad-Leasing',    icon:'🚲', desc:'Fahrrad-Leasing via Gehaltsumwandlung', steuer:'Vom Brutto', sv:'SV-reduziert', max:null, period:'monat', unit:'€/Monat', paragraph:'§3 Nr.37 EStG' },
  { k:'erholung',   l:'Erholungsbeihilfe', icon:'🏖', desc:'MA 156€ + Partner 104€ + Kind 52€', steuer:'Pauschal 25%', sv:'SV-frei', max:400, period:'jahr', unit:'€/Jahr', paragraph:'§40 Abs.2 Nr.3 EStG' },
  { k:'diensthandy',l:'Diensthandy/Tablet',icon:'📱', desc:'Hardware zur privaten Nutzung', steuer:'Steuerfrei', sv:'SV-frei', max:null, period:'einmalig', unit:'✓/✗', paragraph:'§3 Nr.45 EStG' },
  { k:'gesundheit', l:'Gesundheitskurs',   icon:'💪', desc:'Prävention, Fitness, Ergonomie', steuer:'Steuerfrei', sv:'SV-frei', max:600, period:'jahr', unit:'€/Jahr', paragraph:'§3 Nr.34 EStG' },
];

// ── Stammdaten-Felder ──
var GM_STAMMDATEN_FIELDS = [
  { cat:'Beschäftigung', fields:[
    {k:'typ',l:'Typ',type:'select',opts:GM_BESCHAEFTIGUNGS_TYPEN},{k:'eurStd',l:'EUR/Std',type:'number'},{k:'stdWoche',l:'Std/Woche',type:'number'},{k:'stdMonat',l:'Std/Monat',type:'number'}
  ]},
  { cat:'Steuer & SV', fields:[
    {k:'steuerklasse',l:'Steuerklasse',type:'text'},{k:'steuerId',l:'Steuer-ID',type:'text'},{k:'svNr',l:'SV-Nummer',type:'text'},{k:'krankenkasse',l:'Krankenkasse',type:'text'}
  ]},
  { cat:'Bankdaten', fields:[{k:'iban',l:'IBAN',type:'text'}]},
  { cat:'Persönlich', fields:[{k:'geburtsdatum',l:'Geburtsdatum',type:'text'},{k:'nationalitaet',l:'Nationalität',type:'text'},{k:'adresse',l:'Adresse',type:'text'}]},
  { cat:'Aufenthalt', fields:[{k:'aufenthaltstitel',l:'Aufenthaltstitel',type:'text'},{k:'arbeitserlaubnisBis',l:'Arbeitserlaubnis bis',type:'text'}]},
];

var GM_BANKEN = ['Commerzbank', 'Commerzbank Enso', 'Commerzbank Okyu', 'Commerzbank Origami',
  'Deutsche Bank', 'ING', 'Revolut Enso', 'Revolut Okyu', 'Revolut Ultra', 'Sparkasse', 'VR Bank', 'Volksbank'];

var GM_MAIN_LOHNART_NRS = [1, 2, 3, 4, 100];
