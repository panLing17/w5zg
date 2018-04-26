<template lang="pug">
  .paymentResults
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{type==0?'支付成功':'支付失败'}}
      .topRight(slot="right")
    .content
      .successContent(v-if="type==0")
        .infoWrapper
          .price ￥200.00
          .dec 支付成功
          .git 获得￥200.00元现金券
          .btnWrapper
            .left 返回首页
            .right 查看订单
      .errorContent(v-if="type==1")
        img.icon(src="../../../assets/img/图层15@2x.png")
        .dec 支付失败
        .btnWrapper
          .left 返回首页
          .right 订单中心
</template>

<script>
  export default {
    name: "paymentResults",
    data () {
      return {
        type: 0
      }
    }
  }
</script>

<style scoped>
  .paymentResults {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .errorContent, .successContent {
    text-align: center;
    font-size: 0;
    background: #fff;
    padding-bottom: .45rem;
    line-height: 1;
  }
  .icon {
    width: 1.1rem;
    margin-top: .58rem;
  }
  .dec {
    font-size: .42rem;
    color: rgb(51,51,51);
    font-weight: 400;
    line-height: 1;
    margin-top: .48rem;
  }
  .btnWrapper {
    display: flex;
    justify-content: center;
    margin-top: .9rem;
  }
  .left, .right {
    flex: none;
    width: 2.6rem;
    height: .93rem;
    border-radius: .53rem;
    font-size: .34rem;
    line-height: .93rem;
    text-align: center;
  }
  .left {
    color: rgb(153,153,153);
    border: 1px solid rgb(153,153,153);
  }
  .right {
    color: rgb(245,0,87);
    border: 1px solid rgb(245,0,87);
    margin-left: 2rem;
  }
  .price {
    font-size: .48rem;
    color: rgb(51,51,51);
    padding-top: .72rem;
  }
  .successContent .dec {
    color: rgb(245,0,87);
    padding-bottom: .29rem;
    margin-top: .4rem;
  }
  .git {
    font-size: .32rem;
    color: rgb(153,153,153);

  }
  .infoWrapper {
    padding-bottom: .48rem;
  }
</style>
