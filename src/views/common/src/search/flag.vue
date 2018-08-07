<template lang="pug">
  .flag
    img(:src="flag===1?require('./promotion.png'):require('./recommend.png')")
</template>

<script>
  export default {
    name: "flag",
    props: {
      flag: {
        type: Number
      }
    }
  }
</script>

<style scoped lang="stylus">
  .flag {
    position absolute
    right -0.05rem
    bottom .5rem
    img {
        width: .4rem;
    }
  }
</style>
