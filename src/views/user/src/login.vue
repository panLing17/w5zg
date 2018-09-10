<template lang="pug">
  .wrap
    .nav
      .navItem.left(:class="{active:navActive===0}", @click="routerCheck(0)")
        span 快捷登录
      .navItem.right(:class="{active:navActive===1}", @click="routerCheck(1)")
        span 账号登录
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
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    width: 100vw;
    height: 100vh;
  }
  .nav {
    width: 100%;
    /*width: 6rem;*/
    margin: 0 auto;
    height: 1.44rem;
    display: flex;
    position: relative;
  }
  .navItem {
    flex: 1;
    display: flex;
    align-items: flex-end;
    font-size: .4rem;
    font-weight: bold;
  }
  .navItem.left {
    padding-left: 1.9rem;
  }
  .navItem.right {
    padding-right: 1.9rem;
    justify-content: flex-end;
  }

  .navItem span {
    color: #666;
    font-weight: 400;
    font-size: .37rem;
    line-height: .53rem;
    padding: .1rem .24rem;
    border-bottom: .08rem solid #fff;
  }
  .navItem.active span {
    color:  rgb(245,0,87);
    border-bottom: .08rem solid #f70057;

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
