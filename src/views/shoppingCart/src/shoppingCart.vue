<template lang="pug">
  div
    nav-bar(background="rgb(247,0,87)" color="white")
      .topLeft(slot="left")
      .topCenter(slot="center", style="color:white") 购物车
      .topRight(slot="right")
    .shoppingCartBox.mescroll#shoppingCartMescroll(:class="{positionFixed:positionFixed}")
      .cartTypeTab
        ul
          li(@click="tabChange(0)", :class="{tabChecked:nowTab===0}")
            p 快递配送
            span(class="animated", :class="{swing:flag}") ({{shoppingCartGoodsNum.sendNum}})
          li(@click="tabChange(1)", :class="{tabChecked:nowTab===1}")
            p 专柜自提
            span(class="animated", :class="{rubberBand:flag}") ({{shoppingCartGoodsNum.carryNum}})
        p(:style="{left:nowTab*50+'%'}")
          span.side
      .content(v-loading="loading")
        transition(name="fade", mode="out-in")
          router-view(@clear="getGoodsNum", @scroll="scrollToTop", ref="routerView")
        .title
          img(src="../../../assets/img/recommend.png")
        recommend(ref="recommend")
    div
      .settlement(v-if="settlementShow")
        .left
          w-checkbox(v-model="shoppingCartAllChecked", @change="allChecked")
          p 全选
        .right
          .price
            p (不含运费) 实付：<span>{{computedPrice.allPrice | price-filter}}</span>
            p 现金券抵扣：{{usableNetCard | price-filter}}
          .button(@click="goConfirmOrder") 结算({{allPrice}})
      .arrangement(v-if="!arrangementFlag", @click="arrangement")
        img(src="../../../assets/img/pageList.png")
        p 整理
    // 整理操作
    .arrangementButtons(v-if="arrangementFlag")
      .arrangementLeft
        w-checkbox(v-model="shoppingCartAllChecked", @change="allChecked")
        span 全选
      .arrangementRight
        .delete(@click="deleteScGoods") 删除
        .ok(@click="closeArrangement") 完成
    // 失效商品提示
    disableTips(ref="disableTips")
    //cart-guide
</template>

<script>
  import disableTips from './goodsDisableTips'
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
        nowTab: 1,
        settlementShow: false,
        arrangementFlag: false
      }
    },
    components: {goodsCard, disableGoods, citySelect, cartGuide, recommend, disableTips},
    computed: {
      usableNetCard () {
        if (this.computedPrice.counterPrice - this.computedPrice.allPrice < this.userData.netcard_balance) {
          return this.computedPrice.counterPrice - this.computedPrice.allPrice
        } else {
          return this.userData.netcard_balance
        }
      },
      allPrice () {
        let num = 0
        if (this.$route.path === '/shoppingCart/self') {
          if (this.shoppingCartSelected.length>0) {
            this.shoppingCartSelected.forEach((now)=>{
              now.shoppingCartVOList.forEach((sonNow)=>{
                num+=1
              })
            })
          }
        } else {
          if (this.shoppingCartSelected.commList) {
            this.shoppingCartSelected.commList.forEach((now)=>{
              now.shoppingCartVOList.forEach((sonNow)=>{
                num+=1
              })
            })
          }
        }

        return num
      },
      ...mapState(['shoppingCartGoodsNum', 'computedPrice', 'shoppingCartAllChecked', 'shoppingCartSelected', 'location', 'position', 'userData'])
    },
    mounted() {
      this.getUserDat()
      // mescroll初始化
      this.mescrollInt()
      // 动画hack
      this.animateHack()
      if (this.$route.path === '/shoppingCart/self') {
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
        // 按url选中选项卡
        if (to.path === '/shoppingCart/self') {
          this.nowTab = 1
        }
        if (to.path === '/shoppingCart/express') {
          this.nowTab = 0
        }
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
      if (this.$route.path === '/shoppingCart/self') {
        this.nowTab = 1
      } else {
        this.nowTab = 0
      }
      // 获取商品数量
      this.getGoodsNum()
      if (!this.scroll) {
        this.position.forEach((now) => {
          if (now.path === this.$route.path) {
            this.mescroll.scrollTo(now.y, 0);
          }
        })
      } else {
        this.scroll = false
      }

    },
    deactivated() {

      // 清除勾选信息
      // this.$store.commit('allCheckedChange', false)
      // 清除勾选数据
      // this.$store.commit('shoppingCartSelectedChange', [])
      // 清除总价格
      // this.$store.commit('computedPriceChange', 0)
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    methods: {
      mescrollInt () {
        this.$mescrollInt("shoppingCartMescroll", this.upCallback, () => {
          this.position.forEach((now) => {
            if (now.path === this.$route.path) {
              this.mescroll.scrollTo(now.y, 0);
            }
          })
        }, (obj) => {

        },this.downCallback,true)
      },
      scrollToTop () {
        this.scroll = true
        this.mescroll.scrollTo(0, 0)
      },
      goBack () {
        this.$router.go(-1)
      },
      /* 获取用户信息 */
      getUserDat () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          self.$store.commit('userDataChange', response.data.data)
          self.userData()
        })
      },
      // 整理
      arrangement () {
        this.arrangementFlag = true
        this.settlementShow = false
      },
      // 关闭整理
      closeArrangement () {
        this.arrangementFlag = false
        this.settlementShow = true
      },
      // 批量删除
      deleteScGoods () {
        let scId = []
        let selectedDate = this.shoppingCartSelected
        if (this.$route.path === '/shoppingCart/self') {
          if (selectedDate.length>0) {
            selectedDate.forEach((now,index)=>{
              now.shoppingCartVOList.forEach((sonNow,sonIndex)=>{
                scId.push(sonNow.sc_id)
              })
            })
          }
        } else {
          if (selectedDate.commList) {
            selectedDate.commList.forEach((now)=>{
              now.shoppingCartVOList.forEach((sonNow)=>{
                scId.push(sonNow.sc_id)
              })
            })
          }
        }
        let self = this
        self.$ajax({
          method: 'delete',
          url: self.$apiApp + 'shoppingCart/shoppingCart/delete',
          params: {
            scIdArray: scId.join(',')
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          self.$refs['routerView'].getData()
          self.getGoodsNum()
        })
      },
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll( isLock );
      },
      downCallback(){
        this.getUserDat()
        // 动画hack
        this.animateHack()
        // 获取商品数量
        this.getGoodsNum()
        // loading加载
        let s = 300  // 基础秒数
        let math = Math.random() * 500 // 随机秒数
        setTimeout(() => {
          this.loading = false
        }, s + math)
        this.mescroll.resetUpScroll()
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
          if (self.nowTab == 0 && response.data.data.sendNum > 0) {
            self.settlementShow = true
          } else if (self.nowTab==1 && response.data.data.carryNum > 0) {
            self.settlementShow = true
          } else {
            self.settlementShow = false
          }

        })
      },
      tabChange(num) {
        this.nowTab = num
        this.$store.commit('computedPriceChange', 0)
        //this.$store.commit('shoppingCartSelectedChange', [])
        this.$store.commit('allCheckedChange', false)
        if (num === 0) {
          this.$router.push('/shoppingCart/express')
        } else {
          this.$router.push('/shoppingCart/self')
        }

        /* 请求购物车上面数量 */
        this.getGoodsNum()
        /* 关闭整理操作 */
        this.closeArrangement()
      },
      changeType() {
        this.flag = true
        setTimeout(() => {
          this.flag = false
        }, 1000)
      },
      allChecked(e) {
        this.$store.commit('exitAllCheckedChange', true)
        this.$store.commit('allCheckedChange', e)
      },
      // 前往确认订单或弹出商品不足提示
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
        if (data.commList) {
          data = data.commList
        } else {
          data = data
        }
        // this.$store.commit('transferGive', data)
        this.$refs['disableTips'].checkDisableGoods(data)
        console.log(data)

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
    padding-bottom: 1.2rem;
    /*min-height: 100%;*/
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
  .settlement .right .price p{
    text-align: right
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
  /* 整理 */
  .arrangement {
    font-size .3rem
    background-color white
    border solid 1px #eee
    width 1.2rem
    height 1.2rem
    border-radius .6rem
    position fixed
    display flex
    flex-direction column
    align-items center
    justify-content center
    bottom 3rem
    right .5rem
    color #999
  }
  .arrangement img{
    width .6rem
  }
  .arrangementButtons {
    position fixed
    bottom $height-footer
    display flex
    width 100%
    height 1.2rem
    background-color white
    justify-content space-between
    padding 0 .2rem
  }
  .arrangementLeft {
    flex-grow 1
    width 0
    align-items center
    display flex
  }
  .arrangementRight {
    flex-grow 1
    width 0
    align-items center
    display flex
    justify-content space-between
  }
  .arrangementRight div{
    width 2.3rem
    height 1rem
    border-radius .1rem
    display flex
    align-items center
    justify-content center
    color white
  }
  .arrangementRight .delete{
    background-color #F70057
  }
  .arrangementRight .ok{
    background-color #FF8500
  }
  /* 上拉刷新下俩加载 */
  #shoppingCartMescroll {
    /*padding-top: 1.3rem;*/
    top: $height-header;
    bottom: $height-footer;
    height: auto;
  }
</style>
