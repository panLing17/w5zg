<template lang="pug">
  transition( leave-active-class="animated rotateOutUpLeft")
    .goodsCardBox(v-if="list.length>0")
      .title
        <!---w-checkbox(v-model="isdefault")--->
        p PELLIOT旗舰店
      transition-group(tag="div", name="leftOut")
        .goodsBox(v-for="(i,index) in list", :key="index")
          transition( leave-active-class="animated flipOutX", enter-active-class="animated flipInX", mode="out-in", :duration="{ enter: 600, leave: 400 }")
            .main(v-if="flag", key="spec")
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
                img(src="../../../assets/img/edit@3x.png", @click="edit(false)")
                p x1
            .main(v-else, key="change")
              .checkbox
                w-checkbox(v-model="isdefault")
              img(src="../../../../static/img/1.jpg")
              .specChange
                .specData
                  p 黑色,L
                  img(src="../../../assets/img/next@2x.png")
                w-counter(v-model="content", :min="1", width="4rem")
              .specOk(@click="edit(true)") 完成
          .bottom
            .left(@click="changeType") <img src="../../../assets/img/switch@2x.png"/>门店自提
            .right
              span 江苏省 南京市
              img
</template>

<script>
  export default {
    name: "goods-card",
    props:{
      list:{
        type: Array
      }
    },
    data () {
      return {
        isdefault: false,
        content: 1,
        flag: true
      }
    },
    methods: {
      changeType () {
        // 回调参数，执行删除动画效果
        let fun =()=> {
          this.list.splice(0,1)
        }
        // 参数1 代表此请求来自快递配送
        this.$emit('tab',1,fun)
      },
      edit (k) {
        this.flag = k
      }
    }
  }
</script>

<style scoped>
  .goodsCardBox{
    background-color: white;
    padding: 0 .2rem;
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
  /* 修改规格 */
  .specChange{
    flex-grow: 1;
    padding-left: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .specData {
    width: 4rem;
    height: 30px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    border: solid 1px #aaa;
    justify-content: space-between;
  }
  .specData p{
    line-height: 30px;
    padding: 0 .2rem;
  }
  .specData img {
    height: .4rem;
    margin-right: .2rem;
  }
  .specOk {
    width: 1.8rem;
    height: 100%;
    background-color: rgb(255,128,171) ;
    color: white;
    font-size: .4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* */
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
    transform: translate(-100%,-1000%) scale(.1,.1);
    opacity: 0;
  }
</style>
