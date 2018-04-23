<template lang="pug">
  .serviceBox
    nav-bar(background="white", border-bottom="none")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 客服
      .topRight(slot="right")
        // img(src="../../../assets/img/share@3x.png", style="width:.5rem", @click="selectShare = true")
    iframe(:src="url").ifra
</template>

<script>
  export default {
    name: "customer-service",
    data () {
      return {
        url: ''
      }
    },
    mounted () {
      this.config()
    },
    methods:{
      config () {
        let self = this
        ysf.on({
          'onload': function(){
            ysf.config({
              uid:"1442286211167",
              name:'test1111',
              email:'test@163.com',
              mobile:'13888888888'


            });
            ysf.product({
              show : 1, // 1为打开， 其他参数为隐藏（包括非零元素）
              title : '标题',
              desc : '商品描述',
              picture : '商品图片地址',
              note : '备注',
              url : '跳转链接'
            });

          }
        })
        self.url = ysf.url()
      }
    }
  }
</script>

<style scoped>
  .ifra {
    width: 100%;
    height: 100vh;
    position: relative;
    top: -48px;
  }
  .ifra h2{
    display: none;
  }
</style>
