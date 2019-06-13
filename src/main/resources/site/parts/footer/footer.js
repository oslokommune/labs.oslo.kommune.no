var portal = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var thymeleaf = require('/lib/thymeleaf')
var util = require('/lib/util.js')

exports.get = function(req) {
  var component = portal.getComponent()
  var model = {}

  if (component.config) {
    var config = component.config
  }

  if (config.heading) {
    model.heading = config.heading
  }
  if (config.description) {
    model.description = config.description
  }
  if (config.copyright) {
    model.copyright = config.copyright
  }
  if (config.menuName) {
    model.menuName = config.menuName
  }
  if (config.menuElement) {
    var ids = util.forceArray(config.menuElement)
    var items = ids.map(function(id) {
      var resultItem = contentLib.get({
        key: id
      })
      var url = portal.pageUrl({
        path: resultItem._path
      })
      var name =
        resultItem.data && resultItem.data.header ?
        resultItem.data.header :
        resultItem.displayName
      return {
        name: name,
        url: url
      }
    })
    model.menuElements = items
  }
  if (config.contactTitle) {
    model.contactTitle = config.contactTitle
  }
  if (config.contactAddress) {
    model.contactAddress = config.contactAddress
  }
  if (config.contactPhone) {
    model.contactPhone = config.contactPhone
  }
  if (config.contactEmail) {
    model.contactEmail = config.contactEmail
  }

  var view = resolve('./footer.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
