# Utils Catalog

This document aggregates pure auxiliary functions belonging to the **Utils (`src/utils/`)** layer.
Utils are functions for manipulating logical data, math, strings, dates, etc., with no Playwright `Page` or `Locator` context attached.

## 1. StringUtils
**Path:** `src/utils/stringUtils.ts`
- `generateRandomEmail(prefix: string): string`: Generates random emails to prevent test collisions.
- `extractNumbers(text: string): number`: Extracts numerical values from UI text (e.g., "Total: $50.00" -> 5000).

## 2. DateUtils
**Path:** `src/utils/dateUtils.ts`
- `getCurrentDateFormatted(format: string): string`: Obtains the current timestamp adhering to a defined pattern (e.g., DD/MM/YYYY).

---
📌 **Rule for Creating New Utils (For AI Agents):**
1. Before inventing a custom random algorithm or string regex parser, consult this catalog first.
2. If the utility doesn't exist, the Generator Agent should create a file inside `src/utils/` and export the function individually (classes are not strictly required).
3. MUST update this Catalog Document upon releasing a new Util.
