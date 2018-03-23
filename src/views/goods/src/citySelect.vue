<template lang="pug">
  .citySelectBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-if="show")
        .title
          span 配送地址
          img(src="../../../assets/img/cancle@3x.png", @click="close")
        .tabBox
          transition-group(enter-active-class="animated bounceInLeft", leave-active-class="animated fadeOut").tab
            li(v-if="selectType > 0 || selectType === 0 ", :class="{selected:selectType === 0}", key="0", @click="tab(0)") 江苏省
            li(v-if="selectType > 1 || selectType === 1 ", :class="{selected:selectType === 1}", key="1", @click="tab(1)") 江苏市
            li(v-if="selectType > 2 || selectType === 2 ", :class="{selected:selectType === 2}", key="2", @click="tab(2)") 江苏区
          .slider(:style="{marginLeft:2 * selectType + 'rem'}")
        ul.list
          li(@click="selectType+=1") 南京
          li(@click="selectType-=1") 北京
          li 南京
          li 北京
</template>

<script>
  export default {
    name: "city-select",
    data () {
      return {
        // 当前选择的类型，0为选择省，1为市，2为区
        selectType: 0
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    methods:{
      close () {
        this.$emit('close')
      },
      typeClick (type) {
        this.selectType = type
      },
      tab (num) {
        this.selectType = num
      }
    }
  }
</script>

<style scoped>
  .citySelectBox {

  }

  .bg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
  }

  .main {
    background-color: white;
    width: 100%;
    height: 7rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1rem;
    font-size: .4rem;
    position: relative;
  }
  .title img{
    position: absolute;
    right: .2rem;
    width: .4rem;
  }
  .tab{
    display: flex;
    border-bottom: solid 1px #ccc;
  }
  .tab li{
    width: 2rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .3rem;
    color: rgb(255,128,171);
  }
  .selected {
    color: rgb(245,0,87) !important ;
  }
  .list {
    padding-left: .3rem;
    height: 5rem;
    line-height: .8rem;
  }
  .slider {
    height: 1px;
    width: 2rem;
    margin-top: -1px;
    margin-left: 0;
    background: rgb(245,0,87);
    transition: margin-left .6s;
  }
</style>
