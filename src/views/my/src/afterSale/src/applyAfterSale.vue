<template lang="pug">
  .applyAfterSale
    nav-bar
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") 申请售后
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png")
    .content(v-for="(item,index) in goodsList", @click="change(index)")
      .center
        .check
          w-checkbox(:msg="item.checked", @change="change(index)")
        .image
          img(:src="item.logo | img-filter")
        .goodsDetails
          .words {{item.goods_name}}
          .property
            span(v-for="i in item.spec_json") {{i.gspec_value}}
          .amount x
            span {{item.goods_num}}
    <!--.totalCheck-->
      <!--w-checkbox(@change="cMsg" v-model="msg")-->
      <!--span 全选-->
    .next(@click="toNext") 下一步
</template>
<script>
  export default {
    name: 'applyAfterSale',
    data () {
      return {
        goodsList:[]
      }
    },
    created () {
      this.getList()
    },
    methods: {
      toNext () {
        this.goodsList.forEach((item, index) => {
          if (item.checked) {
            item.delivery_id = this.$store.state.returnGoods.slice(this.$store.state.returnGoods.length-1,this.$store.state.returnGoods.length);
            this.$store.commit('getReturnGoods', item);
            this.$router.replace({path:'/my/refundReturn'});
          }
        })
      },
      getList () {
        this.goodsList = []
        let _this = this
        let temp = this.$store.state.returnGoods.slice(0,this.$store.state.returnGoods.length-1)
        temp.forEach((item, index)=>{
          console.log(item)
          if (item.refund_status == null) {
            item.checked = false
            _this.goodsList.push(item)
          }
        })
        this.goodsList[0].checked = true
      },
      change (index) {
        let temp = this.goodsList
        temp.forEach((item, i) => {
          if (index === i) {
            item.checked = true
          }else {
            item.checked = false
          }
        })
        temp.forEach((item2, i2) => {
          this.$set(this.goodsList,i2,item2)
        })
        temp = null
      }
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
    flex-wrap:wrap;
    display: flex;
    position: relative;
  }
  .center .check{
    flex: none;
    line-height: 2.4rem;
    margin-right: .3rem;
    position: absolute;
    top: 44%;
    left: .3rem;
  }
  .center .image{
    margin-left: .8rem;
    flex: none;
  }
  .center .image img{
    width: 2.32rem;
    height: 2.32rem;
    border-radius: .2rem;
  }
  .center .goodsDetails{
    margin-left: .3rem;
    flex: 1;
    position: relative;
  }
  .center .goodsDetails .words{
    font-size: .35rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .center .goodsDetails .property{
    margin-top: .1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .property span{
    margin-right: .3rem;
  }
  .center .goodsDetails .amount{
    position: absolute;
    bottom: 0;
    left: 0;
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
  img {
    pointer-events: none;
  }
</style>
