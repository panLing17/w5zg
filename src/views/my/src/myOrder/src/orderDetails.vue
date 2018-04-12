<template lang="pug">
  .orderDetails.mescroll#orderMescroll
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 订单详情
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png").msg
    .topStatus {{countDowns}}    
    .goodsReceipt
      .consignee
        img(src="../../../../../assets/img/citySearch@2x.png")
        .addressee
          span.man 收件人:
            strong {{recipients}}
          span.phone {{phone}} 
      .address
        span 收货地址:
        strong {{address}}
    .content(v-for="(item,index) in orderDetails" @click="judgeSon()")
      .top
        .left
          span.orderNum 订单编号:
          span.num {{item.order_no}}
        .right
          span.orderStatus {{item.orderInfo_status}}   
      .center(v-for="items in item.orderDetail")
        .image
          img(:src="items.logo | img-filter")
        .goodsDetails
          .words {{items.goods_name}}
          .property
            span.color {{items.spec_json}}
            span.size L
          .amount x
            span {{items.goods_num}}
          .price {{items.sale_price | price-filter}}
          .btn(v-if="showFlag" @click.stop="judgeBtn()") 物流信息
      .bottom(v-show="flag")
        span.shop 提货门店: 
        span 门店南京市 建邺区 新街口 中央广场    
    .total
      ul
        li.totalQuantity
          span 总数量
          span x3
        li.freight
          span 运费
          span 0.0
        li.aggregate
          span 订单合计
          span {{totalPrice | price-filter}}
        li.netGoldCard
          span 网金卡抵扣
          span {{deductionCard | price-filter}}
        li.coupon
          span 通用券抵扣
          span {{deductionTicket | price-filter}}
      .bottoms
        span.payment 实付金额
        span.money {{payPrice | price-filter}}
    .cashCoupon 返 {{presentPrice | price-filter}} 元现金券
    .orderNumber
      ul
        li.code.selects
          span 订单号:
          span 2018022400001
        li.orderTime.selects
          span 下单时间:
          span {{createTime}}
        li.payTime.selects
          span 付款时间:
          span {{payTime}}
        li.sendTime.selects
          span 发货时间:
          span {{sendTime}}
        li.receiveTime.selects
          span 签收时间:
          span {{receiveTime}}
      .copy(@click="copyText()") 复制
    .title
      .line
      p 推荐
    w-recommend#dataId(:listData="recommendGoods")
    .bottomPlaceholder
    .fixedBtn
      .leftBtn {{leftBtn}}
      .rightBtn {{rightBtn}}

</template>

<script>
    import myGoods from '../../../../../assets/img/my_goods.png'
    export default {
      name: "orderDetails",
      data(){
        return{
          receiveTime:"", //签收时间
          sendTime:"", //发货时间
          payTime:"", //付款时间
          createTime:"", //下单时间
          countDowns:"", //倒计时
          address:"", //地址
          payPrice:"", //实付金额
          totalPrice:"", //总金额
          deductionCard:"", //网金卡
          presentPrice:"", //返现金
          deductionTicket:"", //通用券
          recipients: "", //收件人
          phone: "", //收件人手机号
          orderId:this.$route.query.orderId,
          leftBtn:"取消订单",
          rightBtn:"支付",
          showFlag:false,
          flag:false,
          recommendGoods: [],
          orderDetails:[
            {
              orderNum:"2018031401",
              imageSrc:myGoods,
            },
            {
              orderNum:"2018031402",
              imageSrc:myGoods,
            },
            {
              orderNum:"2018031403",
              imageSrc:myGoods,
            },
            {
              orderNum:"2018031404",
              imageSrc:myGoods,
            }
          ]
        }
      },
      created(){
        //this.countDown(86399);
      },
      mounted(){
        //this.$mescrollInt("orderMescroll",this.upCallback);
        this.judgeState();//判断状态
        this.orderDetailShow();//订单详情展示
        this.countDown(86400);
      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
      },
      methods:{
        //倒计时
        countDown(times){
          let self = this;
          var timer=null;
          timer=setInterval(function(){
            var day=0,
              hour=0,
              minute=0,
              second=0;//时间默认值
            if(times > 0){
              //day = Math.floor(times / (60 * 60 * 24));
              hour = Math.floor(times / (60 * 60)) - (day * 24);
              minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
              second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            //if (day <= 9) day = '0' + day;
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            self.countDowns = "请在"+hour+"小时"+minute+"分钟"+second+"秒内付款";
            times--;
          },1000);
          if(times<=0){
            clearInterval(timer);
          }
        },
        //订单详情展示
        orderDetailShow(){
          console.log(this.$route.query.orderId);
          let self = this;
          self.$ajax({
            method:"post",
            url:self.$apiTransaction + "order/detail",
            params:{
              orderTotalId:1
            }
          }).then(function(res){
            console.log(res.data.data);
            self.recipients = res.data.data[0].carry_person;
            self.phone = res.data.data[0].carry_phone;
            self.deductionCard = res.data.data[0].oi_deduction_card;
            self.deductionTicket = res.data.data[0].oi_deduction_ticket;
            var rel = 0; 
            for (var i = 0; i < res.data.data[0].orderInfo.length; i++) {
              rel += parseInt(res.data.data[0].orderInfo[i].oi_total);
            }
            self.totalPrice = rel;
            self.payPrice = res.data.data[0].oi_pay_price;
            self.presentPrice = res.data.data[0].oi_present_ticket;
            self.address = res.data.data[0].address;
            self.orderDetails = res.data.data[0].orderInfo;
            self.createTime = res.data.data[0].create_time;
            self.sendTime = res.data.data[0].send_time;
            self.receiveTime = res.data.data[0].receive_time;
          })
        },
        //跳到子订单详情页
        judgeSon(){
          this.$router.push('/my/orderDetailsSon');
        },  
        //按照按钮上的文字跳转页面
        judgeBtn(){
          var btn = document.getElementsByClassName("btn")[0];
          console.log(btn.innerHTML == "物流信息");
          if (btn.innerHTML == "物流信息") {
            this.$router.push('/my/checkLogistics');
          }
          
        },
          

        judgeState(){
          console.log(this.$route.query.state);
          console.log(this.$route.query.id);
          var states = this.$route.query.state;
          if (states == "待发货/待备货") {
            this.leftBtn = "批量退款";
            this.rightBtn = "提醒发货";
            this.showFlag = true;
            var rightBtns = document.getElementsByClassName("rightBtn")[0];
            rightBtns.style.backgroundColor = "white";
            rightBtns.style.color = "rgb(244,0,87)";
          }
        },

        copyText() {
          var li=document.getElementsByClassName("selects");
          for(var i=0;i<li.length;i++){        
            var span=li[i].getElementsByTagName("span");    
            for(var j=0;j<span.length;j++){
              span[j].select();        
              document.execCommand("copy"); // 执行浏览器复制命令
              alert("复制成功");    
            }
          }
          
        },

        upCallback: function(page) {
          let self = this;
          this.getListDataFromNet(page.num, page.size, function(curPageData) {
            if(page.num === 1) self.recommendGoods = []
            self.recommendGoods = self.recommendGoods.concat(curPageData)
            self.mescroll.endSuccess(curPageData.length)
          }, function() {
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            self.mescroll.endErr();
          })
        },
        getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
          setTimeout(function () {
  //            axios.get("xxxxxx", {
  //          params: {
  //            num: pageNum, //页码
  //            size: pageSize //每页长度
  //          }
  //        })
          let self = this;
          self.$ajax({
            method: 'post',
            url:self.$apiGoods +  'goodsSearch/goodsRecommendationList',
            params: {
              page: pageNum,
              rows: pageSize
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            successCallback&&successCallback(response.data.data);//成功回调
          })
  //        .catch(function(error) {
  //          errorCallback&&errorCallback()//失败回调
  //        });
          },500)
        }
      }
    }
</script>

<style scoped>
  /*顶部倒计时付款--开始*/
  .topStatus{
    padding: .4rem .3rem;
    background-color: #fff;
    margin-bottom: .2rem;
    font-size: .35rem;
    color: rgb(244,0,87);
  }
  /*顶部倒计时付款--开始*/
  .orderDetails{
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
  /*收货人的信息--开始*/
  .goodsReceipt{
    background-color: #fff;
    padding: .3rem;
    color: rgb(153,153,153);
  }
  .goodsReceipt .consignee{
    display: flex;
  }
  .consignee img{
    width: .25rem;
    height: .35rem;
  }
  .consignee .addressee{
    margin-top: -.1rem;
    margin-left: .2rem;
    font-size: .4rem;
  }
  .consignee .addressee span.man strong{
    margin-left: .2rem;
    font-size: .4rem;
    font-weight: 400;
  }
  .consignee .addressee span.phone{
    margin-left: .5rem;
  }
  .address{
    margin-top: .2rem;
    margin-left: .45rem;
    font-size: .4rem;
  }
  .address strong{
    display: inline-block;
    vertical-align: top;
    margin-left: .2rem;
    font-weight: 400;
    width: 7rem;
  }
  /*收货人的信息--结束*/
  /*商品的详情--开始*/
  .content{
    margin-top: .2rem;
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
    /*border-bottom: 1px solid rgb(242,242,242);*/
    white-space:nowrap;
    overflow-x:auto;
    display: flex;
    position: relative;
  } 
  .center .image{
    
  }
  .center .image img{
    width: 2.5rem;
    border-radius: .2rem;
  }
  .center .goodsDetails{
    margin-left: .3rem;
  }
  .center .goodsDetails .words{
    font-size: .35rem;
  }
  .center .goodsDetails .property{
    margin-top: .1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .property span.size{
    margin-left: .3rem;
  }
  .center .goodsDetails .amount{
    margin-top: .1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .price{
    margin-top: .25rem;
    font-size: .45rem;
    color: rgb(244,0,87);
    margin-left: -.1rem;
  }
  .center .goodsDetails .btn{
    width: 2rem;
    height: .8rem;
    border-radius: .8rem;
    border: 1px solid rgb(153,153,153);
    text-align: center;
    line-height: .8rem;
    font-size: .4rem;
    position: absolute;
    top: 2rem;
    right: .3rem;
    z-index: 100;
  }
  .bottom{
    height: .8rem;
    line-height: .8rem;
    background-color: #fff;
    padding: 0 .3rem;
    font-size: .35rem;
  }
  /*商品的详情--结束*/
  /*总商品的统计--开始*/
  .total{
    margin-top: .2rem;
    background-color: #fff;
  }
  .total ul{
    padding: .2rem .3rem .1rem;
    color: rgb(153,153,153);
    font-size: .35rem;
  }
  .total ul li{
    display: flex;
    justify-content: space-between;
  }
  .total .bottoms{
    padding: 0 .3rem;
    border-top: 1px solid rgb(242,242,242);
    height: .8rem;
    line-height: .8rem;
    font-size: .4rem;
    display: flex;
    justify-content: space-between;
  }
  .total .bottoms span.money{
    color: rgb(244,0,87);
  }
  /*总商品的统计--结束*/
  /*返现金券--开始*/
  .cashCoupon{
    height: 1.2rem;
    margin-top: .2rem;
    background-color: #fff;
    line-height: 1.2rem;
    padding-left: .3rem;
    font-size: .4rem;
    color: rgb(244,0,87);
  }
  /*返现金券--结束*/
  /*订单编号--开始*/
  .orderNumber{
    margin-top: .2rem;
    background-color: #fff;
    position: relative;
  }
  .orderNumber ul{
    padding: .2rem .3rem;
  }
  .orderNumber ul li{
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .orderNumber ul li span{
    margin-right: .2rem;
  }
  .orderNumber .copy{
    position: absolute;
    top: .3rem;
    right: .3rem;
    width: 1.4rem;
    height: .7rem;
    background-color: rgb(204,204,204);
    color: #fff;
    text-align: center;
    line-height: .7rem;
    font-size: .35rem;
    border-radius: .5rem;
  }
  /*订单编号--结束*/
  /*我的推荐--开始*/
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
  /*我的推荐--结束*/
  /*商品大图展示--开始*/

  /*商品大图展示--结束*/
  .bottomPlaceholder {
    height: 1.5rem;
  }
  #orderMescroll{
    top: 0;
    bottom: 0;
    height: auto;
    position: fixed;
  }

  /*底部的两个按钮--开始*/
  .fixedBtn{
    z-index: 102;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.4rem;
    display: flex;
    justify-content: flex-end;
    background-color: #fff;
    padding: .2rem .3rem;
  }
  .fixedBtn div{
    width: 2.3rem;
    height: 1rem;
    border-radius: 1rem;
    text-align: center;
    line-height: 1rem;
    font-size: .4rem;
  }
  .fixedBtn .leftBtn{
    color: rgb(161,161,161);
    border: 1px solid rgb(161,161,161);
  }
  .fixedBtn .rightBtn{
    color: #fff;
    border: 1px solid rgb(244,0,87);
    background-color: rgb(244,0,87);
    margin-left: .3rem;
  }
  /*底部的两个按钮--结束*/
</style>
