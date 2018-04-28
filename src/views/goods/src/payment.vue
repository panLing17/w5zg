<template lang="pug">
  .paymentBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-2)")
      .topCenter(slot="center") 确认支付
      .topRight(slot="right")
    .price
      p 订单金额
      p {{$route.query.price | price-filter}}
    .paymentTypeTitle 请选择支付方式
    ul.paymentTypeSelect
      li(@click="changeType('pricePay')", v-if="userData.member_type === '092' ")
        img(src="../../../assets/img/pricePay.png")
        p
          span.top 账户余额
          span.bottom
        w-checkbox(v-model="type.pricePay")
      li(@click="changeType('aliPay')",  v-if="!wxFlag")
        img(src="../../../assets/img/alipay.png")
        p
          span.top 支付宝
          span.bottom 抽奖赢礼券，最高200元
        w-checkbox(v-model="type.aliPay")
      li(@click="changeType('wePay')" v-if="!alFlag")
        img(src="../../../assets/img/wepay.png")
        p
          span.top 微信支付
          span.bottom 亿万用户的选择,更快更安全
        w-checkbox(v-model="type.wePay")
      //li(@click="changeType('afterPay')")
        img(src="../../../assets/img/afterPay.png")
        p
          span.top 货到付款
          span.bottom 您购买的商品不支持货到付款
        w-checkbox(v-model="type.afterPay")
      //li(@click="changeType('bankPay')")
        img(src="../../../assets/img/bandPay.png")
        p
          span.top 银行卡支付
          span.bottom
        w-checkbox(v-model="type.bankPay")
    .comfirm
      w-button(@click="payment") 确认支付
    price-pay(:show="priceShow", @close="closePricePay", :orderId="$route.query.id")
</template>

<script>
    import pricePay from './pricePay'
    import {mapState} from 'vuex'
    export default {
      data () {
        return {
          priceShow: false,
          type:{
            pricePay: false,
            aliPay: false,
            wePay: false,
            afterPay: false,
            bankPay: false
          }
        }
      },
      name: "payment",
      components: {
        pricePay
      },
      computed: {
        wxFlag () {
          return this.isWeiXin()
        },
        alFlag () {
          let ua = window.navigator.userAgent.toLowerCase()
          if (ua.match(/Alipay/i) == 'alipay') {
            return true
          } else {
            return false
          }
        },
        ...mapState(['userData'])
      },
      mounted () {
        this.priceZero()
        // 判断用户有无支付密码
        // this.havePayPwd()
      },
      methods: {
        changeType (n) {
          for (let i in this.type) {
            this.type[i] = false
          }
          this.type[n] = true
        },
        isWeiXin() {
          let ua = window.navigator.userAgent.toLowerCase()
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true
          } else {
            return false
          }
        },
        payment () {
          let type = ''
          for (let i in this.type) {
            if (this.type[i]) {
              type = i
            }
          }
          let url = ''
          if (type === 'pricePay') {
            this.priceShow = true
            return
          }
          if (type === 'wePay') {
            if (this.isWeiXin()) {
              url = 'thirdPay/wechat/payUrl'
            } else {
              url = 'thirdPay/wechat/h5/pushOrder'
            }

          }
          if (type === 'aliPay') {
            url = 'thirdPay/alipay/payOrder'
          }
          let self = this
          self.$ajax({
            method: 'post',
            url: self.$apiTransaction + url,
            params: {
              orderId: self.$route.query.id
            }
          }).then(function (response) {
            if (type === 'aliPay') {
              let element = document.createElement('div')
              element.innerHTML = response.data.data
              document.body.appendChild(element)
              document.forms[0].submit()
            }
            if (type === 'wePay') {
              window.location = response.data.data
            }
          })
        },
        // 关闭余额支付
        closePricePay () {
          this.priceShow = false
        },
        // 检验订单金额
        priceZero () {
          let self = this
          self.$ajax({
            method: 'post',
            url:self.$apiTransaction +  'order/isPayPriceZero',
            params: {
              totalOrderId: self.$route.query.id
            },
          }).then(function (response) {
            if (response.data.data) {
              self.priceShow = true
              self.havePayPwd()
            }
          })
        },
        // 判断用户有无支付密码
        havePayPwd () {
          let self = this
          self.$ajax({
            method: 'post',
            url:self.$apiMember +  'member/check/isEmptyPayPwd',
            params: {
            },
          }).then(function (response) {
            if (response.data.data) {
              self.$message.warning('请设置支付密码')
              self.$router.push('/firstPayPassword')
            }
          })
        }
      }
    }
</script>

<style scoped>
  .paymentBox {
    background: rgb(242, 242, 242);
    min-height: 100vh;
  }
  .price {
    height: 1.5rem;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-weight: 600;
    font-size: .35rem;
  }
  .paymentTypeTitle {
    height: .8rem;
    line-height: .8rem;
    color: #aaa;
    padding-left: .2rem;
  }
  .paymentTypeSelect {
    background: white;
  }
  .paymentTypeSelect li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .3rem .2rem;
  }
  .paymentTypeSelect li img{
    width: .7rem;
  }
  .paymentTypeSelect li p{
    padding-left: .2rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .paymentTypeSelect li p .top{
    font-size: .35rem;
  }
  .paymentTypeSelect li p .bottom{
    font-size: .3rem;
    color: #aaaaaa;
  }
  .comfirm {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
</style>
