// ═══════════════════════════════════════════════════════════
// constants.js — Business Constants & Configuration
// GehaltsManager — SieuVuong
// ═══════════════════════════════════════════════════════════

import { colors } from './theme.js';

// ── Betriebe (Restaurants) ──
export const BETRIEBE = ['Blossom', 'Enso', 'Okyu', 'Origami'];

// ── Beschäftigungstypen ──
export const BESCHAEFTIGUNGS_TYPEN = ['Vollzeit', 'Teilzeit', 'Minijob', 'Azubi', 'Werkstudent'];

// ── Typ-Farben ──
export const getTypFarben = () => ({
  Vollzeit:     colors.ok,      // #10b981
  Teilzeit:     colors.ac,      // #3b7ddd
  Minijob:      '#a78bfa',
  Azubi:        colors.wn,      // #d97706
  Werkstudent:  '#f59e0b',
});

// ── Überweisungs-Status ──
export const UE_STATUS_FLOW = ['offen', 'dauerauftrag', 'ueberwiesen'];
export const BAR_STATUS_FLOW = ['offen', 'vorbereitet', 'gezahlt'];

export const getStatusConfig = () => ({
  offen:        { bg: colors.noB, c: colors.no, l: 'Offen',        i: '○'  },
  dauerauftrag: { bg: colors.acG, c: colors.ac, l: 'Dauerauftrag', i: '🔄' },
  ueberwiesen:  { bg: colors.okB, c: colors.ok, l: 'Überwiesen',   i: '✅' },
  vorbereitet:  { bg: colors.wnB, c: colors.wn, l: 'Vorbereitet',  i: '📋' },
  gezahlt:      { bg: colors.okB, c: colors.ok, l: 'Gezahlt',      i: '💵' },
});

// ── Banken ──
export const BANKEN = ['VR Bank', 'Sparkasse', 'Commerzbank', 'Deutsche Bank', 'ING', 'Volksbank'];

// ── Hauptlohnart-Nummern (default main wage types) ──
export const MAIN_LOHNART_NRS = [1, 2, 3, 4, 100];

// ── Monate (deutsch) ──
export const MONAT_NAMEN = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

export const MONAT_INDEX = {
  Jan: 0, Feb: 1, Mär: 2, Apr: 3, Mai: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Okt: 9, Nov: 10, Dez: 11,
};

// ── Sozialversicherungs-Sätze (AG-Anteil) ──
export const SV_SAETZE = {
  kv: 7.3,        // Krankenversicherung
  rv: 9.3,        // Rentenversicherung
  av: 1.3,        // Arbeitslosenversicherung
  pv: 1.7,        // Pflegeversicherung
  u1: 1.6,        // Umlage U1
  u2: 0.44,       // Umlage U2
  insolvenz: 0.06, // Insolvenzumlage
};

export const SV_LABELS = {
  kv: 'Krankenversicherung',
  rv: 'Rentenversicherung',
  av: 'Arbeitslosenversicherung',
  pv: 'Pflegeversicherung',
  u1: 'Umlage U1',
  u2: 'Umlage U2',
  insolvenz: 'Insolvenzumlage',
};

// ── Smart Money / Benefits ──
export const BENEFITS = [
  {
    k: 'kita',        l: 'Kita-Zuschuss',     icon: '🏒',
    desc: 'Betreuung nicht schulpflichtiger Kinder',
    steuer: 'Steuerfrei', sv: 'SV-frei',
    max: null, period: 'monat', unit: '€/Monat',
    paragraph: '§3 Nr.33 EStG',
  },
  {
    k: 'jobticket',   l: 'Jobticket',          icon: '🚇',
    desc: 'Deutschlandticket / ÖPNV-Zuschuss',
    steuer: 'Steuerfrei', sv: 'SV-frei',
    max: null, period: 'monat', unit: '€/Monat',
    paragraph: '§3 Nr.15 EStG',
  },
  {
    k: 'jobrad',      l: 'Jobrad-Leasing',     icon: '🚲',
    desc: 'Fahrrad-Leasing via Gehaltsumwandlung',
    steuer: 'Vom Brutto', sv: 'SV-reduziert',
    max: null, period: 'monat', unit: '€/Monat',
    paragraph: '§3 Nr.37 EStG',
  },
  {
    k: 'erholung',    l: 'Erholungsbeihilfe',  icon: '🏖',
    desc: 'MA 156€ + Partner 104€ + Kind 52€',
    steuer: 'Pauschal 25%', sv: 'SV-frei',
    max: 400, period: 'jahr', unit: '€/Jahr',
    paragraph: '§40 Abs.2 Nr.3 EStG',
  },
  {
    k: 'diensthandy', l: 'Diensthandy/Tablet', icon: '📱',
    desc: 'Hardware zur privaten Nutzung',
    steuer: 'Steuerfrei', sv: 'SV-frei',
    max: null, period: 'einmalig', unit: '✓/✗',
    paragraph: '§3 Nr.45 EStG',
  },
  {
    k: 'gesundheit',  l: 'Gesundheitskurs',    icon: '💪',
    desc: 'Prävention, Fitness, Ergonomie',
    steuer: 'Steuerfrei', sv: 'SV-frei',
    max: 600, period: 'jahr', unit: '€/Jahr',
    paragraph: '§3 Nr.34 EStG',
  },
];

// ── Stammdaten-Felder (Employee Master Data Fields) ──
export const STAMMDATEN_FIELDS = [
  {
    cat: 'Beschäftigung',
    fields: [
      { k: 'typ',       l: 'Typ',       type: 'select', opts: BESCHAEFTIGUNGS_TYPEN },
      { k: 'eurStd',    l: 'EUR/Std',   type: 'number' },
      { k: 'stdWoche',  l: 'Std/Woche', type: 'number' },
      { k: 'stdMonat',  l: 'Std/Monat', type: 'number' },
    ],
  },
  {
    cat: 'Steuer & SV',
    fields: [
      { k: 'steuerklasse', l: 'Steuerklasse',  type: 'text' },
      { k: 'steuerId',     l: 'Steuer-ID',     type: 'text' },
      { k: 'svNr',         l: 'SV-Nummer',     type: 'text' },
      { k: 'krankenkasse', l: 'Krankenkasse',  type: 'text' },
    ],
  },
  {
    cat: 'Bankdaten',
    fields: [
      { k: 'iban', l: 'IBAN', type: 'text' },
    ],
  },
  {
    cat: 'Persönlich',
    fields: [
      { k: 'geburtsdatum',  l: 'Geburtsdatum',  type: 'text' },
      { k: 'nationalitaet', l: 'Nationalität',   type: 'text' },
      { k: 'adresse',       l: 'Adresse',        type: 'text' },
    ],
  },
  {
    cat: 'Aufenthalt',
    fields: [
      { k: 'aufenthaltstitel',   l: 'Aufenthaltstitel',     type: 'text' },
      { k: 'arbeitserlaubnisBis', l: 'Arbeitserlaubnis bis', type: 'text' },
    ],
  },
];

// ── Berechtigungen / Permissions ──
export const PERMISSION_GROUPS = [
  {
    cat: 'Seiten',
    perms: [
      { k: 'see_dash',   l: 'Dashboard',     d: 'KPIs und Diagramme' },
      { k: 'see_abr',    l: 'Abrechnung',    d: 'Abrechnungs-Tab' },
      { k: 'see_banken', l: 'Banken',         d: 'Banken-Übersicht' },
      { k: 'see_ma',     l: 'Mitarbeiter',   d: 'Mitarbeiter-Tab' },
      { k: 'see_smart',  l: 'Smart Money',   d: 'Benefits-Tab' },
    ],
  },
  {
    cat: 'Abrechnung — Spalten',
    perms: [
      { k: 'see_gehalt',     l: 'Gehalt',              d: 'Gehalt-Spalte (Grundlohn)' },
      { k: 'see_brutto',     l: 'Ges.-Brutto',         d: 'Gesamt-Brutto-Spalte' },
      { k: 'see_netto',      l: 'Netto',               d: 'Netto-Spalte' },
      { k: 'see_ueberw',     l: 'Überweisung',         d: 'Überweisungs-Betrag' },
      { k: 'see_ue_status',  l: 'Ü-Status',            d: 'Überweisungs-Status + Datum' },
      { k: 'see_bar',        l: 'Bar/TG',              d: 'Bar/TG-Betrag' },
      { k: 'see_bar_status', l: 'B-Status',            d: 'Bar-Status + Datum' },
      { k: 'see_summe',      l: 'Summe',               d: 'Überw. + Bar Summe' },
      { k: 'see_ziel',       l: 'Ziel-Gehalt',         d: 'Ziel + Differenz' },
      { k: 'see_notiz',      l: 'Notizen',             d: 'Notiz-Spalte' },
      { k: 'see_typ',        l: 'Beschäftigungstyp',   d: 'Typ-Badge am Namen' },
      { k: 'see_extras',     l: 'Extras im Export',    d: 'Smart Money im Excel-Export' },
    ],
  },
  {
    cat: 'Mitarbeiter-Popup',
    perms: [
      { k: 'see_popup',   l: 'Popup öffnen',          d: 'Klick auf Name öffnet Details' },
      { k: 'pop_kpi',     l: 'KPIs',                  d: 'Brutto/Überw./Bar Summen' },
      { k: 'pop_stamm',   l: 'Stammdaten',            d: 'Mitarbeiter-Informationen' },
      { k: 'pop_chart',   l: 'Diagramm',              d: 'Brutto/Summe Verlauf' },
      { k: 'pop_history', l: 'Gehaltshistorie',       d: 'Änderungs-Timeline' },
      { k: 'pop_table',   l: 'Zahlungstabelle',       d: 'Monatliche Details' },
      { k: 'pop_cross',   l: 'Standortübergreifend',  d: 'Andere Standorte sehen' },
    ],
  },
  {
    cat: 'Bearbeitung',
    perms: [
      { k: 'edit_brutto',  l: 'Brutto ändern',          d: 'Gehalt bearbeiten' },
      { k: 'edit_status',  l: 'Überw.-Status',          d: 'Status umschalten' },
      { k: 'edit_bar',     l: 'Bar/TG-Status',          d: 'Bar-Status umschalten' },
      { k: 'edit_notiz',   l: 'Notizen schreiben',      d: 'Notizen bearbeiten' },
      { k: 'edit_values',  l: 'Werte bearbeiten',       d: 'Beträge in Abrechnung ändern' },
      { k: 'edit_stamm',   l: 'Stammdaten bearbeiten',  d: 'Mitarbeiter-Infos ändern' },
    ],
  },
  {
    cat: 'Funktionen',
    perms: [
      { k: 'fn_create_ma',  l: 'MA anlegen/löschen',    d: 'Mitarbeiter erstellen & entfernen' },
      { k: 'fn_deactivate',  l: 'MA deaktivieren',       d: 'Aktiv/Inaktiv umschalten' },
      { k: 'fn_abrechnung', l: 'Abrechnung erstellen',  d: 'Neue Monatsabrechnung' },
      { k: 'fn_import',     l: 'Excel Import',          d: 'Daten hochladen' },
      { k: 'fn_export',     l: 'Excel Export',          d: 'Daten exportieren' },
      { k: 'fn_betrieb',    l: 'Betrieb hinzufügen',    d: 'Neue Betriebe anlegen' },
      { k: 'fn_users',      l: 'Benutzerverwaltung',    d: 'Benutzer & Rechte verwalten' },
    ],
  },
  {
    cat: 'HRM-Modul',
    perms: [
      { k: 'ansicht_hrm_intern', l: 'HRM Intern',         d: 'Tab: Interne Lohnansicht' },
      { k: 'ansicht_hrm_stb',    l: 'HRM Steuerberater',   d: 'Tab: STB-Ansicht' },
      { k: 'ansicht_hrm_gehalt', l: 'Gehaltsdaten',        d: 'Spalten: Gehalt, Brutto, Netto' },
      { k: 'ansicht_hrm_summen', l: 'Summen & KPIs',       d: 'Gesamtsummen und KPI-Karten' },
      { k: 'edit_hrm_status',    l: 'Status bearbeiten',   d: 'Smart-Cells: Status ändern' },
      { k: 'hrm_daten_import',   l: 'HRM Import',          d: 'Lohndaten importieren' },
    ],
  },
];

// All permission keys flat list
export const ALL_PERMISSION_KEYS = PERMISSION_GROUPS.flatMap(g => g.perms.map(p => p.k));

// ── Rollen (Roles) ──
export const ROLES = {
  inhaber: {
    label: 'Inhaber / GF',
    icon: '👑',
    color: '#fbbf24',
    perms: Object.fromEntries(ALL_PERMISSION_KEYS.map(k => [k, true])),
    allStandorte: true,
  },
  buchhalter: {
    label: 'Buchhalter',
    icon: '📊',
    color: '#34d399',
    perms: Object.fromEntries(ALL_PERMISSION_KEYS.map(k => [k, k.startsWith('see_') || k.startsWith('pop_')])),
    allStandorte: true,
  },
  standortleiter: {
    label: 'Standortleiter',
    icon: '🏪',
    color: '#60a5fa',
    perms: Object.fromEntries(ALL_PERMISSION_KEYS.map(k => [k, !k.startsWith('fn_users') && !k.startsWith('fn_betrieb') && !k.startsWith('fn_import')])),
    allStandorte: false,
  },
  mitarbeiter: {
    label: 'Mitarbeiter',
    icon: '👤',
    color: '#a78bfa',
    perms: Object.fromEntries(ALL_PERMISSION_KEYS.map(k => [k, k === 'see_dash' || k === 'see_ma' || k === 'see_popup' || k === 'pop_kpi' || k === 'pop_stamm'])),
    allStandorte: false,
  },
};

// ── Permission Check Helper ──
export const hasPerm = (user, permKey) => {
  return user?.perms?.[permKey] === true;
};
