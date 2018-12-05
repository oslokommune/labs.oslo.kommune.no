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
  <div class="header__search" role="menuitem" @keyup="nav">
    <div class="minisearch__box" :class="{expanded: expanded}">
      <form v-if="expanded" class="minisearch__form" @submit="submitSearch">
        <input
          class="minisearch__field"
          type="text"
          :placeholder="$t('inputPlaceHolder')"
          v-model="q"
          ref="searchField"
          @keydown.escape="toggle"
          @keydown.right="selectExitButton"
          @input="doSearch"
          @focus="focus(-1)"
          @blur="focus(-2)"
        >
      </form>
      <div class="minisearch__results" v-if="expanded">
        <ul v-if="hits">
          <li v-for="(hit,i) in hits" :key="i" class="minisearch__item">
            <a :href="hit.url" @focus="focus(i)" @blur="focus(-2)" ref="searchItem">{{hit.heading}}</a>
          </li>
          <li class="minisearch__item minisearch__item--hitcount">
            <a
              :href="searchPageUrl + '?q=' + encodeURIComponent(q)"
              ref="hitcount"
              @focus="focus(hits.length)"
              @blur="focus(-2)"
            >
              <small>
                <span v-if="q.length > 0">{{$tc('hitsString', total, {total: total, q: q})}}</span>
                <span v-else>{{$t('goToSearchPage')}}</span>
              </small>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <button
      class="header__searchbutton"
      :class="{active : expanded}"
      ref="toggleButton"
      :aria-label="$t('searchLabel')"
      @click="toggle"
      @keydown.left="focus(-1)"
    ></button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    // Global variable
    searchURL: searchURL,

    // Global variable
    searchPageUrl: searchPageUrl,

    // Status of search field
    expanded: false,

    // Number of elements hits returned
    limit: 3,

    // Query
    q: "",

    // Total number of hits available
    total: 0,

    // Search results
    hits: [],

    // Stores which item is in focus.
    // -2 = 'nothing'; -1 = search field; 0–4 = search results item
    focused: -2
  }),

  watch: {
    // When 'focused' variable changes, set the focus to
    // the corresponding list item (or field)
    focused(to, from) {
      if (to === -2) {
        return;
      } else if (to === -1) {
        this.$refs.searchField.focus();
      } else if (to === this.hits.length) {
        this.$refs.hitcount.focus();
      } else {
        this.$refs.searchItem[to].focus();
      }
    }
  },

  created() {
    // Listen to keyboard navigation to prevent the page from scrolling
    // when navigating the minisearch results list
    document.addEventListener("keydown", event => {
      if (this.focused !== -2) {
        // Arrow keys to navigate list
        if (event.keyCode === 38 || event.keyCode === 40) {
          event.preventDefault();
        }

        // Escape from anywhere
        if (event.keyCode === 27) {
          this.toggle();
        }
      }
    });
  },

  methods: {
    // Show/hide the minisearch, reset the query, and focus the text field
    toggle() {
      this.q = "";
      this.hits = [];
      this.expanded = !this.expanded;

      if (this.expanded) {
        setTimeout(() => {
          this.$refs.searchField.focus();
        }, 300);
      }
    },

    // Keyboard navigate to the close search button when pressing right
    // on the text field (text cursor at the end of the string)
    selectExitButton(event) {
      console.log(this.focused);
      if (event.target.selectionStart === this.q.length) {
        this.focused = -2;
        this.$refs.toggleButton.focus();
      }
    },

    // Handler for the @focus and @blur events (allowing for navigation with tab key)
    focus(i) {
      this.focused = i;
    },

    // Set the correct focus when navigating the search list with arrow keys
    nav: function(event) {
      if (event.keyCode === 40) {
        event.preventDefault();

        if (this.focused < this.hits.length) {
          this.focused++;
        }
      } else if (event.keyCode === 38) {
        event.preventDefault();

        if (this.focused > -1) {
          this.focused--;
        }
      }
    },

    // Include the search query to the search page URL
    submitSearch(event) {
      event.preventDefault();
      window.location.href = `${this.searchPageUrl}?q=${this.q}`;
    },

    // Execute asyncronous search function and populate the
    // 'hits' and 'total' variables
    doSearch: function(event) {
      if (this.q.length === 0) {
        this.hits = [];
        return;
      }

      // Perform search and store the results
      axios
        .get(this.searchURL, {
          params: {
            q: this.q,
            limit: this.limit
          }
        })
        .then(res => {
          const data = res.data;
          this.total = data.total;
          this.hits = data.hits;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
