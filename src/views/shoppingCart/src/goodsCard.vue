<template lang="pug">
  transition( leave-active-class="animated rotateOutUpLeft")
    .goodsCardBox(v-if="list.length>0")
      .title
        w-checkbox(v-model="checked", @change="storeAllClick")
        p {{storeName}}
      transition-group(tag="div", :name="animate")
        .goodsBox(v-for="(i,index) in list", ref="goodsBox", :key="index", @touchstart="touchstart($event)", @touchmove="touchmove($event)", @touchend="touchend($event, i, index)", @contextmenu.prevent="")
          transition( leave-active-class="animated flipOutX", enter-active-class="animated flipInX", mode="out-in", :duration="{ enter: 600, leave: 400 }")
            .main(v-if="i.editClose", key="spec", @click="goGoodsDetail(i.gspu_id)")
              .checkbox(@click.stop="")
                w-checkbox(v-model="i.checked", @change="selectChange(i.checked,i.sc_id)")
              .img
                img(:src="i.logo | img-filter")
                p(v-if="i.storage_num === 0")
                  span 库存
                  span 不足
              .info(@click.stop="")
                .text
                  .name(@click="goGoodsDetail(i.gspu_id)") {{i.gi_name}}
                  .spec(@click="openSpecChange(i.gspu_id, i)")
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
          .bottomOperation
            .more
              p(:class="{opc0:i.difference_price<=0}")  比加入时降{{i.difference_price | price-filter}}
              .moreRight
                img(src="../../../assets/img/shoppingCartMore.png")
                .moreOperation
                  .sanjiao
                  ul.buttons
                    li(@click="changeType(i,index)", v-if="i.storage_num>0 && i.carry_type === 1")
                      img(src="../../../assets/img/shoppingCartChange.png")
                      p 专柜自提
                    <!--li(@click="deleteGoods(i.sc_id, index)")-->
                      <!--img(src="../../../assets/img/shoppingCartDelete.png")-->
                      <!--p 删除-->
          .maskBox(v-show="i.maskShow", @click="i.maskShow=false")
            .collection(@click="goCollection(i, index)") 移入<br/>收藏夹
            .delete(@click="deleteGoods(i, index)") 删除
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
      checked:{
        type: Boolean
      },
      storeName: String,
      goodsList: {
        type: Array
      }
    },
    methods: {
      // 长按操作
      touchstart(e) {
        this.longClick=0;
        this.timeOutEvent = setTimeout(()=>{
        //此处为长按事件-----在此显示遮罩层及删除按钮
          this.longClick=1;//假如长按，则设置为1
          },500);
        let touch = e.touches[0];
        this.touchY = touch.clientY;
      },
      touchmove(e) {
        clearTimeout(this.timeOutEvent);
        this.timeOutEvent = 0;
        let touch = e.touches[0]
        if(Math.abs(touch.clientY - this.touchY) < 10){
          e.preventDefault();
        }
      },
      touchend(e, item) {
        clearTimeout(this.timeOutEvent);
        if(this.timeOutEvent!=0 && this.longClick==1){
          e.preventDefault()
          item.maskShow = true
        }
        return false;
      },
      // 打开修改规格
      openSpecChange (id,spec) {
        this.$parent.openSpecChange(id, spec)
      },
      // 按门店选中与反选
      storeAllClick (flag) {
        let array = []

        this.list.forEach((now)=>{
          now.checked = flag
          array.push(now.sc_id)
        })
        console.log(array)
        let self = this
        self.$ajax({
          method: 'post',
          url:self.$apiApp +  'shoppingCart/selectShoppingCart',
          params: {
            scIdArray : array.join(','),
            checked: flag
          },
        }).then(function (response) {
          self.$emit('selectChange')
        })
      },
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
        this.$store.commit('getSkuId',data.gsku_id)
        //alert(data.gsku_id)
        this.$emit('tab',data,fun)
      },
      edit (k,index) {
        this.list[index].editClose = k
      },
      selectChange (checked,id) {
        // 判断是否全部选中
        let checkedNum = 0
        this.list.forEach((now)=>{
          if (now.checked) {
            checkedNum += 1
          }
        })
        if (checkedNum === this.list.length) {
          this.checked = true
        } else {
          this.checked = false
        }
        // end
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
      // 移入收藏夹
      goCollection(item, index) {
        item.maskShow = false
        let self = this
        self.$ajax({
          method: 'post',
          url:self.$apiGoods +  'gcFavoritesInfo/saveGcFavorite',
          params: {
            gspuId: item.gspu_id
          },
        }).then(function (response) {
          if (response) {
            self.list.splice(index,1)
            self.$notify({
              content: '移入收藏夹成功',
              bottom: 3.2
            })
            // 移完删除
            self.delAjax(item)
          }
        })
      },
      delAjax(item) {
        let self = this
        self.$ajax({
          method: 'delete',
          url:self.$apiApp +  'shoppingCart/shoppingCart/delete',
          params: {
            scIdArray: item.sc_id
          },
        }).then(function (response) {
          self.$emit('clearGoods')
        })
      },
      // 删除商品
      deleteGoods (item, index) {
        item.maskShow = false
        this.$verify({
          content: '确认删除所选商品吗？',
          leftText: '取消',
          rightText: '删除',
          rightFn: () => {
            this.animateName = 'fadeOut'
            this.list.splice(index,1)
            this.delAjax(item)
          }
        })

      },
      // 商品数量变化
      countChange (cartId,skuId,num) {
        // 计算价格
        this.$parent.selectChange()
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
    /*padding: 0 .2rem;*/
  }
  .title{
    font-weight: 600;
    height: .8rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 0 .2rem;
  }
  .title p{
    margin-left: 5px;
  }
  .goodsBox {
    background-color: white;
    padding: 0 .2rem;
    position: relative;
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
    font-size: .35rem;
    letter-spacing: 4px;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    padding-right: .5rem;
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
    width: .2rem;
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
  .moreRight {
    position: relative;
  }
  .bottomOperation> .more>.moreRight:hover .moreOperation {
    display: block;
  }
  .bottomOperation> .more> p{
    color: #F70057;
    border: solid 1px #F70057;
    padding: 1px .2rem;
  }
  .bottomOperation> .more> .moreRight>img{
    height: .4rem;
    margin-right: .4rem;
  }
  .bottomOperation> .more .moreRight .moreOperation {
    display: none;
    position: absolute;
    right: 0;
    top: .3rem;
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
  .moreOperation>.buttons>li img{
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
