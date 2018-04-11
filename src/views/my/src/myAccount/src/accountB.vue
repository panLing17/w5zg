<template lang="pug">
  .account
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 账户
      .topRight(slot="right")
    .headerBox
      .left
        .price ￥{{balance | number}}
        .dec 账户余额
        .link(@click="$router.push({path:'/my/accountDetail/0'})") (点击查看明细)
      .right
        .price ￥{{tempBalance | number}}
        .dec 预计收入
        .link(@click="$router.push({path:'/my/revenue'})") (点击查看明细)
      .line
      .bottom 结算日期：2018-04-15
    .content
      .block 充值
      .block.arrow(@click="$router.push('/my/withdrawals')") 提现
      .block 积分
</template>

<script>
    export default {
      name: "account",
      data () {
        return {
          balance: 0,
          // 预计收入金额=冻结金额
          tempBalance:0
        }
      },
      created () {
        this.getBalance();
      },
      filters: {
        // 保留两位小数点
        number (value) {
          return Number(value).toFixed(2);
        }
      },
      methods: {
        getBalance () {
          this.balance = this.$store.state.userData.cash_balance;
          this.tempBalance = this.$store.state.userData.temp_balance;
        }
      }
    }
</script>

<style scoped>
  .account {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .headerBox {
    width: 100%;
    height: 3.5rem;
    background: url("../../../../../assets/img/background@2x.png") no-repeat top left;
    background-size: cover;
    display: flex;
    position: relative;
  }
  .headerBox .left, .headerBox .right {
    flex: 1;
    text-align: center;
    color: #fff;
    margin-top: .8rem;
  }
  .left .price, .right .price {
    font-weight: 400;
    font-size: .64rem;
    line-height: 1;
  }
  .left .dec, .right .dec {
    font-size: .4rem;
    line-height: 1;
    margin-top: .2rem;
  }
  .left .link, .right .link {
    font-size: .28rem;
    line-height: 1;
    color: rgb(242,242,242);
    margin-top: .26rem;
  }
  .line {
    width: .053rem;
    height: 2.08rem;
    background: #fff;
    border-radius: .026rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .bottom {
    position: absolute;
    bottom: .26rem;
    right: .26rem;
    font-size: .28rem;
    color: #fff;
  }
  .content {
    padding-top: .26rem;
  }
  .block {
    background: #fff;
    margin-top: .26rem;
    padding: 0 .21rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .arrow {
    background: url("../../../../../assets/img/more@2x.png") no-repeat center right .21rem #fff;
    background-size: .25rem auto;
  }
</style>
