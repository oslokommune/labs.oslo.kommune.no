<template>
  <div>
    <p>{{ greeting }} World!</p>
    <template v-if="dataFromEnonic">
      <p>Data from Enonic:</p>
      <ul>
        <li v-for="(val, key, idx) in dataFromEnonic" :key="idx">
          {{key}}: {{val}}
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      greeting: 'Hello',
      dataFromEnonic: {}
    }
  },
  mounted() {
    const el = document.getElementById('js-vuetest-data');
    if (el) {
      this.dataFromEnonic = JSON.parse(el.text);
    }
  }
}
</script>

<style scoped>
p, ul {
  font-size: 2em;
  text-align: center;
}
</style>
