import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductPage } from '../pages/ProductPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { OrdersPage } from '../pages/OrdersPage.js';

export const test = baseTest.extend({
  // Logged‐in page
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('yallamilli@gmail.com', 'Satya@007');
    await page.waitForURL('**/dashboard/dash', { timeout: 30000 });
    await use(page);
  },

  // Page‐object instances
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  }
});

export { expect };
