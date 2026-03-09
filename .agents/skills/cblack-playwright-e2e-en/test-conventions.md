# Cblack Playwright E2E Test Conventions

This document systematizes all coding standards for the Cblack Enterprise E2E Suite. AI Agents MUST strictly adhere to these conventions.

## 1. Directory Structure

All test framework code lives within the `src/` directory:
- `data/locators/`: JSON files resolving locators.
- `flows/`: Business logic combining multiple pages.
- `pages/`: Dumb Page Object Models.
- `tests/`: Executable Playwright specs (`*.spec.ts`).
- `fixtures/`: Custom fixture definitions (environment setup).

## 2. Locator Positioning (No Hardcoding)

**EXTREMELY IMPORTANT:** NEVER hardcode selectors directly in the Page classes. You must ALWAYS consume them from JSON files residing in `src/data/locators/`.

**Locator JSON File (`src/data/locators/login.json`):**
```json
{
    "emailInput": "#email",
    "passwordInput": "#password",
    "loginBtn": "[data-testid='login-btn']"
}
```

**Page Class Representation (`src/pages/LoginPage.ts`):**
```typescript
import locators from '@/data/locators/login.json';
import { Page } from '@playwright/test';

export class LoginPage {
    constructor(public readonly page: Page) {}

    async enterEmail(email: string) {
        await this.page.locator(locators.emailInput).fill(email);
    }
}
```

## 3. Dumb Pages - Smart Flows

- **Pages (`src/pages/`)**: Only contains basic UI actions (click, fill, text content extraction). NEVER place business logic or page routing logic here.
- **Flows (`src/flows/`)**: Coordinates multiple pages to accomplish a distinct business goal.

```typescript
// src/flows/LoginFlow.ts
import { Page } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';

export class LoginFlow {
    private loginPage: LoginPage;
    private dashboardPage: DashboardPage;

    constructor(public readonly page: Page) {
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
    }

    async loginAsAdmin(credentials: UserCredentials) {
        await this.loginPage.enterEmail(credentials.email);
        await this.loginPage.enterPassword(credentials.password);
        await this.loginPage.clickLogin();
        // Return the resulting page or leave validation to the spec context
        return this.dashboardPage;
    }
}
```

## 4. Expectations Belong in Test Specs

**EXTREMELY IMPORTANT:** NEVER use `expect()` within `src/pages/` or `src/flows/` directories. Verifications and assertions are STRICTLY RESERVED for `src/tests/*/*.spec.ts` files.

## 5. Dependency Injection via Fixtures

Do not manually instantiate target Flows or Pages using the `new` keyword inside `test()` blocks. Apply custom fixtures.

**Fixture Def (`src/fixtures/base.fixture.ts`):**
```typescript
import { test as base, expect } from '@playwright/test';
import { LoginFlow } from '@/flows/LoginFlow';

type AppFixtures = {
    loginFlow: LoginFlow;
};

export const test = base.extend<AppFixtures>({
    loginFlow: async ({ page }, use) => {
        await use(new LoginFlow(page));
    },
});

export { expect };
```

**Executing Test (`src/tests/auth.spec.ts`):**
```typescript
import { test, expect } from '@/fixtures/base.fixture';
import { USERS } from '@/data/users.constants';

test('Can login successfully', async ({ loginFlow }) => {
    const dashboard = await loginFlow.loginAsAdmin(USERS.ADMIN);
    await expect(dashboard.getWelcomeTitleLocator()).toBeVisible();
});
```

## 6. Waiting Strategies

- **NEVER** use `waitForLoadState('networkidle')`.
- **NEVER** use `waitForTimeout` unless absolutely unavoidable (e.g. waiting for CSS transition animations).
- **Rely on Auto-waiting:** Playwright inherently waits for elements to become actionable. Utilize `expect(locator).toBeVisible()` or await precise API responses: `await page.waitForResponse('/api/auth')`.
- Limit the usage of `test.step()` wrapping every minor click; keep test structures lean.

## 7. Fast Fail

If critical dataset configuration or environmental variables are absent, throw a loud error prematurely:
```typescript
if (!process.env.API_URL) {
    throw new Error('API_URL is missing in environment variables');
}
```
