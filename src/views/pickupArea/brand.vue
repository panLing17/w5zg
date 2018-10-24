<template lang="pug">
  .brand
    .header
      .back
        img(src="./img/back.png")
      .title 专柜品牌
</template>

<script>
  export default {
    name: "brand"
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  img {
    pointer-events none
  }
  .header {
    position fixed
    top 0
    left 0
    width 100%
    height $height-header
    z-index 10
    background-color #fff
    .back {
      position absolute
      left 0
      top 0
      padding .33rem .4rem
      img {
        width .64rem
      }
    }
    .title {
      width 100%
      height 100%
      text-align center
      display flex
      align-items center
      justify-content center
      color #333
      font-weight 500
      font-size .48rem
    }
  }
</style>
