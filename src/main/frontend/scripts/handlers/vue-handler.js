import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

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

export { search, minisearch }
