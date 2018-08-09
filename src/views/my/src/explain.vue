<template lang="pug">
  .explain
    ul
      li.question(v-for="item in data")
        .name {{data.question}}
        ul
          li.answer(v-for="answer in data.answer")
</template>

<script>

  export default {
    name: "explain",
    props: {
      data: {
        type: Array,
        default () {
          return {}
        }
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
