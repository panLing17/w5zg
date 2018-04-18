<template lang="pug">
  .selectGoodsStatus
    transition(name="fade")
      .bg(v-if="show", @click="hide")
    transition(name="fold")
      .main(v-if="show")
        .title  {{title}}
        ul
          li(v-for="(item,index) in data", @click="selected(index)") {{item}}
</template>

<script>
  export default {
    name: "pop1",
    data () {
      return {
        show: false
      }
    },
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      title:String
    },
    watch: {
      // 模态框出现禁止页面滑动
      show (cur, old) {
        if (cur) {
          document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        }else {
          document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }
      }
    },
    methods:{
      showPop () {
        this.show = true
      },
      hide () {
        this.show = false
      },
      selected (num) {
        this.$emit('selected',num)
        this.show = false
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
