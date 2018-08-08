<template lang="pug">
  div
    nav-bar(background="rgba(0,0,0,.1)", height="0", border-bottom="none")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@3x.png", style="width:.8rem", @click="goBack()")
      .topCenter(slot="center")
      .topRight(slot="right")
        //img(src="../../../assets/img/toshoppingcart@3x.png", style="width:.8rem", @click="$router.push('/shoppingCart')")
        // img(src="../../../assets/img/share@3x.png", style="width:.5rem", @click="selectShare = true")
    .goodsBox.mescroll#goodsDetailMescroll
      .banner
        carousel(:indicators="true", :auto="5000", v-if="banner.length > 0", :responsive="0", style="height:10rem")
          div(v-for="tag in banner", style="width:100%" , @click="goActivity(tag.link,tag.linkType)")
            img(:src="tag.gi_img_url | img-filter" , style="width:100%;height:10rem")
      .goodsInfo
        .tags <span class="tag" @click="tips(0)" v-if="goodsData.carry_type===1">专柜提货(体验)</span><span class="tag" @click="tips(0)" v-else>暂仅快递配送</span><span class="tag" @click="tips(1)" v-if="goodsData.carry_type===1">专柜比价,未省钱,白送</span><span class="tag" @click="tips(2)">赔付电话4008-947-999</span>
        .goodsName  {{goodsData.gi_name}}
        <!-- a(href="tel:4008-947-999") -->
          //.stateChuiNiu(@click="saveMoneyTipsFlag = true")
            span 先比价,够省钱,再下单!未省钱,白送,赔付<img src="../../../assets/img/pinkPhone.png"/>4008-947-999
            img(src="../../../assets/img/pinkNext.png")
        .price(v-if="userData.member_type === '092'")
          span 直供价
          p {{goodsData.direct_supply_interval | price-filter}}
          .salePrice 统一零售价：<span>{{goodsData.retail_interval}}　专柜价：{{goodsData.counter_interval}}</span>
        .price(v-else)
          span 实付价
          p(v-if="initPriceFlag")
            <strong style="color:#f70057;font-size:.2rem">￥</strong>
            ul.arrayPrice
              li(v-for="item in $method.arrayPrice(goodsData.direct_supply_price)") {{item}}
          p(v-else)
            <strong style="color:#70057;font-size:.2rem">￥</strong>
            ul.arrayPrice
              li(v-for="item in $method.arrayPrice(goodsData.direct_supply_interval)") {{item}}
          //.salePrice 统一零售价：<span v-if="initPriceFlag">{{goodsData.retail_price}}</span><span v-else>{{goodsData.retail_interval}}</span>
      .saveMoney(v-if="userData.member_type !== '092'", @click="cardTipsFlag=true")
        ul.saveMoneyTop
          li.red
            .label {{goodsData.retail_interval>goodsData.counter_interval? '专柜价':'专柜价'}}
            .text <span v-if="initPriceFlag"><strong style="color:#666;font-size:.2rem">￥</strong>{{goodsData.counter_price ? goodsData.counter_price : 0}}</span><span v-else>￥{{goodsData.counter_interval ? goodsData.counter_interval : 0}}</span>
          li.gray
            .label 用券立减
            .text(v-if="initPriceFlag") <span>{{(goodsData.counter_price-goodsData.direct_supply_price) | price-filter}}</span>
            .text(v-else) <span>{{(makeMoney.useCardEconomyPrice ? makeMoney.useCardEconomyPrice : 0) | price-filter}}</span>
          img(v-if="goodsData.carry_type===1", src="../../../assets/img/yuyue@2x.png", @click.stop="yuyueShow")
        //ul.saveMoneyBottom
          li.gray
            .label 专柜价购买
            .text 返现<span>{{makeMoney.directEconomyPrice ? makeMoney.directEconomyPrice : 0}}</span>元
          li.gray
            .label 通用券购买
            .text 返现<span>{{makeMoney.useTicketEconomyPricce ? makeMoney.useTicketEconomyPricce : 0}}</span>元
      .numberBox(v-if="false")
        ul.number
          li 邮费{{goodsData.goi_freight}}
          li 库存{{goodsData.storage_num}}
          li 已售{{goodsData.gi_salenum}}
      //.cardBox(style="position:relative", v-if="userData !== '' && userData.member_type !== '092'")
        ul.card
          li(@click="$router.push('/my/accountCardC')")
            .cartType
              .my 我的
              .name 现金券
            .cartPrice
              .price {{userData.netcard_balance | price-filter}}
              .name 余额
            .leftRadio
            .righttRadio
          li(@click="$router.push('/my/accountUniversalC')")
            .cartType
              .my 我的
              .name 通用券
            .cartPrice
              .price {{userData.cash_balance | price-filter}}
              .name 余额
            .leftRadio
            .righttRadio
        img(src="../../../assets/img/right.png", style="height:.6rem;position:absolute;right:.2rem;top:50%;margin-top:-.3rem", @click="$router.push('/home/headlinesDetail?url=activity%2Fdetail%2F2018%2F04%2F27%2Factivity_detail_2018-04-27-09-34-09-123571.png')")
      .myPrice
        .left 余额:
          span 现金券 <strong>{{userData.netcard_balance | price-filter}}</strong>　通用券 <strong>{{userData.cash_balance | price-filter}}</strong>
        //img(src="../../../assets/img/right.png").right
      .size(@click="onlySelectSpecFun")
        .left(v-if="!initPriceFlag") 规格:
          span(v-for="item1 in selectedSpec") <strong style="color:#000;font-weight:500">{{item1.gspec_name}}</strong>({{item1.gspec_value}})
        .left(v-else) 规格:
          span 请选择规格
        img(src="../../../assets/img/right.png").right
      dis-type(@selectType="selectDis", :lock="disableCabinet", :hasGoods="maxStoreNum>0 ? '有货' : '无货'", :carryType="goodsData.carry_type", :hasGoodsFlag="initPriceFlag", ref="disType")
      //.distribution(@click="selectCityShow")
        .top
          .left 地址
          .right
            span
              img(src="../../../assets/img/citySearch.png" style="height:.4rem;width:.3rem")
              span(style="margin-left:.2rem") {{location.province.name}}
              span(style="margin-left:.2rem") {{location.city.name}}
            span(style="color: rgb(246,0,88);") {{maxStoreNum>0 ? '有货' : '无货'}}<img src="../../../assets/img/right.png">
        .bottom
          .hour(v-if="disTypeName === '专柜自提'") 预计{{getGoodsDate}}小时后到货
          .hour(v-else) 预计24小时后发货，请以实际快递为准
      // 改动后的邮费
      //.numberBox(v-if="disTypeName !== '专柜自提'")
        ul.number
          //li 邮费 包邮
          li 邮费 {{freight}}元
      .promise
        img(src="../../../assets/img/ic_good_detail_1.png")
        img(src="../../../assets/img/ic_good_detail_2.png")
        img(src="../../../assets/img/ic_good_detail_3.png")
        img(src="../../../assets/img/ic_good_detail_4.png")
      .title
        .line
        p 详情
      .goodsDetailContent(v-html="desc")
      .title
        .line
        p 推荐
      recommend(background="white", ref="recommend")
    div
      .buttons
        .leftSmallButtons
          img(src="../../../assets/img/msg.png", @click="goService")
          p 客服
        .leftSmallButtons
          img(src="../../../assets/img/shoppingCart@2x.png", @click="$router.push('/shoppingCart')")
          p 购物车
        //.ready
          img(src="../../../assets/img/ic_xqy_yuyue_selected.png")
          ul(@click="yuyueShow")
            li 预约体验
            li 每次99款
        .left(@click="shoppingCartAdd") 加入购物车
        .right(@click="buy") 立即购买
      select-size(v-if="selectSizeShow", :carryType="goodsData.carry_type", :lock="disableCabinet", :expressType="disTypeName", :show="selectFlag", :photos="banner", :spec="spec", :graySpecData="graySpecData", :onlySelectSpec="onlySelectSpec", @close="selectClose", @buy="removeTouchDisable", @confirm="confirmSpec", @load="specLoad")
      //store-select(:show="selectStoreFlag", :type="ofBuy", @close="closeSelectStore", @change="storeChange")
      //share-select(:show="selectShare", @close="selectShare = false", :sharePhoto="banner", :shareTitle="goodsData.gi_name")
    city-select(:show="selectCity", @close="closeSelectCity", @change="cityChange", :type="disTypeName")
    onlyStoreSelect(:show="onlyStoreSelect", @close="onlyStoreSelect = false", @change="locationChange")
    bespeakSelect(:show="bespeakFlag", @change="onlyStoreChange", @close="bespeakFlag = false")
    card-tips(:show="cardTipsFlag", @close="cardTipsFlag = false")
    tag-tips(:show="tagTipsFlag", @close="tagTipsFlag = false")
    saveMoneyTips(:show="saveMoneyTipsFlag", @close="saveMoneyTipsFlag = false")
    // 选择收货地址
    location-select(:show="locationFlag", :origin="'goodsDetailed'", :location="locationList", @close="locationSelectClose", @selected="locationChange")
    // 新手教程
    //goods-guide
      <!--onlyCitySelect(:show="onlyCitySelect", @change="onlyCityChange", @close="onlyCitySelect = false")-->
</template>

<script>
  import locationSelect from './locationSelect'
  import selectSize from './selectSize'
  import disType from './disType'
  import citySelect from './citySelect'
  import storeSelect from './storeSelect'
  import shareSelect from './shareSelect'
  import onlyStoreSelect from './onlyStoreSelect'
  import bespeakSelect from './bespeakSelect'
  import cardTips from './cardTips'
  import tagTips from './tagTips'
  import saveMoneyTips from './saveMoneyTips'
  import goodsGuide from './goodsGuide'
  import recommend from './recommend'
  // import onlyCitySelect from './onlyCitySelect'
  import {mapState} from 'vuex'
  import store from '../../../vuex/store.js'
  import {bus} from '../../../bus'
  export default {
    name: "goods-detailed",
    data () {
      return {
        // 真正存在的规格组合（置灰用）
        graySpecData: [],
        // 禁止选择专柜自提
        disableCabinet: false,
        // 能省多少钱
        makeMoney: {},
        // 到货日期
        getGoodsDate: '',
        // 当前规格运费
        // 首次进入展示的商品最低价
        initPriceFlag: true,
        freight: 0,
        selectFlag: false,
        selectSizeShow: false,
        disTypeFlag: false,
        disTypeName: '快递配送',
        selectCity: false,
        selectStoreFlag: false,
        shoppingCartFlag: false,
        selectShare: false,
        // 选择收货地址
        locationFlag: false,
        // 收货地址数据
        locationList: [],
        // 仅选择门店开关
        onlyStoreSelect: false,
        // 仅选择城市开关
        onlyCitySelect: true,
        // 预约开关
        bespeakFlag: false,
        banner: [],
        goodsData: {},
        spec: [],
        // 已选规格
        selectedSpec: [],
        // 详细描述（富文本）
        desc: '',
        // 购买商品数量
        content: 1,
        // 商品价格
        price: 0,
        // 门店ID
        storeId: '',
        // 当前最大库存
        maxStoreNum: '',
        // 根据此属性判断，选择地址等一系列是否来自立即购买按钮
        ofBuy: false,
        // 卡券介绍
        cardTipsFlag: false,
        // 标签介绍
        tagTipsFlag: false,
        // 省钱介绍
        saveMoneyTipsFlag: false,
        onlySelectSpec: true,
        shareFlag: {
          banner: false,
          title: false
        }
      }
    },
    computed:{
      // 现金券购买省钱价格
      /*xian () {
        return this.goodsData.counter_interval - this.goodsData.cost_interval
      },
      // 直接购买购买省钱价格
      direct () {
        return this.goodsData.counter_interval - this.goodsData.direct_supply_interval
      },
      // 通用券购买省钱价格
      tong () {
        return parseInt(this.goodsData.counter_interval)
      },*/
      ...mapState(['location', 'userData','skuId', 'transfer'])
    },
    components: {locationSelect, selectSize, citySelect, disType, storeSelect, shareSelect, onlyStoreSelect, bespeakSelect, cardTips, saveMoneyTips, tagTips, goodsGuide, recommend},
    // 必须获取了推荐广告才可进入，防止异步导致的数据不同步
    beforeRouteEnter(to, from, next) {
      if (store.state.recommendAdvert.advert.length>=1 && store.state.recommendAdvert.tags.length>=1) {
        next()
      } else {
        let count = 0
        let getAdvert = function () {
          let self = bus
          self.$ajax({
            method: 'get',
            url: self.$apiApp + 'acActivity/acActivityList',
            params: {
              type: '333'
            },
          }).then(function (response) {
            let data = {
              type: 'advert',
              data: response.data.data
            }
            count+=1
            store.commit('getRecommendAdvert', data)
            if (count>=2) {
              next()
            }
          })
        }
        let getTags = function () {
          let self = bus
          self.$ajax({
            method: 'get',
            url: self.$apiApp + 'acActivity/acActivityList',
            params: {
              type: '334'
            },
          }).then(function (response) {
            let oldData = []
            response.data.data.forEach((now) => {
              oldData.push({
                type: '334',
                data: now
              })
            })
            let data = {
              type: 'tags',
              data: oldData
            }
            count+=1
            store.commit('getRecommendAdvert', data)
            if (count>=2) {
              next()
            }
          })
        }
        getAdvert()
        getTags()
      }
      next()
      /*bus.$ajax.all([getAdvert(), getTags()]).then(() => {
        next()
      })*/
    },
    mounted () {
      this.getGoodsDetailed()
      this.getGoodsDesc()
      this.getBanner()
      this.getRelSpec().then(()=>{
        this.getSpec()
      })
      // 重新赋值sku，以触发sku变化问题，防止从订单页回退，skuid并没变化导致的可省金额与到货日期不变化的问题
      if(this.skuId){
        this.$store.commit('getSkuId','')
      }
      // 清空选择门店数据
      this.$store.commit('transferGive', '')
      // this.getMakeMoney(sku)
      // mescroll初始化
      this.$mescrollInt("goodsDetailMescroll",this.upCallback, ()=>{}, ()=>{})
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn()
      this.mescroll.destroy()
    },
    watch: {

      skuId (val) {
        if (val) {
          this.getMakeMoney (val)
          /*this.getDate(val)*/
          // 计算运费
          // this.getFreight()
        }
      },
      location () {
        //this.getFreight()
      },
      $route () {
        // 重新初始化data数据
        // this.$forceUpdate()
        Object.assign(this.$data, this.$options.data())
        // 重新调用mounted里的方法
        this.mescroll.scrollTo( 0, 0 );
        this.mescroll.destroy()
        this.getGoodsDetailed()
        this.getGoodsDesc()
        this.getBanner()
        this.getRelSpec().then(()=>{
          this.getSpec()
        })
        // 重新赋值sku，以触发sku变化问题，防止从订单页回退，skuid并没变化导致的可省金额与到货日期不变化的问题
        if(this.skuId){
          this.$store.commit('getSkuId','')
        }
        this.$mescrollInt("goodsDetailMescroll",this.upCallback)
        // window.location.reload()
        // this.$router.go(0)
        // this.getGoodsDetailed()
        // this.getGoodsDesc()
        // this.getBanner()
        // this.getSpec()
        // this.mescroll.scrollTo( 0, 0 );
      }
    },
    methods:{
      // 显示预约
      yuyueShow () {
        if (this.initPriceFlag) {
          this.$message.warning('请选择规格')
          return
        }
        this.bespeakFlag = true
      },
      // 获取实际不存在规格（置灰）
      getRelSpec () {
        let p = new Promise((resolve)=>{
          let self = this
          self.$ajax({
            method: 'post',
            url: self.$apiGoods + '/goods/spu/findSkuStatus',
            params: {
              gspuId: self.$route.query.id
            },
          }).then(function (response) {
            self.graySpecData = response.data.data
            resolve()
          })
        })
        return p
      },
      // 检测是否可自提
      checkStore () {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/spu/findStoreListBySkuId',
          params: {
            gskuId: self.$store.state.skuId
          },
        }).then(function (response) {
          if(response.data.data.length<1){
            self.disableCabinet = true
            self.disTypeName = '快递配送'
          } else {
            self.disableCabinet = false
          }

        })
      },
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll( isLock );
      },
      selectCityOpen(){
        this.selectCity = true
      },
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll( isLock );
      },
      selectCityShow () {
        //this.selectCity = true
        if (this.disTypeName === '专柜自提') {
          this.onlyStoreSelect = true
        } else {
          this.locationFlag = true
          let self = this
          this.$ajax({
            method: 'get',
            url: self.$apiMember + 'receivingAddress/addresses',
            params: {
              cityNo: self.$store.state.location.city.id
            }
          }).then(function (response) {
            if (response.data.data.length>0) {
              self.locationList = response.data.data
            }
          })
        }


        // this.selectCity = true
      },
      // 关闭收货地址
      locationSelectClose () {
        this.locationFlag = false
      },
      // 选择收货地址后
      locationChange () {
        // 重新渲染选择规格组件，触发库存等数据的请求
        this.selectSizeShow = false
        setTimeout(()=>{
          this.selectSizeShow = true
        },50)
      },
      scrollTo(h,t){
        this.mescroll.scrollTo( h, t );
      },
      getFreight () {
        if (!this.skuId) {
          return
        }
        let jsonStr = [{
          gsku_id: this.skuId,
          goods_num: this.content
        }]
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/querySkuFreightList',
          params: {
            skuNumArrayStr: JSON.stringify(jsonStr),
            cityNo: self.location.city.id
          }
        }).then(function (response) {
          self.freight = response.data.data[0].freight
        })
      },
      isShare () {
        if (this.shareFlag.banner && this.shareFlag.title) {
          this.$initShare({
            sharePhoto: this.$method.imgUrlFilter(this.banner[0].gi_img_url),
            shareTitle: this.goodsData.gi_name,
            shareDesc: '我发现了个宝贝,跟专卖店比贼便宜',
            handleSuccess: () => {
              let self = this
              if (localStorage.hasOwnProperty('token') && localStorage.getItem('member_type') === '091') {
                self.$ajax({
                  method: 'get',
                  url: self.$apiTransaction + '/netcardrule/share/present',
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
        }
      },
      // 后退
      goBack () {
        // console.log(this.$router)
        if (window.history.length>1) {
          this.$router.go(-1)
        } else {
          this.$router.push('/home')
        }
      },
      // 规格组件挂载并请求详情后或规格变化
      specLoad (data) {
        this.maxStoreNum = data.maxStoreNum
        this.selectedSpec = data.spec
        this.goodsData.direct_supply_interval = data.direct_supply_price
        this.goodsData.counter_interval = data.counter_price
        this.goodsData.retail_interval = data.retail_price
        // 计算运费
        // this.getFreight()
        // this.freight = data.goi_freight
        // 根据用户类型为确认订单页价格赋值
        if (this.userData.member_type === '092') {
          this.price = data.direct_supply_price
        } else {
          this.price = data.counter_price
        }
        // 检测是否有自提门店
        this.checkStore()
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
      // 获取能省多少钱
      getMakeMoney (id) {
        if (id === undefined) {
          return
        }
        let self = this
        this.$ajax({
          method: 'get',
          url: self.$apiGoods + 'goods/sku/'+ id +'/economyPrice',
          params: {}
        }).then(function (response) {
          self.makeMoney = response.data.data
        })
      },
      // 获取到货日期
      /*getDate (id) {
        if (id === undefined) {
          return
        }
        let self = this
        this.$ajax({
          method: 'get',
          url: self.$apiGoods + 'goods/sku/'+ id +'/goodsReadyTime',
          params: {}
        }).then(function (response) {
          self.getGoodsDate = response.data.data
        })
      },*/
      // 获取商品详情
      getGoodsDetailed () {
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/spu/detail',
          params: {
            gspuId: self.$route.query.id
          }
        }).then(function (response) {
          self.goodsData = response.data.data
          self.shareFlag.title = true
          self.isShare()
        })
      },
      // 获取商品描述
      getGoodsDesc () {
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/spu/desc',
          params: {
            gspuId: self.$route.query.id
          }
        }).then(function (response) {
          self.desc = response.data.data
        })
      },
      // 获取banner
      getBanner () {
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/spu/img',
          params: {
            gspuId: self.$route.query.id
          }
        }).then(function (response) {
          self.banner = response.data.data
          self.shareFlag.banner = true
          self.isShare()
        })
      },
      // 改造格式
      specGray (spec, graySpec, checkedSpec) {
        // 改造原有数据格式
        spec.forEach((now)=>{
          now.specValue.forEach((sonNow,index)=>{
            now.specValue[index] = {
              value: sonNow,
              gray: false
            }
          })
        })
        // 返回新的数据
        return spec
      },
      // 获取规格
      getSpec () {
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/spu/spec',
          params: {
            gspuId: self.$route.query.id
          }
        }).then(function (response) {
          // 改造格式
          let newData = self.specGray(response.data.data)
          console.log(newData)
          newData.forEach((now)=>{
            now.specValue.forEach((sonNow, sonIndex)=>{
              if (!sonNow.gray) {
                now.valueIndex = -1
              } else {
                now.valueIndex = -1
              }
            })
          })
          self.spec = newData
          // 渲染选择规格组件,以此触发组件mounted事件，获取sku
          self.selectSizeShow = true
        })
      },
      // 门店选择变化后
      storeChange (data) {
        this.$store.commit('getLocation',data)
        this.selectStoreFlag = false
      },
      // 选择城市变化后
      cityChange (data) {
        this.$store.commit('getLocation',data)
        this.selectCity = false
        // 关闭选择收货地址
        this.locationFlag = false
        // 重新渲染选择规格组件，触发库存等数据的请求
        this.selectSizeShow = false
        setTimeout(()=>{
          this.selectSizeShow = true
        },50)
      },
      shoppingCartAdd () {
        // 如果没登录，直接跳往登录
        if (!localStorage.hasOwnProperty('token')) {
          this.$router.push('/login')
          this.$message.warning('请先登录')
          return
        }
        // 判断库存
        /*if (this.maxStoreNum<this.content) {
          this.$message.warning('库存不足')
          return
        }*/
        //
        this.ofBuy = false
        this.shoppingCartFlag = true
        // 并且，告诉组件，此操作有后续操作
        this.onlySelectSpec = false
        // 如果存在规格，直接进行选择配送方式
        this.selectFlag = true
      },
      buy () {
        // 如果没登录，直接跳往登录
        if (!localStorage.hasOwnProperty('token')) {
          this.$router.push('/login')
          this.$message.warning('请先登录')
          return
        }
        // 判断库存
        /*if (this.maxStoreNum<this.content) {
          this.$message.warning('库存不足')
          return
        }*/
        // 关闭购物车flag
        this.shoppingCartFlag = false
        // 此生明，这次选择地址等一系列操作来自购买按钮
        this.ofBuy = true
        // 并且，告诉组件，此操作有后续操作
        this.onlySelectSpec = false
        // 如果存在规格，直接进行选择配送方式
        this.selectFlag = true

      },
      // 单独选择门店后
      /*onlyStoreChange(data) {
        // 如果操作来自购买按钮
        if (this.ofBuy) {
          /!* let self = this
          this.$ajax({
            method: 'post',
            url: self.$apiTransaction + 'order/submitNowCarryOrder',
            params: {
              gspuId: self.$route.query.id
            }
          }).then(function (response) {
            response.data.data.forEach((now,index)=>{
              now.valueIndex = 0
            })
            self.spec = response.data.data
          }) *!/
          // 规格
          let spec = []
          this.spec.forEach((now) => {
            spec.push(now.specValue[now.valueIndex])
          })
          // 订单页需要展示及用到的数据
          let orderData = [{
            skuId: this.$store.state.skuId,
            storeName: this.$store.state.location.store.name,
            storeLocation: this.$store.state.location,
            photo: this.banner[0].gi_img_url,
            spec: spec,
            number: this.content,
            goodsName: this.goodsData.gi_name,
            price: this.price,
            freight: this.goodsData.goi_freight
          }]
          // 传入中转
          this.$store.commit('transferGive', orderData)
          this.$router.push({path: '/confirmOrder', query: {since: 'true', type: 'direct'}})
        }
        if (this.shoppingCartFlag) {
          // 如果操作来自添加购物车按钮
          let self = this
          this.$ajax({
            method: 'post',
            url: self.$apiGoods + 'goods/shoppingCart/add',
            params: {
              gskuId: self.$store.state.skuId,
              deliveryWays: 168,
              province: self.$store.state.location.province.id,
              city: self.$store.state.location.city.id,
              storeId: self.$store.state.location.store.id,
              goodsNum: self.content
            }
          }).then(function (response) {
            // 关闭选择
            self.onlyStoreSelect = false
            self.$message.success('添加购物车成功')
          })
        }
      },*/
      onlyStoreChange (data) {
        // 如果操作来自购买按钮
        if (this.ofBuy) {
          /* let self = this
          this.$ajax({
            method: 'post',
            url: self.$apiTransaction + 'order/submitNowCarryOrder',
            params: {
              gspuId: self.$route.query.id
            }
          }).then(function (response) {
            response.data.data.forEach((now,index)=>{
              now.valueIndex = 0
            })
            self.spec = response.data.data
          }) */
          // 规格
          let spec = []
          this.spec.forEach((now)=>{
            spec.push(now.specValue[now.valueIndex])
          })
          // 订单页需要展示及用到的数据
          let orderData = [{
            skuId: this.$store.state.skuId,
            storeName: this.transfer.store.name,
            storeLocation: this.$store.state.location,
            photo: this.$store.state.skuImg,
            spec: spec,
            number: this.content,
            goodsName: this.goodsData.gi_name,
            price: this.price,
            freight: this.goodsData.goi_freight
          }]
          // 传入中转
          this.$store.commit('transferGive', orderData)
          this.$router.push({path: '/confirmOrder', query:{since:'true',type:'direct'}})
        }
        if (this.shoppingCartFlag) {
          // 如果操作来自添加购物车按钮
          let self = this
          this.$ajax({
            method: 'post',
            url: self.$apiGoods+ 'goods/shoppingCart/add',
            params: {
              gskuId: self.$store.state.skuId,
              deliveryWays: 168,
              province: self.$store.state.location.province.id,
              city: self.$store.state.location.city.id,
              storeId: self.transfer.store.id,
              goodsNum: self.content
            }
          }).then(function (response) {
            // 关闭选择
            self.onlyStoreSelect = false
            self.$message.success('添加购物车成功')
          })
        }
      },
      // 配送订单进入下一步
      expressNext () {
        // 如果操作来自购买按钮
        if (this.ofBuy) {
          // 规格
          let spec = []
          this.spec.forEach((now)=>{
            spec.push(now.specValue[now.valueIndex])
          })
          // 订单页需要展示及用到的数据
          let orderData = [{
            skuId: this.$store.state.skuId,
            storeName: '专柜正品',
            storeLocation: this.$store.state.location,
            photo: this.$store.state.skuImg,
            spec: spec,
            number: this.content,
            goodsName: this.goodsData.gi_name,
            price: this.price,
            freight: this.freight
          }]
          // 发送请求判断库存
          let specData = {
            'cityId': this.$store.state.location.city.id,
            'gspu_id': this.$route.query.id,
            'specList': [
            ]
          }
          this.spec.forEach((now)=>{
            specData.specList.push({
              'gspec_name': now.specName,
              'gspec_value': now.specValue[now.valueIndex].value
            })
          })
          let self = this
          this.$ajax({
            method: 'post',
            url: self.$apiGoods + 'goods/sku/detail',
            params: {
              gc: JSON.stringify(specData)
            }
          }).then(function (response) {
            if (response.data.data.storage_num>0) {
              // 传入中转
              self.$store.commit('transferGive', orderData)
              self.$router.push({path: '/confirmOrder', query:{since:'false',type:'direct'}})
            } else {
              self.$message.error('库存不足')
            }
          })
        }
        if (this.shoppingCartFlag) {
          // 如果操作来自添加购物车按钮
          let self = this
          this.$ajax({
            method: 'post',
            url: self.$apiGoods+ 'goods/shoppingCart/add',
            params: {
              gskuId: self.$store.state.skuId,
              deliveryWays: 167,
              province: self.$store.state.location.province.id,
              city: self.$store.state.location.city.id,
              storeId: '',
              goodsNum: self.content
            }
          }).then(function (response) {
            self.$message.success('添加购物车成功')
          })
        }
      },
      selectClose () {
        this.selectFlag = false
      },
      confirmSpec (data) {
        // 赋值信息
        this.price = data.price
        this.content = data.content
        this.selectedSpec = data.spec
        // 仅选规格 --------------------------------------------------------------------
        /*if (this.onlySelectSpec) {
          this.selectFlag = false
        }*/
        // 购买--------------------------------------------------------------------------
        if (this.ofBuy) {
          if (this.selectedSpec.length>0) {
            // 根据配送类型进行操作
            if (this.disTypeName==='专柜自提') {
              // 根据是否有城市判断是否选择过地址
              if (this.transfer.store) {
                this.onlyStoreChange()
                this.selectFlag = false
              } else {
                this.$message.warning('请选择收货/自提地址')
              }
            } else {
              // 为配送订单并且已选地址直接进入下一步
              this.expressNext()
            }
          } else {
            this.selectFlag = true
            // 隐藏返回顶部
            this.mescroll.hideTopBtn()
          }
        }
        // 购物车添加-----------------------------------------------------------------
        if (this.shoppingCartFlag) {
          if (this.selectedSpec.length>0) {
            // 根据配送类型进行操作
            if (this.disTypeName==='专柜自提') {
              // 根据是否有城市判断是否选择过地址
              if (this.transfer.store) {
                this.selectFlag = false
                this.onlyStoreChange()
              } else {
                this.$message.warning('请选择收货/自提地址')
              }
            } else {
              this.selectFlag = false
              // 为配送订单直接进入下一步
              this.expressNext()
            }
          } else {
            this.selectFlag = true
            // 返回顶部
            this.mescroll.hideTopBtn()
          }
        }
      },
      onlySelectSpecFun () {
        // 并且，告诉组件，此操作仅仅为了选择规格
        this.onlySelectSpec = true
        this.selectFlag = true
        // 隐藏返回顶部
        this.mescroll.hideTopBtn()
        // 重置购物车flag
        this.shoppingCartFlag = false
      },
      // 移除禁止触摸事件,并将购买商品数量与价格赋值(选择规格变化后)
      removeTouchDisable (data) {
        this.price = data.price
        this.content = data.content
        this.selectedSpec = data.spec
        // 打开类型选择
        // this.disTypeFlag = true
        // 关闭规格选择
        this.selectFlag = false
        if (this.disTypeName==='专柜自提') {
          this.onlyStoreSelect = true
        } else {
          this.expressNext()
        }
      },
      // 关闭门店选择
      closeSelectStore () {
        this.selectStoreFlag = false
      },
      // 关闭城市选择
      closeSelectCity () {
        this.selectCity = false
      },
      // 选择配送类型
      selectDis (data) {
        this.$refs.disType.nowType = data
        if (data === 1) {
          // this.selectCity = true
          this.disTypeName = '快递配送'
        } else {
          // this.selectStoreFlag = true
          this.disTypeName = '专柜自提'
        }
      },
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          // bus.$emit('listPush',curPageData,page.num,page.size)
          self.$refs.recommend.more(curPageData,page.num,page.size)
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
      tips (type) {
        this.tagTipsFlag = true
        return
        // 需求有变，不需要弹下面那些玩意，以防他们再想改回来，暂时不删
        switch (type){
          case 0:
            this.$alert('专柜提货','平台支持平台下单，专柜自提，如您需要自提请在配送页选择自提，在收到备货完成的短信提醒后至指定专柜自提。')
            break
          case 1:
            this.$alert('专柜比价','平台比品牌专柜折后价，再便宜30-70%，建议您比较后再购买。')
            break
          case 2:
            this.$alert('专柜体验','平台所售商品专柜商品完全一致，建议您在专柜体验（试穿）后再购买。')
            break
        }

      }
    }
  }
</script>

<style scoped>
  .goodsBox {
    background: rgb(242,242,242);
    padding-bottom: 1rem;
    width: 100%;
    overflow-x: hidden;
  }
  .banner{
    position: relative;
  }
  .goodsInfo{
    height: 3rem;
    padding: .2rem .2rem 0 .2rem;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .goodsName{
    line-height: .5rem;
    font-size: .35rem;
    font-weight: 600;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .stateChuiNiu {
    color: rgb(255,128,171);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .stateChuiNiu img{
    height: .4rem ;
  }
  .tags {
    white-space: nowrap;
    padding-left: .2rem;
  }
  .tags>.tag{
    display: inline-block;
    padding: .05rem .2rem;
    font-size: .3rem;
    font-weight: 500;
    border-radius: 1rem;
    color: rgb(230,13,92);
    background: rgb(254,233,239);
    transform: scale(.8,.8);
    margin-left: -.5rem;
  }
  .tags>.tag:last-child {
    border: none;
    background: none;
    text-decoration: underline;
  }
  .price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    font-weight: 600;
    font-size: .6rem;
    color: rgb(255,0,88);
  }
  .price>span{
    font-size: .3rem;
    padding: 0 .1rem;
    font-weight: 500;
    color: white;
    background-color: black;
    position: relative;
    bottom: .1rem;
  }
  .price p{
    margin-right: .5rem;
  }
  .price .salePrice{
    font-weight: 500;
    font-size: .3rem;
    color: #999;
  }
  .price>.salePrice>span{
    text-decoration: line-through;
  }
  /* 省钱部分 */
  .saveMoney {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .saveMoney>.saveMoneyTop{
    height: 1rem;
    padding-left: .2rem;
    width: 100%;
    display: flex;
    background-color: white;
    border-bottom: solid 1px #eee;

  }
  .saveMoneyTop>img{
    margin-top: .15rem;
    width: 2rem;
    height: .65rem;
  }
  .saveMoney> .saveMoneyBottom{
    padding-left: .2rem;
    width: 100%;
    display: flex;
  }
  .saveMoney li{
    display: flex;
    width: 3.5rem;
    align-items: center;
  }
  .saveMoney li>img{
    width: 2rem;
  }
  .saveMoney li .label{
    text-align: center;
    color: rgb(247,0,87);
    padding: 0 .1rem;
    border-radius: 3px;
  }
  .saveMoney li .text{
    word-wrap: normal;
    flex-grow: 1;
    padding-left: .1rem;
    width: 0;
    text-align: left;
  }
  .red{

  }
  .red .label{
    color: black !important;
    border: none !important;
    background: none !important;
  }
  .red .text{
    color: black;
    font-weight: 600;
    text-align: left !important;
  }
  .gray{

  }
  .gray .label{
    color: #999;
  }
  .gray .text{

  }
  .gray .text>span{
    color: rgb(247,0,87);
  }
  /* 省钱部分end */
  .numberBox {
    margin-top: 5px;
    padding: 0 .2rem;
    background: white;
  }
  .number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #aaaaaa;
    background: white;
    height: 1rem;
  }
  /* 承诺 */
  .promise{
    margin-top: 1px;
    display: flex;
    padding: .3rem 0;
    background-color: white;
  }
  .promise img{
    flex-grow: 1;
    width: 0;
    height: .55rem;
    margin-left: .2rem;
    border-right: solid 1px #aaa;
    padding-right: .2rem;
  }
  .promise img:last-child{
    margin-right: .2rem;
    border-right: none
  }
  /* 卡片部分 */
  .card{
    margin-top: .2rem;
    padding: 0 .2rem;
    display: flex;
  }
  .card li{
    position: relative;
    height: 1.5rem;
    width: 4.2rem;
    background-color: white;
    border: none;
    border-radius: .1rem;
    display: flex;
  }
  .card li:last-child{
    margin-left: .4rem;
  }
  .card li>.cartType {
    background-color: rgb(244,0,87);
    color: white;
    width: 1.7rem;
    border-bottom-left-radius: .1rem;
    border-top-left-radius: .1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .card li:last-child>.cartType {
    background-color: rgb(82,56,195);
  }
  .card li:last-child>.cartPrice .price {
    color: rgb(82,56,195);
  }
  .card li>.cartPrice {
    color: #999;
    width: 2.5rem;
    border-bottom-left-radius: .1rem;
    border-top-left-radius: .1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .card li>.cartPrice .price{
    font-size: .4rem;
    font-weight: 600;
  }
  .card li>.leftRadio{
    position: absolute;
    width: .5rem;
    height: .5rem;
    background-color: rgb(242,242,242);
    top: 50%;
    margin-top: -.25rem;
    left: -.25rem;
    border-radius: 1rem;
  }
  .card li>.righttRadio{
    position: absolute;
    width: .5rem;
    height: .5rem;
    background-color: rgb(242,242,242);
    top: 50%;
    margin-top: -.25rem;
    right: -.25rem;
    border-radius: 1rem;
  }
  /* 卡片结束 */
  /* 余额 */
  .myPrice {
    height: 1rem;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .2rem;
  }
  .myPrice .left{
    font-size: .35rem;
    color: #aaa;
  }
  .myPrice .left span{
    margin-left: .2rem;
    font-weight: 500;
    color: black;
  }
  .myPrice .left span strong{
    color:#f93b80
  }
  .myPrice .right{
    width: .6rem;
  }
  .size {
    margin-top: .2rem;
    height: 1rem;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .2rem;
    border-bottom: solid 1px #eee;
  }
  .size .left{
    font-size: .35rem;
    color: #aaa;
  }
  .size .left span{
    margin-left: .2rem;
    font-weight: 500;
    color: #aaaaaa;
  }
  .size .right{
    width: .6rem;
  }
  .distribution{
    border-top: solid 1px #eee;
    height: 1.7rem;
    background: white;
  }
  .distribution .top{
    display: flex;
    height: .8rem;
    padding: 0 .2rem;
  }
  .distribution .top .left{
    height: 100%;
    width: 2rem;
    font-size: .35rem;
    color: #aaa;
    display: flex;
    align-items: center;
  }
  .distribution .top .right{
    font-size: .35rem;
    font-weight: 600;
    align-items: center;
    height: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
  }
  .distribution .top .right span{
    display: flex;
    align-items: center;
  }
  .distribution .top .right img{
    width: .6rem;
  }
  .distribution .bottom{
    padding-left: 2.2rem;
  }
  .distribution .bottom .location{
    margin-top: .1rem;
  }
  .distribution .bottom .location img{
    float: left;
    height: .4rem;
  }
  .distribution .bottom .location span{
    margin-left: .2rem;
    font-weight: 600;
  }
  .distribution .bottom .hour{
    margin-top: .2rem;
    color: #aaaaaa;
  }
  /* 分割线 */
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
  .buttons {
    position: fixed;
    z-index: 1;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.2rem;
    display: flex;
    align-items: center;
    border-top: solid 1px #ddd;
    background: white;
  }
  .buttons div{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .buttons> .leftSmallButtons{
    height: 100%;
    width: 2rem;
    border-right: solid 1px #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .buttons> .leftSmallButtons> img{
    width: .6rem;
  }
  .buttons> .leftSmallButtons> p {
    color: #666;
    font-size: .2rem;
  }
  .buttons>.ready{
    width: 2.6rem;
    height: 100%;
    font-size: .25rem;
    border-right: solid 1px rgb(230, 230, 230);
    border-left: solid 1px rgb(230, 230, 230);
  }
  .buttons>.ready img{
    width: .8rem;
    margin-right: .1rem;
  }
  .buttons>.ready ul li:first-child{
    color: rgb(244,0,87);
  }
  .buttons>.ready ul li:last-child{
    color: rgb(100,100,100);
  }
  .buttons .left{
    flex-grow: 1;
    width: 0;
    background: #ff8500;
    font-size: .4rem;
    color: white;
  }
  .buttons .right{
    flex-grow: 1;
    width: 0;
    background: rgb(244,0,87);
    font-size: .4rem;
    color: white;
  }
  /* 下拉刷新，上拉加载 */
  #goodsDetailMescroll {
    top: 0;
    bottom: 0;

    position: fixed;
  }
</style>
<style>
  /* 商品描述 */
  .goodsDetailContent {
    width: 100%;
  }
  .goodsDetailContent img{
    float: left;
    max-width: 100%;
  }
  .arrayPrice,  .arrayPrice li{
    display: inline-block;
  }
  .arrayPrice li:nth-of-type(2) {
    font-size: .42rem;
  }
</style>
