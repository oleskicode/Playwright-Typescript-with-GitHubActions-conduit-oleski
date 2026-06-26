# Playwright Playground

A TypeScript-based Playwright test automation framework showcasing both API and End-to-End (E2E) testing practices.

**Website Under Test:** [Conduit (Learn WebdriverIO)](https://demo.learnwebdriverio.com/)

---

## Technologies Used

- [Playwright](https://playwright.dev/) - A Node.js library to automate Chromium, Firefox and WebKit with a single API.
- [TypeScript](https://www.typescriptlang.org/) - A strongly typed superset of JavaScript that compiles to plain JavaScript.
- [Node.js](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.

## Prerequisites

Before running the tests, ensure you have an active, registered user account on the website.

## Getting Started

1.  **Clone the repository and install dependencies:**

    ```bash
    npm install
    ```

2.  **Install Playwright Browsers:**

    ```bash
    npx playwright install
    ```

3.  **Configure Environment Variables:**

    Create a `.env` file in the root folder of the project and populate it with your registered user credentials:

    ```env
    USER_NAME=someJohn
    USER_EMAIL=john@testemail.com
    USER_PASSWORD=sdfgsADSG123
    API_BASE_URL=https://conduit-api.learnwebdriverio.com/api
    BASE_URL=https://demo.learnwebdriverio.com
    ```

4.  **Run the tests:**

    ```bash
    npx playwright test
    ```

5.  **View the test report:**

    ```bash
    npx playwright show-report
    ```

---

## Project Structure

- `tests/` - Contains all API and E2E test files.
  - `api-tests/` - API specific tests.
  - `ui-tests/` - User interface specific tests.
- `pages/` - Page Object Model implementations for UI tests.
- `fixtures/` - Custom Playwright fixtures for authenticated API contexts and page objects.
- `helpers/` - Helper functions and utilities for common tasks.
- `setup/` - Setup files for global test configurations, like user registration.
- `playwright.config.ts` - Global Playwright configuration, timeouts, and browser matrices.
- `.env.example` - Template for environment variables (tracked in git).
