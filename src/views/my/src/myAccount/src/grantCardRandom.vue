<template lang="pug">
  .grantCardRandom
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 随机发放网金卡
      .topRight(slot="right", @click="shareShow=true") 分享
    transition(name="fade")
      .mask(@click="shareShow=false", v-show="shareShow")
    transition(name="fold")
      .shareBox(v-show="shareShow")
        .title 分享到
        .shareContent
          .itemLeft
            img(src="../../../../../assets/img/friendster2@2x.png")
          .itemRight
            img(src="../../../../../assets/img/wechat2@2x.png")
        .close(@click="shareShow=false") 取消
    .content
      qrcode(value="img", :options="{ size: 200 }")
</template>

<script>
    export default {
        name: "grantCardRandom",
        data () {
          return {
            shareShow: false,
            img: null
          }
        },
      created() {
          this.getQrcode();
      },
      methods: {
        getQrcode() {
          let _this = this;
          this.$ajax({
            method: 'post',
            url: this.$apiMember + 'member/qrcode',
            params:{}
          }).then(function (response) {
            _this.img = response.data.data;
          })
        }
      }
    }
</script>

<style scoped>
  .grantCardRandom {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    background: rgba(51,51,51,.5);
    opacity: 1;
  }
  .shareBox {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 150;
    padding: 0 .2rem;
    box-sizing: border-box;
    transform: translate3d(0,0,0);
  }
  .shareBox.fold-enter-active, .shareBox.fold-leave-active {
    transition: all 0.5s;
  }
  .shareBox.fold-enter, .shareBox.fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .title {
    color: rgb(51,51,51);
    font-size: .4rem;
    text-align: center;
    line-height: .8rem;
  }
  .shareContent {
    display: flex;
    justify-content: space-between;
    padding: 0 1.8rem 1rem;
    box-sizing: border-box;
    border-bottom: 1px solid #999;
  }
  .itemLeft, .itemRight {
    flex: none;
    width: 1.3rem;
    height: 1.3rem;
    display: flex;
    align-items: center;
    position: relative;
  }
  .itemLeft:after, .itemRight:after {
    display: block;
    text-align: center;
    font-size: .3rem;
    position: absolute;
    bottom: -0.6rem;
    width: 100%;
  }
  .itemLeft:after {
    content: '朋友圈';
  }
  .itemRight:after {
    content: '微信';
  }
  .itemLeft img, .itemRight img {
    width: 100%;
  }
  .close {
    line-height: 1.1rem;
    text-align: center;
    color: rgb(245,0,87);
    font-size: .4rem;
  }
  .content {
    height: calc(100vh - 1.3rem);
    background: url("../../../../../assets/img/bottom@2x.png") no-repeat top left;
    background-size: 100% 100%;
    position: relative;
  }
  canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-40%);
  }
</style>
