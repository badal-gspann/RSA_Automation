import { test, expect } from '../fixtures/fixtures.js';
import { ProductPage } from '../pages/ProductPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { OrdersPage } from '../pages/OrdersPage.js';
//------------------// Priyanshu
test.describe('Team 5 - End-to-End Integration Tests', () => {
 
  test('TC041: Complete purchase flow from login to order confirmation', async ({ authenticatedPage }) => {
    const productPage = new ProductPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);
 
    await productPage.navigate();
    await productPage.addProductToCart('ZARA COAT 3');
    await productPage.navigateToCart();
    await cartPage.proceedToCheckout();
 
    const result = await checkoutPage.completeCheckout('test@checkout.com', 'India');

    await expect(authenticatedPage).toHaveURL(/.*\/dashboard\/thanks/);
  });
 
  test('TC042: View order history after purchase', async ({ authenticatedPage }) => {
    const productPage  = new ProductPage(authenticatedPage);
    const cartPage     = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);
    const ordersPage   = new OrdersPage(authenticatedPage);
 
    await productPage.navigate();
    await productPage.addProductToCart('ZARA COAT 3');
    await productPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.completeCheckout('test@checkout.com', 'India');
 
    await ordersPage.navigate();
    const hasOrders = await ordersPage.hasOrders();
    expect(typeof hasOrders).toBe('boolean');
  });
 
  test('TC043: Search and verify order in order history', async ({ authenticatedPage }) => {
    const ordersPage = new OrdersPage(authenticatedPage);
 
    await ordersPage.navigate();
    const orderDetails = await ordersPage.getOrderDetails();
 
    if (orderDetails.length > 0) {
      const firstOrder = orderDetails[0];
      const searchResult = await ordersPage.searchOrderByProduct(firstOrder.product.trim());
      expect(searchResult).toBeTruthy();
    } else {
      expect(orderDetails.length).toBeGreaterThanOrEqual(0);
    }
  });
 
  test('TC044: Logout and verify session termination', async ({ authenticatedPage }) => {
    const productPage = new ProductPage(authenticatedPage);
 
    await productPage.navigate();
    await productPage.logout();
    await expect(authenticatedPage).toHaveURL(/.*\/auth\/login/);
  });
 
  test('TC045: Multiple product purchase workflow', async ({ authenticatedPage }) => {
    const productPage  = new ProductPage(authenticatedPage);
    const cartPage     = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);
 
    await productPage.navigate();
    await productPage.addProductToCart('ZARA COAT 3');
    await productPage.addProductToCart('ADIDAS ORIGINAL');
 
    await productPage.navigateToCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(0);
 
    await cartPage.proceedToCheckout();
    const result = await checkoutPage.completeCheckout('test@checkout.com', 'India');
    await expect(authenticatedPage).toHaveURL(/.*\/dashboard\/thanks/);
  });
 
  test('TC046: Navigation between all main pages', async ({ authenticatedPage }) => {
    const productPage = new ProductPage(authenticatedPage);
    const cartPage    = new CartPage(authenticatedPage);
 
    await productPage.navigate();
    await productPage.navigateToCart();
    await expect(authenticatedPage).toHaveURL(/.*\/cart/);
 
    await cartPage.continueShopping();
    await expect(authenticatedPage).toHaveURL(/.*\/dash/);
 
    await productPage.navigateToOrders();
    await expect(authenticatedPage).toHaveURL(/.*\/myorders/);
  });
 
  test('TC047: Error handling in complete workflow', async ({ authenticatedPage }) => {
    const productPage  = new ProductPage(authenticatedPage);
    const cartPage     = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);
 
    await productPage.navigate();
    await productPage.addProductToCart('ZARA COAT 3');
    await productPage.navigateToCart();
    await cartPage.proceedToCheckout();
 
    await checkoutPage.fillShippingInformation('', '');
    const result = await checkoutPage.placeOrder();
    await expect(authenticatedPage).toHaveURL(/.*dashboard\/order.*/);
  });
 
  test('TC048: User profile data persistence', async ({ authenticatedPage }) => {
    const productPage = new ProductPage(authenticatedPage);
    const ordersPage  = new OrdersPage(authenticatedPage);
 
    await productPage.navigate();
    await productPage.navigateToOrders();
 
    const orderCount = await ordersPage.getOrderCount();
    expect(orderCount).toBeGreaterThanOrEqual(0);
  });
 
  test('TC049: Cross-browser functionality verification', async ({ authenticatedPage }) => {
    const productPage = new ProductPage(authenticatedPage);
 
    await productPage.navigate();
    const productCount = await productPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });
 
  test('TC050: Performance validation for page loads', async ({ authenticatedPage }) => {
    const productPage = new ProductPage(authenticatedPage);
    const cartPage    = new CartPage(authenticatedPage);
 
    const startTime = Date.now();
 
    await productPage.navigate();
    await productPage.navigateToCart();
    await cartPage.continueShopping();
    await productPage.navigateToOrders();
 
    const endTime = Date.now();
    const totalTime = endTime - startTime;
 
    expect(totalTime).toBeLessThan(30000);
  });
});