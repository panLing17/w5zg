<template lang="pug">
  .wrap
    nav-bar(background="white")
      .topLeft(slot="left", @click="back")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="width: 5rem;text-align: center;") {{$route.query.title}}
      .topRight(slot="right")
    .tabListWrapper
      ul.tabList
        li.tabItem(v-for="(item, index) in tabList", :class="{active: tabActive===index}", @click="tabCheck(index)", :key="index") {{item.title}}
    .mescroll#activityMescroll
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
      this.getTabList()
    },
    activated () {
      this.getTabList()
    },
    methods: {
      tabCheck (index) {
        this.tabActive = index;
        this.$router.replace({path: '/content', query: {id:this.tabList[index].id, title: this.$route.query.title, actId: this.$route.query.actId}})
      },
      getTabList () {
        let _this = this;
        this.$ajax({
          url: this.$apiApp + 'acActivityContent/acActivityContentList',
          methods: 'get',
          params: {
            actId: this.$route.query.actId,
            parentType: this.$route.query.parentType
          }
        }).then((response) => {
          _this.tabList = response.data.data;
          _this.$router.replace({path: '/content', query: {id:_this.tabList[0].id, title: this.$route.query.title, actId: this.$route.query.actId}})
        })
      },
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
  .mescroll {
    position: fixed;
    top: 2.8rem;
    bottom: 0;
    height: auto;
    width: 100%;
    overflow-x: auto;
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
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }
  .tabList {
    float: left;
    height: 1.5rem;
    line-height: 1.5rem;
  }
  .tabItem {
    display: inline-block;
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
