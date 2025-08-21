
// pages/OrdersPage.js

export class OrdersPage {
  constructor(page) {
    this.page = page;
    this.ordersTable = page.locator('tbody tr');
    this.orderIds = page.locator('tbody tr th');
    this.productNames = page.locator('tbody tr td:nth-child(2)');
    this.orderDates = page.locator('tbody tr td:nth-child(3)');
    this.orderPrices = page.locator('tbody tr td:nth-child(4)');
    this.orderStatuses = page.locator('tbody tr td:nth-child(5)');
    this.viewButtons = page.locator('tbody tr td button');
    this.deleteButtons = page.locator('tbody tr td .btn-danger');
    this.noOrdersMessage = page.locator('text=You have No Orders to show at this time.');
    this.backToShopButton = page.locator('text=Go Back to Shop');
    this.homeLink = page.locator('[routerlink="/dashboard/dash"]');
    this.cartLink = page.locator('[routerlink="/dashboard/cart"]');
  }

  async navigate() {
    await this.page.goto('https://rahulshettyacademy.com/client/#/dashboard/myorders');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('tbody', { timeout: 5000 });
    await this.page.waitForTimeout(1000);
  }

  async getOrderCount() {
    try {
      await this.page.waitForSelector('tbody tr', { timeout: 5000 });
      return await this.ordersTable.count();
    } catch {
      return 0;
    }
  }

  async getOrderIds() {
    if (await this.getOrderCount() === 0) return [];
    return await this.orderIds.allTextContents();
  }

  async getOrderDetails() {
    const count = await this.getOrderCount();
    if (count === 0) return [];

    const orders = [];
    for (let i = 0; i < count; i++) {
      try {
        const order = {
          id: (await this.orderIds.nth(i).textContent()).trim(),
          product: (await this.productNames.nth(i).textContent()).trim(),
          date: (await this.orderDates.nth(i).textContent()).trim(),
          price: (await this.orderPrices.nth(i).textContent()).trim(),
          status: (await this.orderStatuses.nth(i).textContent()).trim()
        };
        orders.push(order);
      } catch (error) {
        console.log('Error getting order details:', error.message);
      }
    }
    return orders;
  }

  async viewOrder(orderId) {
    const count = await this.getOrderCount();
    for (let i = 0; i < count; i++) {
      try {
        const id = (await this.orderIds.nth(i).textContent()).trim();
        if (id === orderId) {
          await this.viewButtons.nth(i).click();
          await this.page.waitForTimeout(2000);
          return true;
        }
      } catch (error) {
        console.log('Error viewing order:', error.message);
      }
    }
    return false;
  }

  async deleteOrder(orderId) {
    const count = await this.getOrderCount();
    for (let i = 0; i < count; i++) {
      try {
        const id = (await this.orderIds.nth(i).textContent()).trim();
        if (id === orderId) {
          await this.deleteButtons.nth(i).click();
          await this.page.waitForTimeout(2000);
          return true;
        }
      } catch (error) {
        console.log('Error deleting order:', error.message);
      }
    }
    return false;
  }

  async hasOrders() {
    const count = await this.getOrderCount();
    return count > 0;
  }

  async isOrderPresent(orderId) {
    const orderIds = await this.getOrderIds();
    return orderIds.some(id => id && id.trim() === orderId);
  }

  async goBackToShop() {
    try {
      await Promise.all([
        this.page.waitForURL('**/dashboard/dash'),
        this.backToShopButton.click()
      ]);
    } catch (error) {
      await this.page.goto('https://rahulshettyacademy.com/client/#/dashboard/dash');
    }
  }

  async navigateToHome() {
    await Promise.all([
      this.page.waitForURL('**/dashboard/dash'),
      this.homeLink.click()
    ]);
  }

  async navigateToCart() {
    await Promise.all([
      this.page.waitForURL('**/dashboard/cart'),
      this.cartLink.click()
    ]);
  }

  async getLatestOrder() {
    const orders = await this.getOrderDetails();
    return orders.length > 0 ? orders[0] : null;
  }

  async searchOrderByProduct(productName) {
    const rows = await this.page.locator('table tbody tr').all();
    for (const row of rows) {
      const nameCell = row.locator('td').nth(1);
      if (await nameCell.isVisible()) {
        const nameText = (await nameCell.textContent()).trim().toLowerCase();
        const targetName = productName.trim().toLowerCase();
        if (nameText.includes(targetName)) {
          return true;
        }
      }
    }
    return false;
  }
}
