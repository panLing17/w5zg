<template lang="pug">
  .wrapNav
    .navbar
      .topLeft
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter {{titleName}}
    .cont
      ul
        li(v-for="item in contList")
          .up(@click="item.ansFlag = !item.ansFlag")
            .left {{item.title}}
            .right
              img(src="../../../assets/img/zhankai@2x.png", v-if="!item.ansFlag")
              img(src="../../../assets/img/shouqi@2x.png", v-if="item.ansFlag")
          transition(name="slideInDown")
            .down(v-if="item.ansFlag") 顾客在万物直供商城购物，本商城自动抵扣现金券最高额，顾客仅支付用券后余额。
</template>

<script>
  export default {
    name: "cAnswer",
    data() {
      return{
        contList: [{title:'什么是现金券？', ansFlag: false}, {title:'现金券的作用', ansFlag: false}, {title:'如何得到现金券', ansFlag: false}],
        titleName: ''
      }
    },
    activated() {
      this.showTitle()
    },
    mounted() {
      this.showTitle()
    },
    methods:{
      showTitle(){
        console.log(this.$route.query.flag)
        let rel = parseInt(this.$route.query.flag)
        let x = ''
        switch (rel) {
          case 1:
            x = '专柜提货与专柜配送'
            break
          case 2:
            x = '实付价与专柜价'
            break
          case 3:
            x = '现金券'
            break
          case 4:
            x = '通用券'
            break
          case 5:
            x = '退换货政策'
            break
        }
        this.titleName = x
      }
    }
  }
</script>

<style scoped>
  .wrapNav{
    width: 100%;
    height: 100vh;
    background-color: #fff;
    position: fixed;
  }
  .navbar{
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.28rem;
    border-bottom: 1px solid #f2f2f2;
    background: #fff;
    display: flex;
    align-items: center;
  }
  .navbar img{
    vertical-align: middle;
  }
  .topLeft{
    padding-left: .36rem;
    padding-top: .1rem;
  }
  .topCenter{
    font-size: .48rem;
    width: 60%;
    text-align: center;
    margin-left: 1.2rem;
  }
  .cont{
    margin-top: 1.28rem;
  }
  .cont ul{
    padding-top: .16rem;
    background-color: #f2f2f2;
  }
  .cont ul li{
    background-color: #fff;
  }
  .cont ul li .up{
    padding: .34rem .4rem .32rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
    font-size: .4rem;
    border-bottom: .05rem solid #f2f2f2;
  }
  .cont ul li .down{
    background-color: #f2f2f2;
    padding: .34rem .4rem;
    color: #666;
    font-size: .37rem;
  }
  .cont li .right img{
    width: .58rem;
    height: .58rem;
  }
  .slideInDown-enter-active,
  .slideInDown-leave-active{
    transition: all .2s ease-out;
  }
  .slideInDown-enter,
  .slideInDown-leave-to{
    transform: translateY(-5px);
    opacity: 0;
  }
</style>
