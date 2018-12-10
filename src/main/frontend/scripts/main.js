import '../styles/main.scss'
import navbarHandler from './handlers/navbar-handler.js'
import menuHandler from './handlers/menu-handler.js'
import videobylineHandler from './handlers/videobyline-handler.js'
import anchorListHandler from './handlers/anchorlist-handler.js'
import * as vueHandler from './handlers/vue-handler.js'
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

var videoBylines = [...document.querySelectorAll('.bio__video')]
if (videoBylines.length) {
  videobylineHandler(videoBylines)
}

if (document.getElementById('js-minisearch')) {
  vueHandler.minisearch()
}

if (document.getElementById('js-search')) {
  vueHandler.search()
}
