<template lang="pug">
  .goodsBox
    .banner
      nav-bar(background="rgba(255,255,255,.7)", height="0", border-bottom="none")
        .topLeft(slot="left")
          img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
        .topCenter(slot="center") 商品
        .topRight(slot="right")
      carousel(:indicators="true", :auto="5000", v-if="list.length > 0", :responsive="0", style="height:8rem")
        div(v-for="tag in list", style="width:100%" , @click="goActivity(tag.link,tag.linkType)")
          img(:src="tag.image" , style="width:100%;height:8rem")
    .goodsInfo
      .goodsName  阿迪达斯死地打啊那地方240-555￥硕大的运动服老人服大妈动服老人服大妈
      .price ￥566.00 <span>专柜价</span>
      .salePrice 零售价：￥500
    .numberBox
      ul.number
        li 邮费8
        li 邮费8
        li 邮费8
    ul.card
      li
        .label <span class="wang">网金卡</span>
        .text 222
      li
        .label <span class="tong">通用券</span>
        .text 222222222222222222222222222
    .size
      .left 规格
      img(src="../../../assets/img/right.png").right
    .distribution(@click="distribution")
      .top
        .left 配送方式
        .right
          span 快速配送
          span(style="color: rgb(246,0,88);") 有货<img src="../../../assets/img/right.png">
      .bottom
        .location
          img(src="../../../assets/img/citySearch.png")
          span 南京市
          span 玄武区
        .hour 下单完成后将在xx小时内发货
    .title
      .line
      p 详情
    .content
    .title
      .line
      p 推荐
    w-recommend(:listData="recommendGoods", background="white")
    .buttons
      .left 加入购物车
      .right(@click="buy") 立即购买
    select-size(:show="selectFlag", :photos="list", @close="selectClose", @buy="removeTouchDisable")
    dis-type(:show="disTypeFlag", @selectType="selectDis", @close="disTypeClose")
    store-select(:show="selectStoreFlag", @close="closeSelectStore")
    city-select(:show="selectCity", @close="closeSelectCity")
</template>

<script>
  import selectSize from './selectSize'
  import disType from './disType'
  import citySelect from './citySelect'
  import storeSelect from './storeSelect'
  export default {
    name: "goods-detailed",
    data () {
      return {
        selectFlag: false,
        disTypeFlag: false,
        selectCity: false,
        selectStoreFlag: false,
        list: [
          {image: 'static/img/1.jpg'},
          {image: 'static/img/2.jpg'},
          {image: 'static/img/3.jpg'},
          {image: 'static/img/4.jpg'},
          {image: 'static/img/5.jpg'}
        ],
        recommendGoods: [
          {
            image: ''
          },
          {
            image: ''
          },
          {
            image: ''
          },
          {
            image: ''
          }
        ]
      }
    },
    components: {selectSize,citySelect,disType,storeSelect},
    mounted () {
    },
    methods:{
      buy () {
        this.selectFlag = true
        this.onTouchMove(true)
        document.body.style.overflow='hidden'
        document.body.style.height="100vh"
      },
      selectClose () {
        this.selectFlag = false
        this.onTouchMove(false)
        document.body.style.overflow='auto'
      },
      distribution () {
        this.disTypeFlag = true
      },
      // 移除禁止触摸事件
      removeTouchDisable () {
        this.onTouchMove(false)
        document.body.style.overflow='auto'
      },
      // 关闭门店选择
      closeSelectStore () {
        this.selectStoreFlag = false
      },
      // 关闭城市选择
      closeSelectCity () {
        this.selectCity = false
      },
      // 关闭配送类型选择
      disTypeClose () {
        this.disTypeFlag = false
      },
      // 选择配送类型
      selectDis (data) {
        this.disTypeClose()
        if (data === 1) {
          this.selectCity = true
        } else {
          this.selectStoreFlag = true
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
  .goodsBox {
    background: rgb(242,242,242);
  }
  .banner{
    position: relative;
  }
  .goodsInfo{
    height: 3rem;
    padding: .2rem;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .goodsName{
    line-height: .5rem;
    font-size: .35rem;
    font-weight: 600;
  }
  .price {
    font-size: .5rem;
    color: rgb(245,0,87);
  }
  .price span{
    font-size: .3rem;
    color: #aaaaaa;
  }
  .numberBox {
    padding: 0 .2rem;
    background: white;
  }
  .number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #aaaaaa;
    background: white;
    height: 1rem;
    border-top: 1px rgb(242,242,242) solid;
  }
  .card{
    margin-top: .2rem;
    background: white;
  }
  .card li {
    min-height: .8rem;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .label {
    width: 1.6rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .label span{
    padding: 1px 5px;
    border-radius: .5rem;
  }
  .wang{
    background: rgb(255,128,171);
    color: white;
  }
  .tong{
    border: solid 1px rgb(255,128,171);
    color: rgb(255,128,171);
  }
  .text{
    color: rgb(247,0,88);
    flex-grow: 1;
    width: 0;
    flex-basis: 0;
    word-wrap: break-word;
  }
  .size {
    margin-top: .2rem;
    height: 1.5rem;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .2rem;
  }
  .size .left{
    font-size: .35rem;
    font-weight: 600;
  }
  .size .right{
    width: .6rem;
  }
  .distribution{
    margin-top: .2rem;
    height: 2.2rem;
    background: white;
  }
  .distribution .top{
    display: flex;
    height: .8rem;
    padding: 0 .2rem;
  }
  .distribution .top .left{
    height: 100%;
    width: 2rem;
    font-size: .35rem;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  .distribution .top .right{
    font-size: .35rem;
    font-weight: 600;
    align-items: center;
    height: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
  }
  .distribution .top .right span{
    display: flex;
    align-items: center;
  }
  .distribution .top .right img{
    width: .6rem;
  }
  .distribution .bottom{
    padding-left: 2.2rem;
  }
  .distribution .bottom .location{
    margin-top: .1rem;
  }
  .distribution .bottom .location img{
    float: left;
    height: .4rem;
  }
  .distribution .bottom .location span{
    margin-left: .2rem;
    font-weight: 600;
  }
  .distribution .bottom .hour{
    margin-top: .2rem;
    color: #aaaaaa;
  }
  /* 分割线 */
  .title{
    height: .8rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
  }
  .line{
    height: 1px;
    width: 3rem;
    background: #999;
  }
  .title p{
    position: absolute;
    background: #f2f2f2 ;
    padding: 0 .2rem;
  }
  .buttons {
    position: fixed;
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
</style>
