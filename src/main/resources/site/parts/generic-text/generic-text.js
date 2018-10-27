var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var util = require('util');

exports.get = function (req) {

    var component = portal.getComponent();
    var model = component.config;
    if (model) {
        if (model.lead) {
            model.lead = util.paragraphify(model.lead);
        }
        if (model.body) {
            model.body = portal.processHtml({value:model.body});
        }
    }

    model.live = req.mode == 'live';
    model.hasContent = model.hasOwnProperty('heading') || model.hasOwnProperty('subHeading') || model.hasOwnProperty('lead') || model.hasOwnProperty('body');

    var view = resolve('./generic-text.html');
    var body = thymeleaf.render(view, model);
    return {
        body: body,
        contentType: 'text/html'
    };

};
