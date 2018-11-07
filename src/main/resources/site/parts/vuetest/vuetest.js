var portal = require("/lib/xp/portal");
var thymeleaf = require("/lib/xp/thymeleaf");
var util = require("util");

exports.get = function(req) {
  var model = {};
  model.someData = {
    a: 'b',
    c: 'd'
  }
  var view = resolve("./vuetest.html");
  var body = thymeleaf.render(view, model);
  return {
    body: body,
    contentType: "text/html"
  };
};
