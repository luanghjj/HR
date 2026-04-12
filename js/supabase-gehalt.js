// ═══════════════════════════════════════════════════════════
// supabase-gehalt.js — Second Supabase Client for GehaltsManager DB
// ═══════════════════════════════════════════════════════════

var GEHALT_SUPABASE_URL = 'https://emtvtmdequrnmhpdeqrv.supabase.co';
var GEHALT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdHZ0bWRlcXVybm1ocGRlcXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODk2MjksImV4cCI6MjA5MDQ2NTYyOX0.Y0tfpHYhVS98ACU9c5Tpi_qpCaFzCkKWlCzBV8ExHls';

var sbGehalt = window.supabase.createClient(GEHALT_SUPABASE_URL, GEHALT_SUPABASE_KEY);
console.log('[GehaltsManager] Supabase client ready');
