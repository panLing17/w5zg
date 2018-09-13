<template lang="pug">
  .noData
    img(src="./empty.png")
    .desc1 购物车是空的!
    .desc2 “再忙, 也要记得多去犒赏自己哦! ”
</template>

<script>
  export default {
    name: "noData"
  }
</script>

<style scoped lang="stylus">
  .noData {
    height 6.66rem
    display flex
    flex-direction column
    align-items center
    font-size 0
    background-color #f3f3f3
    img {
      width 2.66rem
      margin-top 1.33rem
    }
    .desc1 {
      color #777
      font-size .48rem
      line-height .66rem
      margin-top .13rem
    }
    .desc2 {
      color #777
      font-size .34rem
      line-height .48rem
    }
  }
</style>
