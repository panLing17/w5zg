<template lang="pug">
  .goodsList
    ul
      li(v-for="item in data")
        img(:src="item.gi_image_url | img-filter")
        .goodsNameWrapper
          i(v-show="item.carry_type===1") 专柜提货
          span {{item.gi_name}}
        .priceWrapper
          .desc 实付价:
          ul
            li(v-for="price in $method.")
</template>

<script>
  export default {
    name: "goodsList",
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
