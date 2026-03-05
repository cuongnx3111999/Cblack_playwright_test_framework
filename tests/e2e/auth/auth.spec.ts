import { test, expect } from '../../fixtures/base.fixture';
import { USERS } from '../../data/users.constants';

test.describe('Authentication Journeys', () => {

    test('Should login successfully with Admin account', async ({ loginFlow }) => {
        // 1. Thực hiện luồng nghiệp vụ thông qua Fixture Inject (Chỉ mất 1 dòng!)
        const dashboard = await loginFlow.loginAsUser(USERS.ADMIN);

        // 2. Kiểm chứng kết quả (Assertion luôn nằm ở tầng Test, tách biệt khỏi File Flow)
        await expect(dashboard.welcomeTitle).toBeVisible();
    });

});
