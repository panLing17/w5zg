
export const getUserData = {
  methods: {
    getUserData () {
      let self = this
      self.$ajax({
        method: 'get',
        url: self.$apiMember + 'member/currentMember',
        params: {}
      }).then(function (response) {
        self.$store.commit('userDataChange', response.data.data)
        localStorage.setItem('member_type', response.data.data.member_type)
        if (response.data.data.member_type === '091') {
          if (response.data.data.reg_present === '11') {
            self.$store.commit('setShowRegisterTicket', false)
          } else {
            self.$store.commit('setShowRegisterTicket', true)
          }
        } else {
          self.$store.commit('setShowRegisterTicket', false)
        }
      })
    }
  }
}

export const activityShare = {
    data() {
      return {
        shareShow: false,
        shareTitle: '',
        shareContent: '',
        shareImg: '',
        shareUrl: window.location.href.replace(/\?*#/, "?#"),
        navShow: true
      }
    },
    created() {
      this.showShare()
      this.getShareContent()
      this.setTitle()
    },
    methods: {
      setTitle() {
        if (typeof w5zgApp !== 'undefined') {
          w5zgApp.getTitle(this.$route.query.title)
          return
        }
        if (window.webkit && window.webkit.messageHandlers.iosMessage) {
          let results2 = window.webkit.messageHandlers.iosMessage.postMessage({type: 'title', title: this.$route.query.title});
          if (results2) {
            return
          }
        }
      },
      getShareContent() {
        if (!this.$route.query.shId) {
          this.shareTitle = '万物直供商城正品保障'
          this.shareContent = '万物直供商城价格优惠，正品保障，支持专柜提货，快来买买买'
          this.shareImg = 'https://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/logo/applogo@2x.png'
          // 安卓调H5回调
          window['shareClickAndroid'] = function(){
            w5zgApp.share(this.shareTitle,this.shareContent,this.shareImg,this.shareUrl)
          }
          return
        }
        let self = this
        self.$ajax({
          method: 'get',
          url:self.$apiApp +  'acsharinginfo/getAcSharingInfoById',
          params: {
            shId: this.$route.query.shId
          },
        }).then(function (response) {
          if (response) {
            self.shareTitle = response.data.data.sh_title
            self.shareContent = response.data.data.sh_content
            self.shareImg = process.env.IMG_URL + response.data.data.sh_pic_url
            self.$initShare({
              sharePhoto: self.shareImg,
              shareTitle: self.shareTitle,
              shareDesc: self.shareContent,
              link: self.shareUrl
            })
            // 安卓调H5回调
            window['shareClickAndroid'] = function(){
              w5zgApp.share(self.shareTitle,self.shareContent,self.shareImg,self.shareUrl)
            }
          }
        })
      },
      showShare () {
        if (typeof w5zgApp !== 'undefined') {
          this.shareShow = true
          this.navShow = false
        }
        if (window.webkit && window.webkit.messageHandlers.iosMessage) {
          this.shareShow = true
          this.navShow = false
        }
      },
      shareClick () {
        if (window.webkit && window.webkit.messageHandlers.iosMessage) {
          let results2 = window.webkit.messageHandlers.iosMessage.postMessage({type: 'share', title: this.shareTitle, content: this.shareContent, img: this.shareImg, url: this.shareUrl});
          if (results2) {
            return
          }
        }
        if (typeof w5zgApp !== 'undefined') {
          if (this.shareTitle == '') {
            return
          }
          w5zgApp.share(this.shareTitle,this.shareContent,this.shareImg,this.shareUrl)
          return
        }
      }
    }

}
