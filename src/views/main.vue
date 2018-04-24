<template lang="pug">
  div.mainBox
    transition( :name="reversedMessage", mode="in-out")
      router-view.child-view
    transition(name="fade" , mode="out-in")
      ul.bottomNav(v-if="$store.state.footerShow")
        li
          router-link(to='/home')
            p
              img(:src="$route.matched[1].path=='/home'?'static/img/homepage4@3x.png':'static/img/homepage3@3x.png'")
            p(:class="{checked:$route.matched[1].path=='/home'}") 主页
        li
          router-link(to='/page')
            p
              img(:src="$route.matched[1].path=='/page'?'static/img/classification4@3x.png':'static/img/classification3@3x.png'")
            p(:class="{checked:$route.matched[1].path=='/page'}") 分类
        li
          router-link(to='/shoppingCart')
            span.count(v-if="$store.state.shoppingCount>0") {{$store.state.shoppingCount}}
            p
              img(:src="$route.matched[1].path=='/shoppingCart'?'static/img/shoppingcart4@3x.png':'static/img/shoppingcart3@3x.png'")
            p(:class="{checked:$route.matched[1].path=='/shoppingCart'}") 购物车
        li
          router-link(to='/my')
            p
              img(:src="$route.matched[1].path=='/my'?'static/img/mine4@3x.png':'static/img/mine3@3x.png'")
            p(:class="{checked:$route.matched[1].path=='/my'}") 我的
</template>

<script>
  import store from '../vuex/store.js'

  export default {
    name: 'mainView',
    data () {
      return {}
    },
    store,
    computed: {
      reversedMessage: function () {
        // `this` 指向 vm 实例
        return this.$store.state.viewDirection
      }
    },
    mounted () {
      this.$data.transitionName = ''
    },
    methods: {
    },
    created () {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .child-view {
    position: absolute;
    width: 100%;
    transition: all .2s cubic-bezier(.55, 0, .1, 1);
  }

  .bottomNav {
    background: white;
    width: 100%;
    height: 1.6rem;
    border-top: solid 1px #eee;
    position: fixed;
    z-index: 99;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .bottomNav > li {
    width: 20%;
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  .bottomNav > li p {
    font-size: .35rem;
  }

  .bottomNav > li .count {
    background: rgba(255, 0, 0, 0.7);
    height: 18px;
    line-height: 18px;
    width: 18px;
    border-radius: 9px;
    position: absolute;
    top: -.06rem;
    margin-left: 10px;
    color: white;

  }

  .bottomNav > li p > img {
    height: .6rem;
  }

  .bottomNav > li a {
    text-align: center;
    color: #999;
  }

  /*选中颜色*/
  .checked {
    color: rgb(245,0,87);
  }
</style>
