import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store.js'
import Message from 'vue-multiple-message'
// 用户操作（登录注册等）
import User from '../views/user/index.js'
// 主要操作页总路由
import Main from '../views/main'
// 首页
import Home from '../views/home/index.js'
// 分类
import Page from '../views/page/index.js'
// 购物车
import ShoppingCart from '../views/shoppingCart/index.js'
// 我的
import My from '../views/my/index.js'
// 订单管理
import MyOrder from '../views/my/src/myOrder/index.js'
// 售后
import AfterSale from '../views/my/src/afterSale/index.js'
// 商品相关
import Goods from '../views/goods/index.js'
// 账户
import MyAccount from '../views/my/src/myAccount/index.js'
// 头条
import Headlines from '../views/home/src/headlines/index'
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
    },{
      path: '/forget2',
      name: '忘记密码2',
      component: User.forget2
    }, {
      path: '/goodsDetailed',
      name: '商品详情',
      component: Goods.goodsDetailed
    }, {
      path: '/service',
      name: '在线客服',
      component: Goods.service
    }, {
      path: '/confirmOrder',
      name: '确认订单',
      component: Goods.confirmOrder
    }, {
      path: '/payment',
      name: '支付',
      component: Goods.payment
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
            },
            {
              path: '/home/citySearch',
              name: '城市搜索',
              component: Home.citySearch
            },
            {
              path: '/home/scan',
              name: '扫描',
              component: Home.scan
            },
            {
              path: '/home/scanSuccess',
              name: '扫描成功',
              component: Home.scanSuccess
            },
            {
              path: '/home/searchHistory',
              name: '搜索历史',
              component: Home.searchHistory
            },
            {
              path: '/home/searchResult',
              name: '搜索结果',
              component: Home.searchResult
            },
            {
              path: '/home/activities',
              name: '活动',
              component: Home.activities
            },
            {
              path: '/home/classification',
              name: '首页分类',
              component: Home.classification
            },
            {
              path: '/home/headlines',
              name: '头条',
              component: Headlines.headlines,
              children:[
                {
                  path: '',
                  component: Headlines.list
                },
                {
                  path: '/home/list/:cataId/:index',
                  name: '头条list',
                  component: Headlines.list
                }
              ]
            },
            {
              path: '/home/headlinesDetail',
              name: '头条详情',
              component: Headlines.detail
            },
            {
              path: '/home/largeCollection',
              name: '二级活动',
              component: Home.largeCollection
            },
            {
              path: '/home/sports',
              name: '三级活动',
              component: Home.sports
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
            },
            {
              path: '/page/commodityList',
              name: '商品列表',
              component: Page.commodityList
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
              component: ShoppingCart.shoppingCart,
              children: [
                {
                  path: '/',
                  name: '购物车',
                  component: ShoppingCart.giveSelf
                },
                {
                  path: '/shoppingCart/express',
                  name: '购物车',
                  component: ShoppingCart.express
                }
              ]
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
            },
            {
              path: '/my/settings',
              name: '我的设置',
              component: My.settings
            },
            {
              path: '/my/userinfo',
              name: '我的用户资料',
              component: My.userinfo
            },
            {
              path: '/my/nickname',
              name: '我的昵称',
              component: My.nickname
            },
            {
              path: '/my/accountBind',
              name: '我的账户绑定',
              component: My.accountBind
            },
            {
              path: '/my/accountSafety',
              name: '我的账户安全',
              component: My.accountSafety
            },
            {
              path: '/my/updatePassword1',
              name: '修改登录密码与支付密码',
              component: My.updatePassword1
            },
            {
              path: '/my/updatePassword2',
              name: '修改登录登录密码与支付密码验证码验证',
              component: My.updatePassword2
            },
            {
              path: '/my/changeMobile1',
              name: '更换手机号1',
              component: User.changeMobile1
            },
            {
              path: '/my/changeMobile2',
              name: '更换手机号2',
              component: User.changeMobile2
            },
            {
              path: '/my/localAdmin',
              name: '收货地址管理',
              component: My.localAdmin
            },
            {
              path: '/my/localAdd',
              name: '新增收货地址',
              component: My.localAdd
            },
            {
              path: '/my/feedback',
              name: '意见反馈',
              component: My.feedback
            },
            {
              path: '/my/aboutUs',
              name: '关于我们',
              component: My.aboutUs
            },
            {
              path: '/my/orderManage',
              name: '订单管理',
              component: MyOrder.orderManage
            },
            {
              path: '/my/orderDetails',
              name: '订单详情',
              component: MyOrder.orderDetails
            },
            {
              path: '/my/checkLogistics',
              name: '查看物流',
              component: MyOrder.checkLogistics
            },
            {
              path: '/my/searchOrder',
              name: '查看物流',
              component: MyOrder.searchOrder
            },
            {
              path: '/my/applyAfterSale',
              name: '申请售后',
              component: AfterSale.applyAfterSale
            },
            {
              path: '/my/returnDetails',
              name: '退货详情',
              component: AfterSale.returnDetails
            },
            {
              path: '/my/selectService',
              name: '选择服务方式',
              component: AfterSale.selectService
            },
            {
              path: '/my/refundReturn',
              name: '申请退款退货',
              component: AfterSale.refundReturn
            },
            {
              path: '/my/refundAfterSale',
              name: '申请退款退货',
              component: AfterSale.refundAfterSale
            },
            {
              path: '/my/express',
              name: '填写快递',
              component: AfterSale.express
            },
            {
              path: '/my/checkAddressee',
              name: '填写收件人',
              component: AfterSale.checkAddressee
            },
            {
              path: '/my/grantCard',
              name: '发放现金券',
              component: MyAccount.grantCard
            },
            {
              path: '/my/accountCashB',
              name: '我的现金券B',
              component: MyAccount.accountCashB
            },
            {
              path: '/my/cashDetailB',
              name: '现金券明细B',
              component: MyAccount.cashDetailB
            },
            {
              path: '/my/grantCardRandom',
              name: '随机发放现金券',
              component: MyAccount.grantCardRandom
            },
            {
              path: '/my/accountCardC',
              name: '我的现金券C',
              component: MyAccount.accountCardC,
              children:[
                {
                  path: '',
                  component: MyAccount.useDetail
                },
                {
                  path: '/my/useDetail/:id',
                  name: '现金券使用详情C',
                  component: MyAccount.useDetail
                }
              ]
            },
            {
              path: '/my/cashDetailC',
              name: '现金券明细C',
              component:MyAccount.cashDetailC
            },
            {
              path: '/my/accountUniversalC',
              name: '通用券C',
              component:MyAccount.accountUniversalC
            },
            {
              path: '/my/accountB',
              name: '我的账户B',
              component:MyAccount.accountB
            },
            {
              path: '/my/accountDetail/:id',
              name: '账户明细',
              component:MyAccount.accountDetail,
              children: [
                {
                  path: '',
                  component:MyAccount.accountDetailContent
                },
                {
                  path: '/my/accountDetailContent/:id/:type',
                  name: '账户明细内容',
                  component:MyAccount.accountDetailContent
                }
              ]
            },
            {
              path: '/my/withdrawals',
              name: '提现',
              component:MyAccount.withdrawals
            },
            {
              path: '/my/chooseBankCard',
              name: '选择银行卡',
              component:MyAccount.chooseBankCard
            },
            {
              path: '/my/addBankCard',
              name: '添加银行卡',
              component: MyAccount.addBankCard
            },
            {
              path: '/my/addBankConfirm',
              name: '添加银行卡验证页',
              component: MyAccount.addBankConfirm
            },
            {
              path: '/my/revenue',
              name: '预计收入明细',
              component:MyAccount.revenue
            },
            {
              path: '/my/accountC',
              name: '账户明细C',
              component:MyAccount.accountC
            },
            {
              path: '/my/receiveTicket',
              name: '领取现金券',
              component: MyAccount.receiveTicket
            },
            {
              path: '/my/footMark',
              name: '足迹',
              component:My.footMark
            },
            {
              path: '/my/promote',
              name: '申请商户资质',
              component: MyAccount.promote
            },
            {
              path: '/goods/paymentResults',
              name: '支付成功',
              component: Goods.paymentResults
            }
          ]
        }
      ]
    }
  ]
})
// 全局前置守卫
router.beforeEach ((to, from, next) => {
  window.scrollTo (0, 0)  // 页面回到顶部
  const list = ['首页', '分类', '购物车', '我的']  // 将需要切换效果的路由名称组成一个数组
  const toName = to.name  // 即将进入的路由名字
  const fromName = from.name  // 即将离开的路由名字
  const toIndex = list.indexOf (toName) // 进入下标
  const fromIndex = list.indexOf (fromName)  // 离开下标
  let direction = ''
  if (toIndex > -1 && fromIndex > -1) {  // 如果下标都存在
    if (toIndex < fromIndex) {     // 如果进入的下标小于离开的下标，那么是左滑
      direction = 'slide-left'
    } else {
      direction = 'slide-right'     // 如果进入的下标大于离开的下标，那么是右滑
    }
    store.state.viewDirection = direction // vuex赋值动画名
  }
  // 自动登录(先判断是否有token，在判断vuex中有无用户信息，防止重复登录)
  /* if (localStorage.hasOwnProperty('token') && store.state.userData === '') {
    let vm = new Vue({
      store
    })
    let form = {
      token: localStorage.getItem('token')
    }
    vm.$store.dispatch('login', form)
  } */
  // 获取字典(目前实现方式有弊端)
  if ($codeList === '') {
    let vm = new Vue({
      store
    })
    vm.$store.dispatch('getDictionaries')
  }
  // 购物车及我的页面权限处理
  if (to.name === '我的' || to.name === '购物车') {
    if (!localStorage.hasOwnProperty('token')) {
      Message.warning('请先登录')
      next({path:'/login'})
    } else {
      next()
    }
  } else {
    // 轮循解决字典异步问题(不满意)
    let polling = setInterval(()=>{
      if ($codeList !== '') {
        clearInterval(polling)
        next()
      }
    },10)
  }
  // 路由切换时隐藏页脚
  if (to.name === '首页' || to.name === '我的' || to.name === '分类' || to.name === '购物车') {
    store.state.footerShow = true
  }else {
    store.state.footerShow = false
  }
  next()


})
export default router
