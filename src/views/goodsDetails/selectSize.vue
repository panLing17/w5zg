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
            // 数量加减---------------------------------------------------------------------------------
            .counteWrapper(v-show="fromType!==2")
              .left 购买数量
              .right
                .minus(@click="minus")
                  img(src="./minus.png")
                .count {{count}}
                .add(@click="add")
                  img(src="./add.png")
            // 配送选择---------------------------------------------------------------------------------
            .typeWrapper(v-show="fromType!==2")
              .typeName 配送方式
              .typeBtn
                .btn(:class="{active: shippingMethods===0}", @click="shippingMethodsChange(0)") 快递配送
                .btn(v-if="carryType===1", :class="{active: shippingMethods===1}", @click="shippingMethodsChange(1)") 专柜自提
              .address1(v-show="shippingMethods===1")
                .desc 专柜地址<span>(提货地影响库存，请正确选择）</span>
                .addressText(@click="openPop(1)")
                  img.addressImg(src="./address.png")
                  span(v-if="!store.bs_id") 请选择自提门店
                  span(v-else) {{store.bs_name}}
                  img.arrowImg(src="./arrow.png")
        // 底部按钮--------------------------------------------------------------------------------------
        .bottom
          .two(v-show="bottomBtnType===0")
            div(@click="submitGoods(2)") 加入购物车
            div(@click="submitGoods(4)") 立即购买
          .one(v-show="bottomBtnType===1", @click="saveReachGoods", style="background-color:#9D4AAD;") 到货通知
          .one(v-show="bottomBtnType===2 || bottomBtnType===4", @click="submitGoods(bottomBtnType)") 确定
          .one(v-show="bottomBtnType===3", @click="addTry") 预约体验

</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "selectSize",
    data () {
      return {
        selectSizeShow: false, //控制显示和隐藏
        count: 1, //数量
        //freight: 0, //运费   作废
        storageNum: 1, //sku接口返回的数量，为0表示无货，初始化为1
        selectionSize: [], //选中的规格
        skuData: {}, // sku信息
        shippingMethods: 0, //配送方式，0为快递 1为自提
        bottomBtnType: 0, // 底部按钮类型 0为默认，即显示加入购物车、立即购买 1为到货通知 2为确定从加入购物车来 4为确定从立即购买来 3为预约体验
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
        type: Number
      },
      // 是否可自提
      carryType: {
        type: Number,
        default: 0
      },
      // 配送地址显示
      address: {
        type: Object,
        default() {
          return {}
        }
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
      },
      // 品牌ID
      brandId: {
        type: Number
      }
    },
    computed: {
      logo () {
        return this.skuData.logo?this.skuData.logo:this.imgUrl
      },
      priceShow() {
        return this.skuData.direct_supply_price?this.skuData.direct_supply_price:this.price
      }
    },
    watch:{
      selectSizeShow(val) {
        if (val) {
          setTimeout(()=>{
            this.$refs.selectSizeScroll.refresh()
          }, 520)
        }
      },
      fromType(newVal) {
        if (newVal===0) {
          this.bottomBtnType = 0
        } else if (newVal===1) {
          this.bottomBtnType = 2
        } else if (newVal===2) {
          this.bottomBtnType = 3
        } else if (newVal===3) {
          this.bottomBtnType = 4
        }
      }
    },
    methods:{
      // 规格选择
      specChange(index, i) {
        let temp = this.specGroup[index]
        if (this.specGroup[index].checked === i) {
          temp.checked = -1
        } else {
          temp.checked = i
        }
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
          gspu_id: this.spuId,
          bi_id: this.brandId
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
              if (typeof res.data.data !== 'undefined') {
                self.storageNum = res.data.data.storage_num
                // 切换底部按钮
                if (self.storageNum===0 && self.fromType!==2) {
                  self.bottomBtnType = 1
                } else if(self.storageNum>0 && self.fromType===0) {
                  self.bottomBtnType = 0
                } else if (self.storageNum>0 && self.fromType===1) {
                  self.bottomBtnType = 2
                } else if(self.storageNum>0 && self.fromType===3) {
                  self.bottomBtnType = 4
                }else if (self.fromType===2) {
                  self.bottomBtnType = 3
                }
                self.selectionSizeFormat(res.data.data)
                self.skuData = res.data.data
                self.$emit('count', self.count)
                self.$emit('selection-size', self.skuData)
              }else {
                self.bottomBtnType = 1
                self.$emit('change-bottom-btn')
              }
            }
          })
        }
      },
      // sku尺码格式化
      selectionSizeFormat(data) {
        let temp = []
        for(let i=1; i<=5; i++) {
          if (data['spec_name'+i].length>0 && data['spec_value'+i].length>0) {
            temp.push({
              name: data['spec_name'+i],
              value: data['spec_value'+i]
            })
          }
        }
        data.selectionSize = temp
        this.selectionSize = temp
      },
      // 数量减
      minus() {
        if (this.count===1) {
          return
        }
        this.count--
        this.$emit('count', this.count)
      },
      // 数量加
      add() {
        if (!this.selectionSize.length) {
          this.$notify({
            content: '请选择规格',
            bottom: 1.8
          })
          return
        }
        if (this.count >= this.storageNum) {
          this.$notify({
            content: '商品库存不足',
            bottom: 1.8
          })
          return
        }
        this.count++
        this.$emit('count', this.count)
      },
      // 配送方式改变
      shippingMethodsChange(flag) {
        if (!this.skuData.gsku_id) {
          this.$notify({
            content: '请选择规格',
            bottom: 1.8
          })
          return
        }

        if (this.skuData.gsku_id && this.skuData.storage_num===0) {
          this.$notify({
            content: '商品库存不足',
            bottom: 1.8
          })
          return
        }
        this.shippingMethods = flag
        this.$emit('shipping-change', flag)
      },
      // 打开地址选择弹框或者门店地址弹框
      openPop(flag) {
        if (!this.skuData.gsku_id) {
          this.$notify({
            content: '请选择规格',
            bottom: 1.8
          })
          return
        }

        if (this.skuData.gsku_id && this.skuData.storage_num===0) {
          this.$notify({
            content: '商品库存不足',
            bottom: 1.8
          })
          return
        }
        this.$emit('open-pop', flag)
      },
      // 到货通知按钮点击
      saveReachGoods() {
        this.$emit('save-goods')
      },
      // 预约按钮点击
      addTry() {
        if (!this.skuData.gsku_id) {
          this.$notify({
            content: '请选择规格',
            bottom: 1.8
          })
          return
        }
        this.selectSizeShow = false
        this.$emit('try-show')
      },
      // 确定按钮点击
      submitGoods(flag) {
        if (!localStorage.getItem('token')) {
          this.$notify({
            content: '请先登录！',
            bottom: 1.8
          })
          this.$router.push('/login')
          return
        }
        if (!this.skuData.gsku_id) {
          this.$notify({
            content: '请选择规格',
            bottom: 1.8
          })
          return
        }

        if (this.shippingMethods===1 && !this.store.bs_id) {
          this.$notify({
            content: '请选择自提门店',
            bottom: 1.8
          })
          return
        }
        this.$emit('submit-goods', flag)
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
            &.active {
              border-color #f70057
              color #f70057
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
