// ═══════════════════════════════════════════════════════════
// OKYU HRM – Supabase Client
// ═══════════════════════════════════════════════════════════

// Use 'sb' to avoid conflict with window.supabase (CDN library)
var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('[Supabase] Client initialized:', SUPABASE_URL);
