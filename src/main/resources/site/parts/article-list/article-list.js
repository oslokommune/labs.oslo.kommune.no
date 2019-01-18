var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var util = require('util')
var cUtil = require('content-util')
var contentLib = require('/lib/xp/content')
var cacheLib = require('/lib/xp/cache')
var related = require('related')

var articleCache = cacheLib.newCache({
  size: 300,
  expire: 60 * 60 * 24
})

exports.get = function(req) {

  var startTime = +new Date()

  var content = portal.getContent()
  var component = portal.getComponent()
  var config = component.config
  var model = {}

  model.heading = config.heading

  var queryConfig = {
    start: req.params.start,
    count: config.count,
    path: content._path,
    selectedItems: config.featured,
    contentTypes: [
      'article'
    ],
    categoryFilter: config.categories
  }

  var result = related.getContentList(queryConfig);

  if (result) {
    if (result.selectedHits && result.selectedHits.length) {
      // model.featuredHits = prepareData(result.selectedHits, req.mode);
      model.featured = prepareData(result.selectedHits, 'block(3,2)', req.mode)
    }
    if (result.queryHits && result.queryHits.length) {
      // model.hits = prepareData(result.queryHits, req.mode);
      model.articles = prepareData(result.queryHits, 'block(3,2)', req.mode)
    }
    if (result.hasOwnProperty('firstPage')) {
      model.firstPage = result.firstPage
    }
    if (result.paging) {
      model.paging = result.paging;
    }
  }

  model.live = req.mode == 'live'
  model.hasContent = ((model.featured && model.featured.length) || (model.articles && model.articles.length))
  var endTime = +new Date()
  model.controllerPageTime = 'Controller time: ' + String(endTime - startTime) + 'ms'
  var view = resolve('./article-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }

}

function prepareData(hits, scale, mode) {
  return hits.map(function(resultItem) {
    return articleCache.get(resultItem._id + resultItem.modifiedTime + mode, function() {
      if (resultItem.data) {
        resultItem.data = cUtil.prepareFeaturedArticle(resultItem, scale);
        var categories = related.getCategories(resultItem)
        if (categories.length) {
          resultItem.data.categories = categories
        }
      }
      return resultItem.data
    })
  })
}
