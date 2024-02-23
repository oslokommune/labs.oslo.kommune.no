import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

export default function init() {
  var pswpElement = document.querySelectorAll('.pswp')[0]
  const gallerySelector = '.gallery'
  const galleryElements = document.querySelectorAll(gallerySelector)
  if (galleryElements.length === 0) {
    return
  }

  // find nearest parent element
  var closest = function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn))
  }

  // parse slide data (url, title, size ...) from DOM elements
  var parseThumbnailElements = function () {
    var numNodes = galleryElements.length,
      items = [],
      el,
      item,
      srcset,
      largestImage

    for (var i = 0; i < numNodes; i++) {
      el = galleryElements[i]
      // srcset is always sorted by size, so we pick last (and largest) one
      srcset = el.getAttribute('srcset').split(',')
      largestImage = srcset[srcset.length - 1].trim().split(' ')[0]
      item = {
        src: largestImage,
        w: parseInt(el.getAttribute('data-width'), 10),
        h: parseInt(el.getAttribute('data-height'), 10),
        msrc: el.currentSrc,
        el: el,
      }

      // find root element of slide
      var figureItem = closest(el, function (elem) {
        return elem.tagName && elem.tagName.toUpperCase() === 'FIGURE'
      })
      if (figureItem) {
        item.title = figureItem?.getElementsByTagName('figcaption')?.[0]?.innerText ?? ''
      }
      items.push(item)
    }

    return items
  }

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function (e) {
    e = e || window.event
    e.preventDefault ? e.preventDefault() : (e.returnValue = false)
    const eTarget = e.target || e.srcElement
    const indexFromAttr = eTarget.getAttribute('data-pswp-uid')
    if (indexFromAttr >= 0) {
      // open PhotoSwipe if valid index found
      openPhotoSwipe(indexFromAttr)
    }
    return false
  }

  var openPhotoSwipe = function (index) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
      gallery,
      options,
      items

    items = parseThumbnailElements()

    options = {
      // to get expand/collapse effect to correct location on screen
      getThumbBoundsFn: function (index) {
        var thumbnail = items[index].el,
          pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect()
        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
      },
    }

    options.index = parseInt(index, 10)
    if (isNaN(options.index)) {
      return
    }

    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
    gallery.init()
  }

  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute('data-pswp-uid', i)
    galleryElements[i].onclick = onThumbnailsClick
  }
}
