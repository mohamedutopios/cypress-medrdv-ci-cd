import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:8003",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    retries: { runMode: 1, openMode: 0 },
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      reportDir: "cypress/reports",
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
    },
    setupNodeEvents(on) {
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
});


import { defineConfig } from "cypress";

export default defineConfig({
  reporter: "mochawesome",

  reporterOptions: {
    reportDir: "cypress/reports",
    html: true,
    json: true,
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    reportTitle: "Rapport de tests fonctionnels – Médecins",
    reportPageTitle: "Validation applicative"
  },

  e2e: {
    baseUrl: "http://127.0.0.1:8000",
    screenshotOnRunFailure: true,
    video: false
  }
});

