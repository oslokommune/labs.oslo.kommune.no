var portal = require('/lib/xp/portal')
var moment = require('/assets/moment/2.24.0/moment.js')

exports.getServerName = function() {
  // You set servername in config/system.properties with the key xp.name
  return Java.type('com.enonic.xp.server.ServerInfo')
    .get()
    .getName()
}

exports.paragraphify = function(content) {
  var safeContent = portal.sanitizeHtml(content)
  return '<p>' + safeContent.replace(/\n([ \t]*\n)+/g, '</p><p>').replace(/\n/g, '<br />') + '</p>'
}

exports.nl2br = function(content) {
  var safeContent = portal.sanitizeHtml(content)
  return safeContent.replace(/\n/g, '<br />')
}

exports.htmlEntities = function(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

exports.mailEncode = function(str) {
  return '=?UTF8?B?' + encodingLib.base64Encode(str) + '?='
}

exports.forceArray = function(object) {
  if (!object || (typeof object === 'object' && !Object.keys(object).length)) {
    return []
  } else if (object.constructor != Array || typeof object === 'string') {
    return [object]
  } else {
    return object
  }
}

exports.guid = function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

var getLanguage = function() {
  return portal.getSite().language
}
exports.getLanguage = getLanguage

var getContentLocale = function(content) {
  var locale = getLanguage()
  if (content && content.language) {
    locale = content.language
  }
  return locale
}
exports.getContentLocale = getContentLocale

var getMomentLocale = function(content) {
  // Moment doesn't have 'no' translation, so we force it to 'nb' instead
  var locale = getContentLocale(content)
  if ('no' === locale || 'no_NO' === locale) {
    locale = 'nb'
  }
  return locale
}
exports.getMomentLocale = getMomentLocale

exports.getColorValueFromName = function(color) {
  var colors = {
    'blue-dark': '#2a2859',
    blue: '#6fe9ff',
    'blue-light': '#b3f5ff',
    red: '#ff8274',
    'green-dark': '#034b45',
    green: '#43f8b6',
    'green-light': '#4e807c',
    black: '#2c2c2c',
    yellow: '#f9c66b',
    'beige-dark': '#d0bfae',
    'beige-light': '#f8f0dd',
    white: '#ffffff',
    'grey-lighter': '#f2f2f2',
    'grey-light': '#4a4a4a',
    'grey-dark': '#333333',
    'grey-darker': '#171414',
  }
  return colors[color]
}

exports.sanitizeParam = function(str) {
  if (str) {
    return str.replace(/(['".*+?^=!:$<>{}()|\[\]\/\\])/g, '')
  }
}

exports.dmyDate = function(datestr) {
  return moment(datestr)
    .locale(getMomentLocale())
    .format('l')
}

exports.ymdDate = function(datestr) {
  return moment(datestr)
    .locale(getMomentLocale())
    .format('YYYYMMDD')
}

exports.isInt = function(value) {
  if (isNaN(value)) {
    return false
  }
  var x = parseFloat(value)
  return (x | 0) === x
}
