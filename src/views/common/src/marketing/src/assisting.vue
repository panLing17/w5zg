<template lang="pug">
  .wrapAssisting(ref="wrapAssisting")
    .cont
      .topLogo
        img(src="../../../../../assets/img/user_title.png" @click.prevent="")
      .words(v-if="temp == 1")
        h1 活动已结束
        p
        <!--p 邀请好友关注“万物直供商城”,一起免费领鞋吧~-->
      .goShopping(v-if="temp == 1", @click="goHome")
        img(src="../../../../../assets/img/user_not_started_btn.png" @click.prevent="")
      <!--.rule(v-if="temp == 1")-->
        <!--.ruleTitle 活动规则-->
        <!--.ruleDesc1 送1万双耐克鞋，限3万人报名参加（成功率33%），按领券数排名，前1万名立得1双1200元耐克鞋。-->
        <!--.ruleDesc2 即日起，报名满2万人，短信通知报名者：活动开始。-->
      .center(v-if="temp == 2")
        .topper
          .lefter
            .pic
              img(:src="oMyInfo.headimgurl")
            .namer 你好，{{oMyInfo.nickname}}！
          .righter(@click="ruleFlag=0")
            img(src="../../../../../assets/img/06_user_started_ruls.png")
        .middler
          p 奔跑值
          p {{iHelpActivity}}
        .desc(v-if="desc==1") 奔跑值<span>满20</span>才有机会哦!再接再厉吧！
        .desc(v-if="desc==2") 奔跑值越高机会越大，继续加油哦！
        .bottommer
          .left(@click="shareFlag = 1")
            img(src="../../../../../assets/img/06_user_invite_btn.png")
          .right(@click="$router.replace('/home')")
            img(src="../../../../../assets/img/06_user_mall_btn.png")
        .bottom(v-if="temp == 2")
          .assists(ref="bottom")
            .assistsWrapper
              .logoN
                .line
                .titleN 我的助力团
                .line
              ul.listter
                li(v-for="item in aGroup")
                  .headPic
                    img(:src="item.helper_avatar")
                  .wordsR
                    p {{item.helper_name}}
                    p 已领{{item.bonus}}元工会福利券
        .btnN
          img(:src="bIsLast=='no'?require('../../../../../assets/img/06_user_24h_btn_n.png'):require('../../../../../assets/img/06_user_24h_btn_y.png')")
    transition(name="fade")
      rules-temp(v-show="ruleFlag === 0", @closeBtn="ruleFlag = 1")
    .shareFriend(v-if="shareFlag == 1" @click="shareFlag = 0")
      img(src="../../../../../assets/img/arrow.png")
      p 点击右上角
      p 召唤TA来帮忙吧！
</template>
<script>
  import RulesTemp from './rulesTemp.vue'
  import shareImg from '../../../../../assets/img/applogo@2x.png'
  import BScroll from 'better-scroll'
  export default {
    components: {RulesTemp},
    name: 'assisting',
    data () {
      return {
        shareFlag: 0,
        ruleFlag: '',
        temp: 1,
        aGroup: [],
        oMyInfo: {},
        bIsLast: '',
        iHelpActivity: 0,
        desc: 1
      }
    },
    created () {
      // this.loadShare()
      // this.saveUnionId()
      // this.whereFrom()
    },
    mounted () {
      document.title = "送耐克活动";
      // this.scroll3 = new BScroll(this.$refs.wrapAssisting, {
      //   click: true
      // })
    },
    methods: {
      goHome () {
        window.location.href = this.getLocationHref() + '/#/home'
      },
      //保存unionId
      saveUnionId () {
        if (this.$route.query.unionId) {
          localStorage.setItem('unionId', this.$route.query.unionId)
        }
      },
      /*
      * 判断是否是从参加活动过来的
      * temp=2 true
      * */
      whereFrom () {
        if (this.$route.query.temp == 2) {
          this.isPartake()
        } else {
          this.isStart()
        }
      },
      //获取助力团
      getGroup () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/myHelpList',
          params: {
            unionId: localStorage.getItem('unionId')
          }
        }).then(function (response) {
          if (response) {
            self.aGroup = response.data.data
            self.iHelpActivity = response.data.data.length
            if (self.iHelpActivity >= 20) {
              self.desc = 2
            }
            self.$nextTick(()=>{
              self.scroll = new BScroll(self.$refs.bottom, {
                click: true,
                stopPropagation: true
              })
            })
          }
        })
      },
      //获取我的昵称、头像
      getMyInfo (){
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/myInfo',
          params: {
            unionId: localStorage.getItem('unionId')
          }
        }).then(function (response) {
          if (response) {
            self.oMyInfo = JSON.parse(response.data.data)
          }
        })
      },
      //是否是最后48小时
      isLast() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/isFinal',
          params: {}
        }).then(function (response) {
          if (response) {
            self.bIsLast = response.data.data
          }
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
                  sharePhoto: _this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
                  shareTitle: '我已领500元福利券，1万双耐克鞋免费送！现报名人数不足，快参加！',
                  shareDesc: '金陵晚报、现代快报、万物直供共同发起【送1万双耐克鞋】活动',
                  link: (_this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + data).replace(/\?*#/, "?#")
                })
              } else {
                _this.$initShare({
                  sharePhoto: _this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
                  shareTitle: '我已领500元福利券，1万双耐克鞋免费送！现报名人数不足，快参加！',
                  shareDesc: '金陵晚报、现代快报、万物直供共同发起【送1万双耐克鞋】活动',
                  link: (_this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
                })
              }
            })
          } else {
            this.$initShare({
              sharePhoto: this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
              shareTitle: '我已领500元福利券，1万双耐克鞋免费送！现报名人数不足，快参加！',
              shareDesc: '金陵晚报、现代快报、万物直供共同发起【送1万双耐克鞋】活动',
              link: (this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
            })
          }
        } else {
          this.$initShare({
            sharePhoto: this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
            shareTitle: '我已领500元福利券，1万双耐克鞋免费送！现报名人数不足，快参加！',
            shareDesc: '金陵晚报、现代快报、万物直供共同发起【送1万双耐克鞋】活动',
            link: (this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + localStorage.getItem('sharerId')).replace(/\?*#/, "?#")
          })
        }
      },
      //获取用户ID
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
      //活动是否开启
      isStart () {
        // this.authority()
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/isStart',
          params: {}
        }).then(function (response) {
          if (response) {
            if (response.data.data == 'no') {
              self.temp = 1
            } else {
              self.authority()
            }
          }

        })
      },
      /*
      * 判断来者身份,originatorId 发起人ID   selfId 被分享者ID
      *   1. 如果originatorId==selfId => 个人中心 /marketing/assisting
      *   2. 如果originatorId!=selfId => 助力 /marketing/personal
      *   3. originatorId 有    selfId 没有 => 助力
      *   4. originatorId 没有  selfId 有 => 个人中心
      *   5. originatorId 没有  selfId 没有 => 报名(不处理)
      * */
      authority () {

        let originatorId = localStorage.getItem('originatorId')
        let selfId = localStorage.getItem('sharerId')
        let phone = localStorage.getItem('phone')
        let _this = this


        if (originatorId && originatorId.length>0 && originatorId!='undefined') {
          if (selfId && selfId.length>0) {
            if (originatorId == selfId) {
              this.isPartake()
            } else {
              this.$router.replace('/marketing/personal')
            }
          } else {
            if (phone && phone.length === 11) {
              this.getSharerId (function (data) {
                if (data != 'null') {
                  if (data == originatorId) {
                    _this.isPartake()
                  } else {
                    _this.$router.replace('/marketing/personal')
                  }
                } else {
                  _this.$router.replace('/marketing/personal')
                }
              })
            } else {
              _this.$router.replace('/marketing/personal')
            }
          }
        } else {
          if (selfId && selfId.length>0) {
            this.isPartake()
          } else {
            if (phone && phone.length === 11) {
              this.getSharerId (function (data) {
                _this.isPartake()
              })
            } else {
              this.isPartake()
            }
          }
        }
      },
      //用户是否参加过
      isPartake () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/isJoined',
          params: {
            unionId: localStorage.getItem('unionId')
          }
        }).then(function (response) {
          if (response) {
            if (response.data.data == 'no') {
              self.$router.replace('/marketing/noAttended')
            } else if (response.data.data == 'yes'){

              if (localStorage.getItem('originatorId')) {
                localStorage.removeItem("originatorId")
              }

              self.temp = 2
              self.getGroup()
              self.getMyInfo()
              self.isLast()
            } else if (response.data.data == 'no auth') {
              if (localStorage.getItem('unionId')) {
                localStorage.removeItem("unionId")
              }
              self.getWXUrl()
            } else if (response.data.data == 'no binding') {
              if (localStorage.getItem('phone') && localStorage.getItem('phone').length == 11) {
                self.bindAccount()
              } else {
                if (localStorage.getItem('originatorId')) {
                  localStorage.removeItem("originatorId")
                }
                self.$router.replace('/marketing/noAttended')
              }
            }
           }
        })
      },
      //绑定手机
      bindAccount () {
        let _this = this
        this.$ajax({
          method: 'post',
          url: _this.$apiMember + 'member/bindAccount',
          params: {
            unionId: localStorage.getItem('unionId'),
            mobile : localStorage.getItem('phone')
          }
        }).then(function (response) {
          if (response) {
            _this.joinActivity()
          }
        })
      },
      //参加活动
      joinActivity () {
        let _this = this
        this.$ajax({
          method: 'get',
          url: _this.$apiApp + 'presentShoes/joinActivity',
          params: {
            unionId: localStorage.getItem('unionId')
          }
        }).then(function (response) {
          if (response) {
            if (localStorage.getItem('originatorId')) {
              localStorage.removeItem("originatorId")
            }
            _this.temp = 2
            _this.getGroup()
            _this.getMyInfo()
            _this.isLast()
          }
        })
      },
      //获取微信授权
      getWXUrl () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiTransaction + 'oauth2/wechat/createCodeUrl',
          params: {}
        }).then(function (response) {
          if (response) {
            window.location.href = response.data.data
          }
        })

      }
    }
  }
</script>

<style scoped>
  .wrapAssisting{
    background-color: #ff3050;
    height: 100vh;
  }
  .cont{

  }
  /*第一内容部分--开始*/
  .topLogo{
    padding: .5rem .5rem 0;
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
    color: #fff;
    position: relative;
  }
  .ruleTitle {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: .4rem;
  }
  .ruleTitle:before, .ruleTitle:after {
    content: '';
    display: block;
    width: .8rem;
    height: 1px;
    background: #fff;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .ruleTitle:before {
    left: -1rem;
  }
  .ruleTitle:after {
    right: -1rem;
  }
  .ruleDesc1, .ruleDesc2 {
    font-size: .32rem;
    line-height: 1.5;
    padding-left: .69rem;
    padding-right: .69rem;
  }
  .ruleDesc1 {
    padding-top: .8rem;
  }
  .ruleDesc2 {
    margin-top: .62rem;
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
    height: 4rem;
    padding-top: 1.2rem;
    background: url('../../../../../assets/img/06_user_circlesbg.png') no-repeat center;
    background-size: 40%;
    text-align: center;
  }
  .center .middler p{
    font-size: .43rem;
    color: #fff;
  }
  .center .middler p:nth-child(2){
    font-size: .9rem;
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
    height: 3rem;
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
    width: 48%;
    overflow: hidden;
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
    padding-bottom: .8rem;
    text-align: center;
    font-size: 0;
  }
  .btnN img{
    width: 9.1rem;
  }
  .shareFriend{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.4);
    text-align: right;
  }
  .shareFriend img{
    width: 1.5rem;
    margin-right: 1rem;
  }
  .shareFriend p{
    color: #fff;
    font-size: .5rem;
    text-align: center;
    padding-left: 5rem;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  img {
    pointer-events: none;
  }
  .desc {
    text-align: center;
    color: #fff;
    font-size: .4rem;
    letter-spacing: .05rem;
  }
  .desc span {
    color: #ffe277;
    font-weight: bold;
  }
</style>
