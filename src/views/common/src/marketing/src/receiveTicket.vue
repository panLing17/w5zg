<template lang="pug">
  .wrap
    .headerWrapper
      .back(@click="$router.go(-1)")
        img.backImg(src="../../../../../assets/img/back@2x.png")
      .title 领取工会福利券和耐克鞋
    .contentWrapper
      .contentTop
        img.contentTopImg(src="../../../../../assets/img/nike1.png")
      .content
        .template1
          .template1ImgWrapper
            img.template1Img(src="../../../../../assets/img/nike2.png")
          .inputWrapper
            input.phone(type="number", placeholder="请输入手机号领取")
</template>

<script>
  export default {
    name: "receiveTicket"
  }
</script>

<style scoped>
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  .headerWrapper {
    height: 1.3rem;
    position: relative;
    padding: 0 .26rem;
  }
  .back {
    padding: .2rem;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  .backImg {
    width: .3rem;
    pointer-events: none;
  }
  .title {
    color: #333;
    font-size: .4rem;
    text-align: center;
    line-height: 1.3rem;
    font-weight: 600;
  }
  .contentWrapper {
    height: calc(100% - 1.3rem);
    background: #ff3050;
  }
  .contentTop {
    padding: .66rem .57rem .66rem .66rem;
  }
  .contentTopImg {
    width: 100%;
    pointer-events: none;
  }
  .content {
    width: 9.33rem;
    height: 10.26rem;
    background: #fff;
    border-radius: .13rem;
    margin: 0 auto;
  }
  .template1ImgWrapper {
    text-align: center;
    padding-top: .98rem;
  }
  .template1Img {
    width: 4.18rem;
    pointer-events: none;
  }
  .inputWrapper {
    text-align: center;
  }
  .phone {
    width: 7.2rem;
    height: 1.17rem;
    background: #e6e6e6;
    border-radius: .58rem;
    border: none;
    outline: none;
    text-align: center;
    font-size: .426rem;
    color: #333;
  }
  input::placeholder{
    color: rgb(153,153,153);
  }
</style>
