<template lang="pug">
  .wrapResult
    .cont
      .topLogo
        img(src="../../../../../assets/img/user_title.png" @click.prevent="")
      .wrapCenter(v-if="temp == 2")
        .center
          .whiteN
            .pic
              img(src="../../../../../assets/img/09_fail.png")
            .words
              h1 很遗憾！
              p 您的排名是XX位，
              p 未能获得本次活动的耐克鞋
            .btn
              a 点击查看总排名
        .goMarket
          img(src="../../../../../assets/img/09_fail_mall_btn.png")
      .wrapCenter(v-if="temp == 3")
        .center
          .whiteN
            .pic#successI
              img(src="../../../../../assets/img/09_success.png")
            .words
              h1 恭喜！
              p#successP 您已获得:<span>1200元</span>耐克鞋1双
            .btn#successB
              img(src="../../../../../assets/img/09_success_choise_btn.png")
      .wrapCenter(v-if="temp == 4")
        .center
          .whiteN.threeN
            .ups
              .topper 您的款式和尺码已提交成功!
              .bottommer
                .goodsPic
                  img(src="../../../../../assets/img/11 shoes.png")
                .attr
                  .styles.same
                    .lWords 款式:
                    .rWords 女鞋A款
                  .sizes.same
                    .lWords 尺码:
                    .rWords 36
            .downs
              p 请您按照万物直供通知,
              p 前往金陵晚报大厦大厅领取,
              p 地址：南京市XX区XX路XX号
        .goMarket
          img(src="../../../../../assets/img/09_fail_mall_btn.png")
</template>
<script>
  export default {
    name: 'prizeResult',
    data () {
      return {
        temp: 4
      }
    },
    mounted () {
      this.change()
    },
    methods: {
      change () {
        if (this.temp === 2) {
          document.title = '中奖结果'
        }
        if (this.temp === 3 || this.temp === 4) {
          document.title = '获奖结果'
        }
      }
    }
  }
</script>

<style scoped>
.wrapResult{
  height: 100vh;
  background-color: #ff314f;
}
.topLogo{
  padding: 1rem .4rem 0;
}
.topLogo img{
  width: 9rem;
}
.center{
  padding: .4rem;
}
.center .whiteN{
  background-color: #fff;
  border-radius: .25rem;
  padding: .5rem 0 1rem;
}
.center .whiteN .pic{
  text-align: center;
}
.center .whiteN .pic img{
  width: 2rem;
}
.center .whiteN .words{
  padding-top: .4rem;
  text-align: center;
}
.center .whiteN .words h1{
  font-size: 1rem;
  color: #ff314f;
  margin-bottom: .3rem;
  padding-left: .8rem;
}
.center .whiteN .words p{
  font-size: .45rem;
  font-weight: 500;
}
.center .whiteN .btn{
  text-align: center;
  margin-top: 1rem;
}
.center .whiteN .btn a{
  text-decoration: underline;
  color: #0099ff;
  font-size: .35rem;
}
.goMarket{
  text-align: center;
}
.goMarket img{
  width: 9.5rem;
}
/*第二块不一样的地方--开始*/
#successI img{
  width: 5rem;
}
#successP{
  font-size: .6rem;
}
#successP span{
  color: #ff314f;
}
#successB img{
  width: 6rem;
}
/*第二块不一样的地方--结束*/
/*第三块独有的样式--开始*/
.threeN{
  padding: .6rem .35rem 1rem !important;
}
.ups{
  border-bottom: 1px solid #adadad;
  padding-bottom: .6rem;
}
.ups .topper{
  text-align: center;
  font-size: .55rem;
}
.ups .bottommer{
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: .6rem;
}
.ups .bottommer .goodsPic{
  border: 1px solid #ccc;
  margin-right: .35rem;
}
.ups .bottommer .goodsPic img{
  width: 3rem;
  vertical-align: top;
}
.ups .bottommer .attr{
  font-size: .4rem;
}
.ups .bottommer .attr .sizes{
  margin-top: .2rem;
}
.ups .bottommer .attr .same{
  display: flex;
  align-items: center;
}
.ups .bottommer .attr .same .rWords{
  padding: .1rem .2rem;
  background-color: #eee;
  border-radius: .1rem;
  margin-left: .1rem;
}
.downs{
  padding-top: .7rem;
  text-align: center;
  font-size: .5rem;
  color: #656565;
}
/*第三块独有的样式--结束*/
</style>
