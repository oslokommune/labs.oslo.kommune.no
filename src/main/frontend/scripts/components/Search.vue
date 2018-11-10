<template>
  <div class="thing">
    <input type="text" v-model="q" placeholder="Søk her" @input="doSearch" />
    <p>{{q}}</p>
    <p v-if="next">{{next}}</p>
    <p>{{time}}</p>
    <p>{{total}}</p>
    <p>{{hits}}</p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "Search",
  data: function() {
    return {
      searchURL: searchURL,
      q: '',
      hits: [],
      next: false,
      time: '',
      total: 0
    }
  },
  methods: {
    doSearch: function(event) {
      axios.get(this.searchURL, {
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

<style lang="scss" scoped>
.thing {
  margin-top: 4em;
}
p {
  font-size: 2em;
  text-align: center;
}
</style>
