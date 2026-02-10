// cypress.config.js — Configuration avec Mochawesome + Screenshots

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:8000',

    // =========================================================================
    // SPECS — Cibler les tests médecins
    // =========================================================================
    specPattern: 'cypress/e2e/**/medecin*',

    // =========================================================================
    // SCREENSHOTS — Toujours capturer
    // =========================================================================
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: true,

    // =========================================================================
    // VIDÉOS
    // =========================================================================
    video: true,
    videosFolder: 'cypress/videos',

    // =========================================================================
    // REPORTER — Mochawesome (rapport HTML)
    // =========================================================================
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,          // On génère le HTML après merge
      json: true,           // Génère un JSON par spec
      timestamp: 'yyyy-mm-dd_HH-MM-ss',
      charts: true,
      reportPageTitle: 'MedRDV – Tests Médecins',
      reportTitle: 'Tests Fonctionnels – Médecins',
      embeddedScreenshots: true,
      inlineAssets: true,
    },

    // =========================================================================
    // TIMEOUTS
    // =========================================================================
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,

    // =========================================================================
    // SETUP
    // =========================================================================
    supportFile: 'cypress/support/e2e.js',

    setupNodeEvents(on, config) {
      // Screenshot après chaque test (même réussi)
      on('after:screenshot', (details) => {
        console.log('📸 Screenshot:', details.path)
      })

      return config
    },
  },

  // ===========================================================================
  // CREDENTIALS
  // ===========================================================================
  env: {
    adminUsername: 'admin@medrdv.fr',
    adminPassword: 'admin123',
    medecinUsername: 'medecin@medrdv.fr',
    medecinPassword: 'medecin123',
  },
})
