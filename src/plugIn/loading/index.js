import Vue from 'vue'
import Loading from './loading.vue'
function onTouchMove(inFlag) {
  if (inFlag) {
    document.addEventListener('touchmove', onHandler, false);
  } else {
    document.removeEventListener('touchmove', onHandler, false);
  }
}
function onHandler(e) {
  e.preventDefault();
}
let $vm
const $view = Vue.extend(Loading)
$vm = new $view()
$vm.$mount()
Vue.directive('loading', function (el, binding) {
  $vm.show = binding.value
  if (binding.value) {
    el.appendChild($vm.$el)
    onTouchMove(true)
    document.body.style.overflow='hidden'
    document.body.style.height="100vh"
  } else {
    setTimeout(function () {
      el.removeChild($vm.$el)
      onTouchMove(false)
      document.body.style.overflow='auto'
    }, 800)
  }
})
export default Vue
