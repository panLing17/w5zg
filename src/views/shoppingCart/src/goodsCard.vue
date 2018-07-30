<template lang="pug">
  transition( leave-active-class="animated rotateOutUpLeft")
    .goodsCardBox(v-if="list.length>0")
      .title
        <!---w-checkbox(v-model="isdefault")--->
        p {{storeName}}
      transition-group(tag="div", :name="animate")
        .goodsBox(v-for="(i,index) in list", :key="index")
          transition( leave-active-class="animated flipOutX", enter-active-class="animated flipInX", mode="out-in", :duration="{ enter: 600, leave: 400 }")
            .main(v-if="i.editClose", key="spec", @click="goGoodsDetail(i.gspu_id)")
              .checkbox(@click.stop="")
                w-checkbox(v-model="i.checked", @change="selectChange(i.checked,i.sc_id)")
              .img
                img(:src="i.logo | img-filter")
                p(v-if="i.goods_num > i.storage_num") 仅剩{{i.storage_num}}件
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
              //.mainRight
                img(src="../../../assets/img/edit@3x.png", @click.stop="edit(false,index)")
                p x{{i.goods_num}}
            .main(v-else, key="change")
              .checkbox
                w-checkbox(v-model="i.checked", @change="selectChange(i.checked,i.sc_id)")
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
            .left(@click="changeType(i,index)") <img src="../../../assets/img/switch@2x.png"/>切换至门店自提
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
        isdefault: false,
        content: 1,
        flag: true
      }
    },
    computed:{
      animate () {
        return this.animateName
      }
    },
    props:{
      list:{
        type: Array
      },
      storeName: String,
      goodsList: {
        type: Array
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
      changeType (data,index) {
         this.animateName = 'leftOut'
        // 回调参数，执行删除动画效果
        let fun =()=> {
          this.list.splice(index,1)
        }
        this.$emit('tab',data,fun)
      },
      edit (k,index) {
        this.list[index].editClose = k
      },
      selectChange (checked,id) {
        if (id) {
          let self = this
          self.$ajax({
            method: 'post',
            url:self.$apiApp +  'shoppingCart/selectShoppingCart',
            params: {
              scIdArray : id,
              checked: checked
            },
          }).then(function (response) {
            self.$emit('selectChange')
          })
        }
      },
      deleteGoods (id, index) {
        this.animateName = 'fadeOut'
        this.list.splice(index,1)
        let self = this
        self.$ajax({
          method: 'delete',
          url:self.$apiApp +  'shoppingCart/shoppingCart/delete',
          params: {
            scIdArray: id
          },
        }).then(function (response) {
          self.$emit('clearGoods')
          // let goodsNum = self.$store.state.shoppingCartGoodsNum
          // goodsNum.sendNum-=1
          // self.$store.commit('shoppingCartGoodsNumChange',goodsNum)
        })
      },
      // 商品数量变化
      countChange (cartId,skuId,num) {
        // 计算价格
        this.selectChange()
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
      }
    }
  }
</script>

<style scoped>
  .goodsCardBox{
    background-color: white;
    padding: 0 .2rem;
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
  }
  .main{
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
  /* 商品描述部分 */
  .info {
    flex-grow: 1;
    width: 0;
    padding-left: .3rem;
    padding-right: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .info .text {

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
    width: 1rem;
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
  /* 动画 */
  .leftOut-enter-active {
    transition: all .3s ease;
  }
  .leftOut-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .leftOut-enter, .leftOut-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translate(-100%,-1000%) scale(.1,.1);
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
