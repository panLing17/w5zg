<template lang="pug">
  .wrapRulesTemp
    .wrapCont
      .cont1.cont
        .titleN 活动规则
        .words
          p 您邀请亲友领取市总工会5000元福利券(500元x10次)，邀请满20名，按领券亲友数排名，立得1双1200元的耐克鞋，具体如下:
          p 送1万双耐克鞋，限3万人报名参加(成功率33%)，按领券数排名，前1万名立得1双1200元耐克鞋。
          p 即日起，报名满2万人，短信通知报名者:活动开始。
          p 本活动耐克男鞋3000双，女鞋7000双，每双鞋售价1200元。首轮活动的耐克鞋现已到达金陵晚报大厦，经盘点XX双(见照片)
        .pic
          img(src="../../../../../assets/img/07_rules_pic.jpg")
      .cont2.cont
        .titleN 领取方法
        .words
          p <span>1、领鞋地址:</span>金陵晚报大厦1F大厅(南京市XX区XX路XX号)，由金陵晚报监督下发放。
          p <span>2、领鞋凭证:</span>我们将发放提货码，请您凭提货码领取。
          p <span>3、领取时间:</span>活动结束后7天内，早9:00- 晚18:00。
          p <span>4、温馨提示:</span>为防止刷单，确保公平。领鞋时，我们将核对手机号、微信号、邀好友领券记录，向助力亲友晒鞋鸣
    .closeBtn
      img(src="../../../../../assets/img/07_rules_close.png" , @click.prevent="close()")
</template>
<script>
  export default {
    name: 'rulesTemp',
    data () {
      return {

      }
    },
    mounted () {

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
    padding: .9rem .5rem 0;
    height: 100vh;
  }
  .wrapCont{
    overflow: scroll;
    background-color: #fff;
    height: 85%;
    padding-bottom: 1.2rem;
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
  .cont .words p:nth-child(1),
  .cont .words p:nth-child(4){
    color: #333;
  }
  .cont .words p:nth-child(2),
  .cont .words p:nth-child(3){
    color: #000;
    font-weight: 500;
    margin-bottom: .5rem;
  }
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
