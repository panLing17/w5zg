<template lang="pug">
  .wrap
    nav-bar(background="white")
      .topLeft(slot="left", @click="goBack")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") 搜商圈
      .topRight(slot="right")
    .content.mescroll#Mescroll
      .wrapper
        .contentTop
          .heading 热门商圈
          ul.topListWrapper
            li.topItem(v-for="(item, index) in topList", :class="{active:topItemActive===index}", :key="index", @click="checkItem(index)")
              img.topItemBg(:src="item.image | img-filter")
              .topItemName {{item.name}}
              .topItemBtn 选择商场
          .topMore 更多商圈陆续开放，敬请期待吧~
        .contentBottom
          .heading.border 热门商场
          router-view
</template>

<script>
  export default {
    name: "index",
    data () {
      return {
        topItemActive: 0,
        topList: []
      }
    },
    beforeRouteEnter (to, from , next) {
      to.meta.keepAlive = false
      next();
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn()
      this.mescroll.destroy()
    },
    created () {
      this.getTradingArea()
    },
    methods: {
      goBack () {
        this.$router.go(-1)
        // app交互
        if (typeof w5zgApp !== 'undefined') {
          w5zgApp.onfinish()
        }
        // 交互完毕
      },
      getTradingArea () {
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiApp + 'businessdistrict/queryBusinessDistrict',
          params: {
            cityNo : '100100'
          },
        }).then(function (response) {
          if (response) {
            self.topList = response.data.data
            self.$router.replace({path: '',query: {id: response.data.data[0].id}})
          }
        })
      },
      checkItem (index) {
        this.topItemActive = index
        this.$router.replace({path: '',query: {id: this.topList[index].id}})
      }
    }
  }
</script>

<style scoped>
  .mescroll {
    position: absolute;
    top: 1.3rem;
    bottom: 0;
    left: 0;
    height: auto;
  }
  .wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: auto;
    width: 100%;
  }
  .contentTop {
    padding: 0 .26rem;
    border-bottom: .53rem solid #f3f3f3;
  }
  .heading {
    font-size: .48rem;
    color: #333;
    font-weight: bold;
    padding: .4rem 0;
  }
  .topListWrapper {
    display: flex;
    flex-wrap: wrap;
  }
  .topItem {
    width: 2.933rem;
    height: 1.6rem;
    position: relative;
    margin: 0 .3333rem .26rem 0;
    /*border: 1px solid #fff;*/
    box-sizing: border-box;
    border-radius: 0.13rem;
    overflow: hidden;
  }
  .topItem.active {
    border: 1px solid #f70057;
    background: #ffe8f0;
  }
  .topItem:nth-child(3n) {
    margin-right: 0;
  }
  .topItem.active .topItemBg {
    display: none;
  }
  .topItemBg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: .13rem;
    z-index: -1;
  }
  .topItem.active .topItemName {
    color: #f70057;
    line-height: 1.6rem;
    margin: 0;
  }
  .topItemName {
    font-size: .42rem;
    color: #fff;
    line-height: 1;
    margin-top: .4rem;
    text-align: center;
  }
  .topItem.active .topItemBtn {
    display: none;
  }
  .topItemBtn {
    font-size: .24rem;
    color: #333;
    width: 1.5rem;
    margin: .2rem auto 0;
    background: rgba(255,255,255,.5);
    text-align: center;
    border-radius: .5rem;
  }
  .topMore {
    font-size: .32rem;
    color: #999;
    text-align: center;
    line-height: 1;
    padding: .2rem 0 .46rem;
  }
  .heading.border {
    padding: .4rem 0.26rem;
    border-bottom: 1px solid #d7d7d7;
  }
  img {
    pointer-events: none !important;
  }
</style>
