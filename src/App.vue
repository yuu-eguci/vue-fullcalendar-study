<template>
  <div id="app">
    <full-calendar :options="calendarOptions" />
  </div>
</template>

<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import jaLocale from '@fullcalendar/core/locales/ja'
import interactionPlugin from '@fullcalendar/interaction'

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
        resourceAreaColumns: [
          {
            field: 'name',
            headerContent: '名前'
          }
        ],
        resources: [
          {
            id: 1,
            name: '砂川文次'
          },
          {
            id: 2,
            name: '石沢麻依',
            eventColor: 'green'
          },
          {
            id: 3,
            name: '李琴峰',
            eventColor: 'orange'
          }
        ],
        events: [
          {
            resourceId: 1,
            title: '希望のシフト',
            start: `${today}T07:30:00+09:00`,
            end: `${today}T09:30:00+09:00`
          },
          {
            resourceId: 2,
            title: '希望のシフト',
            start: `${today}T10:00:00+09:00`,
            end: `${today}T15:00:00+09:00`
          },
          {
            resourceId: 3,
            title: '希望のシフト',
            start: `${today}T09:00:00+09:00`,
            end: `${today}T14:00:00+09:00`
          }
        ],
        editable: true,
        eventResourceEditable: false,
        selectable: true,
        select: this.handleSelect,
        eventClick: function(info) {
          console.info('eventClick')
          console.info(info)
        },
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
      }
    }
  },
  methods: {
    handleSelect: function (info) {
      this.calendarOptions.events.push({
        resourceId: info.resource.id,
        title: '実績',
        start: info.startStr,
        end: info.endStr,
      })
    },

    handleDateClick: function(arg) {
      alert('date click! ' + arg.dateStr)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
