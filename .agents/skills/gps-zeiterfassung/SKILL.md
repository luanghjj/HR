---
name: GPS Zeiterfassung
description: Phương án thiết kế hệ thống chấm công GPS cho OKYU HRM – Check-in/out dựa trên vị trí quán
---

# GPS Zeiterfassung – Thiết kế chi tiết

## 📋 Tổng quan

Hệ thống chấm công không cần phần cứng. Nhân viên mở app trên điện thoại, khi ở gần quán (≤50m) → bấm Check-in. Hệ thống ghi lại giờ vào/ra, tính tổng giờ làm, phát hiện đi trễ tự động.

### Nguyên lý
```
📱 Nhân viên mở Dashboard
        ↓
📍 Browser lấy GPS (navigator.geolocation)
        ↓
📏 Haversine formula: tính khoảng cách → quán gần nhất
        ↓
   ≤ 50m  → 🟢 Nút EINSTEMPELN active
   > 50m  → 🔴 Nút disabled + hiện khoảng cách
        ↓
✅ Check-in → lưu record vào Supabase `time_records`
        ↓
⏱️ Live timer chạy trên Dashboard
        ↓
🔴 Check-out → cập nhật record, tính tổng giờ
```

---

## 🗺️ Dữ liệu vị trí quán

Lưu trong bảng `locations` (đã có), thêm cột `lat`, `lng`:

| Standort | Địa chỉ | lat | lng | radius_m |
|----------|---------|-----|-----|----------|
| Origami Restaurant | Stuttgart | 48.77024 | 9.17621 | 50 |
| Okyu Restaurant | Stuttgart | 48.7752943 | 9.1724394 | 50 |
| Enso Sushi & Grill | Stuttgart | 48.7754637 | 9.1818213 | 50 |

> **Lấy toạ độ:** Google Maps → right click vào quán → "Koordinaten kopieren"

---

## 🗄️ Database Schema

### Bảng `time_records` (MỚI)

| Column | Type | Mô tả |
|--------|------|-------|
| `id` | SERIAL PK | Auto ID |
| `emp_id` | INT FK → employees | Nhân viên |
| `location` | TEXT FK → locations | Quán check-in |
| `check_in` | TIMESTAMPTZ | Giờ vào |
| `check_out` | TIMESTAMPTZ | Giờ ra (null nếu chưa checkout) |
| `check_in_lat` | FLOAT | GPS lat khi check-in |
| `check_in_lng` | FLOAT | GPS lng khi check-in |
| `check_out_lat` | FLOAT | GPS lat khi check-out |
| `check_out_lng` | FLOAT | GPS lng khi check-out |
| `distance_m` | INT | Khoảng cách khi check-in (mét) |
| `shift_id` | INT FK → shifts | Ca làm liên kết (nếu có) |
| `is_late` | BOOLEAN | Đi trễ? (auto detect) |
| `late_min` | INT | Trễ bao nhiêu phút |
| `total_hours` | FLOAT | Tổng giờ làm (tính khi checkout) |
| `note` | TEXT | Ghi chú (tuỳ chọn) |
| `created_at` | TIMESTAMPTZ | Thời điểm tạo |

### Thêm cột vào `locations`

```sql
ALTER TABLE locations ADD COLUMN lat FLOAT;
ALTER TABLE locations ADD COLUMN lng FLOAT;
ALTER TABLE locations ADD COLUMN radius_m INT DEFAULT 50;
```

---

## 🖥️ UI/UX Design

### A. Dashboard Nhân viên (Mitarbeiter/Azubi)

#### Trạng thái 1: Chưa Check-in + Có ca hôm nay
```
┌──────────────────────────────────────────────┐
│ 📍 ZEITERFASSUNG                             │
│                                              │
│  🟡 Heute: Küche · 09:00–17:00              │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │         🟢 EINSTEMPELN                 │  │  ← Nút lớn, nổi bật
│  │    📍 Origami Sushi · 23m entfernt     │  │  ← GPS live
│  └────────────────────────────────────────┘  │
│                                              │
│  Letzte Check-ins:                           │
│  Mo 07.04  08:58–17:02  (8h 04m) ✅         │
│  Fr 04.04  09:12–17:30  (8h 18m) ⏰ +12m    │
└──────────────────────────────────────────────┘
```

#### Trạng thái 2: Đã Check-in
```
┌──────────────────────────────────────────────┐
│ 📍 ZEITERFASSUNG                             │
│                                              │
│  ✅ Eingecheckt seit 08:58                   │
│  ⏱️ 04:32:15 gearbeitet              live ● │  ← Timer đếm ngược
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │         🔴 AUSSTEMPELN                 │  │
│  │    📍 Origami Sushi · 8m entfernt      │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

#### Trạng thái 3: Ở quá xa
```
┌──────────────────────────────────────────────┐
│ 📍 ZEITERFASSUNG                             │
│                                              │
│  🟡 Heute: Küche · 09:00–17:00              │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │      ⚠️ ZU WEIT ENTFERNT              │  │  ← Disabled
│  │   📍 Origami Sushi · 1.2 km entfernt   │  │
│  │   Bitte näher an den Standort kommen   │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

#### Trạng thái 4: Không có ca hôm nay
```
┌──────────────────────────────────────────────┐
│ 📍 ZEITERFASSUNG                             │
│                                              │
│  😴 Heute keine Schicht geplant              │
│                                              │
│  Nächste Schicht: Di 09.04 10:00–22:00       │
└──────────────────────────────────────────────┘
```

---

### B. Dashboard Admin (Inhaber/Manager)

```
┌──────────────────────────────────────────────┐
│ 👥 ANWESENHEIT HEUTE              7/10 (70%) │
│ ████████████████████░░░░░░░░                 │
│                                              │
│  🟢 Anna Schmidt     08:52  Küche    6h 12m  │
│  🟢 Kevin Pham       08:58  Service  6h 06m  │
│  🟢 Julia Braun      08:45  Ausb.    6h 19m  │
│  🟡 Max Weber        —      Küche   (09:00)  │ ← Ca 09:00, chưa đến
│  🔴 Minh Tran        —      Sushi   (08:00)  │ ← Trễ!
│  ⚪ Hana Yamamoto     —      —       frei     │ ← Không có ca
│                                              │
│  📊 Statistik diese Woche:                    │
│  Ø Pünktlichkeit: 87% · Ø Arbeitszeit: 7.8h  │
└──────────────────────────────────────────────┘
```

---

## ⚙️ Technische Details

### 1. GPS Abfrage (JavaScript)
```javascript
// Haversine formula – tính khoảng cách 2 điểm GPS
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // Bán kính trái đất (mét)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Lấy GPS hiện tại
navigator.geolocation.getCurrentPosition(pos => {
  const {latitude, longitude} = pos.coords;
  // So sánh với vị trí quán...
});
```

### 2. Check-in Flow
```
1. User bấm EINSTEMPELN
2. getCurrentPosition() → lat, lng
3. Tính distance đến quán được assign
4. distance ≤ radius_m?
   YES → INSERT time_records (check_in, lat, lng, distance)
        → So sánh với shift time → is_late? late_min?
        → Toast "✅ Eingecheckt um 08:58"
        → Start live timer
   NO  → Toast "❌ Zu weit entfernt (230m)"
```

### 3. Check-out Flow
```
1. User bấm AUSSTEMPELN
2. getCurrentPosition() → lat, lng
3. UPDATE time_records SET check_out, check_out_lat/lng
4. Tính total_hours = check_out - check_in
5. Toast "🔴 Ausgestempelt. 8h 04m gearbeitet"
```

### 4. Anti-Fake Maßnahmen
- 📍 **GPS accuracy check** – nếu accuracy > 100m → cảnh báo
- 🕐 **Timestamp server-side** – dùng `now()` của Supabase, không tin client
- 📱 **Device fingerprint** – lưu user-agent để detect bất thường
- 🔄 **Doppel-Check** – không cho check-in 2 lần trong 1 ca
- 📊 **Admin review** – admin thấy GPS log, có thể flag suspicious

### 5. Auto-Late Detection
```javascript
// So sánh check-in time với shift start
const shift = todayShifts.find(s => s.empId === currentUser.empId);
if (shift) {
  const shiftStart = parseTime(shift.from); // "09:00" → Date
  const checkIn = new Date();
  const diffMin = (checkIn - shiftStart) / 60000;
  if (diffMin > 5) { // Toleranz: 5 Minuten
    record.is_late = true;
    record.late_min = Math.round(diffMin);
  }
}
```

---

## 📁 Files cần tạo/sửa

| File | Thay đổi |
|------|----------|
| `sql/07_time_records.sql` | [NEW] Schema bảng time_records + ALTER locations |
| `js/app-core.js` | [MODIFY] Dashboard thêm Zeiterfassung card |
| `js/data-loader.js` | [MODIFY] Load time_records từ Supabase |
| `js/data-sync.js` | [MODIFY] Thêm syncCheckIn, syncCheckOut |
| `js/state.js` | [MODIFY] Thêm TIME_RECORDS array |
| `js/utils.js` | [MODIFY] Thêm haversineDistance() |

---

## 📋 Checklist trước khi code

- [ ] User cung cấp toạ độ GPS 3 quán
- [ ] Xác nhận bán kính (50m?)
- [ ] Xác nhận toleranz trễ (5 phút?)
- [ ] Xác nhận có cần check-out bắt buộc không?
- [ ] Test GPS trên điện thoại thật (browser geolocation)

---

## ⚠️ Lưu ý quan trọng

1. **HTTPS bắt buộc** – Geolocation API chỉ hoạt động trên HTTPS (hoặc localhost)
2. **User phải cho phép** – Browser sẽ hỏi "Allow location access?"
3. **GPS indoor** – Bên trong nhà hàng GPS có thể lệch 5-20m → radius 50m là hợp lý
4. **Battery** – Chỉ lấy GPS khi user bấm, KHÔNG tracking liên tục
5. **Offline** – Nếu mất mạng → lưu local, sync khi có mạng lại
