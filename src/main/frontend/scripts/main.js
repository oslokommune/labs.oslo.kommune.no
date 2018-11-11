import navbarHandler from "./navbar-handler.js"
import menuHandler from "./menu-handler.js"

navbarHandler("js-header")
menuHandler()

import Vue from "vue"

import Hello from "./components/Hello.vue"
if (document.getElementById("js-vuetest")) {
  new Vue({
    render: h => h(Hello)
  }).$mount('#js-vuetest')
}

import Search from "./components/Search.vue"
if (document.getElementById("js-search")) {
  new Vue({
    render: h => h(Search)
  }).$mount('#js-search')
}
