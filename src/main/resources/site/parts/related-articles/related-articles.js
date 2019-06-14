var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var related = require('/lib/labs-related.js')

exports.get = function(req) {

  var content = portal.getContent()
  var component = portal.getComponent()
  var config = component.config

  var model = related.getRelatedContent(content, {
    count: config.count,
    fallback: config.fallback || false,
    contentTypes: [
      'article'
    ],
    selectedItems: config.selectedItems,
    scale: 'block(16,9)'
  }) || {}

  model.heading = config.heading

  model.live = req.mode == 'live'
  model.hasContent = model.hits && model.hits.length
  model.count = model.hits.length

  var view = resolve('./related-articles.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }

}
