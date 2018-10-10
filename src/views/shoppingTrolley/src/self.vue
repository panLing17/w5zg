<template lang="pug">
  .self
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
                li.goods(v-for="(goods, i) in item.shoppingCartVOList")
                  .left(@click="goodsCheckedChange(goods, index)")
                    img(src="./gou.png", v-show="goods.checked==='011'")
                    .noChecked(v-show="goods.checked==='012'")
                  .right
                    .logo
                      .mask(v-if="goods.goods_num>goods.storage_num") 库存不足
                      img(:src="goods.logo | img-filter")
                    .info
                      .name {{goods.gi_name}}
                      .tool
                        .detail(@click="specChange(goods, index, i)")
                          ul
                            li(v-for="detail in goods.specVOList") {{detail.gspec_value}};
                        .countWrapper
                          .minus(@click="minus(goods)")
                            img(src="./minus.png")
                          .count {{goods.goods_num}}
                          .add(@click="add(goods)")
                            img(src="./add.png")
                      .priceWrapper
                        .leftPrice
                          span.desc 实付价:
                          span.price {{goods.direct_supply_price | price-filter}}
                        .rightPrice 专柜价:{{goods.counter_price | price-filter}}
                      .toolbar
                        .cut(v-show="goods.difference_price>0") 比加入时降{{goods.difference_price}}元
                        .btn
                          img(src="./btn.png")
                          .pop
                            .sanjiao
                            .popItem(@click.stop="$emit('change-ways', {index, i})")
                              img(src="./refresh.png")
                              span '快递配送'
                            .popItem(v-show="goods.delivery_ways==='168'")
                              img(src="./address.png")
                              span 切换专柜
            .address(v-show="item.store_address")
              img(src="./address2.png")
              span {{item.store_address}}
      .failure(v-if="data.failure && data.failure.length")
        .title
          .left 失效商品共 {{data.failure.length}} 件
          .right 清空失效商品
        .content
          ul
            li(v-for="(item, i) in data.failure")
              ul.itemWrapper
                li.item(v-for="(goods, index) in item.shoppingCartVOList")
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
</template>

<script>
  // 无数据
  import NoData from './noData'
  // 自提门店选择弹框
  import SelectStore from 'views/goodsDetails/selectStore'
  import SelectSize from './selectSize'
  import {shoppingCart} from "./mixin"
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    name: "self",
    mixins: [shoppingCart],
    data() {
      return {
        data: {},
        specList: [], // 商品规格
        resetSpec: {}, // 更改规格时初始化的参数
        specCurrentIndex: {}, // 更改规格当前商品的下标
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
        if(Number(newVal)===count) {
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
            self.data.commList.forEach(item=>{
              if (item.checked === '011') {
                count++
              }
              item.maskShow = false
            })
            if (count===self.data.commList.length) {
              self.$emit('all-change', true)
            } else {
              self.$emit('all-change', false)
            }
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
      specChangeRight(data) {
        let temp = this.data.commList[this.specCurrentIndex.index].shoppingCartVOList[this.specCurrentIndex.i]
        temp.gsku_id = data.skuId
        temp.specVOList = []
        data.spec.forEach(item=>{
          temp.specVOList.push({
            gspec_name: item.name,
            gspec_value: item.value
          })
        })
        this.data.commList[this.specCurrentIndex.index].shoppingCartVOList.splice(this.specCurrentIndex.i, temp)
      },
      ...mapMutations({
        setShoppingCartCount: 'shoppingCartGoodsNumChange'
      })
    },
    components: {
      NoData,
      SelectStore,
      SelectSize
    }
  }
</script>

<style scoped lang="stylus">
  img {
    pointer-events none
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
          }
          span {
            margin-top .26rem
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
</style>
