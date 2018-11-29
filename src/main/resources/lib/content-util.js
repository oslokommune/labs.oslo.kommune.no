/**
 * Helper methods for part and page controllers. Tightly coupled with Origo labs
 * styling and layout. The grid is mainly Bulma based, so you should be fine with
 * little modification as long as you use the same controllers.
 */

var util = require('util')
var portal = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var imageLib = require('image')
var districts = require('labs-oslo-districts')
var moment = require('/assets/moment/2.22.2/moment.js')

exports.prepareArticleContents = function(data, scale) {
  data = processCommonFields(data, scale)
  data.contentBlocks &&
    (data.contentBlocks = processContentBlocks(data.contentBlocks))
  return data
}

exports.prepareHeroContents = function(data, scale) {
  data = processCommonFields(data, scale)
  return data
}

exports.prepareFeaturedArticle = function(data, scale) {
  scale = scale || 'block(5,2)'

  var article = {}
  article.id = data._id
  article.path = portal.pageUrl({
    path: data._path
  })
  article.created = data.createdTime
  article.modifiedTime = data.modifiedTime ? data.modifiedTime : null
  article.heading = data.displayName

  if (!data.data) return article

  article.image = data.data.image
    ? imageLib.image.create(data.data.image, scale)
    : null
  article.authors = data.data.authors ? data.data.authors : null
  article.heading = data.data.heading ? data.data.heading : res.displayName
  article.lead = data.data.lead ? data.data.lead : null

  return article
}

exports.prepareArticleList = function(data, scale, featured) {
  if (!data.count) return []
  scale = scale || 'block(5,2)'

  var list = data.hits.map(function(res) {
    var article = {}
    article.id = res._id
    article.path = portal.pageUrl({
      path: res._path
    })
    article.created = res.createdTime
    article.heading = res.displayName

    if (!res.data) return article

    article.modifiedTime = res.modifiedTime ? res.modifiedTime : null
    article.image = imageLib.image.create(res.data.image, scale)
    article.authors = res.data.authors ? res.data.authors : null
    article.heading = res.data.heading ? res.data.heading : res.displayName
    article.lead = res.data.lead ? res.data.lead : null

    return article
  })

  return list
}

function processCommonFields(data, scale) {
  if (!data) return

  data.authors && (data.authors = getAuthors(data.authors))
  data.image && (data.image = imageLib.image.create(data.image, scale))

  //data.createdTime && (data.createdTimeRelative = moment(data.createdTime).locale(data.locale).format('D. MMM'))
  data.createdTime &&
    (data.createdTimeRelative = moment(data.createdTime)
      .locale(data.locale)
      .fromNow())
  data.modifiedTime &&
    (data.modifiedTimeRelative = moment(data.modifiedTime)
      .locale(data.locale)
      .fromNow())

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

    // Name
    if (content && content.data && content.data.name) {
      author.name = content.data.name
    } else {
      author.name = content.displayName
    }

    // Profile image
    if (content && content.data && content.data.image) {
      author.image = imageLib.image.create(content.data.image, 'square')
    } else {
      // Handle no profile image
    }

    // Profile video
    if (content && content.data && content.data.video) {
      author.video = portal.attachmentUrl({ id: content.data.video })
    }

    // Email
    if (content && content.data && content.data.email) {
      author.email = content.data.email
    }

    if (content && content.data && content.data.role) {
      author.role = content.data.role
    }

    if (content && content.data && content.data.email) {
      author.email = content.data.email
    }

    if (content && content.data && content.data.mobile) {
      author.mobile = content.data.mobile
    }

    if (content && content.data && content.data.department) {
      author.department = content.data.department
    }

    if (content && content.data && content.data.bio) {
      author.bio = content.data.bio
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
          block.ctb.sidebarbox.icon =
            block.ctbSettings.sidebarbox.sidebarboxIcon
        }
        block.ctb.sidebarbox.contents =
          block.ctbSettings.sidebarbox.sidebarboxContents
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
          'orange',
          'red',
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

    // Get Google Maps key
    if (block.ctb._selected === 'ctbMap' && block.ctb.ctbMap) {
      var siteConfig = portal.getSiteConfig()
      var googleMapsKey = siteConfig.googleMapsKey
        ? siteConfig.googleMapsKey
        : null
      if (googleMapsKey) {
        block.ctb.ctbMap.googleMapsKey = googleMapsKey
      }

      if (block.ctb.ctbMap.mapDistricts) {
        var selectedDistricts = util.forceArray(block.ctb.ctbMap.mapDistricts)
        block.ctb.ctbMap.mapGeoJSON = JSON.stringify(
          districts.generateGeoJSON(selectedDistricts)
        )
      }

      if (block.ctb.ctbMap.mapMarkers) {
        var markers = []
        util.forceArray(block.ctb.ctbMap.mapMarkers).forEach(function(marker) {
          markers.push([marker])
        })
        block.ctb.ctbMap.mapMarkers = util.forceArray(markers)
      }
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
  var image
  b.images = b.images.map(function(image) {
    image = imageLib.image.create(image, scale)
    return image
  })
  return b
}
exports.processBlockImages = processBlockImages

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
  if (
    cameraInfo &&
    cameraInfo.orientation &&
    /(90|270)/.test(cameraInfo.orientation)
  ) {
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
  if (content && content.data && content.data.heading)
    return content.data.heading
  if (content && content.data && content.data.name) return content.data.name
  if (content && content.data && content.data.title) return content.data.title
  if (content) return content.displayName
  return false
}
