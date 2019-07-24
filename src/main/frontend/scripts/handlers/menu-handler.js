const menuButton = document.querySelector('#js-navbutton')
const menuDrawer = document.querySelector('#js-drawer')
const headerElement = document.querySelector('#js-header')

export default function init() {
  menuButton.addEventListener('click', togglemenu)
}

function togglemenu(e) {
  e.preventDefault()
  if (Array.from(menuButton.classList).includes('is-open')) {
    closeMenu()
  } else {
    e.stopPropagation()
    openMenu()
  }
}

function closeMenu() {
  menuButton.classList.remove('is-open')
  menuDrawer.classList.remove('is-open')
  headerElement.classList.remove('is-open')

  menuButton.setAttribute('aria-label', ariaLabelOpenMenu) // Global var from html
  menuButton.setAttribute('aria-expanded', false)

  // Remove handler for outside clicks and escape
  document.removeEventListener('click', handleClick)
  document.removeEventListener('keydown', handleKeydown)
}

function openMenu() {
  menuButton.classList.add('is-open')
  menuDrawer.classList.add('is-open')
  headerElement.classList.add('is-open', 'header--pin')

  menuButton.setAttribute('aria-label', ariaLabelCloseMenu)
  menuButton.setAttribute('aria-expanded', true)

  // Add handler for outside clicks and escape
  document.addEventListener('click', handleClick)
  document.addEventListener('keydown', handleKeydown)
}

function handleClick(e) {
  var targetElement = e.target
  // Follow DOM to check if click was inside menu drawer
  do {
    if (targetElement == menuDrawer) {
      return
    }
    targetElement = targetElement.parentNode
  } while (targetElement)

  // This is a click outside
  // e.preventDefault()
  // e.stopPropagation()
  closeMenu()
}

function handleKeydown(e) {
  if (27 === e.keyCode) {
    closeMenu()
  }
}
