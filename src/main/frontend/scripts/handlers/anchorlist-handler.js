import scrollIt from '../utils/scrollIt'
import slugify from '../utils/slugify'

export default function init() {
  const minCount = 3 // Minimum amount of headers required to create the list
  const container = document.querySelector('#js-anchor-list-container')
  const anchorList = container.querySelector('#js-anchor-list')
  const article = document.querySelector('main article')
  const headers = article.querySelectorAll('h2, h3, h4')

  if (headers.length >= minCount) {
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
