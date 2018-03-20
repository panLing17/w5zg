<template lang="pug">
  .buttonBox
    .button(:style="{width:width,color:color}", @click="click")
      slot
</template>

<script>
  export default {
    name: "button",
    props: {
      width: {
        type: String,
        default: '7rem'
      },
      color: {
        type: String,
        default: 'white'
      }
    },
    methods: {
      click () {
        this.$emit('click')
      }
    }
  }
</script>

<style scoped>
  .button {
    height: 1rem;
    background-color: rgb(245,0,87);
    border-radius: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
