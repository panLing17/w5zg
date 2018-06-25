<template lang="pug">
  .wrapRankingList
    .countDown(v-if="temp === 1") 倒计时 23:59:59
    ul.listter(ref="haha")#rankingMescroll
      li(v-for="(item,index) in lists", :class="{active:selectN == index}", @click="selectN = index")
        .lefter
          .rank
            img(src="../../../../../assets/img/08_ranking_a.png" v-if="index == 0")
            img(src="../../../../../assets/img/08_ranking_b.png" v-if="index == 1")
            img(src="../../../../../assets/img/08_ranking_c.png" v-if="index == 2")
            span(v-if="index >= 3 && index < 9") {{'0'+(index+1)}}
            span(v-if="index >= 9") {{index+1}}
          .headPic
            img(src="../../../../../assets/img/kaka.jpg")
          .namer KAKA
        .righter <span :class="{active:selectN == index}">388</span>人
    .bottomFixed(v-if="temp === 1")
      .top 末位领鞋者，若好友领券数相同，按时间先到先得
      .bottom
        .lefter
          .rank
            span 1W+
          .headPic
            img(src="../../../../../assets/img/kaka.jpg")
          .namer KAKA
        .righter <span>28</span>人
</template>
<script>
  export default {
    name: 'rankingList',
    data () {
      return {
        selectN: '',
        temp: 1,
        lists: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
      }
    },
    mounted () {
      this.change()
    },
    methods: {
      change () {
        if (this.temp === 1) {
          document.title = '实时排行榜'
        }
        if (this.temp === 2) {
          this.$refs.haha.style.top = '0'
          this.$refs.haha.style.paddingBottom = '0'
          document.title = '获奖名单总排行'
        }
      }
    }
  }
</script>

<style scoped>
.active{
  background-color: #ff3050;
  color: #fff !important;
}
#rankingMescroll{
  position: fixed;
  top: .8rem;
  left: 0;
  right: 0;
  height: 100vh;
}
.wrapRankingList{
  width: 100%;
}
.countDown{
  width: 100%;
  height: .8rem;
  background-color: #ff3050;
  line-height: .8rem;
  text-align: center;
  color: #fff;
  position: fixed;
  top: 0;
}
ul.listter{
  overflow: scroll;
  padding-bottom: 3.6rem;
}
ul.listter li{
  border-bottom: 1px solid #d7d7d7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: .4rem;
  padding-left: .4rem;
  height: 1.35rem;
}
ul.listter li:last-child{
  border-bottom: 1px solid #fff;
}
ul.listter li .lefter{
  display: flex;
  align-items: center;
  padding-top: .1rem;
}
ul.listter li .lefter .rank img{
  width: .6rem;
  margin-left: -.1rem;
  margin-top: -.1rem;
  vertical-align: top;
}
ul.listter li .lefter .rank span{
  font-size: .35rem;
  margin-right: .1rem;
}
ul.listter li:nth-child(2) .lefter .rank img,
ul.listter li:nth-child(3) .lefter .rank img{
  width: .6rem;
  margin-bottom: .3rem;
}
ul.listter li .lefter .headPic{
  margin: 0 .3rem;
}
ul.listter li .lefter .headPic img{
  width: .9rem;
  height: .9rem;
  border-radius: 50%;
}
ul.listter li .lefter .namer{
  font-size: .4rem;
}
ul.listter li .righter{
  font-size: .4rem;
  color: #d7d7d7;
}
ul.listter li .righter span{
  font-weight: 600;
  color: #ff3050;
}
/*底部固定自己的排名--开始*/
.bottomFixed{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.bottomFixed .top{
  width: 100%;
  height: .6rem;
  background-color: #e8e8e8;
  text-align: right;
  line-height: .6rem;
  padding-right: .4rem;
  color: #666;
}
.bottomFixed .bottom{
  background-color: #ff3050;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .3rem;
  color: #fff;
}
.bottomFixed .bottom .lefter{
  display: flex;
  align-items: center;
  padding-top: .1rem;
  font-size: .5rem;
  font-weight: 500;
}
.bottomFixed .bottom .lefter .headPic{
  margin: 0 .3rem;
}
.bottomFixed .bottom .lefter .headPic img{
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
}
.bottomFixed .bottom .righter{
  font-size: .45rem;
}
.bottomFixed .bottom .righter span{
  font-weight: 900;
  font-size: .6rem;
}
/*底部固定自己的排名--结束*/
</style>
