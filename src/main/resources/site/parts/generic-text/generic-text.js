var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var util = require('/lib/util.js')

exports.get = function(req) {
  var component = portal.getComponent()
  var model = component.config
  if (model) {
    if (model.lead) {
      model.lead = util.paragraphify(model.lead)
    }
    if (model.body) {
      model.body = portal.processHtml({
        value: model.body
      })
    }
  }

  model.live = req.mode == 'live'
  model.hasContent =
    model.hasOwnProperty('preHeading') ||
    model.hasOwnProperty('heading') ||
    model.hasOwnProperty('subHeading') ||
    model.hasOwnProperty('lead') ||
    model.hasOwnProperty('body')

  var view = resolve('./generic-text.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
