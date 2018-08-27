<template lang="pug">
  .noMore
    .left
    .center 没有更多了
    .right
</template>

<script>
  export default {
    name: "noMore"
  }
</script>

<style scoped lang="stylus">
  .noMore {
    height 1.52rem
    display flex
    justify-content center
    align-items center
    .left, .right {
      width 1.73rem
      height 1px
      background rgb(153,153,153)
    }
    .center {
      font-size .32rem
      color rgb(119,119,119)
      margin 0 .5rem
    }
  }
</style>
