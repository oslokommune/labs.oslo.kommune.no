var portal = require('/lib/xp/portal');

exports.getServerName = function () {
  // You set servername in config/system.properties with the key xp.name
  return Java.type('com.enonic.xp.server.ServerInfo').get().getName();
};

exports.paragraphify = function (content) {
  var safeContent = portal.sanitizeHtml(content);
  return '<p>' + safeContent.replace(/\n([ \t]*\n)+/g, '</p><p>')
          .replace(/\n/g, '<br />') + '</p>';
};

exports.nl2br = function (content) {
  var safeContent = portal.sanitizeHtml(content);
  return safeContent.replace(/\n/g, '<br />');
};

exports.htmlEntities = function (str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

exports.mailEncode = function (str) {
  return '=?UTF8?B?' + encodingLib.base64Encode(str) + '?=';
};

exports.forceArray = function (object) {
  if (!object || (typeof(object) === 'object' && !Object.keys(object).length)) {
      return []
  } else if (object.constructor != Array || typeof(object) === 'string') {
      return [object]
  } else {
      return object
  }
};

exports.guid = function guid() {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
};

exports.getLanguage = function () {
  return portal.getSite().language;
};

exports.getContentLocale = function (content) {
  var locale = getLanguage();
  if (content && content.language) {
      locale = content.language;
  }
  return locale;
};

exports.getMomentLocale = function (content) {
  // Moment doesn't have 'no' translation, so we force it to 'nb' instead
  var locale = getContentLocale(content);
  if ('no' === locale || 'no_NO' === locale) {
      locale = 'nb';
  }
  return locale;
};
