var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var contentLib = require('/lib/xp/content')
var cUtil = require('content-util')
var imageLib = require('image')

exports.get = function(req) {
  var content = portal.getContent()

  var model = {}

  var query = "_path LIKE '/content/*'"
  var result = contentLib.query({
    start: 0,
    count: 10,
    query: query,
    contentTypes: [app.name + ':article'],
    sort: 'createdTime DESC',
    filters: {
      hasValue: {
        field: 'data.authors',
        values: [content._id]
      }
    }
  })

  var items = []
  if (result.hits.length) {
    result.hits.forEach(function(content) {
      var item = {}

      if (content.data.image) {
        item.image = imageLib.image.create(content.data.image, 'block(4,3)')
      }

      item.id = content._id
      item.url = portal.pageUrl({ id: content._id })
      item.heading = cUtil.getHeading(content)
      items.push(item)
    })
    model.items = items
  }

  if (content.data && content.data.name) {
    model.name = content.data.name
  } else {
    model.name = content.displayName
  }

  var view = resolve('./person.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
