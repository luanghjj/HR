# OKYU HRM – Human Resource Management

> Modernes HR-Management-System für die OKYU Gastronomie-Gruppe  
> Built with Vanilla JS + Supabase + Vercel

---

## 🚀 Live Demo

**HRM App:** [okyu-hrm.vercel.app](https://okyu-hrm.vercel.app)  
**SuperAdmin:** [okyu-hrm.vercel.app/_sa.html](https://okyu-hrm.vercel.app/_sa.html)

---

## 📋 Features

| Modul | Beschreibung |
|-------|-------------|
| **Dashboard** | Bento-Grid Übersicht mit KPIs, Schichtplan, Wetter |
| **Mitarbeiter** | CRUD, Verträge, Gehälter, Verspätungen |
| **Arbeitsplan** | Wochenplan mit Drag & Drop, PDF Export |
| **Urlaub** | Kalender, Anträge, Genehmigungsprozess |
| **Krankmeldungen** | Erfassung, Dokumenten-Upload |
| **Zeiterfassung** | GPS + QR Check-in/out, 15-Min-Raster (丸め) |
| **Bereiche** | Abteilungsverwaltung |
| **Ausbildung** | Azubi-Fortbildung & Assessment |
| **Berichte** | Analytics, PDF Reports |
| **Checklisten** | Tagesaufgaben je Standort |
| **Dokumente** | Upload & Verwaltung |
| **Zugangsverwaltung** | Benutzerkonten & Genehmigungen |
| **Berechtigungen** | Granulare Custom-Permissions pro User |

---

## 🏗️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (kein Framework)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Hosting:** Vercel (Static)
- **PDF:** jsPDF
- **Icons:** Material Symbols Outlined
- **Fonts:** DM Sans, Space Mono

---

## 📁 Projektstruktur

```
HR/
├── index.html              ← HRM Hauptanwendung
├── _sa.html                ← SuperAdmin Console (Datenverwaltung)
├── _qr.html                ← QR Check-in Generator
├── vercel.json             ← Deploy-Konfiguration
├── README.md               ← Diese Datei
│
├── js/                     ← JavaScript Module
│   ├── config.js           ← Supabase Config, Standorte, Konstanten
│   ├── permissions.js      ← Rollen & Berechtigungssystem
│   ├── state.js            ← Globale State-Variablen
│   ├── data.js             ← Demo-Daten (USERS Array)
│   ├── utils.js            ← Hilfsfunktionen (Toast, Filter, GPS)
│   ├── supabase.js         ← Supabase Client Init
│   ├── data-loader.js      ← Daten aus Supabase laden
│   ├── data-sync.js        ← Realtime-Synchronisation
│   ├── auth.js             ← Login/Logout/Session + Permissions
│   ├── app-core.js         ← Gesamte UI-Logik (245 KB)
│   └── ausbildung.js       ← Ausbildungsmodul
│
├── css/                    ← Stylesheets (17 Dateien)
│   ├── variables.css       ← CSS Custom Properties
│   ├── base.css            ← Reset, Typography
│   ├── layout.css          ← Sidebar, Main, Topbar
│   ├── components.css      ← Buttons, Badges, Inputs
│   ├── modal.css           ← Modal Overlays
│   ├── mobile.css          ← Responsive Breakpoints
│   └── [modul].css         ← Je ein Stylesheet pro Modul
│
├── sql/                    ← Supabase SQL (Dokumentation)
│   ├── 01_user_profiles.sql
│   ├── 02_data_tables.sql
│   ├── ...
│   └── 11_user_permissions.sql
│
├── assets/                 ← Statische Assets
│   └── icon-192.png
│
├── docs/                   ← Dokumentation
│   ├── architecture.md
│   ├── permissions.md
│   ├── bugs-learned.md
│   └── ZEITERFASSUNG_INTEGRATION.md
│
├── tools/                  ← Setup & Maintenance
│   ├── setup-supabase.html
│   └── setup-users.html
│
└── .agents/                ← AI Agent Konfiguration
    ├── acc/
    ├── skills/
    └── workflows/
```

---

## 🔐 Berechtigungssystem

### Rollen-Hierarchie
| Rolle | Zugriff |
|-------|---------|
| **Inhaber** | Vollzugriff auf alle Standorte & Features |
| **Manager** | Personal & Planung (eigener Standort) |
| **Mitarbeiter** | Eigene Daten (Urlaub, Krankmeldung) |
| **Azubi** | Eigene Daten + Ausbildungsmodul |

### Custom Permissions
Über die SuperAdmin Console (`_sa.html` → Benutzer) können **individuelle Berechtigungen** pro User vergeben werden, unabhängig von der Rolle.

**16 Permission Keys:** `seeFinancials`, `seeAllEmployees`, `editEmployees`, `editVacDays`, `editTraining`, `markLate`, `seeAllSchedules`, `editSchedules`, `canExport`, `seeAllVacations`, `approveVacations`, `seeAllSick`, `seeDepartments`, `seeAllDocs`, `seeAllLocations`, `manageAccess`

---

## 🏢 Standorte

| ID | Name | Stadt |
|----|------|-------|
| `origami` | Origami Restaurant | Göppingen |
| `enso` | Enso Sushi & Grill | Stuttgart |
| `okyu` | Okyu Restaurant | Stuttgart |

---

## ⚡ Setup

1. **Supabase:** Projekt erstellen → SQL aus `sql/` ausführen (01 → 11)
2. **Auth:** Demo-User über `tools/setup-supabase.html` erstellen
3. **Deploy:** `git push` → Vercel auto-deploy

---

## 📝 Lizenz

Privat – OKYU Gastronomie GmbH
