import { test, expect, type Page } from '@playwright/test'

/** Seed the watchlist (bond ids) into localStorage before the app boots. */
async function seedWatchlist(page: Page, ids: number[]) {
  await page.addInitScript((saved) => {
    localStorage.setItem('hb-watchlist', JSON.stringify(saved))
  }, ids)
}

test.describe('Bond watchlist', () => {
  test('renders saved bonds and their availability', async ({ page }) => {
    await seedWatchlist(page, [1, 2])
    await page.goto('/watchlist')

    await expect(page.getByRole('heading', { name: 'Your watchlist' })).toBeVisible()
    await expect(page.getByText('Sokoto community solar')).toBeVisible()
    await expect(page.getByText('Ría de Vigo tidal array')).toBeVisible()
    await expect(page.getByText('Open for funding', { exact: true })).toBeVisible()
    await expect(page.getByText('Not yet available', { exact: true })).toBeVisible()
    await expect(page.getByText(/saved bond is open for funding right now/i)).toBeVisible()
  })

  test('shows the empty state with no saved bonds', async ({ page }) => {
    await page.goto('/watchlist')
    await expect(page.getByText('Nothing saved yet')).toBeVisible()
  })

  test('saving from Explore persists across a reload', async ({ page }) => {
    await page.goto('/explore')

    const firstStar = page.getByRole('button', { name: /add .* to watchlist/i }).first()
    await firstStar.click()

    // toast confirms, and the control flips to a remove affordance
    await expect(page.getByText('Added to watchlist')).toBeVisible()
    await expect(
      page.getByRole('button', { name: /remove .* from watchlist/i }).first(),
    ).toBeVisible()

    await page.reload()
    await expect(
      page.getByRole('button', { name: /remove .* from watchlist/i }).first(),
    ).toBeVisible()
  })
})
