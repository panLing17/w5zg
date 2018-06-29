<template lang="pug">
  .wrapSelectSize
    .cont
      .title 六款鞋款式任性选
      .goodsPic
        .left(@click="previousN()")
          img(src="../../../../../assets/img/10_choise_left_100.png" v-if="lMore" @click.prevent="")
          img(src="../../../../../assets/img/10_choise_left_40.png" v-else="lMore" @click.prevent="")
        .center
          .wrapImg(v-for="(item,index) in shoesPic" v-show="clickN === index")
            img(:src="item" @click.prevent="")
        .right(@click="nextN()")
          img(src="../../../../../assets/img/10_choise_rigth_40.png" v-if="rMore" @click.prevent="")
          img(src="../../../../../assets/img/10_choise_rigth_100.png" v-else="rMore" @click.prevent="")
      .styles
        .lefter 款式:
        ul.righter
          li(v-for="(item,index) in styleList", :class="{clicks:clickN == index}", @click="selectN(index)") {{item}}
      .sizes
        .lefter 尺码:
        .righter
          input(type="text")
      .prompt *请填写您需要的尺码，例如：男41码
      .submitB
        img(src="../../../../../assets/img/10_choise_submit_btn.png" @click.prevent="")
</template>
<script>
  import one from '../../../../../assets/img/10_choise_shoes_1.png'
  import two from '../../../../../assets/img/10_choise_shoes_2.png'
  import three from '../../../../../assets/img/10_choise_shoes_3.png'
  import four from '../../../../../assets/img/10_choise_shoes_4.png'
  import five from '../../../../../assets/img/10_choise_shoes_5.png'
  import six from '../../../../../assets/img/10_choise_shoes_6.png'
  export default {
    name: 'selectSize',
    data () {
      return {
        lMore: true, // 向左按钮
        rMore: false, // 向右按钮
        clickN: 0,
        styleList: ['A款', 'B款', 'C款', 'D款', 'E款', 'F款'],
        shoesPic: [ one, two, three, four, five, six]
      }
    },
    mounted () {

    },
    methods: {
      // 上一个
      previousN () {
        if (this.clickN > 0) {
          this.clickN -= 1
        }
        if (this.clickN <= 0) {
          this.clickN = 0
        }
        this.judgeN()
      },
      // 下一个
      nextN () {
        if (this.clickN < 5) {
          this.clickN += 1
        }
        if (this.clickN >= 5) {
          this.clickN = 5
        }
        this.judgeN()
      },
      judgeN () {
        if (this.clickN !== 0) {
          this.lMore = false
        } else {
          this.lMore = true
        }
        if (this.clickN !== 5) {
          this.rMore = false
        } else {
          this.rMore = true
        }
      },
      selectN (index) {
        this.clickN = index
        this.judgeN()
      }
    }
  }
</script>

<style scoped>
.clicks{
  background-color: #fff;
  color: #ff314f;
}
.wrapSelectSize{
  position: absolute;
  width: 100%;
  background-color: #ff314f;
  min-height: 100vh;
}
.cont{
  padding: .5rem .4rem 0;
}
.cont .title{
  color: #fff;
  font-size: .8rem;
  text-align: center;
  font-weight: 600;
}
.cont .goodsPic{
  padding-top: .3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cont .goodsPic .left img,
.cont .goodsPic .right img{
  width: .6rem;
}
.cont .goodsPic .center{
  margin: 0 .6rem;
}
.cont .goodsPic .center img{
  width: 6.5rem;
}
.styles{
  padding: .4rem .5rem 0;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .4rem;
}
.styles ul.righter{
  display: flex;
  width: 88%;
}
.styles ul.righter li{
  padding: 0 .1rem;
  margin-left: .25rem;
  border: 1px solid #fff;
}
.sizes{
  padding: .4rem .5rem 0;
  font-size: .4rem;
  display: flex;
  align-items: center;

}
.sizes .lefter{
  color: #fff;
}
.sizes .righter{
  width: 83%;
  height: .8rem;
  background-color: #fff;
  margin-left: .3rem;
  border-radius: .1rem;
}
.sizes .righter input{
  outline: none;
  border: 0;
  width: 100%;
  height: .8rem;
  border-radius: .1rem;
  font-size: .4rem;
}
.prompt{
  text-align: center;
  color: #fff;
  padding-top: .2rem;
}
.submitB{
  padding-top: .8rem;
  text-align: center;
}
.submitB img{
  width: 5rem;
}
.fadeIn-enter-active{
  transition: all 1s ease;
}
.fadeIn-leave-active{
  transition: all 1s ease;
}
.fadeIn-enter-active,.fadeIn-leave{
  opacity: 1;
}
.fadeIn-enter,.fadeIn-leave-active {
  opacity: 0;
}
</style>
