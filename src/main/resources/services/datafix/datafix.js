/*

Simple script to convert data structure for articles. Only to be used once.

http://local.labs.oslo.kommune.no:8080/admin/site/preview/default/draft/labs/_/service/no.kommune.oslo.labs/datafix

*/

var contentLib = require('/lib/xp/content')
var portalLib = require('/lib/xp/portal')
var util = require('/lib/labs/util.js')
const authLib = require('/lib/xp/auth')

exports.get = handleGet

function handleGet(req) {
  if (!authLib.hasRole('system.admin')) {
    return {
      status: 404,
    }
  }

  var site = portalLib.getSite()

  var q = contentLib.query({
    query: "_path LIKE '/content" + site._path + "/*'",
    count: 1000,
    contentTypes: [app.name + ':article'],
  })
  var errors = []
  var articles = []
  var skipped = []
  q.hits.forEach(function(content) {
    if (content.data.contentBlocks) {
      try {
        var modifiedContent = contentLib.modify({
          key: content._id,
          branch: 'draft',
          requireValid: false,
          editor: function(c) {
            var newBlocks = []
            util.forceArray(c.data.contentBlocks).forEach(function(item) {
              if (item.ctb && item.ctb._selected) {
                if (item.ctbSettings) {
                  item.ctb[item.ctb._selected].ctbSettings = item.ctbSettings
                }
                newBlocks.push(item.ctb)
              }
            })
            if (newBlocks.length) {
              c.data.contentBlocks = newBlocks
            }
            return c
          },
        })
        contentLib.publish({
          keys: [content._id],
          sourceBranch: 'draft',
          targetBranch: 'master',
          includeDependencies: true,
        })
        content = modifiedContent
        articles.push(content.displayName)
      } catch (e) {
        log.error(e.cause ? e.cause.message : e.message)
        errors.push(content.displayName + ' - ' + (e.cause ? e.cause.message : e.message))
      }
    } else {
      skipped.push(content.displayName)
    }
  })

  return {
    contentType: 'application/json',
    body: {
      skipped: skipped,
      articles: articles,
      errors: errors,
      query: q,
    },
  }
}
