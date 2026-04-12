# OKYU HRM – Architektur

## Übersicht

```
Browser
  ├── index.html    ← HRM App (Supabase Auth Login)
  ├── _sa.html      ← SuperAdmin (Passwort-Login)
  └── _qr.html      ← QR Check-in (öffentlich)
         │
         ▼
    Supabase (Backend)
    ├── Auth           ← Benutzer-Authentifizierung
    ├── PostgreSQL     ← Alle Tabellen (siehe sql/)
    ├── Storage        ← Dokumente, Bilder, PDFs
    └── Realtime       ← Live-Updates (data-sync.js)
         │
         ▼
    Vercel (Hosting)   ← Static Files, Auto-Deploy via GitHub
```

---

## Datenfluss

### Login & Berechtigungen
```
User → index.html → doLogin() (auth.js)
  → Supabase Auth (signInWithPassword)
  → user_profiles (name, role, location)
  → user_permissions (custom perms, allowed_locations)
  → can() checks custom > role defaults
  → buildSidebar() zeigt nur erlaubte Tabs
```

### SuperAdmin → HRM Synchronisation
```
SuperAdmin (_sa.html)
  → Edit user permissions (checkboxes, pills)
  → UPSERT → user_permissions table
  → User login → loadUserPermissions()
  → Sidebar + Features aktualisiert
```

### Zeiterfassung (Check-in)
```
QR-Code scannen → _qr.html → GPS verifizieren
  → INSERT → time_records (check_in, lat/lng, distance)
  → HRM Dashboard zeigt Anwesenheit
  → PDF Export: Hybrid (fake historical + real today)
  → 15-Min-Raster: Check-in↑ceil, Check-out↓floor
```

---

## Tabellen (Supabase)

| Tabelle | Zweck | SQL |
|---------|-------|-----|
| `user_profiles` | Auth-Profile (role, location) | 01 |
| `employees` | Mitarbeiterdaten | 02 |
| `vacations` | Urlaubsanträge | 02 |
| `sick_leaves` | Krankmeldungen | 02 |
| `documents` | Dokumente & Uploads | 02 |
| `notifications` | Benachrichtigungen | 02 |
| `azubi_*` | Ausbildungstabellen | 03 |
| `shifts` | Schichtplan | 04 |
| `time_records` | GPS/QR Check-in/out | 07 |
| `checklists` | Tagesaufgaben | 10 |
| `user_permissions` | Custom Berechtigungen | 11 |

---

## JavaScript Module

### Ladereihenfolge (wichtig!)
```html
1. config.js        ← Konstanten, Supabase URL
2. permissions.js   ← PERMS object, can() function
3. state.js         ← currentUser, currentLocation, etc.
4. data.js          ← Demo USERS array
5. utils.js         ← Hilfsfunktionen
6. supabase.js      ← Supabase Client
7. data-loader.js   ← loadDataFromSupabase()
8. data-sync.js     ← subscribeRealtime()
9. auth.js          ← doLogin(), loadUserPermissions()
10. app-core.js     ← Alle UI-Render-Funktionen
11. ausbildung.js   ← Ausbildungsmodul
```

### Abhängigkeiten
```
config.js ← keine
permissions.js ← keine (definiert PERMS + can())
state.js ← keine (definiert globale Variablen)
data.js ← keine
utils.js ← permissions.js (nutzt can())
supabase.js ← config.js (nutzt SB_URL, SB_KEY)
data-loader.js ← supabase.js, state.js
data-sync.js ← supabase.js, data-loader.js
auth.js ← supabase.js, permissions.js, state.js
app-core.js ← ALLE anderen Module
ausbildung.js ← supabase.js, utils.js, state.js
```

---

## Drei Anwendungen

| App | URL | Auth | Zweck |
|-----|-----|------|-------|
| **HRM** | `/index.html` | Supabase Auth | Hauptanwendung für alle Rollen |
| **SuperAdmin** | `/_sa.html` | Passwort | Datenbank-Verwaltung, Berechtigungen |
| **QR Check-in** | `/_qr.html` | Keine | QR-Code Generator für Standorte |

- `_sa.html` und `_qr.html` sind **self-contained** (CSS+JS inline)
- `index.html` lädt Module aus `js/` und `css/`
