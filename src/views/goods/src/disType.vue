<template lang="pug">
  .citySelectBox
    .main
      .title 配送方式
      ul
        li(@click="selected(0)", :class="{checked:nowType === 0}") 专柜自提
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
    font-weight: 600;
  }
  .main ul{
    width: 100%;
    height: 1rem;
    padding: 0 .2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .main ul li{
    height: .8rem;
    flex-grow: 1;
    width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px #ddd;
    color: #aaaaaa;
    background-color: white;
    transition: background-color .2s, color .2s;
  }
  .main ul li:last-child {
    border-left: none;
    border-bottom-right-radius: .2rem;
    border-top-right-radius: .2rem;
  }
  .main ul li:first-child {
    border-bottom-left-radius: .2rem;
    border-top-left-radius: .2rem;
  }
  .checked {
    background-color: rgb(244,0,87) !important;
    color: white !important;
  }
</style>
