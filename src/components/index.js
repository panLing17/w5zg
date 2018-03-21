import Vue from 'vue'
import wCheckbox from './checkbox'
import navBar from './navBar'
import wInput from './input'
import slideShow from './slideShow'
import searchInput from './searchInput'
import wButton from './button'
//轮播
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
