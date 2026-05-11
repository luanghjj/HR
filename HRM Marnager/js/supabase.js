// ═══════════════════════════════════════════════════════════
// supabase.js — Supabase Client Setup
// GehaltsManager — SieuVuong
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://emtvtmdequrnmhpdeqrv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdHZ0bWRlcXVybm1ocGRlcXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODk2MjksImV4cCI6MjA5MDQ2NTYyOX0.Y0tfpHYhVS98ACU9c5Tpi_qpCaFzCkKWlCzBV8ExHls';

// Use the global supabase from CDN, or fall back to import
let _supabase;

if (typeof window !== 'undefined' && window.supabase) {
  _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // Fallback for bundler environments
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = _supabase;
