<template>
  <transition name="fade">
    <img src="1.jpg" v-if="flag"/>
    <img src="1.jpg" v-else>
  </transition>
</template>

<script>
  export default {
    name: "a",
    data () {
      return {
        a:[1,2,3,4,5,6]
      }
    },
    mounted () {
      this.a.length = 1
      this.a[0] = 6
      console.log(a)
    }
  }
</script>

<style scoped>

</style>
