<template lang="pug">
  .wrapper
    .commList
      ul.storeWrapper
        li.store(v-for="item in data.commList")
          .storeTitle(@click="item.checked = item.checked==='011'? '012': '011'")
            .left
              img(src="./gou.png", v-show="item.checked==='011'")
              .noChecked(v-show="item.checked==='012'")
            .right {{item.si_name}}
          .storeContent
            ul.goodsWrapper
              li.goods(v-for="goods in item.shoppingCartVOList")
                .left
                  img(src="./gou.png", v-show="goods.checked==='011'")
                  .noChecked(v-show="goods.checked==='012'")
                .right
                  .logo
                    img(:src="goods.logo | img-filter")
                  .info
                    .name {{goods.gi_name}}
                    .tool
                      .detail
                        ul
                          li(v-for="detail in goods.specVOList") {{detail.gspec_value?(detail.gspec_value+';'):''}}
                      .countWrapper
                        .minus
                          img(src="./minus.png")
                        .count
                        .add
                          img(src="./add.png")
                    .priceWrapper
                      .leftPrice
                        span.desc 实付价:
                        span.price {{goods.direct_supply_price | price-filter}}
                      .rightPrice 专柜价:{{goods.counter_price | price-filter}}
                    .toolbar
                      .cut 比加入时降546元
                      .btn
                        img(src="./btn.png")
                        <!--.pop-->
                          <!--.sanjiao-->
                          <!--.popItem-->
                            <!--img(src="./refresh.png")-->
                            <!--span 专柜提货-->
                          <!--.popItem-->
                            <!--img(src="./address.png")-->
                            <!--span 提货门店-->
                          <!--.popItem-->
                            <!--img(src="./del.png")-->
                            <!--span 删除-->
          .address
            img(src="./address2.png")
            span {{item.store_address}}
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
    }
  }
</script>

<style scoped lang="stylus">
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
              padding .26rem .4rem .26rem 0
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
                .logo {
                  font-size 0
                  width 2.4rem
                  height 2.4rem
                  border-radius .13rem
                  overflow hidden
                  margin-right .34rem
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
                      background #f1f1f1
                      max-width 3.2rem
                      overflow hidden
                      padding 0 .13rem
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
                    .cut {
                      line-height .45rem
                      padding 0 .13rem
                      color #f70057
                      font-size .29rem
                      font-weight 400
                      border 1px solid #f70057
                    }
                    .btn {
                      position relative
                      font-size 0
                      img {
                        width .58rem
                      }
                      .pop {
                        position absolute
                        bottom 0
                        right -.16rem
                        border-radius .08rem
                        .sanjiao {
                          border-width .16rem
                          border-style solid
                          border-color transparent transparent rgba(0,0,0,.8) transparent
                        }
                        .popItem {

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
    }
  }
</style>
