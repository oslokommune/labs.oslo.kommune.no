var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var contentPrep = require('/lib/labs/content-prep.js')

exports.get = function (req) {
  var component = portal.getComponent()
  var model = {}
  model.data = contentPrep.processBlockVideos(component.config)
  model.live = req.mode == 'live'
  model.hasContent = model && model.data && model.data.hasOwnProperty('videos')
  var view = resolve('./block-videos.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html',
  }
}
