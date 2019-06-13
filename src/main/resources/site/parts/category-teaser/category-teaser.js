var portal = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var thymeleaf = require('/lib/thymeleaf')
var cUtil = require('/lib/content-util.js')

exports.get = function(req) {
  var component = portal.getComponent()
  var config = component.config
  var model = {}

  model.heading = config.heading || null
  model.categories = cUtil.processCategoryTeaser(config.categories, 'square(1)')

  if (config.seeAllLink) {
    model.seeAllLink = {}
    model.seeAllLink.href = portal.pageUrl({
      id: config.seeAllLink
    })
    if (config.seeAllLinkText) {
      model.seeAllLink.text = config.seeAllLinkText
    } else {
      model.seeAllLink.text = contentLib.get({
        key: config.seeAllLink
      }).displayName
    }
  }

  var view = resolve('./category-teaser.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
