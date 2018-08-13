<template lang="pug">
  .expressBox(:class="{minHeight: goodsList.length>0}")
    goods-card.goodsCard(v-for="(i,index) in goodsList", @clearGoods="clearGoods", :goodsList="goodsList", :key="index", @tab="changeType", :list="i.shoppingCartVOList", :checked="i.checked", :storeName="i.si_name", @selectChange="selectChange")
    div(v-if="goodsList.length<1").zeroGoodsBox
      img(src="../../../assets/img/cardZeroGoods.png").zeroGoods
      .zeroDesc1 购物车是空的！
      .zeroDesc2 “再忙, 也要记得多去犒赏自己哦！”
    .disableGoodsBox(v-if="disableGoods.length>0")
      .title
        span 失效商品
        .delete(@click="clearAllDisableGoods") 清空失效商品
      disable-goods(v-for="(i,index) in disableGoods", :key="index", :list="i")
    specChange(ref="specChange")
    onlyStoreSelect(:show="changeStoreFlag", @close="changeStoreFlag = false", @change="storeChange")
</template>

<script>
  import onlyStoreSelect from '../../goods/src/onlyStoreSelect'
  import goodsCard from './goodsCard'
  import disableGoods from './sendDisableGoods'
  import citySelect from './citySelect'
  import {mapState} from 'vuex'
  import specChange from './specChange'
  import {bus} from '../../../bus'
  export default {
    name: 'express',
    data () {
      return {
        flag: false,
        isdefault: false,
        selectFlag: false,
        changeStoreFlag: false,
        nowTab: 1,
        nowGoodsId: '',
        goodsList: [],
        nowGoodsDataList:{},
        disableGoods: []
      }
    },
    components:{goodsCard, disableGoods, citySelect, onlyStoreSelect,specChange},
    computed:{
      allClick(){
        return this.$store.state.shoppingCartAllChecked
      },
      ...mapState(['shoppingCartSelected'])
    },
    watch: {
      allClick(val) {
        if (!this.$store.state.exitAllChecked) {
          return
        }
        let scId = []
        this.goodsList.forEach((now)=>{
          now.checked = val
          now.shoppingCartVOList.forEach((sonNow)=>{
            sonNow.checked = val
            scId.push(sonNow.sc_id)
          })
        })

        let self = this
        self.$ajax({
          method: 'post',
          url:self.$apiApp +  'shoppingCart/selectShoppingCart',
          params: {
            scIdArray : scId.join(','),
            checked: val
          },
        }).then(function (response) {
        })
        this.selectChange()
      }
    },
    mounted () {
      this.getData()
      bus.$on('expressGetData',()=>{this.getData()})
    },
    activated () {
      this.getData()
      // bus.$on('expressGetData',()=>{this.getData()})
    },
    methods: {
      openSpecChange (id, spec) {
        this.$refs['specChange'].show = true
        this.$refs['specChange'].init(id, spec)
      },
      storeChange (data) {
        let {
          bs_city_no: cityId,
          bs_province_no: provinceId,
          bs_id: storeId
        } = data.allData
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
            provinceNo: provinceId,
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
      },
      clearGoods (){
        let i = this.goodsList.length
        while(i--) {
          if (this.goodsList[i].shoppingCartVOList.length === 0) {
            this.goodsList.splice(i, 1)
          }
        }
        this.$emit('clear')
      },
      // 勾选变化后
      selectChange () {
        let price = 0
        let counterPrice = 0
        let checked = []
        this.goodsList.forEach((now)=>{
          now.shoppingCartVOList.forEach((sonNow)=>{
            if (sonNow.checked) {
              counterPrice = counterPrice + sonNow.goods_num * sonNow.counter_price
              price = price + sonNow.goods_num*sonNow.direct_supply_price
              sonNow.si_id = now.si_id
              checked.push(sonNow)
            }
          })
        })

        // 计算总长度
        let allGoodsLen = 0
        this.goodsList.forEach((now)=>{
          now.shoppingCartVOList.forEach((sonNow)=>{
            allGoodsLen += 1
          })
        })
        // 全选按钮选择
        if (allGoodsLen === checked.length && allGoodsLen !== 0) {
          this.$store.commit('allCheckedChange', true)
        }
        // 反选全选按钮
        if (checked.length < allGoodsLen) {
          this.$store.commit('exitAllCheckedChange', false)
          this.$store.commit('allCheckedChange', false)
        }
        // 获取配送订单信息（然后转入中转，因为运费展示难以计算,如果用户操作过快，选择商品后迅速点击结算可能会有bug）
          let self = this
          let cartId = []
          checked.forEach((now)=>{
            cartId.push(now.sc_id)
          })
        cartId = cartId.join(',')

        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/submitSendList1',
          params: {
            scIdArray: cartId
          }
        }).then(function (response) {
          self.$store.commit('shoppingCartSelectedChange', response.data.data)
        })
        let priceData = {
          allPrice: price,
          counterPrice: counterPrice
        }
        this.$store.commit('computedPriceChange', priceData)
      },
      getData () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/querySendShoppingCartList1',
          params: {},
        }).then(function (response) {
          // 转为数组
          let array = []
          let topIndex = {}
          for (let i in response.data.data.commList) {
<<<<<<< .merge_file_a07548
            response.data.data.commList[i].shoppingCartVOList.forEach((now, index)=>{
              // 如果是降价通知过来的，需将商品第一个显示
              if (self.$store.state.informGoods) {
                if (self.$store.state.informGoods.rel_id == now.sc_id && self.$store.state.informGoods.gspu_id == now.gspu_id) {
                  self.$emit('scroll')
                  self.$store.commit('setInformGoods', null)
                  topIndex = {
                    first: i,
                    second: index
                  }
                }
              }
=======
            if (response.data.data.commList[i].checked === '011') {
              response.data.data.commList[i].checked = true
            } else {
              response.data.data.commList[i].checked = false
            }
            response.data.data.commList[i].shoppingCartVOList.forEach((now)=>{
>>>>>>> .merge_file_a06316
              if (now.checked === '011') {
                now.checked = true
              } else {
                now.checked = false
              }

              now.editClose = true
            })
            array.push(response.data.data.commList[i])
          }
          // 交换位置
          if (topIndex.first) {
            let temp = array[topIndex.first].shoppingCartVOList[0]
            if (topIndex.second != 0) {
              array[topIndex.first].shoppingCartVOList[0] = array[topIndex.first].shoppingCartVOList[topIndex.second]
              array[topIndex.first].shoppingCartVOList[topIndex.second] = temp
            }
            if (topIndex.first != 0) {
              temp = array[0]
              array[0] = array[topIndex.first]
              array[topIndex.first] = temp
            }
          }
          self.goodsList = array
          self.disableGoods = response.data.data.failure
          self.selectChange()
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
        this.changeStoreFlag = true
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
          self.$emit('clear')
          self.disableGoods = []
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
