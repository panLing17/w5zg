<template lang="pug">
  .wrap
    nav-bar(background="white", v-if="navShow")
      .topLeft(slot="left", @click="back")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="width: 5rem;text-align: center;") {{$route.query.title}}
      .topRight(slot="right", @click="shareClick")
        img(v-if="shareShow", src="../../../../../assets/img/shareImg.png", style="width: .58rem")
    .tabListWrapper(ref="tabWrapper")
      ul.tabList
        li.tabItem(v-for="(item, index) in tabList", ref="tab", :class="{active: tabActive===index}", @click="tabCheck(index)", :key="index") {{item.title}}
    .mescroll#activityMescroll(:style="{top: navShow?'2.5rem':'1.2rem'}")
      .contentWrapper
        router-view(v-if="tabList.length", :id="tabList[tabActive].id")
</template>

<script>
  import BScroll from "better-scroll"
  import {activityShare} from 'assets/js/mixin.js'
  export default {
    name: "activity",
    mixins:[activityShare],
    data () {
      return {
        tabActive: 0,
        tabList: [],
        actId: '',
        url: '',
        params: {}
      }
    },
    created () {

    },
    mounted () {
      this._initParams()
      this.getTabList()
    },
    methods: {
      _initParams () {
        this.actId = this.$route.query.actId
        if (this.$route.query.parentType === '362') {
          this.url = this.$apiApp + 'acActivityContent/queryTagAcActivityContentList'
          this.params = {
            parent_con_id: this.actId
          }
        } else if (this.$route.query.parentType === '361' || this.$route.query.parentType === '363'){
          this.url = this.$apiApp + 'acActivityContent/acActivityContentList'
          this.params = {
            actId: this.actId,
            parentType: this.$route.query.parentType,
            conType: '484'
          }
        }
      },
      tabCheck (index) {
        let currentX = this.tabScroll.x
        let targetX = (index * 94) - 94
        if (currentX > -targetX) {
          // 说明点的右边
          this.tabScroll && this.tabScroll.scrollToElement.call(this.tabScroll, this.$refs.tab[index-2], 500)
        } else {
          //点的左边
          this.tabScroll && this.tabScroll.scrollToElement.call(this.tabScroll, this.$refs.tab[index-1], 500)
        }
        this.tabActive = index
      },
      getTabList () {
        let _this = this;
        this.$ajax({
          url: this.url,
          methods: 'get',
          params: this.params
        }).then((response) => {
          _this.tabList = response.data.data;
          if (_this.tabList.length <= 0) {
            return
          }
          _this.$nextTick(()=>{
            _this.tabScroll = new BScroll(this.$refs.tabWrapper, {
              // 让menuScroll可以点击
              click: true,
              scrollX: true,
              scrollY: false
            })

          })
        })
      },
      back () {
        if (window.history.length<=1) {
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
    /*top: 2.5rem;*/
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
    position: relative;
  }
  .tabList {
    float: left;
    height: 1.2rem;
    line-height: 1.2rem;
    display: flex;
    min-width: 100%;
    position: relative;
  }
  .tabItem {
    flex: 1;
    /*padding: 0 .2rem;*/
    min-width: 94px;
    text-align: center;
    font-size: .4rem;
    color: #333;
    position: relative;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .tabItem.active {
    color: rgb(245, 0, 87);
  }
  .tabItem.active:before {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background: rgb(245, 0, 87);
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .contentWrapper {
    border-top: .26rem solid #f3f3f3;
  }
  .tabContent {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }
  .positionBtnWrapper {
    position: absolute;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .leftBtn, .rightBtn {
    height: 1.2rem;
    width: 94px;
  }
</style>
