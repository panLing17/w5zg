<template lang="pug">
  .aboutUs
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 关于我们
      .topRight(slot="right")
    .flexBox
      .shareText 点击右上角分享给好友
      .logoText 万物直供
      p.one
        i.left
        span 专柜提货·直供价格·预约试穿
        i.right
      p.imgWrapper
        img(src="../../../assets/img/aboutUs.png")
      p.two 当前版本号：v1.0.11
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
    height: calc(100vh - 1.3rem);
  }
  .imgWrapper {
    text-align: center;
    font-size: 0;
    margin-top: .58rem;
  }
  .imgWrapper img{
    width: 5.3rem;
  }
  .one {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: .13rem;
  }
  i {
    width: 1rem;
    height: 1px;
    background: rgb(154,154,154);
  }
  i.left {
    margin-right: .2rem;
  }
  i.right {
    margin-left: .2rem;
  }
  .one span {
    font-size:.32rem;
    color:rgb(102,102,102);
    line-height:.45rem;
  }
  .two {
    color: rgb(102,102,102);
    text-align: center;
    margin-top: .26rem;
    line-height: .45rem;
  }
  .three {
    font-size: .4rem;
    text-align: center;
  }
  .three span{
    color: rgb(245,0,87);
    font-size: .8rem;
    margin: 0 .1rem;
  }
  .shareText {
    font-size: .32rem;
    color: rgb(102,102,102);
    text-align: right;
    padding-right: .37rem;
    line-height: .45rem;
    margin-top: .4rem;
  }
  .logoText {
    font-size:.66rem;
    color:rgb(224,56,139);
    line-height:.9rem;
    text-align: center;
    margin-top: .66rem;
  }
</style>
