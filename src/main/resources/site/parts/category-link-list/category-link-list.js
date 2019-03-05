var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var imageLib = require('image')
var util = require('util')
var cUtil = require('content-util')

exports.get = function(req) {
  var component = portal.getComponent()
  var config = component.config
  var model = {}

  model.heading = config.heading || null
  model.categories = cUtil.processCategoryLinkList(config.categories, 'square(1)')

  var view = resolve('./category-link-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
