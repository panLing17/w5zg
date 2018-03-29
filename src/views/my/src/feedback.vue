<template lang="pug">
  .feedbackBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 意见反馈
      .topRight(slot="right")
    .label 问题和意见
    textarea(placeholder="请描述您要反馈的问题和意见").input
    .label 上传图片
    .upload
      w-upload(url="goodsRejected/rejectedImage", :max="2")
    .label 手机号
    input(placeholder="请输入你的手机号", style="padding:.4rem .2rem").input
    .bottomButton
      w-button 提交
</template>

<script>
  export default {
    name: "feedback",
    data () {
      return {
        form: {

        }
      }
    }
  }
</script>

<style scoped>
  .feedbackBox {
    background-color:rgb(242,242,242) ;
    min-height: 100vh;
  }
  .label{
    margin-top: .3rem;
    padding-left: .2rem;
    height: .8rem;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .input{
    border: none;
    outline: none;
    padding: .2rem;
    width: 100%;
  }
  textarea {
    height: 3rem;
  }
  .upload {
    position: relative;
    background: white;
    padding: .2rem;
  }
  .upload input{
    position: absolute;
    height: 100%;
    opacity: 0;
  }
  .upload img {
    width: 1.5rem;
  }
  .bottomButton {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }
</style>
