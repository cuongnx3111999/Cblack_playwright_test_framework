import { test as base } from '@playwright/test';
import { LoginFlow } from '../flows/LoginFlow';

// Khai báo các types fixture cho dự án
type AppFixtures = {
    loginFlow: LoginFlow;
};

// Mở rộng base test của Playwright để tiêm các Flows vào mỗi tc
export const test = base.extend<AppFixtures>({
    loginFlow: async ({ page }, use) => {
        // Đoạn code này chỉ chạy khi file test thực sự khai báo tham số { loginFlow }
        const loginFlow = new LoginFlow(page);
        await use(loginFlow);
    }
});

// Re-export expect để file test sử dụng kèm test có chứa fixture
export { expect } from '@playwright/test';
