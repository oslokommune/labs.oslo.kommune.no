var util = require('util');
var contentLib = require('/lib/xp/content');

exports.prepareArticleContents = function(data, scale) {

  var data = processCommonFields(data, scale);

  data.contentBlocks && (data.contentBlocks = processContentBlocks(data.contentBlocks)); 

  return data;

}


function processCommonFields(data, scale) {

  if(!data) return;

  data.authors && (data.authors = getAuthors(data.authors));
  
  return data;

}




function getAuthors(authors) {

  if(!authors) return;

  authors = util.forceArray(authors);
  authors = authors.map(function (author) {
    var a = contentLib.get({key: author});
    if (a && a.image) {
      a.image = imageLib.image.create(a.image);
    }
    return a;
  });

  return authors;
}


function processContentBlocks(ctbs) {

  ctbs = util.forceArray(ctbs);

  ctbs = ctbs.map(function(block) {

    log.info(JSON.stringify(block, null, 2))

    if(!block.ctb) return;

    if(block.hasOwnProperty('ctbSettings') && block.ctbSettings._selected) {
      
      // List of the selected settings
      var selected = util.forceArray(block.ctbSettings._selected);

      // Full Width
      if(selected.indexOf('fullWidth') > -1) {
        block.ctb.isFullWidth = true;
      }

      // Background Fill
      if(selected.indexOf('bgFill') > -1) {
        block.ctb.hasBgFill = true;
      }

    }


    // Define height of video player based on aspect ratio
    if(block.ctb._selected === 'ctbVideo' && block.ctb.ctbVideo) {

      var defaultAspectRatio = '16:9';
      var ratio;

      if(block.ctb.ctbVideo.aspectRatio) {
        ratio = block.ctb.ctbVideo.aspectRatio.trim().split(':');
      } else {
        ratio = defaultAspectRatio.split(":");
      }
      block.ctb.ctbVideo.paddingTop = ratio[1] / ratio[0] * 100 + "%";
    } 

    return block.ctb;

  })

  return ctbs;

}

