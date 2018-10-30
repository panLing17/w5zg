import Vue from 'vue'
import transverseSliding from './transverseSliding.vue'

const TransverseSlidingConstructor = Vue.extend(transverseSliding)

const TransverseSliding = (options) => {
  const TransverseSlidingInstance = new TransverseSlidingConstructor({
    propsData: {
      data: options.data
    }
  })
  TransverseSlidingInstance.vm = TransverseSlidingInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  TransverseSlidingInstance.dom = TransverseSlidingInstance.vm.$el
  document.getElementById(options.id).appendChild(TransverseSlidingInstance.dom) // 将dom插入body
  return TransverseSlidingInstance.vm
}
export default {
  install: Vue => {
    Vue.prototype.$transverseSliding = TransverseSliding // 将Notice组件暴露出去，并挂载在Vue的prototype上
  }
}
