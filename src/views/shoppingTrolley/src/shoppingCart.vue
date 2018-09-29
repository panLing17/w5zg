<template lang="pug">
  .mescroll#shoppingMescroll
    // 头部-------------------------------------------------------------------------------------
    .header
      .title
        .left
          img(src="./back.png")
        .center 购物车
      .nav
        .left(@click="go(0)")
          span(:class="{active: navActive===0}") 快递配送({{shoppingCartGoodsNum.sendNum}})
        .right(@click="go(1)")
          span(:class="{active: navActive===1}") 专柜自提({{shoppingCartGoodsNum.carryNum}})
    // 内容--------------------------------------------------------------------------------------
    .contentWrapper
      router-view
    // 商品推荐列表-------------------------------------------------------------------------------
    .goodsWrapper
      .title
        img(src="./img1.png")
      goods-list(:data="goodsList")
</template>

<script>
  import {mapGetters} from 'vuex'
  import GoodsList from 'components/goodsList'
  export default {
    name: "shoppingCart",
    data() {
      return {
        goodsList: [], // 推荐商品集合
        navActive: 0
      }
    },
    computed: {
      ...mapGetters(['shoppingCartGoodsNum'])
    },
    mounted() {
      this.$mescrollInt("shoppingMescroll", this.upCallback, () => {}, () => {})
    },
    methods: {
      // 路由切换
      go(flag) {
        this.navActive = flag
        flag===0 ? this.$router.replace('/shoppingCart/express') : this.$router.replace('/shoppingCart/self')
      },
      // 获取推荐列表
      upCallback: function (page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function (curPageData) {
          self.goodsList = self.goodsList.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)
        }, function () {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'gcdetails/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          successCallback && successCallback(response.data.data)
        })
      }
    },
    components: {
      GoodsList
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .mescroll {
    position fixed
    top 0
    bottom 1.38rem
    left 0
    width 100%
    height auto
  }
  .header {
    position fixed
    top 0
    left 0
    width 100%
    z-index 40
    .title {
      height $height-header
      background-color #f70057
      position relative
      .left {
        padding .36rem .4rem
        font-size 0
        img {
          width .58rem
        }
      }
      .center {
        font-size .48rem
        color #fff
        font-weight 500
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
      }
    }
    .nav {
      height .96rem
      background-color #fff
      border-bottom 1px solid #d7d7d7
      display flex
      .left, .right {
        flex 1
        span {
          display inline-block
          height 100%
          color #666
          font-weight 400
          font-size .37rem
          line-height .96rem
          border-bottom 0.08rem solid #fff
          &.active {
            color #f70057
            border-color #f70057
          }
        }
      }
      .left {
        padding-left 1.8rem
      }
      .right {
        padding-right 1.8rem
        text-align right
      }
    }
  }
  .contentWrapper {
    margin-top 2.26rem
  }
  .goodsWrapper {
    .title {
      font-size 0
      padding .48rem 0
      text-align center
      background-color #f3f3f3
      img {
        width 4.18rem
      }
    }
  }
</style>
