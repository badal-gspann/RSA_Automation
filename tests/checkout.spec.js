import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Page', () => {
    let loginPage;
    let cartPage;


    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        cartPage = new CartPage(page);

        // Login and add items to the cart
        await loginPage.navigate();
        await loginPage.login('yallamilli@gmail.com', 'Satya@007');
        await cartPage.addFirstItemToCart();
        await cartPage.addMultipleItems();
        await cartPage.clickOnCartButton();
        await cartPage.clickOnCheckOutButton();
    });

    
    test('Verifying Credit Card Payment Method', async ({ page }) => {
        let checkoutPage = new CheckoutPage(page);
        expect(await checkoutPage.isCreditCardSelected()).toBeTruthy();
    });


    test('Verifying all payment options are visible', async ({ page }) => {
        let checkoutPage = new CheckoutPage(page);
        expect(await checkoutPage.isAllPaymentOptionsVisible()).toBeTruthy();
    });


    test('isOrderPlaced', async ({ page }) => {
        let checkoutPage = new CheckoutPage(page);
        await checkoutPage.enterCardDetails('1234567890123456', '11', '15', '123', 'Abhinav Singh');
        await checkoutPage.selectIndia();
        await checkoutPage.placeOrder();
        expect(await checkoutPage.orderSuccessLocator.isVisible())
    });


    test('verify userinfo in shipping', async ({ page }) => {
        let checkoutPage = new CheckoutPage(page);
        expect(await checkoutPage.verifyShiipingInfo('yallamilli@gmail.com')).toBeTruthy();
    });


    test('validating coupon', async ({ page }) => {
        let checkoutPage = new CheckoutPage(page);
        await checkoutPage.applyCoupon('ZING100')
        expect(await checkoutPage.validationMsg.isVisible())
    })


    test('verfying products', async ({ page }) => {
        let checkoutPage = new CheckoutPage(page);
        let productbefore = await checkoutPage.getProductBeforeCheckout();
        await checkoutPage.selectIndia();
        await checkoutPage.placeOrder();
        let productAfter = await checkoutPage.getProductAfterCheckout();

        let productBeforeMod = productbefore[0].trim();
        let productAfterMod = productAfter[0].trim();

        expect(productBeforeMod).toBe(productAfterMod);
    })

    test('verifying order history',async({page})=>{
        let checkoutPage = new CheckoutPage(page);
        let productAtCheckout = await checkoutPage.getProductAfterCheckout()
        await checkoutPage.selectIndia();
        await checkoutPage.placeOrder();
        await checkoutPage.clickOnOrderHistoryLink()
        let productOnHistory = await checkoutPage.getOrderHistory()

        let adidasAtCheckout = productAtCheckout[0].trim();
        let adidasAtHistory = productOnHistory[0].trim();

        expect(adidasAtCheckout).toBe(adidasAtHistory)


    })









});
