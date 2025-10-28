describe('Payment API - Security and Injection Tests', () => {
    const endpoint = '/api/payment';

    context('Invalid orderId values', () => {
        it('should reject SQL-like injection', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: "' OR 1=1 --", amount: 100 },
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body.status).to.eq('FAILED');
                expect(res.body).to.have.property('error', 'Invalid orderId');
            });
        });

        it('should reject Unicode injection', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: '💣💥🔥', amount: 100 },
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body.status).to.eq('FAILED');
                expect(res.body).to.have.property('error', 'Invalid orderId');
            });
        });

        it('should reject excessive whitespace', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: ' '.repeat(500), amount: 100 },
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body.status).to.eq('FAILED');
                expect(res.body).to.have.property('error', 'Invalid orderId');
            });
        });
    });

    context('Invalid amount values', () => {
        it('should reject script injection in amount', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: 'o_12345', amount: "<script>100</script>" },
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body.status).to.eq('FAILED');
                expect(res.body).to.have.property('error', 'Invalid amount');
            });
        });

        it('should reject excessively large amount', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: 'o_12345', amount: 1e12 },
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body.status).to.eq('FAILED');
                expect(res.body).to.have.property('error', 'Invalid amount');
            });
        });
    });

    context('Combined malformed payloads', () => {
        it('should reject mixed invalid orderId and amount', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: '<script>alert(1)</script>', amount: 'NaN' },
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body.status).to.eq('FAILED');
            });
        });
    });
});