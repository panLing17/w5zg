<template lang="pug">
  div
    transition(name="fade" , mode="out-in")
      router-view
</template>

<script>
  export default {
    name: "home"
  }
</script>

<style scoped>

</style>
