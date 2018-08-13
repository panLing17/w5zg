<template lang="pug">
  .adTagWrapper
    ul
      li(v-for="tag in content", @click="router.push({path:'/page/commodityList', query:{msg:tag,flags:1}})") {{tag}}
</template>

<script>
  export default {
    name: "adTag",
    data () {
      return {
        content: [],
        router: {}
      }
    }
  }
</script>

<style scoped lang="stylus">
  .adTagWrapper
    width 100%
    padding .18rem .26rem 0
    background rgb(246,246,246)
    ul
      max-height 3.2rem
      overflow hidden
      li
        display inline-block
        margin 0 .32rem .32rem 0
        width 2.13rem
        height .74rem
        line-height .74rem
        background #fff
        border-radius .4rem
        color #000
        font-size .32rem
        text-align center
        &:nth-child(4n)
          margin-right 0
</style>
