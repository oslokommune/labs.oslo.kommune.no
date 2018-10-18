var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function (req) {

    var model = {};
    var content = portal.getContent();

    // Extract the main region which contains component parts and inject it into the model
    model.main = content.page.regions.main;

    var view = resolve('default.html');
    var body = thymeleaf.render(view, model);

    return {
        body: body
    }
};
