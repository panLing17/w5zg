<template lang="pug">
  .self
    no-data(v-show="isEmpty")
    .listWrapper(v-show="!isEmpty")
      card(
      :data="data",
      @goods-change="goodsChange",
      @change-ways="changeWays",
      @delete-Goods="delGoods",
      )
    select-city(ref="selectCity", :addressList="[]", @select-city="selectCity")
    select-store(ref="selectStore", :from="1", :data="storeList", @store-select="selectStore")
</template>

<script>
  // 无数据
  import NoData from './noData'
  // 列表
  import Card from './card'
  // 城市选择弹框
  import SelectCity from 'views/goodsDetails/express'
  // 自提门店选择弹框
  import SelectStore from 'views/goodsDetails/selectStore'
  import {shoppingCart} from "./mixin"
  export default {
    name: "self",
    mixins: [shoppingCart],
    data() {
      return {
        data: {}
      }
    },
    created() {
      this.getSelfList()
    },
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
            self.data = res.data.data
          }
        })
      }
    },
    components: {
      Card,
      NoData,
      SelectCity,
      SelectStore
    }
  }
</script>

<style scoped>

</style>
