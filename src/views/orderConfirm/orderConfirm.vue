<template lang="pug">
  .orderConfirm
    .headerWrapper
      .back(@click="$router.go(-1)")
        img(src="./back.png")
      .title 确认订单
    scroll.contentWrapper(:data="data")
      div
        .addressWrapper(@click="openAddress")
          .address(v-show="showAddress && showAddress.ra_name")
            .left
              .info 收货人：{{showAddress.ra_name}}<span>手机号：{{showAddress.ra_phone}}</span>
              .desc 收货地址：{{showAddress.province_name}}{{showAddress.city_name}}{{showAddress.county_name}}{{showAddress.ra_detailed_addr}}
            .right
              img(src="./more.png")
          .noAddress(v-show="!showAddress")
            span 请添加收货地址
            img(src="./add2.png")
        .goodsList
          ul.listWrapper
            li.item(v-for="item in data.shoppingCartVOList")
              .storeName {{data.si_name}}
              .itemWrapper
                .left
                  img(src="item.logo | img-filter")
                .right
                  .name {{item.gi_name}}
                  .size
                    ul
                      li(v-for="i in item.specVOList") {{i.gspec_value}};
                  .price ¥ {{item.direct_supply_price}}
                  .count X {{item.goods_num}}
        .freight 运费:￥{{data.freight}}
        .total
          .totalCount 共计 {{totalCount}} 件商品<span>合计：</span>
          .totalPrice ￥{{totalPrice | price-filter2}}
        .ticketWrapper
          .block
            .left 现金券
            .right
              span 可抵扣{{ticketData.netCard}}元
              toggle-button(v-model="cashSwitch", :optional="true")
          .block
            .left 通用券
            .right
              span 可抵扣{{ticketData.commTicket}}元
              toggle-button(v-model="ticketSwitch", :optional="false")
        .discount(v-if="ticketData.backCommTicket>0") 确认收货后，本单可返{{ticketData.backCommTicket}}元通用券
    .bottom
      .left
        span 实付：
        span.price ￥25.6
      .right 提交订单
    express(ref="express", :addressList="addressData", @address-change="addressChange")
</template>

<script>
  import Scroll from 'components/scroll'
  import ToggleButton from 'components/toggleButton'
  import Express from './express'
  import {mapGetters} from 'vuex'
  export default {
    name: "orderConfirm",
    data() {
      return {
        data: [],
        cashSwitch: true,
        ticketSwitch: false,
        cityNo: '',
        addressData: [],
        showAddress: {},
        ticketData: {},
        totalCount: 0,
        totalPrice: 0
      }
    },
    computed: {
      ...mapGetters(['confirmData']),
    },
    watch: {
      addressData(newValue) {
        this.getData()
      }
    },
    created() {
      if (this.confirmData.from===0) {
        this.getAddress()
      } else {
        this.getData()
      }
      this.getTicket()
    },
    methods: {
      // 获取订单数据
      getData() {
        if (typeof this.confirmData.from!=='number') {
          this.$router.go(-1)
        }
        let url = ''
        let params
        if (this.confirmData.from===0) {
          params = {
            gskuId: this.confirmData.gsku_id,
            num: this.confirmData.goodsCount
          }
        }
        if (this.confirmData.shippingMethods===0 && this.confirmData.from===0) {
          url = 'shoppingCart/v2/nowSubmitSendList1'
          params.cityNo = this.showAddress.ra_city ? this.showAddress.ra_city : ''

        }
        if (this.confirmData.shippingMethods===1 && this.confirmData.from===0) {
          url = 'shoppingCart/v2/nowSubmitCarryList1'
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
        }
      },
      // 卡券
      getTicket() {
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
          url = 'order/submitOrderCard'
          params = {

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
              self.cashSwitch=true
            } else {
              self.cashSwitch=false
            }

            if (self.ticketData.commTicket>0) {
              self.ticketSwitch=true
            } else {
              self.ticketSwitch = false
            }
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
      openAddress() {
        this.$refs.express.show()
      },
      addressChange(item) {
        this.showAddress = item
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
            span {
              margin-left .5rem
            }
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
