# Ghi chú tính năng trong tương lai (Future Features)

Tài liệu này dùng để theo dõi các ý tưởng hoặc tính năng dự kiến sẽ phát triển và bổ sung vào test framework trong tương lai.

## 1. Highlight Element trước khi tương tác
- **Mô tả:** Tạo một cơ chế (có thể là bọc lại - wrapper cho các action như Click, Fill hoặc dùng fixture/listener) để tự động gọi một script UI đổi màu viền (highlight) phần tử trên màn hình trình duyệt ngay trước khi action thực thi.
- **Mục đích:** Giúp việc theo dõi bằng mắt thường, quá trình Debug, và Video Tracing sinh động, tường minh hơn. Cực kỳ hữu ích khi trình diễn (showcase) cho các bên liên quan (Stakeholders) xem Automation hoạt động.
- **Dự kiến thực hiện:** Ghi đè phương thức `.locator()` bằng prototype nội tại của Node/Playwright, hoặc thực hiện Inject một đoạn CSS/JS nhỏ vào trang để vẽ border đỏ/vàng quanh element.

## 2. [Tên tính năng...]
- **Mô tả:** ...
- **Mục đích:** ...

---
*Cập nhật và thêm mới ý tưởng vào file này để team cùng theo dõi.*
