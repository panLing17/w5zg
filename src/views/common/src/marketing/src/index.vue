<template lang="pug">
  .wrap(ref="scroll")
    .content
      img(src="../../../../../assets/img/01_index_1.png", @load="imgLoad++")
      .btn(@click="toNext1")
        img(:src="!isPartake?require('../../../../../assets/img/01_index_2_1.jpg'):require('../../../../../assets/img/01_index_2_2.jpg')", @load="imgLoad++")
      img(src="../../../../../assets/img/01_index_3.png", @load="imgLoad++")
      img(src="../../../../../assets/img/01_index_4.jpg", @load="imgLoad++")
      img(src="../../../../../assets/img/01_index_5.png", @load="imgLoad++")
      .tabWrapper(@click="popShow=true")
        .tabBtn 查看具体活动安排 >
      .btn(@click="toNext2")
        img(:src="!isPartake?require('../../../../../assets/img/01_index_8_1.png'):require('../../../../../assets/img/01_index_8_2.png')", @load="imgLoad++")
    transition(name="fade")
      .mask(@click="popShow=false", v-if="popShow", @touchmove.stop="")
    transition(name="fade")
      .popWrapper(v-if="popShow", @touchmove.stop="")
        .temp2(@touchmove.stop="")
          .titleBtn 活动安排
          .info
            .left 1)
            .right 本活动送1万双耐克鞋，限3万人报名，按领券数量排名，前1万人每人立得1双价值1200元耐克。
          .info
            .left 2)
            .right 即日起开始报名；活动起始时间：7月3日-15日
          .info
            .left 3)
            .right 领取时间：7月20日-7月27日，早9:00-18:00
          .info
            .left 4)
            .right 领鞋地址：现代快报大厦18楼、金陵晚报虎凤蝶发行部
          .info.last
            .left 5)
            .right 具体参与规则请关注“<span>万物直供商城</span>”公众号查看
        .closeBtn(@click.prevent="popShow=false", @touchmove.stop="")
          img.closeBtnImg(src="../../../../../assets/img/01_index_10_rules_close.png")
</template>

<script>
  import BScroll from 'better-scroll'
  import shareImg from '../../../../../assets/img/applogo@2x.png'
  export default {
    name: "index",
    data () {
      return {
        isPartake: false,
        popShow: false,
        imgLoad: 0
      }
    },
    watch: {
      imgLoad (val) {
        if (val == 6) {
          this.scroll = new BScroll(this.$refs.scroll, {
            click: true
          })
        }
      }
    },
    created () {
      this.$router.replace('/marketing/assisting')
      // this.loadShare()
      // this.saveUrl()
      // this.judeg()
      // this.isStart()
    },
    mounted () {
      document.title = '送耐克活动';
    },
    methods: {
      isStart () {
        //微信测试环境
        // if (this.$route.query.sharerId || localStorage.getItem('sharerId')) {
        //   if (this.isWeiXin()) {
        //     localStorage.setItem('originatorId', this.$route.query.sharerId)
        //     this.getWXUrl()
        //   } else {
        //     this.$message.error('请在微信中打开！')
        //     this.$router.push('/home')
        //   }
        // }

        // 模拟环境
        // localStorage.setItem('originatorId', this.$route.query.sharerId)
        // this.$router.push('/marketing/assisting')

        //正式环境
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'presentShoes/isStart',
          params: {}
        }).then(function (response) {
          if (response) {
            if (response.data.data == 'yes') {
              if (self.$route.query.sharerId || localStorage.getItem('sharerId')) {
                //判断是否在安卓环境
                if (typeof w5zgApp !== 'undefined') {
                  self.$router.push({path: '/marketing/publicNum', query: {temp: 2}})
                  return
                }
                //判断是否在app中打开
                if (self.openInWebview()) {
                  self.$router.push({path: '/marketing/publicNum', query: {temp: 2}})
                  return
                }

                if (self.isWeiXin()) {
                  localStorage.setItem('originatorId', self.$route.query.sharerId)
                  self.getWXUrl()
                } else {
                  self.$message.error('请在微信中打开！')
                  self.$router.push('/home')
                }
              }

            }
          }
        })
      },
      //判断是否在app中打开
      openInWebview () {
        var ua = navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') { // 微信浏览器判断
          return false
        } else if (ua.match(/QQ/i) == 'qq') { // QQ浏览器判断
          return false
        } else if (ua.match(/WeiBo/i) == "weibo") {
          return false
        } else {
          if (ua.match(/Android/i) != null) {
            return ua.match(/browser/i) == null
          } else if (ua.match(/iPhone/i) != null) {
            return ua.match(/safari/i) == null
          } else {
            return (ua.match(/macintosh/i) == null && ua.match(/windows/i) == null)
          }
        }
      },
      //是否是微信环境
      isWeiXin() {
        let ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          return true
        } else {
          return false
        }
      },
      //获取微信授权URL
      getWXUrl () {
        if (!localStorage.getItem('unionId') || localStorage.getItem('unionId')==='undefined' || localStorage.getItem('unionId') == null) {
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
        } else {
          this.$router.push('/marketing/assisting')
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
      //验证是否是已报名用户
      judeg () {
        if (localStorage.getItem('phone') && localStorage.getItem('phone').length === 11) {
          let self = this
          self.$ajax({
            method: 'get',
            url: self.$apiTransaction + 'netcard/presentShoes/join/isJoinActivity',
            params: {
              mobile: localStorage.getItem('phone')
            }
          }).then(function (response) {
            if (response) {
              if (response.data.data == 1) {
                self.isPartake = true
              }
            }
          })

          if (localStorage.getItem('sharerId') == 'undefined' || !localStorage.getItem('sharerId')) {
            this.getSharerId()
          }
        }
      },
      //获取sharerId
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
      //保存URL
      saveUrl () {
        if (this.$route.query.redirect_url) {
          localStorage.setItem('redirect_url', this.$route.query.redirect_url)
        }

      },
      //打开弹窗
      showPop (index) {
        this.temp = index;
        this.popShow = true;
      },
      //上面按钮判断走向
      toNext1 () {
        if (!this.isPartake) {
          this.$router.push('/marketing/movies')
        } else {
          this.getWXUrl()
        }
      },
      //下面按钮判断走向
      toNext2 () {
        if (!this.isPartake) {
          this.$router.push('/marketing/movies')
        } else {
          this.$router.push('/home')
        }
      }
    }
  }
</script>

<style scoped>
  .wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }
  .content {
    font-size: 0;
  }
  img {
    width: 100%;
    pointer-events: none;
  }
  .tabWrapper {
    background: #ff2d4a;
  }
  .tabBtn {
    width: 5.15rem;
    height: .86rem;
    background: #d80014;
    border-radius: .5rem;
    color: #fff;
    line-height: .86rem;
    font-size: .4rem;
    text-align: center;
    margin: 0 auto;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,.5);
  }
  .popWrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 10;
  }
  .temp1, .temp2 {
    width: 8.56rem;
    margin: 0 auto;
    background: #fff;
    border-radius: .26rem;
    padding: .53rem .53rem 1.2rem;
  }
  .titleBtn {
    border-radius: .5rem;
    border: 1px solid #ff2d4a;
    line-height: .8rem;
    width: 2.46rem;
    text-align: center;
    color: #ff2d4a;
    font-size: .37rem;
  }
  .desc1, .desc2 {
    line-height: 1.5;
    font-size: .32rem;
  }
  .desc1 {
    margin-top: .4rem;
  }
  .desc2 {
    margin-top: .53rem;
  }
  .closeBtn {
    text-align: center;
    font-size: 0;
    margin-top: .4rem;
  }
  .closeBtnImg {
    width: 1rem;
  }
  .info {
    display: flex;
    align-content: flex-start;
    line-height: 1.5;
    margin-top: .4rem;
  }
  .info .left {
    color: #666;
    align-self: flex-start;
  }
  .right span {
    color: #ff2d4a;
    margin: 0;
  }
  .info .right {
    color: #333;
    margin-left: .1rem;
  }
</style>
