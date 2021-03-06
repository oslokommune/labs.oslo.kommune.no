<i18n>
{
  "en": {
    "inputPlaceHolder": "Search content",
    "searchLabel": "Search",
    "goToSearchPage": "Go to search page",
    "hitsString": "No hits for “{q}” | One hit for “{q}” | {total} hits for “{q}” – see all"
  },
  "no": {
    "inputPlaceHolder": "Søk innhold",
    "searchLabel": "Søk",
    "goToSearchPage": "Gå til søkesiden",
    "hitsString": "Ingen treff på «{q}» | {total} treff på «{q}» | {total} treff på «{q}» – se alle"
  }
}
</i18n>

<template>
  <div @keyup="focusNextItem()">
    <section class="search__hero section">
      <ResponsiveImage v-if="mainImage" class="search__heroimg" :image="mainImage" sizes="100vw"></ResponsiveImage>
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-10-tablet is-8-desktop">
            <div class="field has-addons">
              <div class="control is-expanded">
                <input
                  type="text"
                  role="search"
                  :aria-label="$t('searchLabel')"
                  :placeholder="$t('inputPlaceHolder')"
                  class="input is-fullwidth"
                  v-model="q"
                  @input="doSearch"
                  ref="searchField"
                  @keydown.enter="focusNextItem('first')"
                />
              </div>
              <p class="control">
                <a class="button is-static">{{ $t('searchLabel') }}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-10-tablet is-8-desktop">
            <div class="section search__resultlist" role="region" id="search-results" aria-live="polite">
              <div v-if="!hits.length && !q">
                <!-- TODO: INSERT MOST POPULAR ARTICLES WHEN SEARCH STRING IS EMPTY -->
                <em>:)</em>
              </div>
              <div v-if="!hits.length && q">
                <h1>{{ $tc('hitsString', total, { total: total, q: q }) }}</h1>
              </div>
              <ul v-if="hits.length" role="list">
                <li>
                  <SearchItem v-for="(item, i) in hits" :focus="focused === i" :item="item" :q="q" :key="i"></SearchItem>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ResponsiveImage from './ResponsiveImage'
import SearchItem from './SearchItem'
import axios from 'axios'

export default {
  name: 'Search',
  components: {
    SearchItem,
    ResponsiveImage
  },

  data: function() {
    return {
      searchURL: searchURL,
      mainImage: mainImage,
      focused: -1, // index of the list element in focus. -1 means none.
      q: '',
      hits: [],
      next: false,
      time: '',
      total: 0
    }
  },

  mounted() {
    // Focus search field on creation
    this.$refs.searchField.focus()
    if (location.search.split('q=')[1]) {
      this.q = decodeURIComponent(location.search.split('q=')[1])
    }
    this.doSearch()
  },

  methods: {
    focusNextItem(target = false) {
      if (target === 'first') {
        this.focused = 0
      }

      // Prevent incrementing this.focused when 'tabbing' into the search field from above
      if (event.keyCode === 9 && this.focused === -1 && document.activeElement === this.$refs.searchField) {
        return
      }
      // Increment or decrement this.focused when using tab/shift+tab or arrow keys
      if ((event.keyCode === 40 || (event.keyCode === 9 && !event.shiftKey)) && this.focused < this.hits.length - 1) {
        this.focused++
      } else if ((event.keyCode === 38 || (event.keyCode === 9 && event.shiftKey)) && this.focused >= -2) {
        this.focused--
      }

      // when reaching -1 the searchfield should gain focus
      if (this.focused === -1) {
        this.$refs.searchField.focus()
      }
    },

    doSearch: function(event) {
      // Perform search and store the results
      axios
        .get(this.searchURL, {
          params: {
            q: this.q
          }
        })
        .then(res => {
          const data = res.data
          this.next = data.next
          this.time = data.time
          this.total = data.total
          this.hits = data.hits
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
