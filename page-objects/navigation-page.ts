import { Page } from "@playwright/test"

export class NavigationPage {

    readonly page: Page

    constructor(p: Page) {
        this.page = p
    }

    async CreditMonitoringPage() {
        await this.page.goto('/products/credit-monitoring', { waitUntil: 'domcontentloaded' });
    }

    async MobileMenuPage(pageName: string) {
        await this.page.click('div[data-testid="toggle-nav"]');
        await this.page.click('span[data-testid="whoweare-expander"]');
        await this.page.locator(`a[href='/${pageName}'][class='nav-link']`).click();
    }

    async DesktopBrowserMenuPage(pageName: string) {
        await this.page.getByRole('link', { name: 'Who We Are' }).hover();
        await this.page.getByLabel('Main Navigation').getByRole('link', { name: pageName }).click();
    }

}