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

export default {
  name: 'App',
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ resourceTimelinePlugin ],
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
            name: '芥川賞作家 砂川文次'
          },
          {
            id: 2,
            name: '芥川賞作家 石沢麻依',
            eventColor: 'green'
          },
          {
            id: 3,
            name: '芥川賞作家 李琴峰',
            eventColor: 'orange'
          }
        ],
        events: [
          {
            resourceId: 1,
            title: 'event 1',
            start: '2022-05-23',
            end: '2022-05-25'
          },
          {
            resourceId: 2,
            title: 'event 3',
            start: '2022-05-24T12:00:00+00:00',
            end: '2022-05-25T06:00:00+00:00'
          },
          {
            resourceId: 3,
            title: 'event 4',
            start: '2022-05-24T07:30:00+00:00',
            end: '2022-05-24T09:30:00+00:00'
          }
        ],
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
      }
    }
  },
  methods: {
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
