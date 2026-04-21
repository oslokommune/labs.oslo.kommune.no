<template>
  <div @keyup.tab="focusNextItem" @keydown.down.prevent="focusNextItem" @keydown.up.prevent="focusNextItem">
    <section class="search__hero section">
      <ResponsiveImage v-if="mainImage" class="search__heroimg" :image="mainImage" sizes="100vw"></ResponsiveImage>
      <div class="pkt-container">
        <div class="pkt-grid">
          <div class="pkt-cell labs-search-col">
            <div class="labs-search-input">
              <input
                type="text"
                role="search"
                :aria-label="t('searchLabel')"
                :placeholder="t('inputPlaceHolder')"
                class="labs-search-input__field"
                v-model="q"
                @input="doSearch"
                ref="searchField"
                @keydown.enter="focusNextItem('first')"
              />
              <span class="labs-search-input__label">{{ t('searchLabel') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="pkt-container">
        <div class="pkt-grid">
          <div class="pkt-cell labs-search-col">
            <div class="section search__resultlist" role="region" id="search-results" aria-live="polite">
              <div v-if="!hits.length && !q">
                <!-- Placeholder for no search query -->
                <em>:)</em>
              </div>
              <div v-if="!hits.length && q">
                <h1>{{ t('hitsString', { count: total, query: q }, total) }}</h1>
              </div>
              <ul v-if="hits.length" role="list">
                <li>
                  <SearchItem
                    v-for="(item, i) in hits"
                    :focus="focused === i"
                    :item="item"
                    :q="q"
                    :key="i"
                  ></SearchItem>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import ResponsiveImage from './ResponsiveImage'
import SearchItem from './SearchItem'
import axios from 'axios'

const { t } = useI18n({ useScope: 'global' })
const searchURL = inject('searchURL')
const mainImage = ref(null)
const focused = ref(-1)
const q = ref('')
const hits = ref([])
const next = ref(false)
const time = ref('')
const total = ref(0)

const searchField = ref(null)

onMounted(() => {
  searchField.value.focus()
  if (location.search.split('q=')[1]) {
    q.value = decodeURIComponent(location.search.split('q=')[1])
  }
  doSearch()
})

const focusNextItem = (e) => {
  if (e === 'first') {
    focused.value = 0
  }

  // Prevent incrementing focused when 'tabbing' into the search field from above
  if (e.key === 'Tab' && focused.value === -1 && document.activeElement === searchField.value) {
    return
  }

  // Increment or decrement this.focused when using tab/shift+tab or arrow keys
  if ((e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) && focused.value < hits.value.length - 1) {
    focused.value++
  } else if ((e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) && focused.value >= -2) {
    focused.value--
  }

  // when reaching -1 the searchfield should gain focus
  if (focused.value === -1) {
    searchField.value.focus()
  }
}

const doSearch = async () => {
  try {
    const response = await axios.get(`${searchURL}?q=${q.value}`)
    total.value = response.data.total
    hits.value = response.data.hits
    next.value = response.data.next
    time.value = response.data.time
    focused.value = -1
  } catch (error) {
    console.error(error)
  }
}
</script>
