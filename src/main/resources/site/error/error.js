var thymeleaf = require('/lib/thymeleaf')

exports.handle404 = function(err) {
  var msg = 'LOAD"' + decodeURI(err.request.url) + '",8,1'
  msg = msg.replace(/(.{40})/g, '$1\n')
  msg += '\nSEARCHING'
  msg += '\n' + err.status
  var body = thymeleaf.render(resolve('404.html'), {
    errorMessage: msg
  })
  return {
    contentType: 'text/html',
    body: body
  }
}

exports.handleError = function(err) {
  log.error(JSON.stringify(err, null, 2))

  var debugMode = err.request.params.debug === 'true'
  if (debugMode && err.request.mode === 'preview') {
    return
  }

  var params = {
    errorCode: err.status
  }

  var body = thymeleaf.render(resolve('error.html'), params)

  return {
    contentType: 'text/html',
    body: body
  }
}
