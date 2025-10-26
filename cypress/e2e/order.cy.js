describe('Order API', () => {
  it('should create an order and return normalized address', () => {
    cy.request('POST', 'http://localhost:3000/api/order', {
      product: { name: 'Book', size: 'small' },
      address: { street: '123 unknown', city: 'nowhere', region: 'Other', country: 'my' },
      amount: 100
    }).then((response) => {
      expect(response.status).to.eq(201);
      const body = response.body;
      expect(body.carrier).to.eq('CarrierB');
      expect(body.paymentStatus).to.eq('SUCCESS');
      expect(body.address.region).to.eq('Standardized');
    });
  });
});