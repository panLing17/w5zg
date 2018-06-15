<template lang="pug">
  .selectSizeBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close", @touchmove="notScroll")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-if="show", @touchmove="notScroll")
        .title 分享到
        ul.shareList
          li(@click="wxShare")
            img(src="../../../assets/img/wechat2@2x.png")
            p 微信
          li(@click="friendShare")
            img(src="../../../assets/img/friendster2@2x.png")
            p 朋友圈
          li(@click="qqShare")
            img(src="../../../assets/img/QQ@3x.png")
            p QQ
          li(@click="copyUrl")
            img(src="../../../assets/img/copyUrl@3x.png")
            p 复制链接
        .bottom(@click="close") 取消
</template>

<script>
  export default {
    name: "share-select",
    data () {
      return {
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      sharePhoto: Array,
      shareTitle: String
    },
    mounted () {

      this.wxConfig()
      // this.wxShare()
      // this.friendShare()
      // this.qqShare()
    },
    methods:{
      notScroll (e) {
        e.preventDefault()
      },
      close () {
        this.$emit('close')
      },
      // 复制url
      copyUrl () {
        let oInput = document.createElement('input')
        oInput.value = window.location.href.replace(/#/, "?#")
        document.body.appendChild(oInput)
        oInput.select() // 选择对象
        document.execCommand("Copy") // 执行浏览器复制命令
        document.body.removeChild(oInput)
        this.$message({
          message: '已复制商品链接，粘贴分享给好友吧！',
          type: 'success'
        })
      },
      // 分享到qq
      qqShare () {
        let self = this
        wx.onMenuShareQQ({
          title: self.shareTitle, // 分享标题
          desc: '我发现了个宝贝,跟专卖店比贼便宜', // 分享描述
          link: window.location.href.replace(/#/, "?#"), // 分享链接
          imgUrl: self.$method.imgUrlFilter(self.sharePhoto[0].gi_img_url) , // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            self.isLogin()
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
      },
      // 分享给朋友
      wxShare () {
        let self = this
        alert(self.shareTitle + self.sharePhoto[0])
        wx.onMenuShareAppMessage({
          title: self.shareTitle, // 分享标题
          desc: '我发现了个宝贝,跟专卖店比贼便宜', // 分享描述
          link: window.location.href.replace(/\?*#/, "?#"), // 分享链接，该链接域名必须与当前企业的可信域名一致
          imgUrl: self.$method.imgUrlFilter(self.sharePhoto[0].gi_img_url), // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            self.isLogin()
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
      },
      // 分享到朋友圈
      friendShare () {
        let self = this

        wx.onMenuShareTimeline({
          title: self.shareTitle, // 分享标题
          link: window.location.href.replace(/\?*#/, "?#"), // 分享链接，该链接域名必须与当前企业的可信域名一致
          imgUrl: self.$method.imgUrlFilter(self.sharePhoto[0].gi_img_url), // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            self.isLogin()
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
      },
      // 微信sdk注册
      wxConfig() {
        let _this = this
        _this.$ajax({
          method: 'get',
          url: _this.$apiTransaction + 'thirdPay/sao',
          params: {
            url: window.location.href.split('#')[0]
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {

          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名，见附录1
            jsApiList: [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })

          wx.ready(()=>{
            _this.wxShare()
            _this.friendShare()
            _this.qqShare()

          })
        })
      },
      isLogin () {
        if (localStorage.hasOwnProperty('token') && localStorage.getItem('member_type') === '091') {
          this.getTicketStep1()
        }
      },
      // 分享成功后领券
      getTicketStep1 () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiTransaction + '/netcardrule/share/present',
          params: {}
        }).then(function (response) {
          if (response.data.optSuc) {
            self.getTicketStep2 (response.data.data)
          }
        })
      },
      getTicketStep2 (url) {
        let self = this
        self.$ajax({
          method: 'get',
          url: url,
          params: {}
        }).then(function (response) {
          if (response.data.optSuc) {
            self.$shareSuccess({ticketMoney: response.data.data})
          }
        })
      }
    }
  }
</script>

<style scoped>
  .selectSizeBox {
  }

  .bg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
  }

  .main {
    background-color: white;
    width: 100%;
    height: 40%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .main .title{
    font-size: .35rem;
    height: .8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .main .shareList {
    flex-grow: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .shareList li {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: .5rem;
  }
  .shareList li img{
    height: 1.2rem;
    margin-bottom: .15rem;
  }
  .shareList li:last-child img{
    height: 1rem;
    margin-bottom: .15rem;
  }
  .main .bottom{
    font-size: .35rem;
    height: 1.2rem;
    border-top: 1px solid #ddd;
    color: rgb(247,0,88);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
