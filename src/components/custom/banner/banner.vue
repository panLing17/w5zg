<template lang="pug">
  .banner
    slider(:data="data")
      div(v-for="(item, index) in data", v-lazy-container="{ selector: 'img'}")
        a(@click.prevent="")
          img.needsclick(:data-src="'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/'+item+'?x-oss-process=style/compress'",
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
    position relative
    img {
      pointer-events none
    }
  }
</style>
