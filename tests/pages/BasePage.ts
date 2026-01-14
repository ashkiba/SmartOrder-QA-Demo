import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async logStep(stepName: string) {
    console.log(`[STEP]: ${stepName}`);
  }

  async getPageTitle() {
    return await this.page.title();
  }
}
