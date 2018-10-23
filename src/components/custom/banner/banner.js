import Vue from 'vue'
import banner from './banner.vue'

const BannerConstructor = Vue.extend(banner) // 直接将Vue组件作为Vue.extend的参数


const Banner = (data) => {

  const BannerInstance = new BannerConstructor({
    propsData: {
      data: data
    }
  }) // 实例化一个带有content内容的Notice
  BannerInstance.vm = BannerInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  BannerInstance.dom = BannerInstance.vm.$el
  document.getElementById('bannerWrapper').appendChild(BannerInstance.dom) // 将dom插入body
  return BannerInstance.vm
}

export default {
  install: Vue => {
    Vue.prototype.$banner = Banner // 将Notice组件暴露出去，并挂载在Vue的prototype上
  }
}
