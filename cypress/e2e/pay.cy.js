describe('🧾 Payment API - Functional Tests', () => {
    const endpoint = '/api/payment';

    before(() => {
        cy.request('POST', '/api/reset-payments');
    });

    context(' Valid Payment Flow', () => {
        it('should process a valid payment request', () => {
            const payload = {
                orderId: 'o_12345',
                amount: 100
            };

            cy.request({
                method: 'POST',
                url: endpoint,
                body: payload
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body).to.have.property('status', 'SUCCESS');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eq('Payment processed');
            });
        });
    });

    context(' Invalid Payment Scenarios', () => {
        it('should fail when orderId is missing', () => {
            const payload = {
                amount: 100
            };

            cy.request({
                method: 'POST',
                url: endpoint,
                body: payload,
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.eq('Missing orderId');
            });
        });

        it('should fail when amount is negative', () => {
            const payload = {
                orderId: 'o_12345',
                amount: -50
            };

            cy.request({
                method: 'POST',
                url: endpoint,
                body: payload,
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.eq('Invalid amount');
            });
        });

        it('should fail when orderId does not exist in order-service', () => {
            const payload = {
                orderId: 'o_fake_999',
                amount: 100
            };

            cy.request({
                method: 'POST',
                url: endpoint,
                body: payload,
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.eq('Order not found');
            });
        });
    });
});