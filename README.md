# Playwright Playground

A TypeScript-based Playwright test automation framework showcasing both API and End-to-End (E2E) testing practices.

**Website Under Test:** [Conduit (Learn WebdriverIO)](https://demo.learnwebdriverio.com/)

---

## Prerequisites

Before running the tests, ensure you have an active, registered user account on the website.

## Getting Started

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```
2. **Install Playwright Browsers:**
   ```bash
   npx playwright install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root folder of the project and populate it with your registered user credentials:
   ```env
   USER_NAME=someJohn
   USER_EMAIL=john@testemail.com
   USER_PASSWORD=sdfgsADSG123
   API_BASE_URL=[https://conduit-api.learnwebdriverio.com/api](https://conduit-api.learnwebdriverio.com/api)
   BASE_URL=[https://demo.learnwebdriverio.com](https://demo.learnwebdriverio.com)
   ```
4. **Run the tests:**

   ```bash
   npx playwright test
   ```

5. **View the test report:**
   ```bash
   npx playwright show-report
   ```

---

## Project Structure

- `tests/` - Contains all API and E2E test files.
- `playwright.config.ts` - Global Playwright configuration, timeouts, and browser matrices.
- `.env.example` - Template for environment variables (tracked in git).
