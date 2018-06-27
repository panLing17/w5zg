<template lang="pug">
  .wrap
    .bgWrapper
      img.bgImg(src="../../../../../assets/img/nike9.png")
      img.bgImg2(src="")
    .name(v-show="showIndex===1", :style="{'animation-play-state': stateArr[0]}")
      img.nameImg(src="../../../../../assets/img/nike10.png")
    .name(v-show="showIndex===2", :style="{'animation-play-state': stateArr[1]}")
      img.nameImg(src="../../../../../assets/img/nike11.png")
    .name(v-show="showIndex===3", :style="{'animation-play-state': stateArr[2]}")
      img.nameImg(src="../../../../../assets/img/nike12.png")
    .name(v-show="showIndex===4", :style="{'animation-play-state': stateArr[3]}")
      img.nameImg(src="../../../../../assets/img/nike13.png")
    .name(v-show="showIndex===5", :style="{'animation-play-state': stateArr[4]}")
      img.nameImg(src="../../../../../assets/img/nike14.png")
    .name(v-show="showIndex===6", :style="{'animation-play-state': stateArr[5]}")
      img.nameImg(src="../../../../../assets/img/nike15.png")
    .timerWrapper
      .timer(v-if="s>0") {{s}}s
      .toNext(v-if="s<=0", @click="$router.push('/marketing/receiveTicket')") 跳过
</template>

<script>
  import shareImg from '../../../../../assets/img/applogo@2x.png'
  export default {
    name: "cssTest",
    data () {
      return {
        showIndex: 1,
        stateArr: ['paused','paused','paused','paused','paused','paused'],
        timer: null,
        s: 5,
        timer2: null
      }
    },
    mounted () {
      this.loadShare()
      this.startAnimate()
      this.timerToNext()
    },
    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      if (this.timer2) {
        clearInterval(this.timer2)
      }
    },
    methods: {
      timerToNext () {
        let _this = this
        this.$nextTick(()=>{
          this.timer2 = setInterval(()=>{
            this.s--
            if (this.s<=0) {
              clearInterval(_this.timer2)
            }

          },1000)
        })
      },
      loadShare () {
        this.$initShare({
          sharePhoto: 'http://www.w5zg.cn/' + shareImg.substr(1),
          shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
          shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
          link: ('http://www.w5zg.cn/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
        })
      },
      startAnimate () {
        let _this = this
        this.$nextTick(()=>{
          let index = 0
          this.stateArr.splice(index++, 1, 'running')
          this.timer = setInterval(()=>{
            if (_this.showIndex>=6) {
              clearInterval(_this.timer)
              _this.$router.push('/marketing/receiveTicket')
            }
            _this.stateArr.splice(index++, 1, 'running')
            _this.showIndex++
          },2500)
        })
      }
    }
  }
</script>

<style scoped>
  .wrap {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background: url('../../../../../assets/img/nike8.png') no-repeat;
    background-size: 100% 100%;
    /*background: #ff3050;*/
    overflow: hidden;
  }
  .bgWrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .bgImg {
    width: 80%;
    margin-top: 3.5rem;
    transform-origin: 50% 50% 0;
    animation:scalc 20s forwards;
  }
  .name {
    font-size: 0;
    text-align: center;
    animation:scalc 2.5s cubic-bezier(.17, .86, .73, .14) forwards;
    animation-play-state: paused;
    position: absolute;
    top: 7rem;
    left: 0;
    width: 100%;
  }
  .nameImg {
    width: 50%;
  }
  @keyframes  scale {
    0% { transform: scale(1); }
    100% { transform: scale(5);}
  }
  @keyframes scalc
  {
    0% {transform:scale(1);}
    80% {opacity: 1;}
    100% {transform:scale(2);opacity: 0;}
  }
  img {
    pointer-events: none;
  }
  .timerWrapper {
    position: absolute;
    top: .5rem;
    right: .5rem;
  }
  .timer {
    color: gray;
    font-size: .5rem;
    padding: 0 .3rem;
    border-radius: .5rem;
    border: 1px solid gray;
  }
  .toNext {
    color: gray;
    font-size: .5rem;
    padding: 0 .3rem;
    border-radius: .5rem;
    border: 1px solid gray;
  }
</style>
