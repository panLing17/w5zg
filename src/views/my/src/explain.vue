<template lang="pug">
  scroll.explain(:data="data")
    ul.questionWrapper
      li.question(v-for="item in data")
        .name Q: {{item.question}}
        ul
          li.answer(v-for="answer in item.answer") {{answer}}
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "explain",
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  .explain {
    height 100%
    overflow hidden
    .questionWrapper {
      padding .26rem .53rem 0
      .question {
        margin-bottom .5rem
        .name {
          color #333
          font-size .37rem
          font-weight bold
          line-height .58rem
        }
        .answer {
          color #333
          font-size .32rem
          line-height .58rem
          text-align justify
          word-break break-all
        }
      }
    }
  }
</style>
