<template>
  <div class="searchItem">
    <p>{{item.type}}</p>
    <p :href="item.url" v-html="highlight(item.heading)"></p>
    <div v-html="highlight(item.lead)"></div>
    <div v-if="item.image" class="imageWrapper">
      <ResponsiveImage :image="item.image" sizes="100px"/>
    </div>
  </div>
</template>

<script>
import ResponsiveImage from './ResponsiveImage'
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    q: {
      type: String,
      required: true
    }
  },
  components: {
    ResponsiveImage
  },
  methods: {
    highlight(str) {
      if (!this.q) return str

      // Strip HTML tags from string
      let div = document.createElement('div')
      div.innerHTML = str
      str = div.textContent || div.innerText || ''

      // Highlight the matched characters by wrapping a span around them
      return str.replace(new RegExp(this.q, 'gi'), match => {
        return '<span class="has-background-grey-lighter">' + match + '</span>'
      })
    }
  }
}
</script>

<style scoped>
div.searchItem {
  border: 1px solid green;
}
div.imageWrapper {
  height: 100px;
  width: 100px;
}
</style>
