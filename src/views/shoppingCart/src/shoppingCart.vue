<template lang="pug">
  .shoppingCartBox.mescroll#shoppingCartMescroll
    nav-bar(background="white")
      .topLeft(slot="left")
        .sanjiao
        span {{location.city.name}}
      .topCenter(slot="center") 购物车
      .topRight(slot="right")
    .cartTypeTab
      ul
        li(@click="tabChange(0)", :class="{tabChecked:nowTab===0}")
          p 门店自提
          span(class="animated", :class="{rubberBand:flag}") {{shoppingCartGoodsNum.carryNum}}
        li(@click="tabChange(1)", :class="{tabChecked:nowTab===1}")
          p 快递配送
          span(class="animated", :class="{swing:flag}") {{shoppingCartGoodsNum.sendNum}}
      p(:style="{left:nowTab*50+'%'}")
    .content(v-loading="loading")
      transition(name="fade", mode="out-in")
        router-view(style="min-height:calc(100vh - 6rem)")
      .title
        .line
        p 推荐
      w-recommend(:listData="recommendGoods", background="white")
      .settlement
        .left
          w-checkbox(v-model="shoppingCartAllChecked", @change="allChecked")
          p 全选
        .right
          .prive 合计：{{computedPrice | price-filter}}
          .button(@click="goConfirmOrder") 结算({{shoppingCartSelected.length}})
</template>

<script>
  import goodsCard from './goodsCard'
  import disableGoods from './disableGoods'
  import citySelect from './citySelect'
  import {mapState} from 'vuex'
  export default {
    name: 'home',
    data () {
      return {
        flag: false,
        loading: true,
        isdefault: false,
        nowTab: 0,
        recommendGoods: [
          {
            image: ''
          },
          {
            image: ''
          },
          {
            image: ''
          },
          {
            image: ''
          }
        ]
      }
    },
    components:{goodsCard, disableGoods, citySelect},
    computed: mapState(['shoppingCartGoodsNum','computedPrice','shoppingCartAllChecked','shoppingCartSelected', 'location']),
    mounted () {
      // mescroll初始化
      this.$mescrollInt("shoppingCartMescroll",this.upCallback);
      if (this.$route.path === '/shoppingCart') {
        this.nowTab = 0
      } else {
        this.nowTab = 1
      }
      // 获取商品数量
      this.getGoodsNum()
      // loading加载
      let s = 500  // 基础秒数
      let math = Math.random() * 1000 // 随机秒数
      setTimeout(()=>{
        this.loading = false
      },s+math)
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods: {
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          if(page.num === 1) self.recommendGoods = []
          self.recommendGoods = self.recommendGoods.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
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
          url:self.$apiGoods +  'goodsSearch/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          successCallback&&successCallback(response.data.data);//成功回调
        })
      },
      getGoodsNum () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/countCartNum',
          params: {},
        }).then(function (response) {
          self.$store.commit('shoppingCartGoodsNumChange',response.data.data)
        })
      },
      tabChange (num) {
        this.nowTab = num
        this.$store.commit('computedPriceChange', 0)
        this.$store.commit('shoppingCartSelectedChange', [])
        this.$store.commit('allCheckedChange', false)
        if (num === 1) {
          this.$router.push('/shoppingCart/express')
        } else {
          this.$router.push('/shoppingCart')
        }
      },
      changeType () {
        this.flag = true
        setTimeout(()=>{
          this.flag = false
        },1000)
      },
      allChecked (e) {
        this.$store.commit('allCheckedChange',e)
      },
      // 前往确认订单
      goConfirmOrder () {
        let data= []
        this.$store.state.shoppingCartSelected.forEach((now)=>{
          let spec = []
          now.specVOList.forEach((n)=>{
            spec.push(n.gspec_value)
          })
          data.push({
            number: now.goods_num,
            spec: spec,
            price: now.now_price,
            goodsName: now.gi_name,
            storeName: now.store_name,
            photo: now.logo,
            cartId: now.sc_id,
            storeLocation: {
              pro: {
                name: now.pro_Name,
                id: now.province
              },
              city: {
                name: now.city_name,
                id: now.city
              },
              store: {
                name: now.store_name,
                id: now.store_id
              }
            }
          })
        })
        this.$store.commit('transferGive',data)
        let since = ''
        this.$route.path === '/shoppingCart' ? since = 'true' : since = 'false'
        console.log(this.$store.state.transfer)
        this.$router.push({path: '/confirmOrder', query: {since: since, type: 'shoppingCart'}})
      }
    }
  }
</script>

<style scoped>
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
  /*  */
  .shoppingCartBox {
    background-color: rgb(242,242,242);
    padding-bottom: 3rem;
    min-height: 100vh;
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
  .cartTypeTab ul{
    display: flex;
    height: 1rem;
    justify-content: space-between;
  }
  .cartTypeTab li{
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: color .4s;
  }
  .cartTypeTab li span{
    margin-left: .1rem;
    padding: 0 .15rem;
    border-radius: .2rem;
    color: white;
    background-color: rgb(51,51,51);
    transition: background-color .4s;
  }
  .cartTypeTab>p{
    width: 50%;
    height: 2px;
    background-color: rgb(244,0,84);
    position: absolute;
    bottom: 0;
    transition: left .5s;
  }
  .tabChecked {
    color: rgb(244,0,84);
  }
  .tabChecked span{
    background-color: rgb(244,0,84) !important;
  }
  /* 内容区域 */
  .content {
    min-height: calc(100vh - 4rem);
    position: relative;
  }
  /* 华丽的分割线 */
  .title{
    height: .8rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
  }
  .line{
    height: 1px;
    width: 3rem;
    background: #999;
  }
  .title p{
    position: absolute;
    background: #f2f2f2 ;
    padding: 0 .2rem;
  }
  /* 提交部分 */
  .settlement {
    display: flex;
    justify-content: space-between;
    height: 1.2rem;
    width: 100%;
    background-color: white;
    position: fixed;
    bottom: 1.5rem;
  }
  .settlement .left{
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
  .settlement .right .button {
    width: 3rem;
    height: 100%;
    font-size: .3rem;
    margin-left: .2rem;
    color: white;
    background: rgb(244,0,84);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* 上拉刷新下俩加载 */
  #shoppingCartMescroll {
    top: 0;
    bottom: 0;
    height: auto;
    position: fixed;
  }
</style>
