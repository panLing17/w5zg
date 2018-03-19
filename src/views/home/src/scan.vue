<template lang="pug">
  .scan
    nav-bar(background="rgba(0,0,0,0.2)")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center")
        span.scanAscan 扫啊扫
        span.photo 相册
          input(type="file")
      .topRight(slot="right")
        img(src="../../../assets/img/scan？@2x.png")
    .content
      .scanFrame
    .QR_bar
      ul
        li.QR
          img(src="../../../assets/img/scan条形码@2x.png")
          div 条形码
        li.bar
          img(src="../../../assets/img/scan二维码@2x.png")
          div 二维码  

</template>
<script>
 
  export default {
    name: 'scan',
    data () {
      return {
        
      }
    },
    mounted () {
 
    },
    methods: {
       
    }
  }
</script>

<style scoped>
  .scan{
    background-color: rgba(0,0,0,0.2);
    padding-bottom: 1.5rem;
  }
  .topCenter span{
    display: inline-block;
    font-size: .45rem;
    font-weight: 400;
    color: #fff;
  }
  .topCenter span.scanAscan{
    margin-right: .9rem;
  }
  .topCenter span.photo{
    position: relative;
    width: .9rem;
  }
  .topCenter span.photo input{
    opacity: 0;
    position: absolute;
    left: 0;
  }
  .topRight img{
    width: .5rem;
    vertical-align: middle;
  }
  /*中间扫描处--开始*/
  .content .scanFrame{
    width: 5.5rem;
    height: 5.5rem;
    background-color: #fff;
    margin: 4rem auto 0;
  }
  /*中间扫描处--结束*/
  /*下方的二维码,条形码--开始*/
  .QR_bar{
    height: 3rem;
    background-color: rgb(0,0,0,0.3);
    margin-top: 2.4rem;
  }
  .QR_bar ul{
    display: flex;
    justify-content: space-around;
  }
  .QR_bar ul li{
    margin-top: .8rem;
    width: 50%;
    text-align: center;
  }
  .QR_bar ul li.QR img{
    width: .7rem;
  }
  .QR_bar ul li.bar img{
    width: .5rem;
  }
  .QR_bar ul li div{
    font-size: .4rem;
    color: #fff;
  }
  /*下方的二维码,条形码--结束*/
</style>
