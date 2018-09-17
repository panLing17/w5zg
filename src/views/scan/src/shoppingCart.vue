<template lang="pug">
  .shoppingCart
    .headerWrapper
      .nav
        .back
          img(src="./img/back.png")
        .title 扫码购物车
      .scan
        .left 正品低价 · 专柜自提 · 极致体验
        .right
          img(src="./img/scan.png")
          span 继续扫码
    scroll.contentWrapper
      .content
        // 有效商品
        ul.itemWrapper
          li.item(v-for="(item, index) in data.commList[0].shoppingCartVOList")
            .left
              img(:src="item.logo | img-filter")
              .mask(v-if="item.goods_num>item.storage_num") 库存不足
            .right
              .name {{item.gi_name}}
              .size {{sizeFormat(item.specVOList)}}
              .countWrapper
                .minus
                  img(src="./img/minus.png")
                .count {{item.goods_num}}
                .add
                  img(src="./img/add.png")
              .priceWrapper
                .direct 实付价:<span>{{item.direct_supply_price}}</span>
                .counter 专柜价:{{item.counter_price}}
              .del(@click="delGoods(item)")
                img(src="./img/del.png")
        // 失效商品
        .invalid
          .header
            .left 失效商品共 2 件
            .right 清空失效商品
          ul.itemWrapper
            li.item(v-for="(item, index) in data.commList[0].shoppingCartVOList")
              .left
                img(:src="item.logo | img-filter")
                .mask 失效
              .right.lose
                .name {{item.gi_name}}
                .size {{sizeFormat(item.specVOList)}}
                .desc 该商品已失效
                .del(@click="delGoods(item)")
                  img(src="./img/del.png")
        .bottom
          .left
          .center 已到最底部
          .right
    .toolbar
      .left
        .top (不含运费)实付:<span>￥2635.55</span>
        .bottom 现金券可抵扣:￥33.6
      .right 结算(5)
    tips-pop(:data="temp")
</template>

<script>
  import Scroll from 'components/scroll'
  import TipsPop from './tipsPop'
  export default {
    name: "shoppingCart",
    data() {
      return {
        data: [],
        temp: [0,0,0,0,0,0,0,0]
      }
    },
    created() {
      this.goodsAdd()
    },
    methods: {
      // 加入购物车
      goodsAdd() {
        if (!window.sessionStorage.getItem('barCode')) {
          this.getData()
          return
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/querySendShoppingCartList1',
          params: {},
        }).then(function (res) {
          if (res) {
            window.sessionStorage.removeItem('barCode')
            self.getData()
          }
        })
      },
      // 获取购物车数据
      getData() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/querySendShoppingCartList1',
          params: {},
        }).then(function (res) {
          if (res) {
            self.data = res.data.data
          }
        })
      },
      // 格式化规格
      sizeFormat(list) {
        let str = ''
        list.forEach(item => {
          if (item.gspec_value) {
            str += item.gspec_value+';'
          }
        })
        str = str.substring(0, str.length-1)
        return str
      },
      // 删除商品
      delGoods(item) {
        this.$verify({
          content: '确认删除所选商品吗？',
          rightText: '删除',
          leftText: '取消',
          rightFn: (item) => {

          }
        })
      }
    },
    components: {
      Scroll,
      TipsPop
    }
  }
</script>

<style scoped lang="stylus">
  img {
    pointer-events none
  }
  .shoppingCart {
    position absolute
    top 0
    left 0
    width 100%
    height 100vh
    background #f2f2f2
    .headerWrapper {
      .nav {
        height 1.3rem
        background-color #f70057
        display flex
        position relative
        .back {
          padding 0.33rem .4rem
          font-size 0
          img {
            width .64rem
          }
        }
        .title {
          font-size .48rem
          color #fff
          font-weight 500
          line-height 1.3rem
          position absolute
          top 0
          left 50%
          transform translateX(-50%)
        }
      }
      .scan {
        height 1.3rem
        display flex
        justify-content space-between
        align-items center
        background-color #4a4a4a
        padding 0 .4rem
        .left {
          font-size .32rem
          font-weight 400
          color rgba(255,255,255,.7)
        }
        .right {
          display flex
          width 3.4rem
          height .96rem
          align-items center
          justify-content center
          background-color #ff8500
          border-radius .13rem
          img {
            width .42rem
          }
          span {
            margin-left .13rem
            font-size .37rem
            color #fff
            font-weight 400
          }
        }
      }
    }
    .contentWrapper {
      height calc(100% - 4rem)
      overflow hidden
      .itemWrapper {
        background-color #fff
        .item {
          padding .34rem .34rem .4rem .4rem
          display flex
          border-bottom 1px solid #e7e7e7
          position relative
          &:last-child {
            border none
          }
          .left {
            font-size 0
            width 2.4rem
            height 2.4rem
            overflow hidden
            border-radius .13rem
            border 1px solid #ccc
            margin-right .32rem
            position relative
            .mask {
              position absolute
              top 0
              left 0
              width 100%
              height 100%
              background-color rgba(0,0,0,.5)
              color #fff
              font-size .32rem
              line-height 2.4rem
              text-align center
            }
            img {
              width 100%
            }
          }
          .right {
            margin-top -.05rem
            width calc(100% - 2.72rem)
            display flex
            flex-direction column
            align-items flex-start
            &.lose {
              margin 0
              .desc {
                margin-top .21rem
                color #333
              }
            }
            .name {
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
              color #333
              font-size .32rem
              font-weight 400
              line-height 1
            }
            .size {
              margin-top .21rem
              background-color #f1f1f1
              border-radius .05rem
              padding 0.13rem .26rem
              color #666
              font-size .32rem
              font-weight 400
              line-height .58rem
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break break-all
              &.lose {
                background-color #fff
              }
            }
            .countWrapper {
              margin-top .21rem
              display flex
              height .58rem
              width 2.4rem
              border 1px solid #d7d7d7
              .minus, .add {
                width .53rem
                font-size 0
                img {
                  width 100%
                }
              }
              .count {
                flex 1
                border-left 1px solid #d7d7d7
                border-right 1px solid #d7d7d7
                text-align center
                line-height .58rem
              }
            }
            .priceWrapper {
              display flex
              line-height .37rem
              margin-top .21rem
              .direct {
                font-size .29rem
                font-weight 400
                color #333
                span {
                  font-size .37rem
                  font-weight 500
                  color #f70057
                }
              }
              .counter {
                margin-left .32rem
                color #9a9a9a
                font-size .29rem
                font-weight 400
                text-decoration line-through
              }
            }
            .del {
              font-size 0
              width .64rem
              height .64rem
              overflow hidden
              position absolute
              right .34rem
              bottom .26rem
              img {
                width 100%
              }
            }
          }
        }
      }
      .invalid {
        border-top .26rem solid #f3f3f3
        .header {
          display flex
          justify-content space-between
          padding 0 .53rem 0 .4rem
          line-height 1.2rem
          font-size .32rem
          font-weight 400
          background-color #fff
          border-bottom 1px solid #e7e7e7
          .left {
            color #666
          }
          .right {
            color #f8085c
          }
        }
      }
      .bottom {
        display flex
        justify-content center
        align-items center
        height 1.44rem
        .left, .right {
          background-color #999
          height 1px
          width 1.8rem
        }
        .center {
          color #999
          font-size .26rem
          font-weight 400
        }
      }
    }
    .toolbar {
      display flex
      height 1.44rem
      position fixed
      bottom 0
      left 0
      width 100%
      background-color #fff
      .left {
        flex 1
        display flex
        flex-direction column
        justify-content center
        align-items flex-end
        padding-right .32rem
        font-size .32rem
        font-weight 400
        color #333
        .top {
          span {
            color #f70057
            font-size .42rem
          }
        }
        .bottom {
          margin-top .16rem
        }
      }
      .right {
        width 3.2rem
        background-color #f70057
        color #fff
        font-size .42rem
        font-weight 500
        line-height 1.44rem
        text-align center
      }
    }
  }
</style>
