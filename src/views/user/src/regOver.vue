<template lang="pug">
  .regOverBox
    nav-bar(background="white")
      .topLeft(slot="left")
      .topCenter(slot="center") 注册
      .topRight(slot="right")
    .text
      h1 注册成功
      h2 5秒后跳转到"我的"页面
      button 返回首页
</template>

<script>
  export default {
    name: 'reg-over'
  }
</script>

<style scoped>
  .text{
    margin-top: 2rem;
    height: 4rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
  }
  h1 {
    font-size: .5rem;
    color: rgb(51,51,51);
  }
  h2 {
    font-size: .4rem;
    font-weight: 500;
    color: rgb(153,153,153);
  }
  button {
    width: 6rem;
    height: 1rem;
    color: rgb(51,51,51);
    font-size: .4rem;
    border: solid rgb(245,0,87) 1px;
    outline: none;
    background: none;
  }
</style>
