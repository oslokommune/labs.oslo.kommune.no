var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var imageLib = require('image')

exports.get = function(req) {
  var component = portal.getComponent()
  var model = {}
  model.searchURL = portal.serviceUrl({ service: 'search', type: 'absolute' })

  if (component.config && component.config.mainImage) {
    model.mainImage = imageLib.image.create(component.config.mainImage, 'block(6,1)')
  }

  var view = resolve('./search-results.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
