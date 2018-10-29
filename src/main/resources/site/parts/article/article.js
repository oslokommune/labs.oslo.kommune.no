var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var util = require('util');

exports.get = function(req) {
    var content = portal.getContent();
		var model = {};
		
		if(content.data) {
			if(content.data.contentBlocks) {
				model.contentBlocks = util.forceArray(content.data.contentBlocks);
			}
		}


		// Content Block Settings
		for(var i=0; i<model.contentBlocks.length; i++) {
			
			if(model.contentBlocks[i].ctbSettings) {

				// List of selected settings
				var selected = util.forceArray(model.contentBlocks[i].ctbSettings._selected);

				// Full Width
				if(selected.indexOf('fullWidth') > -1) {
					model.contentBlocks[i].isFullWidth = true;
				}

				// Background Fill
				if(selected.indexOf('bgFill') > -1) {
					model.contentBlocks[i].hasBgFill = true;
				}

			}

		}
		

    var view = resolve('./article.html');
    var body = thymeleaf.render(view, model);
    return {
        body: body,
        contentType: 'text/html'
    };
};
