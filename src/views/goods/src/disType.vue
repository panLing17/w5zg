<template lang="pug">
  .citySelectBox
    .main
      .title 配送:
      ul
        li(@click="selected(0)", :class="{checked:nowType === 0}") <span>荐</span>专柜自提
        li(@click="selected(1)", :class="{checked:nowType === 1}") 快递配送
</template>

<script>
  export default {
    name: "city-select",
    data () {
      return {
        nowType: 0
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    methods:{
      selected (num) {
        this.nowType = num
        this.$emit('selectType',num)
      }
    }
  }
</script>

<style scoped>
  .citySelectBox {

  }
  .main {
    background-color: white;
    display: flex;
    align-items: center;
    padding: 0 .2rem;
  }
  .main>.title{
    width: 2rem;
    font-size: .35rem;
    color: #aaa;
  }
  .main ul{
    width: 100%;
    height: 1.2rem;
    padding: 0 .2rem;
    display: flex;
    align-items: center;
  }
  .main ul li{
    height: .6rem;
    font-size: .3rem;
    font-weight: 600;
    width: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px #ddd;
    color: #aaaaaa;
    background-color: white;
    border-radius: 3px;
    transition: background-color .2s, color .2s;
  }
  .main ul li:last-child {

  }
  .main ul li:first-child {
    margin-right: .3rem;
    position: relative;
  }
  .main ul li:first-child>span{
    font-size: .25rem;
    position: absolute;
    width: .5rem;
    height: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .3rem;
    background-color: #aaa ;
    color: white;
    right: -.25rem;
    top: -.25rem;
  }
  .checked {
    border:solid 1px rgb(252,128,172) !important;
    color: rgb(247,0,87) !important;
  }
  .checked>span{
    background-color: rgb(247,0,87) !important;
  }
</style>
