<template lang="pug">
  .wrap(ref="scroll")
    .content
      img(src="../../../../../assets/img/01_index_1.png", @load="imgLoad++")
      .btn(@click="toNext1")
        img(:src="!isPartake?require('../../../../../assets/img/01_index_2_1.jpg'):require('../../../../../assets/img/01_index_2_2.jpg')", @load="imgLoad++")
      img(src="../../../../../assets/img/01_index_3.png", @load="imgLoad++")
      img(src="../../../../../assets/img/01_index_4.jpg", @load="imgLoad++")
      img(src="../../../../../assets/img/01_index_5.png", @load="imgLoad++")
      .tabWrapper
        .left(@click="showPop(1)") 活动安排 >
        .right(@click="showPop(2)") 领取方法 >
      .btn(@click="toNext2")
        img(:src="!isPartake?require('../../../../../assets/img/01_index_8_1.png'):require('../../../../../assets/img/01_index_8_2.png')", @load="imgLoad++")
    transition(name="fade")
      .mask(@click="popShow=false", v-if="popShow", @touchmove.stop="")
    transition(name="fade")
      .popWrapper(v-if="popShow", @touchmove.stop="")
        .temp1(v-if="temp==1", @touchmove.stop="")
          .titleBtn 活动安排
          .desc1 送一万双耐克鞋，限3万人报名参加，(成功率33%)，按领券数排名，立得一双1200元耐克鞋。
          .desc2 即日起，报名满2万人，短信通知报名者：活动开始。
        .temp2(v-if="temp==2", @touchmove.stop="")
          .titleBtn 领取方法
          .info 1)领鞋地址：
            span 金陵晚报大厦1F大厅(南京市XX区XX路XX号)，由金陵晚报监督下发放。
          .info 2)领鞋凭证：
            span 我们将发放提货码，请您凭提货码领取。
          .info 3)领取时间：
            span 活动结束后7天内，早9:00-晚18:00
          .info.last 4)温馨提示：
            span 为防止刷单，确保公平。领鞋时，我们将核对手机号、微信号、邀好友领券记录，向助力好友晒鞋鸣谢。
        .closeBtn(@click.prevent="popShow=false", @touchmove.stop="")
          img.closeBtnImg(src="../../../../../assets/img/01_index_10_rules_close.png")
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "index",
    data () {
      return {
        isPartake: false,
        temp: 0,
        popShow: false,
        imgLoad: 0
      }
    },
    watch: {
      imgLoad (val) {
        if (val == 6) {
          this.scroll = new BScroll(this.$refs.scroll, {
            click: true
          })
        }
      }
    },
    mounted () {
      document.title = '专题活动名称';
    },
    methods: {
      showPop (index) {
        this.temp = index;
        this.popShow = true;
      },
      toNext1 () {
        if (!this.isPartake) {
          this.$router.push('/marketing/movies')
        } else {

        }
      },
      toNext2 () {
        if (!this.isPartake) {
          this.$router.push('/marketing/movies')
        } else {
          this.$router.push('/home')
        }
      }
    }
  }
</script>

<style scoped>
  .wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }
  .content {
    font-size: 0;
  }
  img {
    width: 100%;
    pointer-events: none;
  }
  .tabWrapper {
    display: flex;
    justify-content: center;
    background: #ff2d4a;
  }
  .left, .right {
    width: 3.6rem;
    height: 1rem;
    background: #d80014;
    border-radius: .13rem;
    color: #fff;
    line-height: 1rem;
    font-size: .4rem;
    text-align: center;
  }
  .right {
    margin-left: .34rem;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,.5);
  }
  .popWrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 10;
  }
  .temp1, .temp2 {
    width: 8.56rem;
    margin: 0 auto;
    background: #fff;
    border-radius: .26rem;
    padding: .53rem .53rem 1.2rem;
  }
  .titleBtn {
    border-radius: .5rem;
    border: 1px solid #ff2d4a;
    line-height: .8rem;
    width: 2.46rem;
    text-align: center;
    color: #ff2d4a;
    font-size: .37rem;
  }
  .desc1, .desc2 {
    line-height: 1.5;
    font-size: .32rem;
  }
  .desc1 {
    margin-top: .4rem;
  }
  .desc2 {
    margin-top: .53rem;
  }
  .closeBtn {
    text-align: center;
    font-size: 0;
    margin-top: .4rem;
  }
  .closeBtnImg {
    width: 1rem;
  }
  .info {
    color: #666;
    margin-top: .4rem;
    line-height: 1.5;
  }
  .info.last {
    margin-top: .9rem;
  }
  .info span {
    color: #333;
  }
</style>
