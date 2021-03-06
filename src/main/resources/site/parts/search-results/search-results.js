var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var imageLib = require('/lib/labs/image.js')

exports.get = function(req) {
  var component = portal.getComponent()
  var model = {}
  model.searchURL = portal.serviceUrl({
    service: 'search',
    type: 'absolute'
  })

  if (component.config && component.config.image) {
    model.image = imageLib.image.create(component.config.image, 'block(6,1)')
  }

  var view = resolve('./search-results.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
