<template>
  <div class="thing">
    <input type="text" v-model="q" placeholder="Søk her" @input="doSearch">
    <template v-if="hits.length > 0">
      <ul>
        <li v-for="(item, index) in hits" :key="index">
          <SearchItem :item="item" :q="q"/>
        </li>
      </ul>
      <p v-if="next">Neste side: {{next}}</p>
      <p>Tid brukt: {{time}}</p>
      <p>Treff: {{total}}</p>
    </template>
  </div>
</template>

<script>
import SearchItem from "./SearchItem";
import axios from "axios";
export default {
  name: "Search",
  components: {
    SearchItem
  },
  data: function() {
    return {
      searchURL: searchURL,
      q: "",
      hits: [],
      next: false,
      time: "",
      total: 0
    };
  },
  methods: {
    doSearch: function(event) {
      axios
        .get(this.searchURL, {
          params: {
            q: this.q
          }
        })
        .then(res => {
          const data = res.data;
          this.next = data.next;
          this.time = data.time;
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

<style lang="scss" scoped>
@import "../../styles/partials/sizes";
.thing {
  margin-top: $header-height;
}
</style>
