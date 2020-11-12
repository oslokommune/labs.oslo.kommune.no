var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var contentPrep = require('/lib/labs/content-prep.js')

exports.get = function(req) {
  var component = portal.getComponent()
  var model = {}
  model.data = contentPrep.processBlockLinkList(component.config)
  if (component.config.background) {
    model.data.background = component.config.background
  }
  model.live = req.mode == 'live'
  model.hasContent = model && model.data && model.data.hasOwnProperty('links')
  var view = resolve('./block-links.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html',
  }
}
