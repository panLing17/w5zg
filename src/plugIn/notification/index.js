import Notification from './notification.vue'
import notify from './function-component.js'

export default (Vue) => {
  Vue.component(Notification.name, Notification)
  Vue.prototype.$notify = notify
  Vue.notify = notify
}
