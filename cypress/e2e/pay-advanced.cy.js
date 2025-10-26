describe('Payment API - Advanced Scenarios', () => {
    const endpoint = '/api/payment';

    before(() => {
        cy.request('POST', '/api/reset-payments');
    });

    it('should prevent duplicate payment for the same order', () => {
        const payload = {
            orderId: 'o_adv_001',
            amount: 100
        };

        cy.request({
            method: 'POST',
            url: endpoint,
            body: payload,
            failOnStatusCode: false
        }).then((res1) => {
            expect(res1.status).to.eq(200);
            expect(res1.body.status).to.eq('SUCCESS');

            cy.request({
                method: 'POST',
                url: endpoint,
                body: payload,
                failOnStatusCode: false
            }).then((res2) => {
                expect(res2.status).to.eq(409);
                expect(res2.body.status).to.eq('FAILED');
                expect(res2.body.error).to.eq('Duplicate payment');
            });
        });
    });

    it('should fail if amount does not match order total', () => {
        const payload = {
            orderId: 'o_12345',
            amount: 999
        };

        cy.request({
            method: 'POST',
            url: endpoint,
            body: payload,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.status).to.eq('FAILED');
            expect(res.body.error).to.eq('Amount mismatch');
        });
    });

    it('should handle delayed response from order-service', () => {
        const payload = {
            orderId: 'o_slow',
            amount: 100
        };

        cy.request({
            method: 'POST',
            url: endpoint,
            body: payload,
            timeout: 10000,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.status).to.eq('SUCCESS');
        });
    });

    it('should fail if order-service is unreachable or order is missing', () => {
        const payload = {
            orderId: 'o_broken',
            amount: 100
        };

        cy.request({
            method: 'POST',
            url: endpoint,
            body: payload,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(404);
            expect(res.body.status).to.eq('FAILED');
            expect(res.body.error).to.eq('Order not found');
        });
    });

    // Security & Injection Tests

    it('should fail if orderId contains script injection', () => {
        const payload = {
            orderId: '<script>alert(1)</script>',
            amount: 100
        };

        cy.request({
            method: 'POST',
            url: endpoint,
            body: payload,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.status).to.eq('FAILED');
        });
    });

    it('should fail if amount contains script injection', () => {
        const payload = {
            orderId: 'o_12345',
            amount: "<script>100</script>"
        };

        cy.request({
            method: 'POST',
            url: endpoint,
            body: payload,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.status).to.eq('FAILED');
        });
    });

    it('should fail if orderId is null', () => {
        const payload = {
            orderId: null,
            amount: 100
        };

        cy.request({
            method: 'POST',
            url: endpoint,
            body: payload,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.status).to.eq('FAILED');
            expect(res.body.error).to.eq('Missing orderId');
        });
    });

    it('should fail if amount is extremely large', () => {
        const payload = {
            orderId: 'o_12345',
            amount: 999999999999999999999
        };

        cy.request({
            method: 'POST',
            url: endpoint,
            body: payload,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.status).to.eq('FAILED');
        });
    });
});