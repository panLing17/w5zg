<template lang="pug">
  div.mainBox
    transition( :name="reversedMessage", mode="in-out")
      router-view.child-view
    ul.bottomNav
      li
        router-link(to='/home')
          p
            img(:src="$route.matched[1].path=='/home'?'static/img/bottom_home_checked.png':'static/img/bottom_home.png'")
          p(:class="{checked:$route.matched[1].path=='/home'}") 主页
      li
        router-link(to='/page')
          p
            img(:src="$route.matched[1].path=='/page'?'static/img/bottom_page_checked.png':'static/img/bottom_page.png'")
          p(:class="{checked:$route.matched[1].path=='/page'}") 分类
      li
        router-link(to='/cabinet')
          p
            img(:src="$route.matched[1].path=='/cabinet'?'static/img/bottom_cabinet_checked.png':'static/img/bottom_cabinet.png'")
          p(:class="{checked:$route.matched[1].path=='/cabinet'}") 生鲜柜
      li
        router-link(to='/shoppingCart')
          span.count(v-if="$store.state.shoppingCount>0") {{$store.state.shoppingCount}}
          p
            img(:src="$route.matched[1].path=='/shoppingCart'?'static/img/bottom_shoppingCart_checked.png':'static/img/bottom_shoppingCart.png'")
          p(:class="{checked:$route.matched[1].path=='/shoppingCart'}") 购物车
      li
        router-link(to='/my')
          p
            img(:src="$route.matched[1].path=='/my'?'static/img/bottom_my_checked.png':'static/img/bottom_my.png'")
          p(:class="{checked:$route.matched[1].path=='/my'}") 我的
</template>

<script>
  import store from '../vuex/store.js'

  export default {
    name: '主界面',
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
    color: #06c0aa;
  }
</style>
