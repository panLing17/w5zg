<template lang="pug">
  .homeGuide(v-if="flag")
    .one.cover(v-if="index === 0", @click="next")
      .inner
      .tips
        .content
          p "请联系客服"
          button.iSee 知道啦
        img(src="../../../assets/img/ic_guide_ul.png")
    .two.cover(v-if="index === 1", @click="next")
      .inner
      .tips
        img(src="../../../assets/img/ic_guide_right.png")
        .content
          p "查看购物车商品"
          button.iSee 知道啦
    .three.cover(v-if="index === 2", @click="next")
      .inner
      .tips
        .content
          p "现金券抵扣最低价"
          button.iSee 知道啦
        img(src="../../../assets/img/ic_guide_ul1.png")
    .four.cover(v-if="index === 3", @click="next")
      .inner
      .tips
        .content
          p "产品规格选择"
          button.iSee 知道啦
        img(src="../../../assets/img/ic_guide_ul.png")
</template>

<script>
  export default {
    name: 'home-guide',
    data(){
      return {
        flag: false,
        index: 0
      }
    },
    mounted(){
      if (localStorage.hasOwnProperty('goodsGuide')) {
        this.flag = false
      } else {
        this.flag = true
      }
    },
    methods:{
      next(){
        if (this.index === 2) {
          this.scroll()
        }
        if (this.index === 3) {
          localStorage.setItem('goodsGuide','true')
        }
        if (this.index<4) {
          this.index+=1
        }
      },
      scroll () {
        // 选择规格元素距离最顶部大概为15.7rem,想要显示出来还要再加上页脚的高度
        let rem = 15.7
        let foot = 2.25
        let px = parseInt(document.getElementsByTagName('html')[0].style.fontSize) * (rem+foot)
        this.$parent.scrollTo(px - document.body.clientHeight,400)
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
    left: .25rem;
    bottom: 1px;
    width: .9rem;
    height: .9rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .one .tips{
    left: 1rem;
    bottom: 1rem;
  }
  .one .content{
    width: 4rem;
    left: 1.8rem;
    bottom: -.5rem;
  }
  /*---------------------------------------------*/
  .two .inner{
    position: absolute;
    right: .15rem;
    top: .15rem;
    width: .9rem;
    height: .9rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .two .tips{
    right: 0;
    top: 1rem;
  }
  .two .content{
    left: -4.5rem;
    top: -.5rem;
  }
  /*---------------------------------------------*/
  .three .inner{
    position: absolute;
    left: .1rem;
    top: 12rem;
    width: 3.8rem;
    height: .9rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .three .tips{
    left: 1rem;
    top: 7.5rem;
  }
  .three .content{
    width: 4rem;
    left: 1.8rem;
    bottom: -.5rem;
  }
  /*---------------------------------------------*/
  .four .inner{
    position: absolute;
    left: 0;
    bottom: 1rem;
    width: 10rem;
    height: 1rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .four .tips{
    left: 3.5rem;
    bottom: 2.7rem;
  }
  .four .content{
    width: 4rem;
    left: 1.8rem;
    bottom: -.5rem;
  }
</style>
