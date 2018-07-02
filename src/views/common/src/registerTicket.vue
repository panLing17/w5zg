<template lang="pug">
  .wrapper(v-loading="loadingFlag")
    nav-bar(background="#ffa516", borderBottom="none")
      .topLeft(slot="left", @click="$router.push('/home')")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="color: #964b00") 新人福利
      .topRight(slot="right")
    .contentWrapper
      img.top(src="../../../assets/img/ad2.jpg")
      .btn(@click="goNext")
      .bottomWrapper
        .dec 仅限新注册的APP会员，优惠券在登录后自动发放。请在“我的——现金券”中查看您的奖品。
        img.bottom(src="../../../assets/img/ad3.png")
</template>

<script>
  import shareImg from '../../../assets/img/ad2.jpg'
  export default {
    name: "registerTicket",
    data () {
      return {
        loadingFlag: false
      }
    },
    created () {
    //  分享加载
      this.loadShare()
    },
    methods: {
      loadShare () {
        this.$initShare({
          sharePhoto: window.location.href.split('/#')[0] + shareImg.substr(1),
          shareTitle: '万物直供注册送1000元现金券',
          shareDesc: '万物直供送礼啦，新注册用户即送1000元现金券'
        })
      },
      goNext () {
        if (localStorage.hasOwnProperty('token')) {
          if (!this.loadingFlag) {
            this.loadingFlag = true
            let self = this
            self.$ajax({
              method: 'get',
              url: self.$apiTransaction + 'netcardrule/reg/present',
              params: {}
            }).then(function (response) {
              if (response.data.optSuc) {
                self.getTicket (response.data.data)
              }
            })
          }
        } else {
          this.$router.push('/login')
        }
      },
      getTicket (url) {
        let self = this
        self.$ajax({
          method: 'get',
          url: url,
          params: {}
        }).then(function (response) {
          if (response.data.optSuc) {
            self.$store.commit('setShowTicket', true)
            self.$store.commit('setTicketMoney', response.data.data)
            self.getUserData()
          }

        })
      },
      getUserData () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          if (response.data.optSuc) {
            self.$store.commit('userDataChange', response.data.data)
            // 成功跳转页面
            self.$router.push({path: '/home'})
          }
        })
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    height: 100vh;
    overflow: hidden;
  }
  .contentWrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 1.3rem);

    background: #ff9f0c;
    background: linear-gradient(#ffa516, #ff9700);
  }
  .top, .bottom {
    width: 100%;
    pointer-events: none;
  }
  .top {
    margin-top: -.5rem;
  }
  .bottom {
    padding-bottom: .5rem;
  }
  .btn {
    width: 4.6rem;
    height: 1.2rem;
    background: url("../../../assets/img/ad4.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
  }
  .dec {
    color: #964b00;
    padding: 0 .4rem;
    margin-bottom: .2rem;
    font-size: .29rem;
  }
</style>
