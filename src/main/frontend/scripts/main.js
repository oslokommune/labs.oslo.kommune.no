console.log('Hello console changed');

import navbarHandler from './navbar-handler.js';
import someLogger from './somejsfile.js';

// someLogger('called from main file');

navbarHandler('js-header');


let menuButton = document.querySelector('#js-navbutton');
let menuDrawer = document.querySelector('#js-drawer');
let headerElement = document.querySelector('#js-header');
let htmlElement = document.querySelector('html');

menuButton.addEventListener('click', togglemenu);



function togglemenu(e) {

	if(Array.from(this.classList).includes('is-open')) {
		this.classList.remove('is-open');
		menuDrawer.classList.remove('is-open');
		headerElement.classList.remove('is-open');
		htmlElement.classList.remove('is-open');

	} else {
		this.classList.add('is-open');
		menuDrawer.classList.add('is-open');
		headerElement.classList.add('is-open', 'header--pin');
		htmlElement.classList.add('is-open');
	}


}