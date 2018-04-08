import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
Vue.use(Vuex)
const state = {
  userData: '',
  shoppingCount: 0,
  viewDirection: 'slide-fade',
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
  // 购物车商品数量
  shoppingCartGoodsNum: {
    carryNum:0,
    sendNum:0
  },
  // 推荐商品数据
  recommendGoods: [],
  // 收货地址
  giveGoodsAddress: {},
  nowLocation: [116.397428, 39.90923],
  // 数据中转（修改数据、查看详情等。用来带数据）
  transfer:[],
}
const mutations = {
  transferGive (state, data) {
    state.transfer = data
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
  shoppingCartGoodsNumChange (state, data) {
    if (data.hasOwnProperty('carryNum')) {
      state.shoppingCartGoodsNum.carryNum = data.carryNum
    }
    if (data.hasOwnProperty('sendNum')) {
      state.shoppingCartGoodsNum.sendNum = data.sendNum
    }
  },
  giveGoodsAddressChange (state, data) {
    state.giveGoodsAddress = data
  },
  userDataChange (state, data) {
    state.userData = data
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
        context.commit('userDataChange',response.data.data)
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
export default new Vuex.Store({
  state,
  mutations,
  actions
})
