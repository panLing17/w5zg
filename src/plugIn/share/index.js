export default{
  install(Vue)
  {
    Vue.prototype.$initShare = function (options) {
      wxConfig(Vue.prototype, options)
    }
  }
}

// 微信sdk注册
function wxConfig(vm, options) {
  if (!vm.$global.isGetSDK) {
    vm.$ajax({
      method: 'get',
      url: vm.$apiTransaction + 'thirdPay/sao',
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
        jsApiList: ['scanQRCode', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })

      wx.ready(() => {
        vm.$global.isGetSDK = true
        wxShare(options)
        friendShare(options)
        qqShare(options)

      })
    })
  } else {
    wxShare(options)
    friendShare(options)
    qqShare(options)
  }
}

// 分享到qq
function qqShare (options) {
  var link;
  if (options.link) {
    link = options.link
  } else {
    link = window.location.href.replace(/\?*#/, "?#")
  }
  wx.onMenuShareQQ({
    title: options.shareTitle, // 分享标题
    desc: options.shareDesc, // 分享描述
    link: link, // 分享链接
    imgUrl: options.sharePhoto , // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
      if (options.handleSuccess) {
        options.handleSuccess()
      }
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  });
}
// 分享给朋友
function wxShare (options) {
  var link;
  if (options.link) {
    link = options.link
  } else {
    link = window.location.href.replace(/\?*#/, "?#")
  }
  wx.onMenuShareAppMessage({
    title: options.shareTitle, // 分享标题
    desc: options.shareDesc, // 分享描述
    link: link, // 分享链接，该链接域名必须与当前企业的可信域名一致
    imgUrl: options.sharePhoto, // 分享图标
    type: 'link', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {
      // 用户确认分享后执行的回调函数
      if (options.handleSuccess) {
        options.handleSuccess()
      }
    }
  });
}
// 分享到朋友圈
function friendShare (options) {
  var link;
  if (options.link) {
    link = options.link
  } else {
    link = window.location.href.replace(/\?*#/, "?#")
  }
  wx.onMenuShareTimeline({
    title: options.shareTitle, // 分享标题
    link: link, // 分享链接，该链接域名必须与当前企业的可信域名一致
    imgUrl: options.sharePhoto, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
      if (options.handleSuccess) {
        options.handleSuccess()
      }
    }
  });
}
