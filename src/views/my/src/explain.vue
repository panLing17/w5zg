<template lang="pug">
  scroll.explain(:data="data")
    ul
      li.question(v-for="item in data")
        .name {{data.question}}
        ul
          li.answer(v-for="answer in data.answer")
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "explain",
    props: {
      data: {
        type: Array,
        default () {
          return {}
        }
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">

</style>
