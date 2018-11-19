/**
 * Helper methods for part and page controllers. Tightly coupled with Origo labs
 * styling and layout. The grid is mainly Bulma based, so you should be fine with
 * little modification as long as you use the same controllers.
 */

var util = require('util')
var portal = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var imageLib = require('image')

exports.prepareArticleContents = function(data, scale) {
  data = processCommonFields(data, scale)
  data.contentBlocks && (data.contentBlocks = processContentBlocks(data.contentBlocks))
  return data
}

exports.prepareHeroContents = function(data, scale) {
  data = processCommonFields(data, scale)
  return data
}

exports.prepareArticleList = function(data, scale) {
  if (!data.count) return []
  scale = scale || 'block(5,2)'

  var list = data.hits.map(function(res) {
    var article = {}
    article.id = res._id
    article.path = portal.pageUrl({
      path: res._path
    })
    article.created = res.createdTime
    article.title = res.displayName

    if (!res.data) return article

    article.modifiedTime = res.modifiedTime ? res.modifiedTime : null
    article.image = res.data.image ? imageLib.image.create(res.data.image, scale) : null
    article.authors = res.data.authors ? res.data.authors : null
    article.title = res.data.heading ? res.data.heading : res.displayName
    article.lead = res.data.lead ? res.data.lead : null

    return article
  })

  return list
}

function processCommonFields(data, scale) {
  if (!data) return

  data.authors && (data.authors = getAuthors(data.authors))
  data.image && (data.image = imageLib.image.create(data.image, scale))

  return data
}

function getAuthors(authors) {
  if (!authors) return

  authors = util.forceArray(authors)
  authors = authors.map(function(authorId) {
    var author = {}
    var content = contentLib.get({
      key: authorId
    })

    if (content && content.data && content.data.name) {
      author.name = content.data.name
    } else {
      author.name = content.displayName
    }

    if (content && content.data && content.data.image) {
      author.image = imageLib.image.create(content.data.image, 'square')
    }

    if (content && content.data && content.data.email) {
      author.email = content.data.email
    }

    author.url = portal.pageUrl({
      id: authorId
    })

    return author
  })

  return authors
}
exports.getAuthors = getAuthors

//
function processContentBlocks(ctbs) {
  ctbs = util.forceArray(ctbs)

  ctbs = ctbs.map(function(block) {
    if (!block.ctb) return

    if (block.hasOwnProperty('ctbSettings') && block.ctbSettings._selected) {
      // List of the selected settings
      var selected = util.forceArray(block.ctbSettings._selected)

      // Sidebarbox
      if (selected.indexOf('sidebarbox') > -1) {
        block.ctb.sidebarbox = {}
        if (block.ctbSettings.sidebarbox.sidebarboxIcon) {
          block.ctb.sidebarbox.icon = block.ctbSettings.sidebarbox.sidebarboxIcon
        }
        block.ctb.sidebarbox.contents = block.ctbSettings.sidebarbox.sidebarboxContents
      }

      // Full Width
      if (selected.indexOf('fullWidth') > -1 && !block.ctb.sidebarbox) {
        block.ctb.isFullWidth = true
      }

      // Background color
      if (selected.indexOf('bgFill') > -1) {
        var colors = block.ctbSettings.bgFill

        // Which bg colors require white text
        var darkBgs = [
          'purple',
          'grey-dark',
          'grey-darker',
          'green-dark',
          'green-faded',
          'brown',
          'orange',
          'red',
          'yellow',
          'black'
        ]

        if (darkBgs.indexOf(colors.colorMain) > -1) {
          block.ctb.hasWhiteText = true
        }

        // Add bg color with css class when top color isn't set,
        // if not, create the string for a gradient background
        if (!colors.colorTop) {
          block.ctb.fill = colors.colorMain
        } else {
          // Store color values
          var hex = []
          hex.push(util.getColorValueFromName(colors.colorTop))
          hex.push(util.getColorValueFromName(colors.colorMain))
          if (colors.colorBottom) {
            hex.push(util.getColorValueFromName(colors.colorBottom))
          }

          // Generate gradient string depending on how many colors were provided
          var dist,
            str = '',
            gradient = ''
          if (hex.length === 2) {
            dist = ['0%', '25%', '100%'] // Distance from top to color change
            str += hex[0] + ' ' + dist[0] + ', '
            str += hex[0] + ' ' + dist[1] + ', '
            str += hex[1] + ' ' + dist[1] + ', '
            str += hex[1] + ' ' + dist[2]
          } else {
            dist = ['0%', '15%', '85%', '100%'] // Distance from top to color change
            str += hex[0] + ' ' + dist[0] + ', '
            str += hex[0] + ' ' + dist[1] + ', '
            str += hex[1] + ' ' + dist[1] + ', '
            str += hex[1] + ' ' + dist[2] + ', '
            str += hex[2] + ' ' + dist[2] + ', '
            str += hex[2] + ' ' + dist[3]
          }

          gradient += 'background: ' + hex[1] + ';'
          gradient += 'background: -moz-linear-gradient(top,' + str + ');'
          gradient += 'background: -webkit-linear-gradient(top, ' + str + ');'
          gradient += 'background: linear-gradient(to bottom, ' + str + ');'

          block.ctb.gradient = gradient
        }
      }
    }

    // Define height of video player based on aspect ratio
    if (block.ctb._selected === 'ctbVideo' && block.ctb.ctbVideo) {
      var defaultAspectRatio = '16:9'
      var ratio

      if (block.ctb.ctbVideo.aspectRatio) {
        ratio = block.ctb.ctbVideo.aspectRatio.trim().split(':')
      } else {
        ratio = defaultAspectRatio.split(':')
      }
      block.ctb.ctbVideo.paddingTop = (ratio[1] / ratio[0]) * 100 + '%'
    }

    // Sanitize links. Prefer internal over external, override link text if desired
    if (block.ctb._selected === 'ctbLinks' && block.ctb.ctbLinks) {
      block.ctb.ctbLinks = processBlockLinkList(block.ctb.ctbLinks)
    }

    // Prepare images
    if (block.ctb._selected === 'ctbImages' && block.ctb.ctbImages) {
      // Duplicate fullwidth flag from settings, as it is needed in calculation
      block.ctb.ctbImages.isFullWidth = block.ctb.isFullWidth
      block.ctb.ctbImages = processBlockImages(block.ctb.ctbImages)
    }

    return block.ctb
  })

  return ctbs
}

var processBlockLinkList = function(b) {
  if (b.linkList) {
    var workingLinks = []
    var link = {}
    util.forceArray(b.linkList).forEach(function(item) {
      link = {}
      if (item.internalLink || item.externalLink) {
        if (item.internalLink) {
          link.text = contentLib.get({
            key: item.internalLink
          }).displayName
          link.href = portal.pageUrl({
            id: item.internalLink
          })
        } else {
          link.href = item.externalLink
          if (!/^https?:\/\//i.test(link.href)) {
            link.href = 'https://' + link.href // Add protocol to href if missing...
          }
          link.text = item.externalLink.replace(/^https?:\/\//i, '') // ...but remove from text
        }
        if (item.overrideLinkText) {
          link.text = item.overrideLinkText
        }
      }
      if (link.href) {
        workingLinks.push(link)
      }
    })
    if (workingLinks.length) {
      b.links = workingLinks
    }
  }
  return b
}
exports.processBlockLinkList = processBlockLinkList

var processBlockImages = function(b) {
  b.images = util.forceArray(b.images)
  b.isSingleImage = b.images.length === 1
  var scale = 'width(1)' // No scaling is default
  if (b.images.length > 1 && b.makeEqual) {
    scale = calculateEqualSizeScale(b.images)
  }
  var sizes = calculateImageSizesString(b.isFullWidth, b.images.length)
  var image
  b.images = b.images.map(function(image) {
    image = imageLib.image.create(image, scale)
    image.sizes = sizes
    return image
  })
  return b
}
exports.processBlockImages = processBlockImages

/**
 * Helper function that will calculate the sizes param used in conjunction with srcset in img tag.
 * Should ideally be moved closer to the html template, but for rendering convenience it makes
 * sense to calulate it here and pass it to the controller along with the prepared images.
 * @param {boolean} isFullWidth
 * @param {int} count
 */
function calculateImageSizesString(isFullWidth, count) {
  var sizes = ['(max-width:768px) 95vw']
  switch (count) {
    case 1:
      sizes.push('(max-width:1087px) ' + (isFullWidth ? '95vw' : '64vw'))
      sizes.push('(max-width:1279px) ' + (isFullWidth ? '960px' : '630px'))
      sizes.push('(max-width:1471px) ' + (isFullWidth ? '1152px' : '660px'))
      sizes.push(isFullWidth ? '1344px' : '657px')
      break
    case 2:
      sizes.push('(max-width:1087px) ' + (isFullWidth ? '48vw' : '32vw'))
      sizes.push('(max-width:1279px) ' + (isFullWidth ? '466px' : '301px'))
      sizes.push('(max-width:1471px) ' + (isFullWidth ? '561px' : '316px'))
      sizes.push(isFullWidth ? '657px' : '314px')
      break
    case 3:
      sizes.push('(max-width:1087px) ' + (isFullWidth ? '48vw' : '32vw'))
      sizes.push('(max-width:1279px) ' + (isFullWidth ? '301px' : '192px'))
      sizes.push('(max-width:1471px) ' + (isFullWidth ? '364px' : '202px'))
      sizes.push(isFullWidth ? '428px' : '199px')
      break
    default:
      sizes.push('1024px')
  }
  return sizes.join(', ')
}

/**
 * Helper function that takes an array of images of varying dimensions and calculates
 * the optimal common aspect ratio to make them equal, while keeping as much of the
 * original aspect ratio as possible.
 * @param {object} images
 */
function calculateEqualSizeScale(images) {
  var width = 0
  var height = 0
  var maxWidth = 0
  var maxHeight = 0
  var imageData, imageDimensions
  images.forEach(function(image) {
    imageData = contentLib.get({
      key: image
    })
    if (imageData) {
      imageDimensions = getImageDimensions(imageData)
      if (imageDimensions.x > imageDimensions.y) {
        width = 1
        height = imageDimensions.y / imageDimensions.x
      } else {
        width = imageDimensions.x / imageDimensions.y
        height = 1
      }
      if (width > maxWidth) maxWidth = width
      if (height > maxHeight) maxHeight = height
    }
  })
  if (maxWidth > 0 && maxHeight > 0) {
    return 'block(' + maxWidth + ',' + maxHeight + ')'
  }
  return 'square'
}

function getImageDimensions(image) {
  var imageInfo = image['x']['media']['imageInfo']
  var cameraInfo = image['x']['media']['cameraInfo']
  var imageDimensions = {
    x: imageInfo['imageWidth'],
    y: imageInfo['imageHeight']
  }
  // Check for rotated images. Enonic doesn't seem to recognize this in the java layer.
  if (cameraInfo && cameraInfo.orientation && /(90|270)/.test(cameraInfo.orientation)) {
    imageDimensions = {
      x: imageInfo['imageHeight'],
      y: imageInfo['imageWidth']
    }
  }
  return imageDimensions
}

/**
 * Helper function to extract the best field to use for heading when dealing with
 * multi type content. Prefers heading > title > name > displayName
 * @param {*} content   The content object from the result
 */
exports.getHeading = function(content) {
  if (content && content.data && content.data.heading) return content.data.heading
  if (content && content.data && content.data.title) return content.data.title
  if (content && content.data && content.data.name) return content.data.name
  if (content) return content.displayName
  return false
}
