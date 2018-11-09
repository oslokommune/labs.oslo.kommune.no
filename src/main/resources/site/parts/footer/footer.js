var portal = require("/lib/xp/portal");
var thymeleaf = require("/lib/xp/thymeleaf");

exports.get = function(req) {
  var component = portal.getComponent();
  var model = {};

  if (component.config) {
    var config = component.config;
  }

  if (config.siteName) {
    model.siteName = config.siteName;
  }
  if (config.siteDescription) {
    model.siteDescription = config.siteDescription;
  }
  if (config.menuName) {
    model.menuName = config.menuName;
  }
  if (config.contactTitle) {
    model.contactTitle = config.contactTitle;
  }
  if (config.contactAddress) {
    model.contactAddress = config.contactAddress;
  }
  if (config.contactPhone) {
    model.contactPhone = config.contactPhone;
  }
  if (config.contactEmail) {
    model.contactEmail = config.contactEmail;
  }
  if (config.socialTitle) {
    model.socialTitle = config.socialTitle;
  }
  if (config.facebook) {
    model.facebook = config.facebook;
  }
  if (config.twitter) {
    model.twitter = config.twitter;
  }
  if (config.vimeo) {
    model.vimeo = config.vimeo;
  }
  if (config.instagram) {
    model.instagram = config.instagram;
  }

  var view = resolve("./footer.html");
  var body = thymeleaf.render(view, model);
  return {
    body: body,
    contentType: "text/html"
  };
};
