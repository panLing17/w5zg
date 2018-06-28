<template lang="pug">
  .wrap
    nav-bar(background="white")
      .topLeft(slot="left", @click="back")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="width: 5rem;text-align: center;") {{$route.query.title}}
      .topRight(slot="right")
    .tabListWrapper(ref="tabWrapper")
      ul.tabList
        li.tabItem(v-for="(item, index) in tabList", :class="{active: tabActive===index}", @click="tabCheck(index)", :key="index") {{item.title}}
    .mescroll#activityMescroll
      .contentWrapper
        router-view
</template>

<script>
  import BScroll from "better-scroll"
  export default {
    name: "activity",
    data () {
      return {
        tabActive: 0,
        tabList: [],
        actId: '',
        url: '',
        params: {}
      }
    },
    beforeRouteEnter (to, from , next) {
      to.meta.keepAlive = false
      next()
    },
    created () {

    },
    mounted () {
      this._initParams()
      this.getTabList(this.$route.query.id)
    },
    activated () {
      if (this.actId != this.$route.query.actId) {
        this._initParams()
        this.getTabList()
      } else {
        this.$router.replace({path: '', query: {id:this.tabList[this.tabActive].id, title: this.$route.query.title, actId: this.$route.query.actId, parentType: this.$route.query.parentType}})
      }
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
        this.tabActive = index;
        this.$router.replace({path: '', query: {id:this.tabList[index].id, title: this.$route.query.title, actId: this.$route.query.actId,  parentType: this.$route.query.parentType}})
      },
      getTabList (id) {
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
              scrollX: true
            })
          })
          if (!id) {
            _this.$router.replace({path: '', query: {id:_this.tabList[0].id, title: this.$route.query.title, actId: this.$route.query.actId, parentType: this.$route.query.parentType}})
          } else {
            _this.$router.replace({path: '', query: {id:id, title: this.$route.query.title, actId: this.$route.query.actId, parentType: this.$route.query.parentType}})
            _this.tabList.forEach((item, index) => {
              if (item.id == id) {
                _this.tabActive = index
              }
            })
          }
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
    top: 2.5rem;
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
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
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
    min-width: 2.5rem;
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
</style>
