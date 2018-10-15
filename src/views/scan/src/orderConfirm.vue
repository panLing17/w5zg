<template lang="pug">
  .orderConfirm
    .headerWrapper
      .back
        img(src="./img/back.png")
      .title 确认订单
    scroll.contentWrapper(:data="data")
      div
        .typeWrapper
          .left 请选择提货方式
          .right
            .block
              img(:src="type===0?require('./img/radio2.png'):require('./img/radio1.png')")
              span 门店自提
            .block
              img(:src="type===1?require('./img/radio2.png'):require('./img/radio1.png')")
              span 门店配送
        .addressWrapper
          .address(v-show="false")
            .left
              .info 收货人：江苏省 南京市 玄武区 玄武大道699号<span>手机号：18262882660</span>
              .desc 收货地址：收货地址：江苏省 南京市 玄武区 玄武大道699号江苏省 南京市 玄武区 玄武大道699号
            .right
              img(src="./img/more.png")
          .noAddress(v-show="true")
            span 请添加收货地址
            img(src="./img/add2.png")
        .goodsList
          ul
            li(v-for="item in data")
              .left
                img(src="")
              .right
                .name 阿迪达斯adidas运动型格BOSFOI男子短袖T恤…
                .size 高姿焕白修斑精华露30ml+高姿焕白亮肤水20m高姿焕白修斑精华露30ml+高姿焕白亮肤水20m
                .price ¥ 299.45
                .count X 1
        .freight 运费:￥0
        .total
          .totalCount 共计 2 件商品<span>合计：</span>
          .totalPrice ￥2663.22
        .ticketWrapper
          .block
            .left 现金券
            .right
              span 可抵扣300.67元
              toggle-button(v-model="cashSwitch", :optional="true")
          .block
            .left 通用券
            .right
              span 可抵扣300.67元
              toggle-button(v-model="ticketSwitch", :optional="false")
        .discount 确认收货后，本单可返100元通用券
    .bottom
      .left
        span 实付：
        span.price ￥25.6
      .right 提交订单
    express
</template>

<script>
  import Scroll from 'components/scroll'
  import ToggleButton from 'components/toggleButton'
  import Express from './express'
  export default {
    name: "orderConfirm",
    data() {
      return {
        type: 0,
        data: [1,1,1,1,1,1],
        cashSwitch: false,
        ticketSwitch: false
      }
    },
    components: {
      Scroll,
      ToggleButton,
      Express
    }
  }
</script>

<style scoped lang="stylus">
  .orderConfirm {
    position absolute
    top 0
    left 0
    width 100%
    height 100vh
    background-color #f2f2f2
    .headerWrapper {
      height 1.3rem
      background-color #f70057
      position relative
      .back {
        padding .33rem .4rem
        img {
          width .64rem
        }
      }
      .title {
        position absolute
        top 0
        left 0
        line-height 1.3rem
        text-align center
        width 100%
        color #fff
        font-size .48rem
        font-weight 500
      }
    }
    .contentWrapper {
      height calc(100% - 2.4rem)
      overflow hidden
      .typeWrapper {
        height 1.1rem
        background-color #fff
        display flex
        align-items center
        justify-content space-between
        padding 0 .4rem
        font-size .32rem
        font-weight 400
        color #333
        .right {
          display flex
          align-items center
          .block {
            display flex
            align-items center
            margin-right .53rem
            &:last-child {
              margin 0
            }
            img {
              width .64rem
            }
            span {
              margin-left .05rem
            }
          }
        }
      }
      .address {
        height 1.92rem
        background-color #fff
        border-top 1px solid #e7e7e7
        padding 0 .34rem 0 .4rem
        display flex
        .left {
          width calc(100% - .64rem)
          display flex
          flex-direction column
          justify-content center
          font-size .37rem
          color #333
          font-weight 400
          line-height 1
          .info, .desc {
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
          }
          .desc {
            margin-top .32rem
          }
        }
        .right {
          font-size 0
          img {
            margin-top .26rem
            width .64rem
          }
        }
      }
      .noAddress {
        border-top 1px solid #e7e7e7
        height 1.92rem
        display flex
        align-items center
        justify-content center
        background-color #fff
        img {
          margin-left .16rem
          width .37rem
        }
        span {
          font-size .37rem
          color #333
          font-weight 400
        }
      }
      .goodsList {
        margin-top .16rem
        background-color #fff
        ul {
          padding 0 .26rem
          li {
            padding .26rem .14rem
            display flex
            border-bottom 1px solid #d7d7d7
            position relative
            &:last-child {
              border none
            }
            .left {
              width 1.8rem
              height 1.8rem
              overflow hidden
              font-size 0
              border-radius .08rem
              img {
                width 100%
              }
            }
            .right {
              margin-left .32rem
              width calc(100% - 2.12rem)
              .name {
                margin-top .1rem
                font-size .32rem
                font-weight 400
                color #333
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
                line-height 1
              }
              .size {
                margin-top .32rem
                line-height 1
                color #999
                font-size .32rem
                font-weight 400
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
              }
              .price {
                margin-top .32rem
                line-height 1
                color #f70057
                font-size .37rem
                font-weight 400
              }
              .count {
                position absolute
                bottom .37rem
                right .4rem
                color #333
                font-size .32rem
                font-weight 400
              }
            }
          }
        }
      }
      .freight {
        height .8rem
        line-height .8rem
        padding-right .58rem
        color #333
        font-weight 400
        font-size .32rem
        background-color #fff
        border-top 1px solid #d7d7d7
        text-align right
      }
      .total {
        display flex
        justify-content flex-end
        align-items center
        height 1.28rem
        color #333
        font-size .32rem
        font-weight 400
        padding 0 .4rem
        .totalCount {
          span {
            margin-left .32rem
          }
        }
        .totalPrice {
          color #f70057
          font-size .48rem
        }
      }
      .ticketWrapper {
        background-color #fff
        .block {
          height 1rem
          display flex
          align-items center
          justify-content space-between
          padding 0 .4rem
          border-bottom 1px solid #d7d7d7
          &:last-child {
            border none
          }
          .left {
            font-size .37rem
            color #333
            font-weight 400
          }
          .right {
            display flex
            align-items center
            span {
              font-size .32rem
              font-weight 400
              color #666
              margin-right .08rem
            }
          }
        }
      }
      .discount {
        background-color #fff5df
        height .8rem
        line-height .8rem
        text-align right
        padding-right .29rem
        color #f70057
        font-size .32rem
        font-weight 400
      }
    }
    .bottom {
      height 1.1rem
      background-color #fff
      display flex
      justify-content flex-end
      border-top 1px solid #d7d7d7
      .left {
        flex 1
        display flex
        align-items center
        justify-content flex-end
        padding-right .32rem
        span {
          color #4a4a4a
          font-weight 400
          font-size .32rem
          &.price {
            color #f70057
            font-size .48rem
          }
        }
      }
      .right {
        width 3.2rem
        background-color #f70057
        line-height 1.1rem
        text-align center
        color #fff
        font-size .42rem
        font-weight 500
      }
    }
  }
</style>
