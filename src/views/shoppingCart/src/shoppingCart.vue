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
          span(class="animated", :class="{rubberBand:flag}") 1
        li(@click="tabChange(1)", :class="{tabChecked:nowTab===1}")
          p 快递配送
          span(class="animated", :class="{swing:flag}") 1
      p(:style="{left:nowTab*50+'%'}")
    transition(name="fade", mode="out-in")
      router-view
    .title
      .line
      p 推荐
    w-recommend(:listData="recommendGoods", background="white")
    .settlement
      .left
        w-checkbox(v-model="isdefault")
        p 全选
      .right
        .prive 合计：￥200.00
        .button 结算(5)
</template>

<script>
  import goodsCard from './goodsCard'
  import disableGoods from './disableGoods'
  export default {
    name: 'home',
    data () {
      return {
        flag: false,
        isdefault: false,
        nowTab: 0,
        recommendGoods: [
          {
            image: ''
          },
          {
            image: ''
          },
          {
            image: ''
          },
          {
            image: ''
          }
        ]
      }
    },
    headers:{'X-Requested-with':'XMLHttpRequest'},
    components:{goodsCard, disableGoods},
    mounted () {
      if (this.$route.path === '/shoppingCart') {
        this.nowTab = 0
      } else {
        this.nowTab = 1
      }
    },
    methods: {
      tabChange (num) {
        this.nowTab = num
        if (num === 1) {
          this.$router.push('/shoppingCart/express')
        } else {
          this.$router.push('/shoppingCart')
        }
      },
      changeType () {
        this.flag = true
        setTimeout(()=>{
          this.flag = false
        },1000)
      }
    }
  }
</script>

<style scoped>
  .shoppingCartBox {
    background-color: rgb(242,242,242);
    padding-bottom: 3rem;
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
    z-index: 2;
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
  /* 华丽的分割线 */
  .title{
    height: .8rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
  }
  .line{
    height: 1px;
    width: 3rem;
    background: #999;
  }
  .title p{
    position: absolute;
    background: #f2f2f2 ;
    padding: 0 .2rem;
  }
  /* 提交部分 */
  .settlement {
    display: flex;
    justify-content: space-between;
    height: 1.2rem;
    width: 100%;
    background-color: white;
    position: fixed;
    bottom: 1.5rem;
  }
  .settlement .left{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: .2rem;
  }
  .settlement .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .settlement .right .button {
    width: 3rem;
    height: 100%;
    font-size: .3rem;
    margin-left: .2rem;
    color: white;
    background: rgb(244,0,84);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
