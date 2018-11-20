var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var util = require('util')
var cUtil = require('content-util')
var contentLib = require('/lib/xp/content')

exports.get = function(req) {
  var component = portal.getComponent()
  var config = component.config
  var model = {}
  var featured = null

  model.heading = config.heading || null

  // Increase max articles when featured is defined
  // To ensure that the article list contains the
  // correct amount of items (excluding featured)
  if (config.featured) {
    featured = contentLib.get({ key: config.featured })
    config.max++
  }

  // Find articles
  var siteReferencePath = portal.getContent()._path.split('/')[1]
  var result = contentLib.query({
    start: 0,
    count: config.max || 100,
    contentTypes: [app.name + ':article'],
    query: "_path LIKE '/content/" + siteReferencePath + "/*'",
    sort: 'createdTime DESC'
  })

  if (featured && featured._id) {
    result.hits = result.hits.filter(function(item) {
      return item._id != featured._id
    })

    if (result.hits.length > config.max) {
      result.hits.pop()
    }

    model.featured = cUtil.prepareFeaturedArticle(featured, 'block(5,2)')
  }

  // Prepare model
  model.articles = cUtil.prepareArticleList(result, 'block(5,2)')

  var view = resolve('./article-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
