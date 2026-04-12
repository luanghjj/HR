// ═══════════════════════════════════════════════════════════
// gehalt-utils.js — GehaltsManager Utility Functions (Global)
// ═══════════════════════════════════════════════════════════

var gmFormatEUR = (val) => {
  if (val == null) return '—';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
};

var gmTodayStr = () => new Date().toLocaleDateString('de-DE');

var gmParseGermanDate = (str) => {
  if (!str) return null;
  const parts = str.split('.');
  if (parts.length !== 3) return null;
  const d = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  return isNaN(d) ? null : d;
};

var gmDaysUntil = (dateStr) => {
  const d = gmParseGermanDate(dateStr);
  if (!d) return null;
  const now = new Date(); now.setHours(0,0,0,0); d.setHours(0,0,0,0);
  return Math.round((d - now) / 86400000);
};

var gmGetEmployeeStatus = (emp) => {
  if (!emp.austritt) return emp.aktiv ? 'aktiv' : 'abgemeldet';
  const days = gmDaysUntil(emp.austritt);
  if (days === null) return emp.aktiv ? 'aktiv' : 'abgemeldet';
  if (days < 0) return 'abgemeldet';
  if (days <= 60) return 'warnung';
  return 'geplant';
};

var gmMonatToSortable = (monat) => {
  if (!monat) return '';
  const parts = monat.split(' ');
  const idx = GM_MONAT_NAMEN.indexOf(parts[0]);
  if (idx >= 0) return `${parts[1]||'0000'}-${String(idx+1).padStart(2,'0')}`;
  return monat;
};

var gmCompareMonat = (a, b) => gmMonatToSortable(a).localeCompare(gmMonatToSortable(b));

var gmDateToYM = (dateStr) => {
  if (!dateStr) return '';
  const p = dateStr.split('.');
  if (p.length !== 3) return '';
  return `${p[2]}-${p[1].padStart(2,'0')}`;
};

var gmCheckBirthday = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('.');
  const day = dateStr.includes('-') ? parseInt(parts[2]) : parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const birthYear = dateStr.includes('-') ? parseInt(parts[0]) : parseInt(parts[2]);
  if (isNaN(day) || isNaN(month) || isNaN(birthYear)) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let nextBirthday = new Date(today.getFullYear(), month, day);
  if (nextBirthday < today) nextBirthday = new Date(today.getFullYear()+1, month, day);
  return {
    days: Math.round((nextBirthday - today) / 86400000),
    age: nextBirthday.getFullYear() - birthYear,
    date: nextBirthday, birthDay: day, birthMonth: month + 1,
  };
};

var gmGetTenure = (eintrittStr) => {
  if (!eintrittStr) return null;
  const parts = eintrittStr.includes('-') ? eintrittStr.split('-') : eintrittStr.split('.');
  const d = eintrittStr.includes('-')
    ? new Date(parts[0], parts[1]-1, parts[2])
    : new Date(parts[2], parts[1]-1, parts[0]);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  const months = (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth());
  if (months < 1) return 'Neu im Team';
  if (months < 12) return `Seit ${months} Monat${months===1?'':'en'} im Team`;
  const years = Math.floor(months/12);
  return `Seit ${years} Jahr${years===1?'':'en'} im Team`;
};

var gmCalcAGKosten = (brutto, extras) => {
  const isMinijob = brutto <= 556;
  const sv = {};
  let svTotal = 0;
  if (isMinijob) {
    sv.pauschal = 0.3 * brutto;
    svTotal = sv.pauschal;
  } else {
    Object.entries(GM_SV_SAETZE).forEach(([key, rate]) => {
      sv[key] = Math.round(brutto * rate) / 100;
      svTotal += sv[key];
    });
  }
  let extrasTotal = 0;
  if (extras) {
    Object.entries(extras).forEach(([key, val]) => {
      if (key === 'custom') (val||[]).forEach(item => { extrasTotal += parseFloat(item.betrag)||0; });
      else if (key !== 'diensthandy') extrasTotal += parseFloat(val)||0;
    });
  }
  return {
    brutto, sv, svTotal: Math.round(svTotal*100)/100, extras: extrasTotal,
    gesamt: Math.round((brutto+svTotal+extrasTotal)*100)/100,
    quote: brutto ? Math.round(svTotal/brutto*1000)/10 : 0, isMinijob,
  };
};

var gmNormalizeName = (name) => String(name||'').toLowerCase().replace(/[,\s]+/g,' ').trim();
var gmGeneratePersonId = () => `p_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

var gmCheckArbeitserlaubnis = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('.');
  const d = dateStr.includes('-') ? new Date(parts[0],parts[1]-1,parts[2]) : new Date(parts[2],parts[1]-1,parts[0]);
  if (isNaN(d.getTime())) return null;
  const diffDays = Math.ceil((d - new Date()) / 86400000);
  if (diffDays < 0)  return { level:'expired',  days:Math.abs(diffDays), date:d, color:'#ef4444' };
  if (diffDays < 30) return { level:'critical', days:diffDays, date:d, color:'#ef4444' };
  if (diffDays < 90) return { level:'warning',  days:diffDays, date:d, color:'#f59e0b' };
  return null;
};
