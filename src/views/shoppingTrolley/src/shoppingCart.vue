<template lang="pug">
  .shoppingCart
    .mescroll#shoppingMescroll
      // 头部-------------------------------------------------------------------------------------
      .header
        .title
          .left(@click="$router.go(-1)")
            img(src="./back.png")
          .center 购物车
        .nav
          .left(@click="go(0)")
            span(:class="{active: navActive===0}") 快递配送({{shoppingCartGoodsNum.sendNum}})
          .right(@click="go(1)")
            span(:class="{active: navActive===1}") 专柜自提({{shoppingCartGoodsNum.carryNum}})
      // 内容--------------------------------------------------------------------------------------
      .contentWrapper
        router-view(ref="childView", :totalCount="totalCount",  @all-change="allChange", @total-change="totalChange", @show-change="allSelectShowChange")
      // 商品推荐列表-------------------------------------------------------------------------------
      .goodsWrapper
        .title
          img(src="./img1.png")
        goods-list(:data="goodsList")
    // 全选--------------------------------------------------------------------------------------
    .allSelect(v-show="allSelectShow && !sliceShow")
      .white
        .left(@click="selectAll")
          .icon
            img(src="./gou.png", v-show="allChecked")
            .noChecked(v-show="!allChecked")
          .text 全选
        .right
          .top (不含运费)实付: <span>{{totalPrice | price-filter}}</span>
          .bottom 现金券可抵扣: {{totalTicket | price-filter}}
      .red(@click="checkCart") 结算({{totalCount}})
    .sliceWrapper(v-show="sliceShow")
      .white(@click="selectAll")
        .icon
          img(src="./gou.png", v-show="allChecked")
          .noChecked(v-show="!allChecked")
        .text 全选
      .red
        .del(@click="deleteGoods") 删除
        .over(@click="sliceShow=false") 完成
    // 整理--------------------------------------------------------------------------------------
    .sliceIcon(v-show="allSelectShow && !sliceShow", @click="sliceShow=true")
      img(src="./slice.png")
</template>

<script>
  import {mapGetters} from 'vuex'
  import GoodsList from 'components/goodsList'
  export default {
    name: "shoppingCart",
    data() {
      return {
        goodsList: [], // 推荐商品集合
        navActive: 0,
        allChecked: false,
        allSelectShow: false,
        sliceShow: false,
        totalPrice: 0,
        totalTicket: 0,
        totalCount: '0'
      }
    },
    computed: {
      ...mapGetters(['shoppingCartGoodsNum', 'shoppingCartCheckedCount', 'position'])
    },
    watch:{
      '$route'(to) {
        if(to.path==='/shoppingCart/express') {
          this.navActive = 0
        } else {
          this.navActive = 1
        }
      }
    },
    activated() {
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0);
        }
      })
    },
    deactivated() {
      this.sliceShow = false
    },
    beforeRouteEnter(to, from, next) {
      next(vm=>{
        if(to.path==='/shoppingCart/express') {
          vm.navActive = 0
        } else {
          vm.navActive = 1
        }
      })
    },
    mounted() {
      this.$mescrollInt("shoppingMescroll", this.upCallback, () => {}, (obj) => {
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
      })
    },
    methods: {
      // 点击结算
      checkCart() {
        this.$refs.childView.checkCart()
      },
      // 显示/隐藏底部结算
      allSelectShowChange(flag) {
        this.allSelectShow = flag
      },
      // 总价格、总立减现金券
      totalChange(data) {
        this.totalPrice = data.payPrice
        this.totalTicket = data.netCard
        this.totalCount = data.selectNum
      },
      // 删除
      deleteGoods() {
        this.$refs.childView.deleteAll()
      },
      // 反全选
      allChange(flag) {
        this.allChecked = flag
      },
      // 全选
      selectAll() {
        this.allChecked = !this.allChecked
        this.$refs.childView.selectAll(this.allChecked)
      },
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
  .shoppingCart {
    height 100%
  }
  .mescroll {
    position absolute
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
    z-index 9999
    .title {
      height $height-header
      background-color #f70057
      position relative
      .left {
        padding .36rem .4rem
        font-size 0
        position absolute
        top 0
        left 0
        img {
          width .58rem
        }
      }
      .center {
        font-size .48rem
        color #fff
        font-weight 500
        width 100%
        line-height $height-header
        text-align center
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
    background-color #fff
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
  .allSelect {
    position fixed
    bottom $height-footer
    left 0
    width 100%
    height 1.44rem
    display flex
    border-top 1px solid #d7d7d7
    z-index 2
    .white {
      flex 1
      background-color #fff
      display flex
      justify-content space-between
      align-items center
      .left {
        padding-left .4rem
        height 100%
        display flex
        align-items center
        .icon {
          img {
            width .53rem
          }
          .noChecked {
            width .53rem
            height .53rem
            border 1px solid #cecece
            border-radius 50%
          }
        }
        .text {
          margin-left .2rem
          color #999
          font-size .37rem
          font-weight 400
        }
      }
      .right {
        font-size .29rem
        color #333
        font-weight 400
        margin-right .2rem
        text-align right
        span {
          color #f70057
          font-size .42rem
        }
      }
    }
    .red {
      background-color #f70057
      width 3.2rem
      text-align center
      line-height 1.44rem
      color #fff
      font-size .42rem
      font-weight 500
    }
  }
  .sliceIcon {
    position fixed
    right .4rem
    bottom 2.9rem
    z-index 300
    font-size 0
    background-color #fff
    border-radius 50%
    img {
      width 1.2rem
    }
  }
  .sliceWrapper {
    position fixed
    bottom $height-footer
    left 0
    width 100%
    display flex
    justify-content space-between
    align-items center
    padding 0 .26rem
    background-color #fff
    height 1.44rem
    border-top 1px solid #d7d7d7
    z-index 2
    .white {
      display flex
      height 100%
      align-items center
      .icon {
        img {
          width .53rem
        }
        .noChecked {
          width .53rem
          height .53rem
          border 1px solid #cecece
          border-radius 50%
        }
      }
      .text {
        margin-left .2rem
        color #999
        font-size .37rem
        font-weight 400
      }
    }
    .red {
      display flex
      .del, .over {
        width 2.6rem
        height .96rem
        color #fff
        text-align center
        line-height .96rem
        font-size .42rem
        font-weight 400
        border-radius .13rem
      }
      .del {
        background-color #f70057
        margin-right .21rem
      }
      .over {
        background-color #ff8500
      }
    }
  }
</style>
