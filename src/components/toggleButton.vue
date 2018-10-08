<template lang="pug">
  label.toggleButton(@click="changeBtn")
    input(type="radio", :checked="checked")
    .circleWrapper(:style="{'background-color': checked?'#f70057':'#cecece'}")
      .circle(:style="{transform: checked?'translate3d(.75rem, -50%, 0)':'translate3d(.05rem, -50%, 0)'}")
</template>

<script>
  export default {
    name: "toggleButton",
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      checked: Boolean,
      optional: Boolean
    },
    methods: {
      changeBtn() {
        if (this.optional) {
          this.$emit('change', !this.checked)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .toggleButton {
    display inline-block
    input {
      display none
    }
  }
  .circleWrapper {
    width 1.2rem
    height .53rem
    border-radius .26rem
    overflow hidden
    position relative
    user-select none
    transition all .5s
    .circle {
      width .42rem
      height .42rem
      background-color #fff
      border-radius 50%
      position absolute
      top 50%
      left 0
      transition all .5s
    }
  }
</style>
