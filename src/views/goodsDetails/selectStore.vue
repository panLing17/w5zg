<template lang="pug">
  .selectStore
    transition(name="fade")
      .mask(v-show="selectStoreShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .contentWrapper(v-show="selectStoreShow")
        .title
          .left
            img(src="./back2.png")
          .center 专柜提货
          .right
            img(src="./close.png")
        .content
          scroll.left()
            ul
              li
          scroll.right()
            ul
              li
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "selectStore",
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
        selectStoreShow: true
      }
    },
    methods: {
      show() {
        this.selectStoreShow = true
      },
      hide() {
        this.selectStoreShow = false
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .fold-enter-active, .fold-leave-active {
    transition: all 0.5s;
  }
  .fold-enter, .fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  img {
    pointer-events none
  }
  .mask {
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    z-index 30
  }
  .contentWrapper {

  }
</style>
