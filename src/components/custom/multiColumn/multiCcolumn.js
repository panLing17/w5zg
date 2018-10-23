import Vue from 'vue'
import multiColumn from './multiColumn.vue'

const MultiColumnConstructor = Vue.extend(multiColumn) // 直接将Vue组件作为Vue.extend的参数


const MultiCcolumn = (content) => {

  const MultiColumnInstance = new MultiColumnConstructor({
    propsData: {
      data: content.data
    }
  }) // 实例化一个带有content内容的Notice
  MultiColumnInstance.vm = MultiColumnInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  MultiColumnInstance.dom = MultiColumnInstance.vm.$el
  document.getElementById(content.id).appendChild(MultiColumnInstance.dom) // 将dom插入body
  return MultiColumnInstance.vm
}

export default {
  install: Vue => {
    Vue.prototype.$multiColumn = MultiCcolumn // 将Notice组件暴露出去，并挂载在Vue的prototype上
  }
}
