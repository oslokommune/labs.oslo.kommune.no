var portal = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var thymeleaf = require('/lib/thymeleaf')
var contentPrep = require('/lib/labs/content-prep.js')
var cacheLib = require('/lib/cache')
var related = require('/lib/labs/related.js')

var articleCache = cacheLib.newCache({
  size: 300,
  expire: 60 * 60 * 24,
})

exports.get = function (req) {
  var startTime = +new Date()

  var content = portal.getContent()
  var component = portal.getComponent()
  var config = component.config
  var model = {}

  const site = portal.getSite()
  const isFrontpage = site._path === content._path

  /**
   * Small hack to enable this part to be used as a template part.
   * If content type is a category itself we override category filter
   */
  var categories = config.categories
  if (content.type === app.name + ':category') {
    categories = content._id
  }

  model.heading = config.heading
  model.presentationMode = config.presentationMode

  var scaleLandscapeFeatured = 'block(3,2)'
  var scaleLandscape = 'block(3,2)'
  var scalePortraitFeatured = 'block(1,1)'
  var scalePortrait = 'block(1,1)'

  if ('compact' === config.presentationMode) {
    scaleLandscapeFeatured = 'block(3,1)'
    scaleLandscape = 'block(1,1)'
    scalePortraitFeatured = 'block(4,3)'
    scalePortrait = 'block(3,2)'
  }

  var queryConfig = {
    start: req.params.start,
    count: config.count,
    path: content._path,
    selectedItems: config.featured,
    contentTypes: ['article', 'video'],
    categoryFilter: categories,
    onlyChildren: config.onlyChildren,
    paging: config.paging,
    isFrontpage: isFrontpage,
  }

  var result = related.getContentList(queryConfig)

  if (result) {
    if (result.selectedHits && result.selectedHits.length) {
      // model.featuredHits = prepareData(result.selectedHits, req.mode);
      model.featured = prepareData(
        result.selectedHits,
        scaleLandscapeFeatured,
        scalePortraitFeatured,
        req.mode,
        config.presentationMode
      )
    }
    if (result.queryHits && result.queryHits.length) {
      // model.hits = prepareData(result.queryHits, req.mode);
      model.articles = prepareData(result.queryHits, scaleLandscape, scalePortrait, req.mode, config.presentationMode)
    }
    if (result.hasOwnProperty('firstPage')) {
      model.firstPage = result.firstPage
    }
    if (result.paging) {
      model.paging = result.paging
    }
  }

  if (config.seeAllLink && !model.paging) {
    model.seeAllLink = {}
    model.seeAllLink.href = portal.pageUrl({
      id: config.seeAllLink,
    })
    if (config.seeAllLinkText) {
      model.seeAllLink.text = config.seeAllLinkText
    } else {
      model.seeAllLink.text = contentLib.get({
        key: config.seeAllLink,
      }).displayName
    }
  }

  model.live = req.mode == 'live'
  model.hasContent = (model.featured && model.featured.length) || (model.articles && model.articles.length)
  var endTime = +new Date()
  model.controllerPageTime = 'Controller time: ' + String(endTime - startTime) + 'ms'
  var view = resolve('./article-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html',
  }
}

function prepareData(hits, scaleLandscape, scalePortrait, mode, presentationMode) {
  return hits.map(function (resultItem) {
    return articleCache.get(
      resultItem._id +
        resultItem._path +
        resultItem.modifiedTime +
        scaleLandscape +
        scalePortrait +
        mode +
        presentationMode,
      function () {
        if (resultItem.data) {
          resultItem.data = contentPrep.prepareFeaturedArticle(resultItem, scaleLandscape, scalePortrait)
          var categories = related.getCategories(resultItem)
          if (categories.length) {
            resultItem.data.categories = categories
          }
        }
        return resultItem.data
      }
    )
  })
}
