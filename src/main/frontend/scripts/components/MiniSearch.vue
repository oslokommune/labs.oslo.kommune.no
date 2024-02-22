<template>
  <div
    class="header__search"
    role="menuitem"
    @keydown.escape.prevent="toggle"
    @keydown.down="navigateDown"
    @keydown.up="navigateUp"
  >
    <div class="minisearch__box" :class="{ expanded: expanded }">
      <form v-if="expanded" class="minisearch__form" @submit.prevent="submitSearch">
        <input
          class="minisearch__field"
          type="text"
          :placeholder="t('inputPlaceHolder')"
          v-model="q"
          ref="searchField"
          @keydown.right="selectExitButton"
          @input="doSearch"
          @focus="manualFocus(-1)"
          @blur="manualFocus(-2)"
        />
      </form>
      <div class="minisearch__results" v-if="expanded && hits.length">
        <ul v-if="hits">
          <li v-for="(hit, i) in hits" :key="i" class="minisearch__item">
            <a :href="hit.url" @focus="manualFocus(i)" @blur="manualFocus(-2)" ref="searchItem">{{ hit.heading }}</a>
          </li>
          <li class="minisearch__item minisearch__item--hitcount">
            <a
              :href="searchPageUrl + '?q=' + encodeURIComponent(q)"
              ref="hitcount"
              @focus="manualFocus(hits.length)"
              @blur="manualFocus(-2)"
            >
              <small>
                <span v-if="q.length > 0">{{ $t('hitsString', { count: total, query: q }, total) }}</span>
                <span v-else>{{ $t('goToSearchPage') }}</span>
              </small>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <button
      class="header__searchbutton"
      :class="{ active: expanded }"
      ref="toggleButton"
      :aria-label="$t('searchLabel')"
      @click="toggle"
    ></button>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, inject } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const expanded = ref(false)
const q = ref('')
const total = ref(0)
const hits = ref([])
const limit = ref(3)
// Stores which item is in focus.
// -2 = 'nothing'; -1 = search field; 0–n = search results item
const focused = ref(-2)
const searchField = ref(null)
const hitcount = ref(null)
const searchItem = ref(null)
const toggleButton = ref(null)

const searchPageUrl = inject('searchPageUrl')
const searchURL = inject('searchURL')

// Show/hide the minisearch, reset the query, and focus the text field
const toggle = () => {
  q.value = ''
  hits.value = []
  expanded.value = !expanded.value
  if (expanded.value) {
    nextTick(() => {
      if (searchField.value) {
        searchField.value.focus()
      }
    })
  }
}

// Keyboard navigate to the close search button when pressing right
// on the text field (text cursor at the end of the string)
const selectExitButton = (e) => {
  if (e.target.selectionStart === q.value.length) {
    e.preventDefault()
    focused.value = -2
    toggleButton.value.focus()
  }
}

// Handler for the @focus and @blur events (allowing for navigation with tab key)
const manualFocus = (i) => {
  focused.value = i
}

const navigateDown = (e) => {
  if (focused.value !== -2) {
    e.preventDefault()
    if (focused.value < hits.value.length) {
      focused.value++
    }
  }
}

const navigateUp = (e) => {
  if (focused.value !== -2) {
    e.preventDefault()
    if (focused.value > -1) {
      focused.value--
    }
  }
}

const submitSearch = () => {
  window.location.href = `${searchPageUrl}?q=${encodeURIComponent(q.value)}`
}

const doSearch = async () => {
  if (q.value.trim() === '') {
    hits.value = []
    return
  }
  try {
    const response = await axios.get(`${searchURL}?q=${q.value}&limit=${limit.value}`)
    total.value = response.data.total
    hits.value = response.data.hits
  } catch (error) {
    console.error(error)
  }
}

watch(focused, (to) => {
  // When 'focused' variable changes, set the focus to
  // the corresponding list item (or field)
  if (to === -2) {
    return
  } else if (to === -1) {
    searchField.value.focus()
  } else if (to === hits.value.length) {
    hitcount.value.focus()
  } else {
    searchItem.value[to].focus()
  }
})
</script>

<style scoped>
/* Your CSS here */
</style>
