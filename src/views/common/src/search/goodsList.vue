<template lang="pug">
  .goodsList
    ul
      li(v-for="item in data")
        img(:src="item.gi_image_url | img-filter")
        .goodsNameWrapper
          .flag(v-show="item.carry_type===1") 专柜提货
          span {{item.gi_name}}
        .priceWrapper
          .desc 实付价:
          ul
            li(v-for="price in $method.arrayPrice(item.direct_supply_price)")
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
  .goodsList {
    ul {
      li {
        display inline-block
        width calc(50% - 0.065rem)
        margin 0 .13rem .13rem 0
        height 7.2rem
        overflow hidden
        font-size 0
        background #fff
        img {
          width 100%
          max-height 4.9333rem
        }
        .goodsNameWrapper {
          padding .21rem .26rem 0
          .flag {
            display inline-block
            line-height .37rem
            background rgb(255,87,147)
            color #fff
            border-radius .3rem
            font-size .26rem
            padding 0 .1rem
          }
          span {
            margin-left .1rem
            font-size .34rem
            line-height .48rem
            color #333
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      li:nth-child(2n) {
        margin-right 0
      }
    }
  }
</style>
