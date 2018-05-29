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
import Common from '../views/common/index'
//搜商圈
import TradingArea from '../views/home/src/tradingArea/index'

Vue.use(Router)
const router = new Router ({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: User.login,
      meta: {
        keepAlive: true
      },
      children: [
        {
          path: '',
          redirect: '/login/login2'
        },
        {
          path: '/login/login1',
          name: '账号登录',
          component: User.login1,
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/login/login2',
          name: '验证码登录',
          component: User.login2,
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/register1',
      name: '注册1',
      component: User.register1,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/register2',
      name: '注册2',
      component: User.register2,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/regOver',
      name: '注册完成',
      component: User.regOver,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/forget1',
      name: '忘记密码1',
      component: User.forget1,
      meta: {
        keepAlive: true
      }
    },{
      path: '/forget2',
      name: '忘记密码2',
      component: User.forget2,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/firstPayPassword',
      name: '首次设置支付密码',
      component: User.firstPayPassword,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/goodsDetailed',
      name: '商品详情',
      meta: {
        keepAlive: true
      },
      component: Goods.goodsDetailed
    }, {
      path: '/service',
      name: '在线客服',
      component: Goods.service,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/confirmOrder',
      name: '确认订单',
      component: Goods.confirmOrder,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/payment',
      name: '支付',
      component: Goods.payment,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/download/labourunion',
      name: '工会APP下载',
      component: Common.downloadGh,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/download',
      name: 'APP下载',
      component: Common.download,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/registerTicket',
      name: '注册领券',
      component: Common.registerTicket,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/',
      name: '应用',
      component: Main,
      redirect: '/home',
      children: [
        {
          path: '/searchTradingArea',
          name: '搜商圈',
          component: TradingArea.tradingArea,
          meta: {
            keepAlive: true
          }
        },
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
              component: Headlines.detail,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/home/largeCollection',
              name: '二级活动',
              component: Home.largeCollection,
              meta: {
                keepAlive: true
              }
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
          meta: {
            keepAlive: true
          },
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
              component: My.my,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/settings',
              name: '我的设置',
              component: My.settings,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/userinfo',
              name: '我的用户资料',
              component: My.userinfo,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/nickname',
              name: '我的昵称',
              component: My.nickname,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/accountBind',
              name: '我的账户绑定',
              component: My.accountBind,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/accountSafety',
              name: '我的账户安全',
              component: My.accountSafety,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/updatePassword1',
              name: '修改登录密码与支付密码',
              component: My.updatePassword1,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/updatePassword2',
              name: '修改登录登录密码与支付密码验证码验证',
              component: My.updatePassword2,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/changeMobile1',
              name: '更换手机号1',
              component: User.changeMobile1,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/changeMobile2',
              name: '更换手机号2',
              component: User.changeMobile2,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/localAdmin',
              name: '收货地址管理',
              component: My.localAdmin,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/localAdd',
              name: '新增收货地址',
              component: My.localAdd,
              meta: {
                keepAlive: true
              }
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
              component: MyOrder.orderManage,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/orderDetails',
              name: '订单详情',
              component: MyOrder.orderDetails,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/checkLogistics',
              name: '查看物流',
              component: MyOrder.checkLogistics,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/searchOrder',
              name: '查看物流',
              component: MyOrder.searchOrder,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/applyAfterSale',
              name: '申请售后',
              component: AfterSale.applyAfterSale,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/returnDetails',
              name: '退货详情',
              component: AfterSale.returnDetails,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/selectService',
              name: '选择服务方式',
              component: AfterSale.selectService,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/refundReturn',
              name: '申请退款退货',
              component: AfterSale.refundReturn,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/refundAfterSale',
              name: '申请退款退货',
              component: AfterSale.refundAfterSale,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/express',
              name: '填写快递',
              component: AfterSale.express,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/checkAddressee',
              name: '填写收件人',
              component: AfterSale.checkAddressee,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/grantCard',
              name: '发放现金券',
              component: MyAccount.grantCard,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/accountCashB',
              name: '我的现金券B',
              component: MyAccount.accountCashB,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/cashDetailB',
              name: '现金券明细B',
              component: MyAccount.cashDetailB,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/grantCardRandom',
              name: '随机发放现金券',
              component: MyAccount.grantCardRandom,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/accountCardC',
              name: '我的现金券C',
              component: MyAccount.accountCardC,
              meta: {
                keepAlive: true
              },
              children:[
                {
                  path: '',
                  component: MyAccount.useDetail,
                  meta: {
                    keepAlive: true
                  }
                },
                {
                  path: '/my/useDetail/:id',
                  name: '现金券使用详情C',
                  component: MyAccount.useDetail,
                  meta: {
                    keepAlive: true
                  }
                }
              ]
            },
            {
              path: '/my/cashDetailC',
              name: '现金券明细C',
              component:MyAccount.cashDetailC,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/accountUniversalC',
              name: '通用券C',
              component:MyAccount.accountUniversalC,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/accountB',
              name: '我的账户B',
              component:MyAccount.accountB,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/accountDetail/:id',
              name: '账户明细',
              component:MyAccount.accountDetail,
              meta: {
                keepAlive: true
              },
              children: [
                {
                  path: '',
                  component:MyAccount.accountDetailContent,
                  meta: {
                    keepAlive: true
                  }
                },
                {
                  path: '/my/accountDetailContent/:id/:type',
                  name: '账户明细内容',
                  component:MyAccount.accountDetailContent,
                  meta: {
                    keepAlive: true
                  }
                }
              ]
            },
            {
              path: '/my/withdrawals',
              name: '提现',
              component:MyAccount.withdrawals,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/chooseBankCard',
              name: '选择银行卡',
              component:MyAccount.chooseBankCard,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/addBankCard',
              name: '添加银行卡',
              component: MyAccount.addBankCard,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/addBankConfirm',
              name: '添加银行卡验证页',
              component: MyAccount.addBankConfirm,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/revenue',
              name: '预计收入明细',
              component:MyAccount.revenue,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/accountC',
              name: '账户明细C',
              component:MyAccount.accountC,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/receiveTicket',
              name: '领取现金券',
              component: MyAccount.receiveTicket,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/footMark',
              name: '足迹',
              component:My.footMark,
              meta: {
                keepAlive: true
              }
            },
            {
              path: '/my/promote',
              name: '申请商户资质',
              component: MyAccount.promote,
              meta: {
                keepAlive: true
              }
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
  if (to.name === '首页' || to.name === '我的' || to.name === '分类' || to.name === '购物车' || to.name === '搜商圈') {
    store.state.footerShow = true
  }else {
    store.state.footerShow = false
  }
  next()
})
export default router
