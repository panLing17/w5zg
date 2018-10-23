<template lang="pug">
  .orderConfirm(v-loading="loadingShow")
    .headerWrapper
      .back(@click="$router.go(-1)")
        img(src="./back.png")
      .title 确认订单
    scroll.contentWrapper(:data="scrollData")
      div
        .addressWrapper(@click="openAddress", v-show="confirmData.shippingMethods===0")
          .address(v-show="showAddress && showAddress.ra_name")
            .left
              .info 收货人：{{showAddress.ra_name}}<span>手机号：{{showAddress.ra_phone}}</span>
              .desc 收货地址：{{showAddress.province_name}}{{showAddress.city_name}}{{showAddress.county_name}}{{showAddress.ra_detailed_addr}}
            .right
              img(src="./more.png")
          .noAddress(v-show="!showAddress.ra_name")
            span 请添加收货地址
            img(src="./add2.png")
        .addressWrapper(v-show="confirmData.shippingMethods===1")
          .topItem
            .desc 提货人：
            input.text(v-model="selfForm.name", placeholder="请输入提货人姓名")
          .bottomItem
            .desc 手机号：
            input.text(v-model="selfForm.phone", placeholder="请输入11位手机号码")
        .goodsList
          ul.listWrapper(v-if="confirmData.from===0")
            li.item
              .storeName {{confirmData.shippingMethods===0?data.shop_Name:confirmData.bsName}}
              .itemWrapper
                .left
                  img(:src="data.logo | img-filter")
                .right
                  .name {{data.gi_name}}
                  .size
                    ul
                      li(v-for="i in data.specVOList") {{i.gspec_value}};
                  .price ¥ {{data.counter_price | price-filter2}}
                  .count X {{data.goods_num}}
              .freight(v-show="confirmData.shippingMethods===0") 运费:{{data.freight | price-filter}}
              .freight(v-show="confirmData.shippingMethods===1") 专柜自提
          ul(v-if="confirmData.from===1")
            li(v-for="item in data.commList", style="border-bottom: .26rem solid #f3f3f3;")
              ul.listWrapper
                .storeName {{confirmData.shippingMethods===0?item.si_name:item.store_name}}
                li.item(v-for="goods in item.shoppingCartVOList")
                  .itemWrapper
                    .left
                      img(:src="goods.logo | img-filter")
                    .right
                      .name {{goods.gi_name}}
                      .size
                        ul
                          li(v-for="i in goods.specVOList") {{i.gspec_value}};
                      .price ¥ {{goods.counter_price | price-filter2}}
                      .count X {{goods.goods_num}}
              .freight(v-show="confirmData.shippingMethods===0") 运费:{{item.freight | price-filter}}
              .freight(v-show="confirmData.shippingMethods===1") 专柜自提
        .total
          .totalCount 共计 {{totalCount}} 件商品<span>合计：</span>
          .totalPrice {{totalPrice | price-filter}}
        .ticketWrapper
          .block
            .left 现金券
            .right
              span 可抵扣{{ticketData.netCard}}元
              toggle-button(v-model="cashSwitch", :optional="cashOptional")
          .block
            .left 通用券
            .right
              span 可抵扣{{ticketData.commTicket}}元
              toggle-button(v-model="ticketSwitch", :optional="ticketOptional")
        .discount(v-if="ticketData.backCommTicket>0") 确认收货后，本单可返{{ticketData.backCommTicket}}元通用券
    .bottom
      .left
        span 实付：
        span.price {{directPrice | price-filter}}
      .right(@click="submitOrder") 提交订单
    express(ref="express", :addressList="addressData", @address-change="addressChange")
    check-goods(ref="checkGoods", :data="checkGoodsData", :btnType="btnType", @submit-order="reject")
</template>

<script>
  import Scroll from 'components/scroll'
  import ToggleButton from 'components/toggleButton'
  import Express from './express'
  // 不合格商品显示
  import CheckGoods from 'views/shoppingTrolley/src/checkGoods'
  import {mapGetters} from 'vuex'
  export default {
    name: "orderConfirm",
    data() {
      return {
        data: [],
        cashSwitch: true,
        cashOptional: true,
        ticketSwitch: false,
        ticketOptional: true,
        cityNo: '',
        addressData: [],
        showAddress: {},
        ticketData: {},
        totalCount: 0,
        totalPrice: 0,
        directPrice: 0,
        selfForm: {
          name: '',
          phone: ''
        },
        checkGoodsData: [],
        btnType: 2,
        loadingShow: false
      }
    },
    computed: {
      ...mapGetters(['confirmData']),
      scrollData() {
        return [this.data]
      }
    },
    watch: {
      addressData() {
        this.getData()
      },
      cashSwitch() {
        this.computedPrice()
        this.getTicket(1)
      },
      ticketSwitch() {
        this.computedPrice()
        this.getTicket(1)
      }
    },
    created() {
      if (typeof this.confirmData.from!=='number') {
        this.$router.go(-1)
        return
      }
      if (this.confirmData.shippingMethods===0) {
        this.getAddress()
      } else {
        this.getData()
      }
      this.getTicket()
    },
    methods: {
      // 获取订单数据
      getData() {
        let url = ''
        let params
        // from为0表示从商品详情过来 1表示从购物车过来
        if (this.confirmData.from===0) {
          params = {
            gskuId: this.confirmData.gsku_id,
            num: this.confirmData.goodsCount
          }
        } else {
          let arr = []
          this.confirmData.list.forEach(item=>{
            arr.push(item.sc_id)
          })
          params = {
            scIdArray: arr.join(',')
          }
        }
        if (this.confirmData.shippingMethods===0 && this.confirmData.from===0) {
          url = 'shoppingCart/v2/nowSubmitSendList1'
          params.cityNo = this.showAddress.ra_city ? this.showAddress.ra_city : ''

        }
        if (this.confirmData.shippingMethods===1 && this.confirmData.from===0) {
          url = 'shoppingCart/v2/nowSubmitCarryList1'
        }
        if (this.confirmData.shippingMethods===0 && this.confirmData.from===1) {
          url = 'shoppingCart/v2/submitSendList1'
          params.cityNo = this.showAddress.ra_city ? this.showAddress.ra_city : ''
        }
        if (this.confirmData.shippingMethods===1 && this.confirmData.from===1) {
          url = 'shoppingCart/v2/submitCarryList1'
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + url,
          params: params
        }).then(function (res) {
          if (res) {
            self.data = res.data.data
            self.getTotal()
          }
        })
      },
      getTotal() {
        if (this.confirmData.from===0) {
          this.totalCount = this.confirmData.goodsCount
          if (this.confirmData.shippingMethods===0) {
            this.totalPrice = this.data.counter_price * Number(this.confirmData.goodsCount) + this.data.freight
          } else {
            this.totalPrice = this.data.counter_price * Number(this.confirmData.goodsCount)
          }
        } else {
          this.totalCount = this.data.totalNum
          if (this.confirmData.shippingMethods===0) {
            let t = 0
            this.data.commList.forEach(item=>{
              t+=item.freight
            })
            this.totalPrice = this.data.totalPrice + t
          } else {
            this.totalPrice = this.data.totalPrice
          }
        }
        this.computedPrice()
      },
      // 计算实付价
      computedPrice() {
        if (typeof this.ticketData.netCard !=='number') {
          return
        }
        let a = this.cashSwitch?this.ticketData.netCard:0
        let b = this.ticketSwitch?this.ticketData.commTicket:0
        this.directPrice = this.totalPrice - a - b
      },
      // 卡券
      getTicket(flag) {
        let url = ''
        let params
        if (this.confirmData.from===0) {
          url = 'order/nowSubmitOrderCard'
          params = {
            gskuId:this.confirmData.gsku_id,
            netCardFlag: this.cashSwitch?'011':'012',
            num: this.confirmData.goodsCount
          }
        } else {
          let arr = []
          url = 'order/submitOrderCard'
          this.confirmData.list.forEach(item=>{
            arr.push(item.sc_id)
          })
          params = {
            gcIdArray: arr.join(','),
            netCardFlag: this.cashSwitch?'011':'012'
          }
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiTransaction + url,
          params: params
        }).then(function (res) {
          if (res) {
            self.ticketData = res.data.data
            if (self.ticketData.netCard>0) {
              if (flag!==1) {
                self.cashSwitch=true
              }
            } else {
              self.cashOptional = false
              self.cashSwitch=false
            }

            if (self.ticketData.commTicket<=0) {
              self.ticketOptional = false
            }
            self.computedPrice()
          }
        })
      },
      // 获取地址
      getAddress() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'receivingAddress/addresses',
          params: {},
        }).then(function (res) {
          if (res) {
            self.addressData = res.data.data
            self.addressData.forEach(item => {
              if (item.ra_default==='011') {
                self.showAddress = item
              }
            })
          }
        })
      },
      // 打开地址选择或者跳往新增地址
      openAddress() {
        if (this.addressData.length) {
          this.$refs.express.show()
        } else {
          this.$router.push('/my/localAdd')
        }

      },
      // 地址选择后
      addressChange(item) {
        this.showAddress = item
        this.getData()
      },
      // 提交订单
      submitOrder(flag) {
        if (this.confirmData.shippingMethods===0 && !this.showAddress.id) {
          this.$notify({
            content: '请选择收货地址',
            bottom: 3
          })
          return
        }
        if ((this.confirmData.shippingMethods===1 && this.selfForm.name.length===0) || (this.confirmData.shippingMethods===1 && this.selfForm.phone.length!==11)) {
          this.$notify({
            content: '请正确填写提货人信息',
            bottom: 3
          })
          return
        }
        this.loadingShow = true
        let url
        let params
        let selectedCount = 0
        if (this.confirmData.from===0) {
          params = {
            gskuId: this.data.gsku_id,
            netCardFlag: this.cashSwitch?'011':'012',
            commonTicketFlag: this.ticketSwitch?'011':'012',
            buyNum: this.confirmData.goodsCount
          }
          if (this.confirmData.shippingMethods === 0) {
            url = 'order/v2/nowSendOrder'
            params.deliveryId = this.showAddress.id
            params.supplierId = this.data.shop_id
          } else {
            url = 'order/v2/submitNowCarryOrder'
            params.carryPerson = this.selfForm.name
            params.carryPhone = this.selfForm.phone
            params.bsId = this.confirmData.bsId
            params.supplierId = this.confirmData.gs_id
          }
          if(flag === 1) {
            params.buyNum = this.checkGoodsData[0].storage_num
          }
        } else {
          params = {
            netCardFlag: this.cashSwitch?'011':'012',
            commonTicketFlag: this.ticketSwitch?'011':'012',
          }
          if (this.confirmData.shippingMethods === 0) {
            url = 'order/v2/submitSendOrder'
            params.deliveryId = this.showAddress.id
          } else {
            url = 'order/v2/submitCarryOrder'
            params.carryPerson = this.selfForm.name
            params.carryPhone = this.selfForm.phone
          }
          let arr = []
          this.confirmData.list.forEach(item=>{
            arr.push(item.sc_id)
            selectedCount++
          })
          if (flag===1) {
            this.checkGoodsData.forEach(item=>{
              if (item.status_flag==='NO_STORAGE_NUM' || item.status_flag==='GOOD_STATUS_ERROR') {
                for(let i=arr.length-1;i>=0;i--) {
                  if (item.sc_id===arr[i]) {
                    arr.splice(i, 1)
                  }
                }
              }
            })
          }
          params.gcIdArray = arr.join(',')
        }


        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiTransaction + url,
          params: params
        }).then(function (res) {
          self.loadingShow = false
          if (res) {
            if (res.data.data.flag) {
              self.$router.replace({path: '/payment', query:{id:res.data.data.totalOrderId, price: res.data.data.payPrice}})
            } else {
              let count = 0
              let type = 3
              res.data.data.commList.forEach(item=>{
                if (item.status_flag!=='VALID') {
                  count++
                }
                if (item.status_flag==='BUY_NUM_OVER_STORAGE_NUM') {
                  type = 2
                }
              })
              if (selectedCount>count) {
                type = 2
              }
              if (count>0) {
                self.checkGoodsData = res.data.data.commList
                self.btnType = type
                self.$refs.checkGoods.show()
              }
            }
          }
        })
      },
      // 剔除商品
      reject() {
        if(this.confirmData.from===0) {
          this.confirmData.goodsCount = this.checkGoodsData[0].storage_num
        } else {
          this.checkGoodsData.forEach(item=>{
            if (item.status_flag==='NO_STORAGE_NUM' || item.status_flag==='GOOD_STATUS_ERROR') {
              for (let i=this.confirmData.list.length-1; i>=0; i--) {
                if (item.sc_id===this.confirmData.list[i].sc_id) {
                  this.confirmData.list.splice(i, 1)
                }
              }

            }
          })
        }
        this.getData()
        this.getTicket()
      }
    },
    components: {
      Scroll,
      ToggleButton,
      Express,
      CheckGoods
    }
  }
</script>

<style scoped lang="stylus">
  input::-webkit-input-placeholder{
    color:#999;
  }
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
        position absolute
        top 0
        left 0
        padding .33rem .4rem
        img {
          width .64rem
        }
      }
      .title {
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
        height 2.18rem
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
          line-height 1.5
          .info, .desc {
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
            span {
              margin-left .5rem
            }
          }
          .desc {
            margin-top .22rem
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
        height 2.18rem
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
      .addressWrapper {
        height 2.18rem
        background-color #fff
        .topItem, .bottomItem{
          display flex
          padding 0 .4rem
          height .96rem
          align-items center
          color #333
          font-size .32rem
          font-weight 400
          .desc {

          }
          .text {
            flex 1
            outline none
            border none
            border-bottom 1px solid #d7d7d7
            line-height 2.18rem
            margin-left .2rem
            height 100%
          }
        }
      }
      .goodsList {
        margin-top .16rem
        background-color #fff
        .listWrapper {
          .storeName {
            height .9rem
            line-height .9rem
            color #666
            font-size .34rem
            font-weight 400
            border-bottom 1px solid #d7d7d7
            padding 0 .26rem
          }
          .itemWrapper {
            padding .26rem .40rem
            display flex
            position relative
            border-bottom 1px solid #d7d7d7

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
                ul {
                  display flex
                  li {
                    margin-right .1rem
                  }
                }
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
        color #9b9b9b
        font-weight 400
        font-size .32rem
        background-color #fff
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
