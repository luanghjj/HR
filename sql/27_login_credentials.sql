-- ═══════════════════════════════════════════════════════════
-- OKYU HRM – Login-Credentials (Admin kann Passwörter setzen & sehen)
-- In Supabase SQL Editor ausführen.
-- ═══════════════════════════════════════════════════════════
--
-- Hinweis Sicherheit: Passwort wird hier im Klartext gespeichert, damit der
-- Inhaber es jederzeit ansehen kann. Bewusst akzeptiertes Risiko.
-- Schutz: KEINE SELECT-Policy für Clients → nur service_role (Edge Function
-- 'admin-users', die den Aufrufer als Inhaber prüft) liest/schreibt diese Tabelle.

CREATE TABLE IF NOT EXISTS user_credentials (
  user_id    TEXT PRIMARY KEY REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  password   TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;

-- Absichtlich KEINE Policy: ohne Policy darf kein anon/authenticated-Client
-- lesen oder schreiben. Nur service_role (Edge Function) umgeht RLS.
