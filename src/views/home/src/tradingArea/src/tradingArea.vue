<template lang="pug">
  .wrap
    nav-bar(background="white")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") 搜商圈
      .topRight(slot="right")
    .content
      .contentTop
        .heading 热门商圈
        ul.topListWrapper
          li.topItem(v-for="(item, index) in topList", :class="{active:topItemActive===index}", :key="index", @click="checkItem(index)")
            img.topItemBg(:src="item.img")
            .topItemName {{item.title}}
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
        topList: [
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=2927770857,3038999772&fm=27&gp=0.jpg',
            title: '新街口'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=2927770857,3038999772&fm=27&gp=0.jpg',
            title: '新街口'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=2927770857,3038999772&fm=27&gp=0.jpg',
            title: '新街口'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=2927770857,3038999772&fm=27&gp=0.jpg',
            title: '新街口'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=2927770857,3038999772&fm=27&gp=0.jpg',
            title: '新街口'
          }
        ]
      }
    },
    methods: {
      checkItem (index) {
        this.topItemActive = index
        this.$router.push({path: '',query: {id: index}})
      }
    }
  }
</script>

<style scoped>
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
    border: 1px solid #fff;
    box-sizing: border-box;
    border-radius: 0.13rem;
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
