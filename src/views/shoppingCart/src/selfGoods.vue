<template lang="pug">
  transition( leave-active-class="animated rotateOutUpRight")
    .goodsCardBox(v-if="goodsList.length>0")
      transition-group(tag="div", name="leftOut")
        .goodsBox(v-for="(i,index) in goodsList", :key="index")
          transition( leave-active-class="animated flipOutX", enter-active-class="animated flipInX", mode="out-in", :duration="{ enter: 600, leave: 400 }")
            .main(v-if="i.editClose", key="spec")
              .checkbox
                w-checkbox(v-model="i.checked", @change="selectedChange")
              img(src="../../../../static/img/1.jpg")
              .info
                .text
                  .name {{i.gi_name}}
                  .spec
                    span(v-for="item in i.specVOList") {{item.gspec_value}}
                .price
                  span {{i.now_price | price-filter}}
              .mainRight
                img(src="../../../assets/img/edit@3x.png", @click="edit(false,index)")
                p x{{i.goods_num}}
            .main(v-else, key="change")
              .checkbox
                w-checkbox(v-model="i.checked", @change="selectedChange")
              img(src="../../../../static/img/1.jpg")
              .specChange
                .specData
                  p 黑色,L
                  img(src="../../../assets/img/next@2x.png")
                w-counter(v-model="i.goods_num", :min="1", width="4rem")
              .specOk(@click="edit(true,index)") 完成
          .bottom
            .left(@click="changeType(index,i)") <img src="../../../assets/img/switch@2x.png"/>快递配送
            .right
              span {{i.pro_Name}} {{i.city_name}}
              img
</template>

<script>
  export default {
    name: "goods-card",
    data () {
      return {
        watchFlag: true
      }
    },
    props: {
      goodsList: Array
    },
    computed:{
      allClick(){
        return this.$store.state.shoppingCartAllChecked
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
    data () {
      return {
        flag: true,
        isdefault: false
      }
    },
    methods: {
      changeType (index,data) {
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
  .main>img{
    width: 2rem;
    height: 2rem;
    border-radius: .2rem;
  }
  .info{
    flex-grow: 1;
    padding-left: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    margin-left: .3rem;
    color: #aaaaaa;
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
</style>
