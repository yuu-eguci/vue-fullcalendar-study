import type { EventApi, EventInput } from '@fullcalendar/core'
import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  createEventFromSelection,
  createInitialEvents,
  isDeletable,
  toLocalDateString,
  toSaveRecords,
  type SaveRecord,
  type SelectionInfo
} from './calendar'

describe('toLocalDateString', () => {
  it('Date を受け取り、文字列を返します', () => {
    expectTypeOf(toLocalDateString).parameters.toEqualTypeOf<[Date]>()
    expectTypeOf(toLocalDateString).returns.toEqualTypeOf<string>()
  })

  it('ローカル時刻の日付を返します (UTC ではまだ前日の時間帯)', () => {
    expect(toLocalDateString(new Date(2026, 9, 21, 3, 0))).toBe('2026-10-21')
  })

  it('月と日を 0 埋めします', () => {
    expect(toLocalDateString(new Date(2026, 0, 5, 12, 0))).toBe('2026-01-05')
  })
})

describe('createInitialEvents', () => {
  it('YYYY-MM-DD 形式の日付と id の生成関数を受け取り、 FullCalendar の EventInput を返します', () => {
    expectTypeOf(createInitialEvents).parameters.toEqualTypeOf<[string, () => string]>()
    expectTypeOf(createInitialEvents).returns.toExtend<EventInput[]>()
  })

  const ids = ['a', 'b', 'c']
  const events = createInitialEvents('2026-10-21', () => ids.shift() as string)

  it('リソースごとに "希望のシフト" を background event として作ります', () => {
    expect(events).toEqual([
      {
        id: 'a',
        resourceId: '1',
        title: '希望のシフト',
        start: '2026-10-21T07:30:00',
        end: '2026-10-21T09:30:00',
        display: 'background',
        classNames: ['heightUp']
      },
      {
        id: 'b',
        resourceId: '2',
        title: '希望のシフト',
        start: '2026-10-21T10:00:00',
        end: '2026-10-21T15:00:00',
        display: 'background',
        classNames: ['heightUp']
      },
      {
        id: 'c',
        resourceId: '3',
        title: '希望のシフト',
        start: '2026-10-21T09:00:00',
        end: '2026-10-21T14:00:00',
        display: 'background',
        classNames: ['heightUp']
      }
    ])
  })
})

describe('createEventFromSelection', () => {
  it('resource のある選択範囲を受け取り、 FullCalendar の EventInput を返します', () => {
    expectTypeOf<SelectionInfo>().toHaveProperty('resource').toEqualTypeOf<{ id: string }>()
    expectTypeOf(createEventFromSelection).parameter(1).toEqualTypeOf<() => string>()
    expectTypeOf(createEventFromSelection).returns.toExtend<EventInput>()
  })

  it('選択範囲とリソースから "実績" イベントを作ります', () => {
    const info = {
      resource: { id: '2' },
      startStr: '2026-10-21T10:00:00+09:00',
      endStr: '2026-10-21T11:30:00+09:00'
    }
    expect(createEventFromSelection(info, () => 'new-id')).toEqual({
      id: 'new-id',
      resourceId: '2',
      title: '実績',
      start: '2026-10-21T10:00:00+09:00',
      end: '2026-10-21T11:30:00+09:00',
      classNames: ['heightUp']
    })
  })
})

describe('isDeletable', () => {
  it('EventApi を受け取ります', () => {
    expectTypeOf(isDeletable).toBeCallableWith({} as EventApi)
    expectTypeOf(isDeletable).returns.toEqualTypeOf<boolean>()
  })

  it('background event は削除できません', () => {
    expect(isDeletable({ display: 'background' })).toBe(false)
  })

  it('通常の event は削除できます', () => {
    expect(isDeletable({ display: 'auto' })).toBe(true)
  })
})

describe('toSaveRecords', () => {
  it('EventApi の一覧を受け取り、 SaveRecord の一覧を返します', () => {
    expectTypeOf(toSaveRecords).toBeCallableWith([] as EventApi[])
    expectTypeOf(toSaveRecords).returns.toEqualTypeOf<SaveRecord[]>()
    expectTypeOf<SaveRecord>().toEqualTypeOf<{ id: string, startStr: string, endStr: string }>()
  })

  it('保存用に id, startStr, endStr だけを取り出します', () => {
    const events = [
      { id: 'a', startStr: 's1', endStr: 'e1', title: '実績', display: 'auto' },
      { id: 'b', startStr: 's2', endStr: 'e2', title: '希望のシフト', display: 'background' }
    ]
    expect(toSaveRecords(events)).toEqual([
      { id: 'a', startStr: 's1', endStr: 'e1' },
      { id: 'b', startStr: 's2', endStr: 'e2' }
    ])
  })
})
