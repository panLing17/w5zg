<template lang="pug">
  .checkBox
    transition(name="bounce" , mode="out-in")
      img(src="../assets/img/checked.png" v-if="msg" , @click="change")
    .radius(v-if="!msg" , @click="change")
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
          this.fun()
        }
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
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: solid 1px rgb(252, 139, 109);
  }

  .checkBox img {
    width: 20px;
    height: 20px
  }
</style>
