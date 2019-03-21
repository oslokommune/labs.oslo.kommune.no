var portalLib = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var cacheLib = require('/lib/xp/cache')
var imageLib = require('image')
var util = require('util')

var imageCache = cacheLib.newCache({
  size: 100,
  expire: 60 * 60 * 24
})

exports.get = function(req) {
  var startTime = +new Date()
  var limit = req.params.limit || 100
  var searchResults = [],
    total = 0
  var latlong = '59.9127300,10.7460900'
  if (req.params.latlong) {
    latlong = req.params.latlong.replace(/(['"*+?^=!:$<>{}()|\[\]\/\\])/g, '')
  }

  var site = portalLib.getSite()
  var queryParams = {
    count: limit,
    start: 0,
    sort: "geoDistance('data.coordinates', '" + latlong + "') ASC",
    contentTypes: [app.name + ':poi'],
    query: "_path like '/content" + site._path + "/*'"
  }

  var r = contentLib.query(queryParams)

  if (r && r.count) {
    total = r.total
    r.hits.map(function(item) {
      if (item.data) {
        searchResults.push({
          heading: item.data.heading,
          lead: item.data.lead,
          image: getImage(item),
          coordinates: item.data.coordinates
        })
      }
    })
  }

  var endTime = +new Date()
  var timeSpent = endTime - startTime

  return {
    body: {
      hits: searchResults,
      total: total,
      time: timeSpent + 'ms',
    },
    status: 200,
    contentType: 'application/json; charset=utf-8'
  }
}

/**
 * Helper function to build and cache image urls, as these are quite heavy
 * @param {*} content The content object from the result
 */
function getImage(content) {
  if (content && content.data && content.data.image)
    return getImageFromCache(content.data.image)
  return false
}

function getImageFromCache(imageId) {
  return imageCache.get(imageId, function() {
    return imageLib.image.create(imageId, 'block(1600,900)', null, null, 80, false, true)
    // key, scale, filter, format, quality, responsive, type
  })
}
