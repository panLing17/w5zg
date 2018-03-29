<template lang="pug">
  .returnReason
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-if="show")
        .title  退货原因
        ul
          li(@click="selected(0)") 尺码拍错/不喜欢/效果差
          li(@click="selected(1)") 质量问题
          li(@click="selected(2)") 材质/面料与商品描述不符
          li(@click="selected(3)") 颜色/款式/图案与描述不符
          li(@click="selected(4)") 卖家发错货
          li(@click="selected(5)") 假冒品牌
          li(@click="selected(6)") 收到商品少件或破损
</template>

<script>
  export default {
    name: "returnReason",
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
  }
  .main {
    background-color: white;
    width: 100%;
    /*height: 3.7rem;*/
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 101;
    font-size: .4rem;
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
</style>
