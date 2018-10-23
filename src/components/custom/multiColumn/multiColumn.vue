<template lang="pug">
  .multiColumn
    ul
      li(v-for="item in data", v-lazy-container="{ selector: 'img'}")
        img(:data-src="'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/'+item.ac_phone_image+'?x-oss-process=style/compress'",
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
        }
      }
    }
  }
</style>
