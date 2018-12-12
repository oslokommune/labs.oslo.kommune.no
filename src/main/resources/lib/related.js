var portal = require('/lib/xp/portal')
var contentLib = require('/lib/xp/content')
var util = require('util')
var imageLib = require('image')

var xAppName = app.name.replace(/\./g, '-')

exports.getRelatedContent = function(content, config) {

  var model = {}

  if (arguments.length !== 2) {
    log.error("Please provide all required arguments!")
    return model
  }

  var count = 10,
    fallback = false,
    contentTypes,
    relatedArr = [],
    selectedHits = [],
    queryHits = [],
    selectedItems = [],
    sort = 'createdTime DESC'

  if (config.selectedItems) {
    selectedItems = util.forceArray(config.selectedItems)
    var currentItem
    selectedItems.map(function(item) {
      currentItem = contentLib.get({
        key: item
      })
      if (currentItem) {
        selectedHits.push(currentItem)
      } else {
        log.error('Failed to retrieve content with id ' + item)
      }
    })
  }

  if (!config.contentTypes) {
    log.error("Please provide contentTypes to search for!")
    return model
  } else {
    contentTypes = util.forceArray(config.contentTypes).map(function(item) {
      return app.name + ':' + item
    })
  }

  if (config.count === 0 || config.count) {
    count = config.count
    if (selectedHits.length <= count) {
      count -= selectedHits.length
    }
  }

  if (count) {
    if (config.fallback) {
      fallback = config.fallback
    }

    // Find related articles to current content
    // If current content type is a category, we use the _id of the content itself
    if (app.name + ':category' === content.type) {
      relatedArr.push(content._id)
    }
    if (content.x &&
      content.x[xAppName] &&
      content.x[xAppName].categories &&
      content.x[xAppName].categories.categories) {
      relatedArr = relatedArr.concat(util.forceArray(content.x[xAppName].categories.categories))
    }

    if (relatedArr.length || fallback) {
      var siteReferencePath = content._path.split('/')[1]
      var query = "_path LIKE '/content/" + siteReferencePath + "/*' "

      var mustHasValue = [],
        mustNotHasValue = []

      if (relatedArr.length) {
        mustHasValue.push({
          field: 'x.' + xAppName + '.categories.categories',
          values: relatedArr
        })
      }
      if (selectedItems.length) {
        mustNotHasValue.push({
          field: '_id',
          values: selectedItems
        })
      }
      if (content._id) {
        mustNotHasValue.push({
          field: '_id',
          values: content._id
        })
      }

      if (config.sort) {
        sort = config.sort
      }

      var queryParams = {
        start: 0,
        count: count,
        contentTypes: contentTypes,
        query: query,
        sort: sort
      }

      if (mustHasValue.length || mustNotHasValue.length) {
        queryParams.filters = {
          boolean: {
            must: {
              hasValue: mustHasValue
            },
            mustNot: {
              hasValue: mustNotHasValue
            }
          }
        }
      }

      //log.info(JSON.stringify(queryParams, null, 2));

      var result = contentLib.query(queryParams)

      if (result.count) {
        queryHits = result.hits
      }
    }
  }

  // We now have selectedHits and queryHits

  model.hits = selectedHits.concat(queryHits)
  var data
  model.hits = model.hits.map(function(item) {
    if (item && item.data) {
      data = item.data
      data.path = portal.pageUrl({
        path: item._path
      })
      data.image = data.image ?
        imageLib.image.create(data.image, config.scale) :
        imageLib.image.placeholder(config.scale)
      if (data.lead) {
        //data.lead = util.paragraphify(data.lead)
      }
      data.type = item.type.split(':')[1]
      data.prettyCreatedTime = util.dmyDate(item.createdTime)
      data.prettyModifiedTime = util.dmyDate(item.modifiedTime)
    }
    return item
  });

  return model

}
