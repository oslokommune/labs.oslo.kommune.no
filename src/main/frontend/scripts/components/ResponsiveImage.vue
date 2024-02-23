<template>
  <img :src="image.src" :srcset="image.srcSet" :alt="image.alt" :sizes="sizes" />
</template>

<script setup>
import { toRefs } from 'vue'

// Definer props med defineProps. Du trenger ikke å importere defineProps, da det er globalt tilgjengelig inne i <script setup>.
const props = defineProps({
  image: {
    type: Object,
    required: true,
  },
  sizes: {
    type: String,
    default: '100%',
  },
})

// Bruk toRefs for å behandle props individuelt som reaktive referanser.
const { image, sizes } = toRefs(props)
</script>
