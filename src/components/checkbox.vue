<template lang="pug">
  .checkBox
    transition(name="bounce" , mode="out-in")
      .img(v-if="msg" , @click="change", key="1")
        .imgRadius
      .radius(v-if="!msg" , @click="change", key="2")
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
        this.$emit('change', !this.msg)
      },
      update () {
        
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

  .checkBox .img {
    width: 18px;
    height: 18px;
    border-radius: 9px;
    border: solid 1px rgb(244,0,84);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .imgRadius {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: rgb(244,0,84);
  }
  .realyCheckbox {
    position: absolute;
    opacity: 0;
  }
</style>
