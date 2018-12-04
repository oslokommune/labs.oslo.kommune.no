<i18n>
{
  "en": {
    "inputPlaceHolder": "Search content",
    "search": "Search",
    "hitsString": "No hits for «{q}» | One hit for «{q}» | {total} hits for «{q}» – see all"
  },
  "no": {
    "inputPlaceHolder": "Søk innhold",
    "search": "Søk",
    "hitsString": "Ingen treff på «{q}» | {total} treff på «{q}» | {total} treff på «{q}» – se alle"
  }
}
</i18n>

<template>
  <div class="header__search" role="menuitem" @keyup="nav">
    <div class="minisearch__box" :class="{expanded: expanded}">
      <form class="minisearch__form" @submit="submitSearch">
        <input
          v-if="expanded"
          class="minisearch__field"
          type="text"
          :placeholder="$t('inputPlaceHolder')"
          v-model="q"
          ref="searchField"
          @keydown.escape="toggle"
          @input="doSearch"
          @focus="focus(-1)"
          @blur="focus(-2)"
        >
      </form>
      <div class="minisearch__results">
        <ul v-if="hits">
          <li v-for="(hit,i) in hits" :key="i" class="minisearch__item">
            <a :href="hit.url" @focus="focus(i)" @blur="focus(-2)" ref="searchItem">{{hit.heading}}</a>
          </li>
          <li v-if="q.length > 0" class="minisearch__item minisearch__item--hitcount">
            <a :href="searchPageUrl" ref="hitcount" @focus="focus(hits.length)" @blur="focus(-2)">
              <small>{{$tc('hitsString', total, {total: total, q: q})}}</small>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <button
      class="header__searchbutton"
      :class="{active : expanded}"
      :aria-label="$t('search')"
      @click="toggle"
    ></button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    searchURL: searchURL,
    searchPageUrl: searchPageUrl,
    expanded: false,
    limit: 3,
    q: "",
    total: 0,
    focused: -1,
    hits: []
  }),

  mounted: function() {
    this.$i18n.locale = labsSiteLanguage || "en"; // Global var set in html
  },

  watch: {
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

  methods: {
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

    focus(i) {
      this.focused = i;
    },

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

    submitSearch(event) {
      event.preventDefault();
      window.location.href = `${this.searchPageUrl}?q=${this.q}`;
    },

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
