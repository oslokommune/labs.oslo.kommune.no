var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var cUtil = require('/lib/content-util.js')

exports.get = function(req) {
  var content = portal.getContent()
  var component = portal.getComponent()

  var model = cUtil.prepareHeroContents(content.data, 'block(5,1)')
  model.content = JSON.stringify(model, null, 2)
  model.hideLead = component && component.config && component.config.hideLead

  var view = resolve('./content-image-heading-lead-body.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
