var portal = require('/lib/xp/portal')

exports.macro = function (context) {
  let id = context.params.id
  let secret = ''
  const title = context.params.title || 'Video'
  const aspectRatio = context.params.aspectRatio

  const defaultAspectRatio = '16:9'
  let ratio

  if (aspectRatio) {
    ratio = aspectRatio.trim().split(':')
  } else {
    ratio = defaultAspectRatio.split(':')
  }

  const paddingTop = (ratio[1] / ratio[0]) * 100 + '%'

  if ((id.match(/\//g) || []).length === 1) {
    const parts = id.split('/')
    id = parts[0]
    secret = `h=${parts[1]}&`
  }

  const html = `
<div class="" style="position: relative; padding-top:${paddingTop};">
  <iframe
    src="https://player.vimeo.com/video/${id}?${secret}texttrack=no&color=da28d3&title=0&byline=0&portrait=0"
    style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen
    mozallowfullscreen allowfullscreen title="${title}">
  </iframe>
</div>
`

  return {
    body: html,
    pageContributions: {},
  }
}
