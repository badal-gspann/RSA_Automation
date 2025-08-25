//Abhinav Singh
import { test, expect } from '../fixtures/fixtures.js';
test.describe('Checkout Page', () => {
    test.beforeEach(async ({ authenticatedPage, cartPage }) => {
        await cartPage.addFirstItemToCart();
        await cartPage.addMultipleItems();
        await cartPage.clickOnCartButton();
        await cartPage.clickOnCheckOutButton();
    });
 
    test('Verifying Credit Card Payment Method', async ({ checkoutPage }) => {
        expect(await checkoutPage.isCreditCardSelected()).toBeTruthy();
    });
 
    test('Verifying all payment options are visible', async ({ checkoutPage }) => {
        expect(await checkoutPage.isAllPaymentOptionsVisible()).toBeTruthy();
    });
 
    test('Verifying isOrderPlaced', async ({ checkoutPage }) => {
        await checkoutPage.enterCardDetails('1234567890123456', '11', '15', '123', 'Abhinav Singh');
        await checkoutPage.selectIndia();
        await checkoutPage.placeOrder();
        expect(await checkoutPage.orderSuccessLocator.isVisible())
    });
 
    test('Verifying userinfo in shipping', async ({ checkoutPage }) => {
        expect(await checkoutPage.verifyShiipingInfo('yallamilli@gmail.com')).toBeTruthy();
    });
 
    test('Verifying coupon', async ({ checkoutPage }) => {
        await checkoutPage.applyCoupon('ZING100')
        expect(await checkoutPage.validationMsg.isVisible())
    })
 
    test('Verfying products', async ({ checkoutPage }) => {
        let productbefore = await checkoutPage.getProductBeforeCheckout();
        await checkoutPage.selectIndia();
        await checkoutPage.placeOrder();
        let productAfter = await checkoutPage.getProductAfterCheckout();
        let productBeforeMod = productbefore[0].trim();
        let productAfterMod = productAfter[0].trim();
        expect(productBeforeMod).toBe(productAfterMod);
    })
 
    test('verifying order history', async ({ checkoutPage }) => {
        await checkoutPage.selectIndia();
        await checkoutPage.placeOrder();
        let productAtCheckout = await checkoutPage.getProductAfterCheckout()
        await checkoutPage.clickOnOrderHistoryLink()
        let productOnHistory = await checkoutPage.getOrderHistory()
        let adidasAtCheckout = productAtCheckout[0].trim();
        let adidasAtHistory = productOnHistory[0].trim();
        expect(adidasAtCheckout).toBe(adidasAtHistory)
    })
});