<template>
  <article class="search-list-item" :class="{ isFocus: focus }">
    <div class="search-list-item__text">
      <header class="search-list-item__header">
        <div v-if="item.type" class="search-list-item__tag">
          {{ item.type }}
        </div>
        <div class="search-list-item__date">
          <span class="icon icon--calendar"></span>
          <time :datetime="item.date.iso">{{ item.date.pretty }}</time>
        </div>
        <div class="search-list-item__authors">
          <div class="search-list-item__author" v-for="(author, i) in item.authors" :key="i">
            <span class="icon icon--user"></span>
            <a :href="author.url">{{ author.name }}</a>
          </div>
        </div>
      </header>
      <div class="search-list-item__body">
        <a
          :href="item.url"
          class="search-list-item__title title is-4 is-marginless"
          v-html="highlight(item.heading)"
          ref="linkRef"
        ></a>
        <div class="search-list-item__slug" v-html="highlight(item.url)"></div>
        <p class="search-list-item__lead" v-html="highlight(item.lead)"></p>
      </div>
    </div>
    <div class="search-list-item__image" v-if="item.image">
      <a :href="item.url">
        <ResponsiveImage :image="item.image" sizes="150px"></ResponsiveImage>
      </a>
    </div>
  </article>
</template>

<script setup>
import { watch, ref } from 'vue'
import ResponsiveImage from './ResponsiveImage'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  q: {
    type: String,
    required: true,
  },
  focus: {
    type: Boolean,
    required: true,
  },
})

const linkRef = ref(null)

watch(
  () => props.focus,
  (newVal) => {
    if (newVal && linkRef.value) {
      linkRef.value.focus()
    } else if (linkRef.value) {
      linkRef.value.blur()
    }
  }
)

const highlight = (str) => {
  if (!props.q) return str

  // Strip HTML tags from string
  let div = document.createElement('div')
  div.innerHTML = str
  str = div.textContent || div.innerText || ''

  // Highlight the matched characters by wrapping a span around them
  return str.replace(new RegExp(props.q, 'gi'), (match) => {
    return `<span class="has-background-grey-lighter">${match}</span>`
  })
}
</script>
