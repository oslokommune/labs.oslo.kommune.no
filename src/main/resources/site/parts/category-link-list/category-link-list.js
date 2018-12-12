var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var imageLib = require('image')
var util = require('util')

exports.get = function(req) {
  var component = portal.getComponent()
  var config = component.config
  var model = {}

  model.heading = config.heading || null
  model.categories = []

  util.forceArray(config.categories).forEach(function(cat) {
    cat.image = imageLib.image.create(cat.image, 'block(1,1)')
    cat.color = util.getColorValueFromName(cat.color)
    model.categories.push(cat)
  })

  var view = resolve('./category-link-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
