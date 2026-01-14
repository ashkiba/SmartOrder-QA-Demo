import { test, expect } from '@playwright/test';
import { PaymentPage } from '../pages/PaymentPage';
import axios from 'axios';

test.describe('Payment Flow E2E', () => {
  
  test.beforeAll(async () => {
    try {
      // پاک کردن تاریخچه پرداخت‌ها برای اینکه خطای Duplicate نگیریم
      await axios.post('http://localhost:3010/api/reset-payments');
    } catch (e) {
      console.log('Payment reset failed');
    }
  });

  test('User should be able to complete a valid payment', async ({ page }) => {
    const paymentPage = new PaymentPage(page);

    // استفاده از آی‌دی که دقیقاً در order-service تعریف شده است
    const validOrderId = 'o_12345'; 
    const amount = "100";

    await paymentPage.goto();
    await paymentPage.submitPayment(validOrderId, amount);

    const message = await paymentPage.getResultMessage();
    
    console.log(`Testing with ID: ${validOrderId}, Result: ${message}`);

    // این بار حتماً باید SUCCESS بگیریم
    expect(message).toContain('SUCCESS');
  });
});