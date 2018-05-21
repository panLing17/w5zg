import Vue from 'vue'
import view from './index.vue'

Vue.prototype.$shareTest = function (object) {
  let $vm
  const $view = Vue.extend(view)
  $vm = new $view()
  $vm.$mount()
  document.body.appendChild($vm.$el)
  if (object.sharePhoto) {
    $vm.sharePhoto = object.sharePhoto
  }
  if (object.shareTitle) {
    $vm.shareTitle = object.shareTitle
  }
  if (object.shareDesc) {
    $vm.shareDesc = object.shareDesc
  }
  console.log(object.handleSuccess)
  if (object.handleSuccess) {
    $vm.handleSuccess = object.handleSuccess
  }
}
export default Vue
