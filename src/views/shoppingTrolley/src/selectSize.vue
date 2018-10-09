<template lang="pug">
  .selectSize
    transition(name="fade")
      .mask(v-show="selectSizeShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .content(@touchmove.prevent="", v-show="selectSizeShow")
        // 头部-----------------------------------------------------------------------------------------
        .top
          .imgWrapper
            img(:src="logo | img-filter")
          .textWrapper
            .price {{priceShow | price-filter}}
            .size
              .no(v-show="!selectionSize.length") 请选择规格
              .yes(v-show="selectionSize.length")
                ul
                  li(v-for="item in selectionSize") {{item.value}}
            .desc
              .yes(v-show="storageNum>0") 有货
              .no(v-show="storageNum===0") 无货
          .close(@click="hide()")
            img(src="./close@2x.png")
        // 中间内容-------------------------------------------------------------------------------------
        scroll.center(:data="specGroup", ref="selectSizeScroll")
          div(style="padding-bottom: .8rem;")
            // 规格------------------------------------------------------------------------------------
            .specGroup
              .spec(v-for="(item, index) in specGroup")
                .specName {{item.spec_name}}<span v-show="item.checked===-1">请选择</span>
                ul.specValue
                  li(v-for="(value, i) in item.spec_value",
                  @click="specChange(index, i)",
                  :class="{active: item.checked===i}"
                  ) {{value}}
        // 底部按钮--------------------------------------------------------------------------------------
        .bottom
          .one(v-show="bottomBtnType===1", @click="saveReachGoods", style="background-color:#9D4AAD;") 到货通知
          .one(v-show="bottomBtnType===2", @click="submitGoods(bottomBtnType)") 确定
</template>

<script>
  export default {
    name: "selectSize",
    props: {
      // 商品图片
      imgUrl: {
        type: String,
        default: ''
      },
      // 商品价格
      price: {
        type: Number,
        default: 0
      },
      // 商品规格
      specGroup: {
        type: Array,
        default() {
          return []
        }
      },
      spuId: {
        type: Number
      },
      // 打开此弹框按钮类型
      fromType: {
        type: 0
      },
      // 选中的自提门店信息
      store: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data () {
      return {
        selectSizeShow: false, //控制显示和隐藏
        storageNum: 1, //sku接口返回的数量，为0表示无货，初始化为1
        selectionSize: [], //选中的规格
        skuData: {}, // sku信息
        bottomBtnType: 2, // 底部按钮类型 0为默认，即显示加入购物车、立即购买 1为到货通知 2为确定从加入购物车来 4为确定从立即购买来 3为预约体验
      }
    },
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .fold-enter-active, .fold-leave-active {
    transition: all 0.5s;
  }
  .fold-enter, .fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  img {
    pointer-events none
  }
  .mask {
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    background-color rgba(0,0,0,.5)
    z-index 100
  }
  .content {
    height $height-pop-details
    z-index 100
    position fixed
    bottom 0
    left 0
    width 100%
    background-color #fff
    .top {
      height 2.88rem
      position relative
      border-bottom 1px solid #d7d7d7
      .imgWrapper {
        position absolute
        bottom .26rem
        left .26rem
        border 1px solid #d7d7d7
        border-radius .13rem
        overflow hidden
        width 3.25rem
        height 3.25rem
        img {
          width 100%
        }
      }
      .textWrapper {
        position absolute
        top .426rem
        left 4rem
        .price {
          font-size .48rem
          color #f70057
          line-height .56rem
        }
        .size {
          margin-top .1rem
          font-weight 400
          color #666
          font-size .32rem
          line-height .45rem
          ul {
            display flex
            li {
              margin-right .1rem
              &:last-child {
                margin-right 0
              }
            }
          }
        }
        .desc {
          font-size .34rem
          font-weight 500
          line-height .48rem
          margin-top .08rem
          .yse {
            color #333
          }
          .no {
            color #999
          }
        }
      }
      .close {
        position absolute
        right .26rem
        top .4rem
        img {
          width .4rem
        }
      }
    }
    .center {
      height "calc(%s - 4.21rem)" % $height-pop-details
      overflow hidden
      padding 0 .4rem
      .specGroup {
        .spec {
          padding .4rem .0 0
          .specName {
            font-size .426rem
            color #333
            font-weight 500
            span {
              margin-left .26rem
              color #f70057
              font-size .32rem
            }
          }
          .specValue {
            margin-top .18rem
            li {
              display inline-block
              height .75rem
              line-height .75rem
              padding 0 .13rem
              border 1px solid #666
              border-radius .13rem
              margin 0 .26rem .13rem 0
              text-align center
              min-width 1rem
              font-size .35rem
              color #333
              font-weight 400
              &.active {
                color #f70057
                border-color #f70057
              }
              &.gray {
                color #fff
                border-color #e8e8e8
                background-color #e8e8e8
              }
              &.noStorage {
                color #666
                background-color #e8e8e8
                border-color #e8e8e8
              }
              &.noStorageActive {
                color #fff
                background-color #999
                border-color #999
              }
            }
          }
        }
      }
    }
    .bottom {
      position fixed
      bottom 0
      left 0
      width 100%
      height 1.33rem
      .two {
        height 100%
        display flex
        div {
          flex 1
          line-height 1.33rem
          text-align center
          color #fff
          font-size .4rem
          &:nth-child(1) {
            background-color #ff8500
          }
          &:nth-child(2) {
            background-color #f70057
          }
        }
      }
      .one {
        height 100%
        background-color #f70057
        line-height 1.33rem
        text-align center
        color #fff
        font-size .4rem
      }
    }
  }

</style>

