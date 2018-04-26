<template lang="pug">
  transition( leave-active-class="animated rotateOutUpRight")
    .goodsCardBox(v-if="goodsList.length>0")
      transition-group(tag="div", :name="animate")
        .goodsBox(v-for="(i,index) in goodsList", :key="index")
          transition( leave-active-class="animated flipOutX", enter-active-class="animated flipInX", mode="out-in", :duration="{ enter: 600, leave: 400 }")
            .main(v-if="i.editClose", key="spec", @click="goGoodsDetail(i.gspu_id)")
              .checkbox(@click.stop="")
                w-checkbox(v-model="i.checked", @change="selectedChange")
              .img
                img(:src="i.logo | img-filter")
                p(v-if="i.goods_num > i.storage_num") 仅剩{{i.storage_num}}件
              .info
                .text
                  .name {{i.gi_name}}
                  .spec
                    span(v-for="item in i.specVOList") {{item.gspec_value}}
                .price
                  span {{i.now_price | price-filter}}
              .mainRight
                img(src="../../../assets/img/edit@3x.png", @click.stop="edit(false,index)")
                p x{{i.goods_num}}
            .main(v-else, key="change")
              .checkbox
                w-checkbox(v-model="i.checked", @change="selectedChange")
              .img
                img(:src="i.logo | img-filter")
              .specChange
                .specData
                  p
                    span(v-for="(item,specIndex) in i.specVOList") {{item.gspec_value}}{{specIndex < i.specVOList.length-1 ? ',' : ''}}
                  //img(src="../../../assets/img/next@2x.png")
                w-counter(v-model="i.goods_num", @change="countChange(i.sc_id,i.gsku_id,i.goods_num)", :min="1", :max="i.storage_num", width="4rem")
              .specOk(@click="edit(true,index)") 完成
          .bottom
            .left(@click="changeType(index,i)") <img src="../../../assets/img/switch@2x.png"/>切换至快递配送
            .right
              span {{i.pro_Name}} {{i.city_name}}
              img(src="../../../assets/img/delete@3x.png", @click="deleteGoods(i.sc_id, index)")
</template>

<script>
  export default {
    name: "goods-card",
    data () {
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
    computed:{
      allClick(){
        return this.$store.state.shoppingCartAllChecked
      },
      animate () {
        return this.animateName
      }
    },
    watch: {
      allClick() {
        this.goodsList.forEach((now) => {
          now.checked = this.allClick
        })
        this.computedPrice()
      }
    },
    methods: {
      // 前往商品详情
      goGoodsDetail (id) {
        this.$router.push({
          path: '/goodsDetailed',
          query: {
            id: id
          }
        })
      },
      changeType (index,data) {
        this.animateName = 'leftOut'
        let fun = ()=>{
          this.goodsList.splice(index,1)
        }
        this.$emit('tab',data,fun)

      },
      edit (k,index) {
        this.goodsList[index].editClose = k
      },
      // 勾选变化
      selectedChange () {
        this.computedPrice()
      },
      // 计算已选总价, 并将选中数据加入vuex
      computedPrice () {
        let allPrice = 0
        let checked = []
        this.goodsList.forEach((now)=>{
          if (now.checked) {
            allPrice = allPrice + now.goods_num*now.now_price
            checked.push(now)
          }
        })
        this.$store.commit('computedPriceChange', allPrice)
        this.$store.commit('shoppingCartSelectedChange', checked)
        // 判断已选数据与总数据长度
        if (checked.length === this.goodsList.length) {
          this.$store.commit('allCheckedChange', true)
        } else {
          // this.$store.commit('allCheckedChange', false)
        }
      },
      // 商品数量变化
      countChange (cartId,skuId,num) {
        let self = this
        self.$ajax({
          method: 'post',
          url:self.$apiApp +  'shoppingCart/shoppingCart',
          params: {
            scId: cartId,
            gskuId: skuId,
            num: num
          },
        }).then(function (response) {

        })
      },
      deleteGoods (id, index) {
        this.animateName = 'fadeOut'
        this.goodsList.splice(index,1)
        let self = this
        self.$ajax({
          method: 'delete',
          url:self.$apiApp +  'shoppingCart/shoppingCart/delete',
          params: {
            scIdArray: id
          },
        }).then(function (response) {
          let goodsNum = self.$store.state.shoppingCartGoodsNum
          goodsNum.carryNum-=1
          self.$store.commit('shoppingCartGoodsNumChange',goodsNum)
        })
      }
    }
  }
</script>

<style scoped>
  .goodsCardBox{

  }
  .title{
    font-weight: 600;
    height: .8rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  .title p{
    margin-left: 5px;
  }
  .goodsBox {
    background-color: white;
    margin-top: .1rem;
    padding: 0 .2rem;
  }
  .main{
    height: 2.2rem;
    display: flex;
    padding-top: .2rem;
  }
  .main .checkbox {
    padding-right: .2rem;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .main>.img{
    width: 2rem;
    height: 2rem;
    border-radius: .2rem;
    position: relative;
  }
  .img img{
    width: 100%;
    height: 100%;
  }
  .img p{
    padding-left: 2px;
    font-size: .2rem;
    position: absolute;
    bottom: 0;
    left: 0;
    height: .5rem;
    line-height: .5rem;
    width: 100%;
    background-color: rgba(0,0,0,0.5);
    color: white;
  }
  /*  */
  .info{
    flex-grow: 1;
    width: 0;
    padding-left: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .info .text .name{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .info .text .spec {
    margin-top: .1rem;
    color: #999;
  }
  .price{
    display: flex;
    justify-content: space-between;
  }
  .mainRight {
    width: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .mainRight>img{
    width: .5rem;
  }
  .mainRight>p{
    font-size: .35rem;
  }
  .bottom{
    margin-top: .3rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: .8rem;
    border-top: solid 1px rgb(250,250,250);
  }
  .bottom .right{
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    margin-left: .3rem;
    color: #aaaaaa;
  }
  .bottom .right img{
    height: .4rem;
    margin-right: .2rem;
  }
  .bottom .left {
    display: flex;
    align-items: center;
  }
  .bottom .left img{
    height: .4rem;
    margin-right: .1rem;
  }
  /* 修改规格 */
  .specChange{
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
  .specData p{
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
    background-color: rgb(255,128,171) ;
    color: white;
    font-size: .4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* */
  /* 动画 */
  .leftOut-enter-active {
    transition: all .3s ease;
  }
  .leftOut-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .leftOut-enter, .leftOut-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translate(100%,-1000%) scale(.1,.1);
    opacity: 0;
  }
  .fadeOut-enter-active {
    transition: all .3s ease;
  }
  .fadeOut-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fadeOut-enter, .fadeOut-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }
</style>
