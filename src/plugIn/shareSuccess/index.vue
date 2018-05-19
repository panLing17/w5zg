<template lang="pug">
  .shareSuccessWrap(v-if="visible")
    .mask(@click.stop="visible=false")
    .adWrapper2
      .adWrap
        .cancelBtn(@click.stop="visible=false")
        .adContent
          .adTitle 分享有礼
          .ticketWrapper
            .ticket
              .left
                span.small ￥
                span {{ticketMoney}}
              .right
                .dec1 现金券
                .dec2 领取后3个月内有效
          .rightBtn(@click.stop="visible=false") 立即使用
</template>

<script>
  export default {
    name: "shareSuccess",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      ticketMoney: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style scoped>
  .shareSuccessWrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  .shareSuccessWrap .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,.5);
    z-index: 888;
  }
  .shareSuccessWrap .adWrapper2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }
  .shareSuccessWrap .adWrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8rem;
    z-index: 889;
  }
  .shareSuccessWrap .cancelBtn {
    height: 1.12rem;
    background: url("../../assets/img/ad5.png") no-repeat top right;
    background-size: .67rem 100%;
  }
  .shareSuccessWrap .adContent {
    background: #ffa619;
    color: #964b00;
    padding-bottom: .5rem;
  }
  .shareSuccessWrap .adTitle {
    font-size: .8rem;
    font-weight: bold;
    text-align: center;
    padding-top: .2rem;
  }
  .shareSuccessWrap .ticketWrapper {
    padding: 0 .6rem;
    position: relative;
  }
  .shareSuccessWrap .ticket {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    height: 2.4rem;
    border-radius: .3rem;
    margin-top: .6rem;
    position: relative;
    box-shadow: 1px 1px 5px rgba(150,75,0,.5);
  }
  .shareSuccessWrap .ticket:before, .shareSuccessWrap .ticket:after {
    content: '';
    width: .53rem;
    height: .53rem;
    display: block;
    background: #ffa619;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .shareSuccessWrap .ticket:before {
    top: -.26rem;
  }
  .shareSuccessWrap .ticket:after {
    bottom: -.26rem;
  }
  .shareSuccessWrap .ticket .left {
    flex: 1;
    font-weight: bold;
    font-size: .88rem;
    margin-left: .4rem;
  }
  .shareSuccessWrap .left .small {
    font-size: .58rem;
  }
  .shareSuccessWrap .ticket .right {
    flex: 1;
    text-align: right;
    margin-right: .26rem;
  }
  .shareSuccessWrap .right .dec1 {
    font-size: .48rem;
    font-weight: 400;
  }
  .shareSuccessWrap .right .dec2 {
    font-size: .29rem;
    margin-top: .1rem;
  }
  .shareSuccessWrap .rightBtn {
    color: #fff;
    background: linear-gradient(#ff6985, #ff2b7d);
    width: 3.25rem;
    height: 1rem;
    margin: .8rem auto 0;
    text-align: center;
    line-height: 1rem;
    font-size: .4rem;
    border-radius: .5rem;
  }
</style>
