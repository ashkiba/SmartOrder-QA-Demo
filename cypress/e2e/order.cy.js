
describe('Order Service API Tests', () => {
  const baseUrl = 'http://localhost:3020'; // ✅ order-service runs on 3020

  it('should fetch an existing order successfully', () => {
    cy.request(`${baseUrl}/api/order/o_12345`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('order');
      expect(response.body.order).to.have.property('orderId', 'o_12345');
      expect(response.body.order.items).to.include('item1');
    });
  });

  it('should handle delayed orders (simulate 5s wait)', () => {
    cy.request(`${baseUrl}/api/order/o_slow`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.order.orderId).to.eq('o_slow');
    });
  });

  it('should return 404 for non-existent order', () => {
    cy.request({
      url: `${baseUrl}/api/order/o_notfound`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Order not found');
    });
  });
});
