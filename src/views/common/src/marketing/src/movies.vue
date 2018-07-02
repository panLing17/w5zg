<template lang="pug">
  .wrap
    .bgWrapper
      img.bgImg(src="../../../../../assets/img/nike9.png", :style="{'animation-play-state': bgArr[0]}", v-show="bg1")
      img.bgImg2(src="../../../../../assets/img/nike92.png", :style="{'animation-play-state': bgArr[1]}", v-show="bg2")
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
      .timer(v-if="start") <span>{{s}}s</span>后,进入领券/领鞋活动
      <!--.toNext(v-if="s<=0", @click="$router.push('/marketing/receiveTicket')") 跳过-->
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
        s: 15,
        timer2: null,
        bg1: false,
        bg2: false,
        bgArr: ['paused', 'paused'],
        start: false
      }
    },
    mounted () {
      this.loadShare()
      this.startAnimate()
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
      getLocationHref () {
        let href1 = window.location.href.split('/#')
        let href2 = window.location.href.split('/?')
        if (href1.length <= 1) {
          return href2[0]
        } else {
          return href1[0]
        }
      },
      // 分享
      loadShare () {
        console.log(this.getLocationHref())
        let _this = this
        if (localStorage.getItem('sharerId') == 'undefined' || !localStorage.getItem('sharerId')) {
          if (localStorage.getItem('phone') && localStorage.getItem('phone').length === 11) {
            this.getSharerId(function (data) {
              if (data != 'null') {
                _this.$initShare({
                  sharePhoto: _this.getLocationHref() + '/' + shareImg.substr(1),
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: (_this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + data).replace(/\?*#/, "?#")
                })
              } else {
                _this.$initShare({
                  sharePhoto: _this.getLocationHref() + '/' + shareImg.substr(1),
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: (_this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
                })
              }
            })
          } else {
            this.$initShare({
              sharePhoto: this.getLocationHref() + '/' + shareImg.substr(1),
              shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
              shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
              link: (this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
            })
          }
        } else {
          this.$initShare({
            sharePhoto: this.getLocationHref() + '/' + shareImg.substr(1),
            shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
            shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
            link: (this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + localStorage.getItem('sharerId')).replace(/\?*#/, "?#")
          })
        }
      },
      getSharerId (callback){
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/queryMemberIdByMobile',
          params: {
            mobile: localStorage.getItem('phone')
          }
        }).then(function (response) {
          if (response) {
            if (response.data.data != 'null') {
              localStorage.setItem('sharerId', response.data.data)
            }
            callback && callback(response.data.data)
          }
        })
      },
      startAnimate () {
        let _this = this
        this.$nextTick(()=>{
          let index = 0
          this.stateArr.splice(index++, 1, 'running')
          this.timer = setInterval(()=>{
            if (index == 1) {
              _this.bg1 = true
              _this.bgArr.splice(0, 1, 'running')
              _this.start = true
              _this.timerToNext()
            }
            if (index == 2) {
              setTimeout(()=>{
                _this.bg2 = 2
                _this.bgArr.splice(1, 1, 'running')
              },2000)

            }
            if (_this.showIndex>=6) {
              clearInterval(_this.timer)
              _this.$router.push('/marketing/receiveTicket')
            }
            _this.stateArr.splice(index++, 1, 'running')
            _this.showIndex++
          },3000)
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
  .bgImg, .bgImg2 {
    width: 100%;
    top: 1rem;
    left: 0;
    /*transform: translateX(-50%);*/
    transform-origin: 50% 40% 0;
    position: absolute;
    animation-play-state: paused;
  }
  .bgImg {
    animation:scalc2 6s forwards;
  }
  .bgImg2 {
    animation:scalc2 10s forwards;
  }
  .name {
    font-size: 0;
    text-align: center;
    animation:scalc 3s cubic-bezier(.17, .86, .73, .14) forwards;
    animation-play-state: paused;
    position: absolute;
    top: 7rem;
    left: 0;
    width: 100%;
  }
  .nameImg {
    width: 50%;
  }
  @keyframes  scalc2 {
    0% { transform: scale(1);opacity: 0;}
    20% {opacity: 1;}
    80% {opacity: 1;}
    100% { transform: scale(1.5);opacity: 0;}
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
    color: #999;
    font-size: .32rem;
    padding: 0 .3rem;
    /*border-radius: .5rem;*/
    /*border: 1px solid gray;*/
  }
  .timer span {
    color: #ff005e;
  }
  .toNext {
    color: gray;
    font-size: .5rem;
    padding: 0 .3rem;
    border-radius: .5rem;
    border: 1px solid gray;
  }
</style>
