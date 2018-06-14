<template lang="pug">
  .wrap
    .headerWrapper
      .header
        .back(@click="$router.go(-1)")
          img(src="../../../../../assets/img/back@2x.png")
        .title {{$route.query.name}}
    .mescroll#listMescroll
      .noData(v-if="isEmpty")
        span 没有
        span.special 此类
        span 商品
        img.recommendImg(src="../../../../../assets/img/recommend.png")
      recommend(ref="recommend")
</template>

<script>
  import recommend from './recommend'
  export default {
    name: "goodsList",
    data () {
      return {
        url: '',
        params: {},
        isEmpty: false,
        keywords: ''
      }
    },
    components: {
      recommend
    },
    beforeRouteEnter (to, from , next) {
      to.meta.keepAlive = false
      next();
    },
    beforeRouteLeave (to, from, next) {
      to.meta.keepAlive = true
      next()
    },
    deactivated () {
      this.$store.commit('setPosition', {
        path: '/goodsList',
        y: this.mescroll.getScrollTop()
      })
    },
    activated () {
      if (this.keywords == this.$route.query.name) {
        let _this = this
        this.$store.state.position.forEach((now) => {
          if (now.path === '/goodsList') {
            _this.mescroll.scrollTo(now.y, 0);
          }
        })
      } else {
        this.keywords = this.$route.query.name
        this.isEmpty = false
        this.url = this.$apiGoods + 'goodsSearch/spus'
        this.params.keywords = this.$route.query.name
        this.params.searchRuleConstant = this.$route.query.searchRuleConstant
        this.mescroll.resetUpScroll()
      }

    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    created (){
      this.keywords = this.$route.query.name
      this.url = this.$apiGoods + 'goodsSearch/spus'
      this.params = {
        keywords: this.$route.query.name,
        searchRuleConstant: this.$route.query.searchRuleConstant
      }
    },
    mounted () {
      this.$mescrollInt("listMescroll",this.upCallback,() => {}, () => {});
    },
    methods: {
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {

          if (page.num == 1 && curPageData.length <= 0) {
            self.isEmpty = true
            self.url = self.$apiGoods +  'goodsSearch/goodsRecommendationList'
            self.params = {}
            self.mescroll.resetUpScroll()
          } else {

            self.$refs.recommend.more(curPageData,page.num,page.size)
            self.mescroll.endSuccess(curPageData.length)
          }

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        let self = this
        this.params.page = pageNum
        this.params.rows = pageSize
        self.$ajax({
          method: 'post',
          url: this.url,
          params: this.params,
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          if (response) {
            if (response.data.data instanceof Array) {
              successCallback&&successCallback(response.data.data);
            } else {
              successCallback&&successCallback(response.data.data.data);
            }
          } else {
            self.mescroll.endErr();
          }
        })
      }
    }
  }
</script>

<style scoped>
  #listMescroll {
    position: fixed;
    top: 1.3rem;
    bottom: 0;
    height: auto;
  }
  .headerWrapper {
    height: 1.3rem;
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.3rem;
    border-bottom: 1px solid #f2f2f2;
    background: #fff;
    z-index: 500;
  }
  .back {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 .26rem;
    height: 1.3rem;
    display: flex;
    align-items: center;
  }
  .back img{
    width: .3rem;
  }
  .title {
    font-size: .4rem;
    font-weight: bold;
    text-align: center;
    line-height: 1.3rem;
  }
  .noData {
    line-height: 2rem;
    text-align: center;
    font-size: .4rem;
  }
  .special {
    color: rgb(244,0,87);
    margin: 0 .2rem;
  }
  .recommendImg {
    display: block;
    margin: 0 auto;
    width: 55%;
    pointer-events: none;
  }
</style>
