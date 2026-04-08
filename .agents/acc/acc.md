# OKYU HRM – Tính năng theo Tab

## 🔐 Login-Daten
```
inhaber@okyu.de  / OkyuAdmin2026!
manager1@okyu.de / OkyuManager2026!
manager2@okyu.de / OkyuManager2026!
anna@okyu.de     / OkyuMitarbeiter2026!
kevin@okyu.de    / OkyuMitarbeiter2026!
julia@okyu.de    / OkyuAzubi2026!
```

---

## 📊 Dashboard
- Begrüßungsbanner mit Live-Uhr (Sekunden-Ticker)
- Upload Hintergrundbild pro User (📷 Knopf → Supabase Storage → DB persistent)
- Standort-Logo (🍣 Origami / 🍜 Enso / 🏢 Okyu)
- **Stat-Cards (klickbar → navigiert zur Seite):**
  - 👥 Aktive Mitarbeiter (dynamisch berechnet: Gesamt − Krank − Urlaub)
  - 🏖️ Im Urlaub (live aus VACS: approved + heute im Zeitraum)
  - 🏥 Krank (live aus SICKS: active + heute im Zeitraum)
  - ⏰ Verspätungen (Summe lateCount aller MA)
- **Finanzkarten (nur Inhaber):**
  - 💰 Personalkosten / Monat (Summe bruttoGehalt)
  - ⏱️ Plan-Stunden vs. Soll-Stunden
  - 💶 ⌀ Gehalt / Stunde (berechnet)
  - 🎓 Schule / Fortbildung (Tage + Anzahl MA)
- 📍 Anwesenheit heute: SVG-Ring (GPS Check-in vs. geplante Schichten)
- 🔔 Meldungen (letzte 5 Benachrichtigungen)
- 📋 Heutige Schichten (bis zu 8, mit Dept + Zeit)

---

## 👥 Mitarbeiter
- Tabelle mit Suche (Name, Bereich)
- Spalten: Name, Standort, Bereich, Position, Resturlaub, Krankentage, Verspätungen, Status
- **Nur Inhaber:** Plan-Std., Soll-Std., Brutto, €/Std., Schule-Tage
- ➕ Neuen Mitarbeiter anlegen (Modal mit allen Feldern)
- **Details-Modal (klick auf "Details"):**
  - Position, Standort, Bereich, Eintritt bearbeitbar
  - Stat-Cards: Resturlaub, Krankentage, Verspätungen, Plan-Std.
  - **Gehalt & Stunden (nur Inhaber):** Soll-Std., Brutto, €/Std. – automatische Umrechnung
  - **Urlaub & Schule (bearbeitbar):** Urlaubstage Gesamt/Genommen, Schule-Tage, Resturlaub
  - Urlaub-Historie + Krankmeldungen-Historie + Dokumente
- ⏰ Verspätung vermerken (Button pro MA)
- Alle Änderungen → Supabase sync

---

## 🏢 Bereiche (nur Manager/Inhaber)
- **Accordion-Cards** pro Bereich (klick → aufklappen)
- Header: Farbbalken, Name, Stadt, Leitung
- Badges: 👥 Aktiv, 🏥 Krank, 🏖️ Urlaub, 📋 Heute im Dienst
- 💰 Personalkosten (nur Inhaber)
- **Aufgeklappt:**
  - Plan-Stunden Fortschrittsbalken (grün/gelb/rot je nach %)
  - Mitarbeiter-Tabelle: Avatar, Name, Position, Status-Badge, Plan-Std., Brutto
  - Heutige Schichten: Chips mit Name + Uhrzeit
- Standort-Filter über Location-Selector

---

## 📅 Arbeitsplan
- **3 Ansichten:** Tag / Woche / Monat (Toggle + Navigation ◀ ▶)
- **Wochenansicht (Hauptansicht):**
  - Tabelle: MA × 7 Tage, Σ Stunden-Spalte
  - Shift-Blöcke farbcodiert nach Bereich (Küche/Service/Bar/Sushi)
  - Kompakt-Blöcke: **K** = Krank, **B** = Urlaub, **A** = Halber Urlaub, **S** = Schule
  - Ruhetag-Erkennung pro Standort (Mo = Origami, So = Enso/Okyu)
  - GPS Check-in Cross-Reference (spätes Einchecken → ⏰ Marker)
- **Schicht hinzufügen (Modal):**
  - 3 Modi: Ein Tag / Gleiche Zeit (Woche) / Wochenplan (individuelle Zeiten)
  - Filter: Standort → Bereich → Mitarbeiter
  - Schicht-Vorlagen (Frühschicht, Spätschicht, etc.)
- **Aktionen pro Schicht:** 🏥 Krank / 🏖️ Urlaub / ⏰ Verspätet / 🗑️ Löschen
- **Drag & Drop:** Schichten verschieben zwischen Tagen/Mitarbeitern
- 📋 Woche kopieren → Folgewoche
- 💾 Vorlage speichern / 📂 Vorlage laden
- 📄 PDF Export (druckoptimiert)
- **Sortierung:** nach Name / Bereich / Stunden
- **Bereich-Filter:** Alle / Küche / Service / Bar / Sushi

---

## 🏖️ Urlaubsverwaltung
- **4 Tabs:** Kalender / Anträge / Übersicht / (MA: eigene Anträge)
- **Kalender:** Monatsansicht mit farbigen Events (Urlaub + Krank)
- **Anträge:** Tabelle mit ✓ Genehmigen / ✕ Ablehnen (Manager/Inhaber)
- **Übersicht:** Alle MA mit Gesamt/Genommen/Geplant/Rest
- **Mitarbeiter-Sicht:** Eigene Stats (Gesamt/Genommen/Verbleibend) + eigene Anträge
- ➕ Urlaubsantrag stellen (Von/Bis/Bemerkung → automatische Berechnung Halbtag/Ganztag)
- Halber Urlaub: automatisch erkannt anhand Arbeitstage pro Standort
- Ruhetag-Schutz: Kein Urlaub auf Ruhetage möglich

---

## 🏥 Krankmeldungen
- Statistik-Cards: Aktiv / Diesen Monat / ⌀ Tage
- Tabelle: Von/Bis/Tage/Status/AU
- **AU hochladen:** 📤 PDF/JPG/PNG → Supabase Storage → Link zum Ansehen
- ➕ Neue Krankmeldung (Von/Bis/Bemerkung + optionale AU direkt hochladen)
- **Mitarbeiter-Sicht:** Eigene Krankentage (Jahr) + aktive Meldungen

---

## 📁 Dokumente
- **5 Tabs:** Alle / Verträge / Zeugnisse / Gesundheit / Steuer
- Such-Funktion nach Name/Mitarbeiter
- Doc-Cards mit Icon, Name, Datum, Größe
- Klick → Datei öffnen/herunterladen (Supabase Storage URL)
- ➕ Dokument hochladen (Name, Mitarbeiter, Typ, Datei → Supabase Storage)
- **Mitarbeiter-Sicht:** Nur eigene Dokumente sichtbar

---

## 🔐 Zugangsverwaltung (nur Inhaber)
- **Neue Registrierungen:** Pending-Banner mit Genehmigen/Ablehnen
  - Zeigt: Name, Email, Geburtstag, Standort, Bereich, Position
  - Genehmigen → erstellt automatisch Employee-Eintrag in DB
- **Benutzer-Tabelle:**
  - ✏️ **Name** – direkt bearbeitbar (Input → blur → DB sync)
  - ✏️ **Position** – direkt bearbeitbar (Input → blur → Employee sync)
  - 🔽 **Rolle** – Dropdown (Inhaber/Manager/Mitarbeiter/Azubi)
  - 🔽 **Standort** – Dropdown (Alle Standorte / Origami / Enso / Okyu)
  - Verknüpfter Mitarbeiter + Status-Badge
- Alle Änderungen → sofort in Supabase gespeichert

---

## 🔔 Benachrichtigungen
- Slide-In Panel (rechts)
- Typen: Urlaub, Krank, Verspätung, Info
- Unread-Marker pro Benachrichtigung
- Klick → als gelesen markieren
- Badge-Count auf 🔔-Button

---

## ⚙️ Systemweite Features
- **Dark/Light Mode** Toggle (persistent)
- **Responsive Design** (Mobile + Desktop)
- **Role-Based Access Control:**
  - Inhaber: Alles (Finanzen, Zugangsverwaltung, alle Standorte)
  - Manager: Mitarbeiter, Bereiche, Schichtplan, Urlaub, Krank
  - Mitarbeiter: Eigene Daten, eigener Dienstplan, eigene Anträge
  - Azubi: Wie Mitarbeiter
- **Multi-Standort:** Origami (Göppingen) / Enso (Esslingen) / Okyu (Stuttgart)
- **Standort-Wechsler** in Header (Inhaber: Alle Standorte)
- **Supabase Integration:** Auth, Database, Storage, Row Level Security
- **Live-Daten:** Alle Änderungen sofort in DB persistiert
- **PDF Export** für Arbeitsplan
- **GPS Zeiterfassung:** Check-in/out basierend auf Standort (vorbereitet)
