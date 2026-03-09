# Network Mock Catalog

This document tracks the list of API Endpoints that have been mocked or stubbed within the framework. Using Playwright's `page.route()`, we can mock server responses to test various UI states such as: success states, server errors (500), and Empty States, without depending on a real backend.

All static mock JSON data files should be placed inside `src/data/mocks/`.

## 1. Mock Data Examples
- **Feature**: Simulating Empty List State
- **Intercepted Endpoint**: `**/api/v1/users`
- **Mock Data File**: `src/data/mocks/users/empty-list.json`

---
📌 **Rule for Generating New Mocks (For AI Agents):**
1. Before creating new mock data for a UI view, check this Catalog to see if the endpoint has already been mocked.
2. If not, save the mock JSON file directly into `src/data/mocks/`. Network mocking can be implemented directly inside the Test file or grouped into a generic Helper.
3. NEVER hardcode giant JSON blobs inside the `.spec.ts` files.
4. MUST update this Catalog document immediately after creating a new network interception flow.
