<template>
  <div>
    <p>{{ greeting }} World!</p>
    <template v-if="model">
      <p>Data from Enonic:</p>
      <ul>
        <li v-for="(val, key, idx) in model" :key="idx">{{key}}: {{val}}</li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  name: 'VueComponentName',
  data: function() {
    return {
      model: enonicModel,
      greeting: 'Hello'
    }
  }
}
</script>

<style lang="scss" scoped>
p,
ul {
  font-size: 1em;
  text-align: center;
}
</style>
