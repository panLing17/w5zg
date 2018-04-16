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
  // 记录原本的定位，销毁后重新赋值
  /* if (el.clientHeight > document.body.clientHeight) {
    $vm.height = document.body.clientHeight
  } */
  // let oldPosition = el.style.position
  $vm.show = binding.value
  if (binding.value) {
    el.appendChild($vm.$el)
    onTouchMove(true)
    document.body.style.overflow='hidden'
    document.body.style.height="100vh"
    // 防止父节点固定定位导致被遮罩处可拖动
    // el.style.position = 'relative'
  } else {
    setTimeout(function () {
      el.removeChild($vm.$el)
      onTouchMove(false)
      // document.body.style.overflow='auto'
      // el.style.position = oldPosition
    }, 800)
  }
})
export default Vue
