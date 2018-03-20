<template lang="pug">
  .checkBox
    transition(name="bounce" , mode="out-in")
      img(src="../assets/img/checked.png" v-if="msg" , @click="change")
      .radius(v-if="!msg" , @click="change")
    input.realyCheckbox(type="checkbox", :checked="msg", @change="update")
</template>

<script>
  export default {
    name: 'w-checkbox',
    model: {
      prop: 'msg',
      event: 'cMsg'
    },
    props: ['msg', 'disabled', 'fun'],
    methods: {
      change () {
        if (!this.disabled) {
          this.$emit('cMsg', !this.msg)
        }
      },
      update () {
        this.$emit('change')
      }
    }
  }
</script>

<style scoped>
  .checkBox {
    overflow: hidden;
    width: 20px;
    height: 20px;
  }

  .radius {
    width: 18px;
    height: 18px;
    border-radius: 10px;
    border: solid 1px #666;
  }

  .checkBox img {
    width: 18px;
    height: 18px
  }
  .realyCheckbox {
    position: absolute;
    opacity: 0;
  }
</style>
