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
        timeout: 5000
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
        // Comment mở dòng dưới nếu bạn đã cài monocart-reporter:
        // ['monocart-reporter', { name: "E2E Monocart Report", outputFile: './test-results/report.html' }]
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

    /* Cấu hình Trình duyệt */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Bạn có thể bật thêm Firefox, Safari tùy ý sau này
        // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
});
