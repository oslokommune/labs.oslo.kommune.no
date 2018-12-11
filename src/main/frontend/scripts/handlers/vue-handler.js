import Vue from 'vue'
import VueI18n from 'vue-i18n'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueI18n)
Vue.use(VueGoogleMaps, {
  load: {
    key: typeof googleMapsKey !== 'undefined' ? googleMapsKey : false, // Global variable from default.html template
    libraries: 'places'
  }
})

const i18n = new VueI18n({
  locale: typeof labsSiteLanguage !== 'undefined' ? labsSiteLanguage : 'no' // Global var set by html controller
})

import Search from './../components/Search.vue'
function search() {
  new Vue({
    i18n,
    render: h => h(Search)
  }).$mount('#js-search')
}

import MiniSearch from './../components/MiniSearch.vue'
function minisearch() {
  new Vue({
    i18n,
    render: h => h(MiniSearch)
  }).$mount('#js-minisearch')
}

import Map from './../components/Map.vue'
function map(containerElement) {
  let mapContainer = containerElement.querySelector('.mapcontainer')

  let options = {}

  options.center = containerElement.getAttribute('center')
    ? containerElement.getAttribute('center')
    : '0,0'

  options.zoom = containerElement.getAttribute('zoom')
    ? +containerElement.getAttribute('zoom')
    : +10

  options.markers = containerElement.getAttribute('markers')
    ? JSON.parse(containerElement.getAttribute('markers'))
    : []

  options.geoJSON = containerElement.getAttribute('geoJSON')
    ? JSON.parse(containerElement.getAttribute('geoJSON'))
    : []

  new Vue({
    i18n,
    render: h => h(Map, { props: options })
  }).$mount(mapContainer)
}

export { search, minisearch, map }
