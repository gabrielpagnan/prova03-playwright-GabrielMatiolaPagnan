import type { Page } from '@playwright/test';

export default class SauceDemoPage {
  constructor(private readonly page: Page) {}

  async login(username: string): Promise<void> {
    // Credencial pública da aplicação de demonstração, sem conta real.
    await this.page
      .getByPlaceholder('Username', { exact: true })
      .fill(username);
    await this.page
      .getByPlaceholder('Password', { exact: true })
      .fill('secret_sauce');
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  }
}
