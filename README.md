vue-fullcalendar-study
===

✌🏽 In this repository, I tried to study Vue-cli + Vuetify + FullCalendar + GitHub Pages.

## Demo

https://user-images.githubusercontent.com/28250432/181431083-c3c76dae-d309-429f-a259-563f3fc7ffa8.mp4

## TIL: Vue + FullCalendar

- Vue + FullCalendar やるときはとりあえずここ↓を見て始める
    - https://fullcalendar.io/docs/vue
- そしてここの一覧↓から実現したい view を選ぶ
    - https://fullcalendar.io/docs
- 具体的な実現方法を知りたいときは view > demo > CodePen と飛んで参照すると早い
- 用語をおさえる
    - Timeline view の左の列は "Resource" という
    - バーは "Events" という
- Timeline view を使うときは、ゼッタイ "Resource はどう定義すんの?" "Event はどう定義すんの?" ってなる。この Timeline view のデモページの Dev Tool > Network を見て、 json を取得している URL を見るのが早い
    - https://fullcalendar.io/docs/timeline-standard-view-demo
- 以下は、それぞれ違う方法で実現しないといけない
    - Event をつかんで移動させたり、伸ばしたりしたい -> "Event Dragging & Resizing"
        - https://fullcalendar.io/docs/event-dragging-resizing
    - Event 自体をクリックしたときに何かしたい -> "Event Clicking & Hovering"
        - https://fullcalendar.io/docs/event-clicking-hovering
    - 何もないところを選択したりクリックしたときに何かしたい -> "Date Clicking & Selecting"
        - https://fullcalendar.io/docs/date-clicking-selecting
- これが本当に注意なんだけど、画面上の表示と実データは違う。画面上の表示は "in memory" であり、実データは raw data として保持されている。
    - 実データは (Vue でいえば) `this.calendarOptions.events` にある。
    - In memory は `Calendar::getEvents` とかで取得する。
        - https://fullcalendar.io/docs/Calendar-getEvents
- ちょくちょく `Calendar::` という表記を目にするが、 Vue では refs を使ってアクセスする。
    - `const calendarApi = this.$refs.fullCalendar.getApi()`
- ただし Vue で Calendar API を使うことについては "Hopefully you won’t need to do it often" って書いてる。だから Vue では raw data をガンガン操作するほうがいいのかも。このリポジトリでは、 "Calendar API を使うほうが FullCalendar の思想に合っているのかな?" と思ってそちらで進めたけど。
