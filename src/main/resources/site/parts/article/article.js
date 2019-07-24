var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var util = require('/lib/labs/util.js')
var contentPrep = require('/lib/labs/content-prep.js')
var related = require('/lib/labs/related.js')

exports.get = function(req) {
  var content = portal.getContent()

  // Move publish metadata to data
  content.createdTime && (content.data.createdTime = content.createdTime)
  content.modifiedTime && (content.data.modifiedTime = content.modifiedTime)
  content.data.locale = util.getMomentLocale(content)

  var model = contentPrep.prepareArticleContents(content.data, 'block(5,2)')

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
