vue-fullcalendar-study
===

✌🏽 In this repository, I tried to study Vue + Vite + FullCalendar + GitHub Pages.

- Docker: 対応!
- Node.js: 24!
- Linter: ESLint 10 (eslint-plugin-vue)!
- Test: Vitest, Playwright (e2e)!
- Vue: 3.5!
- Vite: 8!
- FullCalendar: 6.1 (resource-timeline)!

## パッと実行してみたい

```bash
docker compose up --build
# --> http://localhost:5173/vue-fullcalendar-study/ を開く
```

lint, test, build も Docker で動かせる。
package.json や設定ファイルを変えたら、 `docker compose build` で image を作り直す。

```bash
docker compose run --rm app npm run lint
docker compose run --rm app npm test
docker compose run --rm app npm run build
```

ブラウザ操作の e2e テスト (Playwright) は、ホストの Node.js 24 で動かす。
build したものを `vite preview` で起動してテスト。

```bash
npm ci
npx playwright install chromium
npm run test:e2e

# docker compose up で起動中のサーバに対してテストするとき
BASE_URL=http://localhost:5173/vue-fullcalendar-study/ npm run test:e2e
```

GitHub Actions では push と Pull Request ごとに lint, test, build, e2e テストと、 Docker での起動確認を実行。
main への push では GitHub Pages にもデプロイ。

- https://yuu-eguci.github.io/vue-fullcalendar-study/

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
