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

// Hack to prevent flashing a black frame at the end
// of looping videos by stripping a few frames at the end
// of the video before resetting the current time.
var videoElements = [...document.querySelectorAll('video')]
videoElements.forEach(video => {
  if (!video.autoplay || !video.loop) return
  video.addEventListener('timeupdate', function() {
    if (this.currentTime >= this.duration - 0.5) {
      this.currentTime = 0
    }
  })
})
