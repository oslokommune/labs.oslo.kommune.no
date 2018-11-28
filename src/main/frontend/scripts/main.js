import '../styles/main.scss'
import navbarHandler from './handlers/navbar-handler.js'
import menuHandler from './handlers/menu-handler.js'
import anchorListHandler from './handlers/anchorlist-handler.js'
import * as maps from './handlers/map-handler.js'

if (document.getElementById('js-header')) {
  navbarHandler('js-header')
  menuHandler()
}

if (document.getElementById('js-map-block')) {
  maps.init()
}

if (document.getElementById('js-anchor-list')) {
  anchorListHandler()
}

import Vue from 'vue'

import Search from './components/Search.vue'
if (document.getElementById('js-search')) {
  new Vue({
    render: h => h(Search)
  }).$mount('#js-search')
}
