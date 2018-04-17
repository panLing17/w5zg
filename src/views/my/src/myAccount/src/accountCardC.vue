<template lang="pug">
  .accountCardBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 现金券
      .topRight(slot="right")
        p(style="color:#f50057; font-size: .4rem; font-weight: normal;", @click="$router.push('/my/cashDetailC')") 明细
    .tabBox
      ul.tabList
        li.tabItem(:class="{'active':listActive===0}",@click="tabChange(0)") 未使用
        li.tabItem(:class="{'active':listActive===1}",@click="tabChange(1)") 已使用
        li.tabItem(:class="{'active':listActive===2}",@click="tabChange(2)") 已过期
        li.line(:style="{'left':listActive*33.33+'%'}")
    transition(name="fade", mode="out-in")
      router-view
</template>

<script>
    export default {
        name: "accountCardC",
        data () {
          return {
            listActive: 0
          }
        },
        methods: {
          tabChange(index) {
            this.listActive = index;
            this.$router.replace({path:`/my/useDetail/${index}`});
          }
        }
    }
</script>

<style scoped>
  .accountCardBox {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .tabBox {
    height: .93rem;
    padding: 0 .2rem;
    box-sizing: border-box;
    background: #fff;
  }
  .tabList {
    display: flex;
    position: relative;
  }
  .tabItem {
    flex: 1;
    width: 100%;
    height: 100%;
    line-height: .93rem;
    color: rgb(51,51,51);
    font-size: .4rem;
    text-align: center;
  }
  .tabItem.active {
    color: rgb(245,0,87);
  }
  .line {
    width: 33.33%;
    height: .053rem;
    background: rgb(245,0,87);
    position: absolute;
    bottom: 0;
    transition: all 0.5s;
  }
</style>
