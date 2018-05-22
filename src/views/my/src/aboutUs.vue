<template lang="pug">
  .aboutUs
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 关于我们
      .topRight(slot="right")
    .flexBox
      img(src="../../../assets/img/logo@2x.png")
      p.one 关注我们，以了解更多优惠资讯
      <!--qrcode(value="http://weixin.qq.com/r/Dy5AWELEmB-nrQY793sd", :options="{ size: 200 }")-->
      img(src="../../../assets/img/qrcode_w5zg_wechat.jpg")
      p.two 当前版本号：v1.0.2
      p.three 名品新款<span>3</span>折起, 专柜提货保正品
</template>

<script>
    export default {
        name: "about-us",
        methods: {
          aboutUs(){
            window.location.href = "http://weixin.qq.com/r/Dy5AWELEmB-nrQY793sd";
          }
        }
    }
</script>

<style scoped>
  .flexBox {
    margin-top: .5rem;
    display: flex;
    height: 12rem;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .flexBox img{
    width: 3rem;
  }
  .two {
    color: rgb(153,153,153);
  }
  .three {
    font-size: .4rem;
  }
  .three span{
    color: rgb(245,0,87);
    font-size: .8rem;
    margin: 0 .1rem;
  }
</style>
