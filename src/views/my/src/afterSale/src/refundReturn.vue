<template lang="pug">
  .refundReturn
    nav-bar
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") 申请退款
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png")
    .content
      .center
        .image
          img(:src="goodsList.logo | img-filter")
        .goodsDetails
          .words {{goodsList.goods_name}}
          .property
            span(v-for="item in goodsList.spec_json") {{item.gspec_value}}
          .count x
            span {{goodsList.goods_num}}
    .goodsStatus(@click="$refs.statusChoose.showPop()" )
      ul
        li 货物状态
        li
          span {{statusType===0?'仅退款':'退货退款'}}
          img(src="../../../../../assets/img/right.png")
    .returnType(@click="$refs.returnStyleChoose.showPop()" v-if="returnTypeShow")
      ul
        li 退货方式
        li
          span {{returnStyleType===0?'快递退货':'门店退货'}}
          img(src="../../../../../assets/img/right.png")
    .refundReason(@click="$refs.reasonTypeChoose.showPop()")
      ul
        li {{reasonTitle}}
        li.special {{reasonText}}
          img(src="../../../../../assets/img/right.png")
    .amount
      .top
        ul
          li.num 数量
          li.addSub
            .sub(@click="sub()") -
            .input {{count}}
            .add(@click="add()") +
      .bottom
        ul
          li.money
            .left 现金退款:
            .right {{price.price | price-filter}}
          li.money
            .left 现金券退款:
            .right {{price.cardPrice | price-filter}}
          li.money
            .left 通用券退款:
            .right {{price.ticketPrice | price-filter}}
          li.total
            .arrow
            .left 退款总金额:
            .right {{price.price + price.cardPrice + price.ticketPrice | price-filter}}
          li.freight (含运费￥0)
    .refundExplain
      ul
        li 退款说明:
        li
          input(placeholder="请输入···", v-model="desc")
    .upload
      .up
        span 上传凭证
        span (最多可上传9张图片)
      w-upload(url="goodsRejected/rejectedImage", :max="9", @success="getImageArr")
    .submit(@click="dataCheck") 提交
    pop1(ref="statusChoose", :data="statusData", title="货物状态", @selected="statusTypeChange")
    pop1(ref="returnStyleChoose", :data="returnStyleData", title="退货方式", @selected="returnStyleChange")
    pop2(ref="reasonTypeChoose", :data="reasonData", :title="reasonTitle", item-key="rgr_reson", @selected="reasonTypeChange")
</template>
<script>
  import pop1 from './pop1'
  import pop2 from './pop2'

  export default {
    name: 'refundReturn',
    components:{pop1,pop2},
    data () {
      return {
        goodsList:{},
        // 退货状态 0 仅退款 1 退货退款
        statusType: 0,
        // 退货方式选择 0 快递退货 1 门店退货
        returnStyleType: 0,
        // 退货方式选择框 仅退款时隐藏 退货退款时出现
        returnTypeShow: false,
        statusData:['仅退款','退货退款'],
        returnStyleData:[],
        reasonData:[],
        reasonTitle:'退款原因',
        reasonType:-1,
        reasonText: '',
        count: 1,
        desc: '',
        imageArr:[],
        price: {}
      }
    },
    mounted () {
    },
    created () {
      // 获取退款原因列表
      this.getReasonData()
      // 获取退货商品信息
      this.getReturnGoods()
      // 获取退款金额
      this.getPrice()
      // 获取退货方式
      this.getReturnStyleData()
    },
    methods: {
      getReturnStyleData () {
        // console.log(this.goodsList)
        if (this.goodsList.delivery_ways === '快递配送') {
          this.returnStyleData = ['快递退货']
        }else {
          this.returnStyleData = ['快递退货','门店退货']
        }
      },
      //选择货物状态
      statusTypeChange(num){
        this.statusType = num;
        this.reasonText = '';
        if (num === 1) {
          this.returnTypeShow = true;
          this.reasonTitle = '退货原因';
        }else {
          this.returnTypeShow = false;
          this.reasonTitle = '退款原因';
        }
        this.getReasonData()
      },
      // 选择退货方式
      returnStyleChange (num) {
        this.returnStyleType = num;
      },
      // 选择退款原因
      reasonTypeChange (num) {
        this.reasonType = this.reasonData[num].rgr_id;
        this.reasonText = this.reasonData[num].rgr_reson;
      },
      //加减
      sub(){
        if (this.count === 1) {
          return;
        }else {
          this.count--;
          this.getPrice()
        }
      },
      add(){
        if (this.count === this.goodsList.goods_num) {
          return;
        }else {
          this.count++;
          this.getPrice()
        }
      },
      getReasonData () {
        let _this = this;
        let reasonType;
        if (this.statusType === 0) {
          reasonType = '184'
        }else {
          reasonType = '185'
        }
        this.$ajax({
          method: 'get',
          url: this.$apiTransaction + 'rejectedReason/returnReason',
          params:{
            reasonType: reasonType
          }
        }).then(function (response) {
          _this.reasonData = response.data.data;
        })
      },
      getPrice() {
        let _this = this
        this.$ajax({
          method: 'get',
          url: this.$apiTransaction + 'order/order/detail/usedNetCardAndCommonTicket',
          params:{
            orderDetailId:this.goodsList.order_detail_id,
            count: this.count
          }
        }).then(function (response) {
          _this.price = response.data.data;
        })
      },
      // 获取商品信息
      getReturnGoods () {
        this.goodsList = this.$store.state.returnGoods
        this.count = this.goodsList.goods_num
      },
      // 获取图片数组
      getImageArr (arr) {
        console.log(arr)
        this.imageArr = ''
        this.imageArr = arr.join('&')
        // this.imageArr = this.imageArr.substring(0,this.imageArr.length-1)
      },
    //  检查申请退款必填项数据
      dataCheck (){
        if (this.reasonType === -1) {
          this.$message.error('请选择退货原因！')
          return;
        }
        this.send()
      },
      // 申请退货/退款
      send () {
        let _this = this;
        let url = '';
        if (this.statusType === 0) {
          url = 'goodsRejected/rejectedOnly'
        }else if (this.statusType === 1) {
          url = 'goodsRejected/rejectedBoth'
        }

        let form = {
          orderOrOrderDetailId:this.goodsList.order_detail_id,
          count:parseInt(this.count),
          desp:[this.desc].toString(),
          picUrl:[this.imageArr].toString(),
          reasonId:this.reasonType,
          type:'1'
        }
        this.$ajax({
          method: 'post',
          url: this.$apiTransaction + url,
          params: form,
        }).then(function (response) {
          if (response.data.code === '081') {
              // 跳转到退货详情页
              _this.$router.replace({path:'/my/returnDetails',query:{id:response.data.data, detailId:_this.goodsList.order_detail_id}})
          }else {
            _this.$message.error(response.data.msg)
          }

        })
      },
      // 更新退货申请信息
      // updateInfo (id) {
      //   let _this = this
      //   let form = {
      //     id: id,
      //     company_storeId:this.goodsList.delivery_id,
      //     type:this.returnStyleType===0?'2':'1'
      //   }
      //   this.$ajax({
      //     method: 'post',
      //     url: this.$apiTransaction + 'goodsRejected/updateRejected',
      //     params:form
      //   }).then(function (response) {
      //     if (response.data.code === '081') {
      //       // 跳转到退货详情页
      //       _this.$router.replace({path:'/my/returnDetails',query:{id:id, detailId:_this.goodsList.order_detail_id}})
      //     }else {
      //       _this.$message.error(response.data.msg)
      //     }
      //   })
      // }
    }
  }
</script>

<style scoped>
  .refundReturn{
    width: 100%;
    min-height: 100vh;
    position: absolute;
    z-index: 102;
    background-color: rgb(242,242,242);
  }
  .topCenter{
    font-size: .5rem;
    font-weight: 400;
  }
  .topRight img{
    width: .7rem;
  }
  /*商品内容--开始*/
  .center{
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    flex-wrap: nowrap;
    display: flex;
    position: relative;
    height: 2.86rem;
  }
  .center .image {
    flex: none;
  }
  .center .goodsDetails {
    flex: 1;
    overflow: hidden;
    height: 100%;
    position: relative;
  }
  .center .check{
    line-height: 2.4rem;
    margin-right: .3rem;
    position: absolute;
    top: 44%;
    left: .3rem;
  }
  .center .image img{
    width: 2.5rem;
    height: 2.26rem;
    border-radius: .2rem;
  }
  .center .goodsDetails{
    margin-left: .3rem;
    /*line-height: 1;*/
  }
  .center .goodsDetails .words{
    font-size: .35rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .center .goodsDetails .property{
    margin-top: .33rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .property span{
    margin-right: .3rem;
  }
  .center .goodsDetails .count{
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  /*商品内容--结束*/
  /*货物状态--开始*/
  .goodsStatus,
  .refundReason,
  .refundExplain,
  .returnType{
    height: 1.2rem;
    background-color: #fff;
    margin-top: .2rem;
    font-size: .4rem;
    line-height: 1.2rem;
    padding-left: .3rem;
  }
  .goodsStatus ul,
  .refundReason ul,
  .returnType ul{
    display: flex;
    justify-content: space-between;
    height: 100%;
    overflow: hidden;
  }
  .goodsStatus ul li img,
  .refundReason ul li img,
  .returnType ul li img{
    width: .6rem;
    vertical-align: middle;
  }
  /*货物状态--结束*/
  /*数量--开始*/
  .amount{
    margin-top: .2rem;
    background-color: #fff;
    padding: .2rem .3rem .4rem;
  }
  .amount .top{
    border-bottom: 1px solid rgb(242,242,242);
    padding-bottom: .2rem;
  }
  .amount .top ul{
    display: flex;
    justify-content: space-between;
    font-size: .4rem;
  }
  .amount .top ul li.num{
    line-height: 1rem;
  }
  .amount .top ul li.addSub{
    width: 2.5rem;
    height: 1rem;
    border: 1px solid rgb(153,153,153);
    border-radius: .3rem;
    display: flex;
    justify-content: space-between;
  }
  .amount .top ul li.addSub .sub,
  .amount .top ul li.addSub .add{
    width: .6rem;
    font-size: 1rem;
    text-align: center;
    line-height: .9rem;
  }
  .amount .top ul li.addSub .add{
    font-size: .6rem;
    line-height: 1rem;
  }
  .amount .top ul li.addSub .input{
    width: 1.3rem;
    text-align: center;
    line-height: 1rem;
  }
  .amount .bottom{
    padding-top: .13rem;
  }
  .amount .bottom li.money{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .35rem;
    margin-top: .29rem;
    line-height: 1;
  }
  .amount .bottom li.money .left {
    flex: none;
    font-size: .29rem;
    color: #999;
  }
  .amount .bottom li.money .right, .amount .bottom li.total .right{
    flex: none;
    font-weight: 400;
    font-size: .26rem;
    color: rgb(244,0,87);
  }

  .amount .bottom li.total {
    margin-top: .26rem;
    line-height: 1;
    padding: .26rem 0 .13rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border-top: 1px solid #ccc;
  }
  .arrow {
    position: absolute;
    top: -.15rem;
    right: .4rem;
    width: .2rem;
    height: .2rem;
    background: #fff;
    transform: rotate(45deg);
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }

  .amount .bottom li.total .left {
    font-size: .34rem;
    flex: none;
    color: #333;
  }
  .amount .bottom li.freight {
    text-align: right;
    color: #999;
    font-size: .26rem;
  }
  /*数量--结束*/
  /*退款说明--开始*/
  .refundExplain ul{
    display: flex;
  }
  .refundExplain ul input{
    outline: none;
    font-size: .4rem;
    text-indent: .1rem;
    border: 0;
  }
  /*退款说明--结束*/
  /*图片上传--开始*/
  .upload{
    margin-top: .3rem;
    padding: .2rem .3rem;
    background-color: #fff;
  }
  .upload .up{
    margin-bottom: .2rem;
  }
  .upload .up span:nth-child(1){
    font-size: .4rem;
  }
  .upload .up span:nth-child(2){
    margin-left: .1rem;
    color: rgb(153,153,153);
  }
  /*图片上传--结束*/
  /*提交--开始*/
  .submit{
    width: 6.5rem;
    height: 1.2rem;
    background-color: rgb(245,0,87);
    border-radius: 1.2rem;
    margin: 1.6rem auto;
    text-align: center;
    line-height: 1.2rem;
    color: #fff;
    font-size: .4rem;
  }
  /*提交--结束*/

  .special {
    position: relative;
    padding-right: .6rem;
    box-sizing: border-box;
    width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: right;
  }
  .special img {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
</style>
