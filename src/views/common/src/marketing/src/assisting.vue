<template lang="pug">
  .wrapAssisting
    .cont
      .topLogo
        img(src="../../../../../assets/img/user_title.png" @click.prevent="")
      .words(v-if="temp == 1")
        h1 活动暂未开始
        p 报名满20,000人，立即开始活动
        p 邀请好友关注“万物直供商城”,一起免费领鞋吧~
      .goShopping(v-if="temp == 1")
        img(src="../../../../../assets/img/user_not_started_btn.png" @click.prevent="")
      .rule(v-if="temp == 1")
        img(src="../../../../../assets/img/01_index_6.png" @click.prevent="")
      .center(v-if="temp == 2 || temp == 3")
        .topper
          .lefter
            .pic
              img(src="../../../../../assets/img/kaka.jpg")
            .namer 你好，KAKA！
          .righter
            img(src="../../../../../assets/img/06_user_started_ruls.png", @click.prevent = "ruleFlag = 0")
        .middler
          p 已获得助力
          p 54位
        .bottommer
          .left
            img(src="../../../../../assets/img/06_user_invite_btn.png")
          .right
            img(src="../../../../../assets/img/06_user_mall_btn.png")
      .bottom(v-if="temp == 2 || temp == 3")
        .assists
          .logoN
            .line
            .titleN 我的助力团
            .line
          ul.listter
            li(v-for="item in lists")
              .headPic
                img(src="../../../../../assets/img/kaka.jpg")
              .wordsR
                p KAKA牛逼
                p 已领500元工会福利券
      .btnN(v-if="temp == 2")
        img(src="../../../../../assets/img/06_user_24h_btn_n.png")
      .btnN(v-if="temp == 3")
        img(src="../../../../../assets/img/06_user_24h_btn_y.png")
    transition(name="fade")
      rules-temp(v-if="ruleFlag === 0", @closeBtn="ruleFlag = 1")
</template>
<script>
  import RulesTemp from './rulesTemp.vue'
  export default {
    components: {RulesTemp},
    name: 'assisting',
    data () {
      return {
        ruleFlag: '',
        temp: 2,
        lists: [{}, {}, {}, {}, {}]
      }
    },
    mounted () {
      document.title = "助力活动";
    },
    methods: {

    }
  }
</script>

<style scoped>
.wrapAssisting{
  background-color: #ff3050;
}
.cont{
  min-height: 100vh;
}
/*第一内容部分--开始*/
.topLogo{
  padding: 1rem .5rem 0;
}
.topLogo img{
  width: 9rem;
}
.words{
  margin: .5rem .5rem 0;
  padding: 1rem 0;
  color: #fff;
  text-align: center;
  background-color: #d80014;
  border-radius: .3rem;
}
.words h1{
  font-size: .8rem;
  font-weight: 600;
}
.words p{
  font-size: .5rem;
}
.words p:nth-child(3){
  font-size: .34rem;
  margin-top: .1rem;
  color: #fec45f;
}
.goShopping{
  margin-top: .4rem;
  text-align: center;
}
.goShopping img{
  width: 9.4rem;
}
.rule{
  margin-top: .6rem;
}
.rule img{
  width: 10rem;
}
/*第一内容部分--结束*/
.center{
  margin: .4rem .4rem 0;
  padding-top: .4rem;
  border-top: 1px solid #fff;
}
.center .topper{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.center .topper .lefter{
  display: flex;
  align-items: center;
  color: #fff;
}
.center .topper .lefter .pic{
  width: 1.5rem;
  height: 1.5rem;
  background-color: rgba(255,255,255,.4);
  border-radius: 50%;
  text-align: center;
  line-height: 1.45rem;
}
.center .topper .lefter .pic img{
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  vertical-align: middle;
}
.center .topper .lefter .namer{
  margin-left: .3rem;
  font-size: .4rem;
}
.center .topper .righter img{
  width: 2rem;
  vertical-align: middle;
}
.center .middler{
  height: 4.5rem;
  margin-top: .2rem;
  padding-top: 1.2rem;
  background: url('../../../../../assets/img/06_user_circlesbg.png') no-repeat center;
  background-size: 45%;
  text-align: center;
}
.center .middler p{
  font-size: .42rem;
  color: #fff;
}
.center .middler p:nth-child(2){
  font-size: 1rem;
  color: #ffe277;
}
.center .bottommer{
  padding: 0 1rem;
  display: flex;
  justify-content: space-around;
}
.center .bottommer img{
  width: 4rem;
}
.bottom{
  padding: 0 .3rem;
}
.bottom .assists{
  height: 4.5rem;
  border-radius: .2rem;
  background-color: #fff;
  overflow: scroll;
}
.bottom .assists .logoN{
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: .4rem;
}
.bottom .assists .logoN .line{
  width: 1rem;
  height: 1px;
  background-color: rgb(153,153,153);
}
.bottom .assists .logoN .titleN{
  margin: 0 .2rem;
  font-size: .4rem;
  color: rgb(153,153,153);
}
ul.listter{
  padding: .4rem .3rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
ul.listter li{
  display: flex;
  align-items: center;
  margin-bottom: .4rem;
}
ul.listter li .headPic{
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}
ul.listter li .headPic img{
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}
ul.listter li .wordsR{
  margin-left: .2rem;
  width: 70%;
}
ul.listter li .wordsR p:nth-child(1){
  font-size: .4rem;
}
ul.listter li .wordsR p:nth-child(2){
  color: #b0b0b0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btnN{
  margin-top: .3rem;
}
.btnN img{
  width: 10rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
