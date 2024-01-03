const portal = require('/lib/xp/portal')
const thymeleaf = require('/lib/thymeleaf')
const util = require('/lib/labs/util.js')
const contentPrep = require('/lib/labs/content-prep.js')

exports.get = function (req) {
  const content = portal.getContent()

  // Move publish metadata to data
  content.createdTime && (content.data.createdTime = content.createdTime)
  content.modifiedTime && (content.data.modifiedTime = content.modifiedTime)
  content.publish && content.publish.from && (content.data.publishFromTime = content.publish.from)
  content.publish && content.publish.first && (content.data.publishFirstTime = content.publish.first)
  content.data.locale = util.getMomentLocale(content)

  var model = contentPrep.processCommonFields(content.data, 'width(1)')

  if (model.publishFirstTimeRelative) {
    model.published = model.publishFirstTimeRelative
  }
  if (model.modifiedTimeRelative && model.modifiedTimeRelative !== model.publishFirstTimeRelative) {
    model.modified = model.modifiedTimeRelative
  }

  // Define height of video player based on aspect ratio
  const defaultAspectRatio = '16:9'
  var ratio

  if (model.aspectRatio) {
    ratio = model.aspectRatio.trim().split(':')
  } else {
    ratio = defaultAspectRatio.split(':')
  }
  model.paddingTop = (ratio[1] / ratio[0]) * 100 + '%'

  if ((model.id.match(/\//g) || []).length === 1) {
    const parts = model.id.split('/')
    model.id = parts[0]
    model.secret = parts[1]
  }

  if (content.data && content.data.name) {
    model.name = content.data.title
  } else {
    model.name = content.displayName
  }

  var view = resolve('./video.html')
  var body = thymeleaf.render(view, model)
  return {
    body: body,
    contentType: 'text/html',
  }
}
