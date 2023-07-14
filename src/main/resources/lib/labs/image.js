exports.image = {}
var portal = require('/lib/xp/portal')
var contentSvc = require('/lib/xp/content')

var prescaledImageSizes = [256, 512, 1024, 2048]
var prescaledImageQualities = [70, 65, 60, 55]
var defaultImageWidth = prescaledImageSizes[prescaledImageSizes.length - 1]
var defaultImageQuality = 60

var tempSVG = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {{w}} {{h}}'/>" // Simplest possible SVG

var iconSVG =
  "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 {{w}} {{h}}'><rect width='100%' height='100%' fill='#eee'/><defs><symbol id='a' viewBox='0 0 90 66' opacity='0.3'><path d='M85 5v56H5V5h80m5-5H0v66h90V0z'/><circle cx='18' cy='20' r='6'/><path d='M56 14L37 39l-8-6-17 23h67z'/></symbol></defs><use xlink:href='#a' width='20%' x='40%'/></svg>" // Basic 'picture' icon

/**
 * Creates image object.
 * @param {String} key - The image content key
 * @param {String} scale - Scaling filter
 * @param {String} filter - Additional image filters
 * @param {String} format - Image format
 * @param {String} quality - Image quality (JPEG)
 * @param {Boolean} responsive - Create responsive image sizes?
 * @param {Boolean} absolute - Return absolute URL?
 * @return {Object} The image object
 */
exports.image.create = function (
  key,
  scale,
  filter,
  format,
  quality,
  responsive,
  absolute
) {
  /*
     if (!scale) {
     log.warning('Scale parameter not set');
     }
     */
  scale = scale || 'width(1)'

  responsive = typeof responsive !== 'undefined' ? responsive : true
  var image = {}
  if (key) {
    var result = contentSvc.get({
      key: key,
    })
    if (result) {
      if ('media:image' === result.type) {
        if (responsive) {
          image.isResponsive = true
          image.srcSet = createSrcSet(
            result,
            scale,
            filter,
            format,
            quality,
            absolute
          ).join(', ')
          image.src = createSrc(
            defaultImageWidth,
            result,
            scale,
            filter,
            format,
            quality,
            absolute
          )
          var placeHolder = createScaledPlaceholder(result, scale, defaultImageWidth)
          if (placeHolder && placeHolder.x && placeHolder.y) {
            image.width = placeHolder.x
            image.height = placeHolder.y
            image.heightPercentage = placeHolder.heightPercentage
            image.placeholderSrc = placeHolder.src
          }
        } else {
          image.isResponsive = false
          image.src = exports.image.createUrl(
            key,
            scale,
            filter,
            format,
            quality,
            absolute
          )
        }
      } else {
        image.src = portal.attachmentUrl({
          id: key,
        })
      }
      image.alt = result.displayName
      image.caption = result.data['caption'] || null
      image.artist = result.data['artist'] || null
      image.copyright = result.data['copyright'] || null
      image.tags = result.data['tags'] || null
    }
  }
  return image
}

/**
 * Creates image URL.
 * @param {String} key - The image content key
 * @param {String} scale - Scaling filter
 * @param {String} filter - Additional image filters
 * @param {String} format - Image format
 * @param {String} quality - Image quality (JPEG)
 * @param {Boolean} absolute - Return absolute URL?
 * @return {String} The image URL
 */
exports.image.createUrl = function (key, scale, filter, format, quality, absolute) {
  var scaledQuality = quality || defaultImageQuality
  var type = absolute ? 'absolute' : 'server'
  return portal.imageUrl({
    id: key,
    scale: scale,
    filter: filter,
    format: format,
    quality: scaledQuality,
    type: type,
  })
}

/**
 * Creates placeholder image
 * @param {String} scale - Scaling filter
 * @return {Object} The image srcset
 */
exports.image.placeholder = function (scale) {
  var image = {}
  var ar = scale.split('block(')[1].split(')')[0].split(',')
  var placeholder =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(iconSVG.replace(/{{w}}/g, ar[0]).replace(/{{h}}/g, ar[1]))

  image.src = ''
  image.srcSet = placeholder
  image.alt = 'Placeholder image'

  return image
}

/**
 * Creates image responsive srcset.
 * @param {Object} image - The image content
 * @param {String} scale - Scaling filter
 * @param {String} filter - Additional image filters
 * @param {String} format - Image format
 * @param {String} quality - Image quality (JPEG)
 * @param {Boolean} absolute - Return absolute URL?
 * @return {Object} The image srcset
 */
function createSrcSet(image, scale, filter, format, quality, absolute) {
  var srcSet = []
  for (var i = 0; i < prescaledImageSizes.length; i++) {
    var scaledWidth = prescaledImageSizes[i]
    var scaledQuality = quality || prescaledImageQualities[i]
    var scalingFilter = createScaleFilter(image, scale, scaledWidth)
    var scaledUrl = exports.image.createUrl(
      image['_id'],
      scalingFilter,
      filter,
      format,
      scaledQuality,
      absolute
    )
    srcSet.push(scaledUrl + ' ' + scaledWidth + 'w')
  }
  return srcSet
}

/**
 * Creates scaled image of desired width.
 * @param {Number} scaledWidth - Desired width
 * @param {Object} image - The image content
 * @param {String} scale - Scaling filter
 * @param {String} filter - Additional image filters
 * @param {String} format - Image format
 * @param {String} quality - Image quality (JPEG)
 * @param {String} absolute - Return relative ('server' - default) or absolute ('absolute') url
 * @return {String} The image src
 */
function createSrc(scaledWidth, image, scale, filter, format, quality, absolute) {
  var scalingFilter = createScaleFilter(image, scale, scaledWidth)
  var scaledQuality = quality || defaultImageQuality
  return exports.image.createUrl(
    image['_id'],
    scalingFilter,
    filter,
    format,
    scaledQuality,
    absolute
  )
}

/**
 * Get individual scale parameters as array from scale parameter string.
 * @param {String} scaling - Scaling filter
 * @return {Array} The individual scaling parameters
 */
function getScaleParameters(scale) {
  // remove trailing parenthesis
  var res = scale.replace(/\)$/, '')
  // split on parenthesis and comma
  res = res.split(/[(,]/)
  return res
}

/**
 * Create final scale filter based on selected scaling filter and available width
 * @param {Object} image - The image content
 * @param {String} scaling - Scaling filter
 * @param {Integer} width
 * @return {String} Available width
 */
function createScaleFilter(image, scale, width) {
  var scaleParams = getScaleParameters(scale)
  var scaleType = scaleParams[0].toLowerCase()
  var finalScaleFilterArray = []

  var scaleTypes = getScaleTypes()

  if (scaleTypes['x'].indexOf(scaleType) >= 0) {
    finalScaleFilterArray.push(width)
  }

  if (scaleTypes['y'].indexOf(scaleType) >= 0) {
    // height scaling does not make sense for responsive images
    log.warning('Height scaling does not make sense for responsive images')
  }

  if (scaleTypes['xy'].indexOf(scaleType) >= 0) {
    var scaleRatio = scaleParams[1] / scaleParams[2]
    finalScaleFilterArray.push(width)
    finalScaleFilterArray.push(Math.round(width / scaleRatio))
  }

  if (scaleParams[3]) {
    finalScaleFilterArray.push(scaleParams[3])
  }

  if (scaleParams[4]) {
    finalScaleFilterArray.push(scaleParams[4])
  }

  var finalScaleFilter = scaleType + '(' + finalScaleFilterArray.join() + ')'
  return finalScaleFilter
}

/**
 * Create placeholder width and height based on selected scaling filter and available width
 * @param {Object} image - The image content
 * @param {String} scaling - Scaling filter
 * @param {Integer} width
 * @return {object} placeholder object with x, y, heightPercentage and svg src image
 */
function createScaledPlaceholder(image, scale, width) {
  var scaleParams = getScaleParameters(scale)
  var scaleType = scaleParams[0].toLowerCase()
  var placeholder = {}
  var scaleRatio = 1

  var scaleTypes = getScaleTypes()

  if (scaleTypes['xy'].indexOf(scaleType) >= 0) {
    // We use user set aspect ratio
    scaleRatio = scaleParams[1] / scaleParams[2]
  } else if ('square' === scaleType) {
    scaleRatio = 1
  } else {
    // We use actual image size for ratio
    scaleRatio = getImageAspectRatio(image)
  }

  var height = width / scaleRatio
  placeholder.x = width
  placeholder.y = String(Math.round(height))
  placeholder.heightPercentage = String((100 * height) / width)

  placeholder.src =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
      iconSVG.replace(/{{w}}/g, placeholder.x).replace(/{{h}}/g, placeholder.y)
    )

  return placeholder
}

/**
 * Get image dimensions (width and height) for image
 * @param {Object} image - The image content
 * @return {Object} The image dimensions
 */
function getImageDimensions(image) {
  var imageInfo = image['x']['media']['imageInfo']
  var cameraInfo = image['x']['media']['cameraInfo']
  var imageDimensions = {
    x: imageInfo['imageWidth'],
    y: imageInfo['imageHeight'],
  }
  // Check for rotated images. Enonic doesn't recognize this.
  if (cameraInfo && cameraInfo.orientation && /(90|270)/.test(cameraInfo.orientation)) {
    imageDimensions = {
      x: imageInfo['imageHeight'],
      y: imageInfo['imageWidth'],
    }
  }
  return imageDimensions
}

/**
 * Get aspect ratio (width divided by height) of image
 * @param {Object} image - The image content
 * @return {Float} The image aspect ratio
 */
function getImageAspectRatio(image) {
  var imageDimensions = getImageDimensions(image)
  return imageDimensions['x'] / imageDimensions['y']
}

/**
 * Get available scaletypes (grouped by affected image dimensions)
 * @return {Object} The available scale types
 */
function getScaleTypes() {
  return {
    x: ['width', 'square', 'max'],
    y: ['height'],
    xy: ['wide', 'block'],
  }
}

/**
 * Calculate optimal dimensions (width and height) for placeholder image
 * @param {Object} image - The image content
 * @param {String} scaling - Scaling filter
 * @return {Object} Placeholder (dimensions)
 */
function createPlaceholder(image, scaling) {
  var scaleParams = getScaleParameters(scaling)
  var scaleType = scaleParams[0].toLowerCase()
  var scaleTypes = getScaleTypes()

  var scaleDimensions = {}
  scaleDimensions['x'] = scaleParams[1]

  if (scaleTypes['xy'].indexOf(scaleType) >= 0) {
    scaleDimensions['y'] = scaleParams[2]
  } else {
    var y = Math.round(scaleParams[1] / getImageAspectRatio(image))
    scaleDimensions['y'] = y
  }

  var gcd = greatestCommonDivisor(scaleDimensions['x'], scaleDimensions['y'])

  var placeholder = {}
  placeholder.x = (scaleDimensions['x'] / gcd).toString()
  placeholder.y = (scaleDimensions['y'] / gcd).toString()

  return placeholder
}

/**
 * Calculates the greatest common divisor for a and b
 * @param {Integer} a
 * @param {Integer} b
 * @return {Integer} Greatest common divisor
 */
function greatestCommonDivisor(a, b) {
  if (b) {
    return greatestCommonDivisor(b, a % b)
  } else {
    return Math.abs(a)
  }
}
