<template lang="pug">
  .alertBox
    transition(appear, enter-active-class="animated fadeIn", leave-active-class="animated fadeOut", :duration="{ enter: 500, leave: 300 }")
      .bg(v-show="show", @click="show=false")
    transition(appear, enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown", :duration="{ enter: 500, leave: 500 }")
      .main(v-show="show", @click.stop="")
        .title {{title}}
        p {{value}}
</template>

<script>
  export default {
    name: 'alert',
    props:{
      show: {
        type: Boolean,
        default: false
      },
      value: String,
      title: String
    }
  }
</script>

<style scoped>
  .alertBox {
    height: 100vh;
    width: 100vh;
  }
  .alertBox .bg {
    width: 100vh;
    height: 100vh;
    background-color: rgba(0,0,0,0.2);
    position: fixed;
    top: 0;
    left: 0;
  }
  .alertBox .main {
    position: fixed;
    background-color: white;
    width: 7rem;
    height: 4rem;
    margin-top: -2rem;
    margin-left: -3.5rem;
    top: 50%;
    left: 50%;
  }
  .main .title {
    height: .6rem;
    background-color: rgb(255,128,171);
    display: flex;
    align-items: center;
    padding-left: .2rem;
    color: white;
  }
  .main p {
    padding: .2rem;
  }
</style>
