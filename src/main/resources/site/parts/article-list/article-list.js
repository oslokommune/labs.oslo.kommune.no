var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var util = require('util')
var cUtil = require('content-util')
var contentLib = require('/lib/xp/content')

exports.get = function(req) {
  var component = portal.getComponent()
  var config = component.config
  var model = {}

  model.header = config.header || null

  // Find articles
  var siteReferencePath = portal.getContent()._path.split('/')[1]
  var result = contentLib.query({
    start: 0,
    count: config.max || 100,
    contentTypes: [app.name + ':article'],
    query: "_path LIKE '/content/" + siteReferencePath + "/*'",
    sort: 'createdTime DESC'
  })

  // Prepare model
  model.articles = cUtil.prepareArticleList(result, 'block(5,2)')

  var view = resolve('./article-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
