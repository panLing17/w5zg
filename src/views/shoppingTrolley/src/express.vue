<template lang="pug">
  .express
    no-data(v-show="isEmpty")
    .listWrapper(v-show="!isEmpty")
      item(:data="data")

</template>

<script>
  // 无数据
  import NoData from './noData'
  // 列表
  import Item from './item'
  export default {
    name: "express",
    data() {
      return {
        data: {}, // 快递配送合集
      }
    },
    computed: {
      isEmpty() {
        if ((this.data.commList && this.data.commList.length) || (this.data.failure && this.data.failure.length)) {
          return false
        } else {
          return true
        }
      }
    },
    created() {
      this.getExpressList()
    },
    methods: {
      // 获取快递配送数据
      getExpressList() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'shoppingCart/v2/querySendShoppingCartList1',
          params: {}
        }).then(function (res) {
          if(res) {
            self.data = res.data.data
          }
        })
      },
    },
    components: {
      NoData,
      Item
    }
  }
</script>

<style scoped lang="stylus">
  .listWrapper {
    ul {
      li {

      }
    }
  }
</style>
