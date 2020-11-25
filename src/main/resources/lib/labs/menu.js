var contentLib = require('/lib/xp/content')
var xAppName = app.name.replace(/\./g, '-')

/**
 * Get all content marked as menu items
 * Works in conjunction with x-item menu-item
 */
exports.getMenuItems = function(currentPath) {
  var menuItems = []
  var queryParams = {
    query: "_path LIKE '/content/*' ",
    sort: 'x.' + xAppName + '.menu-item.menuOrder',
    filters: {
      boolean: {
        must: {
          hasValue: {
            field: 'x.' + xAppName + '.menu-item.menuItem',
            values: true,
          },
        },
      },
    },
  }

  var result = contentLib.query(queryParams)

  if (result.count) {
    menuItems = result.hits.map(function(item) {
      var obj = {
        displayName: item.displayName,
        path: item._path,
      }
      if (item && item.x && item.x[xAppName] && item.x[xAppName]['menu-item'] && item.x[xAppName]['menu-item'].menuName) {
        obj.menuName = item.x[xAppName]['menu-item'].menuName
      }
      if (item._path === currentPath) {
        obj.isActive = true
      }
      return obj
    })
  }

  return menuItems
}
