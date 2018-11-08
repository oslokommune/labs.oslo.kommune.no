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
