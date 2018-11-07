var portal = require("/lib/xp/portal");
var thymeleaf = require("/lib/xp/thymeleaf");
var imageLib = require("image");
var cUtil = require("content-util");

exports.get = function(req) {
  var content = portal.getContent();
  var component = portal.getComponent();
  var model = {};

  if (content.data && content.data.authors) {
    model.lead = content.data.lead;
  }

  if (content.data && content.data.authors) {
    model.authors = cUtil.getAuthors(content.data.authors);
  }

  if (component.config && component.config.videoId) {
    model.video = component.config.videoId;

    if (component.config.stickyVideo) {
      model.stickyVideo = true;
    }
  }

  if (content.data) {
    if (content.data.mainImage && !model.video) {
      model.image = imageLib.image.create(content.data.mainImage, "block(5,2)");
    }

    if (content.data.header) {
      model.header = content.data.header;
    } else {
      model.header = content.displayName;
    }

    if (content.data.subheader) {
      model.subheader = content.data.subheader;
    }
  }

  model.dump = content;

  var view = resolve("./hero.html");
  var body = thymeleaf.render(view, model);
  return {
    body: body,
    contentType: "text/html"
  };
};
