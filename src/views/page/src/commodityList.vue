<template lang="pug">
  .wrapNav
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="backgo()")
      .topCenter(slot="center")
        .searchInput
          input(type="text", placeholder="请输入商品名称", @click="$router.push({path:'/home/searchHistory',query:{changeFocus:true,messages:message,jumps:jumps}})", v-model="message", ref="oInput", readonly, UNSELECTABLE='on')
          img(src="../../../assets/img/searchInput搜索图标@2x.png")
      .topRight(slot="right")
        img(src="../../../assets/img/msg_0.png" v-show="false")
        .searchbtn(v-show="false") 搜索
    ul.wrap
      li.left
        ul
          li(@click="changes1()" :class="{active:change1}") 综合
          li(@click="changes2()" :class="{active:change2}" v-if="false") 销量
      li.right
        ul
          li.showStyle(@click="exchange()")
            img(src="../../../assets/img/pageBigList.png" v-show="!flags")
            img(src="../../../assets/img/pageList.png" v-show="flags")
          li.price(@click="liftOrSort()")
            .priceWords(:class="{active:change}") 价格
            .topDown
              img(src="../../../assets/img/pageAsc.png" v-show="check").top
              img(src="../../../assets/img/pageAscChecked.png" v-show="!check").top
              img(src="../../../assets/img/pageDesc.png" v-show="!checked").down
              img(src="../../../assets/img/pageDescChecked.png" v-show="checked").down
          li.filters(@click="leftScroll()") | 筛选
            img(src="../../../assets/img/pageFiltrate.png")
    .commodityList.mescroll#pageMescroll
      .contenter(v-show="goodsFlag")
        .bottomList
          ul.goodsList#box
            li(v-for="item in recommendGoods" , @click="goGoods(item.gspu_id)")
              img(:src="item.gi_image_url | img-filter" @click.prevent="")
              .wrapWords
                .text <span v-show="item.carryFlag">专柜提货</span> {{item.gi_name}}
                .price <span>实付</span>{{item.direct_supply_price | price-filter}}
                  span(v-if="false") 可省{{item.economize_price}}元
                .cabinetPrice <span>专柜价</span>{{item.counter_price | price-filter}}
                .bottom(v-if="false") <span>江苏南京</span><span>{{item.gi_salenum}}人购买</span>
      .bottomPlaceholder
    transition(name="slide-fade")
      .mask(v-show="maskFlag")
        .lefter(@click="lefterBack()")
        .righter
          filtrate(@ievent="ievent" :message="message")
</template>

<script>
  import filtrate from './filtrate.vue'
  import {mapState} from 'vuex'
  export default {
    name: 'commodityList',
    components: {filtrate},
    data () {
      return {
        jumps: this.$route.query.jumps, // 接收上个页面的参数判断是那个页面来的
        message: this.$route.query.msg, // 在输入框搜索的内容
        saveMsg: '', // 把每次搜索的关键字存储
        filtrateFlag: true, // 右侧筛选的显隐
        mescroll: null,
        flags: false,
        check: true,
        checked: false,
        change: false,
        change1: false,
        change2: false,
        recommendGoods: [],
        style: false,
        brandId: '', // 品牌的id
        minPrice: '', // 开始价格区间
        maxPrice: '', // 结束价格区间
        pickUps: '', // 自提不自提
        checkFlag: false,
        noKey: true,
        order: 0, // 字段排序
        keyWord: '', // 关键字
        sort: '', // 正序倒序
        maskFlag: false, // 蒙板的显隐
        goodsFlag: '', // 商品列表展示的显隐
        pages: 1, // 商品展示页码
        pageRows: 8, // 商品展示每页的长度
        flagNum: this.$route.query.flags, // 判断是筛选还是url传来的
        defaultRule: 1, // 默认规则
      }
    },
    computed: mapState(['location', 'position']),
    props: {
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: 'placeholder'
      }
    },
    watch: {
      '$route' (to, from) {
        if (from.path === '/goodsDetailed') {
          this.position.forEach((now) => {
            if (now.path === this.$route.path) {
              this.mescroll.scrollTo(now.y, 0)
            }
          })
        } else {
          if (this.$route.query.id) {
            this.message = this.$store.state.keywordsL
          } else if (this.$route.query.flags == 1) {
            this.message = this.$route.query.msg
          }
          if (this.$refs.oInput.value == this.$route.query.msg) {
            this.mescroll.resetUpScroll(true)
            this.mescroll.scrollTo(0, 0)
          }
        }
      }
    },
    destroyed () {

    },
    activated () {
      console.log(this.$route.query.msg)
      console.log(this.$refs.oInput.value)
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0)
        }
      })
      if (this.$route.query.id) {
        this.message = this.$store.state.keywordsL
      } else if (this.$route.query.flags == 1) {
        this.message = this.$route.query.msg
      }
      if (this.$refs.oInput.value == this.$route.query.msg) {
        this.check = true
        this.checked = false
        this.change = false
        this.change1 = false
        this.change2 = false
        this.order = 0
        this.sort = ''
        this.mescroll.resetUpScroll(true)
        this.mescroll.scrollTo(0, 0)
      }
    },
    mounted () {
      // 上拉加载
      this.$mescrollInt('pageMescroll', this.upCallback, () => {
        // this.position.forEach((now) => {
        //   if (now.path === this.$route.path) {
        //     this.mescroll.scrollTo(now.y, 0)
        //   }
        // })
      }, (obj) => {
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
      })
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn()
      this.mescroll.destroy()
    },
    methods: {
      // 当无订单时，将end去掉
      emptys () {
        let mescrollUpwarp = document.getElementsByClassName('mescroll-upwarp')[0]
        mescrollUpwarp.style.visibility = 'hidden'
      },
      // 回退事件
      backgo () {
        this.$router.go(-1)
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: 0
        })
      },
      // 遮罩层出现后不让页面滑动
      notScroll (e) {
        e.preventDefault()
      },
      // 进入商品详情
      goGoods (goodsId) {
        this.$router.push({
          path: '/goodsDetailed',
          query: {
            id: goodsId
          }
        })
      },
      // 筛选左滑
      leftScroll () {
        this.mescroll.hideTopBtn()
        this.maskFlag = true
        this.mescroll.lockDownScroll(true)
        this.mescroll.lockUpScroll(true)
        this.filtrateFlag = true
        let commodityList = document.getElementsByClassName('commodityList')[0]
        commodityList.style.overflow = 'hidden'
      },
      lefterBack () {
        this.maskFlag = false
        this.mescroll.lockDownScroll(false)
        this.mescroll.lockUpScroll(false)
        this.filtrateFlag = false
        let commodityList = document.getElementsByClassName('commodityList')[0]
        commodityList.style.overflow = 'scroll'
      },
      // 从筛选传值过来
      ievent (data) {
        this.flagNum = 2
        this.$store.commit('setKeyWords', data.brandName)
        this.saveMsg = data.brandName
        this.maskFlag = false
        this.goodsFlag = true
        this.mescroll.lockDownScroll(false)
        this.mescroll.lockUpScroll(false)
        let commodityList = document.getElementsByClassName('commodityList')[0]
        if (data.flag1 === true) {
          commodityList.style.overflow = 'scroll'
          if (data.pickUps === '可自提') {
            this.pickUps = 1
          }
          if (data.pickUps === '不可自提') {
            this.pickUps = 2
          }
          this.brandId = data.brandId
          this.message = data.brandName
          this.maxPrice = data.maxPrice
          this.minPrice = data.minPrice
          this.checkFlag = true
        }
        if (data.flag1 == false) {
          commodityList.style.overflow = 'scroll'
          if (data.pickUps == '可自提') {
            this.pickUps = 1
          }
          if (data.pickUps == '不可自提') {
            this.pickUps = 2
          }
          this.brandId = ''
          this.maxPrice = data.maxPrice
          this.minPrice = data.minPrice
          this.checkFlag = true
        }
        this.$router.replace({path: '/page/commodityList', query: {id: data.brandId, jumps: this.$route.query.jumps}})
        this.mescroll.scrollTo(0, 0)
        this.mescroll.resetUpScroll(true)
      },

      // 综合排序
      changes1: function () {
        this.change1 = !this.change1
        this.change2 = false
        this.change = false
        this.check = true
        this.checked = false
        this.goodsFlag = false
        if (this.change1 == true) {
          this.order = 1
        } else {
          this.order = ''
        }
        this.mescroll.resetUpScroll(true)
      },
      // 销量排序
      changes2: function () {
        this.change2 = !this.change2
        this.change1 = false
        this.change = false
        this.check = true
        this.checked = false
        this.goodsFlag = false
        if (this.change2 == true) {
          this.order = 2
        } else {
          this.order = ''
        }
        this.mescroll.resetUpScroll(true)
      },
      exchange: function () {
        this.goodsFlag = true
        this.flags = !this.flags
        this.style = !this.style
        let box = document.getElementById('box')
        let classVal = box.getAttribute('class')
        if (this.style == true) {
          classVal = classVal.replace('goodsList', 'toggle')
          box.setAttribute('class', classVal)
        }
        if (this.style == false) {
          classVal = classVal.replace('toggle', 'goodsList')
          box.setAttribute('class', classVal)
        }
      },
      // 价格排序
      liftOrSort () {
        this.checked = !this.checked
        this.check = !this.check
        this.check = this.checked
        this.change = true
        this.change1 = false
        this.change2 = false
        this.goodsFlag = false

        this.order = 3
        if (this.check == false) {
          this.sort = 2
        }
        if (this.check == true) {
          this.sort = 1
        }
        this.mescroll.resetUpScroll(true)
      },
      upCallback: function (page) {
        let self = this
        this.getListDataFromNet(page.num, page.size, function (curPageData) {
          if (page.num === 1) self.recommendGoods = []
          self.recommendGoods = self.recommendGoods.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr()
        })
      },
      getListDataFromNet (pageNum, pageSize, successCallback, errorCallback) {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goodsSearch/spus',
          params: {
            page: pageNum, // 页码
            rows: pageSize, // 每页长度
            carryType: self.pickUps, // 自提不自提
            startPrice: self.minPrice, // 开始价格区间
            endPrice: self.maxPrice, // 结束价格区间
            bi_id: self.brandId, // 品牌的id
            sortType: self.sort, // 正序倒序
            keywords: self.message, // 关键字
            sortFieldType: self.order, // 字段排序
            searchRuleConstant: self.defaultRule, // 默认规则
            city_no: 100100 // 当前城市编号
          }
        }).then(function (response) {
          self.goodsFlag = true
          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].carry_type === 1) {
              response.data.data[i].carryFlag = true
            }
            if (response.data.data[i].carry_type === 2) {
              response.data.data[i].carryFlag = false
            }
          }
          successCallback && successCallback(response.data.data) // 成功回调
          // }
          if (self.recommendGoods.length === 0) {
            self.brandId = '' // 品牌的id
            self.minPrice = '' // 开始价格区间
            self.maxPrice = '' // 结束价格区间
            self.pickUps = '' // 自提不自提
            self.rReset = 'no' // 重置筛选
            self.$router.push({path: '/home/searchHistory', query: {relNum: 1, messages: self.message, jumps: self.jumps}})
          }
        })
      },

      // 请求
      request () {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goodsSearch/spus',
          params: {
            page: self.pages, // 页码
            rows: self.pageRows, // 每页长度
            carryType: self.pickUps, // 自提不自提
            startPrice: self.minPrice, // 开始价格区间
            endPrice: self.maxPrice, // 结束价格区间
            bi_id: self.brandId, // 品牌的id
            sortType: self.sort, // 正序倒序
            keywords: self.message, // 关键字
            sortFieldType: self.order, // 字段排序
            searchRuleConstant: self.defaultRule, // 默认规则
            city_no: 100100 // 当前城市编号
          }
        }).then(function (response) {
          self.recommendGoods = response.data.data
          if (self.recommendGoods.length <= 0) {
            self.brandId = '' // 品牌的id
            self.minPrice = '' // 开始价格区间
            self.maxPrice = '' // 结束价格区间
            self.pickUps = '' // 自提不自提
            self.rReset = 'no' // 重置筛选
            self.$router.push({path: '/home/searchHistory', query: {relNum: 1, messages: self.message, jumps: self.jumps}})
          } else {
            self.goodsFlag = true
            for (let i = 0; i < self.recommendGoods.length; i++) {
              if (self.recommendGoods[i].carry_type === 1) {
                self.recommendGoods[i].carryFlag = true
              }
              if (self.recommendGoods[i].carry_type === 2) {
                self.recommendGoods[i].carryFlag = false
              }
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  #pageMescroll {
    position: fixed;
    top: 1.3rem;
    bottom: 0;
    /*height: auto;*/
    z-index: 100;
  }
  .active{
    background-color: #fff;
    color: rgb(244,0,87) !important;
  }
  .commodityList{
    width: 100%;
    min-height: 100vh;
    background: rgb(242,242,242);
    padding-bottom: 2rem;
    /*margin-top: 1.3rem;*/
  }
  /*顶部搜索--开始*/
  .topCenter{
    position: relative;
  }
  .topRight{
    margin-right: .1rem;
  }
  .topRight img{
    width: .7rem;
    vertical-align: middle;
  }
  .topRight .searchbtn{
    font-size: .4rem;
    font-weight: 400;
    color: rgb(244,0,87);
  }
  /*顶部搜索--结束*/
  /*搜索框样式--开始*/
  .searchInput{
    width: 6.5rem;
    height: .7rem;
    background-color: rgb(238,238,238);
    border-radius: .9rem;
    line-height: .7rem;
  }
  .searchInput img{
    width: .4rem;
    vertical-align: middle;
    margin-left: .2rem;
  }
  .searchInput input{
    width: 80%;
    border: 0;
    outline: none;
    font-size: .3rem;
    margin-left: .4rem;
    background-color: rgb(238,238,238);
  }
  /*搜索框样式--结束*/
  /*中间内容部分顶部左边--开始*/
  .contenter{

  }
  ul.wrap{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 1.23rem;
    padding: 0 .3rem;
    background-color: #fff;
    position: fixed;
    top: 1.29rem;
    z-index: 101;
    border-top: 1px solid #f2f2f2;
    border-bottom: 1px solid #f0f0f0;
  }
  ul.wrap li{
    font-size: .4rem;
    text-align: center;
    line-height: 1.2rem;
    color: rgb(51,51,51);
  }
  li.left ul{
    display: flex;
  }
  li.left ul li{
    margin-right: 1rem;
  }
  /*中间内容部分顶部左边--结束*/
  /*中间内容部分顶部右边--开始*/
  li.right ul{
    display: flex;
  }
  li.right ul li.showStyle img{
    vertical-align: middle;
    width: .4rem;
    margin-top: -.1rem;
    margin-right: .1rem;
  }
  li.right ul li.price{
    display: flex;
  }
  li.right ul li.price .topDown{
    position: relative;
  }
  li.right ul li.price .topDown img{
    width: .3rem;
  }
  li.right ul li.price .topDown img.top{
    position: absolute;
    top: .35rem;
  }
  li.right ul li.price .topDown img.down{
    position: absolute;
    bottom: .35rem;
  }
  li.right ul li.filters{
    margin-left: .4rem;
  }
  li.right ul li.filters img{
    width: .4rem;
    vertical-align: middle;
    margin-top: -.1rem;
  }
  /*中间内容部分顶部右边--结束*/
  /*商品大图展示--开始*/
  .bottomList{
    margin-top: 1.2rem;
  }
  .goodsList{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: .2rem;
    background: rgb(242,242,242);
  }
  .goodsList li{
    border-radius: 5px;
    width: 48.7%;
    /*height: 7rem;*/
    margin-bottom: .25rem;
    background-color: #fff;
  }
  .goodsList li img{
    width: 100%;
    height: 4.5rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .goodsList li .wrapWords{
    width: 100%;
    padding: .1rem .1rem 0;
    /*height: 30%;*/
  }
  .text{
    line-height: 18px;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    font-size: .3rem;
    padding-top: .1rem;
  }
  .text span{
    margin-top: 10px;
    padding: .01rem .02rem;
    background-color: rgb(255, 232, 240);
    border: solid .5px #f70057;
    color: #f70057;
    border-radius: 4px;
    margin-right: .08rem;
  }
  .goodsList .price{
    margin: .2rem 0 .05rem;
    color: rgb(246, 0, 87);
    font-size: .5rem;
    display: flex;
    align-items: center;
  }
  .price span{
    font-weight: 500;
    font-size: .25rem !important;
    border: solid 1px rgb(246, 0, 87);
    padding: 0 .15rem;
    border-radius: .5rem;
  }
  .cabinetPrice {
    margin-bottom: .2rem;
    padding: 0 .1rem;
    color: rgb(119,119,119);
  }
  .bottom{
    margin: .1rem;
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
  }
  /*商品大图展示--结束*/
  /*切换成列表模式的样式--开始*/
  .toggle{
    padding-top: .2rem;
  }
  .toggle li{
    margin-bottom: .2rem;
    background-color: #fff;
    padding: .2rem .3rem;
    display: flex;
    justify-content: space-between;
  }
  .toggle li img{
    width: 2.5rem;
    height: 2.5rem;
    border-radius: .1rem;
  }
  .toggle li .wrapWords{
    width: 0;
    margin-left: .3rem;
    background-color: #fff;
    flex-grow: 1;
  }
  .toggle .wrapWords .text{
    width: 100%;
    /*margin-top: .1rem;*/
    padding-top: .2rem;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  .toggle .wrapWords .price{
    width: 100%;
    /*margin: .2rem 0;*/
    padding-top: .4rem;
    color: rgb(246,0,87);
    /*font-weight: 600;*/
    font-size: .4rem;
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
  }
  .toggle .bottom{
    margin: .3rem .1rem 0;
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
  }
  /*切换成列表模式的样式--结束*/
  /*蒙板--开始*/
  .mask{
    background-color: rgba(0,0,0,0.3);
    position: fixed;
    top: 0;
    /*left: 110%;*/
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 105;
    display: flex;
  }
  .mask .lefter{
    width: 30%;
    height: 100vh;
    position: absolute;
    left: 0;
  }
  .mask .righter{
    width: 70%;
    height: 100vh;
    position: absolute;
    right: 0;
    overflow: scroll;
  }
  /*蒙板--结束*/
  .bottomPlaceholder{
    /*height: 0;*/
  }
  .scrollWarpClass{
    z-index: 103 !important;
  }


  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(100px);
    opacity: 0;
  }

  .slide-enter-active{
    transition: all .1s linear;
  }
  .slide-leave-active{
    transition: all .1s linear;
  }
  .slide-enter, .slide-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-10px);
    opacity: 0;
  }
</style>
