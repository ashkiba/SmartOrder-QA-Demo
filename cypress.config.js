const { defineConfig } = require("cypress");



module.exports = defineConfig({

  e2e: {

    baseUrl: "http://localhost:3010",

    setupNodeEvents(on, config) {

      // implement node event listeners here

    },

    supportFile: "cypress/support/e2e.js"

  },

  reporter: "mochawesome",

  reporterOptions: {

    reportDir: "mochawesome-report",

    overwrite: false,

    html: true,

    json: true

  }

});