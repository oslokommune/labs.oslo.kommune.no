var portalLib = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var cacheLib = require('/lib/cache')
var i18nLib = require('/lib/xp/i18n')
var imageLib = require('/lib/image.js')
var util = require('/lib/util.js')
var cUtil = require('/lib/content-util.js')

var imageCache = cacheLib.newCache({
  size: 100,
  expire: 60 * 60 * 24
})

var nameCache = cacheLib.newCache({
  size: 2 /* /no and /en namespaces*/ ,
  expire: 60 * 60 * 24
})

exports.get = function(req) {
  var startTime = +new Date()

  var limit = req.params.limit || 20

  var searchResults = [],
    total = 0,
    nextPageStart = 0,
    next = false,
    qArr = [],
    qMod = '',
    q = ''

  var site = portalLib.getSite()
  var contentTypes = getContentTypes(site._path)
  var queryParams = {
    count: limit,
    start: 0,
    sort: '_score DESC',
    contentTypes: Object.keys(contentTypes),
    query: "_path like '/content" + site._path + "/*'",
    filters: {
      boolean: {
        mustNot: {
          hasValue: [{
            field: 'data.hideFromList',
            values: ['true']
          }]
        }
      }
    }
  }

  if (req.params.start) {
    if (util.isInt(req.params.start)) {
      queryParams.start = parseInt(req.params.start)
    }
  }

  if (req.params.q) {
    q = util.sanitizeParam(req.params.q)

    // Ngram only supports words up to 12 chars
    qArr = q.split(' ')
    qArr = qArr.map(function(word) {
      if (word.length > 12) {
        word = word.substr(0, 12)
      }
      return word
    })
    qMod = qArr.join(' ')

    queryParams.query +=
      " AND ( ngram('displayName^5, _allText', '" + qMod + "', 'AND')"
    if (qArr.length === 1) {
      // Single word query. Also look at path
      queryParams.query +=
        " OR ( ngram('displayName^5, _allText', '" +
        qMod +
        "', 'AND') AND _path like '*" +
        qMod +
        "*')"
      queryParams.query += " OR _path like '*" + qMod + "*'"
    }
    queryParams.query += ' )'
  } else {
    queryParams.sort = 'publish.from DESC'
  }

  var r = contentLib.query(queryParams)

  if (r && r.count) {
    r.hits.map(function(item) {
      searchResults.push({
        type: getTypeString(item, contentTypes),
        date: {
          iso: util.ymdDate(item.publish.from),
          pretty: util.dmyDate(item.publish.from)
        },
        authors: getAuthors(item),
        heading: cUtil.getHeading(item),
        lead: getLead(item),
        image: getImage(item),
        url: portalLib.pageUrl({
          path: item._path
        })
      })
    })
    total = r.total
    nextPageStart = queryParams.start + queryParams.count
    if (total > nextPageStart) {
      next = portalLib.serviceUrl({
        service: 'search',
        params: {
          q: q,
          start: String(nextPageStart)
        }
      })
    }
  }

  var endTime = +new Date()
  var timeSpent = endTime - startTime

  return {
    body: {
      hits: searchResults,
      total: total,
      time: timeSpent + 'ms',
      next: next
    },
    status: 200,
    contentType: 'application/json; charset=utf-8'
  }
}

/**
 * Helper function to prettify search result pre-heading
 * @param {*} content       The content object from the result
 * @param {*} contentTypes  Map of content type descriptions
 */
function getTypeString(content, contentTypes) {
  var items = []

  var type = contentTypes[content.type]
  if (type) {
    items.push(type)
  }
  return items.join(' · ')
}

/**
 * Helper function to extract a list of authors for an item
 * @param {*} content   The content object from the result
 */
function getAuthors(item) {
  var authors = []
  if (item.data && item.data.authors) {
    authors = util.forceArray(item.data.authors).map(function(authorId) {
      var author = contentLib.get({
        key: authorId
      })
      return {
        name: author.data.name,
        url: portalLib.pageUrl({
          id: authorId
        })
      }
    })
  }
  return authors
}

/**
 * Helper function to extract the best field to use for lead text when dealing with
 * multi type content. Prefers lead > bio
 * @param {*} content   The content object from the result
 */
function getLead(content) {
  if (content && content.data && content.data.lead) return content.data.lead
  if (content && content.data && content.data.bio) return content.data.bio
  return false
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
    return imageLib.image.create(imageId, 'square')
  })
}

/**
 * Helper function to translate and cache content type names
 * @param {*} pathKey   The root part of the content path (i.e. "no" in /content/no/urlpath)
 */
function getContentTypes(pathKey) {
  return nameCache.get(pathKey, function() {
    var contentTypes = {}
    contentTypes[app.name + ':article'] = i18nLib.localize({
      key: 'search.article'
    })
    contentTypes[app.name + ':landing-page'] = i18nLib.localize({
      key: 'search.landing-page'
    })
    contentTypes[app.name + ':person'] = i18nLib.localize({
      key: 'search.person'
    })
    contentTypes[app.name + ':category'] = i18nLib.localize({
      key: 'search.category'
    })
    return contentTypes
  })
}
