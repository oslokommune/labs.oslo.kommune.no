export default function handler(id) {
  var lastKnownScrollY = 0
  var currentScrollY = 0
  var ticking = false
  var idOfHeader = id
  var eleHeader = null
  var headerLinks = null
  const classes = {
    pinned: 'header--pin',
    unpinned: 'header--unpin',
    top: 'header--top',
    open: 'is-open',
    focus: 'header--focus'
  }
  function onScroll() {
    if (eleHeader.classList.contains(classes.open)) {
      return
    }
    currentScrollY = window.pageYOffset
    requestTick()
  }
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(update)
    }
    ticking = true
  }
  function update() {
    if (currentScrollY < lastKnownScrollY) {
      pin()
    } else if (currentScrollY > lastKnownScrollY) {
      unpin()
    }
    lastKnownScrollY = currentScrollY
    ticking = false
  }
  function pin() {
    if (currentScrollY <= 0) {
      eleHeader.classList.add(classes.top)
    } else {
      eleHeader.classList.remove(classes.top)
    }

    if (eleHeader.classList.contains(classes.unpinned)) {
      eleHeader.classList.remove(classes.unpinned)
      eleHeader.classList.add(classes.pinned)
    }
  }
  function unpin() {
    if (eleHeader.classList.contains(classes.pinned) || !eleHeader.classList.contains(classes.unpinned)) {
      eleHeader.classList.remove(classes.pinned)
      eleHeader.classList.add(classes.unpinned)
    }
  }

  // Show/hide header when an element on it is focused/blurred
  function showOnFocus(headerElement) {
    headerLinks = [...headerElement.querySelectorAll('a')]
    headerLinks.forEach(el => {
      el.addEventListener('focus', () => {
        headerElement.classList.add(classes.focus)
      })
      el.addEventListener('blur', () => {
        headerElement.classList.remove(classes.focus)
      })
    })
  }

  window.onload = function() {
    eleHeader = document.getElementById(idOfHeader)
    showOnFocus(eleHeader)
    document.addEventListener('scroll', onScroll, false)
  }
}
