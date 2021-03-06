var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')

exports.get = function(req) {
  var content = portal.getContent()
  var model = {}
  model.content = JSON.stringify(content, null, 2)
  model.req = JSON.stringify(req, null, 2)
  var view = resolve('./raw-data-dump.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
