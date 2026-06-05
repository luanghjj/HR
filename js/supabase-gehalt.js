// ═══════════════════════════════════════════════════════════
// OKYU HRM – GehaltsManager (Lohnabrechnung) Bridge
// ───────────────────────────────────────────────────────────
// Lohndaten liegen in einer SEPARATEN Supabase-DB (GehaltsManager).
// Wir lesen sie NICHT mehr direkt aus dem Frontend (kein zweiter
// anon/service Key im Browser). Stattdessen ruft das Frontend die
// Edge Function `gehalt-proxy` (auf dem HR-Projekt) auf, die den
// GehaltsManager-Key serverseitig als Secret hält.
// ═══════════════════════════════════════════════════════════

/**
 * Lohndaten eines Mitarbeiters über die Edge Function laden (read-only).
 * @param {Object} opts
 * @param {string} [opts.name]   - Mitarbeitername (z.B. "Nguyen, Hai My")
 * @param {number} [opts.persNr] - Personalnummer (zuverlässigster Match)
 * @returns {Promise<Array>} Array von Lohn-Zeilen (gehaelter rows) oder []
 */
async function fetchGehaltData({ name, persNr } = {}) {
  // Use the logged-in HR session token so the Edge Function can verify the caller
  const { data: { session } } = await sb.auth.getSession();
  const token = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/gehalt-proxy`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, persNr }),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); if (j.error) msg = j.error; } catch (_) {}
    throw new Error(msg);
  }

  const json = await res.json();
  return json.rows || [];
}
