<template lang="pug">
  .wrap
    nav-bar
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") APP下载
      .topRight(slot="right")
    .contentWrapper
      .imgWrapper
        img.one(src='../../../assets/img/download1.png')
        img.two(src='../../../assets/img/download2.png')
        img.three(src='../../../assets/img/download3.png')
      .decWrapper
        .dec 更多好物尽在万物直供APP
        .dec2 欢迎关注万物直供公众号
      .gzhWrapper
        img.gzh(src='../../../assets/img/gzh.jpg')
      .btnWrapper
        a
          .btn.android
            .left
              img.logo(src='../../../assets/img/android.png')
            .right Android Download
        a
          .btn.ios
            .left
              img.logo(src='../../../assets/img/ios.png')
            .right IOS Download
</template>

<script>
  export default {
    name: "download"
  }
</script>

<style scoped>
  .wrap {
    width: 100%;
    height: 100vh;
  }
  .contentWrapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: calc(100vh - 1.3rem);
  }
  .imgWrapper {
    flex: none;
    height: 8rem;
    position: relative;
  }

  .one, .two, .three {
    position: absolute;
    top: 0;
    width: 4.5rem;
    box-shadow: 0px 0px 5px rgba(0,0,0,.8);
    pointer-events: none;
  }
  .one {
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
  }
  .two {
    left: 0;
  }
  .three {
    right: 0;
  }
  .decWrapper {
    flex: none;
    text-align: center;
    margin-top: .3rem;
  }
  .dec {
    font-size: .4rem;
  }
  .dec2 {
    margin-top: .2rem;
    font-size: .3rem;
  }
  .gzhWrapper {
    flex: none;
    text-align: center;
    font-size: 0;
  }
  .gzh {
    width: 35%;
  }
  .btnWrapper {
    flex: none;
  }
  .btn {
    width: 80%;
    height: 1rem;
    margin: .2rem auto .5rem;
    border-radius: .1rem;
    display: flex;
    align-items: center;
  }
  .btn .left {
    flex: none;
    width: 1.6rem;
    text-align: center;
    position: relative;
    font-size: 0;
  }
  .left:after {
    content: '';
    width: 1px;
    height: .6rem;
    display: block;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
  .android .left:after {
    background: #006600;
  }
  .ios .left:after {
    background: #333333;
  }
  .logo {
    width: .8rem;
    pointer-events: none;
  }
  .btn .right {
    flex: 1;
    color: #fff;
    font-size: .4rem;
    text-align: center;
  }
  .android {
    background: #339933;
  }
  .ios {
    background: #000;
  }
</style>
