# Fixture Catalog

All Fixtures in the Cblack framework are located in the `src/fixtures/` directory. 
Test files MUST implicitly `import { test, expect }` from the Custom Fixture instead of `@playwright/test`. This technique is called **Dependency Injection**.

## 1. Base Fixture (`src/fixtures/base.fixture.ts`)

**Mandatory Import Syntax:** `import { test, expect } from '@/fixtures/base.fixture'`

This *Base Fixture* extends the default Playwright Runner. It allows passing Flow variables directly into the test function's parameters without using the `new Class()` command.

### List of Injected Fixtures:

| Fixture Name | Return Type | Description |
|--------------|------|-------------|
| `loginFlow` | `LoginFlow` | Injects the authentication flow. Returns the web state after successful login. |
| `adminFlow` | `AdminFlow` | (Example) Injects the Admin control flow. |

*(AI Agents: Whenever a new Business Flow is generated, you MUST navigate to `base.fixture.ts` to update the `AppFixtures` Interface Type and setup its initialization `use(new NewFlow(page))`)*.

## 2. Fixture Usage Rules

1.  **NO Manual Initialization:** NEVER write `const flow = new LoginFlow(page)` inside the test body (`test()` block). Always use destructuring: 
    ```typescript
    test('abc', async ({ loginFlow }) => { ... })
    ```
2.  **Auto Inheritance:** Memory cleanup and teardown are automatically handled by Core Playwright Fixtures. Keeping test code clean relies entirely on fixture setup.
3.  **Environment Dominance:** Special variables like `browserName`, mock user details, or global configs can be wrapped and injected via this Catalog to share across thousands of tests simultaneously.
