<template lang="pug">
  div.accountCardBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 现金券
      .topRight(slot="right")
        p(style="color:#f50057; font-size: .4rem; font-weight: normal;", @click="$router.push('/my/cashDetailB')") 明细
    .balanceBox
      .balance {{balance | number}}
      .balanceDec 余额
    .listBox
      .item(@click="$router.push('/my/grantCard')") 发放现金券
      .item(@click="$router.push('/my/grantCardRandom')") 随机发放现金券
</template>

<script>
  export default {
    name: "accountCardB",
    data () {
      return {
        balance:0
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
        this.balance = Number(this.$store.state.userData.netcard_balance);
      }
    }
  }
</script>

<style scoped>
  .accountCardBox {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .balanceBox {
    width: 100%;
    height: 4rem;
    background: url("../../../../../assets/img/Cash@2x.png") no-repeat top center #ff80ab;
    background-size: auto 100%;
    position: relative;
    color: #fff;
    text-align: center;
  }
  .balance {
    line-height: 4rem;
    font-size: 1rem;
    font-weight: 400;
  }
  .balanceDec {
    position: absolute;
    bottom: .5rem;
    width: 100%;
    font-size: .4rem;
  }
  .item {
    line-height: 1.5rem;
    color: rgb(51,51,51);
    font-size: .4rem;
    margin-top: .2rem;
    padding: 0 .2rem;
    box-sizing: border-box;
    background: url("../../../../../assets/img/more@2x.png") no-repeat center right .2rem #fff;
    background-size: .25rem auto;
  }
</style>
