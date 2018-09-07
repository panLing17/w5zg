<template lang="pug">
  .selectSize
    transition(name="fade")
      .mask(v-show="selectSizeShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .content(@touchmove.prevent="", v-show="selectSizeShow")
        // 头部-----------------------------------------------------------------------------------------
        .top
          .imgWrapper
            img(:src="imgUrl | img-filter")
          .textWrapper
            .price {{price | price-filter}}
            .size
              .no 请选择规格
              .yes
            .desc
              .yes 有货
              <!--.no 无货-->
          .close(@click="hide()")
            img(src="./close@2x.png")
        // 中间内容-------------------------------------------------------------------------------------
        scroll.center(:data="specGroup", ref="selectSizeScroll")
          div(style="padding-bottom: .8rem;")
            // 规格------------------------------------------------------------------------------------
            .specGroup
              .spec(v-for="(item, index) in specGroup")
                .specName {{item.spec_name}}
                ul.specValue
                  li(v-for="(value, i) in item.spec_value", @click="specChange(index, i)", :class="{active: item.checked===i}") {{value}}
            // 数量加减---------------------------------------------------------------------------------
            .counteWrapper
              .left 购买数量
              .right
                .minus
                  img(src="./minus.png")
                .count {{count}}
                .add
                  img(src="./add.png")
            // 配送选择---------------------------------------------------------------------------------
            .typeWrapper
              .typeName 配送方式
              .typeBtn
                .btn 快递配送
                .btn(v-if="carryType===1") 专柜自提
              .address1
                .desc 配送地址
                .addressText(v-show="true")
                  img.addressImg(src="./address.png")
                  span 南京市玄武区玄武大道699-22号南京市玄武区玄武大道699-22号
                  img.arrowImg(src="./arrow.png")
              .address1(v-show="false")
                .desc 专柜地址<span>(提货地影响库存，请正确选择）</span>
                .addressText
                  img.addressImg(src="./address.png")
                  span 南京市玄武区玄武大道699-22号南京市玄武区玄武大道699-22号
                  img.arrowImg(src="./arrow.png")
            // 运费------------------------------------------------------------------------------------
            .freightWrapper
              .desc 运费
              .freight {{freight}}元

        // 底部按钮--------------------------------------------------------------------------------------
        .bottom
          <!--.two-->
            <!--div 加入购物车-->
            <!--div 立即购买-->
          <!--.one 到货通知-->
          .one 确定
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "selectSize",
    data () {
      return {
        selectSizeShow: false, //控制显示和隐藏
        count: 1, //数量
        freight: 0, //运费
        address: [], //地址合集
        storageNum: 1
      }
    },
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
        type: String,
        default: ''
      },
      carryType: {
        type: Number,
        default: 0
      }
    },
    watch:{
      selectSizeShow(val) {
        if (val) {
          setTimeout(()=>{
            this.$refs.selectSizeScroll.refresh()
          }, 520)
        }
      }
    },
    methods:{
      // 规格选择
      specChange(index, i) {
        let temp = this.specGroup[index]
        temp.checked = i
        this.specGroup.splice(index, 1, temp)
        this.getSku()
      },
      // 根据规格调sku信息
      getSku() {
        if (!this.spuId) {
          return
        }
        let flag = true
        let params = {
          gspu_id: this.spuId
        }
        // 如果有-1表示还有规格没有选择
        this.specGroup.forEach((item, index)=>{
          if (item.checked === -1) {
            flag = false
            return false
          }
          params['spec_name'+(index+1)] = item.spec_name
          params['spec_value'+(index+1)] = item.spec_value[item.checked]
        })

        if (flag) {
          let self =this
          self.$ajax({
            method: 'post',
            url: self.$apiGoods + 'gcdetails/getSkuBySpecInfo',
            params: params
          }).then(function(res){
            if (res) {
              self.imgUrl = res.data.data.logo
            }
          })
        }
      },
      // 获取用户所有地址
      getAddress() {
        if (!localStorage.getItem('token')) {
          return
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'receivingAddress/addresses',
          params: {},
        }).then(function (response) {
          if(response) {
            self.address = response.data.data
          }
        })
      },
      hide() {
        this.selectSizeShow = false
      },
      show() {
        this.selectSizeShow = true
      }
    },
    components: {
      Scroll
    }
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
    z-index 20
  }
  .content {
    height $height-pop-details
    z-index 20
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
          color #ff0057
          line-height .56rem
        }
        .size {
          margin-top .1rem
          font-weight 400
          color #666
          font-size .32rem
          line-height .45rem
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
                color #ff0057
                border-color #ff0057
              }
            }
          }
        }
      }
      .counteWrapper {
        height 1.33rem
        display flex
        justify-content space-between
        align-items center
        border-bottom 1px solid #d7d7d7
        .left {
          color #333
          font-weight 500
          font-size .43rem
        }
        .right {
          width 2.8rem
          height .75rem
          display flex
          border 1px solid #666
          .minus, .add {
            flex none
            width .8rem
            display flex
            align-items center
            justify-content center
          }
          .count {
            flex 1
            text-align center
            line-height .75rem
            border-left 1px solid #666
            border-right 1px solid #666
          }
          img {
            width .45rem
          }
        }
      }
      .typeWrapper {
        .typeName {
          margin-top .26rem
          font-size .42rem
          color #333
          font-weight 500
          line-height .58rem
        }
        .typeBtn {
          display flex
          margin-top .18rem
          .btn {
            width 2.35rem
            height .75rem
            line-height .75rem
            text-align center
            border 1px solid #666
            color #333
            font-weight 400
            font-size .32rem
            border-radius .133rem
            margin-right .26rem
            .active {
              border-color #ff0057
              color #ff0057
            }
          }
        }
        .address1 {
          .desc {
            margin-top .34rem
            color #333
            font-weight 500
            font-size .42rem
            line-height .58rem
            span {
              margin-left .26rem
              color #999
              font-size .32rem
              font-weight 400
            }
          }
          .addressText {
            height 1rem
            display flex
            align-items center
            border-bottom 1px solid #d7d7d7
            .addressImg {
              width .32rem
            }
            span {
              flex 1
              margin-left .26rem
              font-size .32rem
              color #333
              font-weight 400
              text-overflow ellipsis
              overflow hidden
              white-space nowrap
              width calc(100% - 1.48rem)
            }
            .arrowImg {
              width .64rem
            }
          }
        }
      }
      .freightWrapper {
        margin-top .26rem
        display flex
        align-items center
        .desc {
          color #333
          font-size .42rem
          font-weight 500
        }
        .freight {
          margin-left .26rem
          color #666
          font-size .4rem
          font-weight 400
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
            background-color #ff0057
          }
        }
      }
      .one {
        height 100%
        background-color #ff0057
        line-height 1.33rem
        text-align center
        color #fff
        font-size .4rem
      }
    }
  }
</style>
