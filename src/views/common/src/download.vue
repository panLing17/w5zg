<template lang="pug">
  .wrap
    img.img1(src="../../../assets/img/applogo@2x.png")
    a.link(href="https://itunes.apple.com/cn/app/nan-jing-gong-hui/id1133445988?mt=8")
      img.img3(src="../../../assets/img/appstore@2x.png")
    a.link(href="http://a.app.qq.com/o/simple.jsp?pkgname=com.vungu.gonghui")
      img.img4(src="../../../assets/img/androidmarket@2x.png")
    img.img2(src="../../../assets/img/pic@2x.png")
    img.img5(src="../../../assets/img/gzh.jpg")
    .text 万物直供微信公众号
</template>

<script>

</script>

<style scoped>
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image:linear-gradient(135deg, #85ccf8 141.4213562373095px, #3db1f8 282.842712474619px)
  }
  img {
    pointer-events: none;
  }
  .img1, .img2, .img5{
    display: block;
  }
  .img1 {
    width: 2.13rem;
    margin: .8rem auto 0;
  }
  .link {
    display: block;
    text-align: center;
    margin-top: .76rem;
  }
  .img3, .img4 {
    width: 6.13rem;
  }
  .img2 {
    width: 9.2rem;
    margin: .2rem auto 0;
  }
  .img5 {
    width: 2.6rem;
    margin: -1rem auto 0;
    pointer-events: auto !important;
  }
  .text {
    color: #fff;
    font-size: .32rem;
    text-align: center;
    margin-top: .2rem;
  }
</style>
