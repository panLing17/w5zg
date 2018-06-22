<template lang="pug">
  .wrap
    img(src="../../../../../assets/img/01_index_1.png")
    .btn(@click="toNext")
      img(:src="!isPartake?require('../../../../../assets/img/01_index_2_1.jpg'):require('../../../../../assets/img/01_index_2_2.jpg')")
    img(src="../../../../../assets/img/01_index_3.png")
    img(src="../../../../../assets/img/01_index_4.jpg")
    img(src="../../../../../assets/img/01_index_5.png")
    img(src="../../../../../assets/img/01_index_6.png")
    img(src="../../../../../assets/img/01_index_7.png")
    .btn(@click="toNext")
      img(:src="!isPartake?require('../../../../../assets/img/01_index_8_1.png'):require('../../../../../assets/img/01_index_8_2.png')")
</template>

<script>
  export default {
    name: "index",
    data () {
      return {
        isPartake: false
      }
    },
    mounted () {
      document.title = '专题活动名称';
    },
    methods: {
      toNext () {
        if (!this.isPartake) {
          this.$router.push('/marketing/movies')
        }
      }
    }
  }
</script>

<style scoped>
  .wrap {
    font-size: 0;
  }
  img {
    width: 100%;
    pointer-events: none;
  }
</style>
