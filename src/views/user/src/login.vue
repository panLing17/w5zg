<template lang="pug">
  .wrap
    .nav
      .navItem(:class="{active:navActive===0}", @click="routerCheck(0)") 快速登录
      .navItem(:class="{active:navActive===1}", @click="routerCheck(1)") 账号登录
      .line(:style="{left: navActive*50+'%' }")
    .viewWrapper
      router-view
</template>

<script>
  export default {
    name: "login",
    data () {
      return {
        navActive: 0
      }
    },
    created () {
      this.getActive()
    },
    methods: {
      getActive () {
        let path = this.$route.path
        if (path.charAt(path.length-1) == 1) {
          this.navActive = 1
        } else {
          this.navActive = 0
        }
      },
      routerCheck (index) {
        this.navActive = index
        switch (index) {
          case 0: this.$router.replace('/login/login2'); break
          case 1: this.$router.replace('/login/login1'); break
        }
      }
    }
  }
</script>

<style scoped>
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  .nav {
    width: 100%;
    border-bottom: 1px solid #f2f2f2;
    /*width: 6rem;*/
    margin: 0 auto;
    height: 1.3rem;
    display: flex;
    position: relative;
  }
  .navItem {
    flex: 1;
    font-size: .4rem;
    font-weight: bold;
    line-height: 1.3rem;
    text-align: center;
    color: #333;
  }

  .navItem.active {
    color:  rgb(245,0,87);
  }
  .line {
    position: absolute;
    bottom: 0;
    width: 50%;
    height: 2px;
    background: rgb(245,0,87);
    transition: all 0.5s;
  }
</style>
