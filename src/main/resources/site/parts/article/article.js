var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var util = require('util');
var cUtil = require('content-util');




exports.get = function(req) {
    var content = portal.getContent();
		var model = cUtil.prepareArticleContents(content.data);

    var view = resolve('./article.html');
    var body = thymeleaf.render(view, model);
    return {
        body: body,
        contentType: 'text/html'
    };
};
