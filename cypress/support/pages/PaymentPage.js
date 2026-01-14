// cypress/support/pages/PaymentPage.js

class PaymentPage {
  get orderIdInput() { return cy.get('#orderid'); }
  get amountInput() { return cy.get('#amount'); }
  get submitButton() { return cy.get('button[type="submit"]'); }
  get resultMessage() { return cy.get('#result'); }

  visit() {
    cy.visit('/payment-form.html');
  }

  submitPayment(orderId, amount) {
    if (orderId) this.orderIdInput.type(orderId);
    if (amount) this.amountInput.type(amount);
    this.submitButton.click();
  }

  verifySuccess() {
    this.resultMessage.should('contain', 'SUCCESS');
  }
}

export const paymentPage = new PaymentPage();