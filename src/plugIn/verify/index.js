import Vue from 'vue'
import Component from './verify.vue'
const VerifyConstructor = Vue.extend(Component)

const verify = function (options) {
  const {...rest} = options
  if (Vue.prototype.$isServer) return
  const instance = new VerifyConstructor({
    propsData: {
      ...rest
    }
  })

  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.verifyShow = true
  return instance.vm
}

export default (Vue) => {
  Vue.component(Component.name, Component)
  Vue.prototype.$verify = verify
  Vue.verify = verify
}
