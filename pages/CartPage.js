import { BasePage } from './BasePage.js';
 
export class CartPage extends BasePage {
    constructor(page) {
        super(page);
        this.cartItemsSelector = '.cartWrap';
        this.cartItemTitleSelector = 'h3';
        this.cartItemPriceSelector = '.item-price';
        this.removeButtonSelector = 'button:has-text("Remove")';
        this.clearCartSelector = 'button:has-text("Clear")';
        this.continueShoppingSelector = 'button:has-text("Continue Shopping")';
        this.checkoutButtonSelector = 'button:has-text("Checkout")';
        this.totalSelector = '.totalRow h3';
        this.subtotalSelector = 'text=SUBTOTAL';
        this.emptyCartMessageSelector = 'text=No Products in Your Cart';
        this.cartUrl = '/dashboard/cart';
        this.productIdSelector = '.item-number'; 
    }
 
    async navigateToCart() {
        await this.navigateTo(this.cartUrl);
        await this.waitForPageLoad();
    }
 
    async getCartItems() {
        try {
            await this.page.waitForSelector(this.cartItemsSelector, { timeout: 10000 });
        } catch {
            await this.page.waitForSelector(this.emptyCartMessageSelector, { timeout: 10000 });
        }
       
        const emptyMessage = await this.page.locator(this.emptyCartMessageSelector).count();
        if (emptyMessage > 0) {
            return [];
        }
       
        const cartItems = await this.page.locator(this.cartItemsSelector).all();
        if (cartItems.length === 0) {
            throw new Error('Unable to determine cart status - no cart items found and no empty message');
        }
       
        const items = [];
        for (let cartItem of cartItems) {
            const titleElement = cartItem.locator(this.cartItemTitleSelector);
            const titleCount = await titleElement.count();
            if (titleCount === 0) {
                throw new Error('Cart item found but title element missing');
            }
            const title = await titleElement.textContent();
            if (!title || title.trim() === '') {
                throw new Error('Cart item found but title is empty');
            }
           
            let price = 'Price not available';
            let productId = 'ID not available';
 
            const priceElement = cartItem.locator('.text-muted:has-text("$")');
            if (await priceElement.count() > 0) {
                price = await priceElement.textContent();
            }
 
            const idElement = cartItem.locator('li:first-child');
            if (await idElement.count() > 0) {
                productId = await idElement.textContent();
            }
           
            items.push({
                title: title.trim(),
                price: price.trim(),
                productId: productId.trim(),
                element: cartItem
            });
        }
        return items;
    }
 
    async removeItem(productName) {
        const cartItems = await this.getCartItems();
        if (cartItems.length === 0) {
            throw new Error('Cannot remove item - cart is empty');
        }
        for (const item of cartItems) {
            if (item.title.toLowerCase().includes(productName.toLowerCase())) {
                const removeButton = item.element.locator(this.removeButtonSelector);
                const buttonCount = await removeButton.count();
                if (buttonCount === 0) {
                    throw new Error(`Remove button not found for product: ${item.title}`);
                }
                await removeButton.click();
                await this.waitForTimeout(3000);
                return true;
            }
        }
        throw new Error(`Product "${productName}" not found in cart for removal`);
    }
 
    async clearCart() {
        const clearButton = this.page.locator(this.clearCartSelector);
        const buttonCount = await clearButton.count();
        if (buttonCount === 0) {
            throw new Error('Clear cart button not found');
        }
        await clearButton.click();
        await this.waitForTimeout(3000);
        if (!await this.isCartEmpty()) {
            throw new Error('Cart clear failed - cart still contains items');
        }
        return true;
    }
 
    async clickContinueShopping() {
        const continueButton = this.page.locator(this.continueShoppingSelector);
        const buttonCount = await continueButton.count();
        if (buttonCount === 0) {
            await this.navigateTo('/dashboard/dash');
            await this.waitForTimeout(2000);
            return true;
        }
        await continueButton.click();
        await this.waitForTimeout(2000);
        if (!this.page.url().includes('/dashboard')) {
            throw new Error('Continue shopping navigation failed');
        }
        return true;
    }
 
    async clickCheckout() {
        const checkoutButton = this.page.locator(this.checkoutButtonSelector);
        const buttonCount = await checkoutButton.count();
        if (buttonCount === 0) {
            throw new Error('Checkout button not found - make sure there are items in cart');
        }
        await checkoutButton.click();
        await this.waitForTimeout(3000);
        if (!this.page.url().includes('/order')) {
            throw new Error(`Failed to navigate to checkout page - currently on: ${this.page.url()}`);
        }
        return true;
    }
 
    async getCartTotal() {
        const totalElement = this.page.locator('text=TOTAL').locator('..').locator('h3');
        const totalCount = await totalElement.count();
        if (totalCount === 0) {
            throw new Error('Cart total not found');
        }
        const totalText = await totalElement.textContent();
        if (!totalText || !totalText.trim()) {
            throw new Error('Cart total is empty');
        }
        return totalText.trim();
    }
 
    async getSubtotal() {
        const subtotalElement = this.page.locator('text=SUBTOTAL').locator('..').locator('h3');
        const subtotalCount = await subtotalElement.count();
        if (subtotalCount === 0) {
            throw new Error('Cart subtotal not found');
        }
        const subtotalText = await subtotalElement.textContent();
        if (!subtotalText || !subtotalText.trim()) {
            throw new Error('Cart subtotal is empty');
        }
        return subtotalText.trim();
    }
 
    async isCartEmpty() {
        const emptyMessage = await this.page.locator(this.emptyCartMessageSelector).count();
        if (emptyMessage > 0) {
            return true;
        }
        const cartItems = await this.page.locator(this.cartItemsSelector).count();
        const isEmpty = cartItems === 0;
        return isEmpty;
    }
 
    async validateCartContents() {
        const cartItems = await this.getCartItems();
        if (cartItems.length === 0) {
            return true;
        }
        for (const item of cartItems) {
            if (!item.title || item.title.trim() === '') {
                throw new Error('Cart validation failed - item with empty title found');
            }
            if (!item.price || item.price.trim() === '') {
                throw new Error(`Cart validation failed - item "${item.title}" has no price`);
            }
            if (!item.productId || item.productId.trim() === '') {
                throw new Error(`Cart validation failed - item "${item.title}" has no product ID`);
            }
        }
        return true;
    }
 
    async getCartSummary() {
        const cartItems = await this.getCartItems();
        let total = '$0';
        let subtotal = '$0';
        try {
            total = await this.getCartTotal();
        } catch (error) {
            console.log('Could not get total:', error.message);
        }
        try {
            subtotal = await this.getSubtotal();
        } catch (error) {
            console.log('Could not get subtotal:', error.message);
        }
        return {
            itemCount: cartItems.length,
            items: cartItems,
            subtotal: subtotal,
            total: total
        };
    }
}
 