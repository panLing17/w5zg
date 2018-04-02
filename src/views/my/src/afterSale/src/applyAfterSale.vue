<template lang="pug">
  .applyAfterSale
    nav-bar
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 申请售后
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png")
    .content(v-for="(item,index) in goodsList") 
      .center
        .check
          w-checkbox(v-model="item.checked", @change="check")
        .image
          img(:src="item.imgSrc")
        .goodsDetails
          .words {{item.words}}
          .property
            span.color {{item.color}}
            span.size {{item.size}}
          .amount x
            span {{item.amount}}
    .totalCheck
      w-checkbox(@change="cMsg" v-model="msg")
      span 全选
    .next(@click="flag && $router.push('/my/selectService')") 下一步              
</template>
<script>
  import myGoods from '../../../../../assets/img/my_goods.png'
  export default {
    name: 'applyAfterSale',
    data () {
      return {
        flag:true,
        msg: false,
        goodsList:[
          {
            imgSrc:myGoods,
            words:"法国PELLIOT秋冬新品户外冲锋衣男",
            color:"黄色",
            size:"L",
            amount:1,
            checked:false
          },
          {
            imgSrc:myGoods,
            words:"法国PELLIOT秋冬新品户外冲锋衣男",
            color:"黑色",
            size:"XL",
            amount:1,
            checked:false
          },
          {
            imgSrc:myGoods,
            words:"法国PELLIOT秋冬新品户外冲锋衣男",
            color:"红色",
            size:"M",
            amount:1,
            checked:false
          }
        ]
      }
    },
    mounted () {
      this.check();
    },
    methods: {
      cMsg(flag){
        this.goodsList.forEach((now)=>{
          now.checked = flag;
          this.msg = flag;
          if (flag == false) {
            var next = document.getElementsByClassName("next")[0];
            next.style.backgroundColor = "rgb(153,153,153)";
            this.flag = false;
          }
          if (flag == true) {
            var next = document.getElementsByClassName("next")[0];
            next.style.backgroundColor = "rgb(244,0,87)";
            this.flag = true;
          }
        });
      },

      check(a){
        let n = 0;
        this.goodsList.forEach((now)=>{
          console.log(now);
          if (now.checked === false) {
            this.msg = false;
            var next = document.getElementsByClassName("next")[0];
            next.style.backgroundColor = "rgb(153,153,153)";
            this.flag = false;
          } else {
            n += 1;
            var next = document.getElementsByClassName("next")[0];
            next.style.backgroundColor = "rgb(244,0,87)";
            this.flag = true;
          }
        });
        if (n === this.goodsList.length) {
          this.msg = true;
        }
      },

    }
  }
</script>

<style scoped>
  .applyAfterSale{
    width: 100%;
    min-height: 100vh;
    position: absolute;
    z-index: 100;
    background-color: rgb(242,242,242);
  }
  .topCenter{
    font-size: .5rem;
    font-weight: 400;
  }
  .topRight img{
    width: .7rem;
  }
  /*商品内容--开始*/
  .center{
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    white-space:nowrap;
    overflow-x:auto;
    display: flex;
    position: relative;
  }
  .center .check{
    line-height: 2.4rem;
    margin-right: .3rem;
    position: absolute;
    top: 44%;
    left: .3rem;
  } 
  .center .image{
    margin-left: .8rem;
  }
  .center .image img{
    width: 2.5rem;
    border-radius: .2rem;
  }
  .center .goodsDetails{
    margin-left: .3rem;
  }
  .center .goodsDetails .words{
    font-size: .35rem;
  }
  .center .goodsDetails .property{
    margin-top: .1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .property span.size{
    margin-left: .3rem;
  }
  .center .goodsDetails .amount{
    margin-top: 1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  /*商品内容--结束*/
  /*全选--开始*/
  .totalCheck{
    margin-top: .3rem;
    padding: 0 .3rem;
    display: flex;
  }
  .totalCheck span{
    font-size: .4rem;
    margin-left: .3rem;
    margin-top: -.05rem;
  }
  /*全选--结束*/
  /*下一步--开始*/
  .next{
    width: 6.5rem;
    height: 1.2rem;
    background-color: rgb(245,0,87);
    border-radius: 1.2rem;
    margin: 1.6rem auto;
    text-align: center;
    line-height: 1.2rem;
    color: #fff;
    font-size: .4rem;
  }
  /*下一步--结束*/
</style>
