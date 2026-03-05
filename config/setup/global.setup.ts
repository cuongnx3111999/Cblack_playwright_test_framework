import { test as setup, expect } from '@playwright/test';
import { USERS } from '../../data/users.constants';
import * as fs from 'fs';
import * as path from 'path';

// Đường dẫn lưu trữ Token/Cookie sau khi đăng nhập thành công
const authFile = path.resolve('.auth/user.json');

setup('Global SSO Setup - Lấy Authentication State cho toàn dự án', async ({ page }) => {
    console.log('--- BẮT ĐẦU GLOBAL SETUP (SINGLE SIGN-ON) ---');

    // Đảm bảo thư mục .auth tồn tại
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    // Bước 1: Điều hướng tới trang đăng nhập
    // *Lưu ý: Bạn cần thay bằng URL hoặc sử dụng cấu hình baseURL hiện có*
    // await page.goto('/login'); 

    // Bước 2: Thực hiện hành động đăng nhập lấy từ mock user (Thực tế bạn dùng LoginFlow tại đây cũng được)
    // await page.locator('#email').fill(USERS.ADMIN.email);
    // await page.locator('#password').fill(USERS.ADMIN.password);
    // await page.locator("[data-testid='login-btn']").click();

    // MOCK Log - Vì chưa có site thật để chạy nên chúng ta giả lập thành công
    console.log('[-] (Giả lập) Đã submit Đăng Nhập trên UI...');

    // Bước 3: CHỜ ĐỢI TÍN HIỆU ĐĂNG NHẬP THÀNH CÔNG trước khi lưu state
    // await expect(page.locator('h1.dashboard')).toBeVisible();

    // Bước 4: Lưu toàn bộ state (Bao gồm Cookies, LocalStorage, SessionStorage) ra file
    await page.context().storageState({ path: authFile });

    console.log(`[+] Đã lưu trạng thái Auth (Cookies) tại: ${authFile}`);
});
