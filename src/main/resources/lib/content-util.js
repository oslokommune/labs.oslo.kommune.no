var util = require('util')
var portal = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var imageLib = require('image')

exports.prepareArticleContents = function(data, scale) {
  var data = processCommonFields(data, scale)

  data.contentBlocks && (data.contentBlocks = processContentBlocks(data.contentBlocks))

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
    article.mainImage = res.data.mainImage ? imageLib.image.create(res.data.mainImage, scale) : null
    article.authors = res.data.authors ? res.data.authors : null
    article.title = res.data.heading ? res.data.heading : res.displayName
    article.lead = res.data.lead ? res.data.lead : null

    return article
  })

  return list
}

exports.getAuthors = getAuthors

function processCommonFields(data, scale) {
  if (!data) return

  data.authors && (data.authors = getAuthors(data.authors))

  return data
}

function getAuthors(authors) {
  if (!authors) return

  authors = util.forceArray(authors)
  authors = authors.map(function(author) {
    var a = contentLib.get({
      key: author
    })
    if (a && a.image) {
      a.image = imageLib.image.create(a.image)
    }
    return a
  })

  return authors
}

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
          'brown-beige',
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
      var b = block.ctb.ctbLinks
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
      log.info(b.links)
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
  log.info(JSON.stringify(b.links, null, 2))
  return b
}
exports.processBlockLinkList = processBlockLinkList

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
