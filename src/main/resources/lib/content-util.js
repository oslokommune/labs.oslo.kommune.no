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

var prepareFeaturedArticle = function(content, scaleLandscape, scalePortrait) {
  var singleImage = scaleLandscape === scalePortrait || scalePortrait == null

  var article = {}
  article.id = content._id
  article.path = portal.pageUrl({
    path: content._path
  })
  article.created = content.createdTime
  article.modifiedTime = content.modifiedTime ? content.modifiedTime : null
  article.heading = content.displayName

  if (!content.data) return article

  if (singleImage) {
    article.image = content.data.image
      ? imageLib.image.create(content.data.image, scaleLandscape)
      : imageLib.image.placeholder(scaleLandscape)
  } else {
    article.image = content.data.image
      ? imageLib.image.create(content.data.image, scaleLandscape)
      : imageLib.image.placeholder(scaleLandscape)
    article.image.portrait = content.data.image
      ? imageLib.image.create(content.data.image, scalePortrait)
      : imageLib.image.placeholder(scalePortrait)
  }
  article.heading = content.data.heading
    ? content.data.heading
    : content.displayName
  article.lead = content.data.lead

  return article
}

exports.prepareFeaturedArticle = prepareFeaturedArticle

exports.prepareArticleList = function(data, scale) {
  if (!data.count) return []
  scale = scale || 'block(16,9)'
  var list = data.hits.map(function(res) {
    return prepareFeaturedArticle(res, scale)
  })
  return list
}

function processCommonFields(data, scale) {
  if (!data) return

  data.authors && (data.authors = getAuthors(data.authors))
  data.image && (data.image = imageLib.image.create(data.image, scale))

  if (data.createdTime) {
    data.createdTimeShort = moment(data.createdTime)
      .locale(data.locale)
      .format('l')
    data.createdTimeRelative = moment(data.createdTime)
      .locale(data.locale)
      .fromNow()
  }
  if (data.modifiedTime) {
    data.modifiedTimeShort = moment(data.modifiedTime)
      .locale(data.locale)
      .format('l')
    data.modifiedTimeRelative = moment(data.modifiedTime)
      .locale(data.locale)
      .fromNow()
  }

  data.body &&
    (data.body = portal.processHtml({
      value: data.body
    }))

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
      author.video = portal.attachmentUrl({
        id: content.data.video
      })
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
        block.ctb.sidebarbox.contents = portal.processHtml({
          value: block.ctbSettings.sidebarbox.sidebarboxContents
        })
      }

      // SidebarImage
      if (selected.indexOf('sidebarImage') > -1) {
        block.ctb.sidebarImage = {}
        if (block.ctbSettings.sidebarImage.image) {
          var image = block.ctbSettings.sidebarImage.image
          block.ctb.sidebarImage.image = imageLib.image.create(image)
        }
        if (block.ctbSettings.sidebarImage.caption) {
          block.ctb.sidebarImage.caption = portal.processHtml({
            value: block.ctbSettings.sidebarImage.caption
          })
        }
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

    // Process text block. Mainly for fixing image references
    if (block.ctb._selected === 'ctbText' && block.ctb.ctbText) {
      block.ctb.ctbText.content = portal.processHtml({
        value: block.ctb.ctbText.content
      })
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

    // Markers and District overlays
    if (block.ctb._selected === 'ctbMap' && block.ctb.ctbMap) {
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

var processCategoryTeaser = function(categories, scale) {
  var teaserList = []
  util.forceArray(categories).forEach(function(item) {
    item.image && (item.image = imageLib.image.create(item.image, scale))
    item.color = util.getColorValueFromName(item.color)
    var link = {
      href: '#'
    }
    if (item.internalLink || item.externalLink) {
      if (item.internalLink) {
        link.href = portal.pageUrl({
          id: item.internalLink
        })
      } else {
        link.href = item.externalLink
        if (!/^https?:\/\//i.test(link.href)) {
          link.href = 'https://' + link.href // Add protocol to href if missing...
        }
      }
    }
    item.link = link
    teaserList.push(item)
  })
  return teaserList
}
exports.processCategoryTeaser = processCategoryTeaser

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

/**
 *
 * @param path
 * @param totalPosts
 * @param start
 * @param configCount
 * @returns {{}}
 */
exports.calculatePaging = function(path, totalPosts, start, configCount) {
  var p = {}
  var params

  if (configCount > 0 && start < totalPosts) {
    p.currentPage = String(Math.floor((start + 1) / configCount) + 1)
    p.totalPages = String(Math.ceil(totalPosts / configCount))
  }

  var nextPageStart = start + configCount
  if (totalPosts > nextPageStart) {
    // Show next link
    params = {
      start: String(nextPageStart)
    }
    p.next = portal.pageUrl({
      path: path,
      params: params
    })
  }

  if (start > 0) {
    var prevPageStart = start - configCount
    if (prevPageStart < 1) {
      // Shouldn't happen, but someone could be playing with the params
      p.prev = portal.pageUrl({
        path: path
      })
    } else {
      // Show prev link
      params = {
        start: String(prevPageStart)
      }
      p.prev = portal.pageUrl({
        path: path,
        params: params
      })
    }
    if (prevPageStart > 0) {
      // Also display "home" link, if prev link > beginning
      p.home = portal.pageUrl({
        path: path
      })
    }
  }

  return p
}
