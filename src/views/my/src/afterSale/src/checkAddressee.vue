<template lang="pug">
  .checkAddressee
    nav-bar
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 填写快递
    .wrap
      ul
        li.name
          span.left 收件人
          input.right(placeholder="请输入收件人姓名")
        li.phone
          span.left 联系方式
          input.right(placeholder="请输入固定电话或手机")
        li.address
          span.left 地址
          textarea.right(placeholder="请输入收件人地址")
    .makeSure(@click="$router.push('/my/express')") 确认

</template>
<script>

  export default {
    name: 'checkAddressee',
    data () {
      return {
        expressInfo: {
          name: '',
          phone: '',
          detailedAddr: ''
        }
      }
    },
    mounted () {

    },
    methods: {

    }
  }
</script>

<style scoped>
  .checkAddressee{
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
  /*收件人信息--开始*/
  .wrap{
    background-color: #fff;
    padding: 0 .3rem;
  }
  .wrap li{
    min-height: 1.5rem;
    line-height: 1.5rem;
    border-bottom: 1px solid rgb(242,242,242);
    display: flex;
  }
  .wrap li:last-child {
    border: none;
  }

  .wrap li .left{
    font-size: .4rem;
    display: inline-block;
    width: 2rem;
    flex: none;
  }
  .wrap li .right{
    display: inline-block;
    vertical-align: top;
    font-size: .29rem;
    border: 0;
    outline: none;
    flex: 1;
  }
  textarea.right {
    padding-top: .5rem;
  }
  textarea::placeholder{
    color: rgb(153,153,153);
  }
  input::placeholder{
    color: rgb(153,153,153);
  }
  /*收件人信息--结束*/
  /*确认--开始*/
  .makeSure{
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
  /*确认--结束*/
</style>
