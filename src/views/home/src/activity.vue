<template lang="pug">
  .wrap
    nav-bar(background="white")
      .topLeft(slot="left", @click="back")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="width: 5rem;text-align: center;") 活动集合
      .topRight(slot="right")
    .mescroll#activityMescroll
      .tabListWrapper
        ul.tabList
          li.tabItem(v-for="(item, index) in tabList", :class="{active: tabActive===index}", @click="tabActive=index", :key="index") {{item}}
      .contentWrapper
        router-view
</template>

<script>
  export default {
    name: "activity",
    data () {
      return {
        tabActive: 0,
        tabList: ['阿迪','耐克','李宁','特步','美特斯邦威','美津浓','范思哲','古驰']
      }
    },
    mounted () {
      this.$mescrollInt("activityMescroll",this.upCallback);
    },
    methods: {
      upCallback: function(page) {},
      back () {
        if (window.history.length<=2) {
          this.$router.push('/home')
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style scoped>
  ::-webkit-scrollbar {
    width: 0px;
  }
  ::-webkit-scrollbar {
    display: none;/*隐藏滚轮*/
  }
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
  }
  .tabListWrapper {
    border: 1px solid #f2f2f2;
    border-top: none;
    overflow: auto;
  }
  .tabList {
    width: 20rem;
    height: 1.5rem;
    line-height: 1.5rem;
    display: flex;
    flex-wrap: nowrap;
  }
  .tabItem {
    flex: none;
    padding: 0 .5rem;
    font-size: .4rem;
    color: #333;
    position: relative;
  }
  .tabItem.active {
    color: rgb(245, 0, 87);
  }
  .tabItem:after {
    content: '';
    width: 1px;
    height: .5rem;
    background: #f2f2f2;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

</style>
