export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("#userEmail");
    this.passwordInput = page.locator("#userPassword");
    this.loginButton = page.locator("#login");
    this.errorMessage = page.locator('.toast-message');
    this.forgotPasswordLink = page.locator('text=Forgot password?');
    this.registerLink = page.locator('text=Register here');
    this.emailRequiredErrorMessage=page.locator('text=*Email is required')
    this.passwordRequiredErrormeaasge=page.locator('text=*Password is required')
    this.register=page.locator('text=Register here')
  }

  async navigate() {
    await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async EmptyPasswordField(email){
   await this.emailInput.fill(email);
   await this.loginButton.click();
  }

  async EmptyEmailField(password){
   await this.passwordInput.fill(password);
   await this.loginButton.click();
  }

  async RegisterPage(){
    await this.register.click();
  }
}

module.exports = { LoginPage };
