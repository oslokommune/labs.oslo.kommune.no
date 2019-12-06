<template>
  <img :src="image.src" :srcset="image.srcSet" :alt="image.alt" :sizes="sizes" />
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true
    },
    sizes: {
      type: String,
      default: '100%'
    }
  }
}
</script>
