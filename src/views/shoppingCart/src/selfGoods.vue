<template lang="pug">
  transition( leave-active-class="animated rotateOutUpRight")
    .goodsCardBox(v-if="list.length>0")
      transition-group(tag="div", name="leftOut")
        .goodsBox(v-for="(i,index) in list", :key="index")
          .main
            .checkbox
              w-checkbox(v-model="isdefault")
            img(src="../../../../static/img/1.jpg")
            .info
              .text
                .name 法国PELLIOT秋冬产品充分一男女
                .spec
                  span 红色
                  span L
              .price
                span ￥596.00
            .mainRight
              img(src="../../../assets/img/edit@3x.png")
              p x1
          .bottom
            .left(@click="changeType") <img src="../../../assets/img/switch@2x.png"/>门店自提
            .right
              span 江苏省 南京市
              img
</template>

<script>
  export default {
    name: "goods-card",
    data () {
      return {
        isdefault: false,
        list: [
          {},
          {},
          {}
        ]
      }
    },
    methods: {
      changeType () {
        this.$emit('tab')
        this.list.splice(0,1)
      }
    }
  }
</script>

<style scoped>
  .goodsCardBox{

  }
  .title{
    font-weight: 600;
    height: .8rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  .title p{
    margin-left: 5px;
  }
  .goodsBox {
    background-color: white;
    margin-top: .1rem;
    padding: 0 .2rem;
  }
  .main{
    height: 2.2rem;
    display: flex;
    padding-top: .2rem;
  }
  .main .checkbox {
    padding-right: .2rem;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .main>img{
    width: 2rem;
    height: 2rem;
    border-radius: .2rem;
  }
  .info{
    flex-grow: 1;
    padding-left: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .price{
    display: flex;
    justify-content: space-between;
  }
  .mainRight {
    width: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .mainRight>img{
    width: .5rem;
  }
  .mainRight>p{
    font-size: .35rem;
  }
  .bottom{
    margin-top: .3rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: .8rem;
    border-top: solid 1px rgb(250,250,250);
  }
  .bottom .right{
    margin-left: .3rem;
    color: #aaaaaa;
  }
  .bottom .left {
    display: flex;
    align-items: center;
  }
  .bottom .left img{
    height: .4rem;
    margin-right: .1rem;
  }
  /* 动画 */
  .leftOut-enter-active {
    transition: all .3s ease;
  }
  .leftOut-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .leftOut-enter, .leftOut-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translate(100%,-1000%) scale(.1,.1);
    opacity: 0;
  }
</style>
