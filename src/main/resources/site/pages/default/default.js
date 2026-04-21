const portal = require('/lib/xp/portal')
const thymeleaf = require('/lib/thymeleaf')
const menuLib = require('/lib/labs/menu.js')

exports.get = function (req) {
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

  model.menuItems = menuLib.getMenuItems(content._path)

  const styles = `<link rel='stylesheet' href='${portal.assetUrl({ path: 'styles/main.css' })}'>`
  const vendorScripts = `<script defer src='${portal.assetUrl({ path: 'scripts/vendors.js' })}'></script>`
  const scripts = `<script defer src='${portal.assetUrl({ path: 'scripts/main.js' })}'></script>`

  const view = resolve('default.html')
  const body = thymeleaf.render(view, model)

  return {
    body: body,
    pageContributions: {
      headEnd: [styles, vendorScripts, scripts],
    },
  }
}
