var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var contentPrep = require('/lib/labs/content-prep.js')

exports.get = function (req) {
  var content = portal.getContent()

  var model = contentPrep.prepareArticleContents(content.data, 'block(5,2)')

  const siteConfig = portal.getSiteConfig()
  siteConfig.googleMapsKey && (model.googleMapsKey = siteConfig.googleMapsKey)

  var view = resolve('./category.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html',
  }
}
