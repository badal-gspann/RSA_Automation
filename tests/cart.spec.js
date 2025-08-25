import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
//import { ProductPage } from '../pages/ProductPage.js';
import { CartPage } from '../pages/CartPage.js';
//------------------// Bhuvaneshwari
test.describe('Shopping Cart Test Suite - TC01-TC10', () => {
    let loginPage;
    //let productPage;
    let cartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        //productPage = new ProductPage(page);
        cartPage = new CartPage(page);

        await loginPage.navigate();
        await loginPage.login('yallamilli@gmail.com', 'Satya@007');
        await page.waitForURL('https://rahulshettyacademy.com/client/#/dashboard/dash');

    })

    test.afterEach(async ({ page }) => {
        cartPage = new CartPage(page);
        await cartPage.clickOnSignOutButton();

    })
    test('TC01: Add single product to cart functionality', async ({ page }) => {
        await cartPage.addFirstItemToCart();
        await expect(cartPage.cartCount).toHaveCount(1)
        
    });

    test('TC02: Add multiple products to cart workflow', async ({ page }) => {
        await cartPage.addFirstItemToCart();
        await cartPage.addMultipleItems();
        await expect(cartPage.cartCount).toHaveText('2');
        
    });

    test('TC03: Cart persistence after page refresh', async ({ page }) => {
        await cartPage.addFirstItemToCart();
        await page.reload();
        await expect(cartPage.cartCount).toHaveCount(1);

    })

    test('TC04: Validation of cart page based on URL', async ({ page }) => {
        await cartPage.clickOnCartButton();
        await expect(page).toHaveURL(/.*dashboard\/cart.*/);
    })

    test('TC05: Verify the continue shopping button', async ({ page }) => {
        await cartPage.clickOnCartButton();
        await expect(cartPage.continueShoppingButton).toHaveText("Continue Shopping");
    })

    test('TC06: Validate the cart product', async ({ page }) => {
        await cartPage.addFirstItemToCart();
        await cartPage.clickOnCartButton();
        await expect(cartPage.buyNowButton).toHaveText("Buy Now");  

    })

    test('TC07: Validate the checkout page', async ({ page }) => {
        await cartPage.addMultipleItems();
        await cartPage.clickOnCartButton();
        await cartPage.clickOnCheckOutButton();
        await expect(cartPage.paymentMethodText).toContainText("Payment Method");
          
    })

    test('TC08: Visibility of delete button', async ({ page }) => {
        await cartPage.addFirstItemToCart();
        await cartPage.clickOnCartButton();
        await expect(cartPage.cartItems.first()).toBeVisible();
    })

    test('TC09: validate delete item', async ({ page }) => {
        await cartPage.addFirstItemToCart();
        await cartPage.clickOnCartButton();
        await cartPage.clickOnDeleteButton();
        await expect(cartPage.noProductsText).toHaveText('No Products in Your Cart !');
    })

    test('TC10: Validate home page after clicking continue shopping', async ({ page }) => {
        await cartPage.addFirstItemToCart();
        await cartPage.clickOnCartButton();
        await cartPage.clickOnContinueButton();
        await expect(page).toHaveURL(/.*dashboard\/dash.*/);
    })

})