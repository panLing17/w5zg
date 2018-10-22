<template lang="pug">
  .mescroll#goodsMescroll(v-loading="loadingShow")
    // 导航-------------------------------------------------------------------------------------------
    .headerWrapper(:class="{active: topActive}")
      .text(v-show="topActive") 商品详情
      .back(@click="goBack")
        img(:src="topActive?require('./back3.png'):require('./back@2x.png')")
    // 轮播图-------------------------------------------------------------------------------------------
    .banner(v-if="banner.length")
      slider
        div(v-for="item in banner")
          img(:src="item.gi_img_url | img-filter")
    // 红字说明-------------------------------------------------------------------------------------------
    .descWrapper(@click="$refs.tagDesc.show()")
      ul.type1(v-if="goodsData.carry_type===1")
        li 专柜提货
        li 专柜比价,未省钱,白送
        li 赔付电话4008-947-999
      ul.type2(v-else)
        li 暂仅快递配送
        li 客服电话4008-947-999
    // 商品名称-------------------------------------------------------------------------------------------
    .goodsName {{goodsData.gi_name}}
    div(v-if="goodsData.gi_status==='221'")
      // 价格----------------------------------------------------------------------------------------------
      .priceWrapper
        .real
          .realTag 实付价
          .realIcon ￥
          .realPrice
            ul
              li(v-for="item in $method.arrayPrice(directSupplyPrice)") {{item}}
        .other
          .price1
            span 专柜价:
            span {{counterPrice | price-filter}}
          .price2
            span 用券立减:
            span {{minusPrice | price-filter}}
        .appointmentBtn(v-if="goodsData.carry_type===1", @click="addTry")
          img(src="./xin.png")
          span 预约体验
      // 现金券-------------------------------------------------------------------------------------------------
      .ticketWrapper
        .left 余额:
        .right
          .ticket1
            span 现金券
            span {{userData.netcard_balance | price-filter}}
          .ticket2
            span 通用券
            span {{userData.cash_balance | price-filter}}
      // 规格-----------------------------------------------------------------------------------------------------
      .sizeWrapper(@click="openSelectSizePop")
        .left 规格:
        .right
          .noSize(v-show="!selectionOfSizeData.length") 请选择规格
          .size(v-show="selectionOfSizeData.length")
            ul
              li(v-for="item in selectionOfSizeData")
                .name {{item.name}}
                .value ({{item.value}})
        .arrow
          img(src="./arrow.png")
      // 配送方式选择---------------------------------------------------------------------------------------------
      .distributionWrapper(@click="openSelectSizePop")
        .left 配送:
        .right
          .btn(:class="{active: shippingMethods===0}") 快递配送
          .btn(v-if="goodsData.carry_type===1", :class="{active: shippingMethods===1}") 专柜自提
        .arrow
          img(src="./arrow.png")
      //地址展示---------------------------------------------------------------------------------------------------
      .addressWrapper
        .noAddress(v-show="(shippingMethods===1 && !store.bs_name) || shippingMethods===0") 请选择配送方式
        .address(v-show="shippingMethods===1 && store.bs_name")
          img(src="./address.png")
          span 提货门店:
          span {{store.bs_name}}
    div.noGoodsBtn(v-if="goodsData.gi_status==='222'") 暂不销售
    // 横幅广告---------------------------------------------------------------------------------------------------
    .adWrapper
      img(src="./ad.png")
    // 详情图片---------------------------------------------------------------------------------------------------
    .detailsImgTop
      .left
      .center 商品详情
      .right
    .detailsImgWrapper(ref="detailsImgWrapper", v-html="goodsData.gi_desc")
    .goodsListWrapper
      .title
        img(src="./title@2x.png")
      goods-list(:data="goodsList")
    // 下架提示------------------------------------------------------------------------------------------------------
    .noGoodsText(v-if="goodsData.gi_status==='222'") 该商品已下架
    .toolbarWrapper(v-if="goodsData.gi_status==='222'")
      .left.noGoodsBottom
        .block(@click="goService")
          img(src="./service.png")
          span 客服
        .block(@click="$router.push('/shoppingCart')")
          div
            img(src="./shoppingcart.png")
            .badge(v-if="shoppingCartNum.toString().length<=2 && shoppingCartNum!==0") {{shoppingCartNum}}
            .badge(v-if="shoppingCartNum.toString().length>2 && shoppingCartNum!==0") 99<span>+</span>
          span 购物车
        .block
          img(src="./cc.png")
          span 收藏
      .right
        .two
          div(style="background-color: #FAD3A7") 加入购物车
          div(style="background-color: #ECC0D0") 立即购买
    // 底部按钮------------------------------------------------------------------------------------------------------
    .toolbarWrapper(v-if="goodsData.gi_status==='221'")
      .left
        .block(@click="goService")
          img(src="./service.png")
          span 客服
        .block(@click="goShoppingCart")
          div
            img(src="./shoppingcart.png")
            .badge(v-if="shoppingCartNum.toString().length<=2 && shoppingCartNum!==0") {{shoppingCartNum}}
            .badge(v-if="shoppingCartNum.toString().length>2 && shoppingCartNum!==0") 99<span>+</span>
          span 购物车
        .block(@click="favorite")
          img(:src="isFavorite.flag==='Y'?require('./collection_yes.png'):require('./collection_no.png')")
          span {{isFavorite.flag==='Y'?'已收藏':'收藏'}}
      .right
        .two(v-show="bottomBtnType===0")
          div(@click="add") 加入购物车
          div(@click="buy") 立即购买
        .one(v-show="bottomBtnType===1")
          div(@click="saveReachGoods") 到货通知
    // 加入购物车特效---------------------------------------------------------------------------------
    transition(name="scale")
      .circle(v-show="showCircle")
    // 标签说明-----------------------------------------------------------------------------------------------------
    tag-desc(ref="tagDesc")
    // 规格选择-----------------------------------------------------------------------------------------------------
    select-size(
                ref="selectSize",
                :imgUrl="goodsData.gi_image_url",
                :price="goodsData.min_direct_supply_price",
                :specGroup="goodsData.spec_group",
                :spuId="spuId",
                :carryType="goodsData.carry_type",
                :fromType="fromType",
                :store="store",
                :brandId="goodsData.bi_id",
                @selection-size="selectionOfSize",
                @shipping-change="shippingMethodsChange",
                @save-goods="saveReachGoods",
                @try-show="$refs.addTryPop.show()",
                @open-pop="openPop",
                @count="getCount",
                @submit-goods="submitGoods",
                @change-bottom-btn="changeBottomBtn",
                @change-spec="changeSpec"
                )
    // 预约体验-------------------------------------------------------------------------------------------------------------
    add-try(ref="addTryPop", :data="storeList", :spuId="spuId")
    // 自提门店地址----------------------------------------------------------------------------------------------------------
    select-store(ref="selectStore", :data="storeList", @store-select="storeSelect")
</template>

<script>
  // 轮播
  import Slider from 'components/slider'
  // 商品列表
  import GoodsList from 'components/goodsList'
  // 标签说明
  import TagDesc from './tagDesc'
  // 规格
  import SelectSize from './selectSize'
  // 城市选择
  import SelectCity from './selectCity'
  // 配送地址选择
  import Express from './express'
  // 预约体验
  import AddTry from './addTry'
  // 自提门店
  import SelectStore from './selectStore'
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    name: "goodsDetails",
    data () {
      return {
        loadingShow: true,
        topActive: false, // 头部导航标志，下滑时改变
        banner: [], // 轮播图
        spuId: '',
        goodsData: {}, // 商品详情数据
        goodsList: [], // 推荐商品列表
        isFavorite: {}, // 是否收藏过
        selectionOfSizeData: [], // 选中的规格
        cityData: {}, // 选择城市后的数据
        shippingMethods: 0, // 配送方式，0为快递 1为自提
        skuData: {}, // sku信息
        minusPrice: 0, // 用券立减
        fromType: 0, // 打开规格弹框的按钮类型， 0 不处理 1 表示加入购物车 3 立即购买按钮，规格页需显示确认按钮 2 表示预约体验按钮
        bottomBtnType: 0, // 底部按钮类型 0 显示购物车、立即购买 1 显示到货通知
        storeList: [], // 门店合集
        store: {}, // 选中的门店信息
        count: 1, // 商品数量
        showCircle: false, // 是否显示加入购物车动效
      }
    },
    beforeRouteUpdate(to,from,next) {
      this.$refs.selectSize.refreshData()
      this.$refs.addTryPop.refreshData()
      this.$refs.selectStore.refreshData()
      Object.assign(this.$data, this.$options.data())
      this.spuId = Number(to.query.id)
      this.getDetailsData()
      this.queryFavorite()
      this.getGoodsNum()
      this.updateClickCount()
      next()
    },
    created() {
      this.spuId = Number(this.$route.query.id)
      this.getDetailsData()
      this.queryFavorite()
      this.getGoodsNum()
      this.updateClickCount()
    },
    mounted() {
      this.$mescrollInt("goodsMescroll", this.upCallback, () => {}, (obj) => {
        if (obj.preScrollY>60) {
          this.topActive = true
        } else {
          this.topActive = false
        }
      })
    },
    computed: {
      ...mapGetters(['userData', 'shoppingCartGoodsNum', 'informGoods']),
      // 实付价
      directSupplyPrice() {
        return this.skuData.direct_supply_price ? this.skuData.direct_supply_price : this.goodsData.min_direct_supply_price
      },
      // 专柜价
      counterPrice() {
        return this.skuData.counter_price ? this.skuData.counter_price : this.goodsData.min_counter_price
      },
      shoppingCartNum() {
        return this.shoppingCartGoodsNum.sendNum+this.shoppingCartGoodsNum.carryNum
      }
    },
    methods: {
      // 点击量更新
      updateClickCount() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'goods/sku/updateSpuClickNum',
          params:{
            spuId: self.$route.query.id
          }
        }).then(function (res) {
        })
      },
      // 将按钮置为到货通知
      changeBottomBtn() {
        this.bottomBtnType = 1
      },
      // 根据spuid获取详情内容
      getDetailsData() {
        if (!this.spuId) {
          return
        }
        let self =this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'gcdetails/spu/detail',
          params: {
            gspuId: this.spuId
          }
        }).then(function(res){
          if (res) {
            self.specFormat(res.data.data)
            self.goodsData = res.data.data
            self.banner = res.data.data.spu_banner
            self.minusPrice = self.goodsData.min_counter_price - self.goodsData.min_direct_supply_price
            self.$nextTick(()=>{
              // 如果规格默认选中调sku接口
              if(self.goodsData.spec_group.length===1 && self.goodsData.spec_group[0].checked>-1) {
                self.$refs.selectSize.getSku()
              }
              if (self.informGoods) {
                self.setInformGoods(null)
                self.$refs.selectSize.getSku()
              }
            })
            self.shareGoods()
            self.loadingShow = false
          }
        })
      },
      // 规格格式化
      specFormat(data) {
        if (data.spec_group && data.spec_group.length) {
          data.spec_group.forEach((item, index) => {
            item.checked = -1
            item.spec_value = item.spec_value.split(',')


            // 判断是否是从到货通知过来，如果是需把规格选中
            if (this.informGoods) {
              item.spec_value.forEach((goods, i) => {
                if (goods === this.informGoods['spec_value'+(index+1)]) {
                  item.checked = i
                  this.selectionOfSizeData.push({
                    name: item.spec_name,
                    value: goods
                  })
                }
              })
            } else
              if (data.spec_group.length===1 && data.spec_group[0].spec_value.length===1) { // 如果只有一个规格默认选中
              item.checked = 0
            }
          })
        }
      },
      // 选择规格后返回
      selectionOfSize(data) {
        this.skuData = data
        // 选中的规格显示用
        this.selectionOfSizeData = data.selectionSize
        // 获取用券立减价格
        this.getEconomyPrice()
        // 判断库存切换底部按钮显示
        this.bottomBtnType = data.storage_num===0 ? 1 : 0
        // 若有门店则放入集合中
        if (data.refStoreList) {
          this.storeList = data.refStoreList
        }
      },
      // 如果是没有规格则返回选中的规格
      changeSpec(data) {
        this.selectionOfSizeData = data
      },
      // 获取将要加入购物车或购买的数量
      getCount(count) {
        this.count = count
      },
      // 查询是否收藏过
      queryFavorite() {
        if (!localStorage.getItem('token') || !this.spuId) {
          return
        }
        let self =this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'gcdetails/queryFavorite',
          params: {
            gspuId: this.spuId
          }
        }).then(function(res){
          if (res) {
            self.isFavorite = res.data.data
          }
        })
      },
      // 收藏按钮点击
      favorite() {
        if (!localStorage.getItem('token')) {
          this.$notify({
            content: '请先登录！',
            bottom: 1.8
          })
          this.$router.push('/login')
          return
        }
        let params, url
        if (this.isFavorite.flag==='Y') {
          params = {
            fiId: this.isFavorite.fiId
          }
          url = 'gcdetails/cancelFavorite'
        } else {
          params = {
            gspuId: this.spuId
          }
          url = 'gcdetails/saveGcFavorite'
        }
        let self =this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + url,
          params: params
        }).then(function(res){
          if (res) {
            if (self.isFavorite.flag==='Y') {
              self.$notify({
                content: '取消收藏成功',
                bottom: 1.8
              })
              self.$set(self.isFavorite, 'flag', 'N')
            } else {
              self.$notify({
                content: '收藏成功',
                bottom: 1.8
              })
              self.isFavorite = {
                fiId: res.data.data.fiId,
                flag: 'Y'
              }
            }
          }
        })
      },
      // 配送地址切换
      addressChange(item) {
        this.address = {
          text: item.province_name + item.city_name + item.county_name + item.ra_detailed_addr,
          province: item.ra_province,
          city: item.ra_city
        }
      },
      // 配送方式切换
      shippingMethodsChange(flag) {
        this.shippingMethods = flag
        // 如果是自提并且之前没选择过则弹出门店地址弹框
        if (flag===1 && !this.store.bs_id) {
          this.$refs.selectStore.show()
        }
      },
      // 打开地址选择弹框或者门店地址弹框
      openPop(flag) {
        if (flag===0) {
          this.$refs.express.show()
        } else {
          this.$refs.selectStore.show()
        }
      },
      // 根据skuId获取用券立减
      getEconomyPrice() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'goods/sku/'+this.skuData.gsku_id+'/economyPrice',
          params: {
            skuId: this.skuData.gsku_id
          }
        }).then(function (res) {
          if (res) {
            self.minusPrice = res.data.data.useCardEconomyPrice
          }
        })
      },
      // 获取购物车数量
      getGoodsNum() {
        if (!localStorage.getItem('token')) {
          return
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'shoppingCart/v2/countCartNum',
          params: {},
        }).then(function (res) {
          if (res) {
            self.setShoppingCartCount({
              sendNum: res.data.data.sendNum,
              carryNum: res.data.data.carryNum
            })
          }
        })
      },
      // 正常打开规格选择弹框
      openSelectSizePop() {
        this.fromType = 0
        this.$refs.selectSize.show()
      },
      // 加入购物车按钮点击
      add() {
        this.fromType = 1
        this.btnCommon()
      },
      // 加入购物车接口
      addShoppingCart(callback) {
        this.showCircle = true
        setTimeout(()=>{
          this.showCircle = false
        }, 0)

        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/v2/shoppingCart/add',
          params: {
            gskuId: this.skuData.gsku_id,
            deliveryWays: this.shippingMethods===0?167:168, // 167为快递 168为自提
            storeId: this.store.bs_id,
            goodsNum: this.count
          },
        }).then(function (res) {
          if (res) {
            self.$notify({
              content: '加入购物车成功',
              bottom: 1.8
            })
            self.getGoodsNum()
            callback && callback()
          }
        })
      },
      // 立即购买按钮点击
      buy() {
        this.fromType = 3
        this.btnCommon()
      },
      // 立即购买存数据
      saveBuyData() {

        if (this.shippingMethods===1) {
          this.skuData.bsId = this.store.bs_id
          this.skuData.gsId = this.store.gs_id
          this.skuData.bsName = this.store.bs_name
        }
        this.skuData.shippingMethods = this.shippingMethods
        this.skuData.from = 0
        this.skuData.goodsCount = this.count
        this.setConfirmData(this.skuData)
        this.$router.push('/orderConfirm')
      },
      // 点击加入购物车和立即购买按钮共同的逻辑
      btnCommon(callback) {
        if (!localStorage.getItem('token')) {
          this.$notify({
            content: '请先登录',
            bottom: 1.8
          })
          this.$router.push('/login')
          return
        }
        this.$refs.selectSize.show()

        callback && callback()
      },
      // 点击到货通知按钮
      saveReachGoods() {
        if (!localStorage.getItem('token')) {
          this.$notify({
            content: '请先登录',
            bottom: 1.8
          })
          this.$router.push('/login')
          return
        }
        let params
        if (this.skuData.gsku_id) {
          params = {
            gsku_id: this.skuData.gsku_id
          }
        } else {
          let str = ''
          this.goodsData.spec_group.forEach(item => {
            str = str + item.spec_name+','+ item.spec_value[item.checked]+','
          })
          str = str.substring(0, str.length-1)
          params = {
            gspu_id: this.spuId,
            spec: str
          }
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'ucMessage/v2/saveReachGoodsMessageInfo',
          params: params
        }).then(function (res) {
          if (res) {
            self.$notify({
              content: '如果30天内到货,会通过系统消息提醒您',
              bottom: 1.8
            })
          }
        })
      },
      // 点击预约体验按钮
      addTry() {
        if (!localStorage.getItem('token')) {
          this.$notify({
            content: '请先登录',
            bottom: 1.8
          })
          this.$router.push('/login')
          return
        }
        if (!this.skuData.gsku_id) {
          this.fromType = 2
          this.$refs.selectSize.show()
        } else {
          this.$refs.addTryPop.show()
        }
      },
      // 门店选择回调
      storeSelect(item) {
        this.store = item
      },
      // 规格弹框点击确定按钮回调
      submitGoods(flag) {
        this.$refs.selectSize.hide()
        if (flag===2) {
          this.addShoppingCart()
        } else if(flag===4) {
          this.saveBuyData()
        }
      },
      goShoppingCart() {
        if (this.shippingMethods===0) {
          this.$router.push('/shoppingCart/express')
        } else {
          this.$router.push('/shoppingCart/self')
        }

      },
      // 前往客服
      goService () {
        let goodsData = {
          show : 1, // 1为打开， 其他参数为隐藏（包括非零元素）
          title : this.goodsData.gi_name,
          desc : '',
          picture : this.$method.imgUrlFilter(this.goodsData.gi_image_url),
          note : '备注',
          url : window.location.href.replace(/#/, "?#")
        }
        this.$store.commit('getNowGoodsData',  goodsData)
        this.$router.push('/service')
      },
      // 分享
      shareGoods () {
        this.$initShare({
          sharePhoto: this.$method.imgUrlFilter(this.goodsData.gi_image_url),
          shareTitle: this.goodsData.gi_name,
          shareDesc: '我发现了个宝贝,跟专卖店比贼便宜',
          handleSuccess: () => {
            let self = this
            if (localStorage.hasOwnProperty('token') && localStorage.getItem('member_type') === '091') {
              self.$ajax({
                method: 'get',
                url: self.$apiTransaction + 'netcardrule/share/present',
                params: {}
              }).then(function (response) {
                if (response.data.optSuc) {
                  self.$ajax({
                    method: 'get',
                    url: response.data.data,
                    params: {}
                  }).then(function (res) {
                    if (res.data.optSuc) {
                      self.$shareSuccess({ticketMoney: res.data.data})
                    }
                  })
                }
              })
            }
          }
        })
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
      },
      // 后退
      goBack () {
        if (window.history.length>1) {
          this.$router.go(-1)
        } else {
          this.$router.push('/home')
        }
      },
      ...mapMutations({
        setConfirmData: 'setConfirmData',
        setShoppingCartCount: 'shoppingCartGoodsNumChange',
        setInformGoods: 'setInformGoods'
      })
    },
    components: {
      Slider,
      GoodsList,
      TagDesc,
      SelectSize,
      SelectCity,
      Express,
      AddTry,
      SelectStore
    }
  }
</script>

<style scoped lang="stylus">
  img {
   pointer-events none
  }
  .mescroll {
    position fixed
    top 0
    bottom 0
    left 0
    height auto
    background-color #fff
  }

  .headerWrapper {
    display flex
    position fixed
    width 100%
    top 0
    left 0
    z-index 10
    &.active {
      background-color #fff
      border-bottom 1px solid #d7d7d7
      .text {
        width 100%
        text-align center
        line-height 1.32rem
        color #333
        font-size .48rem
      }
    }
    .back {
      font-size 0
      padding .26rem .4rem
      position absolute
      top 0
      left 0
      img {
        width .8rem
      }
    }
  }

  .banner {
    height 10rem
    overflow hidden
    position relative
  }
  .descWrapper {
    font-size .266rem
    .type1 {
      color #f70057
      li {
        background-color #ffe8f0
      }
    }
    .type1, .type2 {
      display flex
      padding .4rem 0 .213rem .4rem
      li {
        line-height .4rem
        margin-right .133rem
        padding 0 .08rem
        border-radius .213rem
        &:last-child {
          padding 0
          margin-right 0
          background-color #fff
        }
      }
    }
    .type2 {
      color rgb(246,122,77)
      li {
        background-color rgb(255,239,232)
      }
    }
  }
  .goodsName {
    font-size .37rem
    color #333
    font-weight 400
    line-height .53rem
    padding 0 .4rem
    word-break break-all
    text-align justify
  }
  .priceWrapper {
    margin-top .16rem
    padding 0 .4rem .26rem
    border-bottom 1px solid #d7d7d7
    position relative
    .real {
      display flex
      align-items flex-end
      .realTag {
        width 1.12rem
        height .4rem
        line-height .4rem
        background-color #333
        color #fff
        font-size .293rem
        text-align center
      }
      .realIcon {
        color #f70057
        font-size .32rem
        line-height 1
        margin-left .16rem
      }
      .realPrice {
        ul {
          display flex
          align-items flex-end
          li {
            color #f70057
            font-size .693rem
            font-weight 400
            line-height .8
            &:nth-child(2) {
              font-size .426rem
            }
          }
        }
      }
    }
    .other {
      display flex
      margin-top .4rem
      font-weight 400
      .price1, .price2 {
        span:nth-child(1) {
          font-size .293rem
        }
        span:nth-child(2) {
          font-size .32rem
        }
      }
      .price1 {
        color #333
      }
      .price2 {
        margin-left .4rem
        color #f70057
      }
    }
    .appointmentBtn {
      width 2.13rem
      height .693rem
      display flex
      align-items center
      justify-content center
      border-radius .346rem
      border 1px solid #f70057
      position absolute
      right .4rem
      bottom .16rem
      img {
        width .346rem
      }
      span {
        margin-left .1rem
        color #f70057
        font-size .32rem
      }
    }
  }
  .ticketWrapper {
    height .96rem
    display flex
    align-items center
    padding 0 .4rem
    box-sizing content-box
    border-bottom .26rem solid #f2f2f2
    .left {
      font-size .346rem
      font-weight 400
      color #888
    }
    .right {
      display flex
      margin-left .2rem
      .ticket1, .ticket2 {
        span {
          font-size .346rem
          font-weight 400
          &:nth-child(1) {
            color #333
          }
          &:nth-child(2) {
            color #f70057
          }
        }
      }
      .ticket2 {
        margin-left .53rem
      }
    }
  }
  .sizeWrapper {
    height .93rem
    display flex
    align-items center
    padding 0 .4rem
    justify-content space-between
    position relative
    border-bottom 1px solid #d7d7d7
    min-width 0
    .left, .noSize {
      color #888
      font-weight 400
      font-size .346rem
    }
    .right {
      margin-left .2rem
      flex 1
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
      .size {
        ul {
          display flex
          li {
            display flex
            line-height 1
            margin-right .2rem
            &:last-child {
              margin-right 0
            }
            .name {
              color #333
              font-size .37rem
            }
            .value {
              color #888
              font-size .32rem
            }
          }
        }
      }
    }
    .arrow {
      img {
        width .586rem
      }
    }
  }
  .distributionWrapper {
    display flex
    align-items center
    padding-left .4rem
    position relative
    margin-top .26rem
    .left {
      color #888
      font-weight 400
      font-size .346rem
    }
    .right {
      display flex
      margin-left .2rem
      .btn {
        width 1.76rem
        height .586rem
        border 1px solid #666
        border-radius .133rem
        line-height .586rem
        text-align center
        font-size .32rem
        font-weight 400
        color #333
        &:nth-child(2) {
          margin-left .26rem
        }
        &.active {
          border-color #f70057
          color #f70057
        }
      }
    }
    .arrow {
      position absolute
      right .32rem
      top 0
      img {
        width .586rem
      }
    }
  }
  .addressWrapper {
    margin-top .26rem
    padding 0 .4rem
    .noAddress {
      color #9b9b9b
      font-size .32rem
      font-weight 400
    }
    .address {
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      img {
        width .32rem
      }
      span {
        color #9b9b9b
        font-weight 400
        font-size .32rem
        margin-left .13rem
      }
    }
  }
  .adWrapper {
    font-size 0
    margin-top .21rem
    img {
      width 100%
    }
  }
  .detailsImgTop {
    display flex
    align-items center
    justify-content center
    height .96rem
    background-color #f2f2f2
    .left, .right{
      width 1.5rem
      height 1px
      background-color #ccc
    }
    .center {
      font-size .37rem
      color #666
      font-weight 400
      margin 0 .3rem 0 .3rem
    }
  }
  .detailsImgWrapper {
    font-size 0
  }
  .goodsListWrapper {
    background-color #f2f2f2
    .title {
      font-size 0
      height 1rem
      display flex
      align-items center
      justify-content center
      img {
        width 4.96rem
      }
    }
  }
  .toolbarWrapper {
    position fixed
    bottom 0
    left 0
    width 100%
    height 1.33rem
    display flex
    border-top 1px solid #d7d7d7
    .left {
      flex 1
      display flex
      background-color #fff
      &.noGoodsBottom .block span {
        color #aaa
      }
      .block {
        flex 1
        display flex
        flex-direction column
        justify-content center
        align-items center
        font-size 0
        border-right 1px solid #d7d7d7
        &:last-child {
          border none
        }
        div {
          position relative
          .badge {
            position absolute
            left .3rem
            top -.05rem
            height .4rem
            line-height .4rem
            padding 0 .1rem
            border-radius .4rem
            border 1px solid #f70057
            color #f70057
            font-size .26rem
            background-color #fff
            span {
              color #f70057
            }
          }
        }
        img {
          width .64rem
        }
        span {
          color #666
          font-size .26rem
          margin-top .08rem
          line-height 1
        }
      }
    }
    .right {
      width 53%
      flex none
      .two {
        display flex
        div {
          flex 1
          line-height 1.33rem
          text-align center
          color #fff
          font-size .4rem
          &:nth-child(1) {
            background-color #ff8500
          }
          &:nth-child(2) {
            background-color #f70057
          }
        }
      }
      .one {
        display flex
        div {
          flex 1
          line-height 1.33rem
          text-align center
          color #fff
          font-size .4rem
          background-color #9D4AAD
        }
      }
    }
  }
  .circle {
    position: fixed;
    top: 8.64rem;
    right: 0;
    width: .53rem;
    height: .53rem;
    background-color: #f70057;
    border-radius: 50%;
    overflow: hidden;
  }
  .circle img {
    width: 100%;
  }
  .circle.scale-leave-active {
    transition: all 1s;
  }
  .circle.scale-leave-to {
    transform: translate3d(-6.8rem,6.8rem, 0);
    opacity: 0;
  }
  .noGoodsBtn {
    width 2.6rem
    height .74rem
    line-height .74rem
    text-align center
    border 1px solid #f70057
    border-radius .05rem
    color #f70057
    font-size .42rem
    font-weight 500
    margin .26rem 0 0 .4rem
  }
  .noGoodsText {
    width 100%
    height 1.17rem
    line-height 1.17rem
    text-align center
    background-color rgba(0,0,0,.7)
    position fixed
    bottom 1.33rem
    color #fff
    font-size .42rem
    font-weight 400
  }
</style>
<style>
  .detailsImgWrapper img {
    width: 100%;
  }
</style>
