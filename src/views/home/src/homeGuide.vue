<template lang="pug">
  .homeGuide(v-if="flag")
    .one.cover(v-if="index === 0", @click="next")
      .inner
      .tips
        img(src="../../../assets/img/ic_guide_life.png")
        .content
          p "点击扫描二维码"
          button.iSee 知道啦
    .two.cover(v-if="index === 1", @click="next")
      .inner
      .tips
        img(src="../../../assets/img/ic_guide_right.png")
        .content
          p "点击输入搜索内容"
          button.iSee 知道啦
    .three.cover(v-if="index === 2", @click="next")
      .inner
      .tips
        img(src="../../../assets/img/ic_guide_right.png")
        .content
          p "点击联系客服"
          button.iSee 知道啦
    .four.cover(v-if="index === 3", @click="next")
      .inner
      .tips
        .content
          p "你要的大牌都在这"
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
      if (localStorage.hasOwnProperty('homeGuide')) {
        this.flag = false
      } else {
        this.flag = true
      }
    },
    methods:{
      next(){
        if (this.index === 3) {
          localStorage.setItem('homeGuide','true')
        }
        if (this.index<4) {
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
    left: .05rem;
    top: .15rem;
    width: 1rem;
    height: 1rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .one .tips{
    left: 1.2rem;
    top: 1rem;
  }
  .one .content{
    left: 2.2rem;
    top: -.5rem;
  }
  /*---------------------------------------------*/
  .two .inner{
    position: absolute;
    right: .75rem;
    top: .15rem;
    width: 1rem;
    height: 1rem;
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
    right: .05rem;
    top: .15rem;
    width: 1rem;
    height: 1rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .three .tips{
    right: 0;
    top: 1rem;
  }
  .three .content{
    left: -4rem;
    top: -.5rem;
  }
  /*---------------------------------------------*/
  .four .inner{
    position: absolute;
    left: 3rem;
    bottom: .1rem;
    width: 1.5rem;
    height: 1.5rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .four .tips{
    left: 3.5rem;
    bottom: 1.8rem;
  }
  .four .content{
    width: 4rem;
    left: 1.8rem;
    bottom: -.5rem;
  }
</style>
