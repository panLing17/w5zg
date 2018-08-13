<template lang="pug">
  .empty.mescroll#collectMescroll
    .imgs
      img(src="../../../assets/img/coupon-icon@2x.png")
    .words 您还没有收藏商品，快去逛逛吧
    .goToHome(@click="$router.push('/home')") 去商城首页
    .titler
      img(src="../../../assets/img/recommend.png")
    recommend#dataId(ref="recommend")
</template>

<script>
  import recommend from './recommend'
  import {mapState} from 'vuex'
  export default {
    name: "emptys",
    components:{recommend},
    computed:{
      ...mapState(['position'])
    },
    activated() {
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0)
        }
      })
    },
    mounted() {
      this.$mescrollInt('collectMescroll', this.upCallback, () => {

      }, (obj) => {
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
      })

    },
    methods:{
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll(isLock)
      },
      // 推荐
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
        let self = this;
        self.$ajax({
          method: 'post',
          url:self.$apiGoods + 'goodsSearch/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          successCallback&&successCallback(response.data.data);//成功回调
        })
      }
    }
  }
</script>

<style scoped>
  .empty{
    position: fixed;
    top: 1.28rem;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #666;
    background-color: #f2f2f2;
    height: auto;
    z-index: 2;
  }
  .imgs{
    margin-top: 1.06rem;
  }
  .imgs img{
    width: 2.66rem;
    height: 2.66rem;
  }
  .empty .words{
    margin-top: .26rem;
    color: #777;
    font-size: .37rem;
  }
  .goToHome{
    width: 4.26rem;
    height: 1.17rem;
    line-height: 1.17rem;
    margin: .66rem auto 0;
    background-color: #F70057;
    border-radius: .26rem;
    color: #fff;
    font-size: .4rem;
  }
  /*我的推荐--开始*/
  .titler{
    height: .58rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
    padding: .2rem 0;
    margin-top: 1.06rem;
    margin-bottom: .46rem;
  }
  .titler img{
    width: 4.18rem;
  }
</style>
