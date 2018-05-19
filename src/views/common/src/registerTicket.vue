<template lang="pug">
  .wrapper
    nav-bar
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") 新人福利
      .topRight(slot="right")
    .contentWrapper
      img.top(src="../../../assets/img/ad2.png")
      .btn(@click="goNext")
      .bottomWrapper
        .dec 仅限新注册的APP会员，优惠券在登录后自动发放。请在“我的——现金券”中查看您的奖品。
        img.bottom(src="../../../assets/img/ad3.png")
</template>

<script>
  export default {
    name: "registerTicket",
    methods: {
      goNext () {
        if (localStorage.hasOwnProperty('token')) {
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
        } else {
          this.$router.push('/register1')
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
    margin-top: -.8rem;
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
