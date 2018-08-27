<template lang="pug">
  .accountCardBox
    nav-bar(background="#f70057", style="position: fixed; z-index: 200;")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="./back.png", style="width:.586rem")
      .topCenter(slot="center", style="color:#fff;") 现金券
      .topRight(slot="right", @click="$router.push('/my/accountCardCExplain')")
        img(src="./desc.png", style="width: 2rem")
        <!--p(style="color:#f50057; font-size: .4rem; font-weight: normal;", @click="$router.push('/my/cashDetailC')") 明细-->
    .tabBox
      ul.tabList
        li.tabItem.l(:class="{'active':listActive===0}",@click="tabChange(0)") 可用
        li.tabItem.c(:class="{'active':listActive===1}",@click="tabChange(1)") 已使用
        li.tabItem.r(:class="{'active':listActive===2}",@click="tabChange(2)") 已过期
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
      mounted () {
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
  .mescroll {
    position: fixed;
    top: 2.26rem;
    left: 0;
    bottom: 0;
    width: 100%;
    height: auto;
    background: rgb(242,242,242);
  }
  .accountCardBox {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .tabBox {
    height: .96rem;
    background: #fff;
    position: fixed;
    top: 1.3rem;
    left: 0;
    width: 100%;
    z-index: 150;
    border-bottom: 1px solid #cecece;
  }
  .tabList {
    display: flex;
  }
  .tabItem {
    height: 100%;
    line-height: .96rem;
    color: rgb(51,51,51);
    font-size: .4rem;
    text-align: center;
    position: relative;
  }
  .l, .r {
    width: 35%;
  }
  .l:before, .r:before {
    content: '';
    width: 1px;
    height: .66rem;
    background: #cecece;
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .l:before {
    right: 0;
  }
  .r:before {
    left: 0;
  }
  .c {
    width: 30%;
  }
  .tabItem.active {
    color: rgb(245,0,87);
  }
  .tabItem.active:after {
    content: '';
    width: 1.17rem;
    height: .08rem;
    background: #f70057;
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  img {
    pointer-events: none;
  }
</style>
