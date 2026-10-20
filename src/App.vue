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

<script>
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
} from './calendar.js'

export default {
  name: 'App',
  components: {
    FullCalendar
  },
  data() {
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
        select: this.handleSelect,
        eventClick: this.handleEventClick,
        headerToolbar: {
          end: 'today prev,next save'
        },
        customButtons: {
          save: {
            text: '保存',
            click: this.handleSaveClick
          }
        },
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
      }
    }
  },
  methods: {
    handleSelect: function (info) {
      // NOTE: 他にも this.calendarOptions.events.push する方法がある。
      //       ……が、問題もある。 @fullcalendar/interaction によって編集したデータは
      //       events には反映されない。 push によって再描画が発生すると、上記の編集はすべてリセットされる。
      const calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi.addEventSource([createEventFromSelection(info, uuidv4)])
    },

    handleEventClick: function (info) {
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
      const calendarApi = this.$refs.fullCalendar.getApi()
      console.table(toSaveRecords(calendarApi.getEvents()))
    }
  }
}
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
