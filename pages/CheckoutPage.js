//Abhinav Singh
export class CheckoutPage{
    constructor(page){
        this.page = page
        this.creditCardBtnLocator = page.getByText('Credit Card', { exact: true })
        this.paypalBtnLocator = page.getByText('Paypal')
        this.sepaBtnLocator = page.getByText('SEPA')
        this.invoiceBtnLocator = page.getByText('Invoice')
        this.creditCardTxtFldLocator = page.locator('input[type="text"]').first()
        this.expiryMonthSelector = page.getByRole('combobox').first()
        this.expiryYearSelector = page.getByRole('combobox').nth(1)
        this.cvvTxtFldLocator = page.locator('input[type="text"]').nth(1)
        this.nameONCardTxtFldLocator = page.locator('input[type="text"]').nth(2)
        this.coupounLocator = page.locator('input[name="coupon"]')
        this.validationMsg = page.getByText('* Invalid Coupon')
        this.applyBtnLocator = page.getByRole('button', { name: 'Apply Coupon' })
        this.locatorCountry = page.locator("//input[@placeholder='Select Country']"); // Input field for country
        this.countrySelector = page.locator("//button[@class='ta-item list-group-item ng-star-inserted'][1]"); // Use xpath= syntax for XPath selectors
        this.placeOrderBtnLocator = page.getByText('Place Order')
        this.orderSuccessLocator = page.getByText(' Thankyou for the order. ')
        this.shippingEmailLocator = page.locator("//label[contains(text(),'yallamilli@gmail.com')]")
        this.adidasTitleLocator = page.locator("//div[@class='item__title'][contains(text(),' ADIDAS ORIGINAL ')]")
        this.zaraTitleLocator = page.locator("//div[@class='item__title'][contains(text(),' ZARA COAT 3 ')]")
        this.checkout_adidiasLocator = page.locator("//div[@class='title'][contains(text(),'ADIDAS ORIGINAL')]")
        this.chekout_zaraLocator = page.locator("//div[@class='title'][contains(text(),'ZARA COAT 3')]")
        this.orderHistoryLinkLocator = page.locator("//label[text()=' Orders History Page ']")
        this.adidasHistoryLocator = page.locator("//td[contains(text(),'ADIDAS ORIGINAL')]").first();
        this.zaraHisotryLocator = page.locator("//td[contains(text(),'ZARA COAT 3')]").first();
    }
 
    async enterCardDetails(creditCardNo, expiryMonth, expiryYear, cvv, holderName){
        await this.creditCardTxtFldLocator.fill(creditCardNo)
        await this.expiryMonthSelector.selectOption({ value: expiryMonth })
        await this.expiryYearSelector.selectOption({ value: expiryYear })
        await this.cvvTxtFldLocator.fill(cvv)
        await this.nameONCardTxtFldLocator.fill(holderName)
    }
 
    async applyCoupon(coupon){
        await this.coupounLocator.click()
        await this.coupounLocator.fill(coupon)
        await this.applyBtnLocator.click()
    }
    async selectIndia(){
        await this.locatorCountry.click(); // Click to open the dropdown
        await this.locatorCountry.pressSequentially('Ind', { delay: 200 }) // Fill with "India"
        await this.countrySelector.click()
    }
    async placeOrder(){
        await this.placeOrderBtnLocator.click()
    }
 
    async isCreditCardSelected(){
        return await (this.creditCardBtnLocator).isVisible()
    }
 
    async isAllPaymentOptionsVisible(){
        return (
            (await this.paypalBtnLocator.isVisible()) &&
            (await this.sepaBtnLocator.isVisible()) &&
            (await this.invoiceBtnLocator.isVisible())
        )
    }
 
    async verifyShiipingInfo(email){
        return (await this.shippingEmailLocator.textContent() === email)
    }
 
    async getProductBeforeCheckout(){
        let adidas = await this.adidasTitleLocator.textContent()
        let zara = await this.zaraTitleLocator.textContent()
        return [adidas, zara]
    }
 
    async getProductAfterCheckout(){
        let adidas = await this.checkout_adidiasLocator.textContent()
        let zara = await this.chekout_zaraLocator.textContent()
        return [adidas, zara]
    }
    async clickOnOrderHistoryLink(){
        await this.orderHistoryLinkLocator.click()
    }
 
    async getOrderHistory(){
        let adidas = await this.adidasHistoryLocator.textContent()
        let zara = await this.zaraHisotryLocator.textContent()
        return [adidas, zara]
    }
}