<template lang="pug">
  .addTry
    transition(name="fade")
      .mask(v-show="addTryShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .contentWrapper(v-show="addTryShow")

</template>

<script>
  export default {
    name: "addTry",
    data() {
      return {
        addTryShow: false
      }
    },
    methods: {
      show() {
        this.addTryShow = true
      },
      hide() {
        this.addTryShow = false
      }
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
  .mask {
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    background-color rgba(0,0,0,.5)
    z-index 40
  }
  img {
    pointer-events none
  }
</style>
