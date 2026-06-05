// ═══════════════════════════════════════════════════════════
// OKYU HRM – Supabase Client for GehaltsManager DB
// Separate DB: emtvtmdequrnmhpdeqrv.supabase.co
// Used for: Lohnabrechnung integration in Mitarbeiter Detail
// ═══════════════════════════════════════════════════════════

const GEHALT_URL  = 'https://emtvtmdequrnmhpdeqrv.supabase.co';
const GEHALT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdHZ0bWRlcXVybm1ocGRlcXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODk2MjksImV4cCI6MjA5MDQ2NTYyOX0.Y0tfpHYhVS98ACU9c5Tpi_qpCaFzCkKWlCzBV8ExHls';

/** Lazy-init: returns the sbGehalt client, creating it if needed */
function getSbGehalt() {
  if (window._sbGehalt) return window._sbGehalt;
  if (!window.supabase?.createClient) {
    console.warn('[sbGehalt] supabase-js not loaded yet');
    return null;
  }
  window._sbGehalt = window.supabase.createClient(GEHALT_URL, GEHALT_ANON);
  return window._sbGehalt;
}
