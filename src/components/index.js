import Vue from 'vue'
import wCheckbox from './checkbox'
import navBar from './navBar'
import wInput from './input'
//import slideShow from './slideShow'
import searchInput from './searchInput'
import wButton from './button'
// ios风格开关
import ToggleButton from 'vue-js-toggle-button'
// 推荐商品
import recommend from './recommend'
// 数字选择器
import wCounter from './counter'
// 图片上传
import upload from './upload'
// 轮播
import Carousel from 'vue-m-carousel'
// 二维码
import VueQrcode from '@xkeshi/vue-qrcode'
Vue.use(ToggleButton)

Vue.component('w-recommend', recommend)

Vue.component('w-counter', wCounter)

Vue.component('w-upload', upload)

Vue.component('w-checkbox', wCheckbox)
Vue.component('nav-bar', navBar)
Vue.component('w-input', wInput)
//Vue.component('slideShow',slideShow)
Vue.component('searchInput',searchInput)
Vue.component('carousel', Carousel)
Vue.component('w-button', wButton)

Vue.component('qrcode', VueQrcode)
