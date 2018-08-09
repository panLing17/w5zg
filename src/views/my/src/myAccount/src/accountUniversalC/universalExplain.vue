<template lang="pug">
  .universalExplain
    nav-bar(background="#f70057")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="./back.png", style="width:.586rem")
      .topCenter(slot="center", style="color:#fff") 通用券说明
      .topRight(slot="right")
    explain(:data="")
</template>

<script>
  import Explain from '../../../explain'
  export default {
    name: "universalExplain",
    data() {
      return {

      }
    },
    components: {
      Explain
    }
  }
</script>

<style scoped>

</style>
