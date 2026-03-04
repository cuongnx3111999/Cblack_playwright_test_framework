
# Ghi chú & Kiến trúc Playwright (e2e) + Cấu trúc thư mục

## 1. Playwright – Ghi chú và lưu ý

- **Cẩn thận với `test-results`**
  - Nếu chạy 2 lệnh test cùng lúc, file kết quả có thể bị ghi đè.
  - → Nên dùng **đường dẫn khác nhau** cho mỗi test plan (ví dụ theo `testplan`).

- **Tách biệt data (Data-Driven Testing – DDT)**
  - Tách data ra khỏi logic.
  - Có thể kế thừa logic test plan.
  - Nên cấu trúc để có thể chạy theo nhiều cách: JSON-driven, Tag-driven, Project-driven.

## 2. Cách tổ chức Test Plan

## a. JSON‑driven test plan

- Mỗi file JSON đại diện cho một test plan.
    
- Dễ quản lý, thay đổi data mà không sửa code.
    

## b. Tag‑driven (Playwright thuần)

- Dùng **tags + `grep`** để chạy theo:
    
ts

`@smoke @regression @module:login @env:staging`

## c. Project‑driven config (Playwright projects)

- Mỗi “test plan” là một **project** trong `playwright.config.ts`.
    
- Mỗi project có:
    
    - `grep` riêng
        
    - `baseURL`
        
    - `browser`
        
    - `timeout`
        

→ Có thể tạo 2 project (ví dụ: `smoke`, `regression`).

---

## 3. Allure + GitHub Actions

- Dùng **Allure 3 + plugin** (ví dụ: `Awesome Allure`).
    
- Ý tưởng:
    
    - Có một file `index.md` liệt kê:
        
        - Các file trong project.
            
        - Các hàm trong từng file.  
            → Mục đích:
            
        - Giúp AI tự tạo code ít bị dư thừa chức năng.
            
        - Đảm bảo code dễ đọc, có “lịch sử” và mục đích rõ ràng.
            

## Kết hợp với GitHub Actions

- Tự động chạy test trên các môi trường.
    
- Tích hợp report Allure + video, trace, screenshot, logs.
    

---

## 4. Layer kiến trúc đề xuất (Playwright + TypeScript)

Không nên dùng quá nhiều layer, ưu tiên **2–3 tầng chính**.

### 1. Tests Layer

- Chứa file `.spec.ts` tương ứng tính năng/flow nghiệp vụ.
    
- Test case chỉ **gọi** các tầng bên dưới, **không trực tiếp dùng Playwright API**.
    
- Mục đích:
    
    - Ngắn gọn, dễ đọc, dễ bảo trì.
        
    - Tập trung vào nghiệp vụ.
        

### 2. Page Objects / Components Layer

- Mỗi trang / component (Header, Sidebar, Modal…) là một class.
    
- Chứa:
    
    - Locators.
        
    - Methods hành vi.
        
    - Wait conditions, soft assertions.
        
- Có thể dùng **hierarchical POM** (BasePage → Page con) để tránh trùng lặp.
    

### 3. Business / Flows Layer

- Mô tả các **user journey** (ví dụ: `LoginFlow`, `CheckoutFlow`, `UserRegistrationFlow`).
    
- Nhiều test case dùng chung **một flow** với data khác nhau.
    
- Giảm logic lặp lại trong test scripts.
    

### 4. Utilities / Helpers Layer

- `API clients` (kết hợp Playwright nếu cần test API).
    
- `Database helper`.
    
- `File/JSON helper`.
    
- `Date/time`, `string`, random data generator.
    
- Tái sử dụng ở: test, page, flow, seed data.
    

### 5. Config / Settings Layer

- Quản lý:
    
    - Environment (dev/staging/prod).
        
    - `baseURL`, timeouts, browser options.
        
    - Feature flags (ví dụ bật/tắt visual testing, accessibility check).
        
- Có thể dùng **config file + resolver** (base + override) để tránh hard‑code.
    

### 6. Fixtures / Hooks Layer (Playwright Test)

- Tạo **custom fixtures**:
    
    - Khởi tạo browser context.
        
    - Tạo/rollback test data.
        
    - Mock API nếu cần.
        
- Giúp test **độc lập, ổn định, ít flaky**.
    

### 7. Reporting / Observability Layer

- Reporters: Allure, HTML, JSON, dashboard tùy chỉnh.
    
- Tích hợp:
    
    - Logs, screenshots, videos, traces của Playwright.
        
- Dùng để theo dõi:
    
    - Độ ổn định.
        
    - Coverage.
        
    - Regression trend theo thời gian.
        

### 8. Data / Test Data Layer

- Có thể là:
    
    - File JSON/CSV (data‑driven).
        
    - Hoặc service API để generate data.
        
- Tách biệt **data** khỏi **logic test**, dễ thay đổi data mà không sửa code.
    

---

## 5. Sơ đồ dữ liệu – “data flow” trong đầu

Test case
 → gọi Business Flow
   → gọi Page/Component
     → dùng Playwright API qua Fixtures
        ↔ dùng Utilities (API, DB, file, …)
        ↔ đọc Config (env, baseURL, timeout, …)
        ↔ dùng Test Data
 → output report + artifacts (video, trace, screenshot)


---

## 6. Cấu trúc thư mục gợi ý (`project-root`)

project-root/
├── src/                           # (tùy chọn, nếu có logic chung)
├── tests/
│   ├── e2e/                       # End‑to‑end frontend
│   │   ├── auth/
│   │   │   ├── login.spec.ts
│   │   │   └── logout.spec.ts
│   │   ├── checkout/
│   │   ├── admin/
│   ├── api/                       # API test
│   └── visual/                    # Visual/screenshot baseline
├── pages/                         # Page Object Model
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── components/
│       └── Header.ts
├── flows/                         # Business flows
│   ├── LoginFlow.ts
│   ├── CheckoutFlow.ts
│   └── UserRegistrationFlow.ts
├── utils/                         # Utilities chung
│   ├── apiClient.ts
│   ├── dbHelper.ts
│   ├── testDataHelper.ts
│   └── dateUtils.ts
├── fixtures/                      # Custom fixtures
│   ├── authenticatedUser.fixture.ts
│   └── withTestData.fixture.ts
├── config/                        # Config theo môi trường
│   ├── base.config.ts
│   ├── dev.config.ts
│   ├── staging.config.ts
│   └── prod.config.ts
├── tests/data/                    # Test data (JSON/CSV)
│   ├── auth/
│   ├── checkout/
│   └── admin/
├── playwright.config.ts
└── tsconfig.json                  # Có thể tách riêng cho /tests/


---

## 7. Biến thành Monorepo (nếu cần)

monorepo-root/
├── apps/
│   ├── web/          # Frontend chính
│   ├── marketing/    # Marketing site
│   └── admin/        # Admin panel
├── packages/
│   ├── shared-ui/
│   └── core-business-logic/
├── tests/            # Đặt cấu trúc hiện tại ở đây
│   ├── e2e/
│   ├── pages/
│   ├── flows/
│   ├── utils/
│   ├── fixtures/
│   ├── config/
│   ├── data/
│   └── playwright.config.ts
├── pnpm-workspace.yaml
└── package.json (root)


- Ưu tiên học và dùng **Turborepo** để tối ưu build/test.
    
- Dùng **Allure report** và **CI/CD (GitHub Actions)** để chạy pipeline tự động.
    

---

## 8. Website dùng để thực hành

- Bắt đầu:
    
    - [https://www.saucedemo.com](https://www.saucedemo.com/)
        
- Tiếp theo:
    
    - [Automation Testing Practice Website for QA and Developers | UI and API](https://practice.expandtesting.com/)



## Note
- Giữ page ví dụ `LoginPage` đơn giản nhưng rõ ràng: chỉ chứa locators + hành vi login, không cần thêm hàm thừa; file ít phương thức vẫn hợp lệ nếu dễ đọc, dễ tái sử dụng.