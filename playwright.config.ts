import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load biến môi trường từ file .env tương ứng với NODE_ENV (hoặc file .env mặc định)
// Nếu truyền biến `NODE_ENV=staging`, nó sẽ tìm định dạng `.env.staging`
const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(__dirname, envPath) });

export default defineConfig({
    testDir: './tests',
    /* Tối ưu thời gian chạy, Playwright mặc định tự động Wait cho Elements */
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    /* Chạy file test song song hay không? Chuẩn E2E này đề nghị disable để tránh đụng độ Data nếu cần */
    fullyParallel: false,
    /* Fail CI nếu bỏ quên test.only trong mã nguồn */
    forbidOnly: !!process.env.CI,
    /* Chống Flaky: Tự động chạy lại 2 lần khi Failed */
    retries: process.env.CI ? 2 : 2,
    /* Chạy 1 Worker trên CI hoặc số lượng tuỳ ý dưới Local */
    workers: process.env.CI ? 1 : undefined,

    /* Cấu hình Reporter thông minh */
    reporter: [
        ['html'],
        // Bật Monocart Reporter làm Reporter chính theo chuẩn
        [
            'monocart-reporter',
            {
                name: 'E2E Automation Report',
                outputFile: './test-results/report.html',
            },
        ],
    ],

    /* Cấu hình dùng chung cho toàn bộ dự án */
    use: {
        /* Đọc baseUrl từ file .env để tránh hardcode */
        baseURL: process.env.BASE_URL || 'https://example.com',

        /* Trace cực kì mạnh mẽ cho Debug (Chỉ trace từ lần Retry đầu tiên để tiết kiệm dung lượng) */
        trace: 'on-first-retry',
        /* Chỉ tắt video và chụp ảnh khi Fail như chuẩn kiến trúc đặt ra */
        screenshot: 'only-on-failure',
        video: 'off',
    },

    /* Cấu hình Trình duyệt & Các dự án liên đới */
    projects: [
        // 1. Phân luồng Global Setup (Nếu các site dùng chung 1 hệ thống SSO, hoặc bạn có thể tách ra setup riêng)
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },

        // --- DỰ ÁN 1: HỆ THỐNG CRM ADMIN ---
        {
            name: 'CRM-Admin',
            testDir: './tests/e2e/crm-admin', // Chỉ chạy test trong thư mục này
            use: {
                ...devices['Desktop Chrome'],
                baseURL: process.env.CRM_BASE_URL || 'https://admin.example.com',
                // Tận dụng chung file session đăng nhập (giả định dùng chung hệ thống Auth)
                storageState: '.auth/user.json',
            },
            dependencies: ['setup'],
        },

        // --- DỰ ÁN 2: CỔNG THÔNG TIN KHÁCH HÀNG (PORTAL) ---
        {
            name: 'Portal-User',
            testDir: './tests/e2e/portal-user', // Chỉ chạy test trong thư mục này
            use: {
                ...devices['Desktop Chrome'],
                baseURL: process.env.PORTAL_BASE_URL || 'https://portal.example.com',
                // Ví dụ: Portal không cần cookie đăng nhập mặc định (hoặc dùng cookie khác)
                storageState: undefined,
            },
            // Không set dependencies: ['setup'] nếu như dự án này test tự do
        },
    ],
});
