# Helper Catalog

This document tracks the list of classes/functions belonging to the **Helper (`src/helpers/`)** layer.
Helpers are utilities for E2E testing that **do not interact directly through the UI (Page Objects)**. They are primarily used for calling APIs (REST/GraphQL), interacting with Databases, setting up mock data (Seed Data), or cleaning up environments (Teardown).

Prioritize using API Helpers to prepare test data (Preconditions) to make tests run faster and more stable compared to interacting through the UI.

## 1. Basic ApiHelper
**Path:** `src/helpers/ApiHelper.ts`
- `createRequest(endpoint: string, data: any): Promise<APIResponse>`: Quick data creation point.
- `deleteAllTestData(userId: string): Promise<void>`: Cleanup script to be run at the end of every test file.

## 2. Business Helpers
*(AI Agent: When designing or generating test scripts requiring Data creation/deletion, look for existing API capabilities here first. If no relevant API Helper exists, you may generate a new one and record it here!)*

---
📌 **Rule for Creating New Helpers:**
1. API Helpers must consume Playwright's `request` context instead of `page` context.
2. ABSOLUTELY DO NOT place `expect()` commands (assertions) inside the Helper layer.
3. Upon creating a new Helper, the AI Agent MUST insert relevant details to the list above.
