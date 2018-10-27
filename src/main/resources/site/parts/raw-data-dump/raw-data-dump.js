var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function(req) {
    var content = portal.getContent();
    var model = {};
    model.dump = JSON.stringify(content, null, 2);
    var view = resolve('./raw-data-dump.html');
    var body = thymeleaf.render(view, model);
    return {
        body: body,
        contentType: 'text/html'
    };
};
