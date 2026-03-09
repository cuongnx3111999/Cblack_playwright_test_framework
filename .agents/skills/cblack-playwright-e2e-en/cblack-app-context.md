# Cblack App Context

This document provides foundational domain knowledge about the application being tested using the Cblack Enterprise framework. AI Agents must read this document to understand data operations.

*(Note: The development team should update this file if the target application has specific business concepts)*

## 1. Data Management Principles
Cblack strictly follows a **Data-Driven approach**:
- **No Hardcoding:** AI MUST NOT invent user information (email, password) or hardcode URLs into test scripts.
- **Environment Variables:** All execution parameters (like `API_URL`, `BASE_URL`) are configured externally. Agents must not overwrite them and should use `process.env`.
- **Users:** Retrieved from centralized configuration files (e.g., `src/data/users.constants.ts`).

## 2. Common Entities
Based on the system structure:
- **Account / User:** Requires a strict login flow.
- **Dashboard:** Contains all navigational menus after successful login.

## 3. Locator System
**This is the heart of Cblack:** Instead of scattering locators throughout TS code, ALL CSS/XPath selectors for Web Elements are centralized in `src/data/locators/*.json`. 
- If the UI changes class/id names, the AI Healer only needs to update one JSON file, and the entire framework will turn "Green" again.
- The JSON format is Key-Value. Keys are written in camelCase (e.g., `submitBtn`, `emailInput`).
