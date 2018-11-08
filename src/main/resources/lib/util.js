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

exports.getColorValueFromName = function(color) {
  var colors = {
    "blue": "#6fe9ff",
    "blue-light": "#b3f5ff",
    "purple": "#2a2859",
    "grey-lighter": "#f2f2f2",
    "grey-light": "#4a4a4a",
    "grey-dark": "#333333",
    "grey-darker": "#171414",
    "green": "#43f8b6",
    "green-dark": "#034b45",
    "green-light": "#4e807c",
    "green-lighter": "#c7f6c9",
    "green-faded": "#628c89",
    "brown": "#d0bfae",
    "brown-beige": "#f8f0dd",
    "orange": "#f9c66b",
    "red": "#ff8274",
    "yellow": "#F8F0DD",
    "white": "#FFFFFF",
    "black": "#000000"
  }
  return colors[color];
}

exports.sanitizeParam = function(str) {
  if (str) {
      return str.replace(/(['".*+?^=!:$<>{}()|\[\]\/\\])/g, '');
  }
};

exports.dmyDate = function (datestr) {
  var date = new Date(datestr);
  var day = date.getDate();
  var month = date.getMonth();
  month = parseInt(month);
  month = month + 1;
  var year = date.getFullYear();
  var prettydate = day + "." + month + "." + year;
  return prettydate;
};

exports.ymdDate = function (datestr) {
  var date = new Date(datestr);
  var day = date.getDate();
  var month = date.getMonth();
  month = parseInt(month);
  month = month + 1;
  var year = date.getFullYear();
  var ymdDate = [("0000" + year).slice(-4), ("00" + month).slice(-2), ("00" + day).slice(-2)].join("-");
  return ymdDate;
};
