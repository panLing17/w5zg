<template lang="pug">
  .refundReturn
    nav-bar
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{title}}
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png")
    .content(v-for="(item,index) in goodsList") 
      .center
        .image
          img(:src="item.imgSrc")
        .goodsDetails
          .words {{item.words}}
          .property
            span.color {{item.color}}
            span.size {{item.size}}
          .amount x
            span {{item.amount}}    
</template>
<script>
  import myGoods from '../../../../../assets/img/my_goods.png'
  export default {
    name: 'refundReturn',
    data () {
      return {
        titleNum: this.$route.query.routeParams,
        title:"",
        goodsList:[
          {
            imgSrc:myGoods,
            words:"法国PELLIOT秋冬新品户外冲锋衣男",
            color:"黄色",
            size:"L",
            amount:1,
            checked:false
          }
        ]  
      }
    },
    mounted () {
      this.titles();
    },
    methods: {
      titles(){
        if (this.titleNum == 1) {
          this.title = "申请退款";
        }
        if (this.titleNum == 2) {
          this.title = "申请退款退货";
        }
      }
    }
  }
</script>

<style scoped>
  .refundReturn{
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
</style>
