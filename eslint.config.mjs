import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ["node_modules/", "playwright-report/", "test-results/", "dist/", ".github/", ".vscode/", "_bmad/", ".agent/"]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    playwright.configs['flat/recommended'],
    eslintConfigPrettier,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],

            "playwright/no-wait-for-timeout": "warn",
            "playwright/no-skipped-test": "warn",
            "playwright/no-focused-test": "error",
            "playwright/expect-expect": "error",
            "playwright/no-conditional-in-test": "warn"
        }
    }
);
