var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var util = require('util')
var cUtil = require('content-util')

exports.get = function(req) {
  var component = portal.getComponent()
  var model = {}
  model.data = cUtil.processBlockLinkList(component.config)
  var settings = {}
  settings.isFullWidth = true
  model.settings = settings
  model.live = req.mode == 'live'
  model.hasContent = model && model.data && model.data.hasOwnProperty('links')
  var view = resolve('./block-link-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
