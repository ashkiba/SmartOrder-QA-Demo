import { test, expect } from '@playwright/test';

test.describe('Payment Gateway - Security Audit', () => {
  
  // آدرس کامل سرویس پرداخت
  const paymentApiUrl = 'http://localhost:3010/api/payment';

  const maliciousPayloads = [
    { name: 'SQL Injection', payload: "1' OR '1'='1" },
    { name: 'XSS Script', payload: "<script>alert('xss')</script>" }
  ];

  for (const item of maliciousPayloads) {
    test(`Should handle ${item.name} appropriately`, async ({ request }) => {
      const response = await request.post(paymentApiUrl, { // استفاده از آدرس کامل با پورت 3010
        data: {
          orderId: item.payload,
          amount: 100
        }
      });

      // اصلاح وضعیت: سرویس پرداخت برای ورودی مخرب باید 400 برگرداند
      // اگر سرور شما هنوز 404 برمی‌گرداند، این عدد را 404 بگذارید، 
      // اما طبق استاندارد امنیتی و کدهای Cypress شما، باید 400 باشد.
      expect(response.status()).toBe(400); 
      
      const responseBody = await response.text();
      console.log(`Response for ${item.name}:`, responseBody);
      
      // بررسی اینکه پاسخ حاوی کلمه FAILED باشد (مطابق با لاگ‌های Cypress)
      expect(responseBody).toContain('FAILED');
    });
  }
});