<template lang="pug">
  .goodsBox.mescroll#goodsDetailMescroll
    .banner
      nav-bar(background="rgba(255,255,255,.7)", height="0", border-bottom="none")
        .topLeft(slot="left")
          img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
        .topCenter(slot="center") 商品
        .topRight(slot="right")
      carousel(:indicators="true", :auto="5000", v-if="banner.length > 0", :responsive="0", style="height:8rem")
        div(v-for="tag in banner", style="width:100%" , @click="goActivity(tag.link,tag.linkType)")
          img(:src="tag.gi_img_url | img-filter" , style="width:100%;height:8rem")
    .goodsInfo
      .goodsName <span class="tag" @click="tips(0)">专柜提货</span><span class="tag" @click="tips(1)">专柜比价</span><span class="tag" @click="tips(2)">专柜体验</span> {{goodsData.gi_name}}
      .stateChuiNiu
        span 先比价,够省钱,再下单!未省钱,赔1万元,赔付<img src="../../../assets/img/pinkPhone.png"/>4008-947-999
        img(src="../../../assets/img/pinkNext.png")
      .price
        span 专柜价
        p {{goodsData.counter_interval | price-filter}}
        .salePrice 统一零售价：{{goodsData.retail_interval}}
      ul.saveMoney
        li.red
          .label 现金券
          .text 省{{xian}}元
        li.gray
          .label 直接购买
          .text 约省{{direct}}元
        li.gray
          .label 通用券
          .text 约省{{tong}}元
    .numberBox
      ul.number
        li 邮费{{goodsData.goi_freight}}
        li 库存{{goodsData.storage_num}}
        li 已售{{goodsData.gi_salenum}}
    ul.card
      li
        .cartType
          .my 我的
          .name 现金券
        .cartPrice
          .price ￥2000
          .name 余额
        .leftRadio
        .righttRadio
      li
        .cartType
          .my 我的
          .name 通用券
        .cartPrice
          .price ￥2000
          .name 余额
        .leftRadio
        .righttRadio
    .size(@click="onlySelectSpecFun")
      .left 规格
      img(src="../../../assets/img/right.png").right
    .distribution(@click="distribution")
      .top
        .left 配送方式
        .right
          span {{disTypeName}}
          span(style="color: rgb(246,0,88);") 有货<img src="../../../assets/img/right.png">
      .bottom
        .location
          img(src="../../../assets/img/citySearch.png")
          span {{location.province.name}}
          span {{location.city.name}}
        .hour 下单完成后将在xx小时内发货
    .title
      .line
      p 详情
    .content(v-html="desc")
    .title
      .line
      p 推荐
    w-recommend(:listData="recommendGoods", background="white")
    .buttons
      .left(@click="shoppingCartAdd") 加入购物车
      .right(@click="buy") 立即购买
    select-size(v-if="selectSizeShow", :show="selectFlag", :photos="banner", :spec="spec", :onlySelectSpec="onlySelectSpec", @close="selectClose", @buy="removeTouchDisable")
    dis-type(:show="disTypeFlag", @selectType="selectDis", @close="disTypeClose")
    store-select(:show="selectStoreFlag", :type="ofBuy", @close="closeSelectStore", @change="storeChange")
    city-select(:show="selectCity", @close="closeSelectCity", @change="cityChange")
</template>

<script>
  import selectSize from './selectSize'
  import disType from './disType'
  import citySelect from './citySelect'
  import storeSelect from './storeSelect'
  import {mapState} from 'vuex'
  export default {
    name: "goods-detailed",
    data () {
      return {
        selectFlag: false,
        selectSizeShow: false,
        disTypeFlag: false,
        disTypeName: '快递配送',
        selectCity: false,
        selectStoreFlag: false,
        shoppingCartFlag: false,
        banner: [],
        goodsData: {},
        spec: [],
        // 详细描述（富文本）
        desc: '',
        // 购买商品数量
        content: 1,
        // 商品价格
        price: 0,
        // 门店ID
        storeId: '',
        // 根据此属性判断，选择地址等一系列是否来自立即购买按钮
        ofBuy: false,
        onlySelectSpec: true,
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
    computed:{
      // 现金券购买省钱价格
      xian () {
        return this.goodsData.counter_interval - this.goodsData.cost_interval
      },
      // 直接购买购买省钱价格
      direct () {
        return this.goodsData.counter_interval - this.goodsData.direct_supply_interval
      },
      // 通用券购买省钱价格
      tong () {
        return parseInt(this.goodsData.counter_interval)
      },
      ...mapState(['location'])
    },
    components: {selectSize,citySelect,disType,storeSelect},
    mounted () {
      this.getGoodsDetailed()
      this.getGoodsDesc()
      this.getBanner()
      this.getSpec()
      // mescroll初始化
      this.$mescrollInt("goodsDetailMescroll",this.upCallback)
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods:{
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
        })
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
          response.data.data.forEach((now,index)=>{
            now.valueIndex = 0
          })
          self.spec = response.data.data
          // 渲染选择规格组件
          self.selectSizeShow = true
        })
      },
      // 门店选择变化后
      storeChange (data) {
        let locationData = {
          province:{
            name: data.pro.name,
            id: data.pro.number
          },
          city:{
            name: data.city.name,
            id: data.city.number
          },
          store:{
            name: data.store.name,
            id: data.store.id
          }
        }
        this.storeId = data.store.id
        this.$store.commit('getLocation',locationData)
        this.selectStoreFlag = false
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
            storeName: data.store.name,
            storeLocation: data,
            photo: this.banner[0].gi_img_url,
            spec: spec,
            number: this.content,
            goodsName: this.goodsData.gi_name,
            price: this.price
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
              storeId: self.storeId,
              goodsNum: self.content
            }
          }).then(function (response) {
            self.$message.success('添加购物车成功')
          })
        }
      },
      // 选择城市变化后
      cityChange (data) {
        let locationData = {
          province:{
            name: data.pro.name,
            id: data.pro.number
          },
          city:{
            name: data.city.name,
            id: data.city.number
          },
          area:{
            name: data.area.name,
            id:  data.area.number
          }
        }
        this.$store.commit('getLocation',locationData)
        this.selectCity = false
        // 重新渲染选择规格组件，触发库存等数据的请求
        this.selectSizeShow = false
        setTimeout(()=>{
          this.selectSizeShow = true
        },50)
        // 如果操作来自购买按钮
        if (this.ofBuy) {
          // 规格
          let spec = []
          this.spec.forEach((now)=>{
            spec.push(now.specValue[now.valueIndex])
          })
          // 订单页需要展示及用到的数据
          let orderData = [{
            storeName: 'xx旗舰店',
            storeLocation: data,
            photo: this.banner[0].gi_img_url,
            spec: spec,
            number: this.content,
            goodsName: this.goodsData.gi_name,
            price: this.price
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
              'gspec_value': now.specValue[now.valueIndex]
            })
          })
          let self = this
          this.$ajax({
            method: 'post',
            url: self.$apiGoods + 'goods/sku/detail',
            data: specData
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
      shoppingCartAdd () {
        this.ofBuy = false
        this.shoppingCartFlag = true
        // 并且，告诉组件，此操作有后续操作
        this.onlySelectSpec = false
        this.selectFlag = true
        this.onTouchMove(true)
        document.body.style.overflow='hidden'
        document.body.style.height="100vh"
      },
      buy () {
        // 关闭购物车flag
        this.shoppingCartFlag = false
        // 此生明，这次选择地址等一系列操作来自购买按钮
        this.ofBuy = true
        // 并且，告诉组件，此操作有后续操作
        this.onlySelectSpec = false
        this.selectFlag = true
        this.onTouchMove(true)
        document.body.style.overflow='hidden'
        document.body.style.height="100vh"
      },
      selectClose () {
        this.selectFlag = false
        this.onTouchMove(false)
        document.body.style.overflow='auto'
      },
      distribution () {
        // 此生明，这次选择地址等一系列操作《《不不不不》》来自购买按钮
        this.ofBuy = false
        this.disTypeFlag = true
      },
      onlySelectSpecFun () {
        // 并且，告诉组件，此操作仅仅为了选择规格
        this.onlySelectSpec = true
        this.selectFlag = true
        // 重置购物车flag
        this.shoppingCartFlag = false
      },
      // 移除禁止触摸事件,并将购买商品数量与价格赋值
      removeTouchDisable (data) {
        this.price = data.price
        this.content = data.content
        // 打开类型选择
        this.disTypeFlag = true
        // 关闭规格选择
        this.selectFlag = false
        this.onTouchMove(false)
        document.body.style.overflow='auto'
      },
      // 关闭门店选择
      closeSelectStore () {
        this.selectStoreFlag = false
      },
      // 关闭城市选择
      closeSelectCity () {
        this.selectCity = false
      },
      // 关闭配送类型选择
      disTypeClose () {
        this.disTypeFlag = false
      },
      // 选择配送类型
      selectDis (data) {
        this.disTypeClose()
        if (data === 1) {
          this.selectCity = true
          this.disTypeName = '快递配送'
        } else {
          this.selectStoreFlag = true
          this.disTypeName = '门店自提'
        }
      },
      onTouchMove(inFlag) {
        if (inFlag) {
          document.addEventListener('touchmove', this.onHandler, false);
        } else {
          document.removeEventListener('touchmove', this.onHandler, false);
        }
      },
      onHandler(e) {
        e.preventDefault();
      },
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
      tips (type) {
        switch (type){
          case 0:
            this.$alert('专柜提货','去专柜提货,随去随拿')
            break
          case 1:
            this.$alert('专柜比价','跟专柜比价格，不便宜你打我')
            break
          case 2:
            this.$alert('专柜体验','去专柜体验，假不假试了就知道')
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
  }
  .banner{
    position: relative;
  }
  .goodsInfo{
    height: 4rem;
    padding: .2rem;
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
  .goodsName .tag{
    margin-right: .1rem;
    padding: 0 .1rem;
    font-size: .3rem;
    font-weight: 500;
    color: white;
    background: rgb(246,0,87);
  }
  .price {
    display: flex;
    align-items: baseline;
    font-size: .6rem;
    color: rgb(245,0,87);
  }
  .price span{
    font-size: .3rem;
    font-weight: 600;
    color: #000;
  }
  .price .salePrice{
    margin-left: .5rem;
    font-weight: 500;
    font-size: .3rem;
    color: #999;
  }
  /* 省钱部分 */
  .saveMoney {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .saveMoney li{
    display: flex;
  }
  .saveMoney li .label{
    width: 1.3rem;
    text-align: center;
  }
  .saveMoney li .text{
    width: 1.7rem;
    text-align: center;
  }
  .red{
    border: solid 1px  rgb(245,0,87);
  }
  .red .label{
    color: rgb(245,0,87);
  }
  .red .text{
    color: white;
    background-color: rgb(245,0,87);
  }
  .gray{
    border: solid 1px  #999;
  }
  .gray .label{
    color: #999;
  }
  .gray .text{
    color: white;
    background-color: #999
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
  /* 卡片部分 */
  .card{
    margin-top: .2rem;
    padding: 0 .5rem;
    display: flex;
    justify-content: space-between;
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
    background-color: rgb(255,128,171);
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
  .size {
    margin-top: .2rem;
    height: 1.5rem;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .2rem;
  }
  .size .left{
    font-size: .35rem;
    font-weight: 600;
  }
  .size .right{
    width: .6rem;
  }
  .distribution{
    margin-top: .2rem;
    height: 2.2rem;
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
    font-weight: 600;
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
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.2rem;
    display: flex;
    border: solid 1px rgb(244,0,87);
  }
  .buttons div{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .buttons .left{
    flex-grow: 1;
    height: 100%;
    background: white;
    font-size: .4rem;
    color: rgb(244,0,87);
  }
  .buttons .right{
    flex-grow: 1;
    height: 100%;
    background: rgb(244,0,87);
    font-size: .4rem;
    color: white;
  }
  /* 下拉刷新，上拉加载 */
  #goodsDetailMescroll {
    top: 0;
    bottom: 0;
    height: auto;
    position: fixed;
  }
</style>
<style>
  /* 商品描述 */
  .content {
    width: 100%;
  }
  .content img{
    max-width: 100%;
  }
</style>
