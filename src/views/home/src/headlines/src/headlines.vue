<template lang="pug">
  .headlines
    .headerBox
      img.back(src="../../../../../assets/img/back@2x.png", @click="$router.go(-1)")
    .navBox
      .navItem(:class="{active:navActive===0}", @click="navChange(0)") 一类
      .navItem(:class="{active:navActive===1}", @click="navChange(1)") 二类
      .navItem(:class="{active:navActive===2}", @click="navChange(2)") 三类
      .navItem(:class="{active:navActive===3}", @click="navChange(3)") 四类
      .navItem(:class="{active:navActive===4}", @click="navChange(4)") 五类
      .navItem(:class="{active:navActive===5}", @click="navChange(5)") 六类
    transition(name="fade")
      router-view
</template>

<script>
    export default {
      name: "headlines",
      data () {
        return {
          navActive: 0
        }
      },
      methods: {
        navChange (index) {
          this.navActive = index;
          this.$router.replace(`/home/list/${index}`);
        }
      }
    }
</script>

<style scoped>
  .headlines {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .headerBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.3rem;
    background: url("../../../../../assets/img/newsHeaderBg@2x.png") no-repeat bottom left;
    background-size: cover;
    display: flex;
    align-items: center;
  }
  .back {
    padding: 0 .2rem;
    width: .3rem;
    box-sizing: content-box;
    flex: 0;
  }
  .navBox {
    position: fixed;
    top: 1.3rem;
    left: 0;
    width: 100%;
    height: .93rem;
    display: flex;
  }
  .navItem {
    flex: 1;
    font-size: .4rem;
    color: rgb(51,51,51);
    text-align: center;
    line-height: .93rem;
  }
  .navItem.active {
    background: rgb(153,153,153);
    color: #fff;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
</style>
