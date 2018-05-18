<template lang="pug">
  .regOverBox
    nav-bar(background="white")
      .topLeft(slot="left")
      .topCenter(slot="center") 注册
      .topRight(slot="right")
    .text
      h1 注册成功
      h2 {{countDown}}秒后跳转到首页
      button(@click="returnIndex") 返回首页
</template>

<script>
  export default {
    name: 'reg-over',
    data (){
      return {
        countDown: 5
      }
    },
    created() {
      this.getUserData()
    },
    mounted: function () {
      this.jumpMyPage()
    },
    methods: {
      returnIndex () {
        this.$store.commit('setShowTicket', true)
        this.$router.push({path: '/home'})
      },
      jumpMyPage (){
        let self = this
        let interval = window.setInterval(function () {
          if ((self.countDown--) <= 0) {
            this.$store.commit('setShowTicket', true)
            self.$router.push({path: '/home'})
            window.clearInterval(interval)
          }
        }, 1000)
      },
      getUserData () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          self.$store.commit('userDataChange' ,response.data.data)
        })
      }
    }
  }
</script>

<style scoped>
  .text{
    margin-top: 2rem;
    height: 4rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
  }
  h1 {
    font-size: .5rem;
    color: rgb(51,51,51);
  }
  h2 {
    font-size: .4rem;
    font-weight: 500;
    color: rgb(153,153,153);
  }
  button {
    width: 6rem;
    height: 1rem;
    color: rgb(51,51,51);
    font-size: .4rem;
    border: solid rgb(245,0,87) 1px;
    outline: none;
    background: none;
  }
</style>
