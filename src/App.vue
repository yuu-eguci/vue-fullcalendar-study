<template>
  <div class="app">
    <h1>
      v1.3
    </h1>
    <full-calendar
      ref="fullCalendar"
      :options="calendarOptions"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { CalendarApi, CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import jaLocale from '@fullcalendar/core/locales/ja'
import interactionPlugin from '@fullcalendar/interaction'
import { v4 as uuidv4 } from 'uuid'
import {
  createEventFromSelection,
  createInitialEvents,
  isDeletable,
  toLocalDateString,
  toSaveRecords
} from './calendar'

export default defineComponent({
  name: 'App',
  components: {
    FullCalendar
  },
  data(): { calendarOptions: CalendarOptions } {
    const today = toLocalDateString(new Date())

    return {
      calendarOptions: {
        plugins: [ resourceTimelinePlugin, interactionPlugin ],
        initialView: 'resourceTimelineDay',
        locale: jaLocale,
        // タイムラインのヘッダを固定します。
        stickyHeaderDates: true,
        eventLongPressDelay: 500,
        selectLongPressDelay: 100,
        resourceAreaColumns: [
          {
            field: 'name',
            headerContent: '名前'
          }
        ],
        resources: [
          {
            id: '1',
            name: '砂川文次'
          },
          {
            id: '2',
            name: '石沢麻依',
            eventColor: 'green'
          },
          {
            id: '3',
            name: '李琴峰',
            eventColor: 'orange'
          }
        ],
        // NOTE: これら既存イベントは、 unclickable としたい。
        //       が、そういうオプションはない。
        events: createInitialEvents(today, uuidv4),
        editable: true,
        eventResourceEditable: false,
        selectable: true,
        select: info => this.handleSelect(info),
        eventClick: info => this.handleEventClick(info),
        headerToolbar: {
          end: 'today prev,next save'
        },
        customButtons: {
          save: {
            text: '保存',
            click: () => this.handleSaveClick()
          }
        },
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
      }
    }
  },
  methods: {
    // ref="fullCalendar" の Calendar API を返します。
    getCalendarApi(): CalendarApi {
      return (this.$refs.fullCalendar as InstanceType<typeof FullCalendar>).getApi()
    },

    handleSelect: function (info: DateSelectArg) {
      // resource timeline view での選択なので resource は必ずあります。
      const { resource, startStr, endStr } = info
      if (!resource) {
        return
      }

      // NOTE: 他にも this.calendarOptions.events.push する方法がある。
      //       ……が、問題もある。 @fullcalendar/interaction によって編集したデータは
      //       events には反映されない。 push によって再描画が発生すると、上記の編集はすべてリセットされる。
      const calendarApi = this.getCalendarApi()
      calendarApi.addEventSource([createEventFromSelection({ resource, startStr, endStr }, uuidv4)])
    },

    handleEventClick: function (info: EventClickArg) {
      // background event は変更不可とする。
      if (!isDeletable(info.event)) {
        return
      }

      if (window.confirm('このシフトを削除しますか?')) {
        // NOTE: push と同様にこれ↓で削除する方法がある。
        //       this.calendarOptions.events = this.calendarOptions.events.filter(x => x.id !== info.event.id)
        //       ただし問題も push と同様に発生する。
        info.event.remove()
      }
    },

    handleSaveClick: function () {
      if (!window.confirm('これで保存しますか?')) {
        return
      }

      // 編集済みの Events 一覧を取得できる。
      const calendarApi = this.getCalendarApi()
      console.table(toSaveRecords(calendarApi.getEvents()))
    }
  }
})
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* events の高さを調節します。 */
.heightUp {
  height: 4em;
}

/* timeline view の行の高さを調節します。 */
.fc-resource-timeline td {
  height: 4em;
}
</style>
