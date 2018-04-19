<template lang="pug">
  .selectGoodsStatus
    transition(name="fade")
      .bg(v-if="show", @click="close")
    transition(name="fold")
      .main(v-if="show")
        .title  货物状态
        ul
          li(@click="selected(0)") 仅退款
          li(@click="selected(1)") 退款退货
</template>

<script>
  export default {
    name: "selectGoodsStatus",
    data () {
      return {
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    methods:{
      close () {
        this.$emit('close')
      },
      selected (num) {
        this.$emit('selectType',num)
      }
    }
  }
</script>

<style scoped>
  .bg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    opacity: 1;
  }
  .bg.fade-enter-active, .bg.fade-leave-active {
    transition: all 0.5s;
  }
  .bg.fade-enter, .bg.fade-leave-to {
    opacity: 0;
  }
  .main {
    background-color: white;
    width: 100%;
    height: 3.7rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
    font-size: .4rem;
    transform: translate3d(0,0,0);
  }
  .main.fold-enter-active, .main.fold-leave-active {
    transition: all 0.5s;
  }
  .main.fold-enter, .main.fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .title {
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
  }
  .main ul{
    padding: 0 .2rem;
  }
  .main ul li{
    height: 1.35rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main ul li:first-child{
    border-bottom: solid 1px #ddd ;
  }
</style>
