describe('Payment Form UI Test', () => {
const formUrl = 'http://127.0.0.1:5500/frontend/payment-form.html';

    beforeEach(() => {
        cy.visit(formUrl);
    });

    it('should submit valid payment and show success message', () => {
        cy.get('#orderId').type('o_12345');
        cy.get('#amount').type('100');
        cy.get('button[type="submit"]').click();

        cy.get('#result', { timeout: 5000 }).should('contain.text', 'SUCCESS');
        cy.screenshot('valid-payment-success');
    });

    it('should show error for invalid orderId', () => {
        cy.get('#orderId').type('💣💥🔥');
        cy.get('#amount').type('100');
        cy.get('button[type="submit"]').click();

        cy.get('#result', { timeout: 5000 }).should('contain.text', 'FAILED');
        cy.screenshot('invalid-orderId-error');
    });

    it('should show error for amount mismatch', () => {
        cy.get('#orderId').type('o_12345');
        cy.get('#amount').type('999');
        cy.get('button[type="submit"]').click();

        cy.get('#result', { timeout: 5000 }).should('contain.text', 'FAILED');
        cy.screenshot('amount-mismatch-error');
    });
});