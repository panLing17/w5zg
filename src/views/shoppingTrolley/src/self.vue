<template lang="pug">
  .self(v-loading="loadingShow")
    no-data(v-show="isEmpty")
    .listWrapper(v-show="!isEmpty")
      .commList
        ul.storeWrapper
          li.store(v-for="(item, index) in data.commList")
            .storeTitle(@click="storeCheckedChange(item)")
              .left
                img(src="./gou.png", v-show="item.checked==='011'")
                .noChecked(v-show="item.checked==='012'")
              .right {{item.store_name}}
            .storeContent
              ul.goodsWrapper
                li.goods(v-for="(goods, i) in item.shoppingCartVOList",
                         @touchstart="touchstart($event)",
                         @touchmove="touchmove($event)",
                         @touchend="touchend($event, index, i)",
                         @contextmenu.prevent=""
                          )
                  .left(@click.stop="goodsCheckedChange(goods, index)", @contextmenu.prevent="")
                    img(src="./gou.png", v-show="goods.checked==='011'", @contextmenu.prevent="")
                    .noChecked(v-show="goods.checked==='012'")
                  .right
                    .logo(@click="$router.push({path: '/goodsDetailed',query:{id: goods.gspu_id}})", @contextmenu.prevent="")
                      .mask(v-if="goods.goods_num>goods.storage_num", @contextmenu.prevent="") 库存不足
                      img(:src="goods.logo | img-filter")
                    .info
                      .name(@click="$router.push({path: '/goodsDetailed',query:{id: goods.gspu_id}})", @contextmenu.prevent="") {{goods.gi_name}}
                      .tool
                        .detail(@click.stop="specChange(goods, index, i)", @contextmenu.prevent="")
                          ul
                            li(v-for="detail in goods.specVOList") {{detail.gspec_value}};
                        .countWrapper
                          .minus(@click.stop="minus(goods)", @contextmenu.prevent="")
                            img(src="./minus.png")
                          .count(@contextmenu.prevent="") {{goods.goods_num}}
                          .add(@click.stop="add(goods)", @contextmenu.prevent="")
                            img(src="./add.png")
                      .priceWrapper(@contextmenu.prevent="")
                        .leftPrice
                          span.desc 实付价:
                          span.price {{goods.direct_supply_price | price-filter}}
                        .rightPrice 专柜价:{{goods.counter_price | price-filter}}
                      .toolbar(@contextmenu.prevent="")
                        .cut(v-show="goods.difference_price>0") 比加入时降{{goods.difference_price}}元
                        .btn(@click.prevent="openPop(goods, index, i)")
                          img(src="./btn.png")
                          .pop(v-show="goods.popShow")
                            .popMask(@click.stop="hidePop(goods, index, i)")
                            .sanjiao
                            .popItem(@click.stop="changeWays(goods, index, i)")
                              img(src="./refresh.png")
                              span 快递配送
                            .popItem(@click.stop="changeStore(goods, index, i)")
                              img(src="./address.png")
                              span 切换专柜
                  .maskBox(v-show="goods.maskShow", @click.stop="closeMask(index, i)")
                    .collection(@click.stop="goCollection(goods, index, i)") 移入<br/>收藏夹
                    .delete(@click.stop="deleteGoods(goods, index, i)") 删除
            .address(v-show="item.store_address")
              img(src="./address2.png")
              span {{item.store_address}}
      .failure(v-if="data.failure && data.failure.length")
        .title
          .left 失效商品共 {{data.failure.length}} 件
          .right(@click="delAllFailure") 清空失效商品
        .content
          ul
            li(v-for="(item, i) in data.failure")
              ul.itemWrapper
                li.item(v-for="(goods, index) in item.shoppingCartVOList")
                  .left(@click="$router.push({path: '/goodsDetailed',query:{id: goods.gspu_id}})")
                    .mask 失效
                    img(:src="goods.logo | img-filter")
                  .right
                    .name(@click="$router.push({path: '/goodsDetailed',query:{id: goods.gspu_id}})") {{goods.gi_name}}
                    .size
                      ul
                        li(v-for="detail in goods.specVOList") {{detail.gspec_value}};
                    .text 该商品已失效
                  .del(@click="delFailureGoods(goods, index, i)")
                    img(src="./del2.png")
    select-size(ref="selectSize",
                :specGroup="specList",
                :resetSpec="resetSpec",
                @spec-change="specChangeRight"
                )
    select-store(ref="selectStore", :from="1", :data="storeList", @store-select="selectStore")
    // 结算失效库存不足弹框-----------------------------------------------------------------------
    check-goods(ref="checkGoods", :data="checkGoodsData", :btnType="btnType", @go-order="goOrderPage")
</template>

<script>
  // 无数据
  import NoData from './noData'
  // 自提门店选择弹框
  import SelectStore from 'views/goodsDetails/selectStore'
  import SelectSize from './selectSize'
  import {shoppingCart} from "./mixin"
  import {mapGetters, mapMutations} from 'vuex'
  import CheckGoods from './checkGoods'
  export default {
    name: "self",
    mixins: [shoppingCart],
    data() {
      return {
        loadingShow:true,
        data: {},
        specList: [], // 商品规格
        resetSpec: {}, // 更改规格时初始化的参数
        specCurrentIndex: {}, // 更改规格当前商品的下标
        checkGoodsData: [], // 结算不合格商品
        btnType: 0
      }
    },
    created() {
      this.getSelfList()
      this.queryCartMoneyAjax('168')
    },
    activated() {
      this.getSelfList()
      this.queryCartMoneyAjax('168')
    },
    watch: {
      totalCount(newVal) {
        let count = 0
        this.data.commList.forEach(item=>{
          count += item.shoppingCartVOList.length
        })
        if(Number(newVal)===count && count!==0) {
          this.$emit('all-change', true)
        } else {
          this.$emit('all-change', false)
        }
      }
    },
    computed: {
      ...mapGetters(['shoppingCartGoodsNum'])
    },
    methods: {
      touchend(e, index, i) {
        clearTimeout(this.timeOutEvent);
        if(this.timeOutEvent!=0 && this.longClick==1){
          e.preventDefault()
          let t = this.data.commList[index].shoppingCartVOList[i]
          t.maskShow = true
          this.data.commList[index].shoppingCartVOList.splice(i, 1, t)
        }
        return false;
      },
      // 获取自提数据
      getSelfList() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'shoppingCart/v2/queryCarryShoppingCartList1',
          params: {}
        }).then(function (res) {
          if(res) {
            self.data = res.data.data
            // 判断是否全选,和选中数量
            let count = 0
            let totalCount = 0
            self.data.commList.forEach(item=>{
              if (item.checked === '011') {
                count++
              }
              item.shoppingCartVOList.forEach(goods=>{
                goods.maskShow = false
                goods.popShow = false
                totalCount++
              })
            })
            if (count===self.data.commList.length && count!==0) {
              self.$emit('all-change', true)
            } else {
              self.$emit('all-change', false)
            }
            if (totalCount===0) {
              self.$emit('show-change', false)
            } else {
              self.$emit('show-change', true)
            }
            self.loadingShow = false
          }
        })
      },
      // 门店全选切换
      storeCheckedChange(item) {
        let temp = item.checked==='011'?'012':'011'
        let arr = []
        item.shoppingCartVOList.forEach(li=>{
          if (li.checked !== temp) {
            arr.push(li.sc_id)
            li.checked = temp
          }
        })
        let params = {
          scIdArray: arr.join(','),
          checked: temp==='011'?true:false
        }
        this.selectAjax(params, ()=>{
          this.queryCartMoneyAjax('168')
        })
        item.checked = temp
      },
      // 商品选择
      goodsCheckedChange(goods, index) {
        goods.checked = goods.checked==='011'?'012':'011'
        let params = {
          scIdArray: goods.sc_id,
          checked: goods.checked==='011'?true:false
        }
        this.selectAjax(params, ()=>{
          this.queryCartMoneyAjax('168')
        })
        this.data.commList.forEach(item=>{
          let count = 0
          item.shoppingCartVOList.forEach(goods=>{
            if (goods.checked==='011') {
              count++
            }
          })
          if(count===item.shoppingCartVOList.length) {
            item.checked = '011'
          } else {
            item.checked = '012'
          }
        })
      },
      // 规格切换
      specChange(goods, index, i) {
        this.specCurrentIndex = {
          index: index,
          i: i
        }
        this.specChangeCommon(goods)
      },
      // 规格切换完成
      specChangeRight() {
        this.getSelfList()
        this.queryCartMoneyAjax('168')
      },
      // 切换配送方式
      changeWays(goods, index, i) {
        goods.popShow = false
        this.data.commList[index].shoppingCartVOList.splice(i, goods)
        this.$verify({
          content: '确定要切换为“快递配送”？',
          leftText: '取消',
          rightText: '确定',
          rightFn: () => {
            let params = {
              scId: goods.sc_id,
              deliveryWays: '167'
            }
            this.updateAjax(params, ()=>{
              this.queryCartMoneyAjax('168')
            })
            this.setShoppingCartCount({
              sendNum: this.shoppingCartGoodsNum.sendNum+1,
              carryNum: this.shoppingCartGoodsNum.carryNum-1
            })
            this.data.commList[index].shoppingCartVOList.splice(i, 1)
            if (this.data.commList[index].shoppingCartVOList.length===0) {
              this.data.commList.splice(index, 1)
            }
          }
        })
      },
      // 切换专柜
      changeStore(goods, index, i) {
        goods.popShow = false
        this.data.commList[index].shoppingCartVOList.splice(i, goods)
        this.specCurrentIndex = {
          index: index,
          i: i
        }
        let params = {
          gspu_id: goods.gspu_id,
          gsku_id: goods.gsku_id
        }
        this.storeListAjax(params, (data)=>{
          this.storeList = data
          this.$refs.selectStore.show()
        })
      },
      // 专柜选择完成
      selectStore(data) {
        let goods =this.data.commList[this.specCurrentIndex.index].shoppingCartVOList[this.specCurrentIndex.i]
        let params = {
          scId: goods.sc_id,
          bsId: data.bs_id
        }
        this.updateAjax(params)
        this.data.commList[this.specCurrentIndex.index].store_address = data.bs_address
      },
      // 关闭删除蒙版
      closeMask(index, i) {
        let t = this.data.commList[index].shoppingCartVOList[i]
        t.maskShow = false
        this.data.commList[index].shoppingCartVOList.splice(i, 1, t)
      },
      // 移入收藏夹
      goCollection(goods, index, i) {
        this.setShoppingCartCount({
          carryNum: this.shoppingCartGoodsNum.carryNum-1
        })
        let params = {
          gspuId: goods.gspu_id
        }
        this.collectionAjax(params)
        let params2  ={
          scIdArray: goods.sc_id
        }
        this.deleteAjax(params2, () => {
          this.queryCartMoneyAjax('168')
        })
        this.data.commList[index].shoppingCartVOList.splice(i, 1)
        if (this.data.commList[index].shoppingCartVOList.length===0) {
          this.data.commList.splice(index, 1)
        }
      },
      // 删除商品
      deleteGoods(goods, index, i) {
        this.$verify({
          content: '确认删除所选商品吗？',
          leftText: '取消',
          rightText: '删除',
          rightFn: () => {
            let params = {
              scIdArray: goods.sc_id
            }
            this.setShoppingCartCount({
              carryNum: this.shoppingCartGoodsNum.carryNum-1
            })
            this.deleteAjax(params, ()=>{
              this.queryCartMoneyAjax('168')
              this.$notify({
                content: '删除成功',
                bottom: 3.2
              })
            })
            this.data.commList[index].shoppingCartVOList.splice(i, 1)
            if (this.data.commList[index].shoppingCartVOList.length===0) {
              this.data.commList.splice(index, 1)
            }
          }
        })
      },
      // 删除失效商品
      delFailureGoods(goods, index, i) {
        let params = {
          scIdArray: goods.sc_id
        }
        this.deleteAjax(params, ()=>{
          this.$notify({
            content: '删除成功',
            bottom: 3.2
          })
        })
        this.data.failure[index].shoppingCartVOList.splice(i, 1)
        if (this.data.failure[index].shoppingCartVOList.length===0) {
          this.data.failure.splice(index, 1)
        }
        this.setShoppingCartCount({
          carryNum: this.shoppingCartGoodsNum.carryNum-1
        })
      },
      // 清空失效商品
      delAllFailure() {
        this.$verify({
          content: '确定要清除所有失效商品吗？',
          leftText: '取消',
          rightText: '确定',
          rightFn: () => {
            let params
            let arr = []
            let count = 0
            this.data.failure.forEach(item => {
              item.shoppingCartVOList.forEach(goods=>{
                arr.push(goods.sc_id)
                count++
              })
            })
            this.setShoppingCartCount({
              carryNum: this.shoppingCartGoodsNum.carryNum-count
            })
            params = {
              scIdArray: arr.join(',')
            }
            this.data.failure = []
            this.deleteAjax(params, ()=>{
              this.$notify({
                content: '删除成功',
                bottom: 3.2
              })
            })
          }
        })
      },
      // 全选
      selectAll(flag) {
        let arr = []
        this.data.commList.forEach(item=> {
          item.shoppingCartVOList.forEach(goods=>{
            if (flag && goods.checked==='012') {
              arr.push(goods.sc_id)
            }
            if (!flag && goods.checked==='011') {
              arr.push(goods.sc_id)
            }
            goods.checked=flag?'011':'012'
          })
          item.checked=flag?'011':'012'
        })
        let params = {
          scIdArray: arr.join(','),
          checked: flag
        }
        this.selectAjax(params, ()=>{
          this.queryCartMoneyAjax('168')
        })
      },
      // 批量删除
      deleteAll() {
        let arr = []
        let count = 0
        let indexArr = []
        this.data.commList.forEach((item, index) => {
          item.shoppingCartVOList.forEach((goods, i)=>{
            if (goods.checked==='011') {
              arr.push(goods.sc_id)
              count++
              indexArr.push({
                index: index,
                i: i
              })
            }
          })
        })
        if (arr.length===0) {
          this.$notify({
            content: '请勾选商品',
            bottom: 3.2
          })
          return
        }
        indexArr.forEach(item => {
          this.data.commList[item.index].shoppingCartVOList.splice(item.i, 1)
          if(this.data.commList[item.index].shoppingCartVOList.length===0) {
            this.data.commList.splice(item.index, 1)
          }
        })
        this.setShoppingCartCount({
          sendNum: this.shoppingCartGoodsNum.sendNum-count
        })
        let params = {
          scIdArray: arr.join(',')
        }
        this.deleteAjax(params, ()=>{
          this.queryCartMoneyAjax('167')
          this.$notify({
            content: '删除成功',
            bottom: 3.2
          })
        })
      },
      // 结算
      checkCart() {
        let arr = []
        let selectedCount = 0
        this.data.commList.forEach(item=>{
          item.shoppingCartVOList.forEach(goods=>{
            if (goods.checked==='011') {
              arr.push(goods.sc_id)
              selectedCount++
            }
          })
        })
        if (arr.length===0) {
          this.$notify({
            content: '请勾选商品',
            bottom: 3.2
          })
          return
        }
        let params = {
          scIdArray: arr.join(',')
        }
        this.checkCartAjax(params, (data)=>{
          let count = 0
          let type = 0
          data.forEach(item=>{
            if (item.status_flag!=='VALID') {
              count++
            }
            if (item.status_flag==='BUY_NUM_OVER_STORAGE_NUM') {
              type = 1
            }
          })
          if (selectedCount>count) {
            type = 1
          }
          if (count>0) {
            this.checkGoodsData = data
            this.btnType = type
            this.$refs.checkGoods.show()
          } else {
            this.goOrderPage(true)
          }
        })
      },
      // 跳往确认订单页
      goOrderPage(flag) {
        let temp = {
          from: 1,
          shippingMethods: 1
        }
        let arr = []
        this.data.commList.forEach(item=>{
          item.shoppingCartVOList.forEach(goods=>{
            if (goods.checked==='011') {
              arr.push(goods)
            }
          })
        })
        if(flag) {
          temp.list = arr
        } else {
          this.checkGoodsData.forEach(item=>{
            if (item.status_flag==='NO_STORAGE_NUM' || item.status_flag==='GOOD_STATUS_ERROR') {
              for(let i=arr.length-1;i>=0;i--) {
                if (item.sc_id===arr[i].sc_id) {
                  arr.splice(i, 1)
                }
              }
            }
          })
          temp.list = arr
        }
        this.setConfirmData(temp)
        this.$router.push('/orderConfirm')
      },
      // 数量改变后动作
      countCallback() {
        this.queryCartMoneyAjax('168')
      },
      openPop(goods, index, i) {
        goods.popShow = !goods.popShow
        this.data.commList[index].shoppingCartVOList.splice(i, goods)
      },
      hidePop(goods, index, i) {
        goods.popShow = false
        this.data.commList[index].shoppingCartVOList.splice(i, goods)
      },
      ...mapMutations({
        setShoppingCartCount: 'shoppingCartGoodsNumChange',
        setConfirmData: 'setConfirmData'
      })
    },
    components: {
      NoData,
      SelectStore,
      SelectSize,
      CheckGoods
    }
  }
</script>

<style scoped lang="stylus">
  img {
    pointer-events none
  }
  * {
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  .wrapper {
    background-color #fff
  }
  .commList {
    .storeWrapper {
      .store {
        border-top .26rem solid #f3f3f3
        .storeTitle {
          display flex
          align-items center
          padding 0 .4rem
          height .88rem
          border-bottom 1px solid #e7e7e7
          .left {
            font-size 0
            margin-right .26rem
            img {
              width .53rem
            }
            .noChecked {
              width .53rem
              height .53rem
              border 1px solid #cecece
              border-radius 50%
            }
          }
          .right {
            color #666
            font-size .34rem
            font-weight 400
          }
        }
        .storeContent {
          .goods {
            display flex
            padding-top .26rem
            position relative
            &:last-child .right {
              border none
            }
            .left {
              font-size 0
              padding 1.2rem .26rem 0 .4rem
              img {
                width .53rem
              }
              .noChecked {
                width .53rem
                height .53rem
                border 1px solid #cecece
                border-radius 50%
              }
            }
            .right {
              flex 1
              display flex
              flex-wrap wrap
              padding 0 .4rem .26rem 0
              border-bottom 1px solid #e7e7e7
              .logo {
                font-size 0
                width 2.4rem
                height 2.4rem
                border-radius .13rem
                overflow hidden
                margin-right .34rem
                position relative
                .mask {
                  position absolute
                  top 0
                  left 0
                  background-color rgba(0,0,0,.5)
                  width 100%
                  height 100%
                  color #fff
                  font-weight 400
                  font-size .32rem
                  line-height 2.4rem
                  text-align center
                  z-index 1
                }
                img {
                  width 100%
                }
              }
              .info {
                flex 1
                .name {
                  color #333
                  font-size .32rem
                  line-height .45rem
                  font-weight 400
                  overflow : hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .tool {
                  margin-top .13rem
                  display flex
                  justify-content space-between
                  .detail {
                    height .58rem
                    background url('./pull.png') no-repeat center right .13rem #f1f1f1
                    background-size .16rem auto
                    max-width 3.2rem
                    overflow hidden
                    padding 0 .42rem 0 .13rem
                    ul {
                      li {
                        display inline-block
                        line-height .58rem
                        color #999
                        font-size .32rem
                        font-weight 400
                      }
                    }
                  }
                  .countWrapper {
                    width 2.26rem
                    height .58rem
                    display flex
                    border 1px solid #d7d7d7
                    .minus, .add {
                      width .53rem
                      font-size 0
                      display flex
                      justify-content center
                      align-items center
                      img {
                        width .26rem
                      }
                    }
                    .count {
                      flex 1
                      line-height .58rem
                      text-align center
                      color #666
                      font-weight 400
                      font-size .24rem
                      border-left 1px solid #d7d7d7
                      border-right 1px solid #d7d7d7
                    }
                  }
                }
                .priceWrapper {
                  display flex
                  margin-top .21rem
                  line-height .53rem
                  .leftPrice {
                    .desc {
                      color #333
                      font-size .29rem
                      font-weight 400
                    }
                    .price {
                      color #f70057
                      font-size .37rem
                      font-weight 400
                    }
                  }
                  .rightPrice {
                    margin-left .21rem
                    font-size .26rem
                    font-weight 400
                    color #9a9a9a
                    text-decoration line-through
                  }
                }
                .toolbar {
                  margin-top .21rem
                  display flex
                  align-items center
                  justify-content space-between
                  position relative
                  height .58rem
                  .cut {
                    line-height .45rem
                    padding 0 .13rem
                    color #f70057
                    font-size .29rem
                    font-weight 400
                    border 1px solid #f70057
                  }
                  .btn {
                    position absolute
                    right 0
                    top 0
                    font-size 0
                    align-self flex-end
                    width 30%
                    text-align right
                    img {
                      width .58rem
                    }
                    .pop {
                      position absolute
                      top 0.58rem
                      right -.16rem
                      border-radius .08rem
                      padding-top .16rem
                      z-index 10
                      overflow hidden
                      .popMask {
                        position fixed
                        top 0
                        left 0
                        width 100%
                        height 100vh
                        z-index 10
                        background-color rgba(0, 0, 0, 0)
                      }
                      .sanjiao {
                        position absolute
                        top -.16rem
                        right .35rem
                        z-index 20
                        width 0
                        height 0
                        border-width .16rem
                        border-style solid
                        border-color transparent transparent rgba(0, 0, 0, .8) transparent
                      }
                      .popItem {
                        width 2.77rem
                        height 1rem
                        background-color rgba(0, 0, 0, .8)
                        display flex
                        align-items center
                        border-bottom 1px solid #999
                        position relative
                        z-index 20
                        &:last-child {
                          border none
                        }
                        img {
                          margin-left .26rem
                          width .34rem
                        }
                        span {
                          margin-left .18rem
                          font-size .34rem
                          font-weight 400
                          color #efefef
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .address {
          display flex
          font-size 0
          padding-left .79rem
          min-height .8rem
          border-top 1px solid #e7e7e7
          img {
            margin-top .26rem
            margin-right .13rem
            width .26rem
            align-self flex-start
          }
          span {
            margin-top .18rem
            color #666
            font-weight 400
            font-size .29rem
          }
        }
      }
    }
  }
  .failure {
    border-top .26rem solid #f3f3f3
    .title {
      height 1.2rem
      display flex
      align-items center
      justify-content space-between
      padding 0 .5rem 0 .4rem
      border-bottom 1px solid #e7e7e7
      .left {
        color #666
        font-weight 400
        font-size .32rem
      }
      .right {
        color #f8085c
        font-weight 400
        font-size .32rem
      }
    }
    .content {
      padding 0 .4rem 0 1.17rem
      .item {
        display flex
        height 2.9rem
        align-items center
        border-bottom 1px solid #d7d7d7
        position relative
        &:last-child {
          border none
        }
        .left {
          width 2.4rem
          height 2.4rem
          border-radius .13rem
          overflow hidden
          position relative
          img {
            width 100%
          }
          .mask {
            position absolute
            width 100%
            height 100%
            top 0
            left 0
            background-color rgba(0,0,0,.5)
            color #fff
            font-size .32rem
            font-weight 400
            text-align center
            line-height 2.4rem
            z-index 1
          }
        }
        .right {
          margin-left .32rem
          width calc(100% - 2.72rem)
          .name {
            color #23262F
            font-size .32rem
            line-height .42rem
            font-weight 400
            overflow : hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .size, .text {
            margin-top .26rem
            color #999
            font-size .32rem
            font-weight 400
          }
          .size {
            ul {
              display flex
              li {
                line-height 1
                margin-right .1rem
              }
            }
          }
        }
        .del {
          position absolute
          right 0
          bottom .26rem
          font-size 0
          img {
            width .64rem
          }
        }
      }
    }
  }
  .maskBox {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 1.7rem;
    align-items: center;
  }
  .maskBox .collection, .maskBox .delete {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 50%;
    font-size: .42rem;
    text-align: center;
  }
  .maskBox .collection {
    background-color: #f70057;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .maskBox .delete {
    line-height: 2.1rem;
    background-color: #ececec;
    color: #666;
  }
</style>
