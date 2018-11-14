<template lang="pug">
  .banner
    slider(:data="data")
      div(v-for="(item, index) in data", v-lazy-container="{ selector: 'img'}")
        a(@click.prevent="goNext(item)")
          img.needsclick(:data-src="item.image_url",
          :data-error="require('../../../assets/img/default/banner.png')",
          :data-loading="require('../../../assets/img/default/banner.png')",
          :key="item.image_url", @click.prevent="")
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
    methods: {
      goNext(data) {
        window.location.href = data.url
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
