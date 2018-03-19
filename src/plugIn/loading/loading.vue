<template lang="pug">
  .loading
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut", :duration="{ enter: 500, leave: 300 }")
      .bg(v-if="show")
        .box
</template>

<script>
  export default {
    name: 'loading',
    props: {
      show: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style scoped>
  .loading{

  }
  .bg{
    background: rgba(0,0,0,0.3);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box{
    height: 50px;
    width: 50px;
    background: red;
    transform: rotate(0deg);
    animation: f 1.5s infinite;
    animation-direction: revert;
  }
  @keyframes f {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
  }
</style>
