const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Login Functionality - POM', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Valid login redirects to dashboard', async ({ page }) => {
    await loginPage.login('yallamilli@gmail.com', 'Satya@007');
    await page.waitForURL('https://rahulshettyacademy.com/client/#/dashboard/dash');
    await expect(page.url()).toContain('dashboard');
  });

  test('Invalid email shows error', async () => {
    await loginPage.login('Satya@gmail.com', 'Satya@007');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Invalid password shows error', async () => {
    await loginPage.login('yallamilli@gmail.com', 'Satya@7');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Invalid email format shows error', async () => {
    await loginPage.login('user@com', 'somePassword');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Forgot password link navigates correctly', async ({ page }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/.*\/password-new/);
  });

  test('Register link navigates correctly', async ({ page }) => {
    await loginPage.clickRegisterLink();
    await expect(page).toHaveURL(/.*\/register/);
  });

  test('Enter only password Field',async ({page})=>{
    await loginPage.EmptyEmailField('Satya@007');
    await expect(loginPage.emailRequiredErrorMessage).toBeVisible();

  })
  test('Enter email Field only',async({page})=>{
    await loginPage.EmptyPasswordField('yallamilli@gmail.com');
    //await page.waitForSelector('text=*Password is required');
    await expect(loginPage.passwordRequiredErrormeaasge).toBeVisible();

  })
  test('Click on register',async ({page})=>{
    await loginPage.RegisterPage();
    await expect(page).toHaveURL(/.*\/register/);
  })

});
