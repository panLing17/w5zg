import Vue from 'vue'
import view from './index.vue'

Vue.prototype.$shareSuccess = function (object) {
  let $vm
  const $view = Vue.extend(view)
  $vm = new $view()
  $vm.$mount()
  document.body.appendChild($vm.$el)
  if (object.ticketMoney) {
    $vm.ticketMoney = object.ticketMoney
  }
  $vm.visible = true
}
export default Vue
