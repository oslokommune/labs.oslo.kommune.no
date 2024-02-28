import PhotoSwipeLightbox from '../../../../../node_modules/photoswipe/dist/photoswipe-lightbox.esm'
import PhotoSwipeDynamicCaption from '../../../../../node_modules/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.esm.js'

export default function init() {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#main',
    children: '.gallery',
    pswpModule: () => import('../../../../../node_modules/photoswipe/dist/photoswipe.esm.js'),
    paddingFn: (viewportSize) => {
      const configurations = [
        { max: 600, values: { top: 0, right: 0, bottom: 0, left: 0 } },
        { max: 1024, values: { top: 10, right: 10, bottom: 10, left: 10 } },
        { max: Infinity, values: { top: 30, right: 70, bottom: 30, left: 70 } },
      ]
      return configurations.find((config) => viewportSize.x < config.max).values
    },
  })

  const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
    type: 'auto',
  })

  lightbox.init()
}
