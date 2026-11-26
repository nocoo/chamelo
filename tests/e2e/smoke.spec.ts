import { expect, test } from '@playwright/test';

test.describe('chamelo smoke', () => {
  test('renders home page, palette workbench, and liveness artifact without errors', async ({
    page,
    request,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const liveResponse = await request.get('/api/live');
    expect(liveResponse.status()).toBe(200);
    expect(await liveResponse.json()).toMatchObject({ status: 'ok', name: 'chamelo' });

    await page.goto('/');
    await expect(page).toHaveTitle(/守宫/);
    await expect(page.locator('#page-title')).toBeVisible();
    await expect(page.locator('.palette-feature')).toBeVisible();
    await expect(page.locator('.palette-feature h2')).toHaveText('敦煌华彩');
    await expect(page.locator('.color-swatch')).toHaveCount(6);
    await expect(page.locator('.browser-window')).toBeVisible();

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test('supports format switching, pagination, mode toggle, and tokens modal', async ({ page }) => {
    await page.goto('/');

    const oklchButton = page.getByRole('button', { name: 'OKLCH', exact: true });
    await oklchButton.click();
    await expect(oklchButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.color-swatch code').first()).toContainText('oklch(');

    const initialName = await page.locator('.palette-feature h2').textContent();
    await page.getByRole('button', { name: '下一套色板' }).click();
    await expect(page.locator('.palette-pagination')).toContainText('02 /');
    await expect(page.locator('.palette-feature h2')).not.toHaveText(initialName ?? '');

    const root = page.locator('.theme-root');
    const initialMode = await root.getAttribute('data-mode');
    const modeToggleLabel = initialMode === 'dark' ? '切换到浅色外观' : '切换到深色外观';
    await page.getByRole('button', { name: modeToggleLabel }).click();
    await expect(root).toHaveAttribute('data-mode', initialMode === 'dark' ? 'light' : 'dark');

    await page.getByRole('button', { name: /12 个语义色/ }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: '关闭弹窗' }).click();
    await expect(dialog).toBeHidden();
  });
});
