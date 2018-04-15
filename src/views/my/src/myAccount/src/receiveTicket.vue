<template lang="pug">
  .receiveTicket
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 万物商城现金券
      .topRight(slot="right")
    .content
      .decWrapper
        .title 万物商城
        .dec 800大品牌  线上下单 | 专柜提货
        img.bg(src="../../../../../assets/img/coupon2@2x.png")
      .formWrapper
        .text
          p 恭喜您
          p 获得 “万物商城” 现金券188元
        .form
          input(placeholder="请输入手机号领取", v-model="phone", type="number")
          .btn(@click="receive") 点击领取

</template>

<script>
  export default {
    name: "receiveTicket",
    data () {
      return {
        phone: ''
      }
    },
    methods: {
      receive () {
        let reg = /^1[0-9]{10}$/;
        if (!reg.test(this.phone)) {
          this.$message.error('手机号码格式不正确！');
          return;
        }
      }
    }
  }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color:rgb(204,204,204);
  }
  .receiveTicket {
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100vh;
    background: rgb(242,242,242);
  }
  .content {
    min-height: calc(100vh - 1.3rem);
    line-height: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  .decWrapper {
    flex: none;
  }
  .title {
    margin-top: 1.33rem;
    font-size: .64rem;
    color: rgb(51,51,51);
  }
  .dec {
    font-size: .42rem;
    color: rgb(102,102,102);
    margin-top: .34rem;
  }
  .bg {
    width: 100%;
    height: 4.45rem;
    position: relative;
    z-index: 150;
  }
  .formWrapper {
    margin-top: -1.1rem;
    background: rgb(231,55,62);
    flex: 1;
  }
  .text {
    margin-top: 2.38rem;
    color: #fff;
    font-size: .43rem;
    line-height: 1.5;
  }
  .form {
    margin-top: .74rem;
  }
  .form input, .form .btn {
    width: 7.45rem;
    height: 1rem;
    border-radius: 1rem;
  }
  .form input {
    display: inline-block;
    vertical-align: top;
    background: rgb(242,242,242);
    border: none;
    outline: none;
    text-align: center;
    color: rgb(51,51,51);
    font-size: .43rem;
  }
  .form .btn {
    margin: .4rem auto 0;
    background: rgb(255,147,30);
    color: #fff;
    font-size: .43rem;
    line-height: 1rem;
  }
</style>
