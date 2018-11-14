var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var imageLib = require('image')
var cUtil = require('content-util')

exports.get = function(req) {
  var content = portal.getContent()
  var component = portal.getComponent()
  var model = {}

  var view = resolve('./search-results.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
