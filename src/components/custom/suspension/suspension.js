import Vue from 'vue'
import suspension from './suspension.vue'

const SuspensionConstructor = Vue.extend(suspension)

const Suspension = (options) => {
  const SuspensionInstance = new SuspensionConstructor({
    propsData: {
      data: options.data
    }
  })
  SuspensionInstance.vm = SuspensionInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  SuspensionInstance.dom = SuspensionInstance.vm.$el
  document.getElementById(options.id).appendChild(SuspensionInstance.dom) // 将dom插入body
  return SuspensionInstance.vm
}

export default {
  install: Vue => {
    Vue.prototype.$suspension = Suspension // 将Notice组件暴露出去，并挂载在Vue的prototype上
  }
}
