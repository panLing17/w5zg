<template lang="pug">
  .selectSizeBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-if="show", @touchstart="touchStart", @touchmove="touchMove")
        .photosBox(@touchstart="removeTouchDisable")
          ul.photos(:style="{width:5 * list.length + 'rem'}", :class="{smallPhoto:smallPhotoFlag}")
            li(v-for="item in list")
              img(:src="item.image")
        .goodsData(:class="{smallGoodsData:smallPhotoFlag}")
          .price(v-if="realGoodsData.storage_num>0") {{realGoodsData.counter_price | price-filter}}
          .price(v-else) {{0 | price-filter}}
          .store 库存{{realGoodsData.storage_num}}
          .size 选择 颜色 尺寸
        ul.spec
          li(v-for="item in spec")
            .title {{item.specName}}
            ul.content
              li(v-for="(i,index) in item.specValue", :class="{specChecked:item.valueIndex === index}", @click="item.valueIndex=index;getStoreNum()") {{i}}
              p(style="clear:both")
        .count
          span 数量
          w-counter(v-model="content", :min="1")
    .buttons(v-if="show")
      .left(@click="buy") 加入购物车
      .right(@click="close", v-if="onlySelectSpec") 确认选择
      .right(@click="buy", v-else) 立即购买
</template>

<script>
  export default {
    name: "city-select",
    data () {
      return {
        startY: '',
        moveY: '',
        smallPhotoFlag: false,
        content: 1,
        realGoodsData: {},
      }
    },
    props: {
      photos: {
        type: Array,
        default:[]
      },
      spec: Array,
      onlySelectSpec: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    computed:{
      list(){
        // 深度拷贝
        let obj={};
        obj=JSON.parse(JSON.stringify(this.photos))
        return obj
      }
    },
    mounted () {
      this.getStoreNum()
    },
    methods:{
      close () {
        this.$emit('close')
      },
      removeTouchDisable () {
        this.$emit('buy')
      },
      // 校验库存与获得skuId
      getStoreNum () {
        // 获取选中的规格
        let specData = {
          'cityId': this.$store.state.location.city.id,
          'gspu_id': this.$route.query.id,
          'specList': [
          ]
        }
        this.spec.forEach((now)=>{
          specData.specList.push({
            'gspec_name': now.specName,
            'gspec_value': now.specValue[now.valueIndex]
          })
        })
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/sku/detail',
          data: specData
        }).then(function (response) {
          self.realGoodsData = response.data.data
          // vuex中保存skuId
          self.$store.commit('getSkuId',response.data.data.gsku_id)
        })
      },
      buy () {
        // 将数量与价格传过去
        let data = {
          price: this.realGoodsData.counter_price,
          content: this.content
        }
        if (this.realGoodsData.storage_num>0) {
          // 此条为了恢复屏幕触摸事件
          this.$emit('buy', data)
        } else {
          this.$message.error('商品没有库存了')
        }

      },
      // 触摸开始
      touchStart (e) {
        this.startY = e.targetTouches[0].clientY
      },
      // 滑动中
      touchMove (e) {
        this.moveY = e.targetTouches[0].clientY
        // 滑动距离超过100 执行样式变换
        if( this.startY -this.moveY > 100) {
          this.smallPhotoFlag = true
          this.list.splice(1,this.list.length-1)
          // 延迟0.8秒 移除禁止触摸
          setTimeout(()=>{
            this.$emit('buy')
          },800)

        }

      },
      onTouchMove(inFlag) {
        if (inFlag) {
          document.addEventListener('touchmove', this.onHandler, false);
        } else {
          document.removeEventListener('touchmove', this.onHandler, false);
        }
      },
      onHandler(e) {
        e.preventDefault();
      }
    }
  }
</script>

<style scoped>
  .selectSizeBox {
  }

  .bg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
  }

  .main {
    padding-top: .2rem;
    padding-bottom: 1.5rem;
    background-color: white;
    width: 100%;
    height: 70%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
    overflow-y: auto;
  }
  .buttons {
    position: fixed;
    z-index: 103;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.2rem;
    display: flex;
    border: solid 1px rgb(244,0,87);
  }
  .buttons div{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .buttons .left{
    flex-grow: 1;
    height: 100%;
    background: white;
    font-size: .4rem;
    color: rgb(244,0,87);
  }
  .buttons .right{
    flex-grow: 1;
    height: 100%;
    background: rgb(244,0,87);
    font-size: .4rem;
    color: white;
  }
  /* 商品图片部分 */
  .photosBox {
    overflow-x: auto;
    width: 100%;
  }
  .photosBox .photos{
    display: flex;
    justify-content: space-around;
    min-width: 100% !important;
  }
  /* 缩小后样式 */
  .smallPhoto {
    justify-content: flex-start !important;
    padding-left: .2rem;
  }
  .smallPhoto li{
    height: 2rem !important;
    width: 2rem !important;
  }
  .photos li{
    transition: width 1s, height 1s;
    height: 5rem;
    width: 5rem;
    border-radius: .3rem;
    overflow: hidden;
  }
  .photos li img {
    width: 100%;
    height: 100%;
  }
  /* 商品数据部分 */
  .goodsData{
    margin-top: .2rem;
    height: 1.6rem;
    left: 50%;
    top:4rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    transition: width .9s, left .9s, top .9s;
  }
  .goodsData .price{
    font-size: .5rem;
    transition: font-size .5s;
    font-weight: 600;
    color: rgb(246,0,87);
  }
  .goodsData .store{
    color: #aaaaaa;
  }
  .goodsData .size{
     color: #999;
   }
  /* 小商品数据 */
  .smallGoodsData {
    width: 3rem !important;
    height: 2rem !important;
    position: absolute;
    align-items: flex-start;
    left: 2.4rem;
    top: 0;
  }
  .smallGoodsData .price{
    font-size: .4rem !important;
  }
  /* 规格部分 */
  .spec{

  }
  .spec>li{
    margin-top: .4rem;
  }
  .spec>li .title{
    font-size: .4rem;
    padding-left: .2rem;
  }
  .spec .content{
    margin-top: .3rem;
  }
  .spec .content li{
    float: left;
    padding: .2rem .3rem;
    border:  solid 1px pink;
    margin-left: .4rem;
    border-radius: .2rem;
    transition: background-color .3s, color .3s;
  }
  /* 规格选中 */
  .specChecked {
    background: pink;
    color: white !important;
  }
  /* 选择数量部分 */
  .count {
    margin-top: .5rem;
    font-size: .4rem;
    padding: 0 .2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
