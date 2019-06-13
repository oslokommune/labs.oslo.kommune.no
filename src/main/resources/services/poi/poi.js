var portalLib = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var cacheLib = require('/lib/cache')
var imageLib = require('/lib/image.js')
var util = require('/lib/util.js')

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
    query: "_path like '/content" + site._path + "/*'",
    aggregations: {
      distance: {
        geoDistance: {
          field: "data.coordinates",
          unit: "m",
          origin: {
            lat: latlong.split(',')[0],
            lon: latlong.split(',')[1]
          },
          ranges: [{
              from: 0,
              to: 1000
            },
            {
              from: 1000,
              to: 2000
            },
            {
              from: 2000,
              to: 3000
            },
            {
              from: 3000
            }
          ]
        }
      }
    }
  }

  var r = contentLib.query(queryParams)

  if (r && r.count) {
    //log.info(JSON.stringify(r, null, 2))
    total = r.total
    var d
    r.hits.map(function(item) {
      if (item.data) {
        d = item.data
        d.lead && (d.leadHtml = util.paragraphify(d.lead))
        d.body && (d.body = portalLib.processHtml({
          value: d.body
        }))
        d.image && (d.image = getImageFromCache(d.image))
        searchResults.push(d)
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

function getImageFromCache(imageId) {
  return imageCache.get(imageId, function() {
    return imageLib.image.create(imageId, 'block(1600,900)', null, null, 80, false, true)
  })
}
