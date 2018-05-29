<template lang="pug">
   .wrapper
      img.img1(src="../../../assets/img/slogon@2x.png")
      img.img2(src="../../../assets/img/applogo2@2x.png")
      a.link(href="https://itunes.apple.com/cn/app/nan-jing-gong-hui/id1133445988?mt=8")
        img.img3(src="../../../assets/img/appstore@2x.png")
      a.link(href="http://a.app.qq.com/o/simple.jsp?pkgname=com.vungu.gonghui")
        img.img4(src="../../../assets/img/androidmarket@2x.png")
      img.img5(src="../../../assets/img/slogon2@2x.png")
      img.img6(src="../../../assets/img/gzhred.png")
      .text 万物直供微信公众号
      img.img7(src="../../../assets/img/union@2x.png")
</template>

<script>
    export default {
        name: "downloadGh"
    }
</script>

<style scoped>
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: url("../../../assets/img/backgroundpic@2x.png") no-repeat top left;
    background-size: 100% 100%;
    overflow: hidden;
  }
  img {
    pointer-events: none;
  }
  .img1, .img2, .img5, .img6, .img7 {
    display: block;
  }
  .img1 {
    width: 6.6rem;
    margin: .5rem auto 0;
  }
  .img2 {
    width: 2.13rem;
    margin: .5rem auto 0;
  }
  .link {
    display: block;
    text-align: center;
    margin-top: .5rem;
  }
  .img3, .img4 {
    width: 6.13rem;
  }
  .img5 {
    width: 4.26rem;
    margin: 1.6rem auto 0;
  }
  .img6 {
    width: 2.6rem;
    margin: .53rem auto 0;
    pointer-events: auto !important;
  }
  .text {
    color: #fff;
    font-size: .32rem;
    text-align: center;
    margin-top: .2rem;
  }
  .img7 {
    margin: .5rem auto 0;
    width: 4.7rem;
  }
</style>
