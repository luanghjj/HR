# 🐛 OKYU HRM – Nhật ký Bug & Bài học

> File này ghi lại mọi bug đã gặp và cách fix.
> Trước khi debug, luôn đọc file này trước để tránh lặp lại lỗi cũ.

---

## Bugs từ v5 (trước khi refactor)

### 2026-04-08 – Function `saveDept2()` trùng lặp
- **Triệu chứng:** Có 2 function tạo bộ phận: `saveDept()` (L1108) và `saveDept2()` (L1360), code giống nhau
- **Nguyên nhân:** Copy-paste quên xoá
- **File bị ảnh hưởng:** `OKYU_HRM_v5.html` dòng 1360
- **Cách fix:** Xoá `saveDept2()`, chỉ giữ `saveDept()`
- **Bài học:** Trước khi tạo function mới, grep xem đã có function tương tự chưa

### 2026-04-08 – Toggle ốm tăng sickDays nhưng không giảm
- **Triệu chứng:** Click 🏥 toggle sick ON → sickDays +1. Toggle OFF → sickDays không -1
- **Nguyên nhân:** `markSick()` (L930) chỉ có `if(s.isSick){e.sickDays++}`, không có else trừ
- **File bị ảnh hưởng:** `OKYU_HRM_v5.html` dòng 930
- **Cách fix:** Thêm `else { e.sickDays = Math.max(0, e.sickDays - 1); }`
- **Bài học:** Mọi toggle ON/OFF phải xử lý cả 2 chiều

### 2026-04-08 – Sidebar không tự đóng trên mobile
- **Triệu chứng:** Click nav item trên mobile → sidebar không tự đóng, che content
- **Nguyên nhân:** `navigate()` không gọi `sidebar.classList.remove('open')`
- **File bị ảnh hưởng:** `OKYU_HRM_v5.html` dòng 619-624
- **Cách fix:** Thêm sidebar close vào `navigate()`
- **Bài học:** Trên mobile, mọi action trong sidebar phải tự đóng sidebar

### 2026-04-08 – Ngày hardcoded 20.03.2026
- **Triệu chứng:** App luôn hiện "hôm nay" là 20.03.2026 bất kể ngày thật
- **Nguyên nhân:** `new Date(2026,2,20)` xuất hiện ở ~15 chỗ
- **File bị ảnh hưởng:** Toàn bộ JS
- **Cách fix:** Thay tất cả bằng `new Date()` hoặc hằng số `TODAY`
- **Bài học:** KHÔNG BAO GIỜ hardcode ngày. Luôn dùng `new Date()` (đã thêm vào SKILL.md)

### 2026-04-08 – Calendar click không hoạt động
- **Triệu chứng:** Click vào ô ngày trên calendar → không làm gì
- **Nguyên nhân:** CSS có `cursor:pointer` nhưng không có onclick handler
- **File bị ảnh hưởng:** `OKYU_HRM_v5.html` – renderVacation calendar + renderSchedule month
- **Cách fix:** Thêm onclick mở chi tiết ngày đó
- **Bài học:** Nếu đặt `cursor:pointer` → phải có click handler

### 2026-04-08 – Notification timestamp tĩnh
- **Triệu chứng:** "Vor 1 Stunde", "Gestern" không thay đổi theo thời gian
- **Nguyên nhân:** Timestamps là string tĩnh, không tính relative time
- **File bị ảnh hưởng:** `OKYU_HRM_v5.html` dòng 396-400
- **Cách fix:** Lưu `created_at` timestamp, tính relative time khi render
- **Bài học:** Lưu timestamp thật, tính hiển thị lúc render

### 2026-04-08 – XSS risk trong exportPDF
- **Triệu chứng:** `exportPDF()` inject innerHTML trực tiếp vào window mới
- **Nguyên nhân:** Không sanitize nội dung trước khi inject
- **File bị ảnh hưởng:** `OKYU_HRM_v5.html` dòng 938-939
- **Cách fix:** Sanitize hoặc dùng thư viện PDF (jsPDF)
- **Bài học:** KHÔNG inject raw HTML vào document mới. Dùng text content hoặc sanitize

---

## Bugs từ Refactoring (Step 2)

### 2026-04-08 – multi_replace_file_content corrupt backtick → quote ✅ FIXED
- **Triệu chứng:** Login không hoạt động, toàn bộ app crash
- **Nguyên nhân:** Tool `multi_replace_file_content` tự format lại code, biến template literal backtick (`` ` ``) thành single quote (`'`), gây syntax error
- **File bị ảnh hưởng:** `js/app-core.js` nhiều dòng
- **Cách fix:** Rebuild lại file bằng Python script từ file gốc `app.js`
- **Bài học:** 
  - KHÔNG dùng `multi_replace_file_content` với code chứa backtick templates
  - Luôn chạy `node --check file.js` sau khi sửa file
  - Giữ file gốc làm backup trước khi refactor

### 2026-04-08 – sickDays toggle không giảm khi OFF ✅ FIXED
- **Cách fix:** Thêm `else { e.sickDays = Math.max(0, e.sickDays - 1); }` trong `markSick()`

### 2026-04-08 – Sidebar không đóng trên mobile ✅ FIXED
- **Cách fix:** Thêm `if(window.innerWidth<=900) sidebar.classList.remove('open')` trong `navigate()`

### 2026-04-08 – `const supabase` xung đột với `window.supabase` (CDN) ✅ FIXED
- **Triệu chứng:** `Cannot read properties of undefined (reading 'signInWithPassword')`
- **Nguyên nhân:** CDN gán `window.supabase` = library. `const supabase = window.supabase.createClient(...)` tạo biến trùng tên
- **Cách fix:** Đổi tên client thành `sb` (dùng `var sb = ...`)
- **Bài học:** KHÔNG đặt tên biến trùng với tên thư viện CDN

### 2026-04-08 – RLS policy đệ quy vô hạn → 500 Internal Server Error ✅ FIXED
- **Triệu chứng:** GET user_profiles trả về 500
- **Nguyên nhân:** Policy "Admins can read all profiles" query lại chính bảng `user_profiles` để kiểm tra role → vòng lặp vô hạn
- **Cách fix:** Drop policy cũ, tạo policy đơn giản `TO authenticated USING (true)`
- **Bài học:** RLS policy KHÔNG được query lại chính bảng mà nó bảo vệ

### 2026-04-08 – Empty string '' cho DATE column → 400 Bad Request ✅ FIXED
- **Triệu chứng:** POST employees trả về 400 khi approve registration
- **Nguyên nhân:** `prob_end: ''` – PostgreSQL DATE column không chấp nhận empty string
- **Cách fix:** Đổi thành `prob_end: null`
- **Bài học:** LUÔN dùng `null` thay vì `''` cho DATE/TIMESTAMP columns

### 2026-04-08 – FK constraint khi đổi location ID ✅ FIXED
- **Triệu chứng:** Cannot update employees.location = 'okyu' vì FK references locations(id)
- **Cách fix:** INSERT location mới TRƯỚC, rồi UPDATE references, rồi DELETE cũ
- **Bài học:** Khi rename FK referenced ID: INSERT new → UPDATE refs → DELETE old

### 2026-04-08 – Missing NOT NULL column trong INSERT ✅ FIXED
- **Triệu chứng:** `city` column NOT NULL nhưng INSERT thiếu
- **Cách fix:** Thêm `city` vào INSERT statement
- **Bài học:** Kiểm tra table schema trước khi INSERT – chú ý NOT NULL constraints

### 2026-04-08 – Duplicate brace khi insert code block ✅ FIXED
- **Triệu chứng:** SyntaxError: Unexpected token '}' ở line 90
- **Cách fix:** Xoá `}}` thừa
- **Bài học:** Kiểm tra boundaries khi insert code – tránh duplicate closing braces

### 2026-04-08 – Dropdown state bị reset khi re-render ✅ FIXED
- **Triệu chứng:** Sort/Filter dropdown trên Arbeitsplan chọn xong lại reset về mặc định
- **Nguyên nhân:** `innerHTML` tạo lại DOM → dropdown mới với default value
- **Cách fix:** Lưu value vào state variable (`scheduleSort`, `scheduleDept`), dùng `selected` attr khi render
- **Bài học:** Khi dùng `innerHTML` để re-render: PHẢI lưu form state vào JS variable, KHÔNG đọc từ DOM sau render
