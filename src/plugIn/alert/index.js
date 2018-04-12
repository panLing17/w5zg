import Vue from 'vue'
import Alert from './alert.vue'

let vm
const $view = Vue.extend(Alert)
vm = new $view()
vm.$mount()
Vue.prototype.$alert = function (title,value) {
  document.body.appendChild(vm.$el)
  vm.show = true
  vm.title = title ? title : '默认标题'
  vm.value = value ? value : '默认内容'
}
export default Vue
