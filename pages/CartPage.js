export class CartPage {

    constructor(page) {
        this.page = page;
        this.firstItemCartButton = page.locator('//button[@class="btn w-10 rounded"]').first();
        this.secondItemCartButton = page.getByRole('button', { name: 'Add To Cart' }).nth(1);
        //page.locator('//button[@class="btn w-10 rounded"]').nth(1);
        this.cartCount = page.locator('button[routerlink="/dashboard/cart"] label');
        this.cartButton = page.locator('[routerlink="/dashboard/cart"]');
        this.signOutButton = page.locator("//button[contains(text(),'Sign Out')]");
        this.continueShoppingButton = page.locator("//button[contains(text(),'Continue Shopping')]");
        this.buyNowButton = page.locator(".cartSection button.btn-primary").first();
        this.checkOutButton = page.getByRole('button', { name: 'Checkout' });
        this.paymentMethodText = page.locator("//div[text()=' Payment Method ']");
        this.deleteButton = page.locator("button.btn.btn-danger");
        this.noProductsText = page.locator("//h1[@style='color: lightgray;']");
        this.cartItems = page.locator("div.cartSection");

    }
    async addFirstItemToCart() {
        await this.firstItemCartButton.click();
    }

    async addMultipleItems() {
        await this.secondItemCartButton.click();
    }

    async clickOnCartButton() {
        await this.cartButton.click();
    }
    async clickOnSignOutButton() {
        await this.signOutButton.click();
    }

    async clickOnCheckOutButton() {
        await this.checkOutButton.click()
    }

    async clickOnDeleteButton() {
        await this.deleteButton.click()
    }

    async clickOnContinueButton() {
       await this.continueShoppingButton.click()
    }
}