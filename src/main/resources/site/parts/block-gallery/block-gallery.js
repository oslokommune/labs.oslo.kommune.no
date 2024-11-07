var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var contentPrep = require('/lib/labs/content-prep.js')

exports.get = function (req) {
  var component = portal.getComponent()
  var model = {}
  model.data = contentPrep.processBlockGallery(component.config)
  model.data.isFullWidth = true
  model.live = req.mode == 'live'
  model.hasContent = model && model.data && model.data.hasOwnProperty('galleryImages')
  var view = resolve('./block-gallery.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html',
  }
}
