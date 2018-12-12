var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var imageLib = require('image')
var contentLib = require('/lib/xp/content')

exports.get = function(req) {
  var component = portal.getComponent()
  var model = component.config || {}

  model.image = model.image && imageLib.image.create(model.image)

  if (model.primaryLink) {
    var page = contentLib.get({ key: model.primaryLink })

    model.primary = {
      url: portal.pageUrl({
        id: model.primaryLink
      }),
      label:
        model.primaryLinkLabel ||
        (page && page.data && page.data.heading) ||
        page.displayName
    }
  }

  if (model.secondaryLink) {
    var page = contentLib.get({ key: model.secondaryLink })
    model.secondary = {
      url: portal.pageUrl({
        id: model.secondaryLink
      }),
      label:
        model.secondaryLinkLabel ||
        (page && page.data && page.data.heading) ||
        page.displayName
    }
  }

  var view = resolve('./site-hero.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
