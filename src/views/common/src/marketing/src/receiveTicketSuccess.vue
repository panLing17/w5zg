<template lang="pug">
  .wrap
    <!--.headerWrapper-->
    <!--.back(@click="$router.go(-1)")-->
    <!--img.backImg(src="../../../../../assets/img/back@2x.png")-->
    <!--.title 领取工会福利券和耐克鞋-->
    .contentWrapper
      .contentTop
        img.contentTopImg(src="../../../../../assets/img/nike1.png")
      .content
        .template2(v-if="showIndex==1")
          .template2ImgWrapper
            img.template2Img(src="../../../../../assets/img/nike4.png")
            .price ￥{{price}}
          .descWrapper
            .desc1.temp2Desc1 {{price}}元<span>工会福利券已到账</span>
            .desc2.temp2Desc2 手机号登录万物直供商城使用
          .desc3 免费领取
            strong.strong1 1200元耐克鞋
          .nextBtn(@click="sendEnrollSmsByAfs")
            img.nextImg(src="../../../../../assets/img/nike5.png")
        .template3(v-if="showIndex==2")
          .template2ImgWrapper
            img.template2Img(src="../../../../../assets/img/nike4.png")
            .price ￥{{price}}
          .descWrapper
            .desc1.tamp3Desc1 已经为TA攒了片<strong>{{randomText}}</strong>啦~
            .desc4 额外赠送
              strong.strong2 {{price}}元工会福利券
              span 已发放至您的手机账号
          .desc3.small 免费领取
            strong.strong1 1200元耐克鞋
          .nextBtn(@click="isPartake")
            img.nextImg(src="../../../../../assets/img/nike6.png")
          .nextBtn.next(@click="$router.push('/home')")
            img.nextImg(src="../../../../../assets/img/nike7.png")
</template>

<script>
  import shareImg from '../../../../../assets/img/applogo@2x.png'
  export default {
    name: "receiveTicketSuccess",
    data () {
      return {
        showIndex: 2,
        price: '',
        sessionId:'',
        phone:'',
        W5MALLTOKEN:'',
        randomText: ''
      }
    },
    created () {
      this.getData()
    },
    mounted () {
      document.title = '领取工会福利券和耐克鞋';
      this.loadShare()
    },
    methods: {
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
              self.joinActivity()
            } else if (response.data.data == 'yes'){
              self.$router.push({path: '/marketing/assisting', query:{temp: 2}})
            } else if (response.data.data == 'no auth') {
              self.getWXUrl()
            } else if (response.data.data == 'no binding') {
              self.bindAccount()
            }
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
            _this.$router.push({path: '/marketing/assisting', query: {temp: 2}})
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
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: (_this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + data).replace(/\?*#/, "?#")
                })
              } else {
                _this.$initShare({
                  sharePhoto: _this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: (_this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
                })
              }
            })
          } else {
            this.$initShare({
              sharePhoto: this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
              shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
              shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
              link: (this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
            })
          }
        } else {
          this.$initShare({
            sharePhoto: this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
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
      getData () {
        if (this.$route.query.show_index) {
          this.getRandomText()
          this.showIndex = this.$route.query.show_index;
        }
        this.price = this.$route.query.price
        this.sessionId = this.$route.query.sessionId
        this.phone = this.$route.query.phone,
        this.W5MALLTOKEN = this.$route.query.W5MALLTOKEN
      },
      sendEnrollSmsByAfs () {
        let _this = this
        this.$ajax({
          method: 'post',
          url: _this.$apiMember + 'sms/sendEnrollSmsByAfs',
          params: {
            sessionId: this.sessionId,
            mobile : this.phone,
            W5MALLTOKEN: this.W5MALLTOKEN
          }
        }).then(function (response) {
          if (response) {
            _this.$router.push({path: '/marketing/publicNum', query: {temp: 1}})
          }
        })

      },
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
  img {
    pointer-events: none;
  }
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  .headerWrapper {
    height: 1.3rem;
    position: relative;
    padding: 0 .26rem;
  }
  .back {
    padding: .2rem;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  .backImg {
    width: .3rem;
  }
  .title {
    color: #333;
    font-size: .4rem;
    text-align: center;
    line-height: 1.3rem;
    font-weight: 600;
  }
  .contentWrapper {
    /*height: calc(100% - 1.3rem);*/
    height: 100%;
    background: #ff3050;
  }
  .contentTop {
    padding: .66rem .57rem .66rem .66rem;
  }
  .contentTopImg {
    width: 100%;
  }
  .content {
    width: 9.33rem;
    height: 10.26rem;
    border-radius: .13rem;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    position: relative;
  }
  .template1ImgWrapper {
    text-align: center;
    padding-top: .5rem;
    font-size: 0;
  }
  .template1Img {
    width: 4.18rem;
  }
  .inputWrapper {
    text-align: center;
    margin-top: .5rem;
  }
  .phone {
    width: 7.2rem;
    height: 1.17rem;
    background: #e6e6e6;
    border: none;
    outline: none;
    text-align: center;
    font-size: .426rem;
    color: #333;
    border-radius: 0;
  }
  input::placeholder{
    color: rgb(153,153,153);
  }
  .submitBtn {
    text-align: center;
    margin-top: .26rem;
  }
  .submitImg {
    width: 7.2rem;
  }
  .template2, .template3 {
    height: 100%;
    position: relative;
    z-index: 10;
  }
  .template2:after, .template3:after {
    width: 140%;
    height: 4.56rem;
    position: absolute;
    left: -20%;
    top:5.7rem;
    content: '';
    z-index: -1;
    border-radius: 50% 50% 0 0 ;
    background: #ecebe9;
  }
  .template2ImgWrapper {
    padding-top: .93rem;
    font-size: 0;
    position: relative;
    text-align: center;
  }
  .template2Img {
    width: 5.9rem;
    margin-left: -0.2rem;
  }
  .descWrapper {
    line-height: 1;
    margin-top: .3rem;
    color: #ff3050;
    text-align: center;
    font-size: .48rem;
  }
  .desc1 {
    font-weight: 500;
  }
  .desc2 {
    margin-top: .22rem;
  }
  .desc3 {
    color: #333;
    font-size: .46rem;
    text-align: center;
    line-height: 1;
    margin-top: 1.8rem;
  }
  .strong1 {
    color: #ff3050;
    font-size: .48rem;
  }
  .nextBtn {
    text-align: center;
    padding-top: .26rem;
    font-size: 0;
  }
  .nextImg {
    width: 7.5rem;
  }
  .desc4 {
    font-size: .4rem;
    color: #333;
    margin-top: .26rem;
  }
  .strong2 {
    color: #ff3050;
  }
  .desc3.small {
    margin-top: 1.4rem;
  }
  .nextBtn.next {
    padding-top: 0;
  }
  .temp1Desc {
    font-size: .32rem;
    color: #fff;
    text-align: center;
    margin-top: .3rem;
  }
  #sc {
    margin: .26rem auto 0;
    width: 7.2rem;
  }
  #sc.margin-1 {
    margin-top: 1rem;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,.5);
    z-index: 1500;
  }
  .popWrapper {
    width: 9rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 9999;
    padding: 0 .8rem 1.5rem;
    border-radius: .2rem;
  }
  .popDesc {
    margin-top: 1rem;
    font-size: .32rem;
    color: #666;
    line-height: 1.5;
  }
  .popInputWrapper {
    /*display: flex;*/
    /*justify-content: space-between;*/
    margin-top: .46rem;
  }
  .popInput {
    border: 1px solid #b5b5b5;
    width: 100%;
    height: .93rem;
    outline: none;
    padding-left: .33rem;
  }
  .inputBtn {
    line-height: .93rem;
    width: 2.1rem;
    text-align: center;
    border-radius: .2rem;
  }
  .red {
    border: 1px solid #ff3050;
    color: #ff3050;
  }
  .gray {
    border: 1px solid #999;
    color: #999;
  }
  .popBtn {
    border-radius: .2rem;
    line-height: .93rem;
    text-align: center;
    color: #fff;
    background: linear-gradient(#ffab8d, #ff3050);
    margin-top: .37rem;
    font-size: .37rem;
  }
  .price {
    position: absolute;
    top: 1.4rem;
    padding-left: -0.2rem;
    width: 100%;
    left: 0;
    z-index: 10;
    font-size: .53rem;
    color: #ff3050;
    font-weight: bold;
  }
  input  {
    -webkit-appearance: none;
  }
  .temp2Desc1 span{
    color: #333;
  }
  .temp2Desc2  {
    color: #333;
    font-size: .34rem;
  }
  .desc1 strong {
    color: #ff3050;
  }
  .tamp3Desc1 {
    color: #333;
  }
</style>
