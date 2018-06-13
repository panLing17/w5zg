<template lang="pug">
  .homeGuide(v-if="GuideFlag")
    .one.cover(v-if="index === 0", @click="next")
      .inner
      .tips
        img(src="../../../assets/img/ic_guide_life.png")
        .content
          p "地址管理，密码修改在这"
          button.iSee 知道啦
    .two.cover(v-if="index === 1", @click="next")
      .inner
      .tips
        img(src="../../../assets/img/ic_guide_ul1.png")
        .content
          p "预约体验，现金券/通用券在这"
          button.iSee 知道啦
</template>

<script>
  export default {
    name: 'home-guide',
    data(){
      return {
        flag: false,
        index: -1
      }
    },
    mounted(){
      setTimeout(()=>{
        this.init()
      },1000)

    },
    activated () {
      setTimeout(()=>{
        this.init()
      },1000)
    },
    computed:{
      GuideFlag () {
        return this.flag
      }
    },
    methods:{
      init () {
        this.index = 0
        if (localStorage.hasOwnProperty('myGuide')) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      next(){
        if (this.index === 1) {
          localStorage.setItem('myGuide','true')
        }
        if (this.index<2) {
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
    background-color: rgba(0,0,0,0);
    z-index: 102;

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
    left: .15rem;
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
    left: 0;
    top: 8.75rem;
    width: 10rem;
    height: 2.25rem;
    box-shadow: rgba(0,0,0,.7) 0 0 0 2017px;
    z-index: 100;
  }
  .two .tips{
    left: 1rem;
    top: 6rem;
  }
  .two .content{
    left: 1.5rem;
    top: -3.5rem;
  }
</style>
