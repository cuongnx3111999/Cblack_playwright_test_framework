import { test, expect } from '@playwright/test';

// Ví dụ test Rest API trực tiếp từ Playwright (Nếu dùng chung repo)
test('GET User Endpoint', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/2');
    expect(response.ok()).toBeTruthy();
    const userData = await response.json();
    expect(userData.data.first_name).toBe('Janet');
});
