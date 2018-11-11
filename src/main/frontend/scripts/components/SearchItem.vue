<template>
  <div class="searchItem">
    <p>{{item.type}}</p>
    <a :href="item.url">{{item.heading}}</a>
    <div v-html="item.lead" />
    <template v-if="item.image">
      <div class="imageWrapper">
        <ResponsiveImage :image="item.image" sizes="100px" />
      </div>
    </template>
  </div>
</template>

<script>
import ResponsiveImage from "./ResponsiveImage";
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  components: {
    ResponsiveImage
  }
};
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
