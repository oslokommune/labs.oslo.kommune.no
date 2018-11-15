var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var contentLib = require('/lib/xp/content')
var util = require('util')
var menuLib = require('/lib/enonic/menu')

exports.get = function(req) {
  var model = {}
  var content = portal.getContent()

  // Store URL to search page
  var siteConfig = portal.getSiteConfig()

  if (siteConfig && siteConfig.searchPage) {
    model.searchPageUrl = portal.pageUrl({ id: siteConfig.searchPage })
  }

  model.main = content.page.regions.main

  model.menuItems = menuLib.getMenuTree(2) // Get 2 levels of menu based on content setting 'Show in menu'.
  model.breadcrumbItems = menuLib.getBreadcrumbMenu({}) // Get a breadcrumb menu for current content.
  model.subMenuItems = menuLib.getSubMenus(content, 1) // Get 1 level of submenu (from current content)

  var serverName = util.getServerName().toLowerCase()
  var isProd = serverName === 'production' || serverName === 'prod' || serverName === 'test'
  var stylesPath = isProd ? 'styles/main.min.css' : 'styles/main.css'
  var scriptsPath = isProd ? 'scripts/main.min.js' : 'scripts/main.js'
  var scripts =
    '<script async src="' +
    portal.assetUrl({
      path: scriptsPath
    }) +
    '"></script>'
  var styles =
    '<link rel="stylesheet" href="' +
    portal.assetUrl({
      path: stylesPath
    }) +
    '">'

  var view = resolve('default.html')
  var body = thymeleaf.render(view, model)

  return {
    body: body,
    pageContributions: {
      headEnd: [styles],
      bodyEnd: [scripts]
    }
  }
}
