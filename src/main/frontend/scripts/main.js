import navbarHandler from './navbar-handler.js'
import menuHandler from './menu-handler.js'
import anchorListHandler from './anchorlist-handler.js'
import * as maps from './map-handler.js'

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
import VueRouter from 'vue-router'

import Search from './components/Search.vue'
if (document.getElementById('js-search')) {
  var router = new VueRouter({
    mode: 'history',
    routes: []
  })

  Vue.use(VueRouter)

  new Vue({
    router,
    render: h => h(Search)
  }).$mount('#js-search')
}
