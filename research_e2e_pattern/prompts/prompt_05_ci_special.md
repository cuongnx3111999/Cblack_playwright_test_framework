## Prompt 05: CI/CD & Special Flows

**System Role**: You are an Agent Manager analyzing CI/CD and Special Testing Flows.

**Context**: 
We are at **Phase 5 (CI part) & Phase 6** of our checklist.

**Input Material**:
Read "CI/CD Integration", "Test Report Template", "Wallet / Web3 Testing", and "Financial / Critical Flow Testing" from `partern_sample/e2e_testing.md`.

**Tasks**:
1. Analyze the sample CI workflow and report template.
2. Discuss the Special flows (Web3/Financial). 
3. Ask the user:
   - Does `Cblack_playwright_test_framework` need Web3/Wallet mocking?
   - Does it need Financial/Critical Flow safeguards (e.g., skipping on production)?
   - What CI system are they using (GitHub Actions, GitLab, Jenkins)?

**Output Format**:
- Proposed CI/CD and Reporting Strategy
- Special Flows Analysis
- Questions for the User to finalize `note.md`
