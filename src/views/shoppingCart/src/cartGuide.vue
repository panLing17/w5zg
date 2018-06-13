<template lang="pug">
  .cartGuide(v-if="GuideFlag")
    .one.cover(v-if="index === 0", @click="next")
      .inner
      .tips
        img(src="../../../assets/img/ic_guide_right.png")
        .content
          p "修改数量在这里"
          button.iSee 知道啦
    .two.cover(v-if="index === 1", @click="next")
      .inner
      .tips
        img(src="../../../assets/img/ic_guide_right.png")
        .content
          p "删除购物车内产品"
          button.iSee 知道啦
    .three.cover(v-if="index === 2", @click="next")
      .inner
      .tips
        .content
          p "查看门店自提的产品"
          button.iSee 知道啦
        img(src="../../../assets/img/ic_guide_life.png")
    .four.cover(v-if="index === 3", @click="next")
      .inner
      .tips
        .content
          p "可改为快递配送"
          button.iSee 知道啦
        img(src="../../../assets/img/ic_guide_life.png")
    .five.cover(v-if="index === 4", @click="next")
      .inner
      .tips
        .content
          p "查看快递配送的产品"
          button.iSee 知道啦
        img(src="../../../assets/img/ic_guide_right.png")
    .six.cover(v-if="index === 5", @click="next")
      .inner
      .tips
        .content
          p "可改为门店自提"
          button.iSee 知道啦
        img(src="../../../assets/img/ic_guide_life.png")
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'home-guide',
    data(){
      return {
        flag: false,
        index: 0
      }
    },
    computed:{
      GuideFlag () {
        if (this.flag && this.shoppingCartGoodsNum.carryNum>0 && this.shoppingCartGoodsNum.sendNum>0) {
          return true
        } else {
          return false
        }
      },
      ...mapState(['shoppingCartGoodsNum'])
    },
    watch:{
      GuideFlag (val) {
        if (val) {
          this.$parent.tabChange(0)
        }
      }
    },
    mounted(){
      this.init()
    },
    activated () {
      this.init()
    },
    methods:{
      init () {
        if (localStorage.hasOwnProperty('cartGuide')) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      next(){
        if (this.index === 3) {
          this.$parent.tabChange(1)
        }
        if (this.index === 5) {
          localStorage.setItem('cartGuide','true')
        }
        if (this.index<6) {
          this.index+=1
        }
      }
    }
  }
</script>

<style scoped>
  .cover{
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 102;
    background: transparent;
    overflow: hidden;
  }
  .tips {
    position: absolute;
    z-index: 101;
  }
  .tips .content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .tips p{
    color: white;
    font-size: .45rem;
    margin-bottom: .2rem;
    font-family: Webdings;
  }
  .tips>img{
    width: 2rem;
  }
  .iSee{
    padding: .1rem .5rem;
    border: solid 1px #fff;
    background: none;
    border-radius: .5rem;
    color: white;
    font-size: .4rem;
    font-family: Webdings;
  }
  /*-------------------------------------------*/
  .one .inner{
    position: absolute;
    right: .2rem;
    top: 2.35rem;
    width: 1rem;
    height: 1rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .one .tips{
    right: 0;
    top: 3.5rem;
  }
  .one .content{
    left: -4.5rem;
    top: -.5rem;
  }
  /*---------------------------------------------*/
  .two .inner{
    position: absolute;
    right: .1rem;
    top: 4.8rem;
    width: 1rem;
    height: 1rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .two .tips{
    right: -1rem;
    top: 6rem;
  }
  .two .content{
    left: -4.5rem;
    top: -.5rem;
  }
  /*---------------------------------------------*/
  .three .inner{
    position: absolute;
    left: 0;
    top: 1.2rem;
    width: 5rem;
    height: 1.1rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .three .tips{
    left: 1rem;
    top: 1rem;
  }
  .three .content{
    left: 2.5rem;
    top: 3rem;
  }
  /*---------------------------------------------*/
  .four .inner{
    position: absolute;
    left: 0;
    top: 4.7rem;
    width: 6rem;
    height: 1.1rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .four .tips{
    left: 2rem;
    top: 5rem;
  }
  .four .content{
    left: 2.5rem;
    top: 3rem;
  }
  /*---------------------------------------------*/
  .five .inner{
    position: absolute;
    right: 0;
    top: 1.2rem;
    width: 5rem;
    height: 1.1rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .five .tips{
    left: 6rem;
    top: .8rem;
  }
  .five .content{
    left: -5.5rem;
    top: 3rem;
    width: 5rem;
  }
  /*---------------------------------------------*/
  .six .inner{
    position: absolute;
    left: 0;
    top: 5.7rem;
    width: 6rem;
    height: 1.1rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .six .tips{
    left: 2rem;
    top: 5.5rem;
  }
  .six .content{
    left: 2.5rem;
    top: 3rem;
  }
</style>
