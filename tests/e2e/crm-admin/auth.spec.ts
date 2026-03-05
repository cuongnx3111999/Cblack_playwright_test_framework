import { test, expect } from '../../../fixtures/base.fixture';
import { USERS } from '../../../data/users.constants';

test.describe('CRM Admin - Authentication', () => {

    test('Should login to CRM Dashboard successfully with Admin account', async ({ loginFlow }) => {
        // 1. Thực hiện luồng nghiệp vụ
        const dashboard = await loginFlow.loginAsUser(USERS.ADMIN);

        // 2. Kiểm chứng kết quả 
        await expect(dashboard.welcomeTitle).toBeVisible();
    });

});
