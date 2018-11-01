<template lang="pug">
  .goodsList#goodsList
    ul.list
      li.item(v-for="(item, index) in data", @click="$router.push({path: '/goodsDetailed', query: {id: item.gspu_id}})", :style="{'margin-right': index%2===0?'':'0'}")
        .imgWrapper(v-lazy-container="{ selector: 'img'}")
          img(:data-src="'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/'+item.gi_image_url+'?x-oss-process=style/compress'",
          :data-error="require('../assets/img/default/goods.png')",
          :data-loading="require('../assets/img/default/goods.png')",
          :key="item.gspu_id")
        .goodsNameWrapper
          .flag(v-show="item.carry_type===1") 专柜提货
          span {{item.goods_name}}
        .priceWrapper
          ul
            li.desc 实付价：￥
            li.price(v-for="price in $method.arrayPrice(item.direct_supply_price)") {{price}}
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
    .list {
      background rgb(246,246,246)
      .item {
        display inline-block
        vertical-align top
        width calc(50% - 0.065rem)
        margin 0 .13rem .13rem 0
        height 7.2rem
        overflow hidden
        background #fff
        .imgWrapper {
          font-size 0
          height 4.9333rem
          overflow hidden
          img {
            width 100%
          }
        }
        .goodsNameWrapper {
          padding .21rem .26rem 0
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          .flag {
            display inline-block
            line-height .37rem
            background rgb(255,87,147)
            color #fff
            border-radius .3rem
            font-size .26rem
            padding 0 .1rem
            margin-right .1rem
          }
          span {
            font-size .34rem
            line-height .48rem
            color #333
            word-break: break-all;
          }
        }
        .priceWrapper {
          padding .26rem .26rem 0
          ul {
            display inline-table
            li {
              display table-cell
              vertical-align bottom
            }
            .desc {
              font-size .24rem
              color rgb(247,0,87)
            }
            li.price {
              color rgb(247,0,87)
              font-size .48rem
              font-weight 400

            }
            li:nth-child(2) {
              line-height 0.9
            }
            li:nth-child(3) {
              font-size .24rem
              line-height 1.2
            }
          }
        }
      }
      .adImage {
        width: 100%;
        margin-bottom: .13rem;
        img {
          width: 100%;
        }
      }
      .adTag {

      }
    }
  }
</style>
