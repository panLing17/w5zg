import Vue from 'vue'
import wCheckbox from './checkbox'
import navBar from './navBar'
import wInput from './input'
import slideShow from './slideShow'
import searchInput from './searchInput'
import wButton from './button'
// ios风格开关
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)
// 推荐商品
import recommend from './recommend'
Vue.component('w-recommend', recommend)
// 数字选择器
import wCounter from './counter'
Vue.component('w-counter', wCounter)
// 图片上传
import upload from './upload'
Vue.component('w-upload', upload)
// 轮播
import Carousel from 'vue-m-carousel'
Vue.component('w-checkbox', wCheckbox)
Vue.component('nav-bar', navBar)
Vue.component('w-input', wInput)
Vue.component('slideShow',slideShow)
Vue.component('searchInput',searchInput)
Vue.component('carousel', Carousel)
Vue.component('w-button', wButton)
// 二维码
import VueQrcode from '@xkeshi/vue-qrcode'
Vue.component('qrcode', VueQrcode)
