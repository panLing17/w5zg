import Vue from 'vue'
import router from 'router/index'
import adTag from './adTag.vue'

const AdTagConstructor = Vue.extend(adTag) // 直接将Vue组件作为Vue.extend的参数


const AdTag = (content) => {

  const AdTagInstance = new AdTagConstructor({
    data: {
      content: content,
      router: router
    }
  }) // 实例化一个带有content内容的Notice

  AdTagInstance.vm = AdTagInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  AdTagInstance.dom = AdTagInstance.vm.$el
  document.getElementById('goodsList').getElementsByClassName('list')[0].appendChild(AdTagInstance.dom) // 将dom插入body
  return AdTagInstance.vm
}

export default {
  install: Vue => {
    Vue.prototype.$adTag = AdTag // 将Notice组件暴露出去，并挂载在Vue的prototype上
  }
}
