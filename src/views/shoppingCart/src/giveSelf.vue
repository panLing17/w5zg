<template lang="pug">
  .expressBox
    self-goods.goodsCard( @tab="changeType", :goodsList="goodsList")
    .disableGoodsBox(v-if="disableGoodsList.length>0")
      .title
        span 失效商品
        .delete 清空失效商品
      disable-goods
</template>

<script>
  import selfGoods from './selfGoods'
  import disableGoods from './disableGoods'
  export default {
    name: 'give-self',
    data () {
      return {
        flag: false,
        isdefault: false,
        nowTab: 1,
        goodsList: [],
        disableGoodsList: []
      }
    },
    components:{selfGoods, disableGoods},
    mounted () {
      this.getData()
    },
    methods: {
      tabChange (num) {
        this.nowTab = num
        if (num === 1) {
          this.$router.push('shopping/express')
        } else {
          this.$router.push('shopping/giveSelf')
        }
      },
      getData () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/carryShoppingCartList',
          params: {},
        }).then(function (response) {
          response.data.data.carryList.forEach((now)=>{
            now.checked = false
            now.editClose = true
          })
          self.goodsList = response.data.data.carryList
          self.disableGoods = response.data.data.failureList
        })
      },
      changeType (data,fun) {
        this.$confirm({
          title: '更换配送方式',
          message: '确定要更换为快递配送吗？',
          confirm: () => {
            // 执行删除动画
            fun()
            // 执行删除请求
            let self = this
            self.$ajax({
              method: 'post',
              url: self.$apiApp + 'shoppingCart/shoppingCartDeliveryWays',
              params: {
                scId: data.sc_id,
                gskuId: data.gsku_id,
                provinceNo: self.$store.state.location.province.id,
                cityNo: self.$store.state.location.city.id,
                deliveryWays: 167
              },
            }).then(function (response) {
              let goodsNum = self.$store.state.shoppingCartGoodsNum
              goodsNum.carryNum-=1
              goodsNum.sendNum+=1
              self.$store.commit('shoppingCartGoodsNumChange',goodsNum)
            })
          },
          noConfirm: () => {

          }
        })
      }
    }
  }
</script>

<style scoped>
  /* 商品卡片 */
  .goodsCard {

  }
  /* 失效商品 */
  .disableGoodsBox {
    margin-top: .2rem;
  }
  .disableGoodsBox .title{
    width: 100%;
    height: 1rem;
    padding-left: .2rem;
    background-color: white;
    border-bottom: solid 1px #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .disableGoodsBox .title span{
    font-weight: 600;
    font-size: .4rem;
    color: #666;
  }
  .disableGoodsBox .title .delete{
    margin-right: .2rem;
    font-size: .3rem;
    color: rgb(255,128,171);
  }
</style>
