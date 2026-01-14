export class BasePage {
  
  visit(path) {
    cy.visit(path);
    this.logStep(`Visited ${path}`);
  }

  logStep(stepName) {
    cy.log(`**[STEP]: ${stepName}**`);
  }

  waitForElement(selector) {
    cy.get(selector).should('be.visible');
  }

  handleUncaughtExceptions() {
    Cypress.on('uncaught:exception', () => false);
  }
}