var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var imageLib = require ('image');


exports.get = function(req) {
    var content = portal.getContent();
		var model = {};
		
		model.image = imageLib.image.create(content.data.mainImage, 'block(5,2)');
		model.dump = content;

    var view = resolve('./hero.html');
    var body = thymeleaf.render(view, model);
    return {
        body: body,
        contentType: 'text/html'
    };
};
