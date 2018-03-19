<template lang="pug">
  div
    transition(name="slide-fade" , mode="out-in")
      router-view
</template>

<script>
  export default {
    name: "my"
  }
</script>

<style scoped>

</style>
