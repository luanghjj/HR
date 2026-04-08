---
description: Quy trình debug và ghi lại bài học – dùng sau mỗi lần gặp bug
---

# Quy trình Debug & Ghi bài học

Dùng workflow này mỗi khi phát hiện hoặc fix bug.

## Bước 1: Xác định bug
- Mô tả triệu chứng: cái gì không hoạt động?
- Tái hiện: làm gì để thấy bug?
- Ảnh hưởng: module nào? role nào?

## Bước 2: Check bài học cũ
// turbo
- Đọc file `docs/bugs-learned.md` xem bug tương tự đã gặp chưa
- Nếu đã có → áp dụng cách fix đã ghi

## Bước 3: Tìm nguyên nhân
- Mở browser DevTools → Console tab → xem error
- Mở browser DevTools → Network tab → xem Supabase calls
- Kiểm tra file liên quan (đọc code trước khi sửa)

## Bước 4: Fix bug
- Sửa code theo quy tắc trong `.agents/skills/okyu-hrm/SKILL.md`
- Đảm bảo không phá code khác

## Bước 5: Test
- Mở browser, test action gây bug → phải hết bug
- Test với cả 3 role (Inhaber, Manager, Mitarbeiter)
- Test trên mobile view (≤ 900px)
- Reload trang → check dữ liệu

## Bước 6: Ghi bài học
- Mở file `docs/bugs-learned.md`
- Thêm entry mới theo format dưới đây:

```markdown
### [Ngày] – [Tên bug ngắn gọn]
- **Triệu chứng:** [mô tả]
- **Nguyên nhân:** [tại sao xảy ra]
- **File bị ảnh hưởng:** [file nào]
- **Cách fix:** [đã sửa gì]
- **Bài học:** [quy tắc rút ra để không mắc lại]
```

## Bước 7: Cập nhật SKILL.md (nếu cần)
- Nếu bug do thiếu quy tắc → thêm quy tắc mới vào SKILL.md
- Ví dụ: nếu bug do thiếu null check → thêm rule "luôn check null trước khi dùng"
