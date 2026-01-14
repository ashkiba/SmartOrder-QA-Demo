describe('Payment Form UI Test', () => {
    const formUrl = 'http://localhost:8080/payment-form.html';
    const paymentServiceUrl = 'http://localhost:3010';

    beforeEach(() => {
        cy.request('POST', `${paymentServiceUrl}/api/reset-payments`);
        cy.visit(formUrl);
    });

    it('should submit valid payment and show success message', () => {
        cy.get('#orderId').clear().type('o_12345');
        cy.get('#amount').clear().type('100');
        cy.get('button[type="submit"]').click();

        cy.get('#result', { timeout: 7000 }).should('be.visible').and('contain.text', 'SUCCESS');
        cy.screenshot('valid-payment-success');
    });

    it('should show error for invalid orderId', () => {
        cy.get('#orderId').clear().type('💣💥🔥');
        cy.get('#amount').clear().type('100');
        cy.get('button[type="submit"]').click();

        cy.get('#result', { timeout: 7000 }).should('be.visible').and('contain.text', 'FAILED');
        cy.screenshot('invalid-orderId-error');
    });

    it('should show error for amount mismatch', () => {
        cy.get('#orderId').clear().type('o_12345');
        cy.get('#amount').clear().type('999');
        cy.get('button[type="submit"]').click();

        cy.get('#result', { timeout: 7000 }).should('be.visible').and('contain.text', 'FAILED');
        cy.screenshot('amount-mismatch-error');
    });
});