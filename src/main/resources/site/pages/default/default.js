var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var util = require('util');

exports.get = function (req) {

    var model = {};
    var content = portal.getContent();

    model.main = content.page.regions.main;

    var serverName = util.getServerName();
    log.info(serverName);
    var isProd = serverName === 'production' || serverName === 'prod' || serverName === 'test';
    var stylesPath = isProd ? 'styles/main.min.css' : 'styles/main.css';
    var scriptsPath = isProd ? 'scripts/main.min.js' : 'scripts/main.js';
    var scripts = '<script async src="' + portal.assetUrl({path: scriptsPath}) + '"></script>';
    var styles = '<link rel="stylesheet" href="' + portal.assetUrl({path: stylesPath}) + '">';

    var view = resolve('default.html');
    var body = thymeleaf.render(view, model);

    return {
        body: body,
        pageContributions: {
            headEnd: [
                styles
            ],
            bodyEnd: [
                scripts
            ]
        }
    }
};
