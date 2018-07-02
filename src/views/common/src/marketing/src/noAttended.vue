<template lang="pug">
  .wrap
    .content
      .contentTop
        img.contentTopImg(src="../../../../../assets/img/01_index_1.png")
      .contentCenter
        img.contentCenterImg(src="../../../../../assets/img/06_user_error_btn2.jpg")
        .temp1
          .temp1Desc 您还没参加领鞋活动哦
          .temp1Btn(@click="$router.push('/marketing/bindMobile')")
            img.temp1BtnImg(src="../../../../../assets/img/06_user_error_btn.png")
</template>

<script>
  import shareImg from '../../../../../assets/img/applogo@2x.png'
  export default {
    name: "noAttended",
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
  }
  .contentTopImg {
    width: 100%;
  }
  .contentCenter {
    font-size: 0;
    position: relative;
    margin-top: 1.5rem;
  }
  .contentCenterImg {
    width: 100%;
  }
  .temp1 {
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
  .temp1Btn {
    font-size: 0;
    text-align: center;
    position: absolute;
    bottom: .97rem;
    left: 0;
    width: 100%;
  }
  .temp1BtnImg {
    width: 7rem;
  }
  img {
    pointer-events: none;
  }
</style>
