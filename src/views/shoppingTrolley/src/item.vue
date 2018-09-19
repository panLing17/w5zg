<template lang="pug">
  .wrapper(@click="")
    .commList
      ul.storeWrapper
        li.store(v-for="(item, index) in data.commList")
          .storeTitle(@click="$emit('goods-change', {index})")
            .left
              img(src="./gou.png", v-show="item.checked==='011'")
              .noChecked(v-show="item.checked==='012'")
            .right {{item.si_name}}
          .storeContent
            ul.goodsWrapper
              li.goods(v-for="(goods, i) in item.shoppingCartVOList")
                .left(@click="$emit('goods-change', {index,i})")
                  img(src="./gou.png", v-show="goods.checked==='011'")
                  .noChecked(v-show="goods.checked==='012'")
                .right
                  .logo
                    .mask(v-if="goods.goods_num>goods.storage_num") 库存不足
                    img(:src="goods.logo | img-filter")
                  .info
                    .name {{goods.gi_name}}
                    .tool
                      .detail
                        ul
                          li(v-for="detail in goods.specVOList") {{detail.gspec_value}};
                      .countWrapper
                        .minus
                          img(src="./minus.png")
                        .count {{goods.goods_num}}
                        .add
                          img(src="./add.png")
                    .priceWrapper
                      .leftPrice
                        span.desc 实付价:
                        span.price {{goods.direct_supply_price | price-filter}}
                      .rightPrice 专柜价:{{goods.counter_price | price-filter}}
                    .toolbar
                      .cut(v-show="goods.difference_price>0") 比加入时降{{goods.difference_price}}元
                      .btn
                        img(src="./btn.png")
                        .pop
                          .sanjiao
                          .popItem(v-show="(goods.delivery_ways==='167' && goods.carry_type===1) || goods.delivery_ways==='168'", @click.stop="$emit('change-ways', {index, i})")
                            img(src="./refresh.png")
                            span {{goods.delivery_ways==='167'?'专柜提货':'快递配送'}}
                          .popItem(v-show="goods.delivery_ways==='168'")
                            img(src="./address.png")
                            span 提货门店
                          .popItem
                            img(src="./del.png")
                            span 删除
          .address(v-show="item.store_address")
            img(src="./address2.png")
            span {{item.store_address}}
    .failure(v-if="data.failure && data.failure.length")
      .title
        .left 失效商品共 {{data.failure.length}} 件
        .right 清空失效商品
      .content
        ul.goodsWrapper
          li.goods
</template>

<script>
  export default {
    name: "item",
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {

      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="stylus">
  img {
    pointer-events none
  }
  .wrapper {
    background-color #fff
  }
  .commList {
    .storeWrapper {
      .store {
        border-top .26rem solid #f3f3f3
        .storeTitle {
          display flex
          align-items center
          padding 0 .4rem
          height .88rem
          border-bottom 1px solid #e7e7e7
          .left {
            font-size 0
            margin-right .26rem
            img {
              width .53rem
            }
            .noChecked {
              width .53rem
              height .53rem
              border 1px solid #cecece
              border-radius 50%
            }
          }
          .right {
            color #666
            font-size .34rem
            font-weight 400
          }
        }
        .storeContent {
          .goodsWrapper {
            .goods {
              display flex
              padding-top .26rem
              &:last-child .right {
                border none
              }
              .left {
                font-size 0
                padding 1.2rem .26rem 0 .4rem
                img {
                  width .53rem
                }
                .noChecked {
                  width .53rem
                  height .53rem
                  border 1px solid #cecece
                  border-radius 50%
                }
              }
              .right {
                display flex
                flex-wrap wrap
                padding 0 .4rem .26rem 0
                border-bottom 1px solid #e7e7e7
                .logo {
                  font-size 0
                  width 2.4rem
                  height 2.4rem
                  border-radius .13rem
                  overflow hidden
                  margin-right .34rem
                  position relative
                  .mask {
                    position absolute
                    top 0
                    left 0
                    background-color rgba(0,0,0,.5)
                    width 100%
                    height 100%
                    color #fff
                    font-weight 400
                    font-size .32rem
                    line-height 2.4rem
                    text-align center
                  }
                  img {
                    width 100%
                  }
                }
                .info {
                  flex 1
                  .name {
                    color #333
                    font-size .32rem
                    line-height .45rem
                    font-weight 400
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                  }
                  .tool {
                    margin-top .13rem
                    display flex
                    justify-content space-between
                    .detail {
                      height .58rem
                      background url('./pull.png') no-repeat center right .13rem #f1f1f1
                      background-size .16rem auto
                      max-width 3.2rem
                      overflow hidden
                      padding 0 .42rem 0 .13rem
                      ul {
                        li {
                          display inline-block
                          line-height .58rem
                          color #999
                          font-size .32rem
                          font-weight 400
                        }
                      }
                    }
                    .countWrapper {
                      width 2.26rem
                      height .58rem
                      display flex
                      border 1px solid #d7d7d7
                      .minus, .add {
                        width .53rem
                        font-size 0
                        display flex
                        justify-content center
                        align-items center
                        img {
                          width .26rem
                        }
                      }
                      .count {
                        flex 1
                        line-height .58rem
                        text-align center
                        color #666
                        font-weight 400
                        font-size .24rem
                        border-left 1px solid #d7d7d7
                        border-right 1px solid #d7d7d7
                      }
                    }
                  }
                  .priceWrapper {
                    display flex
                    margin-top .21rem
                    line-height .53rem
                    .leftPrice {
                      .desc {
                        color #333
                        font-size .29rem
                        font-weight 400
                      }
                      .price {
                        color #f70057
                        font-size .37rem
                        font-weight 400
                      }
                    }
                    .rightPrice {
                      margin-left .21rem
                      font-size .26rem
                      font-weight 400
                      color #9a9a9a
                      text-decoration line-through
                    }
                  }

                  .toolbar {
                    margin-top .21rem
                    display flex
                    align-items center
                    justify-content space-between
                    position relative
                    height .58rem
                    .cut {
                      line-height .45rem
                      padding 0 .13rem
                      color #f70057
                      font-size .29rem
                      font-weight 400
                      border 1px solid #f70057
                    }
                    .btn {
                      position absolute
                      right 0
                      top 0
                      font-size 0
                      align-self flex-end
                      &:hover {
                        .pop {
                          display block
                        }
                      }
                      img {
                        width .58rem
                      }
                      .pop {
                        display none
                        position absolute
                        top 0.58rem
                        right -.16rem
                        border-radius .08rem
                        padding-top .16rem
                        z-index 10
                        overflow hidden
                        .mask {
                          position fixed
                          top 0
                          left 0
                          width 100%
                          height 100vh
                          z-index 10
                          background-color rgba(0, 0, 0, 0)
                        }
                        .sanjiao {
                          position absolute
                          top -.16rem
                          right .35rem
                          z-index 20
                          width 0
                          height 0
                          border-width .16rem
                          border-style solid
                          border-color transparent transparent rgba(0, 0, 0, .8) transparent
                        }
                        .popItem {
                          width 2.77rem
                          height 1rem
                          background-color rgba(0, 0, 0, .8)
                          display flex
                          align-items center
                          border-bottom 1px solid #999
                          &:last-child {
                            border none
                          }
                          img {
                            margin-left .26rem
                            width .34rem
                          }
                          span {
                            margin-left .18rem
                            font-size .34rem
                            font-weight 400
                            color #efefef
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .address {
          display flex
          align-items center
          font-size 0
          padding-left .79rem
          height .8rem
          border-top 1px solid #e7e7e7
          img {
            margin-right .13rem
            width .26rem
          }
          span {
            color #666
            font-weight 400
            font-size .29rem
          }
        }
      }
    }
  }
  .failure {
    border-top .26rem solid #f3f3f3
    .title {
      height 1.2rem
      display flex
      align-items center
      justify-content space-between
      padding 0 .5rem 0 .4rem
      border-bottom 1px solid #e7e7e7
      .left {
        color #666
        font-weight 400
        font-size .32rem
      }
      .right {
        color #f8085c
        font-weight 400
        font-size .32rem
      }
    }
    .content {
      padding 0 .4rem 0 1.17rem
    }
  }
</style>
