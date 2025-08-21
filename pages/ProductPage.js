// pages/ProductPage.js

export class ProductPage {
  constructor(page) {
    this.page = page;
    this.cards = page.locator('.card-body');
    this.cartIcon = page.locator('button[routerlink*="cart"]');
    this.toastMessage = page.locator('#toast-container');
    this.searchInput = page.getByRole('textbox', { name: 'search' })
    this.filterSelect = page.locator("//div[@class='py-2 border-bottom ml-3 p-4']//label[text()='fashion']/preceding-sibling::input[@type='checkbox']");
    this.ordersLink = page.locator('[routerlink="/dashboard/myorders"]');
    this.signOutButton = page.locator('text=Sign Out');
    this.cartIcon = page.locator('button[routerlink*="cart"]');
    //this.showingfilterReport=page.locator("//div[contains(text(),'Showing 2 results ')]")
    
  }

  
  async navigate() {
    await this.page.goto('https://rahulshettyacademy.com/client/#/dashboard/dash');
    await this.page.waitForLoadState('networkidle');
  }

  async getProductCount() {
    await this.page.waitForSelector('.card-body', { timeout: 10000 });
    return await this.cards.count();
  }

  async getProductNames() {
    await this.page.waitForSelector('.card-body b', { timeout: 10000 });
    return await this.cards.locator('b').allTextContents();
  }

  async addProductToCart(productName) {
    const count = await this.cards.count();
    for (let i = 0; i < count; i++) {
      const card = this.cards.nth(i);
      const title = (await card.locator('b').textContent()).trim();
      if (title === productName) {
        await card.locator('button:text("Add To Cart")').click();
        await this.page.waitForSelector('#toast-container', { timeout: 10000 });
        return;
      }
    }
    throw new Error(`Product "${productName}" not found`);
  }

  async searchProduct(productName) {
    await this.searchInput.fill("ZARA COAT 3");
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(3000);
  }

  async filterProducts() {
  const checkbox = this.page.locator('#sidebar div').filter({ hasText: /^fashion$/ }).getByRole('checkbox');
  await checkbox.check();
  await this.page.waitForTimeout(2000);
}

async navigateToCart() {
  await Promise.all([
    this.page.waitForURL('**/dashboard/cart', { timeout: 20000 }),
    this.cartIcon.click()
  ]);
}


async navigateToOrders() {
  await Promise.all([
    this.page.waitForURL('**/dashboard/myorders', { timeout: 20000 }),
    this.ordersLink.click()
  ]);
}


  async getCartItemCount() {
    const badge = this.page.locator('.cart-badge');
    if (await badge.isVisible()) {
      return parseInt(await badge.textContent()) || 0;
    }
    return 0;
  }

  async goToCart() {
    await Promise.all([
      this.page.waitForURL('**/dashboard/cart', { timeout: 20000 }),
      this.cartIcon.click()
    ]);
  }

  async goToOrders() {
    await Promise.all([
      this.page.waitForURL('**/dashboard/myorders', { timeout: 20000 }),
      this.ordersLink.click()
    ]);
  }

  async viewProduct(productName) {
    const count = await this.cards.count();
    for (let i = 0; i < count; i++) {
      const card = this.cards.nth(i);
      const title = (await card.locator('b').textContent()).trim();
      if (title === productName) {
        await card.locator('button:text("View")').click();
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }
    throw new Error(`Product "${productName}" not found for view`);
  }

  async getToastMessage() {
    await this.page.waitForSelector('#toast-container', { timeout: 10000 });
    return await this.toastMessage.textContent();
  }

  async logout() {
    await this.signOutButton.click();
    await this.page.waitForURL('**/auth/login', { timeout: 20000 });
  }

  async isProductVisible(productName) {
    const names = await this.getProductNames();
    return names.includes(productName);
  }
}
