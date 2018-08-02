<template lang="pug">
  transition( leave-active-class="animated rotateOutUpRight")
    .goodsCardBox(v-if="goodsList.length>0")
      .store(v-for="(storeItem,storeIndex) in goodsList")
        .title
          w-checkbox(v-model="storeItem.checked", @change="selectedChange(storeItem.checked,storeItem.store_name,true)")
          span {{storeItem.store_name}}
        transition-group(tag="div", :name="animate")
          .goodsBox(v-for="(i,index) in storeItem.shoppingCartVOList", :key="index")
            transition( leave-active-class="animated flipOutX", enter-active-class="animated flipInX", mode="out-in", :duration="{ enter: 600, leave: 400 }")
              .main(v-if="i.editClose", key="spec", @click="goGoodsDetail(i.gspu_id)")
                .checkbox(@click.stop="")
                  w-checkbox(v-model="i.checked", @change="selectedChange(i.checked,storeItem.store_name,false,i.sc_id)")
                .img
                  img(:src="i.logo | img-filter")
                  //p(v-if="i.goods_num > i.storage_num") 仅剩{{i.storage_num}}件
                .info(@click.stop="")
                  .text
                    .name {{i.gi_name}}
                    .spec
                      span(v-for="(item,index) in i.specVOList") {{item.gspec_value}} {{index < i.specVOList.length-1? ';':''}}
                      img(src="../../../assets/img/ic_page_xljt@2x.png")
                    w-counter.counter(v-model="i.goods_num", @click.stop="", @change="countChange(i.sc_id,i.gsku_id,i.goods_num)", :min="1", :max="i.storage_num", width="2rem", height="20px")
                  .price
                    span 实付价：{{i.direct_supply_price | price-filter}}
                    span(style="color:#999;text-decoration:line-through") 专柜价：{{i.counter_price | price-filter}}
                .mainRight
                  //img(src="../../../assets/img/edit@3x.png", @click.stop="edit(false,index)")
              .main(v-else, key="change")
                .checkbox
                  w-checkbox(v-model="i.checked", @click.stop="", @change="selectedChange(i.checked,storeItem.store_name,i.sc_id)")
                .img
                  img(:src="i.logo | img-filter")
                .specChange
                  .specData
                    p
                      span(v-for="(item,specIndex) in i.specVOList") {{item.gspec_value}}{{specIndex < i.specVOList.length-1 ? ',' : ''}}
                    //img(src="../../../assets/img/next@2x.png")
                  w-counter(v-model="i.goods_num", @change="countChange(i.sc_id,i.gsku_id,i.goods_num)", :min="1", :max="i.storage_num", width="4rem")
                .specOk(@click="edit(true,index)") 完成
            .bottomOperation
              .more
                p(:class="{opc0:i.difference_price<=0}") 比加入时降{{i.difference_price | price-filter}}
                img(src="../../../assets/img/diandian.png")
                .moreOperation
                  .sanjiao
                  ul.buttons
                    li(@click="changeType(storeIndex,index,i)", v-if="i.storage_num>0")
                      img(src="../../../assets/img/shoppingCartChange.png")
                      p 快递配送
                    li(@click="deleteGoods(i.sc_id, storeIndex, index)")
                      img(src="../../../assets/img/shoppingCartDelete.png")
                      p 删除
        .bottom
          .left <img src="../../../assets/img/location.png"/>{{storeItem.store_address}}
          .right
</template>

<script>
  export default {
    name: "goods-card",
    data() {
      return {
        animateName: 'leftOut',
        watchFlag: true,
        flag: true,
        isdefault: false
      }
    },
    props: {
      goodsList: Array
    },
    computed: {
      allClick() {
        return this.$store.state.shoppingCartAllChecked
      },
      animate() {
        return this.animateName
      }
    },
    watch: {
      allClick(val) {
        let scId = []
        this.goodsList.forEach((now) => {
          now.checked = this.allClick
          now.shoppingCartVOList.forEach((sonNow)=>{
            sonNow.checked = this.allClick
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
        this.computedPrice()
      }
    },
    methods: {
      // 前往商品详情
      goGoodsDetail(id) {
        this.$router.push({
          path: '/goodsDetailed',
          query: {
            id: id
          }
        })
      },
      changeType(storeIndex, index, data) {
        this.animateName = 'leftOut'
        let fun = () => {
          this.goodsList[storeIndex].shoppingCartVOList.splice(index, 1)
          if (this.goodsList[storeIndex].shoppingCartVOList.length<1) {
            this.goodsList.splice(storeIndex,1)
          }
        }
        this.$emit('tab', data, fun)

      },
      edit(k, index) {
        this.goodsList[index].editClose = k
      },
      // 勾选变化
      selectedChange(checked, storeName, storeFlag, scId) {
        let scIds = []
        // 为true则为按店铺全选
        if (storeFlag) {
          this.goodsList.forEach((now) => {
            if (now.store_name === storeName) {
              now.shoppingCartVOList.forEach((sonNow) => {
                sonNow.checked = checked
                scIds.push(sonNow.sc_id)
              })
            }
          })
        } else {
          scIds.push(scId)
          let notCheckedNum = 0
          this.goodsList.forEach((now) => {

            if (now.store_name === storeName) {
              now.shoppingCartVOList.forEach((sonNow) => {
                if (!sonNow.checked) {
                  notCheckedNum += 1
                }
              })
            }
          })
          this.goodsList.forEach((now) => {
            if (now.store_name === storeName) {
              now.checked = !notCheckedNum > 0
            }
          })
        }
        scIds = scIds.join(',')
        let self = this
        self.$ajax({
          method: 'post',
          url:self.$apiApp +  'shoppingCart/selectShoppingCart',
          params: {
            scIdArray : scIds,
            checked: checked
          },
        }).then(function (response) {
          self.computedPrice()
        })

      },
      // 计算已选总价, 并将选中数据加入vuex
      computedPrice() {
        // 直供总价
        let allPrice = 0
        // 专柜总价
        let counterPrice = 0
        let checked = []
        this.goodsList.forEach((storeNow) => {
          storeNow.shoppingCartVOList.forEach((now)=>{
            if (now.checked) {
              counterPrice = counterPrice + now.goods_num * now.counter_price
              allPrice = allPrice + now.goods_num * now.direct_supply_price
              checked.push(now)
            }
          })

        })
        let storeList = []
        checked.forEach((now)=>{

          now.editClose = true
          if (storeList.indexOf(now.store_name) === -1) {
            storeList.push(now.store_name)
          }
        })
        let storeListOfJson = []
        storeList.forEach((now)=>{
          storeListOfJson.push({
            checked: false,
            storeName: now,
            shoppingCartVOList: []
          })
        })
        storeListOfJson.forEach((now)=>{
          checked.forEach((goodsNow)=>{
            if (goodsNow.store_name === now.storeName) {
              now.shoppingCartVOList.push(goodsNow)
            }
          })
        })
        let priceData = {
          allPrice: allPrice,
          counterPrice: counterPrice
        }
        this.$store.commit('computedPriceChange', priceData)
        this.$store.commit('shoppingCartSelectedChange', storeListOfJson)
        let allGoodsLen = 0
        this.goodsList.forEach((storeNow) => {
          storeNow.shoppingCartVOList.forEach((now)=>{
            allGoodsLen += 1
          })
        })
        // 判断已选数据与总数据长度
        if (checked.length === allGoodsLen) {

          this.$store.commit('allCheckedChange', true)
        } else {
          // this.$store.commit('allCheckedChange', false)
        }
      },
      // 商品数量变化
      countChange(cartId, skuId, num) {
        // 触发选中后的事件，从而可以计算价格
        this.selectedChange()
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiApp + 'shoppingCart/shoppingCart',
          params: {
            scId: cartId,
            gskuId: skuId,
            num: num
          },
        }).then(function (response) {

        })
      },
      deleteGoods(id, storeIndex, index) {
        this.animateName = 'fadeOut'
        this.goodsList[storeIndex].shoppingCartVOList.splice(index, 1)
        if (this.goodsList[storeIndex].shoppingCartVOList.length<1) {
          this.goodsList.splice(storeIndex,1)
        }
        let self = this
        self.$ajax({
          method: 'delete',
          url: self.$apiApp + 'shoppingCart/shoppingCart/delete',
          params: {
            scIdArray: id
          },
        }).then(function (response) {
          self.$emit('clear')
          // let goodsNum = self.$store.state.shoppingCartGoodsNum
          // goodsNum.carryNum-=1
          // self.$store.commit('shoppingCartGoodsNumChange',goodsNum)
        })
      }
    }
  }
</script>

<style scoped>
  .goodsCardBox {

  }

  .store {
    background-color: white;
    margin-top: .2rem;
  }

  .title {
    padding-left: .2rem;
    font-weight: 600;
    height: .8rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .title span {
    margin-left: 5px;
  }

  .goodsBox {
    background-color: white;
    margin-top: .1rem;
    padding: 0 .2rem;
  }

  .main {
    /*height: 2.2rem;*/
    display: flex;
    padding-top: .2rem;
    align-items: center;
  }

  .main .checkbox {
    padding-right: .2rem;
    /*height: 100%;*/
    display: flex;
    align-items: center;
  }

  .main > .img {
    width: 2rem;
    height: 2rem;
    border-radius: .2rem;
    position: relative;
  }

  .img img {
    width: 100%;
    height: 100%;
  }

  .img p {
    padding-left: 2px;
    font-size: .2rem;
    position: absolute;
    bottom: 0;
    left: 0;
    height: .5rem;
    line-height: .5rem;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
  }

  /*  */
  .info {
    flex-grow: 1;
    width: 0;
    padding-left: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .info .text .name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .info .text .spec {
    display: flex;
    position: relative;
    float: left;
    max-width: 3rem;
    overflow: hidden;

    align-items: center;
    padding: .05rem .2rem;
    margin-top: .2rem;
    color: #999;
    background-color: #eee;
  }

  .info .text .spec span {
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info .text .spec img {
    width: .2rem;
    margin-left: .15rem;
  }

  .info .text .counter {
    float: right;
    margin-top: .1rem;
  }

  .price {
    display: flex;
    justify-content: space-between;
  }

  .mainRight {
    width: .3rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .mainRight > img {
    width: .5rem;
  }

  .mainRight > p {
    font-size: .35rem;
  }

  .bottom {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: .8rem;
    border-top: solid 1px rgb(250, 250, 250);
  }

  .bottom .right {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    margin-left: .3rem;
    color: #aaaaaa;
  }

  .bottom .right img {
    height: .4rem;
    margin-right: .2rem;
  }

  .bottom .left {
    color: #888;
    padding-left: .8rem;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
  }

  .bottom .left img {
    height: .4rem;
    margin-right: .1rem;
  }

  /* 修改规格 */
  .specChange {
    flex-grow: 1;
    padding-left: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .specData {
    width: 4rem;
    height: 30px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    border: solid 1px #aaa;
    justify-content: space-between;
  }

  .specData p {
    line-height: 30px;
    padding: 0 .2rem;
  }

  .specData img {
    height: .4rem;
    margin-right: .2rem;
  }

  .specOk {
    width: 1.8rem;
    height: 100%;
    background-color: rgb(255, 128, 171);
    color: white;
    font-size: .4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* 更多操作 */
  .bottomOperation{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 1rem;
    border-bottom: solid 1px #eee;
  }
  .bottomOperation> .more{
    height: 100%;
    width: 6.5rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bottomOperation> .more:hover .moreOperation {
    display: block;
  }
  .bottomOperation> .more> p{
    color: #F70057;
    border: solid 1px #F70057;
    padding: 1px .2rem;
  }
  .bottomOperation> .more> img{
    height: .4rem;
    margin-right: .4rem;
  }
  .bottomOperation> .more> .moreOperation {
    display: none;
    position: absolute;
    right: 0;
    top: .7rem;
    z-index: 99;
  }
  .moreOperation>.buttons {
    width: 2.5rem;
    margin-top: .4rem;
    border-radius: 3px;
    background-color: rgba(0,0,0,0.8);
  }
  .moreOperation>.buttons li{
    height: 1rem;
    border-bottom: solid 1px #dfdfdf;
    display: flex;
    align-items: center;
    padding: 0 .2rem;
  }
  .moreOperation>.buttons li img{
    height: .4rem;
  }
  .moreOperation>.buttons li p{
    color: #e8e8e8;
    margin-left: .1rem;
  }
  .sanjiao{
    position: absolute;
    right: .2rem;
    top: .1rem;
    height: 0px;
    width: 0px;
    border-top: 0 solid transparent;
    border-right: .3rem solid transparent;
    border-left: .3rem solid transparent;
    border-bottom: .3rem solid rgba(0,0,0,0.8);
  }
  /* 透明 */
  .opc0 {
    opacity: 0;
  }
  /* 更多操作结束 */
  /* */
  /* 动画 */
  .leftOut-enter-active {
    transition: all .3s ease;
  }

  .leftOut-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .leftOut-enter, .leftOut-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translate(100%, -1000%) scale(.1, .1);
    opacity: 0;
  }

  .fadeOut-enter-active {
    transition: all .3s ease;
  }

  .fadeOut-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .fadeOut-enter, .fadeOut-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
