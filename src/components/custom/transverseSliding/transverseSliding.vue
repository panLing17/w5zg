<template lang="pug">
  scroll.transverseSliding(:data="data", :style="{height: wrapperHeight + 'px'}", :scrollX="true", :scrollY="false", :stopPropagation="true")
    div
      ul
        li(v-for="(item, index) in data")
          img(:src="item.img", @load="setWrapperHeight($event)")
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "transverseSliding",
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        wrapperHeight: 0
      }
    },
    methods: {
      setWrapperHeight(e) {
        if (this.wrapperHeight > 0) {
          return
        }
        this.wrapperHeight = e.target.offsetHeight
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  .transverseSliding {
    position relative
    width 100%
    overflow hidden
    div {
      position absolute
      ul {
        white-space nowrap
        li {
          vertical-align top
          display inline-block
          font-size 0
          width 4.26rem
          img {
            width 100%
          }
        }
      }
    }
  }
</style>
