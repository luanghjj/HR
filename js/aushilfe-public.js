// ═══════════════════════════════════════════════════════════
// OKYU HRM – Aushilfe Public Page Logic
// Loads open slots from Supabase (anonymous), renders list,
// handles self-registration form with weekly limit enforcement.
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL  = 'https://zkxsyipyjqikqxswpbks.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreHN5aXB5anFpa3F4c3dwYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzgxOTMsImV4cCI6MjA5MTIxNDE5M30.oodwUnavIkmHS6W08OwpAoxxFoBPcJ6ZOizOQkaE5PY';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

const MONTHS_DE  = ['Januar','Februar','März','April','Mai','Juni',
  'Juli','August','September','Oktober','November','Dezember'];
const DAYS_SHORT = ['So','Mo','Di','Mi','Do','Fr','Sa'];

// App state
let allSlots          = [];
let locations         = [];
let activeFormSlotId  = null;
let maxShiftsPerWeek  = 1; // loaded from aushilfe_settings

// ── Bootstrap ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([loadSettings(), loadLocations(), loadSlots()]);
  buildFilterOptions();
  renderLimitBanner();
  renderSlots();

  // Real-time: hide slot instantly when someone else books it
  sb.channel('aushilfe_rt')
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'aushilfe_slots'
    }, (payload) => {
      const updated = payload.new;
      const idx = allSlots.findIndex(s => s.id === updated.id);
      if (idx !== -1 && updated.status === 'booked') {
        allSlots.splice(idx, 1);
        renderSlots();
        showPubToast('ℹ️ Eine Schicht wurde gerade vergeben.');
      }
    })
    .subscribe();
});

// ── Load Settings ─────────────────────────────────────────
async function loadSettings() {
  try {
    const { data } = await sb.from('aushilfe_settings').select('max_shifts_per_week').single();
    if (data) maxShiftsPerWeek = data.max_shifts_per_week || 1;
  } catch (_) { /* use default 1 */ }
}

// ── Load Locations ────────────────────────────────────────
async function loadLocations() {
  try {
    const { data, error } = await sb.from('locations').select('id, name');
    if (error) { console.warn('[Pub] locations:', error.message); return; }
    locations = data || [];
    const sel = document.getElementById('filterLoc');
    if (sel && locations.length > 0) {
      locations.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.id;
        opt.textContent = l.name;
        sel.appendChild(opt);
      });
    }
  } catch (e) { console.warn('[Pub] loadLocations:', e.message); }
}

// ── Load Slots ────────────────────────────────────────────
async function loadSlots() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);
    const endDate = threeMonths.toISOString().split('T')[0];

    const { data, error } = await sb.from('aushilfe_slots')
      .select('id, location, slot_date, shift_label, shift_from, shift_to, dept, note, status')
      .eq('status', 'open')
      .gte('slot_date', today)
      .lte('slot_date', endDate)
      .order('slot_date');

    if (error) {
      console.warn('[Pub] loadSlots:', error.message);
      showError('Daten konnten nicht geladen werden.');
      return;
    }

    allSlots = (data || []).map(s => ({
      id: s.id,
      location: s.location,
      date: s.slot_date,
      shiftLabel: s.shift_label,
      shiftFrom: s.shift_from?.substring(0, 5) || '',
      shiftTo: s.shift_to?.substring(0, 5) || '',
      dept: s.dept,
      note: s.note || ''
    }));
  } catch (e) {
    console.warn('[Pub] loadSlots exception:', e.message);
    showError('Verbindungsfehler.');
  }
}

// ── Weekly limit banner ───────────────────────────────────
function renderLimitBanner() {
  const banner = document.getElementById('limitBanner');
  if (!banner) return;
  const plural = maxShiftsPerWeek === 1 ? 'Schicht' : 'Schichten';
  banner.innerHTML = `
    <span class="ms" style="font-size:1.1rem">info</span>
    Du kannst maximal <strong>${maxShiftsPerWeek} ${plural} pro Woche</strong> buchen.
  `;
  banner.style.display = 'flex';
}

// ── Check weekly bookings by phone ────────────────────────
async function getWeeklyBookingCount(phone) {
  try {
    // Get start and end of current ISO week (Mon–Sun)
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const diffToMon = (day === 0 ? -6 : 1 - day);
    const mon = new Date(now);
    mon.setDate(now.getDate() + diffToMon);
    mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    sun.setHours(23, 59, 59, 999);

    const monStr = mon.toISOString().split('T')[0];
    const sunStr = sun.toISOString().split('T')[0];

    const { data, error } = await sb.from('aushilfe_slots')
      .select('id')
      .eq('status', 'booked')
      .eq('aushilfe_phone', phone)
      .gte('slot_date', monStr)
      .lte('slot_date', sunStr);

    if (error) return 0;
    return (data || []).length;
  } catch (_) { return 0; }
}

// ── Filters ───────────────────────────────────────────────
function buildFilterOptions() {
  const monthSel = document.getElementById('filterMonth');
  if (!monthSel) return;

  const monthSet = new Set(allSlots.map(s => s.date.substring(0, 7)));
  const monthArr = [...monthSet].sort();

  monthSel.innerHTML = '<option value="all">Alle Monate</option>';
  monthArr.forEach(ym => {
    const [y, m] = ym.split('-');
    const opt = document.createElement('option');
    opt.value = ym;
    opt.textContent = MONTHS_DE[parseInt(m) - 1] + ' ' + y;
    monthSel.appendChild(opt);
  });

  const nowYM = new Date().toISOString().substring(0, 7);
  if (monthArr.includes(nowYM)) monthSel.value = nowYM;
}

function applyFilters() { renderSlots(); }

function getFilteredSlots() {
  const loc   = document.getElementById('filterLoc')?.value  || 'all';
  const month = document.getElementById('filterMonth')?.value || 'all';
  return allSlots.filter(s => {
    const matchLoc   = loc   === 'all' || s.location === loc;
    const matchMonth = month === 'all' || s.date.startsWith(month);
    return matchLoc && matchMonth;
  });
}

// ── Render ────────────────────────────────────────────────
function renderSlots() {
  const container = document.getElementById('slotsContainer');
  if (!container) return;

  const filtered = getFilteredSlots();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="state-icon">📋</div>
        <div class="state-title">Keine offenen Schichten</div>
        <div class="state-sub">Momentan gibt es keine offenen Aushilfe-Schichten.<br>Schau später wieder vorbei!</div>
      </div>`;
    return;
  }

  // Group by month
  const groups = {};
  filtered.forEach(s => {
    const ym = s.date.substring(0, 7);
    if (!groups[ym]) groups[ym] = [];
    groups[ym].push(s);
  });

  let html = '<div class="slots-list">';
  Object.keys(groups).sort().forEach(ym => {
    const [y, m] = ym.split('-');
    html += `<div class="month-group-header">${MONTHS_DE[parseInt(m) - 1]} ${y}</div>`;
    groups[ym].forEach(slot => { html += buildSlotCard(slot); });
  });
  html += '</div>';

  container.innerHTML = html;
}

function buildSlotCard(slot) {
  const d      = new Date(slot.date + 'T12:00:00');
  const dow    = DAYS_SHORT[d.getDay()];
  const day    = d.getDate();
  const mon    = MONTHS_DE[d.getMonth()].substring(0, 3);
  const locName = locations.find(l => l.id === slot.location)?.name || slot.location;

  return `
    <div class="slot-card" id="card-${slot.id}">
      <div class="slot-card-body">
        <!-- Date column -->
        <div class="slot-date-col">
          <div class="slot-dow">${dow}</div>
          <div class="slot-day">${day}</div>
          <div class="slot-mon">${mon}</div>
        </div>

        <!-- Info column -->
        <div class="slot-info">
          <div class="slot-label">${slot.shiftLabel}</div>
          <div class="slot-meta">
            <div class="slot-meta-item">
              <span class="ms">schedule</span>
              ${slot.shiftFrom}–${slot.shiftTo}
            </div>
            <div class="slot-meta-item">
              <span class="ms">restaurant</span>
              ${slot.dept}
            </div>
            <div class="slot-meta-item">
              <span class="ms">location_on</span>
              ${locName}
            </div>
          </div>
          ${slot.note ? `<div class="slot-note">💬 ${slot.note}</div>` : ''}
        </div>

        <!-- CTA -->
        <div class="slot-action">
          <button class="btn btn-primary" id="btnReg-${slot.id}"
            onclick="toggleRegForm('${slot.id}')"
            title="Für diese Schicht anmelden">
            <span class="ms">person_add</span>
            Anmelden
          </button>
        </div>
      </div>

      <!-- Registration form (hidden by default) -->
      <div class="slot-form-wrap" id="form-${slot.id}">
        <div class="slot-form-title">📝 Anmeldeformular – ${slot.shiftLabel}, ${formatDate(slot.date)}</div>
        <div class="slot-form-grid">
          <div class="form-group">
            <label for="fn-${slot.id}">Dein Name *</label>
            <input id="fn-${slot.id}" type="text" class="form-input"
              placeholder="Vor- und Nachname" autocomplete="name">
          </div>
          <div class="form-group">
            <label for="fp-${slot.id}">Telefonnummer *</label>
            <input id="fp-${slot.id}" type="tel" class="form-input"
              placeholder="+49 176 ..." autocomplete="tel">
          </div>
          <div class="form-group">
            <label for="fe-${slot.id}">E-Mail (optional)</label>
            <input id="fe-${slot.id}" type="email" class="form-input"
              placeholder="deine@mail.de" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="fno-${slot.id}">Kurze Notiz (optional)</label>
            <input id="fno-${slot.id}" type="text" class="form-input"
              placeholder="z.B. Fahrkarte nötig">
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" onclick="toggleRegForm('${slot.id}')">Abbrechen</button>
          <button class="btn btn-primary" id="btnSubmit-${slot.id}"
            onclick="submitRegistration('${slot.id}')">
            <span class="ms">check_circle</span>
            Verbindlich anmelden
          </button>
        </div>
      </div>
    </div>`;
}

// ── Form Toggle ───────────────────────────────────────────
function toggleRegForm(slotId) {
  if (activeFormSlotId && activeFormSlotId !== slotId) {
    const prev = document.getElementById('form-' + activeFormSlotId);
    if (prev) prev.classList.remove('open');
  }
  const form = document.getElementById('form-' + slotId);
  if (!form) return;
  const isOpen = form.classList.toggle('open');
  activeFormSlotId = isOpen ? slotId : null;
  if (isOpen) {
    setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }
}

// ── Submit Registration ───────────────────────────────────
async function submitRegistration(slotId) {
  const nameEl    = document.getElementById('fn-'       + slotId);
  const phoneEl   = document.getElementById('fp-'       + slotId);
  const emailEl   = document.getElementById('fe-'       + slotId);
  const noteEl    = document.getElementById('fno-'      + slotId);
  const submitBtn = document.getElementById('btnSubmit-' + slotId);

  const name  = nameEl?.value?.trim()  || '';
  const phone = phoneEl?.value?.trim() || '';
  const email = emailEl?.value?.trim() || '';
  const note  = noteEl?.value?.trim()  || '';

  // Basic validation
  if (!name) {
    showPubToast('❌ Bitte deinen Namen eingeben');
    nameEl?.focus();
    return;
  }
  if (!phone || phone.replace(/\s/g,'').length < 6) {
    showPubToast('❌ Bitte eine gültige Telefonnummer eingeben');
    phoneEl?.focus();
    return;
  }

  // Disable button to prevent double-submit
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Wird geprüft…'; }

  try {
    // ── Check weekly booking limit ──────────────────────────
    const weeklyCount = await getWeeklyBookingCount(phone);
    if (weeklyCount >= maxShiftsPerWeek) {
      const plural = maxShiftsPerWeek === 1 ? 'Schicht' : 'Schichten';
      showPubToast(`⚠️ Du hast bereits ${weeklyCount} von max. ${maxShiftsPerWeek} ${plural} diese Woche gebucht.`, 5000);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="ms">check_circle</span> Verbindlich anmelden';
      }
      return;
    }

    // ── Confirm slot is still open ──────────────────────────
    const { data: check, error: checkErr } = await sb.from('aushilfe_slots')
      .select('status').eq('id', slotId).single();

    if (checkErr || !check || check.status !== 'open') {
      showPubToast('⚠️ Diese Schicht wurde bereits vergeben. Bitte wähle eine andere.');
      allSlots = allSlots.filter(s => s.id !== slotId);
      renderSlots();
      return;
    }

    if (submitBtn) submitBtn.textContent = 'Wird gespeichert…';

    // ── Book the slot ───────────────────────────────────────
    const { error } = await sb.from('aushilfe_slots').update({
      status:         'booked',
      aushilfe_name:  name,
      aushilfe_phone: phone,
      aushilfe_email: email || null,
      aushilfe_note:  note  || null
    }).eq('id', slotId);

    if (error) {
      console.warn('[Pub] submit:', error.message);
      showPubToast('❌ Fehler beim Speichern. Bitte nochmal versuchen.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="ms">check_circle</span> Verbindlich anmelden';
      }
      return;
    }

    // ── Success ─────────────────────────────────────────────
    const card = document.getElementById('card-' + slotId);
    if (card) {
      const slot = allSlots.find(s => s.id === slotId);
      card.innerHTML = `
        <div class="success-state">
          <div class="state-icon">✅</div>
          <div class="state-title">Erfolgreich angemeldet!</div>
          <div class="state-sub">Du wurdest für <strong>${slot?.shiftLabel || 'die Schicht'} am ${formatDate(slot?.date || '')}</strong> eingetragen.<br>Wir freuen uns auf dich! 🎉</div>
        </div>`;
    }

    setTimeout(() => {
      allSlots = allSlots.filter(s => s.id !== slotId);
      if (card) { card.style.transition = 'opacity .4s'; card.style.opacity = '0'; }
      setTimeout(() => { if (card) card.remove(); }, 400);
    }, 2500);

    showPubToast('✅ Anmeldung bestätigt!');

  } catch (e) {
    console.warn('[Pub] submitRegistration:', e.message);
    showPubToast('❌ Netzwerkfehler. Bitte nochmal versuchen.');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="ms">check_circle</span> Verbindlich anmelden';
    }
  }
}

// ── Helpers ───────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function showError(msg) {
  const container = document.getElementById('slotsContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <div class="state-icon">⚠️</div>
      <div class="state-title">Fehler beim Laden</div>
      <div class="state-sub">${msg}</div>
    </div>`;
}

let toastTimer = null;
function showPubToast(msg, duration = 3500) {
  const el = document.getElementById('pub-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}
