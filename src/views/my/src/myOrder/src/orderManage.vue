<template lang="pug">
  .wrapNav
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="backJump()")
      .topCenter(slot="center") 订单管理
      .topRight(slot="right")
        img(src="../../../../../assets/img/searchInput搜索图标@2x.png" @click="jumpToSearch()").search
        img(src="../../../../../assets/img/msg_0.png" v-show="false").msg
    .orderStatus
      ul.wrapStatus
        li(v-for="(item,index) in status" @click="check(item,index)" :class="{active:index == num, underLine:index == num}").status {{item}}
        .lineDiv    
    .orderManage.mescroll#orderManageMescroll
      .wrapContent    
        .content(v-for="(item,index) in orderDetail")
          .top
            .left
              span.orderNum 订单编号:
              span.num {{item.total_order_no}}
            .right#state {{item.orderStatus}}
          .center(@click="$router.push({path:'/my/orderDetails',query:{state:item.order_status,from:'订单列表',orderId:item.total_order_id,totalNum:item.totalCount,orderNo:item.total_order_no}})" :class="{centerZ:item.logoList.length<=1}")
            .image
              img(:src="items | img-filter" v-for="items in item.logoList")
            .goodsDetails(v-show="item.logoList.length<=1")
              .goodsExplain
                span.words {{item.goodsName[0]}}
              .cont
                .property
                  span.color(v-for="items in item.spec_json") {{items.gspec_value}}
                  span.size
                .quantity
                  span.count x {{item.totalCount}}
          .bottom
            .left(v-if="false")
              .goodsCode 提货码: {{item.goodsCode}}
            .right
              .total
                .totalNumber
                  span.amount 共计 {{item.totalCount}} 件商品
                  span.price 合计 :
                    strong.priceNum {{item.oi_pay_price | price-filter}}
          .button
            .cancel(@click="buttonLeft($event,item.total_order_id)" v-show="item.buttonL !== '再次购买' && item.buttonL !== '提醒发货' && item.buttonL !== '申请退款' && item.buttonL !== '物流信息' && item.buttonL !== '取消申请'") {{item.buttonL}}
            .pay(@click="buttonRight($event,item.total_order_id,item.oi_pay_price)" :class="{a:item.order_status !== '待付款'}" v-show="item.buttonR !== '删除订单' && item.buttonR !== '再次购买' && item.buttonR !== '确认收货' && item.buttonR !== '物流信息' && item.buttonR !== '提货码' && item.buttonR !== '物流信息' && item.buttonR !== '取消申请'") {{item.buttonR}}
      .noData(v-if="isEmpty") 暂无更多记录    
</template>

<script>
  export default {
      name: "orderManage",
      data(){
        return{
          btnLeftFlag:"", //左边按钮显隐
          btnRightFlag:"", //右边按钮显隐
          orderStatus:"", //订单的状态
          state:this.$route.query.states,
          num:0,
          statusFlag1:false,
          statusFlag2:true,
          status:["全部","待付款","待发货","待收货","已完成"],
          orderDetail:[],
          buttonL:"",
          buttonR:""
        }
      },
      computed: {
        // 判断数据是否为空
        isEmpty () {
          if (this.orderDetail == null || this.orderDetail.length === 0) {
            return true;
          }else {
            return false;
          }
        }
      },
      created(){

      },
      mounted(){
        console.log(this.$route.query.id);
        //this.jump();
        this.keepStatus();
        this.$mescrollInt("orderManageMescroll",this.upCallback);
        //this.request();
        
      },
      methods:{
        //回退判断
        backJump(){
          if (this.$route.query.nums != 0 || this.$route.query.states != "" || this.$route.query.lefts != 0 ) {
            this.$router.push('/my');
          } else {
            this.$router.go(-1);
          }
        },
        //跳到搜索订单页面
        jumpToSearch(){
          this.$router.push('/my/searchOrder');
        },
        //判断上一页点击的索引值
        jump(){
          this.request();
        },

        //点击tab切换
        check(item,index){
          this.num = index;
          var lineDiv = document.getElementsByClassName("lineDiv")[0];
          lineDiv.style.transition = "all .5s";
          if (item == "全部") {
            this.state = "";
            lineDiv.style.left = 0;
            this.$router.push({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          if (item == "待付款") {
            this.state = 1;
            lineDiv.style.left = "19%";
            this.$router.push({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          if (item == "待发货") {
            this.state = 2;
            lineDiv.style.left = "40.5%";
            this.$router.push({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          if (item == "待收货") {
            this.state = 4;
            lineDiv.style.left = "62%";
            this.$router.push({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          if (item == "已完成") {
            this.state = 3;
            lineDiv.style.left = "83.5%";
            this.$router.push({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          
          this.request();
        },
        //保持状态判断
        keepStatus(){
          if (this.$route.query.id) {
            var lineDiv = document.getElementsByClassName("lineDiv")[0];
            lineDiv.style.transition = "all .5s";
            if (this.$route.query.id == 1) {
              this.num = 1;
              this.state = 1;
              lineDiv.style.left = "19%";
            }
            if (this.$route.query.id == 2) {
              this.num = 2;
              this.state = 2;
              lineDiv.style.left = "40.5%";
            }
            if (this.$route.query.id == 3) {
              this.num = 3;
              this.state = 4;
              lineDiv.style.left = "62%";
            }
            if (this.$route.query.id == 4) {
              this.num = 4;
              this.state = 3;
              lineDiv.style.left = "83.5%";
            }
          } else {
            console.log(this.$route.query.nums);
            if (this.$route.query.nums == undefined) {
              this.num = 0;
            } else{
              this.num = this.$route.query.nums;
            }
            
            this.state = this.$route.query.states;
            var lineDiv = document.getElementsByClassName("lineDiv")[0];
            lineDiv.style.left = this.$route.query.lefts;
            console.log(this.state);
          }
          
          this.request(); 
        },
        //判断两个按钮上的文字
        buttonLeft(e,id){
          if (e.target.innerText == "物流信息") {
            this.$router.push('/my/checkLogistics');
          }
          if (e.target.innerText == "取消订单") {
            this.$confirm({
              title: '确认',
              message: '真的要这样做吗',
              confirm: () => {
                //alert('确定')
                let self = this;
                self.$ajax({
                  method:"patch",
                  url:self.$apiTransaction + "order/cancel/"+id,
                  params:{}
                }).then(function(res){
                  self.request();
                })
              },
              noConfirm: () => {
                //alert('取消')
              }
            })
            
          }
          if (e.target.innerText == "删除订单") {
            this.$confirm({
              title: '确认',
              message: '真的要这样做吗',
              confirm: () => {
                let self = this;
                self.$ajax({
                  method:"post",
                  url:self.$apiTransaction + "order/delOrder",
                  params:{
                    totalOrderId:id
                  }
                }).then(function(res){
                  self.request();
                })
              },
              noConfirm: () => {

              }
            })
          }

        },
        buttonRight(e,id,price){
          if (e.target.innerText == "物流信息") {
            this.$router.push('/my/checkLogistics');
          }
          if (e.target.innerText == "支付") {
            this.$router.push({
              path:'/payment',
              query:{
                id:id,
                price:price
              }
            })
          }
          if (e.target.innerText == "再次购买") {
            alert("逗你玩！");
          }
          if (e.target.innerText == "确认收货") {
            let self = this;
            self.$ajax({
              method:"patch",
              url:self.$apiTransaction + "order/confirmTakeGood/"+id,
              params:{}
            }).then(function(res){
              console.log(res);
              self.request();
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
              status: self.state,
              page: pageNum,
              rows: pageSize
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            console.log(response.data.data);
            var arr = response.data.data;
            for (var i=0; i<arr.length; i++) {
              if (arr[i].order_status == "（退货）售后") {
                arr[i].buttonL = "取消申请";
                arr[i].buttonR = "取消申请";
                arr[i].orderStatus = "（退货）售后";
              }
              if (arr[i].order_status == "待付款") {
                arr[i].buttonL = "取消订单";
                arr[i].buttonR = "支付";
                arr[i].orderStatus = "待付款";
              }
              if (arr[i].order_status == "待收货/待提货") {
                if (arr[i].delivery_ways == "自提") {
                  arr[i].buttonL = "申请退款";
                  arr[i].buttonR = "提货码";
                  arr[i].orderStatus = "待自提";
                }
                if (arr[i].delivery_ways == "快递配送") {
                  arr[i].buttonL = "物流信息";
                  arr[i].buttonR = "确认收货";
                  arr[i].orderStatus = "待收货";
                }

              }
              if (arr[i].order_status == "待发货/待备货") {
                if (arr[i].delivery_ways == "自提") {
                  arr[i].buttonL = "申请退款";
                  arr[i].buttonR = "提货码";
                  arr[i].orderStatus = "待备货";
                }
                if (arr[i].delivery_ways == "快递配送") {
                  arr[i].buttonL = "提醒发货";
                  arr[i].buttonR = "物流信息";
                  arr[i].orderStatus = "待发货";
                }
              }
              if (response.data.data[i].order_status == "已取消") {
                arr[i].buttonL = "删除订单";
                arr[i].buttonR = "再次购买";
                arr[i].orderStatus = "已取消";
              }
              if (response.data.data[i].order_status == "已完成") {
                arr[i].buttonL = "删除订单";
                arr[i].buttonR = "再次购买";
                arr[i].orderStatus = "已完成";
              }
            }
            successCallback&&successCallback(arr);//成功回调
          })
        },

        request(){
          let self = this;
          self.$ajax({
            method: 'post',
            url:self.$apiTransaction + 'order/orderByStatus',
            params:{
              status: self.state,
              page: 1,
              rows: 10
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function(response){
            self.orderDetail = response.data.data;
            for (var i=0; i<self.orderDetail.length; i++) {
              if (self.orderDetail[i].order_status == "（退货）售后") {
                self.orderDetail[i].buttonL = "取消申请";
                self.orderDetail[i].buttonR = "取消申请";
                self.orderDetail[i].orderStatus = "（退货）售后";
              }
              if (self.orderDetail[i].order_status == "待付款") {
                self.orderDetail[i].buttonL = "取消订单";
                self.orderDetail[i].buttonR = "支付";
                self.orderDetail[i].orderStatus = "待付款";
              }
              if (self.orderDetail[i].order_status == "待收货/待提货") {
                if (self.orderDetail[i].delivery_ways == "自提") {
                  self.orderDetail[i].buttonL = "申请退款";
                  self.orderDetail[i].buttonR = "提货码";
                  self.orderDetail[i].orderStatus = "待自提";
                }
                if (self.orderDetail[i].delivery_ways == "快递配送") {
                  self.orderDetail[i].buttonL = "物流信息";
                  self.orderDetail[i].buttonR = "确认收货";
                  self.orderDetail[i].orderStatus = "待收货";
                }

              }
              if (self.orderDetail[i].order_status == "待发货/待备货") {
                if (self.orderDetail[i].delivery_ways == "自提") {
                  self.orderDetail[i].buttonL = "申请退款";
                  self.orderDetail[i].buttonR = "提货码";
                  self.orderDetail[i].orderStatus = "待备货";
                }
                if (self.orderDetail[i].delivery_ways == "快递配送") {
                  self.orderDetail[i].buttonL = "提醒发货";
                  self.orderDetail[i].buttonR = "物流信息";
                  self.orderDetail[i].orderStatus = "待发货";
                }
              }
              if (response.data.data[i].order_status == "已取消") {
                self.orderDetail[i].buttonL = "删除订单";
                self.orderDetail[i].buttonR = "再次购买";
                self.orderDetail[i].orderStatus = "已取消";
              }
              if (response.data.data[i].order_status == "已完成") {
                self.orderDetail[i].buttonL = "删除订单";
                self.orderDetail[i].buttonR = "再次购买";
                self.orderDetail[i].orderStatus = "已完成";
              }
            }
          })
        }
      }
    }
</script>

<style scoped>
  #orderManageMescroll{
    top: 1.3rem;
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
    /*margin-top: 1.3rem;*/
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
  .lineDiv{
    width: 15%;
    height: 2.5px;
    background-color: rgb(244,0,87);
    position: absolute;
    left: 0;
    bottom: 0;
  }
  /*订单的状态--结束*/
  /*订单内容--开始*/
  .wrapContent{
    margin-top: 1.2rem;
  }
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
    width: 100%;
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    white-space: nowrap;
    overflow-x:auto;
    display: flex;
  }
  .centerZ{
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    white-space: normal !important;
    display: flex;
  }
  .center .image{

  }
  .center .image img{
    width: 2.5rem;
    border-radius: .2rem;
    margin-right: .3rem;
  }
  .center .goodsDetails{
    width: 100%;
    padding-left: .2rem;
  }
  .center .goodsExplain{
    width: 100%;
  }
  .center .goodsExplain .words{
    font-size: .37rem;
  }
  .center .cont{
    width: 100%;
    margin-top: .6rem;
    display: flex;
    justify-content: space-between;
    color: rgb(153,153,153);
  }
  .center .cont .property span{
    margin-right: .3rem;
  }
  .center .cont .quantity span{
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
    width: 2rem;
    height: .8rem;
    border-radius: .8rem;
    text-align: center;
    line-height: .8rem;
    font-size: .35rem;
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
  .noData {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    color: rgb(153,153,153);
    font-size: .4rem;
    z-index: 202;
  }
</style>
