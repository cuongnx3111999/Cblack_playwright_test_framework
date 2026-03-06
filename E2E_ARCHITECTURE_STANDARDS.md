# Cblack Playwright E2E Architecture Standards

Tài liệu này định nghĩa quy chuẩn kiến trúc chuyên nghiệp (Enterprise-level) dành cho việc phát triển tự động hoá kiểm thử E2E sử dụng Playwright. Kiến trúc này được thiết kế để đảm bảo tính ổn định, dễ bảo trì, và sẵn sàng mở rộng cho tương lai (đặc biệt khi dự án chuyển hóa thành Monorepo).

---

## 1. Nguyên lý Kiến trúc (Architecture Principles)

Để đảm bảo source code không bị phình to và rác theo thời gian, framework áp dụng kiến trúc phân tầng (Layering) gọn gàng, tách biệt rạch ròi giữa Data, Logic, và Test Script.

1.  **Dumb Pages - Smart Flows:** `Page Object` chỉ làm nhiệm vụ tương tác DOM. Mọi khối lượng user journey (hành trình người dùng) sẽ được gom vào các `Business Flows`.
2.  **No Hardcoding:** Tuyệt đối không hardcode URLs, thông tin user, hay Locators trực tiếp vào Script. Mọi thứ phải cấu hình qua Constant / JSON Test Data.
3.  **Dependency Injection:** Khai thác sức mạnh của `Custom Fixtures` trong Playwright để tự khởi tạo đối tượng thay vì `new Class()` thủ công trong từng file test.
4.  **Expectations belong to Tests:** Biểu thức `expect()` (Assertion) CHỈ ĐƯỢC PHÉP nằm ở cấp độ Test Case. Tầng POM và Flow tuyệt đối không chứa Assertions để bảo toàn tính tái sử dụng.

---

## 2. Cấu trúc Thư mục (Directory Structure)

Framework Automation được "đóng gói" như một workspace độc lập (ví dụ `apps/e2e-tests/` trong Monorepo) để CI/CD có thể kích hoạt riêng biệt mà không ảnh hưởng target apps. Đặc biệt, **do bản chất quy hoạch Monorepo**, các subproject trong hệ sinh thái hoàn toàn có thể Import và sử dụng chung (Share) các thư mục `utils`, `helpers` hoặc các hằng số của nhau một cách liền mạch, tránh viết lại code dư thừa.

```text
e2e-tests/
├── tests/
│   ├── e2e/                       # Test Scripts chính (phân theo tính năng/nghiệp vụ)
│   │   ├── auth/
│   │   └── checkout/
│   ├── api/                       # API tests (nếu tách biệt)
│   └── visual/                    # Visual/screenshot baseline check
├── pages/                         # Page Object Model (Dumb Pages)
│   ├── BasePage.ts
│   └── components/
├── flows/                         # Business flows (User Journeys)
│   └── LoginFlow.ts
├── utils/                         # Helper functions (Date, Random, API Helpers)
├── data/                          # Dữ liệu thử nghiệm (JSON/CSV)
│   └── locators/                  # Chứa Locators JSON file
├── fixtures/                      # Custom Test Fixtures (Khởi tạo states)
│   └── base.fixture.ts
├── config/                        # Biến môi trường & cấu hình Dev/Stag/Prod
│   ├── base.config.ts
│   └── setup/
│       ├── global.setup.ts
│       └── global.teardown.ts
└── playwright.config.ts           # Cấu hình Playwright tổng
```

---

## 3. Page Object Model & Định vị phần tử (Locators)

### 3.1. Tách biệt Locator qua file JSON

Tránh gõ cứng ký tự Selector vào code. Các file Class Page sẽ đọc selector từ file data.

```json
// data/locators/login.json
{
    "emailInput": "#email",
    "passwordInput": "#password",
    "loginBtn": "[data-testid='login-btn']"
}
```

### 3.2. Tiêu chuẩn Class Page

Chỉ chứa các hàm tương tác cơ bản (Điền, Bấm, Lấy Text).

```typescript
import locators from '../../data/locators/login.json';

export class LoginPage {
    constructor(public readonly page: Page) {}

    async enterEmail(email: string) {
        await this.page.locator(locators.emailInput).fill(email);
    }
}
```

---

## 4. Quản lý Fixtures & Test Structure

Thay vì thiết lập thủ công các class bằng lệnh `new` ở mỗi file Test bằng `test.beforeEach`, framework sử dụng Custom Fixtures.

```typescript
// fixtures/base.fixture.ts
import { test as base } from '@playwright/test';
import { LoginFlow } from '../flows/LoginFlow';

type AppFixtures = {
    loginFlow: LoginFlow;
};

export const test = base.extend<AppFixtures>({
    loginFlow: async ({ page }, use) => {
        await use(new LoginFlow(page));
    },
});
export { expect } from '@playwright/test';
```

Test file cuối cùng sẽ cực kỳ ngắn gọn, dễ đọc:

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '../../fixtures/base.fixture';
import { USERS } from '../../data/users.constants';

test('Should login successfully', async ({ loginFlow }) => {
    const dashboard = await loginFlow.loginAsUser(USERS.ADMIN);
    await expect(dashboard.welcomeTitle).toBeVisible(); // Assertion luôn ở cấp Test
});
```

---

## 5. Xử lý Chờ đợi (Waiting) & Chống Flaky (Ổn định)

Lỗi phổ biến nhất của E2E Automation là Timeout và Flaky (lúc pass lúc fail). Áp dụng các nguyên tắc sau:

1.  **KHÔNG dùng `waitForLoadState('networkidle')`**: Rất dễ gây timeout lãng xẹt nếu website có cài các tool Tracking chạy ngầm liên tục. Thay vào đó, hãy chờ ĐÚNG API bạn cần (VD: `await page.waitForResponse('/api/auth')`) hoặc chờ element xuất hiện (`expect(locator).toBeVisible()`).
2.  **Hard Sleep (`waitForTimeout`)**: Không cấm tuyệt đối nhưng chỉ dùng ở những case bất đắc dĩ (như chờ animation CSS của bên thứ 3) hoặc khi debug.
3.  **Tận dụng Tối đa Auto-waiting mặc định**: Không lãng phí thời gian viết mớ "Custom Click Helpers" hay bọc `test.step()` dư thừa cho từng nút click. Bản thân Core Playwright đã thực hiện Auto-waiting (chờ element visible, enabled, stable) rất tốt. Code càng ít lớp bọc càng dễ maintain.
4.  **Quy chuẩn Retry (Đá lại lỗi)**: Framework quy định **Tự động Retry 2 lần** (Retries: 2) cho bất kỳ testcase nào bị Failed. Việc này xử lý nhanh chóng trên 90% lỗi Timeout chập chờn môi trường. Kết hợp đánh tag `@flaky` vào tiêu đề testcase bị rớt lạ để dễ dàng filter khi cần fix/quarantine sau này.

---

## 6. Cấu hình Playwright & Khởi tạo (Global Configuration)

### 6.1. File `playwright.config.ts`

- **Parallelism (Song song)**: Mặc định `fullyParallel: false` để đáp ứng các test case có tính tuần tự, hoặc tận dụng account chung data mà không đụng độ ghi đè.
- **Global Setup/Teardown**: Duy trì logic ngắn gọn cực hạn. Dành cho việc Login 1 lần (Single Sign-On) trước khi chạy cả bộ Suite, nạp state vào process.

### 6.2. Artifacts (Bằng chứng Test)

- **TẮT Video Recording (`video: off`)** để tiết kiệm dung lượng ổ cứng môi trường CI/CD.
- **BẬT Trace (`trace: 'on-first-retry'`)**. Trace snapshot toàn bộ DOM, network, console mạnh mẽ hơn Video mà dung lượng rất nhẹ.
- **Tự động chụp ảnh khi fail**: `screenshot: 'only-on-failure'`. Tự do gọi `page.screenshot(...)` thủ công để chụp lại các checkpoint quan trọng trong mã nguồn nếu cần cho biên bản báo cáo.

---

## 7. Giải pháp Báo cáo (Report) & CI/CD Pipeline

Toàn bộ quá trình Automation sẽ được tích hợp vào hệ thống Tích hợp/Giao hàng liên tục (CI/CD):

1.  **Monocart Reporter (Node.js thuần)**: Loại bỏ các Reporter yêu cầu cài đặt Java phức tạp như Allure. `Monocart` cung cấp hệ sinh thái HTML Report siêu việt, gom đủ Coverage, Trace, Log chỉ bằng setup 1-click. Ngoài ra Playwright HTML default vẫn được duy trì làm phương án 2.
2.  **Trình kích hoạt CI (GitHub Actions)**:
    - Ưu tiên chế độ Kích hoạt Thủ công (`workflow_dispatch`) qua giao diện để linh hoạt thời điểm test, tiết kiệm runner resources.
    - Export Report sang `GitHub Pages` dưới dạng trang tĩnh Public/Private URL cho toàn Project Member tra cứu dễ dàng mỗi khi chạy xong.
