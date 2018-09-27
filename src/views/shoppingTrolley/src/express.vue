<template lang="pug">
  .express
    no-data(v-show="isEmpty")
    .listWrapper(v-show="!isEmpty")
      item(
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
  import Item from './item'
  // 城市选择弹框
  import SelectCity from 'views/goodsDetails/express'
  // 自提门店选择弹框
  import SelectStore from 'views/goodsDetails/selectStore'
  import {shoppingCart} from "./mixin"

  export default {
    name: "express",
    mixins: [shoppingCart],
    data() {
      return {
        data: {}, // 快递配送合集
        addressList: [], //收货地址合集
        storeList: [], //门店集合
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
            self.data = res.data.data
          }
        })
      }
    },
    components: {
      NoData,
      Item,
      SelectCity,
      SelectStore
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
