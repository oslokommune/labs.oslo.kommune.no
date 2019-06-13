var thymeleaf = require('/lib/thymeleaf')
var portalLib = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var imageLib = require('/lib/image.js')

exports.get = function(req) {
  var site = portalLib.getSite()

  var model = {}

  var q1 = {
    count: 10000,
    contentTypes: [app.name + ':category'],
    query: "_path like '/content" + site._path + "/*'"
  }
  var r1 = contentLib.query(q1)

  var categoryList = {}
  if (r1 && r1.count && r1.hits) {
    r1.hits.forEach(function(item) {
      categoryList[item._id] = item.data
    })

    var categoryKeys = Object.keys(categoryList)

    // First we fetch all content (articles) and aggregate on categories
    var q2 = {
      count: 10000,
      contentTypes: [app.name + ':article'],
      query: "_path like '/content" + site._path + "/*'",
      filters: {
        hasValue: {
          field: 'x.no-kommune-oslo-labs.categories.categories',
          values: categoryKeys
        }
      },
      aggregations: {
        categories: {
          terms: {
            field: 'x.no-kommune-oslo-labs.categories.categories',
            order: '_count desc',
            size: 1000
          }
        }
      }
    }
    var r2 = contentLib.query(q2)

    var categoryCount = {}
    if (r2 && r2.count && r2.aggregations && r2.aggregations.categories && r2.aggregations.categories.buckets) {
      r2.aggregations.categories.buckets.forEach(function(item) {
        if (item.key && item.docCount) {
          categoryCount[item.key] = item.docCount
        }
      })

      // We now have both categories and counts. Lets combine and prepare.
      categoryKeys = Object.keys(categoryCount) // This one is sorted by count
      var category
      model.categories = []

      categoryKeys.forEach(function(key) {
        if (categoryCount[key] && categoryList[key]) {
          category = categoryList[key]
          category.url = portalLib.pageUrl({
            id: key
          })
          category.count = categoryCount[key]
          category.image && (category.image = imageLib.image.create(category.image, 'block(1,1)'))
          category.body && (category.body = portalLib.processHtml({
            value: category.body
          }))
          model.categories.push(category)
        }
      })
    }
  }

  var view = resolve('./category-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
