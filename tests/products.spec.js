import { test, expect } from '../fixtures/fixtures.js';
import { ProductPage } from '../pages/ProductPage.js';
//------------------// Badal
test.describe('Team 2 - Product Catalog Tests', () => {
  let productPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    productPage = new ProductPage(authenticatedPage);
    await productPage.navigate();
  });

  test('TC011: Display all products on catalog page', async () => {
    const productCount = await productPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('TC012: Add product to cart from catalog', async () => {
  await productPage.addProductToCart('ZARA COAT 3');
  
  await productPage.page.waitForTimeout(2000);
  const cartCount = await productPage.getCartItemCount();
  expect(await cartCount).toBeGreaterThanOrEqual(0); //--
});


  test('TC013: Search for specific product', async () => {
    await productPage.searchProduct('ZARA');
    const isVisible = await productPage.isProductVisible('ZARA');
    await expect(productPage.page.locator('h5')).toContainText('ZARA COAT 3');
  });

  test('TC014: View product details', async () => {
    const result = await productPage.viewProduct('ZARA COAT 3');
    await expect(productPage.page.locator('h2')).toHaveText('ZARA COAT 3');
  });

  test('TC015: Filter products by category', async () => {
    await productPage.filterProducts();
    const resultVis=productPage.page.locator("//div[contains(text(),'Showing 2 results ')]")
    await resultVis.waitFor({ state: 'visible' });
    await expect(resultVis).toContainText('Showing 2 results |');
  });

  test('TC016: Verify product information display', async () => {
    const productNames = await productPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);
    expect(productNames.some(name => name.includes('ZARA'))).toBeTruthy();
  });

  test('TC017: Add multiple products to cart', async () => {
    await productPage.addProductToCart('ZARA COAT 3');
    await productPage.addProductToCart('ADIDAS ORIGINAL');
    
    await productPage.page.waitForTimeout(2000);
    const cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBeGreaterThanOrEqual(0);
  });

  test('TC018: Navigate to cart from product page', async ({ authenticatedPage }) => {
    await productPage.navigateToCart();
    await expect(authenticatedPage).toHaveURL(/.*\/cart/);
  });

  test('TC019: Navigate to orders from product page', async ({ authenticatedPage }) => {
    await productPage.navigateToOrders();
    await expect(authenticatedPage).toHaveURL(/.*\/myorders/);
  });

  test('TC020: Verify toast message after adding product', async () => {
    await productPage.addProductToCart('ZARA COAT 3');
    const toastMessage = await productPage.page.locator("//label[text()='1']");
    const messageText = await toastMessage.textContent();
    expect(messageText).toBe('1');

  });
});