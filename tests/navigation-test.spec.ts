import { test, expect } from '@playwright/test';
import menuItems from '../fixtures/menu.items.json';
import { NavigationPage } from '../page-objects/navigation-page';

test('Check navigation to menu items', async ({ page, isMobile }) => {
  const navigateTo = new NavigationPage(page);
  for (let i = 0; i < menuItems.length; i++) {
    console.log(`Navigate to ${menuItems[i].linkName} Page`);
    await navigateTo.CreditMonitoringPage();
    if (isMobile) {
      navigateTo.MobileMenuPage(menuItems[i].value);
    } else {
      navigateTo.DesktopBrowserMenuPage(menuItems[i].linkName);
    }
    console.log('Verify URL of each page');
    await expect(page).toHaveURL(new RegExp(menuItems[i].pageEndsWithRegex), { timeout: 20000 });
    console.log('Verify header of the menu Page');
    await expect(page.getByRole('heading', { name: menuItems[i].header })).toBeVisible({ timeout: 20000 });
    console.log('Verify the ‘User viewed Screen’ analytics events and its screenName');
    // Intercept network requests for /t endpoint
    await page.route(/.*\/v1\/t$/, async (route, request) => {
      expect(request.postDataJSON().event).toMatch(/^User interacted with element|User viewed screen$/);
      expect(request.postDataJSON().properties.screenName).toContain('Website EarnIn dotcom - ');
      await route.continue();
    });

    console.log('Here we need to hover away, so dropdown menu will dissappear and screenshot assertion will pass')
    // This triggers scrolling down to the bottom of the page
    await page.locator('#js-scroll').hover();
    // This will trigger scrolling back up
    await page.evaluate(() => window.scrollTo(0, 0));
    // Here we need to wait a little, because image is loading
    await page.waitForTimeout(2000);
    console.log('Verify a baseline snapshot image of each page');
    const image = page.locator('section').filter({ hasText: menuItems[i].img }).getByRole('img');
    await image.waitFor({ state: 'visible', timeout: 10000 });
    expect(await page.screenshot()).toMatchSnapshot(`${menuItems[i].value}.png`, { threshold: 0.5 });
  }
});
