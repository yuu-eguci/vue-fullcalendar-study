vue-fullcalendar-study
===

โ๐ฝ In this repository, I tried to study Vue-cli + Vuetify + FullCalendar + GitHub Pages.

## Demo

https://user-images.githubusercontent.com/28250432/181431083-c3c76dae-d309-429f-a259-563f3fc7ffa8.mp4

## TIL: Vue + FullCalendar

- Vue + FullCalendar ใใใจใใฏใจใใใใใใโใ่ฆใฆๅงใใ
    - https://fullcalendar.io/docs/vue
- ใใใฆใใใฎไธ่ฆงโใใๅฎ็พใใใ view ใ้ธใถ
    - https://fullcalendar.io/docs
- ๅทไฝ็ใชๅฎ็พๆนๆณใ็ฅใใใใจใใฏ view > demo > CodePen ใจ้ฃใใงๅ็งใใใจๆฉใ
- ็จ่ชใใใใใ
    - Timeline view ใฎๅทฆใฎๅใฏ "Resource" ใจใใ
    - ใใผใฏ "Events" ใจใใ
- Timeline view ใไฝฟใใจใใฏใใผใใฟใค "Resource ใฏใฉใๅฎ็พฉใใใฎ?" "Event ใฏใฉใๅฎ็พฉใใใฎ?" ใฃใฆใชใใใใฎ Timeline view ใฎใใขใใผใธใฎ Dev Tool > Network ใ่ฆใฆใ json ใๅๅพใใฆใใ URL ใ่ฆใใฎใๆฉใ
    - https://fullcalendar.io/docs/timeline-standard-view-demo
- ไปฅไธใฏใใใใใ้ใๆนๆณใงๅฎ็พใใชใใจใใใชใ
    - Event ใใคใใใง็งปๅใใใใใไผธใฐใใใใใใ -> "Event Dragging & Resizing"
        - https://fullcalendar.io/docs/event-dragging-resizing
    - Event ่ชไฝใใฏใชใใฏใใใจใใซไฝใใใใ -> "Event Clicking & Hovering"
        - https://fullcalendar.io/docs/event-clicking-hovering
    - ไฝใใชใใจใใใ้ธๆใใใใฏใชใใฏใใใจใใซไฝใใใใ -> "Date Clicking & Selecting"
        - https://fullcalendar.io/docs/date-clicking-selecting
- ใใใๆฌๅฝใซๆณจๆใชใใ ใใฉใ็ป้ขไธใฎ่กจ็คบใจๅฎใใผใฟใฏ้ใใ็ป้ขไธใฎ่กจ็คบใฏ "in memory" ใงใใใๅฎใใผใฟใฏ raw data ใจใใฆไฟๆใใใฆใใใ
    - ๅฎใใผใฟใฏ (Vue ใงใใใฐ) `this.calendarOptions.events` ใซใใใ
    - In memory ใฏ `Calendar::getEvents` ใจใใงๅๅพใใใ
        - https://fullcalendar.io/docs/Calendar-getEvents
- ใกใใใกใใ `Calendar::` ใจใใ่กจ่จใ็ฎใซใใใใ Vue ใงใฏ refs ใไฝฟใฃใฆใขใฏใปในใใใ
    - `const calendarApi = this.$refs.fullCalendar.getApi()`
- ใใ ใ Vue ใง Calendar API ใไฝฟใใใจใซใคใใฆใฏ "Hopefully you wonโt need to do it often" ใฃใฆๆธใใฆใใใ ใใ Vue ใงใฏ raw data ใใฌใณใฌใณๆไฝใใใปใใใใใฎใใใใใฎใชใใธใใชใงใฏใ "Calendar API ใไฝฟใใปใใ FullCalendar ใฎๆๆณใซๅใฃใฆใใใฎใใช?" ใจๆใฃใฆใใกใใง้ฒใใใใฉใ
