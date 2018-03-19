import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store.js'
// 用户操作（登录注册等）
import User from '../views/user/index.js'
// 主要操作页总路由
import Main from '../views/main'
// 首页
import Home from '../views/home/index.js'
// 分类
import Page from '../views/page/index.js'
// 生鲜柜
import Cabinet from '../views/cabinet/index.js'
// 购物车
import ShoppingCart from '../views/shoppingCart/index.js'
// 我的
import My from '../views/my/index.js'

Vue.use(Router)
const router = new Router ({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: User.login
    }, {
      path: '/register1',
      name: '注册1',
      component: User.register1
    }, {
      path: '/register2',
      name: '注册2',
      component: User.register2
    }, {
      path: '/regOver',
      name: '注册完成',
      component: User.regOver
    }, {
      path: '/forget1',
      name: '忘记密码1',
      component: User.forget1
    }, {
      path: '/',
      name: '应用',
      component: Main,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: '首页',
          component: Home.index,
          children: [
            {
              path: '/',
              name: '首页',
              component: Home.home
            }
          ]
        }, {
          path: '/page',
          name: '分类',
          component: Page.index,
          children: [
            {
              path: '/',
              name: '分类',
              component: Page.page
            }
          ]
        }, {
          path: '/cabinet',
          name: '生鲜柜',
          component: Cabinet.index,
          children: [
            {
              path: '/',
              name: '生鲜柜',
              component: Cabinet.cabinet
            }
          ]
        }, {
          path: '/shoppingCart',
          name: '购物车',
          component: ShoppingCart.index,
          children: [
            {
              path: '/',
              name: '购物车',
              component: ShoppingCart.shoppingCart
            }
          ]
        }, {
          path: '/my',
          name: '我的',
          component: My.index,
          children: [
            {
              path: '/',
              name: '我的',
              component: My.my
            }
          ]
        }
      ]
    }
  ]
})
// 全局前置守卫，下面是我上个项目实现左右滑动页面的例子
router.beforeEach ((to, from, next) => {
  window.scrollTo (0, 0)  // 页面回到顶部
  const list = ['首页', '分类', '生鲜柜', '购物车', '我的']  // 将需要切换效果的路由名称组成一个数组
  const toName = to.name  // 即将进入的路由名字
  const fromName = from.name  // 即将离开的路由名字
  const toIndex = list.indexOf (toName) // 进入下标
  const fromIndex = list.indexOf (fromName)  // 离开下标
  let direction = 'slide-fade'
  if (toIndex > -1 && fromIndex > -1) {  // 如果下标都存在
    if (toIndex < fromIndex) {     // 如果进入的下标小于离开的下标，那么是左滑
      direction = 'slide-left'
    } else {
      direction = 'slide-right'     // 如果进入的下标大于离开的下标，那么是右滑
    }
    store.state.viewDirection = direction // vuex赋值动画名
  }
  next ()
})
export default router
