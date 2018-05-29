

<script>
  export default {
    name: "share",
    data () {
      return {
      }
    },
    props: {
      sharePhoto: Array,
      shareTitle: String,
      shareDesc: String,
      handleSuccess: Function
    },
    mounted () {
      this.wxConfig()
      // this.wxShare()
      // this.friendShare()
      // this.qqShare
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
          desc: self.shareDesc, // 分享描述
          link: window.location.href.replace(/\?*#/, "?#"), // 分享链接
          imgUrl: self.sharePhoto , // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            self.handleSuccess()
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
      },
      // 分享给朋友
      wxShare () {
        let self = this
        wx.onMenuShareAppMessage({
          title: self.shareTitle, // 分享标题
          desc: self.shareDesc, // 分享描述
          link: window.location.href.replace(/\?*#/, "?#"), // 分享链接，该链接域名必须与当前企业的可信域名一致
          imgUrl: self.sharePhoto, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            self.handleSuccess()
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
          imgUrl: self.sharePhoto, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            self.handleSuccess()
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
      }
    }
  }
</script>


