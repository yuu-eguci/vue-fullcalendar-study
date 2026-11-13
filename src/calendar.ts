// FullCalendar に渡すデータを組み立てる処理です。
// Vue component から切り離して、ユニットテストできるようにしています。

import type { DateSelectArg, EventApi, EventInput } from '@fullcalendar/core'

const DEFAULT_CLASS_NAMES = ['heightUp']

interface DesiredShift {
  resourceId: string
  startTime: string
  endTime: string
}

// 各リソースの "希望のシフト" です。時刻はローカル時刻として扱います。
const DESIRED_SHIFTS: readonly DesiredShift[] = [
  { resourceId: '1', startTime: '07:30:00', endTime: '09:30:00' },
  { resourceId: '2', startTime: '10:00:00', endTime: '15:00:00' },
  { resourceId: '3', startTime: '09:00:00', endTime: '14:00:00' }
]

/**
 * select callback の info のうち、 "実績" event を作るのに使う部分です。
 * resource timeline view での選択なので resource は必ずあります。
 */
export type SelectionInfo = Pick<DateSelectArg, 'startStr' | 'endStr'> & {
  resource: { id: string }
}

/**
 * 保存用の event の情報です。
 */
export type SaveRecord = Pick<EventApi, 'id' | 'startStr' | 'endStr'>

/**
 * Date のローカル日付を YYYY-MM-DD 形式で返します。
 * toISOString() は UTC の日付になるため使いません。
 */
export function toLocalDateString(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * 指定日 (YYYY-MM-DD) の "希望のシフト" を background event として返します。
 */
export function createInitialEvents(date: string, newId: () => string): EventInput[] {
  return DESIRED_SHIFTS.map(({ resourceId, startTime, endTime }) => ({
    id: newId(),
    resourceId,
    title: '希望のシフト',
    start: `${date}T${startTime}`,
    end: `${date}T${endTime}`,
    display: 'background',
    classNames: [...DEFAULT_CLASS_NAMES]
  }))
}

/**
 * select callback の info から "実績" event を返します。
 */
export function createEventFromSelection(info: SelectionInfo, newId: () => string): EventInput {
  return {
    id: newId(),
    resourceId: info.resource.id,
    title: '実績',
    start: info.startStr,
    end: info.endStr,
    classNames: [...DEFAULT_CLASS_NAMES]
  }
}

/**
 * background event は変更不可とします。
 */
export function isDeletable(event: Pick<EventApi, 'display'>): boolean {
  return event.display !== 'background'
}

/**
 * 保存用に event の id と期間だけを取り出します。
 */
export function toSaveRecords(events: readonly SaveRecord[]): SaveRecord[] {
  return events.map(({ id, startStr, endStr }) => ({ id, startStr, endStr }))
}
