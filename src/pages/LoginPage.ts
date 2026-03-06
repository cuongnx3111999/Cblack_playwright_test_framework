import { Page, Locator } from '@playwright/test';
import { DataReader } from '@/utils/dataReader';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;
    readonly welcomeTitle: Locator;

    constructor(page: Page) {
        this.page = page;

        // Fetch specific JSON data only when this Page is instantiated
        const locators = DataReader.getJsonData('locators/login.json');

        this.emailInput = page.locator(locators.emailInput);
        this.passwordInput = page.locator(locators.passwordInput);
        this.loginBtn = page.locator(locators.loginBtn);
        this.welcomeTitle = page.locator(locators.welcomeTitle);
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginBtn.click();
    }
}
