var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/thymeleaf')
var contentLib = require('/lib/xp/content')
var contentPrep = require('/lib/labs/content-prep.js')

exports.get = function (req) {
  var content = portal.getContent()

  var model = {}

  var query = "_path LIKE '/content/*'"
  var result = contentLib.query({
    start: 0,
    count: 20,
    query: query,
    contentTypes: [app.name + ':article', app.name + ':video'],
    sort: 'createdTime DESC',
    filters: {
      hasValue: {
        field: 'data.authors',
        values: [content._id],
      },
    },
  })

  model.articles = contentPrep.prepareArticleList(result, 'block(4,3)')

  if (content.data && content.data.name) {
    model.name = content.data.name
  } else {
    model.name = content.displayName
  }

  var view = resolve('./person.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html',
  }
}
