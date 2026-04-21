# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Enonic XP 7.16.2 application that powers https://labs.oslo.kommune.no. App identifier: `no.kommune.oslo.labs` (see `gradle.properties`). The server-side (JavaScript controllers on the XP runtime + Thymeleaf views) is delivered as a JAR built by Gradle; the client-side bundle is built by webpack and ends up on the same JAR's asset path.

## Common commands

Gradle is the top-level build. The `com.github.node-gradle.node` plugin downloads Node into `.gradle/` — the Gradle tasks use that Node, not the system Node.

- `./gradlew build` — build the deployable JAR (`build/libs/*.jar`). Runs `webpackProd` via `processResources`.
- `./gradlew build -Pdev` — same, but runs `webpackDev` (non-minified, sourcemaps) instead of `webpackProd`.
- `./gradlew build -PskipWebpack` — skip the webpack step entirely (use when assets are being produced by `npm run watch` in another terminal).
- `./gradlew deploy` — deploy the JAR into a local Enonic XP sandbox (standard XP plugin task).

Direct webpack (useful while iterating on frontend without going through Gradle):

- `npm run dev` — development build
- `npm run watch` — development build in watch mode
- `npm run build` — production build (minified)
- `npm run analyze` / `npm run analyze-dev` — adds `BundleAnalyzerPlugin`

No automated tests are configured in this repo.

### Local dev workflow

Three terminals. The split avoids running webpack twice per change (once by the watcher, once by Gradle):

1. `enonic sandbox start --dev` — XP sandbox in dev mode. Picks up resource changes under `build/resources/main/` live.
2. `npm run watch` — webpack watches `src/main/frontend/` and writes to `build/resources/main/assets/`.
3. `enonic project gradle deploy -Pdev -PskipWebpack -t` — first run installs the app; continuous mode then re-syncs server-side resources from `src/main/resources/` on every change. `-PskipWebpack` disables the Gradle-side webpack step, leaving the frontend entirely to `npm run watch`.

## Deployment

GitHub Actions (`.github/workflows/main.yml`) builds on push/PR to `master` and deploys the resulting JAR to the test environment via `enonic/action-app-deploy`.

## Architecture

### Server side (`src/main/resources/`)

Standard Enonic XP site layout. Each route-addressable unit is a directory containing a controller (`.js`), a Thymeleaf view (`.html`), and a descriptor (`.xml`) — they must share the parent directory's name.

- `site/site.xml` — site config form (site name, search page selector, Google Maps key). Rendered by `default.js` into every page.
- `site/pages/default/` — the single page controller for the whole site. Resolves site-wide model and page-contributes the stylesheet + `vendors` + `main` scripts into `headEnd`.
- `site/parts/` — page parts (articles, block-*, search-results, footer, hero, person, category, video, ...). Standard Enonic pattern: controller fetches content, renders Thymeleaf.
- `site/mixins/`, `site/content-types/`, `site/macros/`, `site/snippets/` — Enonic schema definitions and shared HTML fragments.
- `site/i18n/phrases_no.properties`, `phrases_en.properties` — server-side translations. Keys are referenced from XML schemas via `i18n="..."` and from Thymeleaf views.
- `services/` — HTTP services (e.g. `poi`, `datafix`) exposed under `/_/service/...`.
- `lib/labs/` — shared server-side libraries (`menu.js`, `util.js`, `image.js`, `related.js`, `oslo-districts.js`, `content-prep.js`, `ascii-folder.js`). Import via `require('/lib/labs/<name>.js')`.

`site/error/error.js` + `404.html` handle errors.

### Client side (`src/main/frontend/`)

Webpack entry is `scripts/main.js`. It boots a set of feature handlers only if the corresponding marker element exists in the server-rendered HTML — this is a classic "Vue islands" / progressive-enhancement pattern, not an SPA:

- `#js-header` → `navbar-handler` + `menu-handler`
- `[data-js='map-block']` → `vueHandler.map(element)` mounts a Vue 3 `Map` app into `.mapcontainer` within the element
- `#js-anchor-list` → `anchorListHandler`
- `.bio__video` → `videobyline-handler`
- `#js-minisearch` / `#js-search` → `vueHandler.minisearch()` / `vueHandler.search()` (Vue 3 apps)
- Always: `photoSwipeHandler()`

Vue components live in `scripts/components/` (`Search.vue`, `MiniSearch.vue`, `SearchItem.vue`, `ResponsiveImage.vue`, plus a `Map.vue` referenced by `vue-handler.js`). `vue-handler.js` sets up `vue-i18n` (Composition API) with inline `messages` and reads locale/URLs from globals (`labsSiteLanguage`, `searchPageUrl`, `searchURL`, `googleMapsKey`) that `default.js` injects via page contributions.

Styles: SCSS entry is `styles/main.scss`, built on top of Bulma with local overrides in `_custom-bulma.scss` and partials under `styles/partials/`. Processed through `sass-loader` → `postcss-loader` (postcss-preset-env) → `css-loader` → `MiniCssExtractPlugin`.

Webpack output goes to `build/resources/main/assets/` — which is the output dir of `processResources`. `webpackProd` / `webpackDev` are wired in via `processResources.dependsOn` (not `jar.dependsOn`) so any task that rebuilds resources also rebuilds the frontend. Both tasks declare `inputs`/`outputs`, and webpack is configured with `output.clean: true` — so switching modes (e.g. `build` → `build -Pdev`) always produces a clean output directory without stale files from the previous mode. `splitChunks` emits a `vendors` bundle for everything from `node_modules`. Filenames (`main.js`, `vendors.js`, `main.css`) are the same in dev and prod; minification is controlled by webpack's `mode`, not the filename.

### Build/runtime wiring

`default.js` page-contributes `styles/main.css`, `scripts/vendors.js` and `scripts/main.js` — the same paths in dev and prod. If you add a new webpack entry/output, add a matching page-contribution here (there is no manifest).

When adding a new Vue island: add an element + marker in the Thymeleaf view, mount it conditionally in `scripts/main.js` (never assume the marker is present), and expose any runtime config by page-contributing an inline `<script>` from `default.js` rather than hard-coding values into the bundle.
