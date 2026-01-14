import { Page, Locator, expect } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  readonly orderIdInput: Locator;
  readonly amountInput: Locator;
  readonly submitButton: Locator;
  readonly resultMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderIdInput = page.locator('#orderId'); 
    this.amountInput = page.locator('#amount');
    this.submitButton = page.locator('button[type="submit"]');
    this.resultMessage = page.locator('#result');
  }

  async goto() {
    await this.page.goto('/payment-form.html'); 
  }

  async submitPayment(orderId: string, amount: string) {
    await this.orderIdInput.fill(orderId);
    await this.amountInput.fill(amount);
    await this.submitButton.click();
  }

  async getResultMessage() {
    // مهم: منتظر می‌ماند تا متن داخل این المان دیگر خالی نباشد
    await expect(this.resultMessage).not.toHaveText('', { timeout: 10000 });
    return await this.resultMessage.innerText();
  }
}