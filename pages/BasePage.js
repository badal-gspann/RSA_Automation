export class BasePage {
    constructor(page) {
        this.page = page;
        this.baseURL = 'https://rahulshettyacademy.com/client';
        this.timeout = 30000;
    }

    async navigateTo(url) {
        const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
        await this.page.goto(fullUrl, { 
            waitUntil: 'domcontentloaded', 
            timeout: this.timeout 
        });
    }

    async click(selector) {
        await this.page.click(selector);
    }

    async fill(selector, text) {
        await this.page.fill(selector, text);
    }

    async getText(selector) {
        return await this.page.textContent(selector);
    }

    async isVisible(selector) {
        return await this.page.isVisible(selector);
    }

    async waitForSelector(selector, timeout = 15000) {
        return await this.page.waitForSelector(selector, { timeout });
    }

    async waitForTimeout(timeout) {
        await this.page.waitForTimeout(timeout);
    }

    async getCurrentUrl() {
        return this.page.url();
    }

    async getTitle() {
        return await this.page.title();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded', { timeout: 20000 });
        await this.page.waitForTimeout(2000);
    }

    async waitForNavigation(url, timeout = 15000) {
        await this.page.waitForURL(url, { timeout });
        return true;
    }
}