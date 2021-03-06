<template>
  <div id="app">
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
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import jaLocale from '@fullcalendar/core/locales/ja'
import interactionPlugin from '@fullcalendar/interaction'
const { v4: uuidv4 } = require('uuid')

export default {
  name: 'App',
  components: {
    FullCalendar
  },
  data() {
    const now = new Date()
    const today = now.toISOString().split('T')[0]

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
        events: [
          // NOTE: これら既存イベントは、 unclickable としたい。
          //       が、そういうオプションはない。
          {
            id: uuidv4(),
            resourceId: '1',
            title: '希望のシフト',
            start: `${today}T07:30:00+09:00`,
            end: `${today}T09:30:00+09:00`,
            display: 'background',
            classNames: ['heightUp'],
          },
          {
            id: uuidv4(),
            resourceId: '2',
            title: '希望のシフト',
            start: `${today}T10:00:00+09:00`,
            end: `${today}T15:00:00+09:00`,
            display: 'background',
            classNames: ['heightUp'],
          },
          {
            id: uuidv4(),
            resourceId: '3',
            title: '希望のシフト',
            start: `${today}T09:00:00+09:00`,
            end: `${today}T14:00:00+09:00`,
            display: 'background',
            classNames: ['heightUp'],
          }
        ],
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
      calendarApi.addEventSource([{
        id: uuidv4(),
        resourceId: info.resource.id,
        title: '実績',
        start: info.startStr,
        end: info.endStr,
        classNames: ['heightUp'],
      }])
    },

    handleEventClick: function (info) {
      // background event は変更不可とする。
      if (info.event.display === 'background') {
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
      const objects = calendarApi.getEvents().map(function (event) {
        const { id, startStr, endStr } = event
        return {
          id, startStr, endStr
        }
      })
      console.table(objects)
    }
  }
}
</script>

<style>
#app {
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
