import scrollIt from './scrollIt'

function slugify(string) {
  const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
  const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
  const p = new RegExp(a.split('').join('|'), 'g')
  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with ‘and’
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple — with single -
    .replace(/^-+/, '') // Trim — from start of text .replace(/-+$/, '') // Trim — from end of text
}

export default function init() {
  const container = document.querySelector('#js-anchor-list-container')
  const anchorList = container.querySelector('#js-anchor-list')
  const article = document.querySelector('main article')
  const headers = article.querySelectorAll('h2, h3, h4')

  if (headers.length >= 3) {
    container.classList.remove('is-hidden')
  }

  headers.forEach(header => {
    let text = header.innerHTML.replace(/<\/?[^>]+(>|$)/g, '').trim()
    let id = slugify(text)

    var listEl = document.createElement('li')
    var linkEl = document.createElement('a')

    header.id = id
    listEl.classList.add('anchor-list__element')
    linkEl.classList.add('anchor-list__link')
    linkEl.innerHTML = text
    linkEl.href = '#' + id

    listEl.appendChild(linkEl)
    anchorList.appendChild(listEl)

    // Listen for clicks to initiate smooth scroll
    linkEl.addEventListener('click', function(e) {
      let targetOffset = header.getBoundingClientRect().top
      scrollIt(targetOffset, 800, 'easeInOutQuint')
    })
  })
}
