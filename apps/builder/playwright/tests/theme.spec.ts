import test, { expect } from '@playwright/test'
import path from 'path'
import { importTypebotInDatabase } from '../services/database'
import { typebotViewer } from '../services/selectorUtils'

test.describe.parallel('Theme page', () => {
  test.describe('General', () => {
    test('should reflect change in real-time', async ({ page }) => {
      const typebotId = 'general-theme-typebot'
      const chatContainer = typebotViewer(page).locator(
        '[data-testid="container"]'
      )
      await importTypebotInDatabase(
        path.join(__dirname, '../fixtures/typebots/theme.json'),
        {
          id: typebotId,
        }
      )
      await page.goto(`/typebots/${typebotId}/theme`)
      await page.click('button:has-text("General")')

      // Font
      await page.fill('input[type="text"]', 'Roboto Slab')
      await expect(chatContainer).toHaveCSS('font-family', '"Roboto Slab"')

      // BG color
      await expect(chatContainer).toHaveCSS(
        'background-color',
        'rgba(0, 0, 0, 0)'
      )
      await page.click('text=Color')
      await page.click('[aria-label="Pick a color"]')
      await page.fill('[aria-label="Color value"]', '#2a9d8f')
      await expect(chatContainer).toHaveCSS(
        'background-color',
        'rgb(42, 157, 143)'
      )
    })
  })

  test.describe('Chat', () => {
    test('should reflect change in real-time', async ({ page }) => {
      const typebotId = 'chat-theme-typebot'
      await importTypebotInDatabase(
        path.join(__dirname, '../fixtures/typebots/theme.json'),
        {
          id: typebotId,
        }
      )
      await page.goto(`/typebots/${typebotId}/theme`)
      await page.click('button:has-text("Chat")')

      // Host bubbles
      await page.click(':nth-match([aria-label="Pick a color"], 1)')
      await page.fill('[aria-label="Color value"]', '#2a9d8f')
      await page.click(':nth-match([aria-label="Pick a color"], 2)')
      await page.fill('[aria-label="Color value"]', '#ffffff')
      const hostBubble = typebotViewer(page).locator(
        '[data-testid="host-bubble"]'
      )
      await expect(hostBubble).toHaveCSS(
        'background-color',
        'rgb(42, 157, 143)'
      )
      await expect(hostBubble).toHaveCSS('color', 'rgb(255, 255, 255)')

      // Buttons
      await page.click(':nth-match([aria-label="Pick a color"], 5)')
      await page.fill('[aria-label="Color value"]', '#7209b7')
      await page.click(':nth-match([aria-label="Pick a color"], 6)')
      await page.fill('[aria-label="Color value"]', '#e9c46a')
      const button = typebotViewer(page).locator('[data-testid="button"]')
      await expect(button).toHaveCSS('background-color', 'rgb(114, 9, 183)')
      await expect(button).toHaveCSS('color', 'rgb(233, 196, 106)')

      // Guest bubbles
      await page.click(':nth-match([aria-label="Pick a color"], 3)')
      await page.fill('[aria-label="Color value"]', '#d8f3dc')
      await page.click(':nth-match([aria-label="Pick a color"], 4)')
      await page.fill('[aria-label="Color value"]', '#264653')
      await typebotViewer(page).locator('text=Go').click()
      const guestBubble = typebotViewer(page).locator(
        '[data-testid="guest-bubble"]'
      )
      await expect(guestBubble).toHaveCSS(
        'background-color',
        'rgb(216, 243, 220)'
      )
      await expect(guestBubble).toHaveCSS('color', 'rgb(38, 70, 83)')

      // Input
      await page.click(':nth-match([aria-label="Pick a color"], 7)')
      await page.fill('[aria-label="Color value"]', '#ffe8d6')
      await page.click(':nth-match([aria-label="Pick a color"], 8)')
      await page.fill('[aria-label="Color value"]', '#023e8a')
      await typebotViewer(page).locator('text=Go').click()
      const input = typebotViewer(page).locator('.typebot-input')
      await expect(input).toHaveCSS('background-color', 'rgb(255, 232, 214)')
      await expect(input).toHaveCSS('color', 'rgb(2, 62, 138)')
    })
  })

  test.describe('Custom CSS', () => {
    test('should reflect change in real-time', async ({ page }) => {
      const typebotId = 'custom-css-theme-typebot'
      await importTypebotInDatabase(
        path.join(__dirname, '../fixtures/typebots/theme.json'),
        {
          id: typebotId,
        }
      )
      await page.goto(`/typebots/${typebotId}/theme`)
      await page.click('button:has-text("Custom CSS")')
      await page.fill(
        'div[role="textbox"]',
        '.typebot-button {background-color: green}'
      )
      await expect(
        typebotViewer(page).locator('[data-testid="button"]')
      ).toHaveCSS('background-color', 'rgb(0, 128, 0)')
    })
  })
})
