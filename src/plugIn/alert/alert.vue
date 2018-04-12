<template lang="pug">
  .alertBox
    .bg
    .main
      p 一段介绍
</template>

<script>
  export default {
    name: 'alert',
    props:{
      value: String,
      title: String
    }
  }
</script>

<style scoped>
  .alertBox {

  }
  .alertBox .bg{
    width: 100vh;
    height: 100vh;
    background-color: rgba(0,0,0,0.2);
    position: fixed;
  }
</style>
