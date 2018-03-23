import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
Vue.use(Vuex)
const state = {
  userData: '',
  shoppingCount: 0,
  viewDirection: 'slide-fade',
  locationId: {
    provinceId: 330000,
    cityId: 330300,
    areaId: 330303
  },
  // 推荐商品数据
  recommendGoods: [],
  giveGoodsAddress: [],
  nowLocation: [116.397428, 39.90923],
  // 数据中转（修改数据、查看详情等。用来带数据）
  transfer:[],
}
const mutations = {
  transferGive (state, data) {
    state.transfer = data
  },
  getLocationId (state, data) {
    state.locationId = data
  },
  getRecommendGoods (state, data) {
    state.recommendGoods =data
  },
  giveGoodsAddressChange (state, data) {
    state.giveGoodsAddress = data
  },
  userDataChange (state, data) {
    state.userData = data
  },
  startFlagClose (state) {
    state.startFlag = false
  },
  nowLocationChange (state, data) {
    state.nowLocation = data
  },
  shoppingCountChange (state, num) {
    state.shoppingCount = num
  }
}
export default new Vuex.Store({
  state,
  mutations
})
