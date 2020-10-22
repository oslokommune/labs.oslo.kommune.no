const portal = require('/lib/xp/portal')
const thymeleaf = require('/lib/thymeleaf')
const menuLib = require('/lib/menu')
const util = require('/lib/labs/util.js')

exports.get = function(req) {
  const model = {}
  const content = portal.getContent()

  const siteConfig = portal.getSiteConfig()

  model.siteName = siteConfig.siteName

  // Store URL to search page
  if (siteConfig && siteConfig.searchPage) {
    model.searchPageUrl = portal.pageUrl({
      id: siteConfig.searchPage,
    })
  }

  // Store URL to search service
  model.searchURL = portal.serviceUrl({
    service: 'search',
    type: 'absolute',
  })

  siteConfig.googleMapsKey && (model.googleMapsKey = siteConfig.googleMapsKey)

  // Local hack for development
  // Store Site Path
  const site = portal.getSite()
  model.sitePath = '/'
  if (req.host === 'localhost' && site._path) {
    model.sitePath = site._path
  }

  model.siteLanguage = site.language || 'en'

  model.main = content.page.regions.main

  model.menuItems = menuLib.getMenuTree(2) // Get 2 levels of menu based on content setting 'Show in menu'.
  model.breadcrumbItems = menuLib.getBreadcrumbMenu({}) // Get a breadcrumb menu for current content.
  model.subMenuItems = menuLib.getSubMenus(content, 1) // Get 1 level of submenu (from current content)

  const serverName = util.getServerName().toLowerCase()
  const isProd = serverName === 'production' || serverName === 'prod' || serverName === 'test'
  const stylesPath = isProd ? 'styles/main.min.css' : 'styles/main.css'
  const vendorScriptsPath = isProd ? 'scripts/vendors.min.js' : 'scripts/vendors.js'
  const scriptsPath = isProd ? 'scripts/main.min.js' : 'scripts/main.js'
  const vendorScripts = `<script defer src='${portal.assetUrl({ path: vendorScriptsPath })}'></script>`
  const scripts = `<script defer src='${portal.assetUrl({ path: scriptsPath })}'></script>`
  const styles = `<link rel='stylesheet' href='${portal.assetUrl({ path: stylesPath })}'>`

  const view = resolve('default.html')
  const body = thymeleaf.render(view, model)

  return {
    body: body,
    pageContributions: {
      headEnd: [styles, vendorScripts, scripts],
    },
  }
}
