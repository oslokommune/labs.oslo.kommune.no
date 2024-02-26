import '../styles/main.scss'
import navbarHandler from './handlers/navbar-handler.js'
import menuHandler from './handlers/menu-handler.js'
import videobylineHandler from './handlers/videobyline-handler.js'
import anchorListHandler from './handlers/anchorlist-handler.js'
import * as vueHandler from './handlers/vue-handler.js'
import photoSwipeHandler from './handlers/photoswipe-handler.js'

if (document.getElementById('js-header')) {
  navbarHandler('js-header')
  menuHandler()
}

const mapBlocks = document.querySelectorAll("[data-js='map-block']")
if (mapBlocks.length) {
  mapBlocks.forEach((mapBlock) => {
    vueHandler.map(mapBlock)
  })
}

if (document.getElementById('js-anchor-list')) {
  anchorListHandler()
}

const videoBylines = [...document.querySelectorAll('.bio__video')]
if (videoBylines.length) {
  videobylineHandler(videoBylines)
}

if (document.getElementById('js-minisearch')) {
  vueHandler.minisearch()
}

if (document.getElementById('js-search')) {
  vueHandler.search()
}

photoSwipeHandler()
