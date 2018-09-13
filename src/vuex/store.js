import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const state = {
  userData: '',
  // 记录上页定位及路径
  position:[
    {path: '/home', y: 0}
  ],
  shoppingCount: 0,
  viewDirection: 'slide-fade',
  footerShow:false,
  location: {
    province:{
      name: '江苏省',
      id: 320000
    },
    city:{
      name: '南京市',
      id: 320100
    },
    area:{
      name: '玄武区',
      id: 320102
    }
  },
  // skuId(规格ID)
  skuId: '',
  // sku logo图
  skuImg: '',
  // 购物车商品数量
  shoppingCartGoodsNum: {
    carryNum:0,
    sendNum:0
  },
  // 收藏夹全选
  collectionCheckedAll: false,
  // 购物车全选
  shoppingCartAllChecked: false,
  // 是否触发购物车全部反选
  exitAllChecked: true,
  // 购物车已选商品
  shoppingCartSelected: [],
  // 结算价格
  computedPrice: 0,
  // 推荐商品数据
  recommendGoods: [],
  // 收货地址
  giveGoodsAddress: {},
  nowLocation: [116.397428, 39.90923],
  // 数据中转（修改数据、查看详情等。用来带数据）
  transfer:[],
  // 头条详情内容
  headlinesDetail: "",
  // 退货商品信息
  returnGoods: {},
  // 首页领券成功显示标志
  showTicket: false,
  // 首页领券按钮是否显示标志
  showRegisterTicket: false,
  // 领券金额
  ticketMoney: 0,
  // 当前商品信息（客服处使用）
  nowGoodsData: {},
  // 推荐商品的额外插入广告，获取方法在main.vue的路由拦截
  recommendAdvert:{
    advert: [],
    tags: []
  },
  // 收藏商品
  collectGoods:[],
  // 到货传规格
  informGoods: null
}
const mutations = {
  setAddressM (state, data) {
    state.addressM = data
  },
  setInformNum (state, data) {
    state.informNum = data
  },
  setInformGoods (state, data) {
    state.informGoods = data
  },
  setCollectGoods (state, data) {
    state.collectGoods.push(data)
  },
  transferGive (state, data) {
    state.transfer = data
  },
  exitAllCheckedChange (state, data) {
    state.exitAllChecked = data
  },
  setPosition(state, data){
    let flag = 0
    for (let i in state.position) {
      if (state.position[i].path === data.path) {
        state.position[i] = data
      } else {
        flag += 1
      }
    }
    if(flag>=state.position.length){
      state.position.push(data)
    }
  },
  getLocation (state, data) {
    state.location = data
  },
  getRecommendGoods (state, data) {
    state.recommendGoods = data
  },
  getSkuId (state, data) {
    state.skuId = data
  },
  skuImgSave (state, data) {
    state.skuImg = data
  },
  shoppingCartGoodsNumChange (state, data) {
    if (data.hasOwnProperty('carryNum')) {
      state.shoppingCartGoodsNum.carryNum = data.carryNum
    }
    if (data.hasOwnProperty('sendNum')) {
      state.shoppingCartGoodsNum.sendNum = data.sendNum
    }
  },
  // 全选变化
  allCheckedChange (state, data) {
    state.shoppingCartAllChecked = data
  },
  // 结算价格变化
  computedPriceChange (state, data) {
    state.computedPrice = data
  },
  // 选中商品变化
  shoppingCartSelectedChange (state, data) {
    state.shoppingCartSelected = data
  },
  giveGoodsAddressChange (state, data) {
    state.giveGoodsAddress = data
  },
  userDataChange (state, data) {
    state.userData = data
  },
  getHeadlinesDetail (state, data) {
    state.headlinesDetail = data
  },
  getReturnGoods (state, data) {
    state.returnGoods = data
  },
  // 更改当前商品数据
  getNowGoodsData (state, data) {
    state.nowGoodsData = data
  },
  // 记录搜索发现的显隐
  getSearchDiscover(state, data) {
    state.searchFlag = data
  },
  setShowTicket (state, data) {
    state.showTicket = data
  },
  setShowRegisterTicket (state, data) {
    state.showRegisterTicket = data
  },
  setTicketMoney (state, data) {
    state.ticketMoney = data
  },
  // 获取推荐商品广告
  getRecommendAdvert (state, data) {
    if (data.type === 'tags') {
      state.recommendAdvert.tags = data.data
    }
    if (data.type === 'advert') {
      state.recommendAdvert.advert = data.data
    }

  },
  // 记录搜索商品的第几分页
  setPage (state, data) {
    state.pageNums = data
  },
  // 记录搜索商品的关键字
  setKeyWords (state, data) {
    state.keywordsL = data
  }
}
const actions = {
  login (context,data) {
    let vm = new Vue({})
    axios({
      method: 'post',
      url: vm.$apiMember + 'member/login',
      params: data,
    }).then(function (response) {
      if (response.data.optSuc){
        localStorage.setItem('token',response.data.data)
      }
    })
  },
  getDictionaries (context,data) {
    let vm = new Vue({})
    axios({
      method: 'get',
      url: vm.$apiMember + 'dic/all',
      params: {}
    }).then(function (response) {
      $codeList = response.data.data
    })
  }
}
const getters = {
  transfer: state => state.transfer,
  userData: state => state.userData,
  shoppingCartGoodsNum: state => state.shoppingCartGoodsNum
}
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})
