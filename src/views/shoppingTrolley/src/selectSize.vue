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
              .yes
                ul
                  li(v-for="item in selectionSizeText") {{item.value}}
            .desc
              .yes(v-show="num>0") 有货
              .no(v-show="num===0") 无货
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
          .one(v-show="bottomBtn===1", @click="saveReachGoods",  style="background-color:#9D4AAD;") 到货通知
          .one(v-show="bottomBtn===2", @click="submitGoods") 确定
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "selectSize",
    props: {
      resetSpec: {
        type: Object
      },
      // 商品规格
      specGroup: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data () {
      return {
        selectSizeShow: false, //控制显示和隐藏
        storageNum: -1, //sku接口返回的数量，为0表示无货，初始化为1
        selectionSize: [], //选中的规格
        skuData: {}, // sku信息
        bottomBtnType: 2, // 底部按钮类型 1为到货通知 2为确定从加入购物车来 4为确定从立即购买来 3为预约体验
      }
    },
    computed: {
      logo () {
        return this.skuData.logo?this.skuData.logo:this.resetSpec.imgUrl
      },
      priceShow() {
        return this.skuData.direct_supply_price?this.skuData.direct_supply_price:this.resetSpec.price
      },
      selectionSizeText() {
        return this.selectionSize.length?this.selectionSize:this.resetSpec.selectionSize
      },
      num() {
        return this.storageNum===-1?this.resetSpec.storageNum:this.storageNum
      },
      bottomBtn() {
        return this.resetSpec.storageNum===0 && this.storageNum===-1?1:this.bottomBtnType
      }
    },
    methods: {
      show() {
        this.selectSizeShow = true
      },
      hide() {
        Object.assign(this.$data, this.$options.data())
        this.selectSizeShow = false
      },
      specChange(index, i) {
        let temp = this.specGroup[index]
        temp.checked = i
        this.specGroup.splice(index, 1, temp)

        this.getSku()
      },
      getSku() {
        let flag = true
        let params = {
          gspu_id: this.resetSpec.spuId
        }
        // 如果有-1表示还有规格没有选择
        let selectionSizeTemp = []
        this.specGroup.forEach((item, index)=>{
          if (item.checked === -1) {
            flag = false
            return false
          }
          let name = 'spec_name'+(index+1)
          let value = 'spec_value'+(index+1)
          params[name] = item.spec_name
          params[value] = item.spec_value[item.checked]
          selectionSizeTemp.push({
            name: item.spec_name,
            value: item.spec_value[item.checked]
          })
        })

        if (flag) {
          let self =this
          self.$ajax({
            method: 'post',
            url: self.$apiGoods + 'gcdetails/getSkuBySpecInfo',
            params: params
          }).then(function(res){
            if (res) {
              if (typeof res.data.data.gsku_id !== 'undefined') {
                self.storageNum = res.data.data.storage_num
                if(res.data.data.storage_num===0) {
                  self.bottomBtnType = 1
                } else {
                  self.bottomBtnType = 2
                }
                self.selectionSize = selectionSizeTemp
                self.skuData = res.data.data
              }else {
                self.selectionSize = selectionSizeTemp
                self.storageNum = 0
                self.bottomBtnType = 1
              }
            }
          })
        }
      },
      saveReachGoods() {
        let params
        if (this.skuData.gsku_id) {
          params = {
            gsku_id: this.skuData.gsku_id
          }
        } else {
          let str = ''
          this.specGroup.forEach(item => {
            str = str + item.spec_name+','+ item.spec_value[item.checked]+','
          })
          str = str.substring(0, str.length-1)
          params = {
            gspu_id: this.resetSpec.spuId,
            spec: str
          }
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'ucMessage/saveReachGoodsMessageInfo',
          params: params
        }).then(function (res) {
          if (res) {
            self.hide()
            self.$notify({
              content: '如果30天内到货,会通过系统消息提醒您',
              bottom: 3
            })
          }
        })
      },
      submitGoods() {
        if (this.skuData.gsku_id) {
          let self = this
          self.$ajax({
            method: 'post',
            url: self.$apiGoods + '/shoppingCart/v2/updateShoppingCart',
            params: {
              scId : this.resetSpec.scId,
              gskuId: this.skuData.gsku_id
            }
          }).then(function (res) {
            if (res) {
              self.$emit('spec-change', {
                spec: self.selectionSize,
                skuId: self.skuData.gsku_id
              })
            }
          })
        }
        this.hide()
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
    z-index 400
  }
  .content {
    height 10rem
    z-index 400
    position fixed
    bottom 1.38rem
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
      height calc(100% - 4.21rem)
      overflow hidden
      .specGroup {
        padding 0 .4rem
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
      position absolute
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

