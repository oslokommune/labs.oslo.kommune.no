var portal = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var thymeleaf = require('/lib/xp/thymeleaf')
var util = require('util')

exports.get = function(req) {
  var component = portal.getComponent()
  var model = {}

  if (component.config) {
    var config = component.config
  }

  if (config.siteName) {
    model.siteName = config.siteName
  }
  if (config.siteDescription) {
    model.siteDescription = config.siteDescription
  }
  if (config.menuName) {
    model.menuName = config.menuName
  }
  if (config.menuElement) {
    var ids = util.forceArray(config.menuElement)
    var items = ids.map(function(id) {
      var resultItem = contentLib.get({ key: id })
      var url = portal.pageUrl({ path: resultItem._path })
      var name = resultItem.data && resultItem.data.header ? resultItem.data.header : resultItem.displayName
      return { name: name, url: url }
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
  if (config.socialTitle) {
    model.socialTitle = config.socialTitle
  }
  if (config.facebook) {
    model.facebook = config.facebook
  }
  if (config.twitter) {
    model.twitter = config.twitter
  }
  if (config.vimeo) {
    model.vimeo = config.vimeo
  }
  if (config.instagram) {
    model.instagram = config.instagram
  }

  var view = resolve('./footer.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
