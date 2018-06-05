<template lang="pug">
  .wrap
    .headerWrapper
      .header
        .back(@click="$router.go(-1)")
          img(src="../../../../../assets/img/back@2x.png")
        .title {{$route.query.name}}
    .mescroll#listMescroll
      recommend(ref="recommend")
</template>

<script>
  import recommend from './recommend'
  export default {
    name: "goodsList",
    data () {
      return {
        keywords: ''
      }
    },
    components: {
      recommend
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
        this.mescroll.resetUpScroll();
      }
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    created (){
      this.keywords = this.$route.query.name
    },
    mounted () {
      this.$mescrollInt("listMescroll",this.upCallback,() => {}, () => {});
    },
    methods: {
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          self.$refs.recommend.more(curPageData,page.num,page.size)
          self.mescroll.endSuccess(curPageData.length)
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        let self = this
        self.$ajax({
          method: 'post',
          url:this.$apiGoods + 'goodsSearch/spus',
          params: {
            keywords: this.$route.query.name,
            page: pageNum,
            rows: pageSize
          },
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
</style>
