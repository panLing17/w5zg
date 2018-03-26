<template lang="pug">
  .shoppingCartBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 购物车
      .topRight(slot="right")
    .cartTypeTab
      ul
        li(@click="tabChange(0)", :class="{tabChecked:nowTab===0}")
          p 门店自提
          span(class="animated", :class="{rubberBand:flag,flipInY:!flag}") 1
        li(@click="tabChange(1)", :class="{tabChecked:nowTab===1}")
          p 快递配送
          span(class="animated", :class="{rubberBand:flag,swing:!flag}") 1
      p(:style="{left:nowTab*50+'%'}")

    button(@click="flag = !flag") 切换
    button(@click="http") 错误请求测试
    goods-card
</template>

<script>
  import goodsCard from './goodsCard'
  export default {
    name: 'home',
    data () {
      return {
        flag: true,
        nowTab: 0
      }
    },
    headers:{'X-Requested-with':'XMLHttpRequest'},
    components:{goodsCard},
    mounted () {
    },
    // 防止页面切换导致的返回顶部按钮回不去，在实例销毁前主动干掉
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods: {
      tabChange (num) {
        this.nowTab = num
      },
      http () {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + '/test',
          params: {},
        }).then(function (response) {
        })
      }
    }
  }
</script>

<style scoped>
  .shoppingCartBox {
    background-color: rgb(242,242,242);
  }
  .slider {
    margin-left: 30%;
    width: 100px;
    height: 100px;
    background: #aaaaaa;
  }
  /* 类型切换 */
  .cartTypeTab {
    position: relative;
    padding: 0 .2rem;
    background-color: white;
  }
  .cartTypeTab ul{
    display: flex;
    height: 1rem;
    justify-content: space-between;
  }
  .cartTypeTab li{
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: color .4s;
  }
  .cartTypeTab li span{
    margin-left: .1rem;
    padding: 0 .15rem;
    border-radius: .2rem;
    color: white;
    background-color: rgb(51,51,51);
    transition: background-color .4s;
  }
  .cartTypeTab>p{
    width: 50%;
    height: 2px;
    background-color: rgb(244,0,84);
    position: absolute;
    bottom: 0;
    transition: left .5s;
  }
  .tabChecked {
    color: rgb(244,0,84);
  }
  .tabChecked span{
    background-color: rgb(244,0,84) !important;
  }
</style>
