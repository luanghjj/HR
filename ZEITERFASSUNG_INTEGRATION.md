# Zeiterfassung ↔ HRM Integration

## Supabase

```
URL: https://zkxsyipyjqikqxswpbks.supabase.co
KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreHN5aXB5anFpa3F4c3dwYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzgxOTMsImV4cCI6MjA5MTIxNDE5M30.oodwUnavIkmHS6W08OwpAoxxFoBPcJ6ZOizOQkaE5PY
```

---

## Kiến trúc

```
Zeiterfassung Generator (riêng biệt)
  │ computeAllSchedules() → schedCache
  │
  ├── UPSERT → zeiterfassung_daily    (1 MA × 1 ngày)
  ├── UPSERT → zeiterfassung_monthly  (1 MA × 1 tháng, tổng kết)
  └── Upload → zeiterfassung-pdfs/    (PDF tháng, giống 100%)
                    │
                    ▼
              ┌─ Supabase ─┐
              │   3 nguồn   │
              └──────┬──────┘
                     │ READ
                     ▼
              OKYU HRM (chỉ đọc)
```

---

## Standorte & Nhân viên

### Okyu (Verwaltung) — Mo-Fr 09:00–17:00

| PNr | Name | Typ | Std/M | Brutto |
|-----|------|-----|-------|--------|
| 00001 | Nguyen, Linh | VZ | 160h | €5.000 |

### Origami (Gastronomie) — Mo-Do 11:00–22:00, Fr-Sa –23:00, BP 14:30–17:30

| PNr | Name | Typ | Std/M | Brutto |
|-----|------|-----|-------|--------|
| 00002 | Tanaka, Yuki | VZ | 170h | €3.500 |
| 00003 | Schmidt, Anna | TZ | 120h | €2.200 |
| 00004 | Weber, Max | VZ | 160h | €1.100 |
| 00005 | Pham, Kevin | TZ | 140h | €2.400 |
| 00006 | Le, Tuan | VZ | 160h | €2.600 |

### Enso (Gastronomie) — Mo-Do 11:30–22:00, Fr-Sa –23:00, BP 14:30–17:30

| PNr | Name | Typ | Std/M | Brutto |
|-----|------|-----|-------|--------|
| 00007 | Klein, Sarah | VZ | 170h | €3.200 |
| 00008 | Tran, Minh | VZ | 160h | €2.800 |
| 00009 | Yamamoto, Hana | TZ | 150h | €2.500 |
| 00010 | Richter, Nina | VZ | 160h | €1.100 |

---

## Liên kết HRM ↔ Zeiterfassung

```
employee_nr  (PNr)     →  cùng giá trị 2 hệ thống
standort_id            →  'okyu', 'origami', 'enso'
```

---

## Database Schema

### `zeiterfassung_daily`

| Column | Type | Ví dụ |
|--------|------|-------|
| standort_id | TEXT | `'origami'` |
| employee_nr | TEXT | `'00002'` |
| employee_name | TEXT | `'Tanaka, Yuki'` |
| datum | DATE | `2026-04-09` |
| jahr / monat | INT | `2026` / `4` |
| wochentag | TEXT | `'Mi'` |
| beginn | TEXT | `'11:00'` |
| ende | TEXT | `'19:30'` |
| pause | TEXT | `'0:30'` |
| dauer | TEXT | `'7:30'` |
| ist_stunden | REAL | `7.5` |
| code | TEXT | `''` `'K'` `'U'` `'F'` `'UU'` `'FB'` |
| bemerkung | TEXT | `'Mi'` `'Krank'` `'Urlaub'` |

**UNIQUE**: `(standort_id, employee_nr, datum)`

### `zeiterfassung_monthly`

| Column | Type | Ví dụ |
|--------|------|-------|
| standort_id | TEXT | `'origami'` |
| employee_nr | TEXT | `'00002'` |
| employee_name | TEXT | `'Tanaka, Yuki'` |
| jahr / monat | INT | `2026` / `4` |
| ist_stunden | REAL | `168.5` |
| soll_stunden | REAL | `170.0` |
| saldo | REAL | `-1.5` |
| kum_saldo | REAL | `-4.0` (cộng dồn từ Jan) |
| arbeitstage | INT | `22` |
| krank_tage | INT | `1` |
| urlaub_tage | INT | `2` |
| uu_tage | INT | `0` |
| fb_tage | INT | `0` |

**UNIQUE**: `(standort_id, employee_nr, jahr, monat)`

---

## Codes

| Code | Bedeutung | Màu |
|------|-----------|-----|
| *(leer)* | Gearbeitet | 🟢 |
| `K` | Krank | 🔴 |
| `U` | Urlaub | 🔵 |
| `UU` | Unbezahlter Urlaub | 🟡 |
| `F` | Feiertag | 🟤 |
| `FB` | Fortbildung | 🟢 nhạt |

---

## HRM Queries

### 1. Xem 1 NGÀY — Ai làm hôm qua ở Origami?

```javascript
const { data } = await supabase
  .from('zeiterfassung_daily')
  .select('*')
  .eq('standort_id', 'origami')
  .eq('datum', '2026-04-09')
  .order('beginn');
```

### 2. Xem 1 THÁNG — Chi tiết từng ngày của 1 MA

```javascript
const { data } = await supabase
  .from('zeiterfassung_daily')
  .select('*')
  .eq('employee_nr', '00002')
  .eq('jahr', 2026)
  .eq('monat', 4)
  .order('datum');
```

### 3. Tổng kết THÁNG — Tất cả MA ở 1 Standort

```javascript
const { data } = await supabase
  .from('zeiterfassung_monthly')
  .select('*')
  .eq('standort_id', 'enso')
  .eq('jahr', 2026)
  .eq('monat', 4);
```

### 4. Từ ĐẦU NĂM đến nay — Stundenkonto

```javascript
const { data } = await supabase
  .from('zeiterfassung_monthly')
  .select('*')
  .eq('employee_nr', '00002')
  .eq('jahr', 2026)
  .lte('monat', 4)
  .order('monat');
```

### 5. Tất cả ngày nghỉ ốm

```javascript
const { data } = await supabase
  .from('zeiterfassung_daily')
  .select('employee_name, datum, bemerkung')
  .eq('code', 'K')
  .eq('jahr', 2026)
  .order('datum');
```

---

## PDF Downloads — 3 loại

### 1️⃣ PDF tháng đầy đủ → Public URL trực tiếp

```javascript
// ⚠️ KHÔNG dùng supabase.storage.download() — tạo blob:null/ trên file:// protocol

function getZeiterfassungPdfUrl(standortId, employeeNr, lastName, jahr, monat) {
  const mm = String(monat).padStart(2, '0');
  return `https://zkxsyipyjqikqxswpbks.supabase.co/storage/v1/object/public/zeiterfassung-pdfs/${jahr}/${standortId}/${employeeNr}_${lastName}_${jahr}_${mm}.pdf`;
}

// Mở PDF trong tab mới:
window.open(getZeiterfassungPdfUrl('okyu', '00001', 'Nguyen', 2026, 1));

// Hoặc trigger download:
const a = document.createElement('a');
a.href = getZeiterfassungPdfUrl('okyu', '00001', 'Nguyen', 2026, 1);
a.download = '00001_Nguyen_2026_01.pdf';
a.click();
```

> Bucket là PUBLIC → dùng URL trực tiếp, không cần auth.

### 2️⃣ PDF 1 ngày (Tagesprotokoll) → Tạo từ data bằng jsPDF

```
┌───────────────────────────────────────┐
│  Tagesprotokoll — 09.04.2026         │
│  Standort: Origami                    │
│                                       │
│  Mitarbeiter   Beginn  Ende   Dauer   │
│  ─────────────────────────────────    │
│  Tanaka, Y.    11:00   19:30  7:30   │
│  Schmidt, A.   16:00   22:15  5:45   │
│  Weber, M.                    Krank  │
│  Pham, K.      17:00   23:00  5:30   │
│  Le, T.        11:00   17:00  5:30   │
│                                       │
│  Anwesend: 4/5  │  Gesamt: 24:15h    │
└───────────────────────────────────────┘
```

### 3️⃣ PDF từ đầu đến nay (Zeitnachweis) → Tạo từ data bằng jsPDF

```
┌─────────────────────────────────────────┐
│  Zeitnachweis 01.01 – 09.04.2026        │
│  Tanaka, Yuki (00002) — Origami         │
│                                          │
│  ── Januar ──────────────────────────── │
│  01. Do  11:00  19:30  0:30  7:30       │
│  02. Fr  11:00  20:00  0:30  8:00       │
│  ...                                     │
│  Summe Jan: 168:30  Soll: 170  ▼-1:30   │
│                                          │
│  ── Februar ─────────────────────────── │
│  ...                                     │
│                                          │
│  ═══ GESAMT bis 09.04.2026 ═════════    │
│  Ist: 523:15h  Soll: 528h               │
│  Saldo: -4:45h                           │
│  Krank: 3  Urlaub: 5  UU: 0  FB: 0      │
└─────────────────────────────────────────┘
```

---

## HRM UI — Employee Detail

```
┌─ Employee Detail ──────────────────────────────┐
│ [Stammdaten] [Zeiterfassung] [Dokumente]       │
│                                                 │
│  📅 Stichtag: [09.04.2026 ▼]                   │
│                                                 │
│  ┌─ Tagesansicht ───────────────────────────┐  │
│  │ 09.04.2026 (Mi)                           │  │
│  │ Beginn: 11:00  Ende: 19:30                │  │
│  │ Pause: 0:30    Dauer: 7:30                │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌─ Monatsübersicht April 2026 ─────────────┐  │
│  │ Ist: 168:30  Soll: 170  Saldo: -1:30     │  │
│  │ Krank: 1  Urlaub: 2  UU: 0  FB: 0        │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌─ Stundenkonto 2026 ──────────────────────┐  │
│  │ Jan: -1.5  Feb: -3.0  Mar: -2.5  Apr:-4.0│  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  [📥 PDF Monat] [📥 PDF Tag] [📥 PDF Gesamt]   │
└─────────────────────────────────────────────────┘
```

---

## Auto-Push (sau này)

| Standort | Schließzeit | Push |
|----------|-------------|------|
| Okyu | Mo-Fr 17:00 | 17:05 |
| Origami | Mo-Do 22:00 / Fr-Sa 23:00 | +5min |
| Enso | Mo-Do 22:00 / Fr-Sa 23:00 | +5min |

```
Schließzeit + 5min → compute → UPSERT daily → UPSERT monthly → upload PDF
```
