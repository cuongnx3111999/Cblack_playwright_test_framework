import { Page, Locator } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export class LoginFlow {
    readonly page: Page;
    readonly loginPage: LoginPage;

    constructor(page: Page) {
        this.page = page;
        // Khởi tạo LoginPage bên trong Flow
        this.loginPage = new LoginPage(this.page);
    }

    /**
     * Gom các hành động nhỏ gọn thành 1 Business Flow (Action Flow)
     */
    async loginAsUser(user: { email: string; password: string }): Promise<{ welcomeTitle: Locator }> {
        // Lưu ý: nên truyền URL từ file base.config hoặc env, ở đây hardcode tạm URL mẫu
        await this.page.goto('https://example.com/login');

        await this.loginPage.enterEmail(user.email);
        await this.loginPage.enterPassword(user.password);
        await this.loginPage.clickLogin();

        // Trả về Element (Locator) hoặc trạng thái để tầng Test (Auth.spec) thực hiện Assertion
        return {
            welcomeTitle: this.loginPage.welcomeTitle
        };
    }
}
