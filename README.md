# labs.oslo.kommune.no

Enonic XP-app som driver https://labs.oslo.kommune.no.

- **Serverside:** JavaScript-controllere på XP-runtime (`src/main/resources/`) + Thymeleaf-views.
- **Klientside:** Webpack-bygget bundle (`src/main/frontend/`) med Vue 3-øyer og SCSS/Bulma.
- **Bygg:** Gradle som topp-nivå, webpack via `com.github.node-gradle.node`.

## Forutsetninger

- JDK 11+ (for Gradle)
- [Enonic CLI](https://developer.enonic.com/start) for å kjøre en lokal sandbox
- Node og npm trengs ikke globalt — node-plugin-en laster ned riktig versjon inn i `.gradle/` ved første bygg. Vil du kjøre `npm`-kommandoer manuelt, installer Node selv (versjon i `build.gradle`).

## Utvikling lokalt

Alle variantene starter med en XP-sandbox i dev-modus:

```sh
enonic sandbox start --dev
```

Sandkassa følger med på ressursene til den installerte appen og laster inn endringer direkte. Appen er tilgjengelig i XP-admin på http://localhost:8080 når sandkassa er oppe.

Velg deretter én av tre arbeidsflyter, avhengig av hva du faktisk jobber med.

### A. Aktivt frontend-arbeid (tre terminaler, raskeste iterasjon)

```sh
# Terminal 2
npm run watch

# Terminal 3
enonic project gradle deploy -Pdev -PskipWebpack -t
```

`npm run watch` holder webpack-prosessen i live med inkrementell kompilering — typisk under ett sekund per endring i `src/main/frontend/`. Gradle (`-t`) re-syncer serverside-ressurser fra `src/main/resources/` ved endring. `-PskipWebpack` skrur av Gradle sitt webpack-steg, så `npm run watch` er eneste kilde for frontend-assets.

### B. Primært backend-arbeid (to terminaler, enklere)

```sh
# Terminal 2
enonic project gradle deploy -Pdev -t
```

Gradle re-bygger alt (inkludert webpack) ved hver endring. Backend-endringer går kjapt. Frontend-endringer tar lenger tid (~5–15 s per endring siden webpack starter fra scratch) — greit hvis du sjelden touch-er frontend.

### C. Sporadisk bruk (én terminal, deploy-on-demand)

```sh
enonic project gradle deploy -Pdev
```

Kjør manuelt når du vil se endringer. Ingen continuous-mode, ingen watcher — enklest når du bare sjekker noe raskt.

## Build

```sh
enonic project gradle build              # produksjonsbygg, minifiserte assets
enonic project gradle build -Pdev        # webpackDev (sourcemaps, ingen minifisering)
enonic project gradle build -PskipWebpack  # hopper over webpack (bruk når npm run watch produserer assets)
enonic project gradle deploy             # bygger JAR og installerer i lokal sandbox
```

JAR-en havner i `build/libs/`. `enonic project gradle <args>` er en wrapper rundt `./gradlew <args>` — bruk hva du foretrekker.

## Frontend-kommandoer

```sh
npm run dev       # engangs utviklingsbygg
npm run watch     # utviklingsbygg i watch-modus
npm run build     # produksjonsbygg
npm run analyze   # produksjonsbygg + webpack-bundle-analyzer
```

## Deploy

GitHub Actions (`.github/workflows/main.yml`) bygger ved push/PR til `master` og deployer til testmiljø via `enonic/action-app-deploy`.
