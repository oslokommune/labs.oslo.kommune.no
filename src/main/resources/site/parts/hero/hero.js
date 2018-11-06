var portal = require("/lib/xp/portal");
var thymeleaf = require("/lib/xp/thymeleaf");
var imageLib = require("image");

exports.get = function(req) {
  var content = portal.getContent();
  var component = portal.getComponent();
  var model = {};

  if (component.config && component.config.videoId) {
    model.video = component.config.videoId;

    log.info(JSON.stringify(component.config, null, 2));
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
