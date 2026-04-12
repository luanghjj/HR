// ═══════════════════════════════════════════════════════════
// app.js — GehaltsManager Main Application
// GehaltsManager — SieuVuong
// ═══════════════════════════════════════════════════════════

import { supabase } from './supabase.js';
import { mapGehaltFromDB, mapMitarbeiterFromDB } from './mappers.js';
import { BETRIEBE, MONAT_NAMEN, getStatusConfig, getTypFarben } from './constants.js';
import { formatEUR, todayStr, checkBirthday, getTenure, calcAGKosten, compareMonat } from './utils.js';

// ── STATE ──
const state = {
  currentTab: 'dashboard',
  currentMonat: '',
  monate: [],
  gehaltData: [],
  mitarbeiterData: [],
  dark: localStorage.getItem('gm_dark') === 'true',
  mobileMenuOpen: false,
  user: { name: 'Phuc Nguyen', role: 'Inhaber / GF', icon: '👑' },
  loading: true,
  betriebFilter: 'Alle',
};

// ── TAB CONFIG ──
const TABS = [
  { id: 'dashboard',   icon: '📊', label: 'Dashboard' },
  { id: 'abrechnung',  icon: '💰', label: 'Abrechnung' },
  { id: 'mitarbeiter', icon: '👥', label: 'Mitarbeiter' },
  { id: 'banken',      icon: '🏦', label: 'Banken' },
  { id: 'hrm',         icon: '📋', label: 'HRM' },
  { id: 'smart',       icon: '🎁', label: 'Smart Money' },
  { id: 'einstellungen', icon: '⚙️', label: 'Einstellungen' },
];

const BETRIEB_COLORS = {
  Blossom: '#3b7ddd',
  Enso:    '#4f46e5',
  Okyu:    '#10b981',
  Origami: '#d97706',
};

const SIEUVUONG_CHARS = [
  { c: 'S', color: '#e91e63' },
  { c: 'i', color: '#ff9800' },
  { c: 'e', color: '#ffc107' },
  { c: 'u', color: '#4caf50' },
  { c: 'V', color: '#4caf50' },
  { c: 'u', color: '#009688' },
  { c: 'o', color: '#2196f3' },
  { c: 'n', color: '#1565c0' },
  { c: 'g', color: '#1a237e' },
];

// ── HELPERS ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const el = (tag, attrs = {}, ...children) => {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'style' && typeof v === 'object') {
      Object.assign(e.style, v);
    } else if (k.startsWith('on')) {
      e.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'className') {
      e.className = v;
    } else if (k === 'innerHTML') {
      e.innerHTML = v;
    } else {
      e.setAttribute(k, v);
    }
  });
  children.flat().forEach(c => {
    if (c == null) return;
    if (typeof c === 'string' || typeof c === 'number') {
      e.appendChild(document.createTextNode(c));
    } else {
      e.appendChild(c);
    }
  });
  return e;
};

// ── DATA LOADING ──
async function loadMonate() {
  const { data, error } = await supabase
    .from('gehaelter')
    .select('monat')
    .order('monat', { ascending: false });
  if (error) { console.error('Monate error:', error); return []; }
  const unique = [...new Set(data.map(d => d.monat))].sort(compareMonat).reverse();
  return unique;
}

async function loadGehaltData(monat) {
  const { data, error } = await supabase
    .from('gehaelter')
    .select('*')
    .eq('monat', monat);
  if (error) { console.error('Gehalt error:', error); return []; }
  return data.map(mapGehaltFromDB);
}

async function loadMitarbeiterData() {
  const { data, error } = await supabase
    .from('mitarbeiter')
    .select('*')
    .eq('aktiv', true);
  if (error) { console.error('MA error:', error); return []; }
  return data.map(mapMitarbeiterFromDB);
}

async function loadUsersData() {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  if (error) { console.error('Users error:', error); return []; }
  return data || [];
}

async function initApp() {
  if (state.dark) document.body.classList.add('dark');

  state.monate = await loadMonate();
  state.currentMonat = state.monate[0] || 'Mär 2026';
  state.mitarbeiterData = await loadMitarbeiterData();
  state.gehaltData = await loadGehaltData(state.currentMonat);
  state.usersData = await loadUsersData();
  state.loading = false;

  renderApp();
}

// ── RENDER ──
function renderApp() {
  const app = $('#app');
  app.innerHTML = '';
  app.className = 'gm-app';

  // Sidebar (desktop)
  app.appendChild(renderSidebar('gm-sidebar'));

  // Mobile overlay + sidebar
  const overlay = el('div', {
    className: `gm-overlay ${state.mobileMenuOpen ? 'show' : ''}`,
    onClick: () => { state.mobileMenuOpen = false; renderApp(); }
  });
  app.appendChild(overlay);

  const mobileSidebar = renderSidebar('gm-sidebar-mobile' + (state.mobileMenuOpen ? ' open' : ''));
  app.appendChild(mobileSidebar);

  // Main
  const main = el('main', { className: 'gm-main' });

  // Mobile header
  main.appendChild(renderMobileHeader());

  // Body
  const body = el('div', { className: 'gm-body' });

  if (state.loading) {
    body.appendChild(renderLoading());
  } else {
    switch (state.currentTab) {
      case 'dashboard':   body.appendChild(renderDashboard()); break;
      case 'abrechnung':  body.appendChild(renderAbrechnung()); break;
      case 'mitarbeiter': body.appendChild(renderMitarbeiterTab()); break;
      case 'banken':      body.appendChild(renderBanken()); break;
      case 'hrm':          body.appendChild(renderHRM()); break;
      case 'einstellungen': body.appendChild(renderEinstellungen()); break;
      default:            body.appendChild(renderPlaceholder(state.currentTab)); break;
    }
  }

  main.appendChild(body);
  app.appendChild(main);
}

function renderSidebar(className) {
  const side = el('aside', { className });

  // Header
  const header = el('div', { className: 'gm-sidebar-header' });
  const titleRow = el('div', { className: 'gm-sidebar-title' });
  titleRow.appendChild(el('div', { className: 'gm-sidebar-title-text' },
    '🍣 ',
    el('span', { style: { marginLeft: '4px' } }, 'HRM Manager')
  ));
  titleRow.appendChild(el('button', { className: 'gm-sidebar-close', onClick: () => { state.mobileMenuOpen = false; renderApp(); } }, '✕'));
  header.appendChild(titleRow);

  // User info
  header.appendChild(el('div', { className: 'gm-sidebar-user' }, `${state.user.name} · ${state.user.icon} ${state.user.role}`));

  // Month select
  const monatSel = el('select', {
    className: 'gm-sidebar-monat',
    onChange: async (e) => {
      state.currentMonat = e.target.value;
      state.loading = true;
      renderApp();
      state.gehaltData = await loadGehaltData(state.currentMonat);
      state.loading = false;
      renderApp();
    }
  });
  state.monate.forEach(m => {
    const opt = el('option', { value: m }, m + ' 🏢');
    if (m === state.currentMonat) opt.selected = true;
    monatSel.appendChild(opt);
  });
  header.appendChild(monatSel);

  // SieuVuong logo
  const logo = el('span', { className: 'gm-logo' });
  SIEUVUONG_CHARS.forEach(({ c, color }) => {
    logo.appendChild(el('span', { style: { color } }, c));
  });
  header.appendChild(logo);

  side.appendChild(header);

  // Nav
  const nav = el('div', { className: 'gm-nav' });
  TABS.forEach(tab => {
    const btn = el('button', {
      className: `gm-nav-btn ${state.currentTab === tab.id ? 'active' : ''}`,
      onClick: () => {
        state.currentTab = tab.id;
        state.mobileMenuOpen = false;
        renderApp();
      }
    }, el('span', {}, tab.icon), tab.label);
    nav.appendChild(btn);
  });
  side.appendChild(nav);

  // Footer
  const footer = el('div', { className: 'gm-sidebar-footer' });
  footer.appendChild(el('button', {
    onClick: () => {
      state.dark = !state.dark;
      localStorage.setItem('gm_dark', state.dark);
      document.body.classList.toggle('dark', state.dark);
      renderApp();
    }
  }, state.dark ? '☀️ Hell' : '🌙 Dunkel'));
  footer.appendChild(el('button', {}, '🚪 Abmelden'));
  footer.appendChild(el('div', { className: 'gm-version' }, 'v2.9.53'));
  side.appendChild(footer);

  return side;
}

function renderMobileHeader() {
  const header = el('div', { className: 'gm-mobile-header' });
  header.appendChild(el('button', {
    className: 'gm-hamburger',
    onClick: () => { state.mobileMenuOpen = true; renderApp(); }
  }, '☰'));
  header.appendChild(el('span', { className: 'gm-mobile-title' }, 'HRM Manager'));

  const monatSel = el('select', {
    className: 'gm-mobile-monat',
    onChange: async (e) => {
      state.currentMonat = e.target.value;
      state.loading = true;
      renderApp();
      state.gehaltData = await loadGehaltData(state.currentMonat);
      state.loading = false;
      renderApp();
    }
  });
  state.monate.forEach(m => {
    const opt = el('option', { value: m }, m + ' 🏢');
    if (m === state.currentMonat) opt.selected = true;
    monatSel.appendChild(opt);
  });
  header.appendChild(monatSel);
  return header;
}

function renderLoading() {
  return el('div', { className: 'gm-loading anim-fade' },
    el('div', { className: 'gm-spinner' }),
    el('div', {}, 'Daten werden geladen...')
  );
}

function renderPlaceholder(tab) {
  const title = TABS.find(t => t.id === tab)?.label || tab;
  return el('div', { className: 'gm-empty anim-up' },
    el('div', { className: 'gm-empty-icon' }, TABS.find(t => t.id === tab)?.icon || '📋'),
    el('div', { className: 'gm-empty-text' }, `${title} — Wird in Kürze implementiert`)
  );
}

// ════════════════════════════════════════════
//  DASHBOARD
// ════════════════════════════════════════════
function renderDashboard() {
  const data = state.gehaltData;
  const container = el('div', { className: 'anim-up' });

  // Month pill header
  const headerRow = el('div', {
    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
  });
  headerRow.appendChild(el('div', { style: { display: 'flex', gap: '6px', alignItems: 'center' } },
    el('button', {
      className: 'gm-btn',
      style: { border: '1px solid var(--ac)', background: 'var(--acG)', color: 'var(--ac)', fontWeight: 700 }
    }, state.currentMonat)
  ));
  container.appendChild(headerRow);

  // KPIs
  const totalBrutto = data.reduce((s, d) => s + d.brutto, 0);
  const totalNetto = data.reduce((s, d) => s + d.netto, 0);
  const maCount = data.length;

  // AG-Kosten calculation
  let totalAGKosten = 0;
  data.forEach(d => {
    const ma = state.mitarbeiterData.find(m => m.persNr === d.persNr && m.betrieb === d.betrieb);
    const ag = calcAGKosten(d.brutto, ma?.extras);
    totalAGKosten += ag.gesamt;
  });

  container.appendChild(renderKPIRow([
    { label: 'Brutto', value: formatEUR(totalBrutto), sub: `${state.currentMonat} · ${maCount} MA`, color: 'var(--ac)' },
    { label: 'Netto', value: formatEUR(totalNetto), color: 'var(--ok)' },
    { label: 'AG-Kosten gesamt', value: formatEUR(totalAGKosten), sub: 'inkl. SV + Extras', color: '#a78bfa' },
  ]));

  // Status Grid (Überweisungen / Bar-TG)
  container.appendChild(renderStatusGrid(data));

  // Zahlungsvergleich Table
  container.appendChild(renderZahlungsvergleich(data));

  // Birthday Section
  container.appendChild(renderBirthdaySection());

  // Betrieb-Vergleich Chart Section
  container.appendChild(renderBetriebVergleich(data));

  // 2-Column Grid: Brutto-Trend (stacked) + Verteilung (pie)
  const chartGrid = el('div', {
    style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }
  });
  chartGrid.appendChild(renderBruttoTrendCard(data));
  chartGrid.appendChild(renderVerteilungCard(data));
  container.appendChild(chartGrid);

  // Betrieb Summary Table
  container.appendChild(renderBetriebSummary(data));

  // Standortübergreifende Mitarbeiter
  container.appendChild(renderCrossSiteEmployees());

  return container;
}

function renderKPIRow(items) {
  const row = el('div', { className: 'gm-kpi-row' });
  items.forEach((item, i) => {
    const kpi = el('div', {
      className: 'gm-kpi',
      style: { borderLeftColor: item.color, animationDelay: `${i * 0.08}s` }
    });
    kpi.appendChild(el('div', { className: 'gm-kpi-label' }, item.label));
    kpi.appendChild(el('div', { className: 'gm-kpi-value' }, item.value));
    if (item.sub) kpi.appendChild(el('div', { className: 'gm-kpi-sub' }, item.sub));
    row.appendChild(kpi);
  });
  return row;
}

function renderStatusGrid(data) {
  const statusCfg = getStatusConfig();
  const grid = el('div', { className: 'gm-status-grid' });

  // Überweisungen
  const ueData = data.filter(d => d.ueberweisung > 0);
  const ueTotal = ueData.reduce((s, d) => s + d.ueberweisung, 0);
  const ueDone = ueData.filter(d => d.ue_status === 'ueberwiesen' || d.ue_status === 'dauerauftrag');
  const ueDoneAmt = ueDone.reduce((s, d) => s + d.ueberweisung, 0);
  const ueOpen = ueData.filter(d => d.ue_status === 'offen');
  const ueOpenAmt = ueOpen.reduce((s, d) => s + d.ueberweisung, 0);
  const uePct = ueTotal > 0 ? Math.round(ueDoneAmt / ueTotal * 100) : 0;

  grid.appendChild(renderStatusCard(
    '🏦 Überweisungen', formatEUR(ueTotal), 'var(--ac)',
    uePct,
    `✓ ${ueDone.length} erledigt · ${formatEUR(ueDoneAmt)}`,
    `○ ${ueOpen.length} offen · ${formatEUR(ueOpenAmt)}`
  ));

  // Bar/TG
  const barData = data.filter(d => d.bar_tg > 0);
  const barTotal = barData.reduce((s, d) => s + d.bar_tg, 0);
  const barDone = barData.filter(d => d.bar_status === 'gezahlt' || d.bar_status === 'vorbereitet');
  const barDoneAmt = barDone.reduce((s, d) => s + d.bar_tg, 0);
  const barOpen = barData.filter(d => d.bar_status === 'offen');
  const barOpenAmt = barOpen.reduce((s, d) => s + d.bar_tg, 0);
  const barPct = barTotal > 0 ? Math.round(barDoneAmt / barTotal * 100) : 0;

  grid.appendChild(renderStatusCard(
    '💵 Bar / Taschengeld', formatEUR(barTotal), 'var(--wn)',
    barPct,
    `✓ ${barDone.length} erledigt · ${formatEUR(barDoneAmt)}`,
    `○ ${barOpen.length} offen · ${formatEUR(barOpenAmt)}`
  ));

  return grid;
}

function renderStatusCard(title, amount, color, pct, doneText, openText) {
  const card = el('div', { className: 'gm-status-card' });

  const header = el('div', { className: 'gm-status-header' });
  header.appendChild(el('span', { className: 'gm-status-title' }, title));
  header.appendChild(el('span', { className: 'gm-status-amount', style: { color } }, amount));
  card.appendChild(header);

  // Progress bar
  const barRow = el('div', { className: 'gm-status-bar' });
  const bar = el('div', { style: { flex: `${pct || 0.01} 1 0`, height: '6px', borderRadius: '3px', background: 'var(--ok)', transition: 'flex 0.3s' } });
  const barEmpty = el('div', { style: { flex: `${Math.max(100 - pct, 0.01)} 1 0`, height: '6px', borderRadius: '3px', background: 'transparent', transition: 'flex 0.3s' } });
  barRow.appendChild(bar);
  barRow.appendChild(barEmpty);
  card.appendChild(barRow);

  // Legend
  const legend = el('div', { className: 'gm-status-legend' });
  legend.appendChild(el('span', { style: { color: 'var(--ok)' } }, doneText));
  legend.appendChild(el('span', { style: { color: 'var(--tx3)' } }, openText));
  card.appendChild(legend);

  return card;
}

function renderZahlungsvergleich(data) {
  const card = el('div', { className: 'gm-card' });
  card.appendChild(el('div', { className: 'gm-title' }, `💰 Zahlungsvergleich — ${state.currentMonat}`));

  const wrap = el('div', { style: { overflow: 'auto', marginBottom: '12px' } });
  const table = el('table', { className: 'gm-table' });

  // Header
  const thead = el('thead');
  const hr = el('tr');
  ['Standort', 'MA', '🏦 Überweisung', '💵 Bar/TG', 'Σ Summe', 'Status', 'Fortschritt'].forEach((h, i) => {
    const th = el('th', { style: { textAlign: i >= 2 && i <= 4 ? 'right' : i === 5 ? 'center' : 'left' } }, h);
    if (i === 4) th.style.fontWeight = '700';
    if (i === 6) th.style.minWidth = '120px';
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  // Body
  const tbody = el('tbody');
  let gUe = 0, gBar = 0, gSum = 0, gMA = 0, allDone = true;

  BETRIEBE.forEach(betrieb => {
    const bd = data.filter(d => d.betrieb === betrieb);
    if (bd.length === 0) return;

    const ue = bd.reduce((s, d) => s + d.ueberweisung, 0);
    const bar = bd.reduce((s, d) => s + d.bar_tg, 0);
    const sum = ue + bar;
    const total = sum;

    // Check completion
    const ueDone = bd.filter(d => d.ueberweisung > 0).every(d => d.ue_status !== 'offen');
    const barDone = bd.filter(d => d.bar_tg > 0).every(d => d.bar_status !== 'offen');
    const isDone = ueDone && barDone;
    if (!isDone) allDone = false;

    const paid = bd.reduce((s, d) => {
      let p = 0;
      if (d.ue_status !== 'offen') p += d.ueberweisung;
      if (d.bar_status !== 'offen') p += d.bar_tg;
      return s + p;
    }, 0);
    const pct = total > 0 ? Math.round(paid / total * 100) : 100;

    gUe += ue; gBar += bar; gSum += sum; gMA += bd.length;

    const tr = el('tr');
    tr.appendChild(el('td', { style: { fontWeight: 700 } },
      el('span', { className: 'gm-badge gm-badge-ac' }, betrieb)
    ));
    tr.appendChild(el('td', { className: 'mono center', style: { fontSize: '10px' } }, String(bd.length)));
    tr.appendChild(el('td', { className: 'mono right', style: { color: 'var(--ac)' } }, formatEUR(ue)));
    tr.appendChild(el('td', { className: 'mono right', style: { color: 'var(--wn)' } }, formatEUR(bar)));
    tr.appendChild(el('td', { className: 'mono right bold' }, formatEUR(sum)));
    tr.appendChild(el('td', { className: 'center' },
      el('span', { style: { color: isDone ? 'var(--ok)' : 'var(--wn)', fontSize: '10px' } },
        isDone ? '✓ komplett' : '⏳ ausstehend')
    ));
    tr.appendChild(el('td', {}, renderProgressWidget(pct, `Bezahlt: ${formatEUR(paid)} von ${formatEUR(total)}`)));
    tbody.appendChild(tr);
  });

  // Total row
  const gPaid = data.reduce((s, d) => {
    let p = 0;
    if (d.ue_status !== 'offen') p += d.ueberweisung;
    if (d.bar_status !== 'offen') p += d.bar_tg;
    return s + p;
  }, 0);
  const gPct = gSum > 0 ? Math.round(gPaid / gSum * 100) : 100;

  const totalTr = el('tr', { className: 'total-row' });
  totalTr.appendChild(el('td', { style: { fontSize: '11px' } }, 'GESAMT'));
  totalTr.appendChild(el('td', { className: 'mono center', style: { fontSize: '10px' } }, String(gMA)));
  totalTr.appendChild(el('td', { className: 'mono right', style: { color: 'var(--ac)' } }, formatEUR(gUe)));
  totalTr.appendChild(el('td', { className: 'mono right', style: { color: 'var(--wn)' } }, formatEUR(gBar)));
  totalTr.appendChild(el('td', { className: 'mono right', style: { fontSize: '12px' } }, formatEUR(gSum)));
  totalTr.appendChild(el('td', { className: 'center' },
    el('span', {
      style: { color: allDone ? 'var(--ok)' : 'var(--wn)', fontSize: '10px', fontWeight: 700 }
    }, allDone ? '✓ Alle bezahlt' : '⏳ Noch offen')
  ));
  totalTr.appendChild(el('td', {}, renderProgressWidget(gPct, `Bezahlt: ${formatEUR(gPaid)} von ${formatEUR(gSum)}`)));
  tbody.appendChild(totalTr);

  table.appendChild(tbody);
  wrap.appendChild(table);
  card.appendChild(wrap);

  // Mini Bar Chart with Canvas
  const chartWrap = el('div', { style: { height: '180px' } });
  card.appendChild(chartWrap);
  requestAnimationFrame(() => renderBarChart(chartWrap, data));

  return card;
}

function renderProgressWidget(pct, title) {
  const container = el('div', { className: 'gm-progress', title });
  const bar = el('div', { className: 'gm-progress-bar' });
  const fill = el('div', {
    className: 'gm-progress-fill',
    style: { width: '0%', background: pct === 100 ? 'var(--ok)' : pct > 50 ? 'var(--ac)' : 'var(--wn)' }
  });
  bar.appendChild(fill);
  container.appendChild(bar);
  container.appendChild(el('span', { className: 'gm-progress-text' }, pct + '%'));
  // Animate in
  requestAnimationFrame(() => { fill.style.width = pct + '%'; });
  return container;
}

function renderBarChart(container, data) {
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);

  const W = rect.width, H = rect.height;
  const pad = { top: 10, right: 20, bottom: 40, left: 70 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  // Group data by betrieb
  const groups = BETRIEBE.map(b => {
    const bd = data.filter(d => d.betrieb === b);
    return {
      name: b,
      ue: bd.reduce((s, d) => s + d.ueberweisung, 0),
      bar: bd.reduce((s, d) => s + d.bar_tg, 0),
      color: BETRIEB_COLORS[b],
    };
  }).filter(g => g.ue + g.bar > 0);

  if (groups.length === 0) return;

  const maxVal = Math.max(...groups.map(g => g.ue + g.bar)) * 1.1;
  const barW = Math.min(30, chartW / groups.length * 0.6);
  const gap = chartW / groups.length;

  // Y-Axis
  const isDark = state.dark;
  ctx.strokeStyle = isDark ? '#2d3140' : '#e2e4e9';
  ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';

  for (let i = 0; i <= 4; i++) {
    const val = (maxVal / 4) * i;
    const y = pad.top + chartH - (val / maxVal) * chartH;
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    ctx.setLineDash([]);

    const label = val >= 1000 ? Math.round(val / 1000) + 'k' : Math.round(val);
    ctx.fillText(label, pad.left - 6, y + 3);
  }

  // Bars
  groups.forEach((g, i) => {
    const x = pad.left + gap * i + gap / 2 - barW / 2;
    const ueH = (g.ue / maxVal) * chartH;
    const barH = (g.bar / maxVal) * chartH;

    // Überweisungen (blue)
    ctx.fillStyle = '#3b7ddd';
    const ueY = pad.top + chartH - ueH;
    ctx.beginPath();
    ctx.roundRect(x, ueY, barW * 0.45, ueH, [0, 0, 0, 0]);
    ctx.fill();

    // Bar/TG (amber)
    ctx.fillStyle = '#f59e0b';
    const barY = pad.top + chartH - barH;
    ctx.beginPath();
    ctx.roundRect(x + barW * 0.5, barY, barW * 0.45, barH, [3, 3, 0, 0]);
    ctx.fill();

    // Label
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
    ctx.font = '10px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(g.name, pad.left + gap * i + gap / 2, H - pad.bottom + 16);
  });

  // Legend
  const legendY = H - 8;
  ctx.font = '9px "DM Sans", sans-serif';
  ctx.textAlign = 'left';

  ctx.fillStyle = '#3b7ddd';
  ctx.fillRect(W / 2 - 80, legendY - 6, 10, 8);
  ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
  ctx.fillText('🏦 Überweisung', W / 2 - 66, legendY);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(W / 2 + 20, legendY - 6, 10, 8);
  ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
  ctx.fillText('💵 Bar/TG', W / 2 + 34, legendY);
}

function renderBirthdaySection() {
  const now = new Date();
  const birthdays = [];

  state.mitarbeiterData.forEach(ma => {
    const bd = checkBirthday(ma.stamm?.geburtsdatum);
    if (bd && bd.days <= 30) {
      birthdays.push({
        name: ma.name,
        betrieb: ma.betrieb,
        days: bd.days,
        age: bd.age,
        day: bd.birthDay,
        month: bd.birthMonth,
        tenure: getTenure(ma.eintritt),
      });
    }
  });

  if (birthdays.length === 0) return el('div');

  birthdays.sort((a, b) => a.days - b.days);

  const card = el('div', { className: 'gm-birthday-card anim-up' });

  const header = el('div', { className: 'gm-birthday-header' });
  header.appendChild(el('span', { style: { fontSize: '16px' } }, '🎂'));
  header.appendChild(el('div', { className: 'gm-birthday-title' }, 'Anstehende Geburtstage'));
  header.appendChild(el('span', { className: 'gm-birthday-count' }, `${birthdays.length} in den nächsten 30 Tagen`));
  card.appendChild(header);

  birthdays.forEach(b => {
    const item = el('div', { className: 'gm-birthday-item' });
    item.appendChild(el('span', { style: { fontSize: '12px' } }, '🎁'));

    const info = el('div', { style: { flex: 1 } });
    const nameRow = el('div', { className: 'gm-birthday-name' },
      b.name + ' ',
      el('span', { className: 'gm-badge', style: { background: 'var(--acG)', color: 'var(--ac)', fontSize: '8px' } }, b.betrieb)
    );
    info.appendChild(nameRow);

    const detail = el('div', { className: 'gm-birthday-detail' },
      `🎂 ${String(b.day).padStart(2, '0')}.${String(b.month).padStart(2, '0')}. · Wird ${b.age}`
    );
    if (b.tenure) {
      detail.appendChild(el('span', {}, ` · 💼 ${b.tenure}`));
    }
    info.appendChild(detail);

    item.appendChild(info);
    item.appendChild(el('div', { className: 'gm-birthday-days' },
      b.days === 0 ? '🎉 Heute!' : b.days === 1 ? 'Morgen' : `In ${b.days} Tagen`
    ));
    card.appendChild(item);
  });

  return card;
}

// ════════════════════════════════════════════
//  BRUTTO-TREND (gestapelt) — Stacked Bar Chart
// ════════════════════════════════════════════
function renderBruttoTrendCard(data) {
  const card = el('div', { className: 'gm-card' });
  card.appendChild(el('div', { className: 'gm-title' }, 'Brutto-Trend (gestapelt)'));

  const chartWrap = el('div', { style: { height: '220px' } });
  card.appendChild(chartWrap);
  requestAnimationFrame(() => renderStackedBarChart(chartWrap, data));

  // Legend
  const legend = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '8px' } });
  BETRIEBE.forEach(b => {
    const bd = data.filter(d => d.betrieb === b);
    if (bd.length === 0) return;
    const item = el('div', { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px' } });
    item.appendChild(el('span', { style: { width: '10px', height: '10px', borderRadius: '2px', background: BETRIEB_COLORS[b], display: 'inline-block' } }));
    item.appendChild(el('span', { style: { color: BETRIEB_COLORS[b] } }, b));
    legend.appendChild(item);
  });
  card.appendChild(legend);

  return card;
}

function renderStackedBarChart(container, data) {
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);

  const W = rect.width, H = rect.height;
  const pad = { top: 10, right: 10, bottom: 35, left: 60 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const isDark = state.dark;

  // Only current month for now (single stacked bar)
  const betriebData = BETRIEBE.map(b => {
    const bd = data.filter(d => d.betrieb === b);
    return { name: b, brutto: bd.reduce((s, d) => s + d.brutto, 0), color: BETRIEB_COLORS[b] };
  }).filter(g => g.brutto > 0);

  const totalBrutto = betriebData.reduce((s, g) => s + g.brutto, 0);
  const maxVal = totalBrutto * 1.15;

  // Y-Axis grid
  ctx.strokeStyle = isDark ? '#2d3140' : '#e2e4e9';
  ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';

  for (let i = 0; i <= 4; i++) {
    const val = (maxVal / 4) * i;
    const y = pad.top + chartH - (val / maxVal) * chartH;
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    const label = val >= 1000 ? Math.round(val / 1000) + 'k' : Math.round(val);
    ctx.fillText(label, pad.left - 6, y + 3);
  }

  // Single stacked bar
  const barW = Math.min(60, chartW * 0.5);
  const cx = pad.left + chartW / 2;
  let currentY = pad.top + chartH; // Start from bottom

  betriebData.forEach((g, i) => {
    const segH = (g.brutto / maxVal) * chartH;
    const segY = currentY - segH;

    ctx.fillStyle = g.color;
    ctx.beginPath();
    if (i === betriebData.length - 1) {
      // Top segment gets rounded corners
      ctx.roundRect(cx - barW / 2, segY, barW, segH, [3, 3, 0, 0]);
    } else {
      ctx.rect(cx - barW / 2, segY, barW, segH);
    }
    ctx.fill();

    currentY = segY;
  });

  // X-axis label
  ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
  ctx.font = '9px "DM Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.currentMonat.split(' ')[0], cx, H - pad.bottom + 16);
}

// ════════════════════════════════════════════
//  VERTEILUNG — Pie/Donut Chart
// ════════════════════════════════════════════
function renderVerteilungCard(data) {
  const card = el('div', { className: 'gm-card' });
  card.appendChild(el('div', { className: 'gm-title' }, `Verteilung ${state.currentMonat}`));

  const chartWrap = el('div', { style: { height: '220px', position: 'relative' } });
  card.appendChild(chartWrap);
  requestAnimationFrame(() => renderPieChart(chartWrap, data));

  return card;
}

function renderPieChart(container, data) {
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);

  const W = rect.width, H = rect.height;
  const isDark = state.dark;

  const betriebData = BETRIEBE.map(b => {
    const bd = data.filter(d => d.betrieb === b);
    return { name: b, brutto: bd.reduce((s, d) => s + d.brutto, 0), color: BETRIEB_COLORS[b] };
  }).filter(g => g.brutto > 0);

  const totalBrutto = betriebData.reduce((s, g) => s + g.brutto, 0);
  if (totalBrutto === 0) return;

  const cx = W / 2;
  const cy = H / 2;
  const outerR = Math.min(W, H) * 0.35;
  const innerR = outerR * 0.53; // Donut hole

  let startAngle = -Math.PI / 2; // Start from top

  betriebData.forEach(g => {
    const sliceAngle = (g.brutto / totalBrutto) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    // Draw donut segment
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, endAngle);
    ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = g.color;
    ctx.fill();

    // White separator
    ctx.strokeStyle = isDark ? '#1a1d26' : '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label line + text
    const midAngle = startAngle + sliceAngle / 2;
    const labelR = outerR + 12;
    const lineEndR = outerR + 22;
    const lx1 = cx + Math.cos(midAngle) * (outerR + 2);
    const ly1 = cy + Math.sin(midAngle) * (outerR + 2);
    const lx2 = cx + Math.cos(midAngle) * lineEndR;
    const ly2 = cy + Math.sin(midAngle) * lineEndR;

    ctx.beginPath();
    ctx.moveTo(lx1, ly1);
    ctx.lineTo(lx2, ly2);
    ctx.strokeStyle = g.color;
    ctx.lineWidth = 1;
    ctx.stroke();

    const pct = Math.round((g.brutto / totalBrutto) * 100);
    const textX = cx + Math.cos(midAngle) * (lineEndR + 4);
    const textY = cy + Math.sin(midAngle) * (lineEndR + 4);

    ctx.font = '9px "DM Sans", sans-serif';
    ctx.fillStyle = g.color;
    ctx.textAlign = midAngle > Math.PI / 2 && midAngle < Math.PI * 1.5 ? 'end' : 'start';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${g.name} ${pct}%`, textX, textY);

    startAngle = endAngle;
  });
}

function renderBetriebVergleich(data) {
  const card = el('div', { className: 'gm-card' });

  const header = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } });
  header.appendChild(el('div', { className: 'gm-title', style: { marginBottom: 0 } }, `Betrieb-Vergleich ${state.currentMonat}`));

  const toggle = el('div', { className: 'gm-tab-toggle' });
  toggle.appendChild(el('button', { className: 'active' }, 'Monat'));
  toggle.appendChild(el('button', {}, 'Jahr'));
  header.appendChild(toggle);
  card.appendChild(header);

  // Chart
  const chartWrap = el('div', { style: { height: '220px' } });
  card.appendChild(chartWrap);
  requestAnimationFrame(() => renderGroupedBarChart(chartWrap, data));

  return card;
}

function renderGroupedBarChart(container, data) {
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);

  const W = rect.width, H = rect.height;
  const pad = { top: 10, right: 20, bottom: 50, left: 70 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const isDark = state.dark;

  const groups = BETRIEBE.map(b => {
    const bd = data.filter(d => d.betrieb === b);
    return {
      name: b,
      brutto: bd.reduce((s, d) => s + d.brutto, 0),
      netto: bd.reduce((s, d) => s + d.netto, 0),
      color: BETRIEB_COLORS[b],
    };
  }).filter(g => g.brutto > 0);

  if (groups.length === 0) return;

  const maxVal = Math.max(...groups.map(g => g.brutto)) * 1.15;
  const gap = chartW / groups.length;
  const barW = Math.min(28, gap * 0.35);

  // Grid
  ctx.strokeStyle = isDark ? '#2d3140' : '#e2e4e9';
  ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';

  for (let i = 0; i <= 4; i++) {
    const val = (maxVal / 4) * i;
    const y = pad.top + chartH - (val / maxVal) * chartH;
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    const label = val >= 1000 ? Math.round(val / 1000) + 'k' : Math.round(val);
    ctx.fillText(label, pad.left - 6, y + 3);
  }

  // Bars
  groups.forEach((g, i) => {
    const cx = pad.left + gap * i + gap / 2;

    // Brutto bar
    const bruttoH = (g.brutto / maxVal) * chartH;
    ctx.fillStyle = '#3b7ddd';
    ctx.beginPath();
    ctx.roundRect(cx - barW - 1, pad.top + chartH - bruttoH, barW, bruttoH, [3, 3, 0, 0]);
    ctx.fill();

    // Netto bar
    const nettoH = (g.netto / maxVal) * chartH;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(cx + 1, pad.top + chartH - nettoH, barW, nettoH, [3, 3, 0, 0]);
    ctx.fill();

    // Label
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
    ctx.font = '10px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(g.name, cx, H - pad.bottom + 16);
  });

  // Legend
  const legendY = H - 10;
  ctx.font = '9px "DM Sans", sans-serif';
  ctx.textAlign = 'left';

  ctx.fillStyle = '#3b7ddd';
  ctx.fillRect(W / 2 - 60, legendY - 6, 10, 8);
  ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
  ctx.fillText('Brutto', W / 2 - 46, legendY);

  ctx.fillStyle = '#10b981';
  ctx.fillRect(W / 2 + 10, legendY - 6, 10, 8);
  ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
  ctx.fillText('Netto', W / 2 + 24, legendY);
}

function renderBetriebSummary(data) {
  const card = el('div', { className: 'gm-card', style: { padding: 0 } });
  const table = el('table', { className: 'gm-table' });

  const thead = el('thead');
  const hr = el('tr');
  ['Betrieb', 'MA', 'Brutto', 'Netto', 'Ø Brutto', 'Anteil'].forEach(h => {
    hr.appendChild(el('th', {}, h));
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = el('tbody');
  const totalBrutto = data.reduce((s, d) => s + d.brutto, 0);

  BETRIEBE.forEach(betrieb => {
    const bd = data.filter(d => d.betrieb === betrieb);
    if (bd.length === 0) return;

    const brutto = bd.reduce((s, d) => s + d.brutto, 0);
    const netto = bd.reduce((s, d) => s + d.netto, 0);
    const avg = bd.length > 0 ? brutto / bd.length : 0;
    const pct = totalBrutto > 0 ? ((brutto / totalBrutto) * 100).toFixed(1) : 0;

    const tr = el('tr');
    tr.appendChild(el('td', { style: { fontWeight: 600 } },
      el('span', { className: 'gm-dot', style: { background: BETRIEB_COLORS[betrieb] } }),
      betrieb
    ));
    tr.appendChild(el('td', { className: 'mono' }, String(bd.length)));
    tr.appendChild(el('td', { className: 'mono bold' }, formatEUR(brutto)));
    tr.appendChild(el('td', { className: 'mono' }, formatEUR(netto)));
    tr.appendChild(el('td', { className: 'mono' }, formatEUR(avg)));
    tr.appendChild(el('td', { className: 'mono' }, pct + '%'));
    tbody.appendChild(tr);
  });

  // Total
  const gNetto = data.reduce((s, d) => s + d.netto, 0);
  const totalTr = el('tr', { style: { background: 'var(--sf2)' } });
  totalTr.appendChild(el('td', { style: { fontWeight: 700 } }, 'Gesamt'));
  totalTr.appendChild(el('td', { className: 'mono bold' }, String(data.length)));
  totalTr.appendChild(el('td', { className: 'mono bold' }, formatEUR(totalBrutto)));
  totalTr.appendChild(el('td', { className: 'mono bold' }, formatEUR(gNetto)));
  totalTr.appendChild(el('td', { colSpan: 2 }));
  tbody.appendChild(totalTr);

  table.appendChild(tbody);
  card.appendChild(table);
  return card;
}

function renderCrossSiteEmployees() {
  // Find employees at multiple sites
  const nameMap = {};
  state.mitarbeiterData.forEach(ma => {
    const key = ma.name.toLowerCase().trim();
    if (!nameMap[key]) nameMap[key] = [];
    nameMap[key].push(ma);
  });

  const crossSite = Object.values(nameMap).filter(arr => arr.length > 1);
  if (crossSite.length === 0) return el('div');

  let totalBrutto = 0;
  crossSite.forEach(arr => {
    arr.forEach(ma => {
      const g = state.gehaltData.find(d => d.persNr === ma.persNr && d.betrieb === ma.betrieb);
      if (g) totalBrutto += g.brutto;
    });
  });

  const card = el('div', { className: 'gm-card' });
  const isOpen = { value: false };

  const headerBtn = el('button', {
    className: 'gm-collapsible-header',
    onClick: () => {
      isOpen.value = !isOpen.value;
      const body = headerBtn.parentElement.querySelector('.gm-collapsible-body');
      body.classList.toggle('open', isOpen.value);
      arrow.style.transform = isOpen.value ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  });

  const headerLeft = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } });
  headerLeft.appendChild(el('span', { className: 'gm-badge gm-badge-wn' }, `⚠ ${crossSite.length}`));
  headerLeft.appendChild(el('span', { style: { fontSize: '12px', fontWeight: 600 } }, 'Standortübergreifende Mitarbeiter'));
  headerLeft.appendChild(el('span', { style: { fontSize: '10px', color: 'var(--tx3)' } }, `Σ ${formatEUR(totalBrutto)} Brutto`));
  headerBtn.appendChild(headerLeft);

  const arrow = el('span', {
    style: { fontSize: '11px', color: 'var(--tx3)', transition: 'transform 0.15s', transform: 'rotate(0deg)' }
  }, '▼');
  headerBtn.appendChild(arrow);

  card.appendChild(headerBtn);

  // Collapsible body
  const body = el('div', { className: 'gm-collapsible-body' });

  crossSite.forEach(arr => {
    const item = el('div', { style: { padding: '6px 0', borderBottom: '1px solid var(--bd)' } });
    const nameText = arr[0].name;
    const sites = arr.map(ma => ma.betrieb).join(', ');
    item.appendChild(el('div', { style: { fontSize: '11px', fontWeight: 600 } }, nameText));
    item.appendChild(el('div', { style: { fontSize: '9px', color: 'var(--tx3)' } }, `Standorte: ${sites}`));
    body.appendChild(item);
  });

  card.appendChild(body);
  return card;
}

// ════════════════════════════════════════════
//  ABRECHNUNG
// ════════════════════════════════════════════
function renderAbrechnung() {
  const data = state.gehaltData;
  const container = el('div', { className: 'anim-up' });
  if (!state.betriebFilter) state.betriebFilter = 'Alle';
  if (!state.abrSearch) state.abrSearch = '';
  if (!state.abrTypFilter) state.abrTypFilter = 'Alle Typen';

  const BANKS = ['Commerzbank', 'Commerzbank Enso', 'Commerzbank Okyu', 'Commerzbank Origami',
    'Deutsche Bank', 'ING', 'Revolut Enso', 'Revolut Okyu', 'Revolut Ultra', 'Sparkasse', 'VR Bank', 'Volksbank'];

  // ── Betrieb tabs ──
  const tabBar = el('div', { style: { display: 'flex', gap: '0', borderBottom: '2px solid var(--bd)', marginBottom: '0' } });
  const betriebCounts = {};
  BETRIEBE.forEach(b => { betriebCounts[b] = data.filter(d => d.betrieb === b).length; });

  [{ key: 'Alle', label: 'Alle' }, ...BETRIEBE.map(b => ({ key: b, label: `${b} (${betriebCounts[b]})` }))].forEach(t => {
    const active = state.betriebFilter === t.key;
    const bCol = BETRIEB_COLORS[t.key] || 'var(--tx)';
    tabBar.appendChild(el('button', {
      style: {
        padding: '8px 16px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
        fontSize: '11px', fontWeight: active ? 700 : 400,
        color: active ? bCol : 'var(--tx3)',
        borderBottom: active ? `2px solid ${bCol}` : '2px solid transparent',
        background: 'transparent', marginBottom: '-2px', whiteSpace: 'nowrap'
      },
      onClick: () => { state.betriebFilter = t.key; renderApp(); }
    }, t.label));
  });

  // Add + button
  tabBar.appendChild(el('button', {
    style: { padding: '6px 12px', border: 'none', cursor: 'pointer', background: 'transparent', fontSize: '14px', color: 'var(--tx3)', marginLeft: 'auto' }
  }, '+'));
  container.appendChild(tabBar);

  // ── Toolbar ──
  const toolbar = el('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 0',
      borderBottom: '1px solid var(--bd)', marginBottom: '8px', flexWrap: 'wrap', fontSize: '10px'
    }
  });

  // Steuerberater / Intern toggle
  toolbar.appendChild(el('button', {
    className: 'gm-btn gm-btn-ghost', style: { fontSize: '9px', padding: '4px 8px' }
  }, '\ud83d\udcdd Steuerberater'));
  toolbar.appendChild(el('button', {
    className: 'gm-btn gm-btn-primary', style: { fontSize: '9px', padding: '4px 10px' }
  }, '\ud83d\udcca Intern'));

  // KPI stats
  const totalGehalt = data.reduce((s, d) => s + d.gehalt, 0);
  const totalBrutto = data.reduce((s, d) => s + d.brutto, 0);
  toolbar.appendChild(el('span', {
    style: { fontSize: '9px', color: 'var(--tx2)', marginLeft: '4px' }
  }, `${formatEUR(totalGehalt)} Gehalt \u00b7 ${formatEUR(totalBrutto)} Ges.-Brutto \u00b7 ${data.length} MA`));

  // Betrieb status chips
  const spacer = el('div', { style: { flex: 1 } });
  toolbar.appendChild(spacer);

  BETRIEBE.forEach(b => {
    const bData = data.filter(d => d.betrieb === b);
    const done = bData.filter(d => d.ue_status === 'ueberwiesen' || d.ue_status === 'dauerauftrag').length;
    const total = bData.length;
    const allDone = done === total;
    const bCol = BETRIEB_COLORS[b];
    toolbar.appendChild(el('span', {
      style: {
        padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: 600,
        background: allDone ? bCol + '15' : 'rgba(239,68,68,0.08)',
        color: allDone ? bCol : '#ef4444'
      }
    }, `${b} ${done}/${total} ${allDone ? '\u2713' : ''}`));
  });

  // Monat abschlie\u00dfen
  toolbar.appendChild(el('button', {
    className: 'gm-btn',
    style: { background: 'var(--ok)', color: '#fff', fontSize: '9px', padding: '4px 10px', fontWeight: 700 }
  }, '\ud83d\udcb8 Monat abschlie\u00dfen'));

  container.appendChild(toolbar);

  // ── Search + Filters row ──
  const filterRow = el('div', {
    style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }
  });

  const searchInput = el('input', {
    className: 'gm-input', placeholder: '\ud83d\udd0d Suche...',
    style: { width: '140px', fontSize: '10px', padding: '4px 8px' },
    value: state.abrSearch,
    onInput: (e) => { state.abrSearch = e.target.value; renderApp(); }
  });
  filterRow.appendChild(searchInput);

  // Alle Typen filter
  const typSel = el('select', {
    className: 'gm-select', style: { fontSize: '10px' },
    onChange: (e) => { state.abrTypFilter = e.target.value; renderApp(); }
  });
  const typen = ['Alle Typen', ...new Set(state.mitarbeiterData.map(m => m.stamm?.typ).filter(Boolean))];
  typen.forEach(t => {
    const opt = el('option', { value: t }, t);
    if (t === state.abrTypFilter) opt.selected = true;
    typSel.appendChild(opt);
  });
  filterRow.appendChild(typSel);

  filterRow.appendChild(el('div', { style: { flex: 1 } }));

  // Excel export
  filterRow.appendChild(el('button', {
    className: 'gm-btn',
    style: { background: 'var(--ok)', color: '#fff', fontSize: '9px', padding: '4px 10px', fontWeight: 600 }
  }, '\ud83d\udcca Excel'));

  // Telegram
  filterRow.appendChild(el('button', {
    className: 'gm-btn',
    style: { background: '#0088cc', color: '#fff', fontSize: '9px', padding: '4px 10px', fontWeight: 600 }
  }, '\u2708\ufe0f Telegram'));

  container.appendChild(filterRow);

  // ── Filter data ──
  let filtered = state.betriebFilter === 'Alle' ? [...data] : data.filter(d => d.betrieb === state.betriebFilter);

  if (state.abrSearch) {
    const q = state.abrSearch.toLowerCase();
    filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || String(d.persNr).includes(q));
  }

  if (state.abrTypFilter !== 'Alle Typen') {
    filtered = filtered.filter(d => {
      const ma = state.mitarbeiterData.find(m => m.persNr === d.persNr && m.betrieb === d.betrieb);
      return ma?.stamm?.typ === state.abrTypFilter;
    });
  }

  // ── Table ──
  const wrap = el('div', { className: 'gm-table-wrap' });
  const table = el('table', { className: 'gm-table' });

  const thead = el('thead');
  const hr = el('tr');
  ['PERS.NR \u2195', 'NAME \u2195', 'BETRIEB', 'GEHALT \u2195', 'GES.-BRUTTO', 'NETTO', '\u00dcBERW. \u2195', '\u00dc-STATUS \u2195', 'BAR/TG \u2195', 'B-STATUS', 'SUMME \u2195', 'NOTIZ'].forEach(h => {
    hr.appendChild(el('th', { style: { cursor: 'pointer', userSelect: 'none' } }, h));
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = el('tbody');
  const statusCfg = getStatusConfig();
  const typFarben = getTypFarben();

  // Totals row first
  const totalTr = el('tr', { style: { background: 'var(--sf2)', fontWeight: 700 } });
  totalTr.appendChild(el('td', {}));
  totalTr.appendChild(el('td', { style: { fontSize: '10px' } }, `${filtered.length} MA`));
  totalTr.appendChild(el('td', {}));
  totalTr.appendChild(el('td', { className: 'mono right' }, formatEUR(filtered.reduce((s, d) => s + d.gehalt, 0))));
  totalTr.appendChild(el('td', { className: 'mono right' }, formatEUR(filtered.reduce((s, d) => s + d.brutto, 0))));
  totalTr.appendChild(el('td', { className: 'mono right' }, formatEUR(filtered.reduce((s, d) => s + d.netto, 0))));
  totalTr.appendChild(el('td', { className: 'mono right', style: { color: 'var(--ac)' } }, formatEUR(filtered.reduce((s, d) => s + d.ueberweisung, 0))));
  totalTr.appendChild(el('td', { style: { textAlign: 'center', fontSize: '9px', color: 'var(--tx3)' } }, '\u2014'));
  totalTr.appendChild(el('td', { className: 'mono right', style: { color: 'var(--wn)' } }, formatEUR(filtered.reduce((s, d) => s + d.bar_tg, 0))));
  totalTr.appendChild(el('td', { style: { textAlign: 'center', fontSize: '9px', color: 'var(--tx3)' } }, '\u2014'));
  totalTr.appendChild(el('td', { className: 'mono right' }, formatEUR(filtered.reduce((s, d) => s + d.ueberweisung + d.bar_tg, 0))));
  totalTr.appendChild(el('td', {}));
  tbody.appendChild(totalTr);

  filtered.sort((a, b) => a.name.localeCompare(b.name)).forEach(d => {
    const tr = el('tr');

    tr.appendChild(el('td', { className: 'mono center', style: { fontSize: '10px' } }, String(d.persNr)));

    // Name + type badge
    const nameCell = el('td', { style: { fontWeight: 600 } });
    nameCell.appendChild(document.createTextNode(d.name + ' '));
    const ma = state.mitarbeiterData.find(m => m.persNr === d.persNr && m.betrieb === d.betrieb);
    if (ma?.stamm?.typ) {
      nameCell.appendChild(el('span', {
        className: 'gm-badge',
        style: { background: (typFarben[ma.stamm.typ] || '#999') + '20', color: typFarben[ma.stamm.typ] || '#999', fontSize: '8px' }
      }, ma.stamm.typ));
    }
    tr.appendChild(nameCell);

    tr.appendChild(el('td', {},
      el('span', { className: 'gm-badge gm-badge-ac', style: { fontSize: '8px' } }, d.betrieb)
    ));

    tr.appendChild(el('td', { className: 'mono right' }, formatEUR(d.gehalt)));
    tr.appendChild(el('td', { className: 'mono right bold' }, formatEUR(d.brutto)));
    tr.appendChild(el('td', { className: 'mono right' }, formatEUR(d.netto)));

    // \u00dcberweisung with editable input + bank pill
    const ueCell = el('td', { style: { position: 'relative' } });
    const ueWrap = el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' } });

    const ueInput = el('input', {
      className: 'gm-input mono',
      style: {
        width: '80px', textAlign: 'right', fontSize: '11px', padding: '2px 4px',
        border: '1px solid var(--bd)', borderRadius: '4px', background: 'var(--sf2)',
        color: 'var(--ac)', fontWeight: 600
      },
      value: d.ueberweisung ? Math.round(d.ueberweisung) : 0,
      onBlur: async (e) => {
        const newVal = parseFloat(e.target.value) || 0;
        if (newVal !== d.ueberweisung) {
          await supabase.from('gehaelter').update({ ueberweisung: newVal })
            .eq('pers_nr', d.persNr).eq('betrieb', d.betrieb).eq('monat', state.currentMonat);
          state.gehaltData = await loadGehaltData(state.currentMonat);
          renderApp();
        }
      }
    });
    ueWrap.appendChild(ueInput);

    if (d.ue_bank) {
      ueWrap.appendChild(el('button', {
        style: {
          padding: '0px 4px', borderRadius: '6px', fontSize: '7px', fontWeight: 600,
          border: '1px solid var(--bd)', background: 'var(--sf2)', color: 'var(--ac)',
          cursor: 'pointer', fontFamily: 'var(--font)', marginTop: '1px'
        },
        onClick: (e) => { e.stopPropagation(); showBankDropdown(e.currentTarget.parentElement, d, BANKS); }
      }, d.ue_bank + ' \u25be'));
    }

    ueCell.appendChild(ueWrap);
    tr.appendChild(ueCell);

    // \u00dc-Status clickable badge
    const ueScfg = statusCfg[d.ue_status] || statusCfg.offen;
    const ueStatusCell = el('td', { className: 'center', style: { position: 'relative' } });
    const ueStatusWrap = el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' } });
    ueStatusWrap.appendChild(el('button', {
      className: 'gm-badge',
      style: { background: ueScfg.bg, color: ueScfg.c, cursor: 'pointer', border: 'none', fontFamily: 'var(--font)', fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' },
      onClick: (e) => { e.stopPropagation(); showStatusDropdown(e.currentTarget.parentElement, d, 'ue'); }
    }, `${ueScfg.i} ${ueScfg.l} \u25be`));
    if (d.ue_datum) ueStatusWrap.appendChild(el('div', { style: { fontSize: '7px', color: 'var(--tx3)' } }, d.ue_datum));
    if (d.ue_bank) ueStatusWrap.appendChild(el('button', {
      style: { fontSize: '7px', color: 'var(--ac)', border: '1px solid var(--bd)', borderRadius: '4px', background: 'var(--sf2)', padding: '0 3px', cursor: 'pointer', fontFamily: 'var(--font)' },
      onClick: (e) => { e.stopPropagation(); showBankDropdown(e.currentTarget.parentElement, d, BANKS); }
    }, d.ue_bank + ' \u25be'));
    ueStatusCell.appendChild(ueStatusWrap);
    tr.appendChild(ueStatusCell);

    // Bar/TG editable
    const barCell = el('td');
    const barInput = el('input', {
      className: 'gm-input mono',
      style: {
        width: '70px', textAlign: 'right', fontSize: '11px', padding: '2px 4px',
        border: '1px solid var(--bd)', borderRadius: '4px', background: 'var(--sf2)',
        color: 'var(--wn)', fontWeight: 600
      },
      value: d.bar_tg ? Math.round(d.bar_tg) : 0,
      onBlur: async (e) => {
        const newVal = parseFloat(e.target.value) || 0;
        if (newVal !== d.bar_tg) {
          await supabase.from('gehaelter').update({ bar_tg: newVal })
            .eq('pers_nr', d.persNr).eq('betrieb', d.betrieb).eq('monat', state.currentMonat);
          state.gehaltData = await loadGehaltData(state.currentMonat);
          renderApp();
        }
      }
    });
    barCell.appendChild(barInput);
    tr.appendChild(barCell);

    // B-Status clickable badge
    const barScfg = statusCfg[d.bar_status] || statusCfg.offen;
    const barStatusCell = el('td', { className: 'center', style: { position: 'relative' } });
    const barStatusWrap = el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' } });
    barStatusWrap.appendChild(el('button', {
      className: 'gm-badge',
      style: { background: barScfg.bg, color: barScfg.c, cursor: 'pointer', border: 'none', fontFamily: 'var(--font)', fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' },
      onClick: (e) => { e.stopPropagation(); showStatusDropdown(e.currentTarget.parentElement, d, 'bar'); }
    }, `${barScfg.i} ${barScfg.l} \u25be`));
    if (d.bar_datum) barStatusWrap.appendChild(el('div', { style: { fontSize: '7px', color: 'var(--tx3)' } }, d.bar_datum));
    barStatusCell.appendChild(barStatusWrap);
    tr.appendChild(barStatusCell);

    tr.appendChild(el('td', { className: 'mono right bold' }, formatEUR(d.ueberweisung + d.bar_tg)));
    tr.appendChild(el('td', { style: { fontSize: '10px', color: 'var(--tx2)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' } }, d.notiz || '\u2014'));

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrap.appendChild(table);
  container.appendChild(wrap);

  return container;
}

// ════════════════════════════════════════════
//  MITARBEITER
// ════════════════════════════════════════════
function renderMitarbeiterTab() {
  const container = el('div', { className: 'anim-up' });

  const headerRow = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' } });

  headerRow.appendChild(el('div', { className: 'gm-title', style: { marginBottom: 0 } },
    `👥 Mitarbeiter — ${state.mitarbeiterData.length} aktiv`
  ));

  // Filter
  const filterRow = el('div', { style: { display: 'flex', gap: '6px', alignItems: 'center' } });
  const betriebSel = el('select', {
    className: 'gm-select',
    onChange: (e) => { state.betriebFilter = e.target.value; renderApp(); }
  });
  ['Alle', ...BETRIEBE].forEach(b => {
    const opt = el('option', { value: b }, b);
    if (b === state.betriebFilter) opt.selected = true;
    betriebSel.appendChild(opt);
  });
  filterRow.appendChild(betriebSel);
  headerRow.appendChild(filterRow);
  container.appendChild(headerRow);

  // Filter
  const filtered = state.betriebFilter === 'Alle'
    ? state.mitarbeiterData
    : state.mitarbeiterData.filter(m => m.betrieb === state.betriebFilter);

  // KPIs
  const typFarben = getTypFarben();
  const typCounts = {};
  filtered.forEach(m => {
    const t = m.stamm?.typ || 'Unbekannt';
    typCounts[t] = (typCounts[t] || 0) + 1;
  });

  container.appendChild(renderKPIRow([
    { label: 'Gesamt', value: String(filtered.length), sub: 'Aktive Mitarbeiter', color: 'var(--ac)' },
    ...Object.entries(typCounts).slice(0, 3).map(([typ, cnt]) => ({
      label: typ,
      value: String(cnt),
      color: typFarben[typ] || '#999',
    })),
  ]));

  // Table
  const wrap = el('div', { className: 'gm-table-wrap' });
  const table = el('table', { className: 'gm-table' });

  const thead = el('thead');
  const hr = el('tr');
  ['P.Nr', 'Name', 'Betrieb', 'Typ', 'Eintritt', 'EUR/Std', 'Std/Monat', 'IBAN', 'Krankenkasse'].forEach(h => {
    hr.appendChild(el('th', {}, h));
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = el('tbody');
  filtered.sort((a, b) => a.name.localeCompare(b.name)).forEach(ma => {
    const tr = el('tr');
    tr.appendChild(el('td', { className: 'mono center', style: { fontSize: '10px' } }, String(ma.persNr)));

    const nameCell = el('td', { style: { fontWeight: 600, cursor: 'pointer' } });
    nameCell.textContent = ma.name;
    tr.appendChild(nameCell);

    tr.appendChild(el('td', {},
      el('span', { className: 'gm-badge gm-badge-ac', style: { fontSize: '8px' } }, ma.betrieb)
    ));

    const typ = ma.stamm?.typ || '—';
    tr.appendChild(el('td', {},
      el('span', {
        className: 'gm-badge',
        style: { background: (typFarben[typ] || '#999') + '20', color: typFarben[typ] || '#999' }
      }, typ)
    ));

    tr.appendChild(el('td', { style: { fontSize: '10px' } }, ma.eintritt || '—'));
    tr.appendChild(el('td', { className: 'mono right' }, ma.stamm?.eurStd ? formatEUR(ma.stamm.eurStd) : '—'));
    tr.appendChild(el('td', { className: 'mono right' }, ma.stamm?.stdMonat ? String(ma.stamm.stdMonat) : '—'));
    tr.appendChild(el('td', { style: { fontSize: '9px', fontFamily: 'var(--mono)' } }, ma.stamm?.iban ? '****' + ma.stamm.iban.slice(-4) : '—'));
    tr.appendChild(el('td', { style: { fontSize: '10px' } }, ma.stamm?.krankenkasse || '—'));

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrap.appendChild(table);
  container.appendChild(wrap);

  return container;
}

// ════════════════════════════════════════════
//  BANKEN
// ════════════════════════════════════════════
function renderBanken() {
  const data = state.gehaltData;
  const container = el('div', { className: 'anim-up' });

  // ── Betrieb Filter Row ──
  const filterRow = el('div', {
    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
  });

  const filterSelect = el('select', {
    className: 'gm-select',
    style: { minWidth: '100px' },
    onChange: (e) => {
      state.betriebFilter = e.target.value;
      renderApp();
    }
  });
  ['Alle', ...BETRIEBE].forEach(b => {
    const opt = el('option', { value: b }, b === 'Alle' ? 'Alle ▾' : b);
    if (b === state.betriebFilter) opt.selected = true;
    filterSelect.appendChild(opt);
  });
  filterRow.appendChild(filterSelect);
  filterRow.appendChild(el('span', { style: { fontSize: '10px', color: 'var(--tx3)' } }, state.currentMonat));
  container.appendChild(filterRow);

  // Filter data
  const filtered = state.betriebFilter === 'Alle' ? data : data.filter(d => d.betrieb === state.betriebFilter);

  // ── 4 KPI Cards ──
  const ueData = filtered.filter(d => d.ueberweisung > 0);
  const barData = filtered.filter(d => d.bar_tg > 0);
  const ueTotal = ueData.reduce((s, d) => s + d.ueberweisung, 0);
  const barTotal = barData.reduce((s, d) => s + d.bar_tg, 0);
  const ueOffen = ueData.filter(d => d.ue_status === 'offen');
  const ueOffenAmt = ueOffen.reduce((s, d) => s + d.ueberweisung, 0);
  const barOffen = barData.filter(d => d.bar_status === 'offen');
  const barOffenAmt = barOffen.reduce((s, d) => s + d.bar_tg, 0);
  const gesamtOffen = ueOffenAmt + barOffenAmt;
  const gesamtAuszahlung = ueTotal + barTotal;

  container.appendChild(renderKPIRow([
    { label: 'Überweisungen', value: formatEUR(ueTotal), sub: `${ueData.length} MA`, color: 'var(--ac)' },
    { label: 'Bar / TG Offen', value: formatEUR(barTotal), sub: `${barData.length} MA`, color: 'var(--wn)' },
    { label: 'Offen', value: formatEUR(gesamtOffen), sub: `${ueOffen.length + barOffen.length} MA`, color: 'var(--no)' },
    { label: 'Gesamt Auszahlung', value: formatEUR(gesamtAuszahlung), color: '#a78bfa' },
  ]));

  // ── Group by Bank ──
  const bankMap = {};
  ueData.forEach(d => {
    const bank = d.ue_bank || 'Unbekannt';
    if (!bankMap[bank]) bankMap[bank] = { total: 0, count: 0, items: [] };
    bankMap[bank].total += d.ueberweisung;
    bankMap[bank].count++;
    bankMap[bank].items.push(d);
  });

  const banks = Object.entries(bankMap).sort((a, b) => b[1].total - a[1].total);

  if (banks.length === 0) {
    container.appendChild(el('div', { className: 'gm-empty' },
      el('div', { className: 'gm-empty-icon' }, '🏦'),
      el('div', { className: 'gm-empty-text' }, 'Keine Bankdaten vorhanden')
    ));
    return container;
  }

  // ── Bank Groups (Expandable) ──
  banks.forEach(([bankName, bankData]) => {
    const card = el('div', { className: 'gm-card', style: { padding: 0 } });

    // Bank group header
    const header = el('button', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '12px 16px',
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font)', color: 'var(--tx)'
      },
      onClick: () => {
        const body = header.nextElementSibling;
        body.classList.toggle('open');
        const arrow = header.querySelector('.gm-arrow');
        arrow.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });

    const headerLeft = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } });
    headerLeft.appendChild(el('span', { style: { fontSize: '14px' } }, '🏦'));
    headerLeft.appendChild(el('span', { style: { fontWeight: 700, fontSize: '12px' } }, bankName));
    headerLeft.appendChild(el('span', {
      style: { fontSize: '9px', color: 'var(--tx3)', padding: '1px 6px', background: 'var(--sf2)', borderRadius: '10px' }
    }, `${bankData.count} MA`));
    header.appendChild(headerLeft);

    const headerRight = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } });
    headerRight.appendChild(el('span', {
      style: { fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 700, color: 'var(--ac)' }
    }, formatEUR(bankData.total)));
    headerRight.appendChild(el('span', {
      className: 'gm-arrow',
      style: { fontSize: '11px', color: 'var(--tx3)', transition: 'transform 0.15s', transform: 'rotate(0deg)' }
    }, '▼'));
    header.appendChild(headerRight);

    card.appendChild(header);

    // Expandable body
    const body = el('div', { className: 'gm-collapsible-body' });

    const table = el('table', { className: 'gm-table', style: { borderTop: '1px solid var(--bd)' } });
    const thead = el('thead');
    const hr = el('tr');
    ['Nr. ↑', 'Name ▲', 'Betrieb ↑', 'Überweisung ↑', 'Status ↑', 'Datum ↑'].forEach((h, i) => {
      const th = el('th', {
        style: { textAlign: i === 3 ? 'right' : 'left', cursor: 'pointer' }
      }, h);
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);

    const tbody = el('tbody');
    // Sort by pers_nr
    const sortedItems = [...bankData.items].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    sortedItems.forEach(d => {
      const tr = el('tr');

      // PersNr
      tr.appendChild(el('td', { className: 'mono', style: { fontSize: '10px', color: 'var(--tx3)' } }, String(d.persNr)));

      // Name
      tr.appendChild(el('td', { style: { fontWeight: 600 } }, d.name));

      // Betrieb badge
      const betriebColor = BETRIEB_COLORS[d.betrieb] || 'var(--ac)';
      tr.appendChild(el('td', {},
        el('span', {
          style: {
            display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
            fontSize: '9.5px', fontWeight: 600,
            background: betriebColor + '18', color: betriebColor
          }
        }, d.betrieb)
      ));

      // Überweisung amount
      tr.appendChild(el('td', {
        className: 'mono right',
        style: { fontWeight: 700, color: 'var(--ac)' }
      }, formatEUR(d.ueberweisung)));

      // Status badge
      const statusCfg = getUeStatusConfig(d.ue_status);
      tr.appendChild(el('td', {},
        el('span', {
          style: {
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 8px', borderRadius: '4px',
            fontSize: '9px', fontWeight: 600,
            background: statusCfg.bg, color: statusCfg.color
          }
        }, statusCfg.icon + ' ' + statusCfg.label)
      ));

      // Datum
      tr.appendChild(el('td', {
        style: { fontSize: '10px', color: 'var(--tx3)' }
      }, d.ue_datum || '—'));

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    body.appendChild(table);
    card.appendChild(body);
    container.appendChild(card);
  });

  return container;
}

// Helper: Status config for Überweisung status
function getUeStatusConfig(status) {
  switch (status) {
    case 'ueberwiesen': return { label: 'Überwiesen', icon: '✓', color: '#10b981', bg: 'rgba(16,185,129,0.08)' };
    case 'dauerauftrag': return { label: 'Dauerauftrag', icon: '🔄', color: '#3b7ddd', bg: 'rgba(59,125,221,0.08)' };
    case 'vorbereitet': return { label: 'Vorbereitet', icon: '📋', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' };
    case 'offen': return { label: 'Offen', icon: '○', color: '#ef4444', bg: 'rgba(239,68,68,0.06)' };
    default: return { label: status || 'Offen', icon: '○', color: '#9ca3af', bg: 'rgba(156,163,175,0.08)' };
  }
}

// ════════════════════════════════════════════
//  HRM TAB — Stammdaten / Personalverwaltung
// ════════════════════════════════════════════
function renderHRM() {
  const data = state.gehaltData;
  const allMA = state.mitarbeiterData;
  const container = el('div', { className: 'anim-up' });

  // ── Title ──
  const titleRow = el('div', { style: { marginBottom: '6px' } });
  titleRow.appendChild(el('div', { style: { fontSize: '16px', fontWeight: 700 } }, '📋 Personal & Löhne'));
  titleRow.appendChild(el('div', { style: { fontSize: '10px', color: 'var(--tx3)' } }, `${state.currentMonat} · ${data.length} Mitarbeiter`));
  container.appendChild(titleRow);

  // ── Sub-tabs: Intern / Steuerberater ──
  if (!state.hrmSubTab) state.hrmSubTab = 'intern';
  const tabRow = el('div', { style: { display: 'flex', gap: '0', borderBottom: '2px solid var(--bd)', marginBottom: '14px' } });

  ['intern', 'steuerberater'].forEach(t => {
    const label = t === 'intern' ? 'Intern' : 'Steuerberater';
    const active = state.hrmSubTab === t;
    tabRow.appendChild(el('button', {
      style: {
        padding: '8px 16px', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font)', fontSize: '12px', fontWeight: active ? 700 : 400,
        color: active ? 'var(--ac)' : 'var(--tx2)',
        borderBottom: active ? '2px solid var(--ac)' : '2px solid transparent',
        background: 'transparent', marginBottom: '-2px'
      },
      onClick: () => { state.hrmSubTab = t; renderApp(); }
    }, label));
  });
  container.appendChild(tabRow);

  // ── Filter Row: Betrieb pills + Search ──
  const filterRow = el('div', {
    style: { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }
  });

  if (!state.hrmBetriebFilter) state.hrmBetriebFilter = 'Alle';

  ['Alle', ...BETRIEBE].forEach(b => {
    const count = b === 'Alle' ? data.length : data.filter(d => d.betrieb === b).length;
    const active = state.hrmBetriebFilter === b;
    filterRow.appendChild(el('button', {
      style: {
        padding: '4px 10px', borderRadius: '14px', fontSize: '10px', fontWeight: 600,
        border: active ? '1.5px solid var(--ac)' : '1px solid var(--bd)',
        background: active ? 'var(--acG)' : 'transparent',
        color: active ? 'var(--ac)' : 'var(--tx2)',
        cursor: 'pointer', fontFamily: 'var(--font)'
      },
      onClick: () => { state.hrmBetriebFilter = b; renderApp(); }
    }, `${b} (${count})`));
  });

  // Spacer
  filterRow.appendChild(el('div', { style: { flex: 1 } }));

  // Search
  const search = el('input', {
    className: 'gm-input',
    type: 'text',
    placeholder: 'Name oder PersNr..',
    style: { width: '160px', fontSize: '10px' },
    onInput: (e) => { state.hrmSearch = e.target.value; renderApp(); }
  });
  if (state.hrmSearch) search.value = state.hrmSearch;
  filterRow.appendChild(search);
  container.appendChild(filterRow);

  // Filter data
  let filtered = [...data];
  if (state.hrmBetriebFilter !== 'Alle') {
    filtered = filtered.filter(d => d.betrieb === state.hrmBetriebFilter);
  }
  if (state.hrmSearch) {
    const q = state.hrmSearch.toLowerCase();
    filtered = filtered.filter(d => d.name?.toLowerCase().includes(q) || String(d.persNr).includes(q));
  }

  // ── KPI: Open amounts ──
  const ueOffen = filtered.filter(d => d.ueberweisung > 0 && d.ue_status === 'offen');
  const barOffen = filtered.filter(d => d.bar_tg > 0 && d.bar_status === 'offen');
  const ueOffenAmt = ueOffen.reduce((s, d) => s + d.ueberweisung, 0);
  const barOffenAmt = barOffen.reduce((s, d) => s + d.bar_tg, 0);
  const ueGesamt = filtered.filter(d => d.ueberweisung > 0).reduce((s, d) => s + d.ueberweisung, 0);
  const barGesamt = filtered.filter(d => d.bar_tg > 0).reduce((s, d) => s + d.bar_tg, 0);

  const kpiGrid = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' } });

  // Überw. Offen card
  kpiGrid.appendChild(renderHRMKpiCard(
    '🏦 Überw. Offen', formatEUR(ueOffenAmt), 'var(--ac)',
    `von ${formatEUR(ueGesamt)} gesamt`
  ));
  // Bar Offen card
  kpiGrid.appendChild(renderHRMKpiCard(
    '💵 Bar Offen', formatEUR(barOffenAmt), 'var(--no)',
    `von ${formatEUR(barGesamt)} gesamt`
  ));
  container.appendChild(kpiGrid);

  // ── POS LIVE-KASSE ──
  container.appendChild(renderPOSKasse(filtered));

  // ── Table ──
  if (state.hrmSubTab === 'intern') {
    container.appendChild(renderHRMInternTable(filtered));
  } else {
    container.appendChild(renderHRMSteuerberaterTable(filtered));
  }

  return container;
}

function renderHRMKpiCard(title, value, color, sub) {
  const card = el('div', {
    style: {
      background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: '8px',
      padding: '10px 14px', borderLeft: `3px solid ${color}`
    }
  });
  card.appendChild(el('div', { style: { fontSize: '9px', color: 'var(--tx3)' } }, title));
  card.appendChild(el('div', {
    style: { fontSize: '16px', fontWeight: 700, fontFamily: 'var(--mono)', color, marginTop: '2px' }
  }, value));
  card.appendChild(el('div', { style: { fontSize: '9px', color: 'var(--tx3)', marginTop: '1px' } }, sub));
  return card;
}

function renderPOSKasse(data) {
  const section = el('div', { style: { marginBottom: '16px' } });
  section.appendChild(el('div', {
    style: { fontSize: '10px', fontWeight: 700, color: 'var(--tx2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }
  }, 'POS LIVE-KASSE'));

  const grid = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } });

  const barTotal = data.filter(d => d.bar_tg > 0).reduce((s, d) => s + d.bar_tg, 0);
  const barPaid = data.filter(d => d.bar_tg > 0 && d.bar_status !== 'offen').reduce((s, d) => s + d.bar_tg, 0);
  const barRemaining = barTotal - barPaid;

  const ueTotal = data.filter(d => d.ueberweisung > 0).reduce((s, d) => s + d.ueberweisung, 0);
  const uePaid = data.filter(d => d.ueberweisung > 0 && d.ue_status !== 'offen').reduce((s, d) => s + d.ueberweisung, 0);
  const ueRemaining = ueTotal - uePaid;

  // POS Bar card
  const barCard = el('div', {
    style: {
      border: '2px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px',
      background: 'rgba(239,68,68,0.02)'
    }
  });
  barCard.appendChild(el('span', {
    style: { fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'rgba(239,68,68,0.1)', color: 'var(--no)', fontWeight: 700 }
  }, '💵 POS Kasse (Bar)'));
  barCard.appendChild(el('div', {
    style: { fontSize: '16px', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: '4px' }
  }, formatEUR(barPaid)));
  barCard.appendChild(el('div', { style: { fontSize: '9px', color: 'var(--tx3)' } }, `Ziel: ${formatEUR(barTotal)} Bar-Löhne`));
  if (barRemaining > 0) {
    barCard.appendChild(el('div', {
      style: { fontSize: '9px', color: 'var(--no)', marginTop: '4px', fontWeight: 600 }
    }, `❌ Es fehlen noch ${formatEUR(barRemaining)}`));
  } else {
    barCard.appendChild(el('div', {
      style: { fontSize: '9px', color: 'var(--ok)', marginTop: '4px', fontWeight: 600 }
    }, `✅ Vollständig bezahlt`));
  }
  grid.appendChild(barCard);

  // POS Bank card
  const bankCard = el('div', {
    style: {
      border: '2px solid rgba(59,125,221,0.3)', borderRadius: '8px', padding: '10px 14px',
      background: 'rgba(59,125,221,0.02)'
    }
  });
  bankCard.appendChild(el('span', {
    style: { fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'rgba(59,125,221,0.1)', color: 'var(--ac)', fontWeight: 700 }
  }, '🏦 POS Kasse (Bank)'));
  bankCard.appendChild(el('div', {
    style: { fontSize: '16px', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: '4px' }
  }, formatEUR(uePaid)));
  bankCard.appendChild(el('div', { style: { fontSize: '9px', color: 'var(--tx3)' } }, `Ziel: ${formatEUR(ueTotal)} Überweisungen`));
  if (ueRemaining > 0) {
    bankCard.appendChild(el('div', {
      style: { fontSize: '9px', color: 'var(--no)', marginTop: '4px', fontWeight: 600 }
    }, `❌ Es fehlen noch ${formatEUR(ueRemaining)}`));
  } else {
    bankCard.appendChild(el('div', {
      style: { fontSize: '9px', color: 'var(--ok)', marginTop: '4px', fontWeight: 600 }
    }, `✅ Vollständig bezahlt`));
  }
  grid.appendChild(bankCard);

  section.appendChild(grid);
  return section;
}

function renderHRMInternTable(data) {
  const BANKS = ['Commerzbank', 'Commerzbank Enso', 'Commerzbank Okyu', 'Commerzbank Origami',
    'Deutsche Bank', 'ING', 'Revolut Enso', 'Revolut Okyu', 'Revolut Ultra', 'Sparkasse', 'VR Bank', 'Volksbank'];

  const wrap = el('div', { style: { overflow: 'auto' } });
  const table = el('table', { className: 'gm-table' });

  const thead = el('thead');
  const hr = el('tr');
  ['PERSNR \u2191', 'MITARBEITER \u25b2', 'BETRIEB', '\ud83c\udfe6 \u00dcBERWEISUNG', '\ud83d\udcb5 BAR/TG'].forEach((h, i) => {
    hr.appendChild(el('th', { style: { textAlign: i >= 3 ? 'right' : 'left', cursor: 'pointer' } }, h));
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = el('tbody');
  [...data].sort((a, b) => (a.name || '').localeCompare(b.name || '')).forEach(d => {
    const tr = el('tr');

    tr.appendChild(el('td', { className: 'mono', style: { fontSize: '10px', color: 'var(--tx3)' } },
      String(d.persNr).padStart(5, '0')));

    const nameParts = (d.name || '').split(',');
    const lastName = (nameParts[0] || '').trim();
    const firstInitial = (nameParts[1] || '').trim().split(' ').map(n => n[0]).join('. ');
    tr.appendChild(el('td', { style: { fontWeight: 600 } }, `${firstInitial ? firstInitial + '. ' : ''}${lastName}`));

    const bColor = BETRIEB_COLORS[d.betrieb] || 'var(--ac)';
    tr.appendChild(el('td', {}, el('span', {
      style: { padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 600, background: bColor + '18', color: bColor }
    }, d.betrieb)));

    // \u2500\u2500 \u00dcberweisung cell \u2500\u2500
    const ueCell = el('td', { style: { textAlign: 'right', position: 'relative' } });
    if (d.ueberweisung > 0) {
      const ueCol = getPaymentStatusColor(d.ue_status);
      const ueWrap = el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' } });

      const statusBtn = el('button', {
        style: {
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '3px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: 600,
          border: '1px solid ' + ueCol + '40', background: ueCol + '10', color: ueCol,
          cursor: 'pointer', fontFamily: 'var(--mono)'
        },
        onClick: (e) => { e.stopPropagation(); showStatusDropdown(e.currentTarget.parentElement, d, 'ue'); }
      });
      statusBtn.appendChild(el('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: ueCol, display: 'inline-block' } }));
      statusBtn.appendChild(document.createTextNode(' ' + formatEUR(d.ueberweisung) + ' ' + getPaymentStatusIcon(d.ue_status)));
      ueWrap.appendChild(statusBtn);

      if (d.ue_datum) ueWrap.appendChild(el('span', { style: { fontSize: '8px', color: 'var(--tx3)' } }, d.ue_datum));

      ueWrap.appendChild(el('button', {
        style: {
          padding: '1px 6px', borderRadius: '8px', fontSize: '8px', fontWeight: 600,
          border: '1px solid var(--bd)', background: 'var(--sf2)', color: 'var(--ac)',
          cursor: 'pointer', fontFamily: 'var(--font)'
        },
        onClick: (e) => { e.stopPropagation(); showBankDropdown(e.currentTarget.parentElement, d, BANKS); }
      }, (d.ue_bank || 'Bank w\u00e4hlen') + ' \u25be'));

      ueCell.appendChild(ueWrap);
    } else {
      ueCell.appendChild(el('span', { style: { color: 'var(--tx3)', fontSize: '10px' } }, '\u2014'));
    }
    tr.appendChild(ueCell);

    // \u2500\u2500 Bar/TG cell \u2500\u2500
    const barCell = el('td', { style: { textAlign: 'right', position: 'relative' } });
    if (d.bar_tg > 0) {
      const barCol = getPaymentStatusColor(d.bar_status === 'gezahlt' ? 'ueberwiesen' : d.bar_status);
      const barWrap = el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' } });

      const barBtn = el('button', {
        style: {
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '3px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: 600,
          border: '1px solid ' + barCol + '40', background: barCol + '10', color: barCol,
          cursor: 'pointer', fontFamily: 'var(--mono)'
        },
        onClick: (e) => { e.stopPropagation(); showStatusDropdown(e.currentTarget.parentElement, d, 'bar'); }
      });
      barBtn.appendChild(el('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: barCol, display: 'inline-block' } }));
      barBtn.appendChild(document.createTextNode(' ' + formatEUR(d.bar_tg) + ' ' + getBarStatusIcon(d.bar_status)));
      barWrap.appendChild(barBtn);

      if (d.bar_datum) barWrap.appendChild(el('span', { style: { fontSize: '8px', color: 'var(--tx3)' } }, d.bar_datum));
      barCell.appendChild(barWrap);
    } else {
      barCell.appendChild(el('span', { style: { color: 'var(--tx3)', fontSize: '10px' } }, '\u2014'));
    }
    tr.appendChild(barCell);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

// \u2500\u2500 Status Dropdown \u2500\u2500
function showStatusDropdown(anchor, record, type) {
  closeAllDropdowns();
  const isUe = type === 'ue';
  const options = isUe
    ? [{ key: 'offen', label: 'Offen', icon: '\u25cb', color: '#ef4444' },
       { key: 'dauerauftrag', label: 'Dauerauftrag', icon: '\ud83d\udd04', color: '#3b7ddd' },
       { key: 'ueberwiesen', label: '\u00dcberwiesen', icon: '\u2705', color: '#10b981' }]
    : [{ key: 'offen', label: 'Offen', icon: '\u25cb', color: '#ef4444' },
       { key: 'vorbereitet', label: 'Vorbereitet', icon: '\u23f3', color: '#f59e0b' },
       { key: 'gezahlt', label: 'Gezahlt', icon: '\u2705', color: '#10b981' }];
  const currentStatus = isUe ? record.ue_status : record.bar_status;

  const dd = el('div', {
    className: 'gm-dropdown',
    style: {
      position: 'absolute', zIndex: 999, right: 0, top: '100%', marginTop: '4px',
      background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: '8px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)', minWidth: '180px', overflow: 'hidden'
    }
  });

  dd.appendChild(el('div', {
    style: { padding: '6px 12px', fontSize: '9px', color: 'var(--tx3)', borderBottom: '1px solid var(--bd)', fontWeight: 600 }
  }, `${record.name} \u00b7 ${isUe ? '\ud83c\udfe6 \u00dcberweisung' : '\ud83d\udcb5 Bar/TG'}`));

  options.forEach(opt => {
    const isActive = currentStatus === opt.key;
    const item = el('button', {
      style: {
        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
        padding: '8px 12px', border: 'none', cursor: 'pointer',
        background: isActive ? 'var(--acG)' : 'transparent',
        fontFamily: 'var(--font)', fontSize: '11px', fontWeight: isActive ? 700 : 400,
        color: opt.color, textAlign: 'left'
      },
      onClick: async () => { dd.remove(); await updatePaymentStatus(record, type, opt.key); }
    });
    item.appendChild(el('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: opt.color } }));
    item.appendChild(el('span', {}, `${opt.icon}  ${opt.label}`));
    if (isActive) item.appendChild(el('span', { style: { marginLeft: 'auto', fontSize: '9px', color: 'var(--ok)' } }, '\u2713 aktuell'));
    dd.appendChild(item);
  });

  anchor.appendChild(dd);
  setTimeout(() => document.addEventListener('click', function cl(e) {
    if (!dd.contains(e.target)) { dd.remove(); document.removeEventListener('click', cl); }
  }), 10);
}

// \u2500\u2500 Bank Dropdown \u2500\u2500
function showBankDropdown(anchor, record, banks) {
  closeAllDropdowns();
  const dd = el('div', {
    className: 'gm-dropdown',
    style: {
      position: 'absolute', zIndex: 999, right: 0, top: '100%', marginTop: '4px',
      background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: '8px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)', minWidth: '180px', maxHeight: '280px', overflow: 'auto'
    }
  });

  dd.appendChild(el('button', {
    style: {
      display: 'block', width: '100%', padding: '6px 12px', border: 'none', cursor: 'pointer',
      background: 'transparent', fontFamily: 'var(--font)', fontSize: '10px', fontWeight: 600,
      color: 'var(--no)', textAlign: 'left', borderBottom: '1px solid var(--bd)'
    },
    onClick: async () => { dd.remove(); await updateBank(record, ''); }
  }, '\u2715 Entfernen'));

  banks.forEach(bank => {
    const isActive = record.ue_bank === bank;
    dd.appendChild(el('button', {
      style: {
        display: 'block', width: '100%', padding: '6px 12px', border: 'none', cursor: 'pointer',
        background: isActive ? 'var(--acG)' : 'transparent',
        fontFamily: 'var(--font)', fontSize: '11px', fontWeight: isActive ? 700 : 400,
        color: isActive ? 'var(--ac)' : 'var(--tx)', textAlign: 'left'
      },
      onClick: async () => { dd.remove(); await updateBank(record, bank); }
    }, (isActive ? '\u2713 ' : '') + bank));
  });

  dd.appendChild(el('button', {
    style: {
      display: 'block', width: '100%', padding: '6px 12px', border: 'none', cursor: 'pointer',
      background: 'transparent', fontFamily: 'var(--font)', fontSize: '10px', fontWeight: 600,
      color: 'var(--wn)', textAlign: 'left', borderTop: '1px solid var(--bd)'
    },
    onClick: () => { const v = prompt('Bank eingeben:'); if (v) { dd.remove(); updateBank(record, v); } }
  }, '\u270f\ufe0f Andere...'));

  anchor.appendChild(dd);
  setTimeout(() => document.addEventListener('click', function cl(e) {
    if (!dd.contains(e.target)) { dd.remove(); document.removeEventListener('click', cl); }
  }), 10);
}

function closeAllDropdowns() { document.querySelectorAll('.gm-dropdown').forEach(d => d.remove()); }

async function updatePaymentStatus(record, type, newStatus) {
  const field = type === 'ue' ? 'ue_status' : 'bar_status';
  const dateField = type === 'ue' ? 'ue_datum' : 'bar_datum';
  const today = new Date();
  const dateStr = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
  const update = { [field]: newStatus };
  if ((type === 'ue' && newStatus === 'ueberwiesen') || (type === 'bar' && newStatus === 'gezahlt')) {
    update[dateField] = dateStr;
  }
  const { error } = await supabase.from('gehaelter').update(update)
    .eq('pers_nr', record.persNr).eq('betrieb', record.betrieb).eq('monat', state.currentMonat);
  if (error) { showToast('\u274c Fehler: ' + error.message); }
  else { showToast(`\u2705 ${record.name}: ${newStatus}`); state.gehaltData = await loadGehaltData(state.currentMonat); renderApp(); }
}

async function updateBank(record, newBank) {
  const { error } = await supabase.from('gehaelter').update({ ue_bank: newBank })
    .eq('pers_nr', record.persNr).eq('betrieb', record.betrieb).eq('monat', state.currentMonat);
  if (error) { showToast('\u274c Fehler: ' + error.message); }
  else { showToast(`\u2705 Bank \u2192 ${newBank || 'entfernt'}`); state.gehaltData = await loadGehaltData(state.currentMonat); renderApp(); }
}

function renderHRMSteuerberaterTable(data) {
  const section = el('div');
  section.appendChild(el('div', {
    style: { fontSize: '10px', color: 'var(--tx3)', marginBottom: '8px', fontStyle: 'italic' }
  }, 'Ansicht für Steuerberater:'));

  const wrap = el('div', { style: { overflow: 'auto' } });
  const table = el('table', { className: 'gm-table' });

  const thead = el('thead');
  const hr = el('tr');
  ['PERSNR', 'NAME', 'BETRIEB', 'GEHALT', 'GES.-BRUTTO', 'NETTO', 'AUSZAHLUNG'].forEach((h, i) => {
    const th = el('th', {
      style: { textAlign: i >= 3 ? 'right' : 'left' }
    }, h);
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = el('tbody');
  const sorted = [...data].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  sorted.forEach(d => {
    const tr = el('tr');

    tr.appendChild(el('td', { className: 'mono', style: { fontSize: '10px', color: 'var(--tx3)' } },
      String(d.persNr).padStart(5, '0')));

    tr.appendChild(el('td', { style: { fontWeight: 600 } }, d.name || '—'));

    const bColor = BETRIEB_COLORS[d.betrieb] || 'var(--ac)';
    tr.appendChild(el('td', {},
      el('span', {
        style: { padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 600, background: bColor + '18', color: bColor }
      }, d.betrieb)
    ));

    tr.appendChild(el('td', { className: 'mono right' }, formatEUR(d.gehalt || 0)));
    tr.appendChild(el('td', { className: 'mono right bold' }, formatEUR(d.brutto || 0)));
    tr.appendChild(el('td', { className: 'mono right' }, formatEUR(d.netto || 0)));

    const auszahlung = (d.ueberweisung || 0) + (d.bar_tg || 0);
    tr.appendChild(el('td', { className: 'mono right bold', style: { color: 'var(--ac)' } }, formatEUR(auszahlung)));

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrap.appendChild(table);
  section.appendChild(wrap);
  return section;
}

function getPaymentStatusColor(status) {
  switch (status) {
    case 'ueberwiesen': return '#10b981';
    case 'dauerauftrag': return '#3b7ddd';
    case 'vorbereitet': return '#f59e0b';
    case 'offen': return '#ef4444';
    default: return '#9ca3af';
  }
}

function getPaymentStatusIcon(status) {
  switch (status) {
    case 'ueberwiesen': return ' ✓';
    case 'dauerauftrag': return ' ↻';
    case 'vorbereitet': return ' ◐';
    case 'offen': return ' ○';
    default: return '';
  }
}

function getBarStatusIcon(status) {
  switch (status) {
    case 'gezahlt': return ' ✓';
    case 'vorbereitet': return ' ◐';
    case 'offen': return ' ○';
    default: return '';
  }
}

function getTypColor(typ) {
  switch (typ) {
    case 'Vollzeit': return { color: '#10b981', bg: 'rgba(16,185,129,0.08)' };
    case 'Teilzeit': return { color: '#3b7ddd', bg: 'rgba(59,125,221,0.08)' };
    case 'Minijob': return { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' };
    case 'Azubi': return { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' };
    default: return { color: '#9ca3af', bg: 'rgba(156,163,175,0.08)' };
  }
}

// ════════════════════════════════════════════
//  EINSTELLUNGEN TAB
// ════════════════════════════════════════════
function renderEinstellungen() {
  const container = el('div', { className: 'anim-up' });

  if (!state.settingsTab) state.settingsTab = 'import';

  // Sub-tabs
  const tabRow = el('div', { style: { display: 'flex', gap: '0', borderBottom: '2px solid var(--bd)', marginBottom: '16px' } });
  [
    { key: 'import', label: '📥 Import', color: 'var(--ac)' },
    { key: 'benutzer', label: '👤 Benutzer', color: 'var(--wn)' },
    { key: 'sicherung', label: '🛡️ Sicherung', color: 'var(--ok)' },
  ].forEach(t => {
    const active = state.settingsTab === t.key;
    tabRow.appendChild(el('button', {
      style: {
        padding: '8px 16px', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font)', fontSize: '12px', fontWeight: active ? 700 : 400,
        color: active ? t.color : 'var(--tx2)',
        borderBottom: active ? `2px solid ${t.color}` : '2px solid transparent',
        background: 'transparent', marginBottom: '-2px'
      },
      onClick: () => { state.settingsTab = t.key; renderApp(); }
    }, t.label));
  });
  container.appendChild(tabRow);

  switch (state.settingsTab) {
    case 'import': container.appendChild(renderSettingsImport()); break;
    case 'benutzer': container.appendChild(renderSettingsBenutzer()); break;
    case 'sicherung': container.appendChild(renderSettingsSicherung()); break;
  }

  return container;
}

// ── Import Tab ──
function renderSettingsImport() {
  const section = el('div');

  // Action buttons
  const actionRow = el('div', { style: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' } });
  actionRow.appendChild(el('button', {
    className: 'gm-btn gm-btn-primary',
    style: { fontSize: '10px' }
  }, '📊 STB Import'));
  actionRow.appendChild(el('button', {
    className: 'gm-btn gm-btn-ghost',
    style: { fontSize: '10px' }
  }, '📋 Import-Historie'));
  section.appendChild(actionRow);

  // DATEV section
  const datevCard = el('div', { className: 'gm-card' });
  datevCard.appendChild(el('div', { style: { fontWeight: 700, fontSize: '12px', marginBottom: '2px' } },
    '📋 DATEV-Auswertung vom Steuerberater'));
  datevCard.appendChild(el('div', {
    style: { fontSize: '9px', color: 'var(--tx3)', marginBottom: '16px' }
  }, 'Format: "Auswertung 2" — Excel mit Lohnarten, SV, Steuer, Auszahlung'));

  // Upload zone
  const uploadZone = el('div', {
    style: {
      border: '2px dashed var(--bd)', borderRadius: '10px', padding: '40px',
      textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
      background: 'var(--sf2)'
    }
  });
  uploadZone.appendChild(el('div', { style: { fontSize: '28px', marginBottom: '8px' } }, '📊'));
  uploadZone.appendChild(el('div', {
    style: { fontWeight: 600, fontSize: '12px' }
  }, 'DATEV-Excel hochladen'));
  uploadZone.appendChild(el('div', {
    style: { fontSize: '9px', color: 'var(--tx3)', marginTop: '4px' }
  }, 'Klicken oder Datei hierher ziehen'));

  datevCard.appendChild(uploadZone);
  section.appendChild(datevCard);

  return section;
}

// ── Benutzer Tab ──
function renderSettingsBenutzer() {
  const section = el('div');
  const users = state.usersData || [];

  // Header with Add button
  const headerRow = el('div', {
    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
  });
  headerRow.appendChild(el('div', { className: 'gm-title', style: { marginBottom: 0 } }, '👥 BENUTZERVERWALTUNG'));
  headerRow.appendChild(el('button', {
    className: 'gm-btn gm-btn-primary',
    style: { fontSize: '10px' },
    onClick: () => openUserModal(null) // New user
  }, '+ Neuer Benutzer'));
  section.appendChild(headerRow);

  // Users table
  const wrap = el('div', { className: 'gm-table-wrap' });
  const table = el('table', { className: 'gm-table' });

  const thead = el('thead');
  const hr = el('tr');
  ['NAME', 'BENUTZER#', 'PIN', 'ROLLE', 'STANDORT*', 'RECHTE', ''].forEach(h => {
    hr.appendChild(el('th', {}, h));
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = el('tbody');
  users.forEach(u => {
    const tr = el('tr', { style: { cursor: 'pointer' } });

    // Name
    tr.appendChild(el('td', { style: { fontWeight: 600 } }, u.name || '—'));

    // Username/email
    tr.appendChild(el('td', { style: { fontSize: '10px', color: 'var(--tx2)' } }, u.username || '—'));

    // PIN (masked)
    tr.appendChild(el('td', { className: 'mono', style: { fontSize: '11px', letterSpacing: '2px' } }, '••••'));

    // Rolle badge
    const rolleConfig = getRolleConfig(u.rolle);
    tr.appendChild(el('td', {},
      el('span', {
        style: {
          padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
          background: rolleConfig.bg, color: rolleConfig.color
        }
      }, `${rolleConfig.icon} ${rolleConfig.label}`)
    ));

    // Standorte
    const standortCell = el('td');
    const standorte = u.standorte || [];
    if (standorte.length === 0 || standorte.length >= 4) {
      standortCell.appendChild(el('span', {
        style: { fontSize: '9px', color: 'var(--tx3)' }
      }, 'Alle'));
    } else {
      const sRow = el('div', { style: { display: 'flex', gap: '3px', flexWrap: 'wrap' } });
      standorte.forEach(s => {
        const c = BETRIEB_COLORS[s] || 'var(--ac)';
        sRow.appendChild(el('span', {
          style: { padding: '1px 5px', borderRadius: '3px', fontSize: '8px', fontWeight: 600, background: c + '18', color: c }
        }, s));
      });
      standortCell.appendChild(sRow);
    }
    tr.appendChild(standortCell);

    // Rechte count
    const perms = u.perms || {};
    const permCount = Object.values(perms).filter(v => v === true).length;
    const totalPerms = Object.keys(perms).length;
    const rechteBtn = el('button', {
      style: {
        padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
        background: permCount === totalPerms ? 'rgba(16,185,129,0.1)' : 'rgba(59,125,221,0.1)',
        color: permCount === totalPerms ? '#10b981' : '#3b7ddd',
        border: 'none', cursor: 'pointer', fontFamily: 'var(--font)'
      },
      onClick: (e) => { e.stopPropagation(); openRechteModal(u); }
    }, `${permCount}/${totalPerms}`);
    tr.appendChild(el('td', {}, rechteBtn));

    // Edit + Delete buttons
    const actionCell = el('td', { style: { whiteSpace: 'nowrap' } });
    actionCell.appendChild(el('button', {
      style: { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', padding: '2px' },
      title: 'Bearbeiten',
      onClick: (e) => { e.stopPropagation(); openUserModal(u); }
    }, '✏️'));
    actionCell.appendChild(el('button', {
      style: { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', padding: '2px' },
      title: 'Löschen',
      onClick: (e) => { e.stopPropagation(); deleteUser(u.id); }
    }, '🗑️'));
    tr.appendChild(actionCell);

    tr.addEventListener('click', () => openUserModal(u));
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrap.appendChild(table);
  section.appendChild(wrap);

  return section;
}

function openUserModal(user) {
  const isNew = !user;
  const editUser = user ? { ...user, perms: { ...user.perms }, standorte: [...(user.standorte || [])] }
    : { name: '', username: '', passhash: '', rolle: 'mitarbeiter', standorte: [], perms: {}, aktiv: true };

  // Create modal overlay
  const overlay = el('div', {
    className: 'gm-modal-overlay show',
    onClick: (e) => { if (e.target === overlay) overlay.remove(); }
  });

  const modal = el('div', { className: 'gm-modal', style: { maxWidth: '600px' } });

  // Header
  const header = el('div', { className: 'gm-modal-header' });
  header.appendChild(el('div', { style: { fontWeight: 700, fontSize: '14px' } },
    isNew ? '+ Neuer Benutzer' : `✏️ ${editUser.name}`));
  header.appendChild(el('button', {
    style: { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: 'var(--tx2)' },
    onClick: () => overlay.remove()
  }, '✕'));
  modal.appendChild(header);

  // Body
  const body = el('div', { className: 'gm-modal-body' });

  // Form fields
  const formGrid = el('div', {
    style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }
  });

  // Name
  const nameGroup = el('div');
  nameGroup.appendChild(el('label', { style: { fontSize: '9px', color: 'var(--tx3)', display: 'block', marginBottom: '3px' } }, 'NAME'));
  const nameInput = el('input', {
    className: 'gm-input', style: { width: '100%' }, value: editUser.name,
    onInput: (e) => { editUser.name = e.target.value; }
  });
  nameGroup.appendChild(nameInput);
  formGrid.appendChild(nameGroup);

  // Username
  const userGroup = el('div');
  userGroup.appendChild(el('label', { style: { fontSize: '9px', color: 'var(--tx3)', display: 'block', marginBottom: '3px' } }, 'E-MAIL / BENUTZERNAME'));
  const userInput = el('input', {
    className: 'gm-input', style: { width: '100%' }, value: editUser.username || '',
    onInput: (e) => { editUser.username = e.target.value; }
  });
  userGroup.appendChild(userInput);
  formGrid.appendChild(userGroup);

  // PIN
  const pinGroup = el('div');
  pinGroup.appendChild(el('label', { style: { fontSize: '9px', color: 'var(--tx3)', display: 'block', marginBottom: '3px' } }, 'PIN'));
  const pinInput = el('input', {
    className: 'gm-input', style: { width: '100%' }, value: editUser.passhash || '',
    type: 'text', placeholder: '••••',
    onInput: (e) => { editUser.passhash = e.target.value; }
  });
  pinGroup.appendChild(pinInput);
  formGrid.appendChild(pinGroup);

  // Rolle
  const rolleGroup = el('div');
  rolleGroup.appendChild(el('label', { style: { fontSize: '9px', color: 'var(--tx3)', display: 'block', marginBottom: '3px' } }, 'ROLLE'));
  const rolleSelect = el('select', {
    className: 'gm-select', style: { width: '100%' },
    onChange: (e) => { editUser.rolle = e.target.value; }
  });
  ['inhaber', 'buchhalter', 'standortleiter', 'mitarbeiter'].forEach(r => {
    const opt = el('option', { value: r }, getRolleConfig(r).label);
    if (r === editUser.rolle) opt.selected = true;
    rolleSelect.appendChild(opt);
  });
  rolleGroup.appendChild(rolleSelect);
  formGrid.appendChild(rolleGroup);

  body.appendChild(formGrid);

  // Standorte toggles
  body.appendChild(el('div', {
    style: { fontSize: '9px', color: 'var(--tx3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }
  }, 'STANDORTE'));
  const standortRow = el('div', { style: { display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' } });

  BETRIEBE.forEach(b => {
    const isActive = editUser.standorte.includes(b);
    const c = BETRIEB_COLORS[b];
    const btn = el('button', {
      style: {
        padding: '4px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
        border: isActive ? `2px solid ${c}` : '1px solid var(--bd)',
        background: isActive ? c + '20' : 'transparent',
        color: isActive ? c : 'var(--tx3)',
        cursor: 'pointer', fontFamily: 'var(--font)'
      },
      onClick: () => {
        if (editUser.standorte.includes(b)) {
          editUser.standorte = editUser.standorte.filter(s => s !== b);
        } else {
          editUser.standorte.push(b);
        }
        // Re-render standort toggles
        btn.style.border = editUser.standorte.includes(b) ? `2px solid ${c}` : '1px solid var(--bd)';
        btn.style.background = editUser.standorte.includes(b) ? c + '20' : 'transparent';
        btn.style.color = editUser.standorte.includes(b) ? c : 'var(--tx3)';
      }
    }, b);
    standortRow.appendChild(btn);
  });
  body.appendChild(standortRow);

  // Permissions toggles
  body.appendChild(el('div', {
    style: { fontSize: '9px', color: 'var(--tx3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }
  }, 'BERECHTIGUNGEN'));

  const permGroups = {
    'Ansicht': ['see_dash', 'see_abr', 'see_ma', 'see_banken', 'see_smart', 'see_popup', 'see_netto', 'see_brutto', 'see_gehalt', 'see_summe', 'see_extras', 'see_ueberw', 'see_bar', 'see_typ', 'see_notiz', 'see_ziel', 'see_ue_status', 'see_bar_status'],
    'Bearbeiten': ['edit_values', 'edit_brutto', 'edit_status', 'edit_stamm', 'edit_notiz', 'edit_bar', 'edit_hrm_status'],
    'Funktionen': ['fn_import', 'fn_export', 'fn_users', 'fn_betrieb', 'fn_create_ma', 'fn_deactivate', 'fn_abrechnung', 'hrm_daten_import'],
    'Popup': ['pop_kpi', 'pop_table', 'pop_chart', 'pop_cross', 'pop_stamm', 'pop_history'],
    'HRM': ['ansicht_hrm_intern', 'ansicht_hrm_stb', 'ansicht_hrm_gehalt'],
  };

  const permWrap = el('div', { style: { maxHeight: '200px', overflow: 'auto', border: '1px solid var(--bd)', borderRadius: '8px', padding: '8px' } });

  Object.entries(permGroups).forEach(([groupName, keys]) => {
    permWrap.appendChild(el('div', {
      style: { fontSize: '9px', fontWeight: 700, color: 'var(--ac)', marginTop: '6px', marginBottom: '4px' }
    }, groupName));

    const permGrid = el('div', {
      style: { display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }
    });

    keys.forEach(key => {
      const isOn = editUser.perms[key] === true;
      const chip = el('button', {
        style: {
          padding: '2px 7px', borderRadius: '4px', fontSize: '8px', fontWeight: 600,
          border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
          background: isOn ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.06)',
          color: isOn ? '#10b981' : '#ef4444'
        },
        onClick: () => {
          editUser.perms[key] = !editUser.perms[key];
          chip.style.background = editUser.perms[key] ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.06)';
          chip.style.color = editUser.perms[key] ? '#10b981' : '#ef4444';
          chip.textContent = (editUser.perms[key] ? '✓ ' : '✗ ') + key;
        }
      }, (isOn ? '✓ ' : '✗ ') + key);
      permGrid.appendChild(chip);
    });

    permWrap.appendChild(permGrid);
  });

  body.appendChild(permWrap);

  // Action buttons
  const actions = el('div', {
    style: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--bd)' }
  });
  actions.appendChild(el('button', {
    className: 'gm-btn gm-btn-ghost',
    onClick: () => overlay.remove()
  }, 'Abbrechen'));
  actions.appendChild(el('button', {
    className: 'gm-btn gm-btn-primary',
    onClick: async () => {
      await saveUser(editUser, isNew);
      overlay.remove();
    }
  }, isNew ? 'Erstellen' : 'Speichern'));
  body.appendChild(actions);

  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function openRechteModal(user) {
  const editPerms = { ...user.perms };

  const overlay = el('div', {
    className: 'gm-modal-overlay show',
    onClick: (e) => { if (e.target === overlay) overlay.remove(); }
  });

  const modal = el('div', { className: 'gm-modal', style: { maxWidth: '680px' } });

  // Header
  const header = el('div', { className: 'gm-modal-header' });
  header.appendChild(el('div', {},
    el('div', { style: { fontWeight: 700, fontSize: '14px' } }, `\ud83d\udd10 Berechtigungen \u2014 ${user.name}`),
    el('div', { style: { fontSize: '10px', color: 'var(--tx3)' } }, 'Einzelne Rechte ein/aus schalten')
  ));
  header.appendChild(el('button', {
    style: { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: 'var(--tx2)' },
    onClick: () => overlay.remove()
  }, '\u2715'));
  modal.appendChild(header);

  const body = el('div', { className: 'gm-modal-body', style: { maxHeight: '70vh', overflow: 'auto' } });

  // Presets row
  const presetRow = el('div', { style: { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' } });
  presetRow.appendChild(el('span', { style: { fontSize: '10px', color: 'var(--tx3)' } }, 'Vorlage:'));

  const rolePresets = {
    'inhaber': { label: '\ud83d\udc51 Inhaber / GF', perms: 'all' },
    'buchhalter': { label: '\ud83d\udcca Buchhalter', keys: ['see_dash','see_abr','see_ma','see_banken','see_netto','see_brutto','see_gehalt','see_summe','see_extras','see_ueberw','see_bar','see_typ','see_notiz','see_ziel','see_ue_status','see_bar_status','see_popup','pop_kpi','pop_table','pop_chart','pop_cross','pop_stamm','pop_history','fn_export'] },
    'standortleiter': { label: '\ud83c\udfe2 Standortleiter', keys: ['see_dash','see_abr','see_ma','see_netto','see_brutto','see_gehalt','see_summe','see_ueberw','see_bar','see_typ','see_ue_status','see_bar_status','edit_status','edit_bar','edit_notiz'] },
    'mitarbeiter': { label: '\ud83d\udc64 Mitarbeiter', keys: ['see_dash'] }
  };

  Object.entries(rolePresets).forEach(([key, preset]) => {
    presetRow.appendChild(el('button', {
      className: 'gm-btn gm-btn-ghost',
      style: { fontSize: '9px', padding: '3px 8px' },
      onClick: () => {
        const allKeys = getAllPermKeys();
        if (preset.perms === 'all') {
          allKeys.forEach(k => { editPerms[k] = true; });
        } else {
          allKeys.forEach(k => { editPerms[k] = false; });
          preset.keys.forEach(k => { editPerms[k] = true; });
        }
        rerenderChecks();
      }
    }, preset.label));
  });

  // Alle an / Alle aus
  presetRow.appendChild(el('button', {
    className: 'gm-btn gm-btn-primary',
    style: { fontSize: '9px', padding: '3px 8px' },
    onClick: () => { getAllPermKeys().forEach(k => { editPerms[k] = true; }); rerenderChecks(); }
  }, 'Alle an'));
  presetRow.appendChild(el('button', {
    className: 'gm-btn gm-btn-ghost',
    style: { fontSize: '9px', padding: '3px 8px' },
    onClick: () => { getAllPermKeys().forEach(k => { editPerms[k] = false; }); rerenderChecks(); }
  }, 'Alle aus'));
  body.appendChild(presetRow);

  // Permission groups with German labels
  const permSections = [
    { title: 'SEITEN', items: [
      { key: 'see_dash', label: 'Dashboard', desc: 'KPIs und Diagramme' },
      { key: 'see_abr', label: 'Abrechnung', desc: 'Abrechnungs-Tab' },
      { key: 'see_banken', label: 'Banken', desc: 'Banken-\u00dcbersicht' },
      { key: 'see_ma', label: 'Mitarbeiter', desc: 'Mitarbeiter-Tab' },
      { key: 'see_smart', label: 'Smart Money', desc: 'Benefits-Tab' },
    ]},
    { title: 'ABRECHNUNG \u2014 SPALTEN', items: [
      { key: 'see_gehalt', label: 'Gehalt', desc: 'Gehalt-Spalte (Grundlohn)' },
      { key: 'see_brutto', label: 'Ges.-Brutto', desc: 'Gesamt-Brutto-Spalte' },
      { key: 'see_netto', label: 'Netto', desc: 'Netto-Spalte' },
      { key: 'see_ueberw', label: '\u00dcberweisung', desc: '\u00dcberweisungs-Betrag' },
      { key: 'see_ue_status', label: '\u00dc-Status', desc: '\u00dcberweisungs-Status + Datum' },
      { key: 'see_bar', label: 'Bar/TG', desc: 'Bar/TG-Betrag' },
      { key: 'see_bar_status', label: 'B-Status', desc: 'Bar-Status + Datum' },
      { key: 'see_summe', label: 'Summe', desc: '\u00dcberw. + Bar Summe' },
      { key: 'see_ziel', label: 'Ziel-Gehalt', desc: 'Ziel-Gehalt Spalte' },
      { key: 'see_notiz', label: 'Notizen', desc: 'Notiz-Spalte' },
      { key: 'see_extras', label: 'Extras', desc: 'Benefits & Extras' },
      { key: 'see_typ', label: 'Typ', desc: 'Besch\u00e4ftigungsart' },
    ]},
    { title: 'BEARBEITEN', items: [
      { key: 'edit_values', label: 'Werte \u00e4ndern', desc: 'Gehalt/Brutto bearbeiten' },
      { key: 'edit_brutto', label: 'Brutto', desc: 'Brutto-Wert \u00e4ndern' },
      { key: 'edit_status', label: 'Status', desc: '\u00dcberweisungs-Status' },
      { key: 'edit_stamm', label: 'Stammdaten', desc: 'MA-Stammdaten bearbeiten' },
      { key: 'edit_notiz', label: 'Notizen', desc: 'Notiz bearbeiten' },
      { key: 'edit_bar', label: 'Bar/TG', desc: 'Bar-Betrag \u00e4ndern' },
      { key: 'edit_hrm_status', label: 'HRM Status', desc: 'HRM-Zahlungsstatus' },
    ]},
    { title: 'FUNKTIONEN', items: [
      { key: 'fn_import', label: 'Import', desc: 'Daten importieren' },
      { key: 'fn_export', label: 'Export', desc: 'Daten exportieren' },
      { key: 'fn_users', label: 'Benutzer', desc: 'Benutzerverwaltung' },
      { key: 'fn_betrieb', label: 'Betrieb', desc: 'Betrieb verwalten' },
      { key: 'fn_create_ma', label: 'MA erstellen', desc: 'Neuen Mitarbeiter' },
      { key: 'fn_deactivate', label: 'Deaktivieren', desc: 'MA deaktivieren' },
      { key: 'fn_abrechnung', label: 'Abrechnung', desc: 'Monat abschlie\u00dfen' },
      { key: 'hrm_daten_import', label: 'HRM Import', desc: 'HRM-Daten importieren' },
    ]},
    { title: 'POPUP / DETAIL', items: [
      { key: 'see_popup', label: 'Popup', desc: 'Details-Popup \u00f6ffnen' },
      { key: 'pop_kpi', label: 'KPI', desc: 'KPI im Popup' },
      { key: 'pop_table', label: 'Tabelle', desc: 'Tabelle im Popup' },
      { key: 'pop_chart', label: 'Chart', desc: 'Diagramm im Popup' },
      { key: 'pop_cross', label: 'Standort\u00fcbergreifend', desc: 'Cross-Standort' },
      { key: 'pop_stamm', label: 'Stamm', desc: 'Stammdaten im Popup' },
      { key: 'pop_history', label: 'Historie', desc: 'Verlauf im Popup' },
    ]},
    { title: 'HRM', items: [
      { key: 'ansicht_hrm_intern', label: 'HRM Intern', desc: 'Interne Ansicht' },
      { key: 'ansicht_hrm_stb', label: 'HRM STB', desc: 'Steuerberater-Ansicht' },
      { key: 'ansicht_hrm_gehalt', label: 'HRM Gehalt', desc: 'Gehalts-Ansicht' },
    ]},
  ];

  const checksContainer = el('div');

  function rerenderChecks() {
    checksContainer.innerHTML = '';
    permSections.forEach(section => {
      checksContainer.appendChild(el('div', {
        style: { fontSize: '10px', fontWeight: 700, color: 'var(--ac)', marginTop: '12px', marginBottom: '6px', letterSpacing: '0.04em' }
      }, section.title));

      const grid = el('div', {
        style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }
      });

      section.items.forEach(item => {
        const isOn = editPerms[item.key] === true;
        const row = el('label', {
          style: {
            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px',
            borderRadius: '6px', cursor: 'pointer',
            background: isOn ? 'rgba(16,185,129,0.04)' : 'var(--sf2)',
            border: isOn ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--bd)',
            transition: 'all 0.15s'
          }
        });

        const cb = el('input', {
          type: 'checkbox',
          style: { accentColor: 'var(--ok)', width: '14px', height: '14px', cursor: 'pointer' },
          onChange: () => {
            editPerms[item.key] = cb.checked;
            rerenderChecks();
          }
        });
        cb.checked = isOn;
        row.appendChild(cb);

        const labelWrap = el('div');
        labelWrap.appendChild(el('div', { style: { fontSize: '11px', fontWeight: 600, color: 'var(--tx)' } }, item.label));
        labelWrap.appendChild(el('div', { style: { fontSize: '8px', color: 'var(--tx3)' } }, item.desc));
        row.appendChild(labelWrap);

        grid.appendChild(row);
      });

      checksContainer.appendChild(grid);
    });
  }

  rerenderChecks();
  body.appendChild(checksContainer);

  // Footer
  const footer = el('div', {
    style: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--bd)' }
  });
  footer.appendChild(el('button', {
    className: 'gm-btn gm-btn-ghost',
    onClick: () => overlay.remove()
  }, 'Abbrechen'));
  footer.appendChild(el('button', {
    className: 'gm-btn gm-btn-primary',
    onClick: async () => {
      const { error } = await supabase.from('users').update({ perms: editPerms }).eq('id', user.id);
      if (error) { showToast('\u274c Fehler: ' + error.message); }
      else { showToast('\u2705 Rechte gespeichert'); state.usersData = await loadUsersData(); renderApp(); }
      overlay.remove();
    }
  }, 'Speichern'));
  body.appendChild(footer);

  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function getAllPermKeys() {
  return ['see_dash','see_abr','see_ma','see_banken','see_smart','see_popup','see_netto','see_brutto','see_gehalt','see_summe','see_extras','see_ueberw','see_bar','see_typ','see_notiz','see_ziel','see_ue_status','see_bar_status','edit_values','edit_brutto','edit_status','edit_stamm','edit_notiz','edit_bar','edit_hrm_status','fn_import','fn_export','fn_users','fn_betrieb','fn_create_ma','fn_deactivate','fn_abrechnung','hrm_daten_import','pop_kpi','pop_table','pop_chart','pop_cross','pop_stamm','pop_history','ansicht_hrm_intern','ansicht_hrm_stb','ansicht_hrm_gehalt'];
}

async function saveUser(userData, isNew) {
  const payload = {
    name: userData.name,
    username: userData.username,
    passhash: userData.passhash,
    rolle: userData.rolle,
    standorte: userData.standorte,
    perms: userData.perms,
    aktiv: true
  };

  let error;
  if (isNew) {
    const res = await supabase.from('users').insert([payload]);
    error = res.error;
  } else {
    const res = await supabase.from('users').update(payload).eq('id', userData.id);
    error = res.error;
  }

  if (error) {
    console.error('Save user error:', error);
    showToast('❌ Fehler beim Speichern: ' + error.message);
  } else {
    showToast('✅ Benutzer gespeichert');
    state.usersData = await loadUsersData();
    renderApp();
  }
}

async function deleteUser(userId) {
  if (!confirm('Benutzer wirklich löschen?')) return;
  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) {
    showToast('❌ Fehler: ' + error.message);
  } else {
    showToast('🗑️ Benutzer gelöscht');
    state.usersData = await loadUsersData();
    renderApp();
  }
}

function showToast(msg) {
  const existing = document.querySelector('.gm-toast');
  if (existing) existing.remove();
  const toast = el('div', { className: 'gm-toast show' }, msg);
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

// ── Sicherung Tab ──
function renderSettingsSicherung() {
  const section = el('div');

  // Action buttons
  const actionRow = el('div', {
    style: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'space-between' }
  });
  const leftBtns = el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } });
  leftBtns.appendChild(el('button', {
    className: 'gm-btn',
    style: { background: 'var(--ok)', color: '#fff', fontSize: '10px' }
  }, '💾 Backup jetzt erstellen'));
  leftBtns.appendChild(el('button', {
    className: 'gm-btn',
    style: { background: 'var(--no)', color: '#fff', fontSize: '10px' }
  }, '📤 JSON exportieren'));
  leftBtns.appendChild(el('button', {
    className: 'gm-btn gm-btn-ghost',
    style: { fontSize: '10px' }
  }, '📥 JSON importieren'));
  actionRow.appendChild(leftBtns);

  actionRow.appendChild(el('button', {
    className: 'gm-btn',
    style: { background: 'var(--no)', color: '#fff', fontSize: '10px' }
  }, '🗑️ Komplett zurücksetzen'));
  section.appendChild(actionRow);

  // KPI Cards
  const data = state.gehaltData || [];
  const ma = state.mitarbeiterData || [];
  const users = state.usersData || [];

  section.appendChild(renderKPIRow([
    { label: 'Lohndaten', value: String(data.length), color: 'var(--ac)' },
    { label: 'Mitarbeiter', value: String(ma.length), color: 'var(--ok)' },
    { label: 'Benutzer', value: String(users.length), color: 'var(--wn)' },
    { label: 'Betriebe', value: '4', color: '#a78bfa' },
  ]));

  // Monat löschen section
  const loeschCard = el('div', { className: 'gm-card' });
  loeschCard.appendChild(el('div', { style: { fontWeight: 700, fontSize: '12px', marginBottom: '2px' } },
    '🗑️ MONAT LÖSCHEN'));
  loeschCard.appendChild(el('div', {
    style: { fontSize: '9px', color: 'var(--tx3)', marginBottom: '12px' }
  }, 'Entfernt alle Abrechnungsdaten eines bestimmten Monats. Mitarbeiter-Stammdaten bleiben erhalten.'));

  const loeschRow = el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } });
  const monatLabel = el('div', { style: { fontSize: '10px', color: 'var(--tx2)' } }, 'Monat');
  loeschRow.appendChild(monatLabel);

  const monatSel = el('select', { className: 'gm-select', style: { minWidth: '140px' } });
  const defOpt = el('option', {}, '— Monat wählen —');
  monatSel.appendChild(defOpt);
  (state.monate || []).forEach(m => {
    monatSel.appendChild(el('option', { value: m }, m));
  });
  loeschRow.appendChild(monatSel);

  const betriebLabel = el('div', { style: { fontSize: '10px', color: 'var(--tx2)', marginLeft: '8px' } }, 'Betrieb');
  loeschRow.appendChild(betriebLabel);

  const betriebSel = el('select', { className: 'gm-select', style: { minWidth: '120px' } });
  betriebSel.appendChild(el('option', { value: 'Alle Betriebe' }, 'Alle Betriebe'));
  BETRIEBE.forEach(b => betriebSel.appendChild(el('option', { value: b }, b)));
  loeschRow.appendChild(betriebSel);

  loeschCard.appendChild(loeschRow);
  section.appendChild(loeschCard);

  // Backup-Verlauf placeholder
  const backupCard = el('div', { className: 'gm-card' });
  backupCard.appendChild(el('div', {
    style: { fontWeight: 700, fontSize: '12px', marginBottom: '10px' }
  }, '📦 BACKUP-VERLAUF'));

  const bTable = el('table', { className: 'gm-table' });
  const bThead = el('thead');
  const bHr = el('tr');
  ['ZEITPUNKT', 'LABEL', 'DATENSÄTZE', ''].forEach(h => {
    bHr.appendChild(el('th', {}, h));
  });
  bThead.appendChild(bHr);
  bTable.appendChild(bThead);

  const bTbody = el('tbody');
  // Show empty state
  const emptyTr = el('tr');
  emptyTr.appendChild(el('td', {
    style: { textAlign: 'center', color: 'var(--tx3)', padding: '24px', fontSize: '11px' },
    colSpan: '4'
  }, 'Keine Backups vorhanden'));
  bTbody.appendChild(emptyTr);

  bTable.appendChild(bTbody);
  backupCard.appendChild(bTable);
  section.appendChild(backupCard);

  return section;
}

function getRolleConfig(rolle) {
  switch (rolle) {
    case 'inhaber': return { label: 'Inhaber / OP', icon: '👑', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' };
    case 'buchhalter': return { label: 'Buchhalter', icon: '📊', color: '#3b7ddd', bg: 'rgba(59,125,221,0.08)' };
    case 'standortleiter': return { label: 'Standortleiter', icon: '🏢', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' };
    case 'mitarbeiter': return { label: 'Mitarbeiter', icon: '👤', color: '#10b981', bg: 'rgba(16,185,129,0.08)' };
    default: return { label: rolle || 'Unbekannt', icon: '❓', color: '#9ca3af', bg: 'rgba(156,163,175,0.08)' };
  }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', initApp);
