<template lang="pug">

</template>

<script>
  export default {
    name: "self",
    methods: {
      // 获取自提数据
      getSelfList() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/v2/queryCarryShoppingCartList1',
          params: {}
        }).then(function (res) {
          if(res) {
            self.expressList = res.data.data
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
