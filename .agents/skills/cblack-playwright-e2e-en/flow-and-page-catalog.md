# Flow & Page Catalog

In the Cblack architecture, UI interactions are rigidly separated into 2 layers: **Dumb Pages** and **Smart Flows**.
AI Agents must prioritize importing existing *Flows* into test specs. It is STRICTLY FORBIDDEN to call click actions directly from *Pages* inside a test file.

## 1. Business Flows - `src/flows/`
Flows are responsible for connecting multiple Page screens to execute a chain of actions. Flows are automatically injected via Custom Fixtures.

### LoginFlow
**Path:** `src/flows/LoginFlow.ts`
**Test Invocation:** `({ loginFlow }) => { ... }`
**Methods:**
- `loginAsUser(credentials: UserCredentials): Promise<DashboardPage>`: Fills user/pass, clicks login, and returns the Dashboard page object.
- `logout(): Promise<void>`

*(AI Agent: If encountering a new feature, e.g., Checkout, you must analyze and create a `CheckoutFlow`)*

---

## 2. Page Objects (Dumb Pages) - `src/pages/`
Pages are strictly tasked with taking coordinates/locators (from JSON Locator files) and executing `click()/fill()` commands to Playwright. **PROHIBITED:** `expect` (assertions) must never be placed in these files.

### LoginPage
**Path:** `src/pages/LoginPage.ts`
**Basic actions:**
- `enterEmail(email: string): Promise<void>`
- `enterPassword(password: string): Promise<void>`
- `clickLogin(): Promise<void>`

### DashboardPage
**Path:** `src/pages/DashboardPage.ts`
**Basic actions:**
- `getWelcomeTitleLocator(): Locator`: Returns the Locator object directly so the external test file can catch it and run `expect(loc).toBeVisible()`.
- `clickUserMenu(): Promise<void>`

---
📌 **Creation Procedure for Agent Generator:**
1. Generate a Key-Value file at `src/data/locators/<name>.json`.
2. Create a new Class at `src/pages/<name>Page.ts` and import the locator data from the JSON file.
3. Create a Flow Class at `src/flows/<name>Flow.ts` to coordinate methods from the Page.
