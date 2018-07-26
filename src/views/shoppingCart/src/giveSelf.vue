<template lang="pug">
  .expressBox(:class="{minHeight: goodsList.length>0}")
    self-goods.goodsCard( @tab="changeType", :goodsList="goodsList", @clear="$emit('clear')")
    div(v-if="goodsList.length<1").zeroGoodsBox
      img(src="../../../assets/img/cardZeroGoods.png").zeroGoods
      .zeroDesc1 购物车是空的！
      .zeroDesc2 “再忙, 也要记得多去犒赏自己哦！ ”
    .disableGoodsBox(v-if="disableGoodsList.length>0")
      .title
        span 失效商品
        .delete(@click="clearAllDisableGoods") 清空失效商品
      disable-goods(v-for="(i,index) in disableGoodsList", :key="index", :list="i")
</template>

<script>
  import selfGoods from './selfGoods'
  import disableGoods from './sendDisableGoods'

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
    components: {selfGoods, disableGoods},
    mounted () {
      this.getData()
    },
    activated () {
      this.getData()
    },
    // beforeRouteEnter (to, from, next) {
    //   next(vm => {
    //     vm.getData()
    //   })
    // },
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
          url: self.$apiApp + 'shoppingCart/queryCarryShoppingCartList1',
          params: {},
        }).then(function (response) {
          // let storeList = []
          // response.data.data.carryList.forEach((now)=>{
          //   now.checked = false
          //   now.editClose = true
          //   if (storeList.indexOf(now.store_name) === -1) {
          //     storeList.push(now.store_name)
          //   }
          // })
          // let storeListOfJson = []
          // storeList.forEach((now)=>{
          //   storeListOfJson.push({
          //     checked: false,
          //     storeName: now,
          //     goodsList: []
          //   })
          // })
          // storeListOfJson.forEach((now)=>{
          //   response.data.data.carryList.forEach((goodsNow)=>{
          //     if (goodsNow.store_name === now.storeName) {
          //       now.goodsList.push(goodsNow)
          //     }
          //   })
          // })

          // console.log(storeListOfJson)
            response.data.data.commList.forEach((now)=>{
              now.checked = false
              now.editClose = true
              now.shoppingCartVOList.forEach((sonNow)=>{
                sonNow.checked = false
                sonNow.editClose = true
              })
            })
          console.log(response.data.data.commList)
          self.goodsList = response.data.data.commList
          self.disableGoodsList = response.data.data.failure
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
      },
      // 清空失效商品
      clearAllDisableGoods () {
        let self = this
        let list = []
        this.disableGoodsList.forEach((now)=>{
          list.push(now.sc_id)
        })
        list = list.join(',')
        self.$ajax({
          method: 'delete',
          url:self.$apiApp +  'shoppingCart/shoppingCart/delete',
          params: {
            scIdArray: list
          },
        }).then(function (response) {
          self.$emit('clear')
          self.disableGoodsList = []
          self.$message.success('清除成功')
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .minHeight {
    min-height: "calc(100vh - %s)" % ($height-footer+$height-header+2.2rem)
  }
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
  /* 空购物车 */
  .zeroGoodsBox {
    font-size: 0;
    text-align: center;
  }
  .zeroGoods {
    width: 2.66rem;
    margin-top: 1.33rem;
  }
  .zeroDesc1 {
    margin-top: .16rem;
    font-size:.48rem;
    color:rgb(119,119,119);
    line-height:.66rem;
  }
  .zeroDesc2 {
    margin: .13rem 0 1.7rem;
    font-size:.34rem;
    color:rgb(119,119,119);
    line-height:.48rem;
  }
</style>
