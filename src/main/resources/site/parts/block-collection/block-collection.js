var portal = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var thymeleaf = require('/lib/thymeleaf')
var contentPrep = require('/lib/labs/content-prep.js')
var util = require('/lib/labs/util.js')

exports.get = function(req) {
  var content
  var component = portal.getComponent()
  var config = component.config
  if (config && config.collection) {
    // if hardcoded content collection link
    content = contentLib.get({
      key: config.collection,
    })
    // Merge extra settings from part config into data object
    config.colorMain && (content.data.colorMain = config.colorMain)
    config.isFullWidth && (content.data.isFullWidth = config.isFullWidth)
  } else {
    // get default content for this url
    content = portal.getContent()
    content.data.isFullWidth = true
  }

  var model = {}
  model.data = contentPrep.processBlockLinkList(content.data)
  if (content.data.colorMain) {
    model.data.fill = content.data.colorMain
  }
  model.live = req.mode == 'live'
  model.hasContent = model && model.data && model.data.hasOwnProperty('links')
  var view = resolve('./block-collection.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html',
  }
}
