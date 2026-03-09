---
name: cblack-playwright-e2e-en
description: Playwright E2E test creation workflow following the Cblack Enterprise Architectural Standard. Uses a 3-agent architecture adapted for Monorepo, Data-driven, and Smart Flows models.
---

# Cblack Playwright E2E Testing Workflow

A 3-agent automated workflow for creating E2E tests under the Cblack framework:

1. **Planner** -> Explores the UI, creates a markdown test plan outlining Business Flows and JSON locator dependencies.
2. **Generator** -> Converts the test plan into executable Playwright tests, strictly adhering to Cblack Enterprise conventions (Dumb Pages, Smart Flows, Data-driven locators).
3. **Healer** -> Automatically diagnoses and fixes failing tests, prioritizing locator updates in JSON files and Custom Fixtures.

## When to use this skill

MANDATORY (TRIGGER) use of this skill in the following scenarios, regardless of whether the user communicates in English, Vietnamese, or any other language:

1. **E2E Testing**: When the user asks for "Playwright", "E2E", "Test", "Automation", "Spec", "Write test", "Fix test".
2. **Architecture**: Working with concepts like "Dumb Pages", "Smart Flows", "Fixtures", or "JSON Locators".
3. **Debugging / Refactoring**: Requests to "fix bug", "fix test", "update locator", "maintain test flow".

**Multi-language trigger examples:**
- 🇺🇸 "Write an E2E test for the checkout flow"
- 🇺🇸 "Create a new Dumb Page and Smart Flow for user settings"
- 🇺🇸 "Fix the broken playwright spec file"
- 🇻🇳 "Tạo bài kiểm thử E2E cho luồng đăng nhập admin"
- 🇻🇳 "Sửa lỗi file test dashboard bị hỏng"

## Core Architectural Principles

This skill STRICTLY adheres to the Cblack Architecture Standard:
1. **Dumb Pages - Smart Flows:** `Page Objects` handle only basic DOM interactions. Complex interactions and business logic are delegated to `Business Flows`.
2. **No Hardcoding:** All locators MUST be read from JSON files located in `src/data/locators/`.
3. **Dependency Injection:** Tests must use Custom Fixtures (e.g. `loginFlow`) instead of manually instantiating classes.
4. **Expectations belong in Tests:** `expect()` assertions are ONLY allowed inside `*.spec.ts` files. NEVER use `expect()` inside Pages or Flows.
5. **Fast Fail:** Throw errors immediately if environment variables or essential test data are missing.

## Operational Phases

### Phase 1: Planning
**Agent**: [agents/playwright-test-planner.md](agents/playwright-test-planner.md)
**Output**: `docs/specs/{feature-name}.md`

### Phase 2: Code Generation
**Agent**: [agents/playwright-test-generator.md](agents/playwright-test-generator.md)
**Output**: `src/tests/{feature-area}/{test-name}.spec.ts`, updating `src/data/locators/*.json`, `src/pages/*.ts`, and `src/flows/*.ts`.

### Phase 3: Healing
**Agent**: [agents/playwright-test-healer.md](agents/playwright-test-healer.md)
**Output**: Fixed test files or JSON locators.

## Directory Structure

```text
Cblack_playwright_test_framework/
├── src/
│   ├── data/                 # Test data (JSON, CSV, locators, mocks)
│   ├── fixtures/             # Custom fixtures (Auto-initialization)
│   ├── flows/                # Business flows / Multi-page interactions
│   ├── pages/                # Page Object Models (Dumb pages)
│   ├── tests/                # Executable test specs (*.spec.ts)
│   ├── utils/                # Pure utility functions
│   ├── helpers/              # API/DB helpers (No UI interaction)
│   └── types/                # TypeScript interface definitions
```
