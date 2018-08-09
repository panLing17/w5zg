<template lang="pug">
  transition(name="fade")
    .goTop(@click="goTop")
      img(src="./goTop.png")
</template>

<script>
  export default {
    name: "goTop",
    methods: {
      goTop () {
        this.$emit('goTop')
      }
    }
  }
</script>

<style scoped lang="stylus">
  .goTop {
    position fixed
    bottom  2.66rem
    right .26rem
    img {
      width 1rem
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
