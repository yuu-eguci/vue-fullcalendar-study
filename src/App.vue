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
            id: 'd',
            name: '芥川賞作家 砂川文次'
          },
          {
            id: 'c',
            name: '芥川賞作家 石沢麻依',
            eventColor: 'green'
          },
          {
            id: 'e',
            name: '芥川賞作家 李琴峰',
            eventColor: 'orange'
          }
        ],
        events: 'https://fullcalendar.io/api/demo-feeds/events.json?single-day&for-resource-timeline',
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
