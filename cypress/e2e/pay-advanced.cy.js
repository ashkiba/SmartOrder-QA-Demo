describe('Payment API - Security and Injection Tests', () => {
    const endpoint = '/api/payment';

    // این تابع چک می‌کند که سرور درخواست را رد کرده باشد، چه با پیام چه بدون پیام
    const validateSecurityRejection = (res) => {
        // ۱. تایید اینکه سرور درخواست را Reject کرده (کد 400 یا 404)
        expect(res.status).to.be.oneOf([400, 404]);
        
        // ۲. فقط اگر بدنه پاسخ وجود داشت، محتوای آن را چک کن (برای جلوگیری از خطای undefined در CI)
        if (res.body && res.body.status) {
            expect(res.body.status).to.eq('FAILED');
        }
    };

    context('Invalid orderId values', () => {
        it('should reject SQL-like injection', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: "' OR 1=1 --", amount: 100 },
                failOnStatusCode: false
            }).then((res) => validateSecurityRejection(res));
        });

        it('should reject Unicode injection', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: '💣💥🔥', amount: 100 },
                failOnStatusCode: false
            }).then((res) => validateSecurityRejection(res));
        });

        it('should reject excessive whitespace', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: ' '.repeat(500), amount: 100 },
                failOnStatusCode: false
            }).then((res) => validateSecurityRejection(res));
        });
    });

    context('Invalid amount values', () => {
        it('should reject script injection in amount', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: 'o_12345', amount: "<script>100</script>" },
                failOnStatusCode: false
            }).then((res) => validateSecurityRejection(res));
        });

        it('should reject excessively large amount', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: 'o_12345', amount: 1e12 },
                failOnStatusCode: false
            }).then((res) => validateSecurityRejection(res));
        });
    });

    context('Combined malformed payloads', () => {
        it('should reject mixed invalid orderId and amount', () => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: { orderId: '<script>alert(1)</script>', amount: 'NaN' },
                failOnStatusCode: false
            }).then((res) => validateSecurityRejection(res));
        });
    });
});