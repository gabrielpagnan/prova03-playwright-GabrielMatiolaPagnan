import { expect, test } from '@playwright/test';
import SauceDemoPage from '../support/pages/SauceDemoPage';

test.describe('SauceDemo — loja de demonstração', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('CT01 — deve autenticar um usuário válido e exibir o catálogo', async ({
    page
  }) => {
    await new SauceDemoPage(page).login('standard_user');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });

  test('CT02 — deve impedir o acesso de um usuário bloqueado', async ({
    page
  }) => {
    await new SauceDemoPage(page).login('locked_out_user');

    await expect(page.getByTestId('error')).toContainText(
      'Sorry, this user has been locked out.'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(
      page.getByRole('button', { name: 'Login', exact: true })
    ).toBeVisible();
    await expect(page.getByTestId('inventory-list')).toHaveCount(0);
  });

  test('CT03 — deve concluir uma compra com o produto e os valores corretos', async ({
    page
  }) => {
    await new SauceDemoPage(page).login('standard_user');
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    await page.getByTestId('shopping-cart-link').click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByTestId('inventory-item')).toHaveCount(1);
    await expect(page.getByTestId('inventory-item-name')).toHaveText(
      'Sauce Labs Backpack'
    );
    await expect(page.getByTestId('inventory-item-price')).toHaveText('$29.99');
    await expect(page.getByTestId('item-quantity')).toHaveText('1');
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await page.getByPlaceholder('First Name', { exact: true }).fill('Teste');
    await page
      .getByPlaceholder('Last Name', { exact: true })
      .fill('Automatizado');
    await page
      .getByPlaceholder('Zip/Postal Code', { exact: true })
      .fill('00000');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText(
      'Sauce Labs Backpack'
    );
    await expect(page.getByTestId('item-quantity')).toHaveText('1');
    await expect(page.getByTestId('subtotal-label')).toHaveText(
      'Item total: $29.99'
    );
    await expect(page.getByTestId('tax-label')).toHaveText('Tax: $2.40');
    await expect(page.getByTestId('total-label')).toHaveText('Total: $32.39');
    await page.getByRole('button', { name: 'Finish', exact: true }).click();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(
      page.getByRole('heading', {
        name: 'Thank you for your order!',
        exact: true
      })
    ).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
    await page.getByRole('button', { name: 'Back Home', exact: true }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });
});
