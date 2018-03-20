<template lang="pug">
  div
    transition(name="fade" , mode="out-in")
      router-view
</template>

<script>
  export default {
    name: "my"
  }
</script>

<style scoped>

</style>
