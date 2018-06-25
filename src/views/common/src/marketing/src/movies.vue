<template lang="pug">
  .wrap
    .bgWrapper
      img.bgImg(src="../../../../../assets/img/nike9.png")
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
    .name(v-show="showIndex===7", :style="{'animation-play-state': stateArr[6]}")
      img.nameImg(src="../../../../../assets/img/nike16.png")
</template>

<script>
  export default {
    name: "cssTest",
    data () {
      return {
        showIndex: 1,
        stateArr: ['paused','paused','paused','paused','paused','paused','paused'],
        timer: null
      }
    },
    mounted () {
      this.startAnimate()
    },
    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    methods: {
      startAnimate () {
        let _this = this
        this.$nextTick(()=>{
          let index = 0
          this.stateArr.splice(index++, 1, 'running')
          this.timer = setInterval(()=>{
            if (_this.showIndex>=7) {
              clearInterval(_this.timer)
              _this.$router.push('/marketing/receiveTicket')
            }
            _this.stateArr.splice(index++, 1, 'running')
            _this.showIndex++
          },1500)
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
    transform-origin: 50% 40% 0;
    animation:scalc 20s forwards;
  }
  .name {
    font-size: 0;
    text-align: center;
    animation:scalc 2.5s cubic-bezier(.17, .86, .73, .14) forwards;
    animation-play-state: paused;
    position: absolute;
    top: 5rem;
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
</style>
