<template lang="pug">
  div.mainBox
    transition( :name="reversedMessage", mode="in-out")
      keep-alive
        router-view.child-view
    transition(name="fade" , mode="out-in")
      ul.bottomNav(v-if="$store.state.footerShow")
        li
          router-link(to='/home')
            p
              img(:src="routerPath=='/home'?require('../assets/img/logo2@3x.png'):require('../assets/img/homepage3@3x.png')")
            p(:class="{checked:routerPath=='/home'}") 首页
        li
          router-link(to='/page')
            p
              img(:src="routerPath=='/page'?require('../assets/img/classification4@3x.png'):require('../assets/img/classification3@3x.png')")
            p(:class="{checked:routerPath=='/page'}") 分类
        li
          router-link(:to="$route.matched[1].path !== '/shoppingCart' ? '/shoppingCart' : ''")
            span.count(v-if="shoppingCartCount>0") {{shoppingCartCount}}
            p
              img(:src="routerPath=='/shoppingCart'?require('../assets/img/shoppingcart4@3x.png'):require('../assets/img/shoppingcart3@3x.png')")
            p(:class="{checked:routerPath=='/shoppingCart'}") 购物车
        li
          router-link(to='/my')
            p
              img(:src="routerPath=='/my'?require('../assets/img/mine4@3x.png'):require('../assets/img/mine3@3x.png')")
            p(:class="{checked:routerPath=='/my'}") 我的
</template>

<script>
  import store from '../vuex/store.js'
  import {bus} from '../bus'
  import {mapState} from 'vuex'

  export default {
    name: 'mainView',
    data() {
      return {
        routerPath: this.$route.matched[1].path
      }
    },
    watch: {
      '$route' () {
        if (this.$route.matched[1]) {
          this.routerPath = this.$route.matched[1].path
        }
      },
      userData(newVal) {
        if (!newVal) {
          return
        } else {
          this.getGoodsNum()
        }
      }
    },
    store,
    computed: {
      reversedMessage: function () {
        // `this` 指向 vm 实例
        return this.$store.state.viewDirection
      },
      shoppingCartCount () {
        return this.shoppingCartGoodsNum.sendNum + this.shoppingCartGoodsNum.carryNum
      },
      ...mapState(['shoppingCartGoodsNum', 'userData'])
    },
    // 必须获取了推荐广告才可进入，防止异步导致的数据不同步
    // beforeRouteEnter(to, from, next) {
    //   if (store.state.recommendAdvert.advert.length>=1 && store.state.recommendAdvert.tags.length>=1) {
    //     next()
    //   } else {
    //     let count = 0
    //     let getAdvert = function () {
    //       let self = bus
    //       self.$ajax({
    //         method: 'get',
    //         url: self.$apiApp + 'acActivity/acActivityList',
    //         params: {
    //           type: '333'
    //         },
    //       }).then(function (response) {
    //         let data = {
    //           type: 'advert',
    //           data: response.data.data
    //         }
    //         count+=1
    //         store.commit('getRecommendAdvert', data)
    //         if (count>=2) {
    //           next()
    //         }
    //       })
    //     }
    //     let getTags = function () {
    //       let self = bus
    //       self.$ajax({
    //         method: 'get',
    //         url: self.$apiApp + 'acActivity/acActivityList',
    //         params: {
    //           type: '334'
    //         },
    //       }).then(function (response) {
    //         let oldData = []
    //         response.data.data.forEach((now) => {
    //           oldData.push({
    //             type: '334',
    //             data: now
    //           })
    //         })
    //         let data = {
    //           type: 'tags',
    //           data: oldData
    //         }
    //         count+=1
    //         store.commit('getRecommendAdvert', data)
    //         if (count>=2) {
    //           next()
    //         }
    //       })
    //     }
    //     getAdvert()
    //     getTags()
    //   }
    //   /*bus.$ajax.all([getAdvert(), getTags()]).then(() => {
    //     next()
    //   })*/
    // },
    mounted() {
      this.$data.transitionName = ''
    },
    methods: {
      getGoodsNum() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'shoppingCart/v2/countCartNum',
          params: {},
        }).then(function (response) {
          self.$store.commit('shoppingCartGoodsNumChange', response.data.data)
        })
      }
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .child-view {
    position: absolute;
    width: 100%;
    transition: all .2s cubic-bezier(.55, 0, .1, 1);
  }

  .bottomNav {
    background: white;
    padding: 0 .2rem;
    width: 100%;
    height: $height-footer;
    border-top: solid 1px #d7d7d7;
    position: fixed;
    z-index: 99;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .bottomNav > li {
    width: 20%;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .bottomNav > li p:first-child {
    font-size: 0;
  }
  .bottomNav > li p:last-child {
    font-size: .26rem;
    line-height: 1;
    margin: 0.05rem 0;
  }

  .bottomNav > li .count {
    background: white;
    padding: 0 .125rem;
    height: 18px;
    line-height: 18px;
    border-radius: 9px;
    position: absolute;
    top: -.02rem;
    margin-left: 5px;
    color: rgb(247,0,87);
    border: solid 1px rgb(247,0,87);
  }

  .bottomNav > li p > img {
    width: 1rem;
  }

  .bottomNav > li a {
    text-align: center;
    color: #777;
  }

  /*选中颜色*/
  .checked {
    color: rgb(245, 0, 87);
  }

</style>
