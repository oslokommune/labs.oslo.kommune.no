var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var util = require('util')
var cUtil = require('content-util')
var contentLib = require('/lib/xp/content')

exports.get = function(req) {
  var component = portal.getComponent()
  var config = component.config
  var model = {}

  model.heading = config.heading || null

  var max = config.max || 4

  // Find articles
  var siteReferencePath = portal.getContent()._path.split('/')[1]
  var result = contentLib.query({
    start: 0,
    count: max,
    contentTypes: [app.name + ':article'],
    query: "_path LIKE '/content/" + siteReferencePath + "/*'",
    sort: 'createdTime DESC'
  })

  model.articles = cUtil.prepareExperimentList(
    result,
    'block(2,3)',
    'block(3,1)'
  )

  var view = resolve('./experiment-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
