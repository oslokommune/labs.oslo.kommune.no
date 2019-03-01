var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var util = require('util')
var cUtil = require('content-util')
var related = require('related')

exports.get = function(req) {
  var content = portal.getContent()

  // Move publish metadata to data
  content.createdTime && (content.data.createdTime = content.createdTime)
  content.modifiedTime && (content.data.modifiedTime = content.modifiedTime)
  content.data.locale = util.getMomentLocale(content)

  var model = cUtil.prepareArticleContents(content.data, 'block(5,2)')

  var categories = related.getCategories(content)
  if (categories.length) {
    model.categories = categories
  }

  var view = resolve('./article.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
