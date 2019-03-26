var thymeleaf = require('/lib/xp/thymeleaf')
var portalLib = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var imageLib = require('image')

exports.get = function(req) {
  var site = portalLib.getSite()

  var model = {}

  // First we fetch all content (articles) and aggregate on categories
  var q1 = {
    count: 10000,
    contentTypes: [app.name + ':article'],
    query: "_path like '/content" + site._path + "/*'",
    filters: {
      exists: {
        field: 'x.no-kommune-oslo-labs.categories.categories'
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

  var r1 = contentLib.query(q1)

  var categoryCount = {}

  if (
    r1 &&
    r1.count &&
    r1.aggregations &&
    r1.aggregations.categories &&
    r1.aggregations.categories.buckets
  ) {
    //log.info(JSON.stringify(r, null, 2))
    r1.aggregations.categories.buckets.forEach(function(item) {
      if (item.key && item.docCount) {
        categoryCount[item.key] = item.docCount
      }
    })

    var categoryKeys = Object.keys(categoryCount)
    if (categoryKeys.length) {
      // OK, we have category bucket count. Let's fetch the categories themselves.

      var q2 = {
        count: 10000,
        contentTypes: [app.name + ':category'],
        query: "_path like '/content" + site._path + "/*'",
        filters: {
          ids: {
            values: categoryKeys
          }
        }
      }
      var r2 = contentLib.query(q2)

      var categoryList = {}
      if (r2 && r2.count && r2.hits) {
        r2.hits.forEach(function(item) {
          categoryList[item._id] = item.data
        })

        if (Object.keys(categoryList).length) {
          // We now also have the categories. Lets combine and prepare.

          var category = {}
          model.categories = categoryKeys.map(function(key) {
            category = categoryList[key]
            category.url = portalLib.pageUrl({
              id: key
            })
            category.count = categoryCount[key]
            category.image &&
              (category.image = imageLib.image.create(
                category.image,
                'block(1,1)'
              ))
            category.body &&
              (category.body = portalLib.processHtml({
                value: category.body
              }))
            return category
          })
        }
      }
    }
  }

  var view = resolve('./category-list.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
