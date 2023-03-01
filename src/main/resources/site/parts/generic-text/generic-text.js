var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var util = require('/lib/labs/util.js')

exports.get = function (req) {
  var component = portal.getComponent()
  var model = component.config
  if (model) {
    if (model.lead) {
      model.lead = util.paragraphify(model.lead)
    }
    if (model.body) {
      model.body = portal.processHtml({
        value: model.body,
        imageWidths: [256, 512, 1024, 2048],
        imageSizes: '(max-width:768px) 95vw, 657px',
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
    contentType: 'text/html',
  }
}
