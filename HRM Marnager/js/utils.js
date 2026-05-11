// ═══════════════════════════════════════════════════════════
// utils.js — Utility & Helper Functions
// GehaltsManager — SieuVuong
// ═══════════════════════════════════════════════════════════

import { MONAT_NAMEN, MONAT_INDEX, SV_SAETZE, MAIN_LOHNART_NRS } from './constants.js';

// ── Currency Formatting ──
export const formatEUR = (val) => {
  if (val == null) return '—';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
};

// ── Date: Today as DD.MM.YYYY ──
export const todayStr = () => new Date().toLocaleDateString('de-DE');

// ── Date: Parse DD.MM.YYYY → Date ──
export const parseGermanDate = (str) => {
  if (!str) return null;
  const parts = str.split('.');
  if (parts.length !== 3) return null;
  const d = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  return isNaN(d) ? null : d;
};

// ── Date: Days until a DD.MM.YYYY date ──
export const daysUntil = (dateStr) => {
  const d = parseGermanDate(dateStr);
  if (!d) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - now) / 86400000);
};

// ── Employee Status ──
export const getEmployeeStatus = (emp) => {
  if (!emp.austritt) {
    return emp.aktiv ? 'aktiv' : 'abgemeldet';
  }
  const days = daysUntil(emp.austritt);
  if (days === null) return emp.aktiv ? 'aktiv' : 'abgemeldet';
  if (days < 0) return 'abgemeldet';
  if (days <= 60) return 'warnung';
  return 'geplant';
};

// ── Month: "Apr 2026" → "2026-04" (sortable) ──
export const monatToSortable = (monat) => {
  if (!monat) return '';
  const parts = monat.split(' ');
  const idx = MONAT_NAMEN.indexOf(parts[0]);
  if (idx >= 0) {
    return `${parts[1] || '0000'}-${String(idx + 1).padStart(2, '0')}`;
  }
  return monat;
};

// ── Month: Compare two month strings ──
export const compareMonat = (a, b) => monatToSortable(a).localeCompare(monatToSortable(b));

// ── Date: DD.MM.YYYY → "YYYY-MM" ──
export const dateToYM = (dateStr) => {
  if (!dateStr) return '';
  const p = dateStr.split('.');
  if (p.length !== 3) return '';
  return `${p[2]}-${p[1].padStart(2, '0')}`;
};

// ── Filter employees by Eintritt/Austritt relative to a month ──
export const filterByDateRange = (records, monat, maList) => {
  if (!maList?.length) return records;
  const monatSort = monatToSortable(monat);
  return records.filter(rec => {
    const ma = maList.find(m => m.persNr === rec.persNr && m.betrieb === rec.betrieb);
    if (ma?.eintritt) {
      const ym = dateToYM(ma.eintritt);
      if (ym && ym > monatSort) return false;
    }
    if (ma?.austritt) {
      const ym = dateToYM(ma.austritt);
      if (ym && ym < monatSort) return false;
    }
    return true;
  });
};

// ── Adjust Eintritt date to end-of-month if day exceeds ──
export const adjustDateToMonth = (dateStr, monatStr) => {
  if (!dateStr || !monatStr) return dateStr || '';
  const parts = dateStr.split('.');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[0]);
  const mParts = monatStr.split(' ');
  if (mParts.length !== 2) return dateStr;
  const monthIdx = MONAT_INDEX[mParts[0]];
  const year = parseInt(mParts[1]);
  if (monthIdx === undefined || isNaN(year)) return dateStr;
  const lastDay = new Date(year, monthIdx + 1, 0).getDate();
  return `${String(Math.min(day, lastDay)).padStart(2, '0')}.${String(monthIdx + 1).padStart(2, '0')}.${year}`;
};

// ── Generate unique Person ID ──
export const generatePersonId = () =>
  `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ── Normalize name for matching ──
export const normalizeName = (name) =>
  String(name || '').toLowerCase().replace(/[,\s]+/g, ' ').trim();

// ── Split "Nachname, Vorname" ──
export const splitName = (name) => {
  const parts = (name || '').split(',');
  return {
    nn: (parts[0] || '').trim(),
    vn: (parts[1] || '').trim(),
  };
};

// ── Check if Lohnart is a "main" wage type ──
export const isMainLohnart = (la) => {
  return la?.isMain === true || (!la?.isMain && MAIN_LOHNART_NRS.includes(la?.nr));
};

// ── Find index of main Lohnart in array ──
export const findMainLohnartIndex = (lohnarten) => {
  if (!lohnarten?.length) return -1;
  const mainIdx = lohnarten.findIndex(la => la.isMain === true);
  if (mainIdx >= 0) return mainIdx;
  return lohnarten.findIndex(la => MAIN_LOHNART_NRS.includes(la.nr));
};

// ── Arbeitserlaubnis check ──
export const checkArbeitserlaubnis = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('.');
  const d = dateStr.includes('-')
    ? new Date(parts[0], parts[1] - 1, parts[2])
    : new Date(parts[2], parts[1] - 1, parts[0]);
  if (isNaN(d.getTime())) return null;
  const diffDays = Math.ceil((d - new Date()) / 86400000);
  if (diffDays < 0)  return { level: 'expired',  days: Math.abs(diffDays), date: d, color: '#ef4444' };
  if (diffDays < 30) return { level: 'critical', days: diffDays,           date: d, color: '#ef4444' };
  if (diffDays < 90) return { level: 'warning',  days: diffDays,           date: d, color: '#f59e0b' };
  return null;
};

// ── Birthday check ──
export const checkBirthday = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('.');
  const day = dateStr.includes('-') ? parseInt(parts[2]) : parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const birthYear = dateStr.includes('-') ? parseInt(parts[0]) : parseInt(parts[2]);
  if (isNaN(day) || isNaN(month) || isNaN(birthYear)) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let nextBirthday = new Date(today.getFullYear(), month, day);
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, month, day);
  }
  return {
    days: Math.round((nextBirthday - today) / 86400000),
    age: nextBirthday.getFullYear() - birthYear,
    date: nextBirthday,
    birthDay: day,
    birthMonth: month + 1,
  };
};

// ── Tenure description ──
export const getTenure = (eintrittStr) => {
  if (!eintrittStr) return null;
  const parts = eintrittStr.includes('-') ? eintrittStr.split('-') : eintrittStr.split('.');
  const d = eintrittStr.includes('-')
    ? new Date(parts[0], parts[1] - 1, parts[2])
    : new Date(parts[2], parts[1] - 1, parts[0]);
  if (isNaN(d.getTime())) return null;

  const now = new Date();
  const months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  if (months < 1) return 'Neu im Team';
  if (months < 12) return `Seit ${months} Monat${months === 1 ? '' : 'en'} im Team`;
  const years = Math.floor(months / 12);
  return `Seit ${years} Jahr${years === 1 ? '' : 'en'} im Team`;
};

// ── AG-Kosten Berechnung (Employer Cost Calculation) ──
export const calcAGKosten = (brutto, extras) => {
  const isMinijob = brutto <= 556;
  const sv = {};
  let svTotal = 0;

  if (isMinijob) {
    sv.pauschal = 0.3 * brutto;
    svTotal = sv.pauschal;
  } else {
    Object.entries(SV_SAETZE).forEach(([key, rate]) => {
      sv[key] = Math.round(brutto * rate) / 100;
      svTotal += sv[key];
    });
  }

  let extrasTotal = 0;
  if (extras) {
    Object.entries(extras).forEach(([key, val]) => {
      if (key === 'custom') {
        (val || []).forEach(item => { extrasTotal += parseFloat(item.betrag) || 0; });
      } else if (key !== 'diensthandy') {
        extrasTotal += parseFloat(val) || 0;
      }
    });
  }

  return {
    brutto,
    sv,
    svTotal: Math.round(svTotal * 100) / 100,
    extras: extrasTotal,
    gesamt: Math.round((brutto + svTotal + extrasTotal) * 100) / 100,
    quote: brutto ? Math.round(svTotal / brutto * 1000) / 10 : 0,
    isMinijob,
  };
};
