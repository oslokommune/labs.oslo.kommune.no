import PhotoSwipe from '../../../../../node_modules/photoswipe/dist/photoswipe.esm.min.js'
import PhotoSwipeLightbox from '../../../../../node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js'

export default function init() {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '.gallery',
    children: 'a',
    pswpModule: PhotoSwipe,
  })

  lightbox.on('uiRegister', function () {
    lightbox.pswp.ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: 'Custom caption',
      onInit: (el, pswp) => {
        lightbox.pswp.on('change', () => {
          const currItem = lightbox.pswp.currSlide.data
          // Update caption based on the current item
          el.innerHTML = currItem.title || ''
        })
      },
    })
  })

  lightbox.init()
}
