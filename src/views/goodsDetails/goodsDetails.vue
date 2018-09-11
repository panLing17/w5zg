<template lang="pug">
  .mescroll#goodsMescroll
    // 导航-------------------------------------------------------------------------------------------
    .headerWrapper
      .back(@click="goBack")
        img(src="./back@2x.png")
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
      .noAddress 请选择配送方式
      .address
        img(src="./address.png")
        span 配送至:
        span 南京市玄武区玄武区玄武区玄武大道道699-22号地方带你飞豆腐脑地
      .address
        img(src="./address.png")
        span 提货门店:
        span
    // 横幅广告---------------------------------------------------------------------------------------------------
    .adWrapper
      img(src="./ad.png")
    // 详情图片---------------------------------------------------------------------------------------------------
    .detailsImgWrapper(ref="detailsImgWrapper", v-html="goodsData.gi_desc")
    .goodsListWrapper
      .title
        img(src="./title@2x.png")
      goods-list(:data="goodsList")
    // 底部按钮------------------------------------------------------------------------------------------------------
    .toolbarWrapper
      .left
        .block
          img(src="./service.png")
          span 客服
        .block
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
                :address="addressShow",
                :fromType="fromType",
                @selection-size="selectionOfSize",
                @show-address="$refs.express.show()",
                @shipping-change="shippingMethodsChange",
                @save-goods="saveReachGoods",
                @try-show="$refs.addTryPop.show()"
                )
    // 配送地址选择---------------------------------------------------------------------------------------------------------
    express(ref="express", :address="address", @address-change="addressChange", @select-city="$refs.selectCity.show()")
    // 城市选择-------------------------------------------------------------------------------------------------------------
    select-city(ref="selectCity", @city-change="cityChage")
    // 预约体验-------------------------------------------------------------------------------------------------------------
    add-try(ref="addTryPop")
    // 自提门店地址----------------------------------------------------------------------------------------------------------
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
  import {mapGetters} from 'vuex'
  export default {
    name: "goodsDetails",
    data () {
      return {
        banner: [], // 轮播图
        spuId: '',
        goodsData: {}, // 商品详情数据
        goodsList: [], // 推荐商品列表
        isFavorite: {}, // 是否收藏过
        selectionOfSizeData: [], // 选中的规格
        address: [], //地址合集,
        addressShow: '', //页面上地址显示
        cityData: {}, // 选择城市后的数据
        shippingMethods: 0, // 配送方式，0为快递 1为自提
        skuData: {}, // sku信息
        minusPrice: 0, // 用券立减
        shoppingCartNum: 0, //购物车数量
        fromType: 0, // 打开规格弹框的按钮类型， 0 不处理 1 表示加入购物车或立即购买按钮，规格页需显示确认按钮 2 表示预约体验按钮
        bottomBtnType: 0, // 底部按钮类型 0 显示购物车、立即购买 1 显示到货通知
      }
    },
    created() {
      this.getDetailsData()
      this.queryFavorite()
      this.getAddress()
      this.getGoodsNum()
    },
    updated() {
      // 解决v-html的内容css没有效果
      let len = this.$refs.detailsImgWrapper.children.length
      if (len > 0) {
        for (let i=0;i<len; i++) {
          this.$refs.detailsImgWrapper.children[i].style.width = '100%'
        }
      }
    },
    mounted() {
      this.$mescrollInt("goodsMescroll", this.upCallback, () => {}, () => {})
    },
    computed: {
      ...mapGetters(['userData']),
      // 实付价
      directSupplyPrice() {
        return this.skuData.direct_supply_price ? this.skuData.direct_supply_price : this.goodsData.min_direct_supply_price
      },
      // 专柜价
      counterPrice() {
        return this.skuData.counter_price ? this.skuData.counter_price : this.goodsData.min_counter_price
      }
    },
    methods: {
      // 根据spuid获取详情内容
      getDetailsData() {
        this.spuId = this.$route.query.id
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
          }
        })
      },
      // 规格格式化
      specFormat(data) {
        if (data.spec_group && data.spec_group.length) {
          data.spec_group.forEach(item => {
            item.checked = -1
            item.spec_value = item.spec_value.split(',')
          })
        }
      },
      // 选择规格后返回
      selectionOfSize(data) {
        this.skuData = data
        this.selectionOfSizeData = data.selectionSize
        // 获取用券立减价格
        this.getEconomyPrice()
        // 判断库存切换底部按钮显示
        this.bottomBtnType = data.storage_num===0 ? 1 : 0
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
          url = 'gcFavoritesInfo/cancelFavorite'
        } else {
          params = {
            gspuId: this.spuId
          }
          url = 'gcFavoritesInfo/saveGcFavorite'
        }
        let self =this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + url,
          params: params
        }).then(function(res){
          if (res) {
            if (self.isFavorite.flag==='Y') {
              self.$set(self.isFavorite, 'flag', 'N')
            } else {
              self.isFavorite = {
                fiId: res.data.data.fiId,
                flag: 'Y'
              }
            }
          }
        })
      },
      // 获取用户所有地址
      getAddress() {
        if (!localStorage.getItem('token')) {
          return
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'receivingAddress/addresses',
          params: {},
        }).then(function (response) {
          if(response) {
            self.address = response.data.data
            self.address.forEach(item => {
              if (item.ra_default==='011') {
                self.addressShow = item.province_name + item.city_name + item.county_name + item.ra_detailed_addr
                return false
              }
            })
          }
        })
      },
      // 配送地址切换
      addressChange(item) {
        this.addressShow = item.province_name + item.city_name + item.county_name + item.ra_detailed_addr
      },
      // 城市选择切换
      cityChage(data) {
        this.cityData = data
        this.addressShow = data.province.pro_name + data.city.city_name
      },
      // 配送方式切换
      shippingMethodsChange(flag) {
        this.shippingMethods = flag
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
          url: self.$apiApp + 'shoppingCart/countCartNum',
          params: {},
        }).then(function (res) {
          if (res) {
            self.shoppingCartNum = res.data.data.carryNum + res.data.data.sendNum
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
        this.btnCommon()
      },
      // 立即购买按钮点击
      buy() {
        this.btnCommon()
      },
      // 点击加入购物车和立即购买按钮共同的逻辑
      btnCommon() {
        if (!localStorage.getItem('token')) {
          this.$notify({
            content: '请先登录',
            bottom: 1.8
          })
          this.$router.push('/login')
          return
        }
        this.fromType = 1
        this.$refs.selectSize.show()
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
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'ucMessage/saveReachGoodsMessageInfo',
          params: {
            gsku_id: this.skuData.gsku_id
          }
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
        if (!this.skuData.gsku_id) {
          this.fromType = 2
          this.$refs.selectSize.show()
        }
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
            page: pageNum
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
      }
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
  }

  .headerWrapper {
    display flex
    position fixed
    width 100%
    top 0
    left 0
    z-index 10
    .back {
     font-size 0
     padding .26rem .4rem
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
      color #ff0057
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
        color #ff0057
        font-size .32rem
        line-height 1
        margin-left .16rem
      }
      .realPrice {
        ul {
          display flex
          align-items flex-end
          li {
            color #ff0057
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
        color #ff0057
      }
    }
    .appointmentBtn {
      width 2.13rem
      height .693rem
      display flex
      align-items center
      justify-content center
      border-radius .346rem
      border 1px solid #ff0057
      position absolute
      right .4rem
      bottom .16rem
      img {
        width .346rem
      }
      span {
        margin-left .1rem
        color #ff0057
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
            color #ff0057
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
          border-color #ff0057
          color #ff0057
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
  .detailsImgWrapper {
    font-size 0
    img {
      width 100%
    }
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
            border 1px solid #ff0057
            color #ff0057
            font-size .26rem
            background-color #fff
            span {
              color #ff0057
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
            background-color #ff0057
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
          background-color #ff0057
        }
      }
    }
  }
</style>
