<template lang="pug">
  .expressBox
    goods-card.goodsCard(v-for="(i,index) in goodsList", :key="index", @tab="changeType", :list="i.shoppingCartVOList", :storeName="i.si_name", @selectChange="selectChange")
    .disableGoodsBox(v-if="disableGoods.length>0")
      .title
        span 失效商品
        .delete(@click="clearAllDisableGoods") 清空失效商品
      disable-goods(v-for="(i,index) in disableGoods", :key="index", :list="i")
    city-select(:show='selectFlag', :goodsList="nowGoodsDataList", @close="selectClose", @submit="submit")
</template>

<script>
  import goodsCard from './goodsCard'
  import disableGoods from './sendDisableGoods'
  import citySelect from './citySelect'
  export default {
    name: 'express',
    data () {
      return {
        flag: false,
        isdefault: false,
        selectFlag: false,
        nowTab: 1,
        nowGoodsId: '',
        goodsList: [],
        nowGoodsDataList:{},
        disableGoods: []
      }
    },
    components:{goodsCard, disableGoods, citySelect},
    computed:{
      allClick(){
        return this.$store.state.shoppingCartAllChecked
      }
    },
    watch: {
      allClick() {
        this.goodsList.forEach((now)=>{
          now.shoppingCartVOList.forEach((sonNow)=>{
            sonNow.checked = this.$store.state.shoppingCartAllChecked
          })
        })
        this.selectChange()
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      // 勾选变化后
      selectChange () {
        let price = 0
        let checked = []
        this.goodsList.forEach((now)=>{
          now.shoppingCartVOList.forEach((sonNow)=>{
            if (sonNow.checked) {
              price = price + sonNow.goods_num*sonNow.now_price
              checked.push(sonNow)
            }
          })
        })
        this.$store.commit('computedPriceChange', price)
        this.$store.commit('shoppingCartSelectedChange', checked)
      },
      getData () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/sendShoppingCartList',
          params: {},
        }).then(function (response) {
          // 转为数组
          let array = []
          for (let i in response.data.data.send) {
            response.data.data.send[i].shoppingCartVOList.forEach((now)=>{
              now.checked = false
              now.editClose = true
            })
            array.push(response.data.data.send[i])
          }
          self.goodsList = array
          self.disableGoods = response.data.data.failure
        })
      },
      tabChange (num) {
        this.nowTab = num
        if (num === 1) {
          this.$router.push('shopping/express')
        } else {
          this.$router.push('shopping/giveSelf')
        }
      },
      changeType (data,next,index) {
        this.nowGoodsDataList = data
        // 显示门店选择
        this.selectFlag = true
        this.deleteGoods = next
        this.flag = true
        setTimeout(()=>{
          this.flag = false
        },1000)
      },
      // 由changeType的回调函数所重定义的列表删除时间（本地效果，并无数据交互）
      deleteGoods () {
      },
      // 关闭选择城市
      selectClose () {
        // 关闭选择框
        this.selectFlag = false
      },
      // 确定选择城市
      submit (cityId,storeId) {
        // 关闭选择框
        this.selectFlag = false
        if (storeId !== '') {
          // 执行删除动画
          this.deleteGoods()
          // 执行切换请求
          let self = this
          self.$ajax({
            method: 'post',
            url: self.$apiApp + 'shoppingCart/shoppingCartDeliveryWays',
            params: {
              scId: self.nowGoodsDataList.sc_id,
              gskuId: self.nowGoodsDataList.gsku_id,
              provinceNo: self.$store.state.location.province.id,
              cityNo: cityId,
              deliveryWays: 168,
              bsId: storeId
            },
          }).then(function (response) {
            let goodsNum = self.$store.state.shoppingCartGoodsNum
            goodsNum.carryNum+=1
            goodsNum.sendNum-=1
            self.$store.commit('shoppingCartGoodsNumChange',goodsNum)
          })
        }
      },
      // 清空失效商品
      clearAllDisableGoods () {
        let self = this
        let list = []
        this.disableGoods.forEach((now)=>{
          now.shoppingCartVOList.forEach((sunNow)=>{
            list.push(sunNow.sc_id)
          })

        })
        list = list.join(',')
        self.$ajax({
          method: 'delete',
          url:self.$apiApp +  'shoppingCart/shoppingCart/delete',
          params: {
            scIdArray: list
          },
        }).then(function (response) {
          self.disableGoods = []
          self.$message.success('清除成功')
        })
      }
    }
  }
</script>

<style scoped>
  /* 商品卡片 */
  .goodsCard {
    margin-top: .2rem;
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
