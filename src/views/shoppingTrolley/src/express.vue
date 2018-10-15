<template lang="pug">
  .express
    no-data(v-show="isEmpty")
    .listWrapper(v-show="!isEmpty")
      ul.goodsWrapper
        li.goods(v-for="(goods, i) in data.commList", @touchstart="touchstart($event)", @touchmove="touchmove($event)", @touchend="touchend($event, i)", @contextmenu.prevent="")
          .left(@click.stop="goodsChange(goods)")
            img(src="./gou.png", v-show="goods.checked==='011'")
            .noChecked(v-show="goods.checked==='012'")
          .right
            .logo(@click="$router.push({path: '/goodsDetailed',query:{id: goods.gspu_id}})")
              .mask(v-if="goods.goods_num>goods.storage_num") 库存不足
              img(:src="goods.logo | img-filter")
            .info
              .name(@click="$router.push({path: '/goodsDetailed',query:{id: goods.gspu_id}})") {{goods.gi_name}}
              .tool
                .detail(@click.stop="specChange(goods, i)")
                  ul
                    li(v-for="detail in goods.specVOList") {{detail.gspec_value}};
                .countWrapper
                  .minus(@click.stop="minus(goods)")
                    img(src="./minus.png")
                  .count {{goods.goods_num}}
                  .add(@click.stop="add(goods)")
                    img(src="./add.png")
              .priceWrapper
                .leftPrice
                  span.desc 实付价:
                  span.price {{goods.direct_supply_price | price-filter}}
                .rightPrice 专柜价:{{goods.counter_price | price-filter}}
              .toolbar(@click.stop="")
                .cut(v-show="goods.difference_price>0") 比加入时降{{goods.difference_price}}元
                .btn
                  img(src="./btn.png")
                  .pop
                    .sanjiao
                    .popItem(v-show="goods.carry_type===1", @click.stop="changeWays(goods, i)")
                      img(src="./refresh.png")
                      span 专柜自提
          .maskBox(v-show="goods.maskShow", @click.stop="closeMask(i)")
            .collection(@click.stop="goCollection(goods, i)") 移入<br/>收藏夹
            .delete(@click.stop="deleteGoods(goods, i)") 删除
      .failure(v-if="data.failure && data.failure.length")
        .title
          .left 失效商品共 {{data.failure.length}} 件
          .right(@click="delAllFailure") 清空失效商品
        .content
          ul.itemWrapper
            li.item(v-for="(goods, index) in data.failure")
              .left
                .mask 失效
                img(:src="goods.logo | img-filter")
              .right
                .name {{goods.gi_name}}
                .size
                  ul
                    li(v-for="detail in goods.specVOList") {{detail.gspec_value}};
                .text 该商品已失效
              .del(@click="delFailureGoods(goods, index)")
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
  // 列表
  import Card from './card'
  // 自提门店选择弹框
  import SelectStore from 'views/goodsDetails/selectStore'
  import SelectSize from './selectSize'
  import {mapMutations, mapGetters} from 'vuex'
  import {shoppingCart} from "./mixin"
  import CheckGoods from './checkGoods'
  export default {
    name: "express",
    mixins: [shoppingCart],
    data() {
      return {
        data: {}, // 快递配送购物车合集
        specList: [], // 商品规格
        resetSpec: {}, // 更改规格时初始化的参数
        specCurrentIndex: -1, // 更改规格当前商品的下标
        checkGoodsData: [], // 结算不合格商品
        btnType: 0
      }
    },
    computed: {
      ...mapGetters(['shoppingCartGoodsNum'])
    },
    watch: {
      totalCount(newVal) {
        if (Number(newVal)===this.data.commList.length && this.data.commList.length!==0) {
          this.$emit('all-change', true)
        } else {
          this.$emit('all-change', false)
        }
      }
    },
    created() {
      this.getExpressList()
      this.queryCartMoneyAjax('167')
    },
    activated() {
      this.getExpressList()
      this.queryCartMoneyAjax('167')
    },
    methods: {
      touchend(e, i) {
        clearTimeout(this.timeOutEvent);
        if(this.timeOutEvent!=0 && this.longClick==1){
          e.preventDefault()
          let t = this.data.commList[i]
          t.maskShow = true
          this.data.commList.splice(i, 1, t)
        }
        return false;
      },
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
            // 判断是否全选,和选中数量
            let count = 0
            self.data.commList.forEach(item=>{
              if (item.checked === '011') {
                count++
              }
              item.maskShow = false
            })
            if (count===self.data.commList.length && count!==0) {
              self.$emit('all-change', true)
            } else {
              self.$emit('all-change', false)
            }
            if (self.data.commList.length===0) {
              self.$emit('show-change', false)
            } else {
              self.$emit('show-change', true)
            }
          }
        })
      },
      // 全选
      selectAll(flag) {
        let arr = []
        this.data.commList.forEach(item=> {
          if (flag && item.checked==='012') {
            arr.push(item.sc_id)
          }
          if (!flag && item.checked==='011') {
            arr.push(item.sc_id)
          }
          item.checked=flag?'011':'012'
        })
        let params = {
          scIdArray: arr.join(','),
          checked: flag
        }
        this.selectAjax(params, ()=>{
          this.queryCartMoneyAjax('167')
        })
      },
      // 商品选中
      goodsChange(goods) {
        let params = {
          scIdArray: goods.sc_id,
          checked: goods.checked==='011'?false:true
        }
        goods.checked = goods.checked==='011'?'012':'011'
        this.selectAjax(params, ()=>{
          this.queryCartMoneyAjax('167')
        })
      },
      // 关闭删除蒙版
      closeMask(i) {
        let t = this.data.commList[i]
        t.maskShow = false
        this.data.commList.splice(i, 1, t)
      },
      // 删除商品
      deleteGoods(goods, index) {
        this.$verify({
          content: '确认删除所选商品吗？',
          leftText: '取消',
          rightText: '删除',
          rightFn: () => {
            let params = {
              scIdArray: goods.sc_id
            }
            this.data.commList.splice(index, 1)
            this.setShoppingCartCount({
              sendNum: this.shoppingCartGoodsNum.sendNum-1
            })
            this.deleteAjax(params, ()=>{
              this.queryCartMoneyAjax('167')
              this.$notify({
                content: '删除成功',
                bottom: 3.2
              })
            })
          }
        })
      },
      // 删除失效商品
      delFailureGoods(goods, index) {
        let params = {
          scIdArray: goods.sc_id
        }
        this.data.failure.splice(index, 1)
        this.deleteAjax(params, ()=>{
          this.$notify({
            content: '删除成功',
            bottom: 3.2
          })
        })
        this.setShoppingCartCount({
          sendNum: this.shoppingCartGoodsNum.sendNum-1
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
            this.data.failure.forEach(item => {
              arr.push(item.sc_id)
            })
            params = {
              scIdArray: arr.join(',')
            }
            this.setShoppingCartCount({
              sendNum: this.shoppingCartGoodsNum.sendNum-this.data.failure.length
            })
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
      // 移入收藏夹
      goCollection(goods, index) {
        this.setShoppingCartCount({
          sendNum: this.shoppingCartGoodsNum.sendNum-1
        })
        let params = {
          gspuId: goods.gspu_id
        }
        this.collectionAjax(params)
        let params2  ={
          scIdArray: goods.sc_id
        }
        this.deleteAjax(params2, () => {
          this.queryCartMoneyAjax('167')
        })
        this.data.commList.splice(index, 1)
      },
      // 批量删除
      deleteAll() {
        let arr = []
        let count = 0
        let indexArr = []
        this.data.commList.forEach((item, index) => {
          if (item.checked==='011') {
            arr.push(item.sc_id)
            count++
            indexArr.push(index)
          }
        })
        indexArr.forEach(item => {
          this.data.commList.splice(item, 1)
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
      // 规格切换
      specChange(goods, i) {
        this.specCurrentIndex = i
        this.specChangeCommon(goods)
      },
      // 规格切换完成
      specChangeRight(data) {
        let temp = this.data.commList[this.specCurrentIndex]
        temp.gsku_id = data.skuId
        temp.specVOList = []
        data.spec.forEach(item=>{
          temp.specVOList.push({
            gspec_name: item.name,
            gspec_value: item.value
          })
        })
        this.data.commList.splice(this.specCurrentIndex, temp)
      },
      // 切换配送方式
      changeWays(goods, index) {
        this.specCurrentIndex = index
        this.$verify({
          content: '确定要切换为“专柜自提”？',
          leftText: '取消',
          rightText: '确定',
          rightFn: () => {
            let params = {
              gspu_id: goods.gspu_id,
              gsku_id: goods.gsku_id
            }
            this.storeListAjax(params, (data)=>{
              this.storeList = data
              this.$refs.selectStore.show()
            })
          }
        })
      },
      // 门店选择后切换为自提
      selectStore(data) {
        let params = {
          scId: this.data.commList[this.specCurrentIndex].sc_id,
          deliveryWays: '168',
          bsId: data.bs_id
        }
        this.updateAjax(params, ()=>{
          this.queryCartMoneyAjax('167')
        })
        this.setShoppingCartCount({
          sendNum: this.shoppingCartGoodsNum.sendNum-1,
          carryNum: this.shoppingCartGoodsNum.carryNum+1
        })
        this.data.commList.splice(this.specCurrentIndex, 1)
      },
      // 结算
      checkCart() {
        let arr = []
        let selectedCount = 0
        this.data.commList.forEach(item=>{
          if (item.checked==='011') {
            arr.push(item.sc_id)
            selectedCount++
          }
        })
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
          shippingMethods: 0
        }
        let arr = []
        this.data.commList.forEach(item=>{
          if (item.checked==='011') {
            arr.push(item)
          }
        })
        if(flag) {
          temp.list = arr
        } else {
          let copyArr = arr.slice()
          this.checkGoodsData.forEach(item=>{
            if (item.status_flag==='NO_STORAGE_NUM' || item.status_flag==='GOOD_STATUS_ERROR') {
              arr.forEach((goods, index)=>{
                if (item.sc_id===goods.sc_id) {
                  copyArr.splice(index, 1)
                }
              })
            }
          })
          temp.list = copyArr
        }
        this.setConfirmData(temp)
        this.$router.push('/orderConfirm')
      },
      ...mapMutations({
        setShoppingCartCount: 'shoppingCartGoodsNumChange',
        setConfirmData: 'setConfirmData'
      })
    },
    components: {
      NoData,
      Card,
      SelectStore,
      SelectSize,
      CheckGoods
    }
  }
</script>

<style scoped lang="stylus">
  .listWrapper {
    border-top .26rem solid #f3f3f3
  }
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
          &:hover .btn .pop {
            display block
          }
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
            img {
              width .58rem
            }
            .pop {
              display none
              position absolute
              top 0.58rem
              right -.16rem
              border-radius .08rem
              padding-top .16rem
              z-index 10
              overflow hidden
              .mask {
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
          right .4rem
          bottom .26rem
          font-size 0
          img {
            width .64rem
          }
        }
      }
    }
  }
</style>
