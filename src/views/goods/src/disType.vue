<template lang="pug">
  .citySelectBox
    .main
      .title 配送:
        //h2 选择配送方式
      ul
        li(@click="$parent.onlySelectSpecFun", :class="{checked:nowType === 1}") 快递配送
        li(:class="{checked:nowType === 0, greyWhite:lock}") 专柜自提
      span(v-if="!hasGoodsFlag") {{hasGoods}}
    .address(v-if="nowType === 0", @click="$parent.onlySelectSpecFun") {{transfer.store ? transfer.store.name : '请选择商品规格与配送方式'}}
    .address(v-else, @click="$parent.onlySelectSpecFun") {{giveGoodsAddress.city_name ? giveGoodsAddress.city_name + giveGoodsAddress.county_name + giveGoodsAddress.ra_detailed_addr: '请选择商品规格与配送方式'}}

</template>

<script>
  import {bus} from '../../../bus'
  import {mapState} from 'vuex'
  export default {
    name: "city-select",
    data () {
      return {
        nowType: 1
      }
    },
    computed:{
      ...mapState(['transfer','giveGoodsAddress'])
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      hasGoodsFlag: Boolean,
      hasGoods: {
        type: String,
        default: ''
      },
      lock:{
        type: Boolean,
        default: true
      }
    },
    watch:{
      lock () {
        if (this.lock) {
          this.nowType = 1
        } else {
          this.nowType = 0
        }
      }
    },
    methods:{
      selected (num) {
        if(this.lock && num === 0){
          return
        }
        this.nowType = num
        this.$emit('selectType',num)
        bus.$emit('selectType', num)
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
  .main>span{
    width: 1rem;
    font-size: .35rem;
    color: rgb(246,0,88);
    font-weight: 600;
  }
  .main>.title{
    width: 1rem;
    font-size: .35rem;
    color: #aaa;
    display: flex;
  }
  .main>.title h2{
    color: #000;
    margin-left: .2rem;
    font-size: .35rem;
    font-weight: 500;
  }
  .main ul{
    flex-grow: 1;
    height: 1.2rem;
    padding: 0 .2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .main ul li{
    height: .6rem;
    font-size: .3rem;
    font-weight: 600;
    width: 1.6rem;
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
    background-color: #bdbdbd;
    color: white;
    left: -.4rem;
    top: 0;
  }
  .checked {
    border:solid 1px rgb(252,128,172) !important;
    color: rgb(247,0,87) !important;
  }
  .checked>span{
    background-color: rgb(247,0,87) !important;
  }
  /* 灰的发白 */
  .greyWhite {
    color: #e8e5e2 !important;
    border:solid 1px #e8e5e2 !important;
  }
  .address {
    background-color: white;
    text-align: left;
    color: #999;
    padding: 0 .2rem .2rem .2rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
