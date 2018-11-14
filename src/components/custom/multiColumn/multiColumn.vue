<template lang="pug">
  .multiColumn
    ul
      li(v-for="item in data", v-lazy-container="{ selector: 'img'}", @click="goNext(item)")
        img(:data-src="item.image_url",
        :data-error="require('../../../assets/img/default/custom1.png')",
        :data-loading="require('../../../assets/img/default/custom1.png')",
        :key="item.ac_phone_image")
</template>

<script>
  export default {
    name: "multiColumn",
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      goNext(data) {
        window.location.href = data.url
      }
    }
  }
</script>

<style scoped lang="stylus">
  .multiColumn {
    ul {
      display flex
      li {
        flex 1
        font-size 0
        img {
          width 100%
          pointer-events none
        }
      }
    }
  }
</style>
