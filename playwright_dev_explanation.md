# Hướng dẫn Tư duy Phát triển Playwright (Playwright Dev Skill)

Tài liệu này giải thích chi tiết toàn bộ nội dung trong thư mục `playwright-dev`. Thay vì đi sâu vào từng dòng code phức tạp, chúng ta sẽ tiếp cận bằng **tư duy hệ thống** thông qua một ví dụ ẩn dụ: **Một Nhà Hàng Cao Cấp (Playwright)**.

---

## 1. Tổng quan thư mục ([SKILL.md](file:///c:/Users/cuongnx/Desktop/working/Cblack_playwright_test_framework/.agents/skills/playwright-dev/SKILL.md))

File này giống như **Mục lục** của một cuốn bí kíp. Nó cho biết để đóng góp hoặc mở rộng Playwright, bạn cần hiểu 4 mảnh ghép chính:
1. **Kiến trúc thư viện (Library Architecture)**: Nhà hàng hoạt động ra sao.
2. **Thêm mới chức năng (Adding APIs)**: Thêm một món ăn mới vào Menu.
3. **Thêm công cụ MCP và Dòng lệnh (MCP & CLI)**: Đào tạo Robot (AI) và các quản lý có thể ra lệnh.
4. **Đóng gói thư viện bên thứ 3 (Vendoring)**: Cách nhà hàng tự làm các loại sốt thay vì bắt khách hàng đi mua.

---

## 2. Kiến trúc của Playwright ([library.md](file:///c:/Users/cuongnx/Desktop/working/Cblack_playwright_test_framework/.agents/skills/playwright-dev/library.md))

Playwright không phải là một khối dính liền. Nó chia làm 3 bộ phận tách biệt, giao tiếp với nhau để đảm bảo bảo mật và hiệu năng.

### Tư duy ẩn dụ: 
- **Client (Người phục vụ & Cuốn Menu)**: Đây là cái mà người lập trình sử dụng (ví dụ: `page.click()`). Người phục vụ không trực tiếp nấu ăn, họ chỉ ghi nhận yêu cầu.
- **Protocol (Phiếu gọi món - Order Ticket)**: Là quy chuẩn giao tiếp. Người phục vụ ghi phiếu theo đúng mẫu đưa xuống bếp.
- **Dispatcher (Bếp phó / Người điều phối)**: Người đứng ở cửa bếp nhận Phiếu gọi món, dịch lại cho các đầu bếp hiểu phần việc phải làm.
- **Server (Nhà Bếp / Đầu bếp)**: Những người thực sự làm việc nặng nhọc (mở trình duyệt Chrome, Firefox, Safari (WebKit) thật, di chuyển chuột, click, v.v.).

### Chi tiết các tầng:
1. **Lớp Protocol (`protocol.yml`)**: Là "hợp đồng" (contract) giữa Client và Server. Nó quy định chặt chẽ cấu trúc dữ liệu gửi đi và trả về.
2. **Lớp Client (`packages/playwright-core/src/client`)**: Chứa các đối tượng như `Playwright`, `Browser`, `Context`, `Page`, `Locator`. Khi bạn gọi `page.goto()`, Client không làm gì ngoài việc gói ghém thông tin URL và gửi qua mạng (RPC) xuống Server.
3. **Lớp Server (`packages/playwright-core/src/server`)**: Chứa logic thực sự để điều khiển trình duyệt.
   - Thư mục `chromium/`, `firefox/`, `webkit/`: Chứa cách nói chuyện riêng với từng loại "lò nướng" (trình duyệt).
4. **Lớp Dispatcher**: Ở giữa Server và mạng. Nhiệm vụ của nó là nhận yêu cầu từ mạng, giải mã và gọi API của Server tương ứng.

### Quy tắc quan trọng:
- Bếp (**Server**) không được phép ra ngoài sảnh (**Client**). Sảnh cũng không được vào Bếp. Trò chuyện duy nhất qua Phiếu gọi món (**Protocol**).

---

## 3. Cách thêm một tính năng mới ([api.md](file:///c:/Users/cuongnx/Desktop/working/Cblack_playwright_test_framework/.agents/skills/playwright-dev/api.md))

Nếu bạn muốn Playwright làm được một trò mới (Thêm món mới vào nhà hàng), bạn phải đi theo đúng quy trình từ ngoài vào trong:

### 6 Bước Tư Duy:
1. **Bước 1: Viết Menu (`docs/src/api/`)** 
   - Viết tài liệu mô tả hàm mới là gì, tham số truyền vào ra sao.
   - Trình tạo tự động sẽ dùng tài liệu này để tạo ra file `.d.ts` (gợi ý code cho người dùng).
2. **Bước 2: Dạy Người Phục Vụ (`client`)**
   - Viết code ở Client để nhận hàm mới và gói nó lại thành yêu cầu gửi đi.
3. **Bước 3: Mẫu Phiếu Gọi Món (`protocol.yml`)**
   - Cập nhật chuẩn giao tiếp để định nghĩa loại Phiếu mới này trông như thế nào.
4. **Bước 4: Dạy Người Điều Phối (`dispatchers/`)**
   - Viết logic để người Dispatcher biết khi nhận thẻ phiếu này thì giao cho ai trong Bếp.
5. **Bước 5: Bếp Trưởng Ra Tay (`server`)**
   - Đưa logic thực thi kiểm soát trình duyệt vào đây. Tức là làm thế nào để Chrome chạy được chức năng đó.
6. **Bước 6: Ăn Thử (Viết Tests)**
   - Viết bài test để đảm bảo đồ ăn (tính năng) không bao giờ bị lỗi.
   - Có 2 cấp độ test: **Library Test** (Test mức quản lý: mở/đóng trình duyệt, cookies) và **Page Test** (Test mức người dùng: click, thao tác web).

---

## 4. Công cụ MCP và CLI ([mcp-dev.md](file:///c:/Users/cuongnx/Desktop/working/Cblack_playwright_test_framework/.agents/skills/playwright-dev/mcp-dev.md))

MCP (Model Context Protocol) là một chuẩn giao tiếp giúp AI (như Claude/Gemini) có thể xài được tool. CLI là giao diện dòng lệnh.

### Tư duy ẩn dụ:
Chúng ta thuê một con Robot (AI/LLM) phụ giúp nhà hàng. Nhưng Robot không tự biết làm gì, ta phải tạo cho nó một "Bảng Nút Bấm" (MCP Tool).
- **Thêm MCP Tool (Nút bấm cho Robot)**:
  - Khởi tạo công cụ, quy định hình dáng "Nút bấm": Tên là gì, cần truyền thông tin gì (Schema).
  - Khi Robot bấm nút (gọi handle), ta viết code dùng lại chính các chức năng có sẵn của Playwright (ví dụ `page.click`) rồi trả kết quả về cho Robot dể nó trả lời khách hàng.
- **Thêm CLI Command (Tay gạt cho người quản lý)**:
  - Để người thao tác từ Terminal (dòng lệnh) cũng dùng được nút này. Bạn bọc MCP Tool vào một Command.
  - Ví dụ: Gõ lệnh `playwright-cli open <url>`, sau lưng nó sẽ di chuyển thành tham số và kích hoạt nút `browser_navigate` của MCP.

---

## 5. Đóng gói mã nguồn bên thứ 3 ([vendor.md](file:///c:/Users/cuongnx/Desktop/working/Cblack_playwright_test_framework/.agents/skills/playwright-dev/vendor.md))

Thỉnh thoảng, Playwright cần xài đồ của bên khác (viết sáp nhập code - Dependencies). Ví dụ: một cái tool zip file.

### Tư duy ẩn dụ:
Nếu nhà hàng muốn làm món Mỳ Ý, cần Sốt Cà Chua. Thay vì để khách hàng tự đi qua siêu thị M (NPM) mua Sốt Cà Chua mỗi khi mở cửa hàng (npm install), nhà hàng nhập sốt sẵn, nấu thành dạng cô đặc, cất vào một chiếc hộp kín.
- Khách hàng không cần biết Sốt Cà Chua bên trong hãng gì, cứ ăn Mỳ Ý là xong. (Tránh đụng độ phiên bản thư viện với project của khách hàng - Dependency Hell).

### Cách Playwright thực hiện:
1. Tạo một khu vực đóng gói (bundle). Khai báo các thư viện cần xài (`package.json` nội bộ).
2. Dùng công cụ `esbuild` hút tất cả code của thư viện đó, nén lại nhét vào **MỘT FILE DUY NHẤT** (ví dụ `zipBundleImpl.js`).
3. Trong code Playwright, ta chỉ require cái khối vuông vức đã nén đó. Không bao giờ trực tiếp `import` từ `node_modules` bên ngoài vào hệ thống chính.
