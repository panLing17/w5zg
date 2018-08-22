import Vue from 'vue'
import advert from './advert.vue'

const AdvertConstructor = Vue.extend(advert) // 直接将Vue组件作为Vue.extend的参数


const Advert = (content) => {

  const AdvertInstance = new AdvertConstructor({
    data: {
      content: content
    }
  }) // 实例化一个带有content内容的Notice
  AdvertInstance.vm = AdvertInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  AdvertInstance.dom = AdvertInstance.vm.$el
  document.getElementById('goodsList').getElementsByClassName('list')[0].appendChild(AdvertInstance.dom) // 将dom插入body
  return AdvertInstance.vm
}

export default {
  install: Vue => {
    Vue.prototype.$advert = Advert // 将Notice组件暴露出去，并挂载在Vue的prototype上
  }
}
