# 🚀 Hướng Dẫn Chạy — Nhập Dữ Liệu Origami

## Tổng quan: 5 bước

```
BƯỚC 1 → SQL: 01_cleanup.sql          (Supabase SQL Editor)
BƯỚC 2 → SQL: 02_setup_origami.sql    (Supabase SQL Editor)
BƯỚC 3 → SQL: 03_employees_origami.sql (Supabase SQL Editor)
BƯỚC 4 → JS:  create_origami_users.js  (Terminal)
BƯỚC 5 → SQL: 04_user_profiles.sql    (Paste output từ bước 4)
```

---

## BƯỚC 1 — Cleanup

**Supabase Dashboard → SQL Editor → New query**

```
Copy & Paste nội dung file: sql/real_data/01_cleanup.sql
→ Run
→ Kiểm tra output: phải thấy "user_profiles còn lại = 2"
```

---

## BƯỚC 2 — Setup Origami

```
Copy & Paste: sql/real_data/02_setup_origami.sql
→ Run
→ Kiểm tra: "Locations & Departments OK"
```

---

## BƯỚC 3 — Nhập 23 Nhân Viên

```
Copy & Paste: sql/real_data/03_employees_origami.sql
→ Run
→ Kiểm tra: "total_employees = 23"
```

---

## BƯỚC 4 — Tạo Tài Khoản Đăng Nhập

### 4a. Điền thông tin Supabase vào script

Mở file `tools/create_origami_users.js`, điền:

```js
const SUPABASE_URL       = 'https://XXXXXXX.supabase.co';
// Lấy từ: Supabase Dashboard → Settings → API → Project URL

const SUPABASE_SERVICE_KEY = 'eyJ...';
// Lấy từ: Settings → API → service_role (secret) — KHÔNG dùng anon key!
```

### 4b. Cài dependency và chạy

```bash
cd /Users/nguyenchilinh/Desktop/HR
npm install @supabase/supabase-js
node tools/create_origami_users.js
```

### 4c. Lưu lại output!

Script sẽ in ra:
1. **SQL INSERT** → dùng cho bước 5
2. **Bảng credentials** → LƯU LẠI (email + password từng người)

---

## BƯỚC 5 — Liên Kết Profile

```
Copy SQL từ output của script
→ Supabase SQL Editor → Paste → Run
→ Kiểm tra: chạy query verification ở cuối file 04_user_profiles_template.sql
```

---

## ✅ Kiểm Tra Cuối

```sql
-- Phải ra: 25 (23 nhân viên + 2 inhaber)
SELECT COUNT(*) FROM user_profiles;

-- Phải ra: 23
SELECT COUNT(*) FROM employees;

-- Kiểm tra liên kết
SELECT u.name, u.role, e.dept, e.brutto_gehalt
FROM user_profiles u
LEFT JOIN employees e ON e.id = u.emp_id
WHERE u.location = 'origami'
ORDER BY u.name;
```

---

## ⚠️ Lưu Ý Quan Trọng

- `zeiterfassung_daily` và `zeiterfassung_monthly` **KHÔNG bị đụng đến**
- 2 tài khoản Inhaber (PN + Admin) **giữ nguyên**
- **Lưu bảng credentials** trước khi đóng terminal — không thể xem lại!
- Role mặc định = `mitarbeiter` → chỉnh trong app sau

---

## 📁 Files Được Tạo

| File | Mục đích |
|------|----------|
| `sql/real_data/01_cleanup.sql` | Xóa data test |
| `sql/real_data/02_setup_origami.sql` | Tạo location + departments |
| `sql/real_data/03_employees_origami.sql` | Insert 23 nhân viên |
| `tools/create_origami_users.js` | Tạo auth accounts |
| `sql/real_data/04_user_profiles_template.sql` | Template profiles |
