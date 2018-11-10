import navbarHandler from "./navbar-handler.js";
import menuHandler from "./menu-handler.js";

navbarHandler("js-header");
menuHandler();

import Vue from "vue";

import Hello from "./components/Hello.vue";
if (document.getElementById("js-vuetest")) {
  new Vue({
    el: "#js-vuetest",
    render: h => h(Hello)
  });
}

import Search from "./components/Search.vue";
if (document.getElementById("js-search")) {
  new Vue({
    el: "#js-search",
    render: h => h(Search)
  });
}

