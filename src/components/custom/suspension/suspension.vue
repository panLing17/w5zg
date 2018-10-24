<template lang="pug">
  .suspension(v-lazy-container="{ selector: 'img'}", :style="{top: suspensionPosition+'px'}", @touchstart="suspensionStart($event)", @touchmove="suspensionMove($event)")
    img(:data-src="'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/'+data.img+'?x-oss-process=style/compress'",
    :data-loading="require('../../../assets/img/default/test1.png')",
    :data-error="require('../../../assets/img/default/test1.png')",)
</template>

<script>
  export default {
    name: "suspension",
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        suspensionPosition: 9
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.suspensionPosition *= parseFloat(this.$method.getStyle(document.getElementsByTagName('html')[0], 'fontSize'))
        this.maxTop = document.documentElement.clientHeight - 112
      })
    },
    methods: {
      suspensionStart(e) {
        e.preventDefault()
        let touch = e.touches[0];
        this.startX = touch.pageX;
        this.startY = touch.pageY;
      },
      suspensionMove(e) {
        e.preventDefault()
        let touch = e.touches[0];
        let deltaX = touch.pageX - this.startX;
        let deltaY = touch.pageY - this.startY;
        this.startY = touch.pageY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          this.suspensionPosition += deltaY
          if (this.suspensionPosition <= 0) {
            this.suspensionPosition = 0
          } else if (this.suspensionPosition>=this.maxTop) {
            this.suspensionPosition = this.maxTop
          }
        }
      },
    }
  }
</script>

<style scoped lang="stylus">
  .suspension {
    width 1.6rem
    height 1.6rem
    position fixed
    right 0
    overflow hidden
    z-index 11
    img {
      width 100%
      pointer-events none
    }
  }
</style>
