<template lang="pug">
  .wrap
    .content
      .contentTop
        img.contentTopImg(src="../../../../../assets/img/01_index_1.png")
      .contentCenter(:class="{'margin-1': temp==1 || temp==5 }")
        img.contentCenterImg(src="../../../../../assets/img/13_helper_notice_bg.jpg")
        .temp2(v-if="temp==2")
          .info
            img.avatar(:src="oOriginInfo.avatar")
            .infoDesc 发起人：
            .infoName {{oOriginInfo.name}}(微信名)
          .temp2Desc
            p 已经为TA攒了片<span>{{randomText}}</span>啦~
            p 您还有{{count}}次领券机会，
            p 快去给其他小伙伴加油抢鞋吧！
          .temp2Btn(@click="$router.replace('/marketing/index')")
            img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_join_btn.png")
        .temp3(v-if="temp==3")
          .info
            img.avatar(:src="oOriginInfo.avatar")
            .infoDesc 发起人：
            .infoName {{oOriginInfo.name}}(微信名)
          .temp3Desc
            p 已经为TA攒了根鞋带啦~
            p 您的加油次数已达到上限！
          .temp2Btn(@click="$router.replace('/marketing/index')")
            img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_join_btn.png")
        <!--.temp4(v-if="temp==4")-->
          <!--.temp4Desc-->
            <!--p 您已参加免费领鞋活动，-->
            <!--p 不能帮其他小伙伴领券啦～-->
          <!--.temp2Btn-->
            <!--img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_user_btn.png")-->
        .temp5(v-if="temp==5")
          .info
            img.avatar(:src="oOriginInfo.avatar")
            .infoDesc 发起人：
            .infoName {{oOriginInfo.name}}(微信名)
          .temp3Desc
            p 您的好友想要领价值1200元的耐克鞋
            p 快来帮TA免费拿吧！
          .temp2Btn(@click="$router.replace({path: '/marketing/receiveTicket', query: {show_index: 4, originatorId: sOriginatorId}})")
            img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_help_btn.png")
        .temp6(v-if="temp==6")
          .info
            img.avatar(:src="oOriginInfo.avatar")
            .infoDesc 发起人：
            .infoName {{oOriginInfo.name}}(微信名)
          .temp3Desc
            p Sorry，
            p 您的加油次数已达到上限！
          .temp2Btn(@click="$router.replace('/marketing/index')")
            img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_join_btn.png")
      .contentBottom
        .temp2Bottom(v-if="temp==2 || temp==3 || temp==4 || temp==6")
          .temp2BottomDesc 或者还可以先逛逛商城，使用工会福利现金券
          .temp2BottomBtn(@click="$router.replace('/home')")
            img.temp2BottomBtnImg(src="../../../../../assets/img/06_user_not_started_btn.png")
</template>

<script>
  import shareImg from '../../../../../assets/img/applogo@2x.png'
  /*
  * temp 模板类型
  *   2：a-绑定-未达上限-普通用户
  *   3：b-绑定-已达上限-普通用户
  *   4：c-好友是发起人
  *   5：e-非绑定-未达上限-普通用户
  *   6：f-非绑定-已达上限-普通用户
  * */
  export default {
    name: "personal",
    data () {
      return {
        temp: 0,
        oOriginInfo: {},
        randomText: '',
        bIsHelped: '',
        bIsOutRule: '',
        sOriginatorId: '',
        count: 0
      }
    },
    created () {
      this.sOriginatorId = localStorage.getItem('originatorId')
      if (!this.sOriginatorId) {
        this.$router.replace({path: '/marketing/assisting', query: {temp: 2}})
        return
      }
      localStorage.removeItem("originatorId")
      this.isHelped()
      this.getOriginInfo()
    },
    mounted () {
      document.title = "送耐克活动"
      this.loadShare()
    },
    methods: {
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
      //是否达到助力上限
      isOutRule () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/isOutRule',
          params: {
            unionId: localStorage.getItem('unionId')
          }
        }).then(function (response) {
          if (response) {
            self.bIsOutRule = response.data.data
            if (self.bIsOutRule=='yes') {
              if (self.bIsHelped == 'yes') {
                self.temp = 3
              } else {
                self.temp = 6
              }
            } else {

              if (self.bIsHelped == 'yes') {
                self.getRandomText()
                self.getResidueDegree()
              } else {
                self.temp = 5
              }
            }
          }
        })
      },
      //获取还有几次领券机会
      getResidueDegree () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/residueDegree',
          params: {
            unionId: localStorage.getItem('unionId')
          }
        }).then(function (response) {
          if (response) {
            self.count = response.data.data
            self.temp = 2
          }
        })
      },
      //是否给好友助力过
      isHelped () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/isHelped',
          params: {
            unionId: localStorage.getItem('unionId'),
            sharerId: this.sOriginatorId
          }
        }).then(function (response) {
          if (response) {
            if (response.data.data == 'OnePerson') {
              self.$router.replace({path: '/marketing/assisting', query: {temp: 2}})
              return
            }
            self.bIsHelped = response.data.data
            self.isOutRule()
          }
        })
      },
      //获取发起人的头像、昵称
      getOriginInfo () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/sharerInfo',
          params: {
            sharerId: this.sOriginatorId
          }
        }).then(function (response) {
          if (response) {
            if (response.data.data == 'null') {
              self.$router.replace({path: '/marketing/assisting', query: {temp: 2}})
            } else {
              self.oOriginInfo = response.data.data
            }
          }
        })
      },
      //获取随机字符串
      getRandomText () {
          let Range = 4;
          let Rand = Math.random();
          let num = Math.round(Rand * Range);
          let aText = ['鞋垫','鞋带','鞋舌','鞋帮','耐克标']
          this.randomText = aText[num]

      }
    }
  }
</script>

<style scoped>
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #ff314f;
  }
  .contentTop {
    font-size: 0;
    margin-top: -.3rem;
  }
  .contentTopImg {
    width: 100%;
  }
  .contentCenter {
    font-size: 0;
    position: relative;
  }
  .margin-1 {
    margin-top: 1rem;
  }
  .contentCenterImg {
    width: 100%;
  }
  .temp1, .temp2, .temp3, .temp4, .temp5, .temp6 {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .temp1Desc {
    font-size: .48rem;
    color: #333;
    text-align: center;
    margin-top: 1.5rem;
  }
  .temp1Btn, .temp2Btn {
    font-size: 0;
    text-align: center;
    position: absolute;
    bottom: .6rem;
    left: 0;
    width: 100%;
  }
  .temp1BtnImg {
    width: 7rem;
  }
  .info {
    width: 5.84rem;
    height: 1.56rem;
    background: #ffe6bf;
    border-radius: 0.06rem;
    margin: 0.68rem auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    flex-wrap: nowrap;
  }
  .avatar {
    width: 1.33rem;
    height: 1.33rem;
    border-radius: 50%;
    background: black;
  }
  .infoDesc, .infoName {
    font-size: .32rem;
    color: #000;
    margin-left: 0.13rem;
    font-weight: bold;
  }
  .infoName {
    margin-left: 0;
    max-width: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .temp2Desc, .temp3Desc, .temp4Desc {
    text-align: center;
    font-size: .34rem;
    color: #333;
    margin-top: .38rem;
    line-height: 1.5;
  }
  .temp2Desc p span {
    color: #ff314f;
    font-weight: 400;
  }
  .temp2BtnImg {
    width: 5rem;
  }
  .temp2BottomDesc {
    color: #fff;
    text-align: center;
    font-size: .32rem;
  }
  .temp2BottomBtn {
    text-align: center;
    font-size: 0;
  }
  .temp2BottomBtnImg {
    width: 9.1rem;
    margin-top: .2rem;
  }
  .temp4Desc {
    margin-top: 1.84rem;
  }
  img {
    pointer-events: none;
  }
</style>
