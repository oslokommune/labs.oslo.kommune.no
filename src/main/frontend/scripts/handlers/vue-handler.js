import { createApp, h } from 'vue'
import { createI18n } from 'vue-i18n'
// Ingen global konfigurasjon for Google Maps her, siden vi bruker komponentene direkte

const messages = {
  en: {
    inputPlaceHolder: 'Search content',
    searchLabel: 'Search',
    goToSearchPage: 'Go to search page',
    hitsString: 'No hits for “{query}” | One hit for “{query}” | {count} hits for “{query}” – see all',
  },
  no: {
    inputPlaceHolder: 'Søk innhold',
    searchLabel: 'Søk',
    goToSearchPage: 'Gå til søkesiden',
    hitsString: 'Ingen treff på «{query}» | Ett treff på «{query}» | {count} treff på «{query}» – se alle',
  },
}

// Konfigurasjon for i18n
const i18n = createI18n({
  legacy: false, // Bruk Composition API
  locale: typeof labsSiteLanguage !== 'undefined' ? labsSiteLanguage : 'no',
  messages,
})

// Importer dine Vue-komponenter som vanlig
import Search from './../components/Search.vue'
import MiniSearch from './../components/MiniSearch.vue'
import MapComponent from './../components/Map.vue' // Anta at denne bruker GoogleMap og Marker direkte

// Search-funksjonen
function search() {
  const searchApp = createApp(Search)
  searchApp.use(i18n)
  searchApp.provide('searchPageUrl', searchPageUrl)
  searchApp.provide('searchURL', searchURL)
  searchApp.mount('#js-search')
}

// MiniSearch-funksjonen
function minisearch() {
  const miniSearchApp = createApp(MiniSearch)
  miniSearchApp.use(i18n)
  miniSearchApp.provide('searchPageUrl', searchPageUrl)
  miniSearchApp.provide('searchURL', searchURL)
  miniSearchApp.mount('#js-minisearch')
}

function map(containerElement) {
  const mapOptions = {
    center: containerElement.getAttribute('center') ? containerElement.getAttribute('center') : '0,0',
    zoom: containerElement.getAttribute('zoom') ? containerElement.getAttribute('zoom') : +10,
    markers: containerElement.getAttribute('markers') ? JSON.parse(containerElement.getAttribute('markers')) : [],
    geoJSON: containerElement.getAttribute('geoJSON') ? JSON.parse(containerElement.getAttribute('geoJSON')) : [],
    googleMapsKey,
  }

  // Opprett en funksjonell komponent som renderes med h-funksjonen og mottar props
  const RootComponent = {
    render() {
      return h(MapComponent, {
        center: this.center,
        zoom: this.zoom,
        markers: this.markers,
        geoJSON: this.geoJSON,
        googleMapsKey: this.googleMapsKey,
      })
    },
    props: ['center', 'zoom', 'markers', 'geoJSON', 'googleMapsKey'],
  }

  const mapApp = createApp(RootComponent, { ...mapOptions })
  mapApp.use(i18n)
  mapApp.mount(containerElement.querySelector('.mapcontainer'))
}

export { search, minisearch, map }
