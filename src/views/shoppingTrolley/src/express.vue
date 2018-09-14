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
  import {shoppingCart} from "./mixin"

  export default {
    name: "express",
    mixins: [shoppingCart],
    data() {
      return {
        data: {}, // 快递配送合集
      }
    },
    activated() {
      this.getExpressList()
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
            self.dataFormat(res.data.data)
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
