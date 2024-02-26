import PhotoSwipeLightbox from '../../../../../node_modules/photoswipe/dist/photoswipe-lightbox.esm'
import PhotoSwipeDynamicCaption from '../../../../../node_modules/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.esm.js'

export default function init() {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#main',
    children: '.gallery',
    pswpModule: () => import('../../../../../node_modules/photoswipe/dist/photoswipe.esm.js'),
    paddingFn: (viewportSize) => {
      return {
        top: 30,
        bottom: 30,
        left: 70,
        right: 70,
      }
    },
  })

  const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
    type: 'auto',
  })

  lightbox.init()
}
