<template lang="pug">
  .wrapPublicNum
    .cont1(v-if="temp==2")
      .message(@click="$router.push('/home')")
        p 活动已开启，只能在微信端参加
        p 点击返回APP
      .qrCode
        img(src="../../../../../assets/img/qRcode.png")
      .words
        p 关注万物直供公众号
        p 进入商城，立即用券
      <!--.shareBtn(@click="shareShow=true") 分享-->
    .cont2(v-if="temp==1")
      .message
        p 参与方法已通过<span>短信方式</span>发送至
        p 您的手机，请注意查看
      .qrCode
        img(src="../../../../../assets/img/qRcode.png")
      .words(v-if="isWX")
        p 长按关注公众号，
        p 可查看领鞋进展！
      .words2(v-if="!isWX")
        p 关注微信公众号“<span>万物直供商城</span>”
        p 可查看领鞋进展！
      <!--.shareBtn(@click="shareShow=true") 分享活动-->
    <!--transition(name="fade")-->
      <!--.mask(v-if="shareShow", @click="shareShow=false")-->
    <!--transition(name="fade")-->
      <!--.sharePop(v-if="shareShow")-->
        <!--.shareTextWrapper-->
          <!--.shareText 分享在这里-->
          <!--.shareRight(@click="shareShow=false") 知道啦-->
        <!--img.sharePopImg(src="../../../../../assets/img/ic_guide_right.png")-->
</template>

<script>
  import shareImg from '../../../../../assets/img/applogo@2x.png'
  export default {
      name: "publicNum",
      data(){
        return{
          temp:1,
          isWX: false,
          shareShow: false
        }
      },
      computed: {

      },
      created(){
        this.isWeiXin()
        this.getData()
      },
      mounted(){
        document.title = "关注公众号";
        this.loadShare()
      },
      methods:{
        getData () {
          if (this.$route.query.temp == 2) {
            this.temp = 2
          }
        },
        isWeiXin() {
          let ua = window.navigator.userAgent.toLowerCase()
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.isWX = true
          } else {
            this.isWX = false
          }
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
        }
      }
    }
</script>

<style scoped>
  .wrapPublicNum{
    background-color: #e6e6e6;
  }
  /*内容部分--开始*/
  .cont1{
    width: 100%;
    min-height: 100vh;
    background: url('../../../../../assets/img/backgrounds.png') no-repeat;
    background-size: 100%;
    padding-top: 3rem;
  }
  .cont2{
    width: 100%;
    min-height: 100vh;
    background: url('../../../../../assets/img/backgrounds.png') no-repeat;
    background-size: 100%;
    padding-top: 1.5rem;
  }
  .message{
    color: #fff;
    font-size: .45rem;
    text-align: center;
  }
  .message p:nth-child(2){
    margin-top: .1rem;
  }
  .message p span{
    color: #ffe100;
  }
  .qrCode{
    padding-top: 1rem;
    text-align: center;
  }
  .qrCode img{
    width: 6rem;
  }
  .words{
    padding-top: .2rem;
    font-size: .4rem;
    text-align: center;
    color: #ff3050;
  }
  .words p{
    margin-top: .2rem;
  }
  .words2{
    padding-top: .2rem;
    font-size: .4rem;
    text-align: center;
    color: #333;
  }
  .words2 span {
    color: #ff3050;
  }
  .words2 p{
    margin-top: .2rem;
  }
  /*内容部分--结束*/
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,.5);
    z-index: 10;
  }
  .sharePop {
    position: absolute;
    right: 0.2rem;
    top: 0.5rem;
    z-index: 20;
    width: 100%;
    text-align: right;
  }
  .shareTextWrapper {
    position: absolute;
    right: 4rem;
    top: 3rem;
    color: #fff;
    font-family: Webdings;
  }
  .shareRight {
    font-size: .4rem;
    padding: 0 .2rem;
    border: 1px solid #fff;
    border-radius: .5rem;
    text-align: center;
    margin-top: .2rem;
  }
  .sharePopImg {
    width: 4rem;
    transform: rotate(160deg);
  }
  .shareBtn {
    text-align: center;
    font-size: .4rem;
    margin-top: .5rem;

  }
  .shareText {
    text-align: center;
    line-height: 1.5;
    font-size: .4rem;
  }
</style>
