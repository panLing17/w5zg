<template lang="pug">
  div
    nav-bar(background="rgb(247,0,87)" color="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/ic_order_return.png", style="width:.3rem", @click="goBack()")
      .topCenter(slot="center", style="color:white") 购物车
      .topRight(slot="right")
    .shoppingCartBox.mescroll#shoppingCartMescroll(:class="{positionFixed:positionFixed}")
      .cartTypeTab
        ul
          li(@click="tabChange(0)", :class="{tabChecked:nowTab===0}")
            p 专柜自提
            span(class="animated", :class="{rubberBand:flag}") ({{shoppingCartGoodsNum.carryNum}})
          li(@click="tabChange(1)", :class="{tabChecked:nowTab===1}")
            p 快递配送
            span(class="animated", :class="{swing:flag}") ({{shoppingCartGoodsNum.sendNum}})
        p(:style="{left:nowTab*50+'%'}")
          span.side
      .content(v-loading="loading")
        transition(name="fade", mode="out-in")
          router-view(@clear="getGoodsNum")
        .title
          img(src="../../../assets/img/recommend.png")
        recommend(ref="recommend")
    div
      .settlement(v-if="settlementShow")
        .left
          w-checkbox(v-model="shoppingCartAllChecked", @change="allChecked")
          p 全选
        .right
          .price (不含运费) 实付：<span>{{computedPrice | price-filter}}</span>
          .button(@click="goConfirmOrder") 结算({{shoppingCartSelected.length}})
    //cart-guide
</template>

<script>
  import goodsCard from './goodsCard'
  import disableGoods from './disableGoods'
  import citySelect from './citySelect'
  import recommend from './recommend'
  import cartGuide from './cartGuide'
  import {mapState} from 'vuex'

  export default {
    name: 'home',
    data() {
      return {
        // 整页的固定定位，如果一直有的话会影响页面切换效果
        positionFixed: false,
        flag: false,
        loading: true,
        isdefault: false,
        nowTab: 0,
        settlementShow: false
      }
    },
    components: {goodsCard, disableGoods, citySelect, cartGuide, recommend},
    computed: mapState(['shoppingCartGoodsNum', 'computedPrice', 'shoppingCartAllChecked', 'shoppingCartSelected', 'location', 'position']),
    mounted() {
      // mescroll初始化
      this.$mescrollInt("shoppingCartMescroll", this.upCallback, () => {
        this.position.forEach((now) => {
          if (now.path === this.$route.path) {
            this.mescroll.scrollTo(now.y, 0);
          }
        })
      }, (obj) => {

      })
      // 动画hack
      this.animateHack()
      if (this.$route.path === '/shoppingCart') {
        this.nowTab = 0
      } else {
        this.nowTab = 1
      }
      // 获取商品数量
      this.getGoodsNum()
      // loading加载
      let s = 300  // 基础秒数
      let math = Math.random() * 500 // 随机秒数
      setTimeout(() => {
        this.loading = false
      }, s + math)
    },
    watch: {
      $route(to, from) {
        this.loading = true
        // loading加载
        let s = 300  // 基础秒数
        let math = Math.random() * 500 // 随机秒数
        setTimeout(() => {
          this.loading = false
        }, s + math)
      }
    },
    beforeRouteLeave(to, from, next) {
      this.mescroll.hideTopBtn();
      this.$store.commit('setPosition', {
        path: from.path,
        y: this.mescroll.getScrollTop()
      })
      next()
    },
    activated () {
      if (this.$route.path === '/shoppingCart') {
        this.nowTab = 0
      } else {
        this.nowTab = 1
      }
      // 获取商品数量
      this.getGoodsNum()
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0);
        }
      })
    },
    deactivated() {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy();
      // 清除勾选信息
      this.$store.commit('allCheckedChange', false)
      // 清除勾选数据
      this.$store.commit('shoppingCartSelectedChange', [])
      // 清除总价格
      this.$store.commit('computedPriceChange', 0)
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll( isLock );
      },
      upCallback: function (page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function (curPageData) {
          self.$refs.recommend.more(curPageData, page.num, page.size)
          self.mescroll.endSuccess(curPageData.length)
        }, function () {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
//          	axios.get("xxxxxx", {
//					params: {
//						num: pageNum, //页码
//						size: pageSize //每页长度
//					}
//				})
//				.then(function(response)
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goodsSearch/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          successCallback && successCallback(response.data.data);//成功回调
        })
      },
      getGoodsNum() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/countCartNum',
          params: {},
        }).then(function (response) {
          self.$store.commit('shoppingCartGoodsNumChange', response.data.data)
          if (self.nowTab == 0 && response.data.data.carryNum > 0) {
            self.settlementShow = true
          } else if (self.nowTab == 1 && response.data.data.sendNum > 0) {
            self.settlementShow = true
          } else {
            self.settlementShow = false
          }
        })
      },
      tabChange(num) {
        this.nowTab = num
        this.$store.commit('computedPriceChange', 0)
        this.$store.commit('shoppingCartSelectedChange', [])
        this.$store.commit('allCheckedChange', false)
        if (num === 1) {
          this.$router.push('/shoppingCart/express')
        } else {
          this.$router.push('/shoppingCart')
        }

        if (num == 0 && this.shoppingCartGoodsNum.carryNum > 0) {
          this.settlementShow = true
        } else if (num == 1 && this.shoppingCartGoodsNum.sendNum > 0) {
          this.settlementShow = true
        } else {
          this.settlementShow = false
        }
      },
      changeType() {
        this.flag = true
        setTimeout(() => {
          this.flag = false
        }, 1000)
      },
      allChecked(e) {
        this.$store.commit('allCheckedChange', e)
      },
      // 前往确认订单
      goConfirmOrder() {
        let data = this.$store.state.shoppingCartSelected
        // this.$store.state.shoppingCartSelected.forEach((now) => {
        //   let spec = []
        //   now.specVOList.forEach((n) => {
        //     spec.push(n.gspec_value)
        //   })
        //   data.push({
        //     si_id: now.si_id,
        //     skuId: now.gsku_id,
        //     number: now.goods_num,
        //     spec: spec,
        //     price: now.now_price,
        //     goodsName: now.gi_name,
        //     storeName: now.store_name,
        //     photo: now.logo,
        //     cartId: now.sc_id,
        //     freight: now.sku_freight,
        //     storeLocation: {
        //       province: {
        //         name: now.pro_Name,
        //         id: now.province
        //       },
        //       city: {
        //         name: now.city_name,
        //         id: now.city
        //       },
        //       store: {
        //         name: now.store_name,
        //         id: now.store_id
        //       }
        //     }
        //   })
        // })

        // 转为以门店分隔的json数据
        /*let storeList = []
        data.forEach((now)=>{
          if (storeList.indexOf(now.storeName) === -1) {
            storeList.push(now.storeName)
          }
        })
        let storeListOfJson = []
        storeList.forEach((now)=>{
          storeListOfJson.push({
            checked: true,
            storeName: now,
            goodsList: []
          })
        })
        storeListOfJson.forEach((now)=>{
          data.forEach((goodsNow)=>{
            if (goodsNow.storeName === now.storeName) {
              now.goodsList.push(goodsNow)
            }
          })
        })*/
        console.log(data)
        this.$store.commit('transferGive', data)
        let since = ''
        this.$route.path === '/shoppingCart' ? since = 'true' : since = 'false'
        if (this.$store.state.transfer.length > 0) {
          this.$router.push({path: '/confirmOrder', query: {since: since, type: 'shoppingCart'}})
        } else {
          this.$message.error('请勾选商品')
        }
      },
      // 切换动画hack
      animateHack() {
        let self = this
        setTimeout(function () {
          self.positionFixed = true
        }, 0)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .sanjiao {
    width: 0;
    height: 0;
    border-width: .3rem;
    border-style: solid;
    border-color: transparent transparent transparent #aaaaaa;
  }

  .topLeft {
    display: flex;
    align-items: center;
    font-weight: 500;
  }
  /* 动画hack */
  .positionFixed {
    position: fixed !important;
  }
  /*  */
  .shoppingCartBox {
    background-color: rgb(242, 242, 242);
    padding-bottom: 3rem;
    min-height: 100%;
  }

  .slider {
    margin-left: 30%;
    width: 100px;
    height: 100px;
    background: #aaaaaa;
  }

  /* 类型切换 */
  .cartTypeTab {
    position: relative;
    z-index: 2;
    padding: 0 .2rem;
    background-color: white;
  }

  .cartTypeTab ul {
    display: flex;
    height: 1rem;
    justify-content: space-between;
  }

  .cartTypeTab li {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: color .4s;
  }

  .cartTypeTab li span {
    margin-left: .1rem;
  }

  .cartTypeTab > p {
    width: 50%;
    display: flex;
    justify-content: center;
    height: 2px;
    position: absolute;
    bottom: 0;
    transition: left .5s;
  }
  .cartTypeTab>p> .side{
    background-color: rgb(244, 0, 84);
    width: 60%;
    height: 100%;
  }
  .tabChecked {
    color: rgb(244, 0, 84);
  }

  .tabChecked span {
    color: rgb(244, 0, 84);
  }

  /* 内容区域 */
  .content {
    min-height: calc(100vh - 4rem);
    position: relative;
  }

  /* 华丽的分割线 */
  .title {
    height: 1rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
  }

  .title img {
    width: 55%;
  }

  /* 提交部分 */
  .settlement {
    display: flex;
    justify-content: space-between;
    height: 1.2rem;
    width: 100%;
    background-color: white;
    position: fixed;
    bottom: $height-footer;
  }

  .settlement .left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: .2rem;
  }

  .settlement .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .settlement .right .price span{
    color:#f70057;
    font-size: .35rem;
    font-weight: 600
  }
  .settlement .right .button {
    width: 3rem;
    height: 100%;
    font-size: .3rem;
    margin-left: .2rem;
    color: white;
    background: rgb(244, 0, 84);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 上拉刷新下俩加载 */
  #shoppingCartMescroll {
    padding-top: 1.3rem;
    top: 0;
    bottom: 0;
    height: auto;
  }
</style>
