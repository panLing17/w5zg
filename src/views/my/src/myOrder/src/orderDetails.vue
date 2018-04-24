<template lang="pug">
  .orderDetails.mescroll#orderMescroll
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 订单详情
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png" v-if="false").msg
    .topStatus(v-if="false") {{countDowns}}
    .goodsReceipt(v-if="deliveryFlag")
      .consignee
        img(src="../../../../../assets/img/citySearch@2x.png")
        .addressee
          span.man 收件人:
            strong {{recipients}}
          span.phone {{phone}}
      .address
        span 收货地址:
        strong {{address}}
    .pickUpGoods(v-else="deliveryFlag")
      .consignee
        img(src="../../../../../assets/img/citySearch@2x.png")
        .addressee
          span.man 提货人:
            strong {{recipients}}
          span.phone {{phone}}
    .content(v-for="(item,index) in orderDetails")
      .top
        .left
          span.orderNum 订单编号:
          span.num {{item.order_no}}
        .right
          span.orderStatus {{item.orderInfoStatus}}
      .center(v-for="items in item.orderDetail")
        .image
          img(:src="items.logo | img-filter")
        .goodsDetails
          .words {{items.goods_name}}
          .wrapAttr
            .left
              .property(v-for="skus in items.spec_json")
                span.color {{skus.gspec_value}}
                span.size(v-if="false") {{skus.gspec_value}}
              .amount x{{items.goods_num}}
            .right
              .price {{items.sale_price | price-filter}}
          .wrapBtn
            .moreThen(v-show="item.morethenFlag" @click="moreShow($event)") 更多
              .moreBtn.btn(@click.stop="judgeMoreBtn($event,item,items)") {{moreBtnCont}}
            .btnF.btn(v-show="item.btnF !== '删除订单' && item.btnF !== '提醒发货' && item.btnF !== '取消订单' && item.btnF !== '取消申请'" @click.stop="judgeBtnF($event,item, items)") {{item.btnF}}
            .btnS.btn(v-show="item.btnS !== '再次购买' && item.btnS !== '支付' && item.btnS !== '提醒发货' && item.btnS !== '取消申请'" @click.stop="judgeBtnS($event,item, items)") {{item.btnS}}
      .pickUpNum(v-show="pickUpNoFlag")
        .alertFrame
          .topDiv 提货码
          .contDiv {{item.pick_up_no}}
          .bottomDiv(@click="pickUpNoFinish()") 完成
      .bottom(v-show="flag")
        span.shop 提货门店:
        span {{item.si_name}}
    .total
      ul
        li.totalQuantity
          span 总数量
          span x {{totalNumber}}
        li.freight(v-show="freightFlag")
          span 运费
          span {{freight | price-filter}}
        li.aggregate
          span 订单合计
          span {{totalPrice | price-filter}}
        li.netGoldCard(v-show="BOrC=='091'")
          span 现金券抵扣
          span {{deductionCard | price-filter}}
        li.coupon(v-show="BOrC=='091'")
          span 通用券抵扣
          span {{deductionTicket | price-filter}}
      .bottoms
        span.payment 实付金额
        span.money {{payPrice | price-filter}}
    .cashCoupon(v-show="BOrC=='091'") 返 {{presentPrice | price-filter}} 元通用券
    .orderNumber
      ul
        li.code.selects
          span 订单号:
          span {{totalOrderNum}}
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
      .copy(@click="copyText(totalOrderNum)") 复制
    .title
      .line
      p 推荐
    w-recommend#dataId(:listData="recommendGoods")
    .bottomPlaceholder
    .fixedBtn(v-show="whiteBarFlag")
      .leftBtn(v-show="leftBtn !== '删除订单' && leftBtn !== '提醒发货' && leftBtn !== '批量退款' && leftBtn !== '取消申请'" @click="jumpToLeft($event)") {{leftBtn}}
      .rightBtn(@click="jumpToRight($event)" v-show="rightBtn !== '再次购买' && rightBtn !== '确认收货' && rightBtn !== '提醒发货' && rightBtn !== '申请退款' && rightBtn !== '批量退款' && rightBtn !== '取消申请'") {{rightBtn}}
</template>

<script>
  export default {
      name: "orderDetails",
      data(){
        return{
          whiteBarFlag:true, //最下方的白条的显隐
          pickUpNoFlag:"", //提货码的显隐
          freight:0, //运费
          orderInfoStatus:"", //订单状态
          totalOrderNum:this.$route.query.orderNo, //总订单编号
          totalNumber:this.$route.query.totalNum, //从上个页面传来的商品总量
          moreBtnFlag:"", //更多功能按钮的显隐
          moreBtnCont:"申请退款", //更多功能按钮
          freightFlag:"", //判断是否自提后是否显示运费
          deliveryFlag:"", //判断是否自提
          morethenFlag:true, //判断更多的显隐
          btnSFlag:true, //判断第二个按钮的显隐
          btnFFlag:true, //判断第一个按钮的显隐
          btnS:"", //更多旁边第二个按钮
          btnF:"", //更多旁边第一个按钮
          color:"", //颜色或者容量
          size:"", //大小或者体积
          receiveTime:"", //签收时间
          sendTime:"", //发货时间
          payTime:"", //付款时间
          createTime:"", //下单时间
          countDowns:"", //倒计时
          address:"", //地址
          payPrice:"", //实付金额
          totalPrice:"", //总金额
          deductionCard:"", //现金券
          presentPrice:"", //返现通用券
          deductionTicket:"", //通用券抵扣
          recipients:"", //收件人
          phone: "", //收件人手机号
          orderId:this.$route.query.orderId, //从订单管理传来的商品id
          leftBtn:"", //订单最下面的左边按钮
          rightBtn:"", //订单最下面的右边按钮
          leftBtnFlag:"", //判断订单最下面左边按钮的显隐
          showFlag:true,
          flag:"",
          recommendGoods: [],
          orderDetails:[],
          TotalOrderId:"", //总的订单id
          BOrC:"" //判断用户身份
        }
      },
      created(){

      },
      mounted(){
        //判断用户身份
        this.judgeBOrC();
        this.$mescrollInt("orderMescroll",this.upCallback);
        //this.judgeState();//判断状态
        this.orderDetailShow();//订单详情展示
        //this.countDown(1800);
        //判断最下方的两个按钮都隐藏时下方的白条消失
        //this.judgeWhiteBar();
      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
      },
      methods:{
        //判断此时账号是B端还是C端
        judgeBOrC(){
          let self = this;
          self.$ajax({
            method:"get",
            url:self.$apiMember + 'member/currentMember',
            params:{}
          }).then(function(res){
            self.BOrC = res.data.data.member_type;
          })
        },
        //判断最下方的两个按钮都隐藏时下方的白条消失
        judgeWhiteBar(){
          var leftBtn = document.getElementsByClassName("leftBtn")[0];
          console.log(leftBtn.style.display == "");
          var rightBtn = document.getElementsByClassName("rightBtn")[0];
          console.log(rightBtn.style.display == "");
          if (leftBtn.style.display == "" && rightBtn.style.display == "") {
            this.whiteBarFlag = false;
          } else {
            this.whiteBarFlag = true;
          }
        },
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
              //hour = Math.floor(times / (60 * 60)) - (day * 24);
              minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
              second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            //if (day <= 9) day = '0' + day;
            //if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            self.countDowns = "请在"+minute+"分钟"+second+"秒内付款";
            times--;
          },1000);
          if(times<=0){
            clearInterval(timer);
          }
        },
        //订单最下面的左边按钮
        jumpToLeft(e){
          if (e.target.innerHTML == "删除订单") {
            alert("你被耍了！");
          }
          if (e.target.innerHTML == "取消订单") {
            this.$confirm({
              title: '确认',
              message: '真的要这样做吗',
              confirm: () => {
                //alert('确定')
                let self = this;
                self.$ajax({
                  method:"patch",
                  url:self.$apiTransaction + "order/cancel"+"/+"+self.orderId,
                  params:{}
                }).then(function(res){
                  console.log(res);
                  self.$router.go(-1);
                })
              },
              noConfirm: () => {
                //alert('取消')
              }
            })
            
          }
          if (e.target.innerHTML == "批量退款") {

          }
        },
        //订单最下面的右边按钮
        jumpToRight(e){
          if (e.target.innerHTML == "支付") {
            this.$router.push({
              path:'/payment',
              query:{
                id:this.TotalOrderId,
                price:this.payPrice
              }
            })
          }
          if (e.target.innerHTML == "申请退款") {

          }
        },

        //更多展示功能按钮
        moreShow(e){
          console.log(e.target.children[0].style.display);
          if (e.target.children[0].style.display == "" || e.target.children[0].style.display == "none") {
            e.target.children[0].style.display = "block";
          } else {
            e.target.children[0].style.display = "none";
          }
          
        },
        //点击更多后展示的按钮
        judgeMoreBtn(e,item,items){
          if (e.target.innerHTML == "申请退货" || e.target.innerHTML == "申请退款") {
            items.delivery_id = item.delivery_id
            this.$store.commit('getReturnGoods', items)
            this.$router.push({path:'/my/refundReturn'});
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
              orderTotalId:self.orderId
            }
          }).then(function(res){
            console.log(res.data.data);
            self.totalOrderNum = res.data.data[0].total_order_no;
            self.recipients = res.data.data[0].carry_person;
            self.phone = res.data.data[0].carry_phone;
            self.deductionCard = res.data.data[0].oi_deduction_card;
            self.deductionTicket = res.data.data[0].oi_deduction_ticket;
            // var rel = 0;
            // for (var i = 0; i < res.data.data[0].orderInfo.length; i++) {
            //   rel += parseInt(res.data.data[0].orderInfo[i].oi_total);
            // }
            self.totalPrice = res.data.data[0].oi_total_price;
            self.payPrice = res.data.data[0].oi_pay_price;
            self.presentPrice = res.data.data[0].oi_present_ticket;
            self.address = res.data.data[0].address;
            self.orderDetails = res.data.data[0].orderInfo;
            self.createTime = res.data.data[0].create_time;
            self.sendTime = res.data.data[0].send_time;
            self.payTime = res.data.data[0].pay_time;
            self.receiveTime = res.data.data[0].receive_time;
            //总订单的id
            self.TotalOrderId = res.data.data[0].total_order_id;
            //判断是否自提
            //自提
            if (res.data.data[0].delivery_ways == "自提") {
              self.flag = true; //显示提货人
              self.deliveryFlag = false;
              self.freightFlag = false;
            }
            //配送
            if (res.data.data[0].delivery_ways == "快递配送") {
              self.flag = false; //显示收货人
              self.deliveryFlag = true;
              self.freightFlag = true;
            }

            //判断货物状态来决定
            var arrays = res.data.data[0].orderInfo;
            for (var i = 0; i < arrays.length; i++) {
              console.log(arrays[i].orderInfo_status);
              if (arrays[i].orderInfo_status == "（退货）售后") {
                  //arrays[j].refund_status
                  arrays[i].morethenFlag = false;
                  arrays[i].moreBtnFlag =false;
                  arrays[i].btnSFlag = false;
                  arrays[i].btnFFlag = false;
                  arrays[i].btnS = "取消申请";
                  arrays[i].btnF = "取消申请";
                  self.leftBtn = "取消申请";
                  self.rightBtn = "取消申请";
                  arrays[i].orderInfoStatus = arrays[i].orderInfo_status;
              }
              if(arrays[i].orderInfo_status == "待付款"){
                arrays[i].morethenFlag = false;
                arrays[i].moreBtnFlag =false;
                arrays[i].btnSFlag = false;
                arrays[i].btnFFlag = false;
                arrays[i].btnF = "取消订单";
                arrays[i].btnS = "支付";
                self.leftBtnFlag = true;
                self.leftBtn = "取消订单";
                self.rightBtn = "支付";
                arrays[i].orderInfoStatus = arrays[i].orderInfo_status;
              }
              if (arrays[i].orderInfo_status == "待发货/待备货") {
                if (res.data.data[0].delivery_ways == "快递配送"){
                  arrays[i].morethenFlag = false;
                  arrays[i].moreBtnFlag =false;
                  arrays[i].btnSFlag = true;
                  arrays[i].btnFFlag = true;
                  arrays[i].btnF = "申请退款";
                  arrays[i].btnS = "提醒发货";
                  self.leftBtnFlag = true;
                  self.leftBtn = "批量退款";
                  self.rightBtn = "提醒发货";
                  arrays[i].orderInfoStatus = "待发货";
                  var mArr = arrays[i].orderDetail;
                  for (var j = 0; j < mArr.length; j++) {
                    console.log(mArr[j].refund_status);
                    if(mArr[j].refund_status != null){
                      arrays[i].btnF = "取消申请";
                    }
                  }
                }
                if (res.data.data[0].delivery_ways == "自提"){
                  arrays[i].morethenFlag = false;
                  arrays[i].moreBtnFlag =false;
                  arrays[i].btnSFlag = true;
                  arrays[i].btnFFlag = true;
                  arrays[i].btnF = "申请退款";
                  arrays[i].btnS = "提醒发货";
                  //提货码按钮的颜色
                  //var btnsDiv = document.getElementsByClassName("btnS")[0];
                  //btnsDiv.style.backgroundColor = "rgb(244,0,87)";
                  //btnSDiv.style.color = "#fff";
                  //btnSDiv.style.borderColor = "rgb(244,0,87)";
                  self.leftBtnFlag = false;
                  self.leftBtn = "批量退款";
                  self.rightBtn = "申请退款";
                  arrays[i].orderInfoStatus = "待备货";
                  var mArr = arrays[i].orderDetail;
                  for (var j = 0; j < mArr.length; j++) {
                    console.log(mArr[j].refund_status);
                    if(mArr[j].refund_status != null){
                      arrays[i].btnF = "取消申请";
                    }
                  }
                }
              }

              if (arrays[i].orderInfo_status == "待收货/待提货") {
                if (res.data.data[0].delivery_ways == "快递配送") {
                  arrays[i].morethenFlag = true;
                  arrays[i].moreBtnFlag =false;
                  arrays[i].btnSFlag = true;
                  arrays[i].btnFFlag = true;
                  arrays[i].btnF = "物流信息";
                  arrays[i].btnS = "确认收货";
                  self.leftBtnFlag = true;
                  self.leftBtn = "批量退款";
                  self.rightBtn = "确认收货";
                  var rightBtn = document.getElementsByClassName("rightBtn")[0];
                  rightBtn.style.background = "white";
                  rightBtn.style.color = "rgb(244,0,87)";
                  arrays[i].orderInfoStatus = "待收货";
                }
                if (res.data.data[0].delivery_ways == "自提") {
                  arrays[i].morethenFlag = false;
                  arrays[i].moreBtnFlag =false;
                  arrays[i].btnSFlag = true;
                  arrays[i].btnFFlag = true;
                  arrays[i].btnF = "申请退款";
                  arrays[i].btnS = "提货码";
                  //提货码按钮的颜色
                  // var btnSDiv =document.getElementsByClassName("btnS")[0];
                  // btnSDiv.style.background = "rgb(244,0,87)";
                  // btnSDiv.style.color = "white";
                  // btnSDiv.style.borderColor = "rgb(244,0,87)";
                  self.leftBtnFlag = true;
                  self.leftBtn = "批量退款";
                  self.rightBtn = "再次购买";
                  var rightBtn = document.getElementsByClassName("rightBtn")[0];
                  rightBtn.style.background = "white";
                  rightBtn.style.color = "rgb(244,0,87)";
                  arrays[i].orderInfoStatus = "待提货";
                }
              }
              if (arrays[i].orderInfo_status == "已完成") {
                arrays[i].morethenFlag = false;
                arrays[i].moreBtnFlag =false;
                arrays[i].btnSFlag = true;
                arrays[i].btnFFlag = true;
                arrays[i].btnF = "申请退货";
                arrays[i].btnS = "再次购买";
                self.leftBtnFlag = true;
                self.leftBtn = "批量退款";
                self.rightBtn = "再次购买";
                arrays[i].orderInfoStatus = arrays[i].orderInfo_status;
              }

              if (arrays[i].orderInfo_status == "已取消") {
                arrays[i].morethenFlag = false;
                arrays[i].moreBtnFlag =false;
                arrays[i].btnSFlag = true;
                arrays[i].btnFFlag = true;
                arrays[i].btnF = "删除订单";
                arrays[i].btnS = "再次购买";
                self.leftBtnFlag = true;
                self.leftBtn = "删除订单";
                self.rightBtn = "再次购买";
                arrays[i].orderInfoStatus = arrays[i].orderInfo_status;
              }
            }

          })
        },
        //按照按钮上的文字跳转页面
        judgeBtnF(e,item,items){
          //此功能还没有
          if (e.target.innerHTML == "再次购买") {
            alert("逗你玩！");
          }
          //点击查看物流信息
          if (e.target.innerHTML == "物流信息") {
            this.$router.push({path:'/my/checkLogistics',query:{orderId:item.order_id,address:this.address,goodsPic:items.logo}});
          }
          //进入到申请退货页面
          if (e.target.innerHTML == "申请退货" || e.target.innerHTML == "申请退款"){
            items.delivery_id = item.delivery_id
            this.$store.commit('getReturnGoods', items)
            this.$router.push({path:'/my/refundReturn'});
          }
          if (e.target.innerHTML == "取消订单"){

          }
        },
        judgeBtnS(e,item, items){
          console.log(item);
          //进入到申请退货页面
          if (e.target.innerHTML == "申请退货" || e.target.innerHTML == "申请退款"){
            items.delivery_id = item.delivery_id
            this.$store.commit('getReturnGoods', items)
            this.$router.push({path:'/my/refundReturn'});
          }
          //支付
          if (e.target.innerHTML == "支付") {

          }
          //点击查看物流信息
          if (e.target.innerHTML == "物流信息") {
            this.$router.push({path:'/my/checkLogistics',query:{orderId:item.order_id,address:this.address,goodsPic:items.logo}});
          }
          //没有
          if (e.target.innerHTML == "提醒发货") {
            alert("逗你玩！")
          }
          //点击弹出一个框显示提货码
          if (e.target.innerHTML == "提货码") {
            this.pickUpNoFlag = true;
            var orderDetails = document.getElementsByClassName("orderDetails")[0];
            orderDetails.style.overflow = "hidden";
          }
          //此功能未开放
          if (e.target.innerHTML == "再次购买") {
            alert("逗你玩！");
          }
          //点击完了跳到订单列表
          if (e.target.innerHTML == "确认收货") {
            this.$confirm({
              title: '确认',
              message: '真的要这样做吗',
              confirm: () => {
                //alert('确定')
                let self = this;
                self.$ajax({
                  method:"patch",
                  url:self.$apiTransaction + "order/confirmTakeGood/"+item.order_id,
                  params:{}
                }).then(function(res){
                  console.log(res);
                  self.$router.push('/my/orderManage');
                })
              },
              noConfirm: () => {
                //alert('取消')
              }
            })
            
          }
        },

        pickUpNoFinish(){
          this.pickUpNoFlag = false;
          var orderDetails = document.getElementsByClassName("orderDetails")[0];
          orderDetails.style.overflow = "auto";
        },
        judgeState(){
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

        copyText (val) {
          let oInput = document.createElement('input');
          oInput.value = val;
          document.body.appendChild(oInput);
          oInput.select(); // 选择对象
          document.execCommand("Copy"); // 执行浏览器复制命令
          document.body.removeChild(oInput);
          var orderNumbers = document.getElementsByClassName("orderNumber")[0];
          var alertDiv = document.createElement("div");
          alertDiv.id="layers";
          alertDiv.innerHTML="复制成功";
            var style={
                width: "2rem",
                height: ".8rem",
                backgroundColor: "rgba(0,0,0,0.2)",
                color: "#fff",
                position: "absolute",
                left: "4rem",
                bottom: ".2rem",
                textAlign: "center",
                lineHeight: ".8rem",
                borderRadius: ".8rem",
            }
            for(var i in style)
                alertDiv.style[i]=style[i];
            if(document.getElementById("layers")==null){
                orderNumbers.appendChild(alertDiv);
                //setTimeout("orderNumbers.removeChild(alertDiv)",1000);
                setTimeout(function(){
                  orderNumbers.removeChild(alertDiv);
                },1500);
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
          let self = this;
          self.$ajax({
            method: 'post',
            url:self.$apiGoods + 'goodsSearch/goodsRecommendationList',
            params: {
              page: pageNum,
              rows: pageSize
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            successCallback&&successCallback(response.data.data);//成功回调
          })
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
  .goodsReceipt,
  .pickUpGoods{
    background-color: #fff;
    padding: .3rem;
    color: rgb(153,153,153);
  }
  .goodsReceipt .consignee,
  .pickUpGoods .consignee{
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
    font-size: .4rem;
    color: rgb(244,0,87);
  }
  .center{
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
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
    width: 100%;
    margin-left: .3rem;
  }
  .center .goodsDetails .wrapAttr{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .center .goodsDetails .wrapAttr .left{
    display: flex;
  }
  .center .goodsDetails .words{
    font-size: .35rem;
  }
  .center .goodsDetails .property{
    margin-top: .1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .property span.color{
    margin-right: .3rem;
  }
  .center .goodsDetails .amount{
    margin-top: .15rem;
    margin-left: .5rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .price{
    margin-top: .05rem;
    font-size: .35rem;
    color: rgb(244,0,87);
  }
  .center .goodsDetails .wrapBtn{
    margin-top: .8rem;
    display: flex;
    justify-content: flex-end;
  }
  .center .goodsDetails .btn{
    width: 1.8rem;
    height: .7rem;
    border-radius: .8rem;
    border: 1px solid rgb(153,153,153);
    text-align: center;
    line-height: .7rem;
    font-size: .35rem;
    margin-left: .3rem;
  }
  .moreThen{
    width: 1rem;
    height: .7rem;
    border-radius: .8rem;
    text-align: center;
    line-height: .7rem;
    font-size: .35rem;
    position: relative;
  }
  .moreThen .moreBtn{
    z-index: 200;
    position: absolute;
    left:-.7rem;
    top:.65rem;
    background-color: rgb(153,153,153);
    color: #fff;
    display: none;
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
    line-height: .75rem;
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
    display: flex;
    justify-content: flex-end;
    background-color: #fff;
  }
  .fixedBtn div{
    width: 2.3rem;
    height: 1rem;
    border-radius: 1rem;
    text-align: center;
    line-height: 1rem;
    font-size: .4rem;
    margin: .2rem .3rem .2rem 0;
  }
  .fixedBtn .leftBtn{
    color: rgb(161,161,161);
    border: 1px solid rgb(161,161,161);
  }
  .fixedBtn .rightBtn{
    color: #fff;
    border: 1px solid rgb(244,0,87);
    background-color: rgb(244,0,87);
  }
  /*底部的两个按钮--结束*/
  /*提货码弹出框--开始*/
  .pickUpNum{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.2);
    z-index: 200;
  }
  .pickUpNum .alertFrame{
    width: 5rem;
    height: 3rem;
    background-color: #fff;
    border-radius: .3rem;
    margin: 3rem auto 0;
  }
  .pickUpNum .alertFrame .topDiv{
    height: .8rem;
    font-size: .4rem;
    line-height: .8rem;
    text-align: center;
  }
  .pickUpNum .alertFrame .contDiv{
    color: rgb(244,0,87);
    line-height: 1.2rem;
    font-size: .4rem;
    text-align: center;
    padding-bottom: .2rem;
  }
  .pickUpNum .alertFrame .bottomDiv{
    font-size: .4rem;
    border-top: 1px solid rgb(180,180,180);
    text-align: center;
    color: rgb(244,0,87);
    line-height: .8rem;
  }
  /*提货码弹出框--结束*/
</style>
