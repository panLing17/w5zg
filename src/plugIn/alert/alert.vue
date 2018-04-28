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
    height: 100%;
    width: 100%;
  }
  .alertBox .bg {
    width: 100vh;
    height: 100vh;
    background-color: rgba(0,0,0,0.2);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 21;
  }
  .alertBox .main {
    position: fixed;
    background-color: white;
    width: 9rem;
    height: 4rem;
    margin-top: -2rem;
    margin-left: -4.5rem;
    top: 50%;
    left: 50%;
    padding: 0 .3rem;
    z-index: 22;
  }
  .main .title {
    color: #000;
    font-size: .35rem;
    font-weight: 600;
    height: 1rem;
    display: flex;
    align-items: center;
    border-bottom: solid 1px #ddd;
  }
  .main p {
    padding: .2rem 0;
    color: #666;
  }
</style>
