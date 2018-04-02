<template lang="pug">
  .express
    nav-bar
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 填写快递
    .addressee(@click="$router.push('/my/checkAddressee')")
      .lefter
        .name
          span 收件人
          span 张三三
          span 025-23562356
        .address
          span 地址
          strong 江苏省南京市玄武区 699-22 江苏软件园 24栋
      .righter
        img(src="../../../../../assets/img/right.png") 
    .logistics
      ul.company(@click="checkCom()")
        li 物流公司
        li
          img(src="../../../../../assets/img/right.png")
      ul.number
        li 物流单号
    .upload
      .up
        span 上传凭证
      w-upload        
    .submit(@click="$router.push('/my/selectService')") 提交
    logCompany(:show="companyFlag", @selectType="", @close="closeCheckCom()")              
</template>
<script>
  import myGoods from '../../../../../assets/img/my_goods.png'
  import logCompany from './logisticsCompany'
  export default {
    name: 'express',
    components:{logCompany},
    data () {
      return {
        companyFlag: false,
        msg: false
      }
    },
    mounted () {

    },
    methods: {
      checkCom(){
        this.companyFlag = true;
      },
      closeCheckCom(){
        this.companyFlag = false;
      }
    }
  }
</script>

<style scoped>
  .express{
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
  /*收件人的姓名地址--开始*/
  .addressee{
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: .3rem;
  }
  .addressee .lefter span{
    margin-right: .2rem;
    font-size: .35rem;
    word-wrap: wrap;
  }
  .addressee .lefter span:nth-child(1){
    display: inline-block;
    width: 1.2rem;
    font-size: .4rem;
  }
  .lefter .address{
    margin-top: .2rem;
  }
  .lefter .address strong{
    display: inline-block;
    vertical-align: middle;
    font-weight: 400;
    width: 7rem;
    margin-top: -.1rem;
    color: rgb(153,153,153);
  }
  .righter img{
    width: .6rem;
    margin-top: .35rem;
  }
  /*收件人的姓名地址--结束*/
  /*物流公司--开始*/
  .logistics{
    margin-top: .2rem;
    background-color: #fff;
    padding: 0 .3rem;
  }
  .logistics ul{
    height: 1.5rem;
    font-size: .4rem;
    line-height: 1.5rem;
  }
  .logistics ul.company{
    border-bottom: .5px solid rgb(242,242,242);
    display: flex;
    justify-content: space-between;
  }
  .logistics ul.company img{
    width: .6rem;
    vertical-align: middle;
  }
  .logistics ul.number{
    border-top: .5px solid rgb(242,242,242);
  }
  /*物流公司--结束*/
  /*图片上传--开始*/
  .upload{
    margin-top: .3rem;
    padding: .2rem .3rem;
    background-color: #fff;
  }
  .upload .up{
    margin-bottom: .2rem;
  }
  .upload .up span:nth-child(1){
    font-size: .4rem;
  }
  .upload .up span:nth-child(2){
    margin-left: .1rem;
    color: rgb(153,153,153);
  }
  /*图片上传--结束*/
  /*下一步--开始*/
  .submit{
    width: 6.5rem;
    height: 1.2rem;
    background-color: rgb(245,0,87);
    border-radius: 1.2rem;
    margin: 2rem auto 0;
    text-align: center;
    line-height: 1.2rem;
    color: #fff;
    font-size: .4rem;
  }
  /*下一步--结束*/
</style>
