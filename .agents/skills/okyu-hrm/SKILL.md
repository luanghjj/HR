---
name: OKYU HRM Development Rules
description: Quy tắc phát triển, coding conventions, và best practices cho dự án OKYU HRM
---

# OKYU HRM – Development Rules & Conventions

## 🏗️ Kiến trúc

### Tech Stack
- **Frontend:** Vanilla HTML + CSS + JavaScript (KHÔNG dùng framework)
- **Backend:** Supabase (Auth + PostgreSQL + Storage + Realtime)
- **Styling:** Vanilla CSS với CSS Custom Properties (KHÔNG dùng Tailwind)
- **Fonts:** DM Sans (body) + Space Mono (monospace/numbers)
- **Deploy:** Vercel (static site)

### Cấu trúc file
- **CSS:** Tách theo concern (variables, base, layout, components, module-specific)
- **JS:** Tách theo feature/page, mỗi file là 1 module
- **Thứ tự load JS:** config → supabase → utils → permissions → state → auth → router → pages → modals

### Naming Conventions
- **File:** kebab-case (`schedule.js`, `base.css`)
- **CSS class:** kebab-case (`stat-card`, `btn-primary`)
- **JS functions:** camelCase (`renderDashboard`, `getVisibleEmps`)
- **JS constants:** UPPERCASE (`PERMS`, `TEMPLATES`)
- **Supabase tables:** snake_case (`sick_leaves`, `user_profiles`)
- **HTML ids:** camelCase (`loginPass`, `contentArea`)

---

## 🔐 Bảo mật

### Bắt buộc
- KHÔNG BAO GIỜ hardcode password trong source code
- KHÔNG BAO GIỜ đặt Supabase SERVICE_ROLE key ở frontend
- Chỉ dùng Supabase ANON key ở frontend
- Mọi data access phải qua RLS (Row Level Security)
- Luôn validate input ở cả client VÀ server (RLS policy)

### Authentication
- Login bằng **Tên + Password** (dropdown chọn hoặc tự nhập tên)
- **Dropdown danh sách nhân viên lấy từ Supabase** (không hardcode ở frontend) → bảo mật
- Backend: Supabase Auth (email + password) – tên map sang email nội bộ
- Sau login, lưu session bằng Supabase tự quản lý
- Auto-refresh token
- Redirect về login nếu session hết hạn
- Chỉ admin (Inhaber) tạo tài khoản mới

### Phân quyền (4 cấp)
```
inhaber     → Xem/sửa tất cả, tất cả chi nhánh, tài chính, quản lý truy cập
manager     → Xem/sửa chi nhánh mình, KHÔNG tài chính, KHÔNG quản lý truy cập
mitarbeiter → Chỉ dữ liệu cá nhân, tự gửi đơn phép/ốm, không xem thông tin người khác
azubi       → Giống mitarbeiter + Schule/Fortbildung + Ausbildungsnachweis + Benotung
```

### Azubi – Tính năng riêng
- 📅 **Schule/Berufsschule:** Theo dõi ngày đi học, lịch trường
- 📓 **Ausbildungsnachweis:** Sổ đào tạo – ghi chép nội dung học hàng tuần/tháng
- ⭐ **Benotung:** Chấm điểm đánh giá từ Manager/Inhaber (lý thuyết + thực hành)

### Dashboard / Home – theo role
```
Mitarbeiter / Azubi:
  ┌─────────────────────────────────────┐
  │  🕐 CA LÀM HÔM NAY (nổi bật)      │ ← Phần chính, to rõ
  │  Spätschicht · 15:00–23:00 · Küche │
  ├─────────────────────────────────────┤
  │  📅 Ca sắp tới (3-5 ngày tiếp)     │
  │  🏖️ Phép còn lại                    │
  │  🏥 Ngày ốm / ⏰ Đi muộn           │
  └─────────────────────────────────────┘

Manager:
  ┌──────────────────────────────────────┐
  │  👥 Tổng nhân viên | ✅ Đang làm    │
  │  🏖️ Nghỉ phép     | 🏥 Ốm          │
  ├──────────────────────────────────────┤
  │  📋 Ca làm hôm nay (tất cả NV)     │
  │  🔔 Đơn phép/ốm chờ duyệt         │
  └──────────────────────────────────────┘

Inhaber:
  ┌──────────────────────────────────────┐
  │  (Như Manager) + 💰 Tài chính        │
  │  Chi phí lương · Giờ kế hoạch        │
  └──────────────────────────────────────┘
```
- **Mitarbeiter/Azubi:** Ca làm hôm nay phải là phần NỔI BẬT NHẤT (card lớn, màu accent)
- **Nếu hôm nay không có ca:** Hiện "Heute frei 🎉" (Hôm nay nghỉ)
- **Nếu đang ốm/phép:** Hiện trạng thái tương ứng thay vì ca

---

## 🎨 UI / UX Rules

### Bắt buộc
- Dark mode là DEFAULT, Light mode là option
- Mọi action destructive (delete, reject) phải có confirm dialog
- Mọi form submit thành công phải hiện toast notification
- Mọi form phải có validation error messages cụ thể (không chỉ `return`)
- Loading state cho mọi async operation (Supabase query)
- Empty state cho mọi danh sách trống (không để trắng)

### Responsive
- Mobile breakpoint: 900px
- Sidebar: ẩn trên mobile, mở bằng hamburger menu, tự đóng khi navigate
- Bảng: scroll ngang trên mobile, KHÔNG bẻ layout
- Modal: full-width trên mobile
- Calendar/Schedule: đơn giản hoá trên mobile (list view thay vì grid)

### Ngôn ngữ
- Giao diện chính: **Tiếng Đức** (Deutsch)
- Code comments: Tiếng Anh
- Console logs: Tiếng Anh
- Giao diện KHÔNG mix Đức/Việt/Anh trên cùng 1 trang

---

## 📏 Code Quality

### JavaScript
- Mỗi function tối đa 50 dòng – nếu dài hơn, tách ra
- KHÔNG viết function 1 dòng dài (max 120 ký tự/dòng)
- Tên biến phải có nghĩa: `employeeId` thay vì `eid`, `fromDate` thay vì `mVF`
- Tất cả Supabase calls phải có error handling (`try/catch` hoặc `.error` check)
- Console.error cho lỗi thật, KHÔNG console.log trong production

### CSS
- KHÔNG inline style trong JavaScript (dùng class thay thế)
- Nếu cần style động → dùng CSS custom property hoặc data attribute
- Ngoại lệ: progress bar width (%) có thể inline

### HTML
- Mọi interactive element phải có `id` duy nhất
- Mọi button phải có `title` attribute cho accessibility
- Mọi form input phải có `label`
- KHÔNG dùng `onclick` inline – dùng `addEventListener` trong JS

### Khi tạo innerHTML lớn
- Dùng template literals với indentation rõ ràng
- Tách HTML generation ra function riêng nếu > 20 dòng
- Comment mở/đóng cho mỗi section lớn

---

## 🗄️ Supabase Rules

### Queries
- Luôn select chỉ các cột cần thiết, KHÔNG `select('*')` nếu không cần
- Dùng `.order()` cho mọi list query
- Dùng `.limit()` cho pagination
- Cache data ở client khi hợp lý (ví dụ: locations, departments ít thay đổi)

### Error Handling
```javascript
// ✅ Đúng
const { data, error } = await supabase.from('employees').select('id, name');
if (error) {
  console.error('Failed to load employees:', error.message);
  toast('Fehler beim Laden der Mitarbeiter', 'err');
  return;
}

// ❌ Sai
const { data } = await supabase.from('employees').select('*');
// Không check error
```

### Realtime
- Subscribe cho notifications table
- Subscribe cho vacations table (để manager thấy đơn mới real-time)
- Unsubscribe khi user logout

---

## 🔄 Ngày giờ

### Bắt buộc
- KHÔNG BAO GIỜ hardcode ngày (ví dụ: `new Date(2026,2,20)`)
- Luôn dùng `new Date()` cho "hôm nay"
- Lưu ngày trong Supabase dạng ISO 8601 (`YYYY-MM-DD`)
- Hiển thị cho user dạng Đức (`DD.MM.YYYY`)
- Timezone: Europe/Berlin (CET/CEST)

---

## 🧪 Testing

### Sau mỗi thay đổi
1. Đăng nhập với cả 4 role (Inhaber, Manager, Mitarbeiter, Azubi)
2. Kiểm tra trang đang sửa
3. Kiểm tra responsive (thu nhỏ browser ≤ 900px)
4. Kiểm tra Dark/Light mode
5. Kiểm tra reload trang (dữ liệu còn không?)

### Trước khi coi là "xong"
- Tất cả CRUD hoạt động (Create, Read, Update, Delete)
- Permission đúng cho cả 4 role
- Không có console error
- Mobile layout không bị vỡ

---

## 📝 Ghi chú cho AI (Antigravity)

### Khi được yêu cầu sửa code
1. Đọc file liên quan trước khi sửa
2. Kiểm tra `docs/bugs-learned.md` xem lỗi này đã gặp chưa
3. Sửa xong → ghi lại vào `docs/bugs-learned.md` nếu là lỗi mới
4. Test bằng browser trước khi báo "xong"

### Khi tạo feature mới
1. Kiểm tra SKILL.md này để tuân thủ conventions
2. Kiểm tra permissions – feature này ai được dùng?
3. Tạo cả 3 phần: UI (HTML/CSS) + Logic (JS) + Data (Supabase query)
4. Xử lý empty state + loading state + error state
