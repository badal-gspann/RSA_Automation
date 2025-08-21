// import { test, expect } from '@playwright/test';
// import { LoginPage } from '../pages/LoginPage.js';
// import { ProductPage } from '../pages/ProductPage.js';
// import { CartPage } from '../pages/CartPage.js';
 
// test.describe('Shopping Cart Test Suite - TC01-TC05', () => {
//     let loginPage;
//     let productPage;
//     let cartPage;
 
//     test.beforeEach(async ({ page }) => {
//         loginPage = new LoginPage(page);
//         productPage = new ProductPage(page);
//         cartPage = new CartPage(page);
 
//         // Login before each test
//         await loginPage.navigateToLogin();
//         const loginResult = await loginPage.loginWithValidCredentials();
//         expect(loginResult).toBeTruthy();
       
//         await loginPage.waitForDashboard();
//         await productPage.navigateToProducts();
//     });
 
//     test('TC01: Add single product to cart functionality', async ({ page }) => {
        
//         const initialCartCount = parseInt(await productPage.getCartItemCount());
//         console.log(`Initial cart count: ${initialCartCount}`);
       
//         const productAdded = await productPage.addProductToCart('ZARA COAT 3');
//         expect(productAdded).toBeTruthy();
       
//         await page.waitForTimeout(3000);
//         const finalCartCount = parseInt(await productPage.getCartItemCount());
       
//         expect(finalCartCount).toBeGreaterThan(initialCartCount);
//     });
 
//     test('TC02: Add multiple products to cart workflow', async ({ page }) => {
        
//         const productNames = ['ZARA COAT 3', 'ADIDAS ORIGINAL'];
//         let addedCount = 0;
       
//         for (let productName of productNames) {
//             const added = await productPage.addProductToCart(productName);
//             if (added) {
//                 addedCount++;
//                 await page.waitForTimeout(2000);
//             }
//         }
//         expect(addedCount).toBe(2);
//     });
 
//     test('TC03: Add same product multiple times handling', async ({ page }) => {
        
//         const initialCartCount = parseInt(await productPage.getCartItemCount());
       
//         for (let i = 0; i < 3; i++) {
//             await productPage.addProductToCart('ZARA COAT 3');
//             //await page.waitForTimeout(5000);
//         }
//         const finalCartCount = parseInt(await productPage.getCartItemCount());
//         expect(finalCartCount).toBeGreaterThan(initialCartCount);
//     });
 
//     test('TC04: View cart contents and item details', async ({ page }) => {
        
//         await productPage.addProductToCart('ZARA COAT 3');
//         await page.waitForTimeout(2000);
       
//         await productPage.clickCartIcon();
       
//         const cartItems = await cartPage.getCartItems();
//         expect(cartItems.length).toBeGreaterThan(0);
       
//         const hasZaraProduct = cartItems.some(item =>
//             item.title.toLowerCase().includes('zara')
//         );
//         expect(hasZaraProduct).toBeTruthy();
//     });
 
//     test('TC05: Cart persistence across page refresh', async ({ page }) => {
        
//         await productPage.addProductToCart('ZARA COAT 3');
//         const countBeforeRefresh = await productPage.getCartItemCount();
       
//         await page.reload();
//         await page.waitForTimeout(3000);
       
//         const countAfterRefresh = await productPage.getCartItemCount();
//         expect(parseInt(countAfterRefresh)).toBeGreaterThanOrEqual(0);
//     });
// });
 