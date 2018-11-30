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

  model.articles = cUtil.prepareArticleList(result, 'block(3,2)')


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
