var portal = require('/lib/xp/portal')
var thymeleaf = require('/lib/xp/thymeleaf')
var imageLib = require('image')
var cUtil = require('content-util')

exports.get = function(req) {
  var content = portal.getContent()
  var component = portal.getComponent()
  var model = {}

  if (content.data && content.data.authors) {
    model.lead = content.data.lead
  }

  if (content.data && content.data.authors) {
    model.authors = cUtil.getAuthors(content.data.authors)
  }

  if (component.config && component.config.videoId) {
    model.video = component.config.videoId

    if (component.config.stickyVideo) {
      model.stickyVideo = true
    }
  }

  if (content.data) {
    if (content.data.image && !model.video) {
      model.image = imageLib.image.create(content.data.image, 'block(5,2)')
    }

    if (content.data.heading) {
      model.heading = content.data.heading
    } else {
      model.heading = content.displayName
    }

    if (content.data.subheading) {
      model.subheading = content.data.subheading
    }
  }

  model.dump = content

  var view = resolve('./hero.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html'
  }
}
