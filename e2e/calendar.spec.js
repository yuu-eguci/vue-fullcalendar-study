import { expect, test } from '@playwright/test'

// リソースの行で、 fromHour 時から toHour 時まで横にドラッグして選択します。
// 行の要素は 0 時から 24 時まで (スクロールで隠れている部分も含めて) の幅を持ちます。
async function selectOnLane(page, resourceId, fromHour, toHour) {
  const lane = page.locator(`.fc-timeline-lane[data-resource-id="${resourceId}"]`)
  const box = await lane.boundingBox()
  const xAt = hour => box.x + (box.width * hour) / 24
  const y = box.y + box.height / 2
  await page.mouse.move(xAt(fromHour) + 1, y)
  await page.mouse.down()
  await page.mouse.move(xAt(toHour) - 1, y, { steps: 10 })
  await page.mouse.up()
}

test.beforeEach(async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('.fc-resource-timeline')).toBeVisible()
})

test('リソースと "希望のシフト" (background event) を表示します', async ({ page }) => {
  await expect(page.getByText('砂川文次')).toBeVisible()
  await expect(page.getByText('石沢麻依')).toBeVisible()
  await expect(page.getByText('李琴峰')).toBeVisible()
  await expect(page.locator('.fc-bg-event')).toHaveCount(3)
})

test('何もないところをドラッグすると "実績" イベントを追加し、クリックで削除できます', async ({ page }) => {
  await selectOnLane(page, '1', 17, 18)
  const event = page.locator('.fc-timeline-event', { hasText: '実績' })
  await expect(event).toHaveCount(1)

  page.once('dialog', dialog => dialog.accept())
  await event.click()
  await expect(event).toHaveCount(0)
})

test('画面上で動かしたイベントは、別のイベントを追加しても元に戻りません', async ({ page }) => {
  await selectOnLane(page, '1', 17, 18)
  const lane = page.locator('.fc-timeline-lane[data-resource-id="1"]')
  // ドラッグ中に表示される mirror は除きます。
  const moved = lane.locator('.fc-timeline-event:not(.fc-event-mirror)', { hasText: '実績' })
  const before = await moved.boundingBox()
  const hourWidth = (await lane.boundingBox()).width / 24

  // 1 時間ぶん右へドラッグします。
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2)
  await page.mouse.down()
  await page.mouse.move(before.x + before.width / 2 + hourWidth, before.y + before.height / 2, { steps: 10 })
  await page.mouse.up()
  await expect.poll(async () => (await moved.boundingBox()).x).toBeCloseTo(before.x + hourWidth, 0)

  await selectOnLane(page, '2', 17, 18)
  await expect(page.locator('.fc-timeline-event', { hasText: '実績' })).toHaveCount(2)
  expect((await moved.boundingBox()).x).toBeCloseTo(before.x + hourWidth, 0)
})

test('削除の確認でキャンセルすると、イベントは残ります', async ({ page }) => {
  await selectOnLane(page, '2', 17, 18)
  const event = page.locator('.fc-timeline-event', { hasText: '実績' })
  await expect(event).toHaveCount(1)

  page.once('dialog', dialog => dialog.dismiss())
  await event.click()
  await expect(event).toHaveCount(1)
})

test('background event はクリックしても削除の確認を出しません', async ({ page }) => {
  let dialogShown = false
  page.on('dialog', dialog => {
    dialogShown = true
    dialog.dismiss()
  })
  await page.locator('.fc-bg-event').first().click()
  await expect(page.locator('.fc-bg-event')).toHaveCount(3)
  expect(dialogShown).toBe(false)
})

test('保存ボタンで画面上のイベント一覧を console.table に出力します', async ({ page }) => {
  await selectOnLane(page, '3', 17, 18)
  await expect(page.locator('.fc-timeline-event', { hasText: '実績' })).toHaveCount(1)

  const tableMessage = page.waitForEvent('console', message => message.type() === 'table')
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: '保存' }).click()
  const message = await tableMessage
  const records = await message.args()[0].jsonValue()
  expect(records).toHaveLength(4)
  expect(Object.keys(records[0]).sort()).toEqual(['endStr', 'id', 'startStr'])
})
