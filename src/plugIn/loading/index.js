import Vue from 'vue'
import Loading from './loading.vue'
let $vm
const $view = Vue.extend(Loading)
$vm = new $view()
$vm.$mount()
Vue.directive('loading', function (el, binding) {
  $vm.show = binding.value
  if (binding.value) {
    el.appendChild($vm.$el)
  } else {
    setTimeout(function () {
      el.removeChild($vm.$el)
    }, 800)
  }
})
export default Vue
