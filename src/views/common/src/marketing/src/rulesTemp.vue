<template lang="pug">
  .wrapRulesTemp
    .wrapCont(ref="wrapCont")
      .wrapContWrapper
        .cont1.cont
          .titleN 活动规则
          .words
            p 您邀请亲友领取市总工会5000元福利券(500元x10次)，邀请满20名，按领券亲友数排名，立得1双1200元的耐克鞋，具体如下:
            p 送1万双耐克鞋，限3万人报名参加(成功率33%)，按领券数排名，前1万名立得1双1200元耐克鞋。
            p 即日起，报名满2万人，短信通知报名者:活动开始。
            p 本活动耐克男鞋3000双，女鞋7000双，每双鞋售价1200元。
        .cont2.cont
          .titleN 领取方法
          .words
            p <span>1.</span>本活动限3万人报名，送1万双耐克鞋，成功率高达33%；邀20位好友领券后，按领券数排名榜前1万人，每人1双。
            p <span>2.活动起始:</span>7月3日起，至7月10日。
            p <span>3.</span>第1万名，若出现多位领券数相同，按时间次序奖励。
            p <span>4.领鞋地点：</span>现代快报大厦18楼、金陵晚报虎凤蝶发行部。
            p <span>5.领取时间：</span>7月21日-7月30日(AM9:00-18:00)，为了现场秩序，请您按短信通知时间领取。
            p <span>6.</span>领鞋时，请出示身份证件、排名榜、手机号、微信号，出示转发、分享活动链接(若发现恶意刷票者，拒绝发奖品)，领取后拍照发朋友圈向助力好友致谢。
    .closeBtn
      img(src="../../../../../assets/img/07_rules_close.png" , @click.prevent="close()")
</template>
<script>
  import BScroll from 'better-scroll'
  export default {
    name: 'rulesTemp',
    data () {
      return {

      }
    },
    mounted () {
      // this.scroll2 = new BScroll(this.$refs.wrapCont, {
      //   click: true
      // })
    },
    methods: {
      close () {
        this.$emit('closeBtn')
      }
    }
  }
</script>

<style scoped>
  .wrapRulesTemp{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.6);
    padding: .5rem .5rem 0;
    height: 100vh;
  }
  .wrapCont{
    overflow: scroll;
    background-color: #fff;
    padding-bottom: .5rem;
    height: 83%;
  }
  .cont{
    background-color: #fff;
  }
  .cont .titleN{
    height: 1.2rem;
    border-bottom: 1px solid #f2f2f2;
    line-height: 1.2rem;
    text-align: center;
    font-size: .5rem;
    font-weight: 500;
  }
  .cont .words{
    padding: .3rem .25rem 0;
    font-size: .3rem;
  }
  .words p {
    margin-bottom: .2rem;
  }
  /*.cont .words p:nth-child(1),*/
  /*.cont .words p:nth-child(4){*/
    /*color: #333;*/
  /*}*/
  /*.cont .words p:nth-child(2),*/
  /*.cont .words p:nth-child(3){*/
    /*color: #000;*/
    /*font-weight: 500;*/
    /*margin-bottom: .5rem;*/
  /*}*/
  .cont .pic{
    padding: .3rem .25rem 0;
  }
  .cont .pic img{
    width: 100%;
  }
  .cont2 .words p span{
    font-weight: 500;
    color: #000;
    margin-right: .2rem;
  }
  .closeBtn{
    margin-top: .3rem;
    text-align: center;
  }
  .closeBtn img{
    width: .8rem;
  }
</style>
