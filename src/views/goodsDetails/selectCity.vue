<template lang="pug">
  .selectCity(v-show="selectCityShow")
    transition(name="fade")
      .mask(v-show="selectCityShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .content
        .title
          .text
            .noSelect 请选择
          .text
            .noSelect 请选择
          .text
            .noSelect 请选择
</template>

<script>
  export default {
    name: "selectCity",
    data() {
      return {
        selectCityShow: false
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
    z-index 20
  }
  img {
    pointer-events none
  }
  .selectCity {
    height $height-pop-details
    position fixed
    bottom 0
    left 0
    width 100%
    z-index 50
    .content {
      background #fff
      .title {
        height 1.33rem
        display flex
        .text {
          height 100%
          flex 1
          display flex
          justify-content center
          .noSelect {
            height 100%
            line-height 1.33rem
            color #333
            font-size .4rem
            font-weight 500
          }
        }
      }
    }
  }
</style>
