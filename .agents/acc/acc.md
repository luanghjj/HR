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
  - Stat-Cards: Resturlaub, Krankentage, Verspätungen, Plan-Std. nguyen cbhis kiaw. ngue
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




R + GPS Check-in System
Tổng quan
Hệ thống check-in/out kết hợp QR Code + GPS cho nhân viên nhà hàng OKYU. Nhân viên quét mã QR tại quán bằng camera điện thoại riêng → app tự nhận diện NV qua Supabase session → verify GPS → ghi giờ vào Supabase.

Hiện trạng hệ thống
Đã có ✅
Supabase Auth (email + password) với checkExistingSession() — session tự phục hồi khi mở lại browser
GPS check-in hoàn chỉnh: doCheckIn(), doCheckOut(), haversineDistance(), findNearestLocation()
Bảng time_records trên Supabase với schema đầy đủ
syncCheckIn() / syncCheckOut() trong data-sync.js
App trên HTTPS — GPS + Camera đều hoạt động
Chưa có ❌
Xử lý URL params ?checkin=xxx
QR code generation cho admin
Column method, gps_verified trong time_records
Smart toggle (quét = check-in, quét lại = check-out)
User Review Required
IMPORTANT

Domain HTTPS: Bạn cần xác nhận domain sẽ host HRM (ví dụ hrm.okyu.de). QR code sẽ chứa URL này.

IMPORTANT

Bảng locations trên Supabase: Cần verify các quán đã có lat/lng chưa. Nếu chưa, cần cập nhật.

Phương án chi tiết
Nguyên lý hoạt động
┌─────────────────────────────────────────────────────────────┐
│  MỖI QUÁN: 1 mã QR in ra, dán cố định tại quầy/bếp       │
│                                                             │
│  QR chứa URL:                                               │
│  https://hrm.okyu.de/index.html?checkin=okyu&key=oK4xY9    │
│         ↑ domain HTTPS        ↑ quán nào   ↑ mã bí mật    │
└─────────────────────────────────────────────────────────────┘
┌─ NV đến quán ──────────────────────────────────────────────┐
│                                                             │
│  📱 Mở camera ĐT → Quét QR                                │
│       ↓                                                     │
│  🌐 Browser mở URL → App load                              │
│       ↓                                                     │
│  🔐 checkExistingSession() → "Đây là Anna (emp_id: 3)"    │
│       ↓ (session Supabase Auth lưu sẵn trên ĐT NV)        │
│                                                             │
│  📍 Lấy GPS → so sánh với toạ độ quán                      │
│       ↓                                                     │
│  ┌─ ≤ 200m  → ✅ gps_verified: true                        │
│  ├─ 200-500m → ⚠️ gps_verified: false (cảnh báo admin)    │
│  ├─ > 500m   → 🔴 gps_suspicious: true (flag cho admin)   │
│  └─ GPS fail → ℹ️ check-in chỉ bằng QR                    │
│       ↓                                                     │
│  📦 INSERT time_records (emp_id, location, method='qr+gps')│
│       ↓                                                     │
│  ✅ Toast: "Hallo Anna! Eingecheckt um 08:58"              │
│                                                             │
│  ═══ SMART TOGGLE ═══                                       │
│  Nếu Anna đã checked in hôm nay → quét lần 2 = CHECK-OUT  │
└─────────────────────────────────────────────────────────────┘
┌─ NV chưa đăng nhập ────────────────────────────────────────┐
│                                                             │
│  📱 Quét QR → Browser mở URL                               │
│       ↓                                                     │
│  🔐 checkExistingSession() → null (chưa login)             │
│       ↓                                                     │
│  📝 Hiện form Login + lưu param checkin vào sessionStorage  │
│       ↓                                                     │
│  NV nhập email + password → login thành công                │
│       ↓                                                     │
│  App phát hiện sessionStorage có pending checkin            │
│       ↓                                                     │
│  Auto trigger check-in (như flow bên trên)                  │
└─────────────────────────────────────────────────────────────┘
QR Code cho mỗi quán
Quán	QR URL	Key
Okyu	https://DOMAIN/index.html?checkin=okyu&key=oK4xY9	oK4xY9
Origami	https://DOMAIN/index.html?checkin=origami&key=rG3mI7	rG3mI7
Enso	https://DOMAIN/index.html?checkin=enso&key=eN5oS2	eN5oS2

Quán	URL
Okyu 🍣	https://hr-ebon-five.vercel.app/index.html?checkin=okyu&key=oK4xY9
Origami 🏮	https://hr-ebon-five.vercel.app/index.html?checkin=origami&key=rG3mI7
Enso 🔥	https://hr-ebon-five.vercel.app/index.html?checkin=enso&key=eN5oS2



Mã key chống lan truyền URL qua tin nhắn
NV phải quét QR trực tiếp (camera), không copy URL
Admin có thể đổi key bất kỳ lúc nào → in QR mới
Proposed Changes
Supabase (Database)
ALTER TABLE time_records
sql
ALTER TABLE time_records ADD COLUMN method TEXT DEFAULT 'gps';
ALTER TABLE time_records ADD COLUMN qr_location TEXT;
ALTER TABLE time_records ADD COLUMN gps_verified BOOLEAN;
ALTER TABLE time_records ADD COLUMN gps_suspicious BOOLEAN DEFAULT false;
Backend Logic
[MODIFY] 
auth.js
Sau khi login thành công (cả doLogin() và checkExistingSession()):

Check sessionStorage.getItem('pendingCheckin')
Nếu có → auto trigger handleQrCheckin(locationId)
Xoá pending param
[MODIFY] 
app-core.js
Thêm function mới:

detectQrCheckin() — Gọi khi app load

Đọc window.location.search → parse ?checkin=xxx&key=yyy
Verify key hợp lệ
Nếu đã login → gọi handleQrCheckin(loc)
Nếu chưa login → lưu sessionStorage.setItem('pendingCheckin', loc) → login screen
handleQrCheckin(locationId) — Logic chính

Kiểm tra NV đã check-in hôm nay chưa (truy vấn time_records)
Nếu đã check-in → auto check-out
Nếu chưa → lấy GPS, verify, check-in
GPS verify: gps_verified = (distance ≤ 200), gps_suspicious = (distance > 500)
Sửa doCheckIn() — Thêm param method, qr_location

[MODIFY] 
data-sync.js
Sửa syncCheckIn():

Thêm fields: method, qr_location, gps_verified, gps_suspicious
Admin Tools
[NEW] QR Generator (trong HRM admin hoặc file riêng)
Trang cho admin generate QR code cho mỗi quán
Dùng thư viện qrcode.js (CDN) → render QR ra canvas
Nút "In PDF" để in QR kèm tên quán, logo
[MODIFY] 
_sa.html
Check-in tab: thêm cột Method, GPS Verified, Suspicious
Badge: 🟢 qr+gps verified, 🟡 qr only, 🔴 suspicious
Open Questions
IMPORTANT

Domain HTTPS là gì? (ví dụ hrm.okyu.de) — cần để tạo QR URL
Bảng locations trên Supabase đã có lat/lng cho 3 quán chưa?
Chạy SQL ALTER TABLE — tôi viết SQL, bạn chạy trên Supabase Dashboard?
Verification Plan
Automated Tests
Mở URL ?checkin=okyu&key=oK4xY9 khi đã login → kiểm tra auto check-in
Mở URL khi chưa login → kiểm tra redirect + pending checkin
Quét lần 2 → kiểm tra auto check-out
Key sai → kiểm tra từ chối
Manual Verification
In QR thật → quét bằng iPhone/Android tại quán
Kiểm tra _sa.html hiển thị đúng method + GPS flags
Test GPS suspicious khi quét từ xa



PDF Tag – Hybrid Data (Fake + Real Check-in)
Mục tiêu
Thay đổi logic nút "PDF Tag" (zeDownloadTagPDF) trong Mitarbeiter Detail → Zeiterfassung section:

Ngày 1 → hôm qua: lấy từ zeiterfassung_daily (data fake)
Ngày hôm nay: lấy từ time_records (data thật – GPS/QR check-in)
Beginn = check_in sớm nhất hôm nay
Ende = check_out muộn nhất hôm nay (nếu chưa checkout → "—")
Pause = tổng khoảng trống giữa các ca (gap giữa checkout trước và checkin sau)
Dauer = Ende − Beginn − Pause
Xuất PDF đầy đủ từ ngày 1 → hôm nay
Data Sources
Bảng	Loại	Cột dùng
zeiterfassung_daily	Fake	datum, beginn, ende, pause, dauer, ist_stunden, code, bemerkung, wochentag
time_records	Thật	emp_id, check_in (TIMESTAMPTZ), check_out (TIMESTAMPTZ)
Liên kết giữa 2 bảng
zeiterfassung_daily.employee_nr = String(emp_id).padStart(5, '0') (hàm getEmployeeNr)
time_records.emp_id = employee ID (integer)
time_records.location = standort_id
Proposed Changes
[MODIFY] 
app-core.js
Thay đổi function zeDownloadTagPDF(empId) (dòng ~1409–1579):

1. Tách logic fetch data thành 2 phần:
javascript
// Bước 1: Xác định ngày hôm nay (Berlin timezone)
const today = isoDate(new Date()); // '2026-04-10'
// Bước 2: Fetch fake data (ngày 1 → hôm qua)
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const { data: fakeDaily } = await sb.from('zeiterfassung_daily')
  .select('*')
  .eq('employee_nr', empNr)
  .eq('standort_id', e.location)
  .eq('jahr', jahr)
  .eq('monat', monat)
  .lte('datum', isoDate(yesterday))  // <= hôm qua
  .order('datum');
// Bước 3: Fetch real data hôm nay từ time_records
const { data: todayRecords } = await sb.from('time_records')
  .select('check_in, check_out')
  .eq('emp_id', empId)
  .gte('check_in', today + 'T00:00:00')
  .lt('check_in', today + 'T23:59:59')
  .order('check_in');
2. Tính toán data hôm nay từ time_records:
javascript
function buildTodayEntry(todayRecords, today) {
  if (!todayRecords?.length) return null;
  
  // Beginn = check_in sớm nhất
  const firstIn = new Date(todayRecords[0].check_in);
  const beginn = firstIn.toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' });
  // Ende = check_out muộn nhất (nếu có)
  const checkouts = todayRecords.filter(r => r.check_out).map(r => new Date(r.check_out));
  let ende = null;
  let endeStr = '—';
  if (checkouts.length) {
    ende = new Date(Math.max(...checkouts));
    endeStr = ende.toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' });
  }
  // Pause = tổng gap giữa các ca
  // Sắp xếp records theo check_in, tính gap giữa check_out[i] và check_in[i+1]
  let pauseMin = 0;
  for (let i = 0; i < todayRecords.length - 1; i++) {
    if (todayRecords[i].check_out && todayRecords[i+1].check_in) {
      const gapMs = new Date(todayRecords[i+1].check_in) - new Date(todayRecords[i].check_out);
      if (gapMs > 0) pauseMin += Math.round(gapMs / 60000);
    }
  }
  const pauseH = Math.floor(pauseMin / 60);
  const pauseM = pauseMin % 60;
  const pauseStr = pauseH + ':' + String(pauseM).padStart(2, '0');
  // Dauer = Ende - Beginn - Pause
  let dauerStr = '—';
  let istStunden = 0;
  if (ende) {
    const totalMin = Math.round((ende - firstIn) / 60000) - pauseMin;
    const dH = Math.floor(totalMin / 60);
    const dM = totalMin % 60;
    dauerStr = dH + ':' + String(dM).padStart(2, '0');
    istStunden = totalMin / 60;
  }
  return {
    datum: today,
    wochentag: new Date(today).toLocaleDateString('de-DE', { weekday: 'short' }).replace('.',''),
    beginn: beginn,
    ende: endeStr,
    pause: pauseStr,
    dauer: dauerStr,
    ist_stunden: istStunden,
    code: '',
    bemerkung: ''
  };
}
3. Gộp data và tạo PDF:
javascript
// Merge: fake (ngày 1 → hôm qua) + real (hôm nay)
const allDaily = [...(fakeDaily || [])];
const todayEntry = buildTodayEntry(todayRecords, today);
if (todayEntry) allDaily.push(todayEntry);
// Sử dụng allDaily thay cho daily trong phần generate PDF (giữ nguyên logic PDF hiện tại)
4. Xử lý edge cases:
Tháng khác tháng hiện tại: Chỉ dùng fake data (không có "hôm nay" trong tháng đó)
Hôm nay chưa check-in: Không thêm row hôm nay
Hôm nay đã check-in nhưng chưa check-out: Beginn có, Ende = "—", Dauer = "—"
Open Questions
IMPORTANT

Timezone: time_records.check_in lưu dạng TIMESTAMPTZ. Khi filter theo ngày hôm nay, cần dùng timezone Berlin (UTC+2). Hiện tại code dùng new Date() ở client → OK vì browser user ở Đức.

Verification Plan
Manual Verification
Mở Mitarbeiter Detail → Zeiterfassung
Bấm "PDF Tag" → Kiểm tra PDF:
Ngày 1 → hôm qua: data từ fake tables
Ngày hôm nay: data từ time_records (check-in/out thật)
Test edge case: tháng trước (chỉ fake data, không có hôm nay)
Test edge case: hôm nay chưa check-in → không hiện row hôm nay
Test edge case: hôm nay đã check-in nhưng chưa check-out → Ende = "—"

