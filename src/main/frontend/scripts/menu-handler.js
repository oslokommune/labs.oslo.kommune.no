const menuButton = document.querySelector('#js-navbutton');
const menuDrawer = document.querySelector('#js-drawer');
const headerElement = document.querySelector('#js-header');

export default function init() {
  menuButton.addEventListener('click', togglemenu);
}

function togglemenu(e) {
  if(Array.from(this.classList).includes('is-open')) {
    menuButton.classList.remove('is-open');
    menuDrawer.classList.remove('is-open');
    headerElement.classList.remove('is-open');
  } else {
    menuButton.classList.add('is-open');
    menuDrawer.classList.add('is-open');
    headerElement.classList.add('is-open', 'header--pin');
  }
}
