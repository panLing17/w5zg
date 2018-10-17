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
      .contentWrapper(ref="contentWrapper", @touchstart="start($event)", @touchmove="move($event)", @touchend="end($event)")
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
      this.currentPosition = 0; // 记录当前页面位置
      this.pageWidth = window.innerWidth // 页面宽度
      this.startX
      this.startY
      this.initialPos = 0;  // 手指按下的屏幕位置
      this.direction = 'left'; // 滑动的方向
      this.isMove = false; // 是否发生左右滑动
      this.startT = 0; // 记录手指按下去的时间
      this.isTouchEnd = true; // 标记当前滑动是否结束(手指已离开屏幕)
    },
    activated() {
      if (this.actId != this.$route.query.actId) {
        this.tabActive = 0
        this._initParams()
        this.getTabList()
      }

    },
    deactivated() {},
    mounted () {
      this._initParams()
      this.getTabList()
    },
    methods: {
      start(e) {
        // e.preventDefault();
        // 单手指触摸或者多手指同时触摸，禁止第二个手指延迟操作事件
        if (e.touches.length === 1 || this.isTouchEnd) {
          let touch = e.touches[0];
          this.startX = touch.pageX;
          this.startY = touch.pageY;
          this.initialPos = this.currentPosition;   // 本次滑动前的初始位置
          this.startT = + new Date(); // 记录手指按下的开始时间
          this.isMove = false; // 是否产生滑动
          this.isTouchEnd = false; // 当前滑动开始
        }
      },
      move(e) {
        // e.preventDefault();
        // 如果当前滑动已结束，不管其他手指是否在屏幕上都禁止该事件
        if (this.isTouchEnd) return ;

        let touch = e.touches[0];
        let deltaX = touch.pageX - this.startX;
        let deltaY = touch.pageY - this.startY;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          this.isMove = true;
          this.direction = deltaX > 0 ? 'right' : 'left'; // 判断手指滑动的方向
        }
      },
      end(e) {
        // e.preventDefault();
        // 计算手指在屏幕上停留的时间
        let deltaT = + new Date() - this.startT;
        // 发生了滑动，并且当前滑动事件未结束
        if (this.isMove && !this.isTouchEnd) {
          this.isTouchEnd = true; // 标记当前完整的滑动事件已经结束
          if (deltaT < 300) { // 如果停留时间小于300ms,则认为是快速滑动，无论滑动距离是多少，都停留到下一页
            // 如果最终位置超过边界位置，则停留在边界位置
            if (this.direction === 'left') {
              this.tabActive++
              this.tabActive = this.tabActive===this.tabList.length?0:this.tabActive
            }else {
              this.tabActive--
              this.tabActive = this.tabActive===-1?(this.tabList.length-1):this.tabActive
            }
            this.tabScroll && this.tabScroll.scrollToElement.call(this.tabScroll, this.$refs.tab[this.tabActive], 500)
          }
        }
      },
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
    background-color: #fff;
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
