<template lang="pug">
  .banner
    slider(:data="data", v-lazy-container="{ selector: 'img'}")
      div(v-for="(item, index) in data")
        a(@click.prevent="")
          img.needsclick(:data-src="'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/'+item.ac_phone_image+'?x-oss-process=style/compress'",
          :data-error="require('../../../assets/img/default/banner.png')",
          :data-loading="require('../../../assets/img/default/banner.png')",
          :key="item.ac_phone_image", @click.prevent="")
</template>

<script>
  import Slider from 'components/slider'
  export default {
    name: "banner",
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      Slider
    }
  }
</script>

<style scoped lang="stylus">
  .banner {
    width 100%
    overflow hidden
    img {
      pointer-events none
    }
  }
</style>
