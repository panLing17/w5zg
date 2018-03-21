<template lang="pug">
  .filtrate 
    .wrap
      .brand 
        span 品牌
        img(src="../../../assets/img/right.png")
      .brandList
        ul
          li(v-for="(item,index) in brandList" :class="{active:num1 == index}" @click="check(index)") {{item}}
      .price 价格区间
      .priceContent
        input(type="text" placeholder="最小金额").min
        span ~
        input(type="text" placeholder="最大金额").max
        ul
          li(v-for="(item,index) in price" :class="{active:num2 == index}" @click="checks(index)") {{item}}
      .support 支持自提
        ul
          li(v-for="(item,index) in support" :class="{active:num3 == index}" @click="toggle(index)") {{item}}  
    .button
      .reset(@click="reset()") 重置
      .affirm 确认
              
</template>

<script>
    export default {
        name: "filtrate",
        data(){
          return{
            num1:null,
            num2:null,
            num3:null,
            brandList:["阿迪达斯","耐克","金利来","丹尼尔·惠灵顿","阿迪达斯","耐克","金利来","丹尼尔·惠灵顿"],
            price:["0~500","500~1000","1000~2000","2000~5000","5000以上"],
            support:["可自提","不可自提"]
          }
        },
        mounted(){
          window.onscroll = function() {};
          document.getElementsByClassName("filtrate")[0].style.overflow = "scroll";
        },
        methods:{
          check(index){
            this.num1 = index;
          },
          checks(index){
            this.num2 = index;
          },
          toggle(index){
            this.num3 = index;
          },
          reset(){
            this.num1 = null;
            this.num2 = null;
            this.num3 = null;
          }
        }
    }
</script>

<style scoped>
.active{
  color: #fff !important;
  background-color: rgb(255,128,171) !important;
}
.filtrate{
  width: 100%;
  height: 100%;
  background-color: #fff;
  float: right;
  z-index: 999;
}
.filtrate .wrap{
  padding: .5rem 0 2.9rem;
}
/*品牌--开始*/
.brand{
  padding: 0 .3rem;
  display: flex;
  justify-content: space-between;
  font-size: .4rem;
}
.brand img{ 
  width: .5rem;
  height: .5rem;
  vertical-align: middle;
}
.support ul,
.priceContent ul,
.brandList ul{
  display: flex;
  padding: 0 .3rem;
  flex-wrap: wrap;
}
.support ul li,
.priceContent ul li,
.brandList ul li{
  display: inline-block;
  height: .8rem;
  line-height: .8rem;
  background-color: rgb(242,242,242);
  border-radius: .25rem;
  padding: 0 .3rem;
  font-size: .3rem;
  color: rgb(51,51,51);
  margin-top: .3rem;
  margin-right: .35rem;
}
.priceContent ul,
.support ul{
  padding: 0;
}
/*品牌--结束*/
/*价格区间--开始*/
.price{
  font-size: .4rem;
  padding: 0 .3rem;
  margin-top: .7rem;
}
.priceContent{
  padding: .4rem .3rem 0;
  display: flex;
  flex-wrap: wrap;
}
.priceContent input{
  width: 2.4rem;
  height: .8rem;
  border-width: 1px;
  border-color: rgb(204,204,204);
  font-size: .1rem;
  outline: none;
  text-indent: .1rem;
}
.priceContent span{
  display: inline-block;
  line-height: .8rem;
  font-size: .45rem;
  margin: 0 .3rem;
}
/*价格区间--结束*/
/*支持自提--开始*/
.support{
  font-size: .4rem;
  padding: 0 .3rem;
  margin-top: .7rem;
}
/*支持自提--结束*/
/*重置,确认--开始*/
.button{
  position: fixed;
  bottom: 1.6rem;
  width: 70%;
  height: 1.3rem;
  border: 1px solid rgb(244,0,87);
  display: flex;
}
.button div{
  width: 50%;
  text-align: center;
  font-size: .4rem;
  line-height: 1.3rem;
}
.button .reset{
  color: rgb(244,0,87);
  background-color: #fff;
}
.button .affirm{
  background-color: rgb(244,0,87);
  color: #fff;
}
/*重置,确认--结束*/
</style>
