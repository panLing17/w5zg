<template lang="pug">
  .orderManage.mescroll#orderManageMescroll
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 订单管理
      .topRight(slot="right")
        img(src="../../../../../assets/img/searchInput搜索图标@2x.png").search
        img(src="../../../../../assets/img/msg_0.png").msg
    .orderStatus
      ul.wrapStatus
        li(v-for="(item,index) in status" @click="check(item,index)" :class="{active:index == num}").status {{item}}
    .content(v-for="(item,index) in orderDetail")
      .top
        .left
          span.orderNum 订单编号:
          span.num {{item.total_order_no}}
        .right#state {{item.order_status}}  
      .center(@click="$router.push({path:'/my/orderDetails',query:{state:item.order_status,id:index,orderId:item.total_order_id}})")
        .image
          img(:src="items | img-filter" v-for="items in item.logoList")
        .goodsDetails
          .words
      .bottom
        .left(v-if="item.order_status === '待备货'")
          .goodsCode 提货码: {{item.goodsCode}}
        .right
          .total
            .totalNumber
              span.amount 共计 {{item.totalCount}} 件商品
              span.price 合计 :
                strong.priceNum {{item.oi_pay_price | price-filter}}
      .button
        .cancel(@click="buttonLeft($event)") {{buttonL}}
        .pay(@click="buttonRight($event,item.total_order_id,item.oi_pay_price)" :class="{a:item.order_status !== '待付款'}") {{buttonR}}       
</template>

<script>
    import myGoods from '../../../../../assets/img/my_goods.png'
    export default {
      name: "orderManage",
      data(){
        return{
          state:"",
          num:0,
          statusFlag1:false,
          statusFlag2:true,
          status:["全部","待付款","待发货","待收货","待评价"],
          orderDetail:[],
          buttonL:"",
          buttonR:"",

        }
      },
      created(){

      },
      mounted(){
        this.jump();
        this.$mescrollInt("orderManageMescroll",this.upCallback);  
      },
      methods:{
        //判断上一页点击的索引值
        jump(){
          console.log(this.$route.query.id);
          if (this.$route.query.id == 1) {
            this.num = 1;
            this.state = 1;
          }
          if (this.$route.query.id == 2) {
            this.num = 2;
            this.state = 2;
          }
          if (this.$route.query.id == 3) {
            this.num = 3;
            this.state = 4;
          }
          if (this.$route.query.id == 4) {
            this.num = 4;
            this.state = 3;
          }
          this.request();
        },

        //点击tab切换
        check(item,index){
          console.log(item);
          this.num = index;
          if (item == "全部") {
            this.state = "";
          }
          if (item == "待付款") {
            this.state = 1;
          }
          if (item == "待发货") {
            this.state = 2;
          }
          if (item == "待收货") {
            this.state = 4;
          }
          if (item == "待评价") {
            this.state = 3;
          }
          this.request();
        },
        //判断两个按钮上的文字
        buttonLeft(e){
          if (e.target.innerText == "物流信息") {
            this.$router.push('/my/checkLogistics');
          }
        },
        buttonRight(e,id,price){
          if (e.target.innerText == "物流信息") {
            this.$router.push('/my/checkLogistics');
          }
          if (e.target.innerText == "支付") {
            alert(id,price);
            this.$router.push({
              path:'/payment',
              query:{
                id:id,
                price:price
              }
            })
          }
        },

        upCallback: function(page) {
          let self = this;
          this.getListDataFromNet(page.num, page.size, function(curPageData) {
            if(page.num === 1) self.orderDetail = []
            self.orderDetail = self.orderDetail.concat(curPageData)
            self.mescroll.endSuccess(curPageData.length)
          }, function() {
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            self.mescroll.endErr();
          })
        },
        getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
          let self = this;
          self.$ajax({
            method: 'post',
            url:self.$apiTransaction + 'order/orderByStatus',
            params: {
              status: this.state,
              page: pageNum,
              rows: pageSize
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            console.log(response);
            successCallback&&successCallback(response.data.data);//成功回调
            for (var i = 0; i < response.data.data.length; i++) {
              console.log(response.data.data[i].order_status);
              if (response.data.data[i].order_status === "待付款") {
                self.buttonL = "取消订单";
                self.buttonR = "支付";
              }
              if (response.data.data[i].order_status === "待提货/待收货") {
                self.buttonL = "物流信息";
                self.buttonR = "确认收货";
              }
            }
          })
        },

        request(){
          let self = this;
          self.$ajax({
            method: 'post',
            url:self.$apiTransaction + 'order/orderByStatus',
            params:{
              status:this.state,
              page: 1,
              rows: 10
            }
          }).then(function(response){
            console.log(response.data.data);
            self.orderDetail = response.data.data;
            for (var i in response.data.data) {
              console.log(response.data.data[i].order_status);
              console.log(response.data.data[i].order_status === "待付款");
              if (response.data.data[i].order_status == "待付款") {
                self.buttonL = "取消订单";
                self.buttonR = "支付";
              }
              if (response.data.data[i].order_status == "待收货/待提货") {
                self.buttonL = "物流信息";
                self.buttonR = "确认收货";
              }
              if (response.data.data[i].order_status == "待发货/待备货") {
                self.buttonL = "提醒物流";
                self.buttonR = "物流信息";
              }
            }
          })
        }
      }
    }
</script>

<style scoped>
  #orderManageMescroll{
    top: 0;
    bottom: 0;
    height: auto;
    position: fixed;
  }
  .active{
    color: rgb(244,0,87) !important;
  }
  .a{
    background-color: #fff !important;
    color: rgb(244,0,87) !important;
  }
  .orderManage{
    background-color: rgb(242,242,242);
    width: 100%;
    min-height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .topCenter{
    font-size: .5rem;
    font-weight: 400;
  }
  .topRight img{
    vertical-align: middle;
  }
  .topRight img.search{
    width: .55rem;
  }
  .topRight img.msg{
    width: .7rem;
    margin-left: .2rem;
    margin-top: -.1rem;
  }
  /*订单的状态--开始*/
  .orderStatus{
    background-color: #fff;
    height: 1rem;
    padding: 0 .3rem;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 200;
  }
  .orderStatus ul.wrapStatus{
    display: flex;
    justify-content: space-between;
  }
  .orderStatus ul.wrapStatus li.status{
    line-height: 1rem;
    font-size: .4rem;
    color: rgb(153,153,153);
  }
  /*订单的状态--结束*/
  /*订单内容--开始*/
  .content{
    margin-bottom: .3rem;
  }
  .content .top{
    height: .8rem;
    border-bottom: 1px solid rgb(242,242,242);
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0 .3rem;
    line-height: .8rem;
  }
  .top .left{
    color: rgb(51,51,51);
    font-size: .35rem;
  }
  .top .left span.orderNum{
    margin-right: .2rem;
  }
  .top .right{
    font-size:  .4rem;
    color: rgb(244,0,87);
  }
  .center{
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    white-space:nowrap;
    overflow-x:auto;
  } 
  .center .image{
    
  }
  .center .image img{
    width: 2.5rem;
    border-radius: .2rem;
    margin-right: .3rem;
  }
  .center .goodsExplain{
    padding: .1rem 0 0 .3rem;
    width: 100%;
  }
  .center .goodsExplain .words{
    font-size: .37rem;
  }
  .center .goodsExplain .cont{
    width: 100%;
    margin-top: .6rem;
    display: flex;
    justify-content: space-between;
    color: rgb(153,153,153);
  }
  .center .goodsExplain .cont .property span{
    margin-right: .3rem;
  }
  .center .goodsExplain .cont .quantity span{
    font-size: .35rem;
  }
  .bottom{
    background-color: #fff;
    padding: .3rem .3rem .4rem 0;
  }
  .bottom:after{
    content: "";
    display: block;
    clear: both;
  }
  .bottom .left{
    float: left;
    padding-left: .3rem;
  }
  .bottom .left .goodsCode{
    font-size: .4rem;
    color: rgb(244,0,87);
  }
  .bottom .right{
    float: right;
  }
  .bottom .right .totalNumber{
    font-size: .37rem;
    color: rgb(161,161,161);
  }
  .bottom .right .totalNumber span{
    margin-left: .3rem;
  }
  .bottom .right .totalNumber strong.priceNum{
    color: rgb(244,0,87);
    font-size: .4rem;
    font-weight: 400;
  }
  .button{
    padding-bottom: .3rem;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
  }
  .button div{
    width: 2.5rem;
    height: 1rem;
    border-radius: 1rem;
    text-align: center;
    line-height: .95rem;
    font-size: .4rem;
    margin-right: .3rem;
  }
  .button .cancel{
    color: rgb(161,161,161);
    border: 1px solid rgb(161,161,161);
  }
  .button .pay{
    color: #fff;
    border: 1px solid rgb(244,0,87);
    background-color: rgb(244,0,87);
  }
  /*订单内容--结束*/
</style>
