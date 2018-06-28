<template lang="pug">
  .loading
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut", :duration="{ enter: 50, leave: 300 }")
      .bg(v-if="show", :style="{height:height}", @touchmove.prevent="")
        .box
          img(src="../../assets/img/loading@2x.png")
</template>

<script>
  export default {
    name: 'loading',
    mounted () {
      console.log(this.father)
    },
    props: {
      father: {},
      show: {
        type: Boolean,
        default: true
      },
      height: {
        type: String,
        default:'100%'
      }
    },
    methods: {
      notScroll (e) {
        e.preventDefault();
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
    max-height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }
  .box{
    height: 80px;
    width: 80px;
    transform: rotate(0deg);
    animation: f 1.5s infinite;
    animation-direction: revert;
  }
  .box img{
    width: 100%;
    height: 100%;
  }
  @keyframes f {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
  }
</style>
