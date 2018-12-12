var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var imageLib = require('image')

exports.get = function(req) {
  var component = portal.getComponent()
  var config = component.config
  var model = {}

  model.heading = config.heading || null
  model.subheading = config.subheading || null
  model.vimeoId = config.vimeoId || null
  model.image = config.image ? imageLib.image.create(config.image) : null

  log.info(JSON.stringify(model, null, 2))

  var view = resolve('./site-hero.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
