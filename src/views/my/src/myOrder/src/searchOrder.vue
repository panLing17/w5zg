<template lang="pug">
  .wrapNav
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="backTo()")
      .topCenter(slot="center")
        .searchInput
          img(src="../../../../../assets/img/searchInput搜索图标@2x.png" @click="searchGoodsName()")
          input(:type="type", placeholder="请输入商品名称" v-model="msg" @keyup.enter="searchGoodsName()")
          .clear(@click="clearName()") x
      .topRight(slot="right")
        .topRight(slot="right" @click="backTo()") 取消
    .searchOrder.mescroll#searchOrderMescroll
      .history(v-show="showHistory")
        ul.top
          li.left 历史搜索
          li.right(@click="clearHistory()")
            img(src="../../../../../assets/img/searchHistory_clear.png") 
        ul.cont(v-if="flag")
          li(v-for="(item,index) in record1" @click="change1($event,index)" :class="{active:selected1==index}") {{item.gsr_keywords}}
        .empty(v-else="flag") 暂无搜索历史
      .searchRel(v-show="showRel") 没有搜索到此订单  
      .wrapContent(v-show="showOrder")  
        .content(v-for="(item,index) in orderDetail")
          .top
            .left
              span.orderNum 订单编号:
              span.num {{item.total_order_no}}
            .right#states {{item.orderStatus}}  
          .center(@click="$router.push({path:'/my/orderDetails',query:{state:item.order_status,from:'搜索订单',orderId:item.total_order_id,totalNum:item.totalCount,orderNo:item.total_order_no}})" :class="{centerZ:item.logoList.length<=1}")
            .image
              img(:src="items | img-filter" v-for="items in item.logoList")
            .goodsDetails(v-show="item.logoList.length<=1")
              .goodsExplain
                span.words(v-for="val in item.goodsName") {{val}}
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
            .cancel(@click="buttonLeft($event,item.total_order_id)" v-show="item.buttonL !== '删除订单' && item.buttonL !== '提醒发货' && item.buttonL !== '物流信息' && item.buttonL !== '申请退款' && item.buttonL !== '取消申请'") {{item.buttonL}}
            .pay(@click="buttonRight($event,item.total_order_id,item.oi_pay_price)" :class="{a:item.order_status !== '待付款'}" v-show="item.buttonR !== '再次购买' && item.buttonR !== '确认收货' && item.buttonR !== '物流信息' && item.buttonR !== '提货码' && item.buttonR !== '取消申请'") {{item.buttonR}}
      .title(v-show="recommendFlag")
        .line
        p 推荐
      w-recommend#dataId(:listData="recommendGoods" v-show="recommendFlag")
      .bottomPlaceholder(v-show="recommendFlag")        
</template>

<script>
    export default {
      name: "searchOrder",
      data(){
        return{
          recommendFlag:true, //判断推荐的显隐
          recommendGoods:[], //推荐商品的数组
          showRel:"", //判断搜索的结果有无来让其显隐
          showOrder:false, //让搜索出来的结果订单的列表显隐
          nameShowFlag:false, //让用户搜索后的名称显示在输入框
          showHistory:true, // 判断历史搜索记录的显隐
          selected1:0, //历史搜索的让其等于索引值
          msg:"", //输入框内的用于搜索商品的名称
          flag:true, //显示搜索记录
          record1:[], //历史搜索
          orderDetail:[], //请求后的数据商品的订单列表放入这里
        }
      },
      props: {
        type: {
          type: String,
          default: 'text'
        },
        placeholder: {
          type: String,
          default: 'placeholder'
        }
      },
      created(){

      },
      mounted(){
        //加载历史搜索
        this.searchHistory();
        //加载上拉加载的订单列表
        this.$mescrollInt("searchOrderMescroll",this.upCallback);
        //加载搜索到的订单列表
        //this.request();
        //从详情返回时的执行
        this.judgeUrl();
        //加载推荐商品
        this.getListDataFromNets();
      },
      methods:{
        //判断页面回退
        backTo(){
          if (this.$route.query.name) {
            this.$router.push('/my/orderManage');
          } else {
            this.$router.go(-1);
          }
        },  
        //判断此时的url
        judgeUrl(){
          if (this.$route.query.name) {
            this.msg = this.$route.query.name;
            this.searchGoodsName();
          }
        },
        //历史搜索
        searchHistory(){
          let self = this;
          self.$ajax({
            method:"get",
            url:self.$apiTransaction + "orderSearchRecord/orderSearchList",
            params:{},
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function(res){
            self.record1 = res.data.data;
            if (self.record1 == "") {
              self.flag = false;
            }
            var removeElement = function(arr, elm) {
              for(var i=0; i< arr.length; i++) {
                if(arr[i].gsr_keywords==elm) {
                    arr.splice(i,1);
                    i--;
                }
              }
              return arr
            };
            var arr = self.record1;
            console.log(removeElement(arr,"")); // [2, 3, 7, 9]
            console.log(self.record1);
          })
        },
        //按商品名称搜索生成订单
        searchGoodsName(){
          //让搜索到的订单列表显示
          //this.showOrder = true; 
          //让历史搜索记录隐藏
          //this.showHistory = false;
          //给url上拼一个搜索结果
          this.$router.push({path:'/my/searchOrder',query:{name:this.msg}});
          //加载订单列表
          this.request();
        },
        //点击改变历史搜索的样式,还按照点击的文字进行搜索
        change1(e,index){
          this.selected1 = index;
          //让输入框中显示用户选择的文字
          this.msg = e.target.innerHTML;
          //给url上拼一个搜索结果
          this.$router.push({path:'/my/searchOrder',query:{name:this.msg}});
          //点击选择的历史搜索记录后直接进行搜索
          this.request();
          //点击搜索后让历史搜索隐藏
          //this.showHistory = false;
        },
        //删除搜索框中用户输入的内容
        clearName(){
          //订单列表隐藏
          this.showOrder = false;
          //输入框中的文字被清除
          this.msg = "";
          //搜索历史记录显示
          this.showHistory = true;
          //让搜索不到的结果隐藏
          this.showRel = false;
          //重新请求获取历史记录
          this.searchHistory();
          //推荐内容显示
          this.recommendFlag = true;
        },
        //清除历史搜索记录
        clearHistory(){
          let self = this;
          self.$ajax({
            method:"delete",
            url:self.$apiTransaction + "orderSearchRecord/delOrderSearch",
            params:{},
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function(res){
            console.log(res);
            self.searchHistory();
          })
        },
        //点击每个订单下方的左边按钮
        buttonLeft(e,orderId){
          if (e.target.innerHTML == "取消订单") {
            let self = this;
            self.$ajax({
              method:"patch",
              url:self.$apiTransaction + "order/cancel/" + orderId,
              params:{},
              headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).then(function(res){
              self.request();
            })
          }
        },
        //点击每个订单下方的右边按钮
        buttonRight(e,orderId,payPrice){
          if (e.target.innerHTML == "支付") {
            this.$router.push({
              path:'/payment',
              query:{
                id: orderId,
                price: payPrice
              }
            })
          }
        },
        //下拉加载页面
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
            url:self.$apiTransaction + 'order/orderSearch',
            params: {
              goodsName: self.msg,
              page: pageNum,
              rows: pageSize
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            console.log(response.data.data);
            var arr = response.data.data;
            for (var i=0; i<arr.length; i++) {

              if (arr[i].order_status == "待付款") {
                arr[i].buttonL = "取消订单";
                arr[i].buttonR = "支付";
                arr[i].orderStatus = "待付款";
              }
              if (arr[i].order_status == "待收货/待提货") {
                if (arr[i].delivery_ways == "自提") {
                  arr[i].buttonL = "申请退款";
                  arr[i].buttonR = "提货码";
                  arr[i].orderStatus = "待提货";
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
            successCallback&&successCallback(response.data.data);//成功回调
          })
        },

        //请求
        request(){
          let self = this;
          self.$ajax({
            method: 'post',
            url:self.$apiTransaction + 'order/orderSearch',
            params:{
              goodsName: self.msg,
              page: 1,
              rows: 10
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function(response){
            self.orderDetail = response.data.data;
            if (self.orderDetail.length <= 0) {
              self.showOrder = false;
              self.showHistory = false;
              self.showRel = true;
              self.recommendFlag = true;
            } else{
              self.recommendFlag = false;
              self.showOrder = true;
              self.showHistory = false;
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
                    self.orderDetail[i].orderStatus = "待提货";
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
            }
            
          })
        },

        //推荐商品的请求
        // upCallback: function(page) {
        //   let self = this;
        //   this.getListDataFromNet(page.num, page.size, function(curPageData) {
        //     if(page.num === 1) self.recommendGoods = []
        //     self.recommendGoods = self.recommendGoods.concat(curPageData)
        //     self.mescroll.endSuccess(curPageData.length)
        //   }, function() {
        //     //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        //     self.mescroll.endErr();
        //   })
        // },
        getListDataFromNets(pageNum,pageSize,successCallback,errorCallback) {
          let self = this;
          self.$ajax({
            method: 'post',
            url:self.$apiGoods + 'goodsSearch/goodsRecommendationList',
            params: {
              page: 1,
              rows: 5
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            //successCallback&&successCallback(response.data.data);//成功回调
            self.recommendGoods = response.data.data;
          })
        },

      }
    }
</script>

<style scoped>
/*没有搜索到此订单的样式--开始*/
.searchRel{
  padding: .5rem .3rem 0;
  text-align: center;
  font-size: .4rem;
}
/*没有搜索到此订单的样式--结束*/
.active{
  color: rgb(244,0,87) !important;
}
.a{
  background-color: #fff !important;
  color: rgb(244,0,87) !important;
}
#searchOrderMescroll{
  top: 1.3rem;
  bottom: 0;
  height: auto;
  position: fixed;
}
.searchOrder{
  width: 100%;
  position: absolute;
  z-index: 100;
  min-height: 100vh;
  background-color: rgb(242,242,242);
  /*margin-top: 1.3rem;*/
}
.active{
  color: #fff !important;
  background-color: rgb(255,128,171) !important;
}
.topRight{
  color: rgb(245,0,87);
  font-size: .45rem;
  font-weight: 400;
}
/*搜索框样式--开始*/
.searchInput{
  width: 6.5rem;
  height: .9rem;
  background-color: rgb(238,238,238);
  border-radius: .9rem;
  line-height: .9rem;
  position: relative;
}
.searchInput img{
  width: .4rem;
  vertical-align: middle;
  margin-left: .2rem;
}
.searchInput input{
  width: 80%;
  border: 0;
  outline: none;
  font-size: .3rem;
  margin-left: .1rem;
  background-color: rgb(238,238,238);
}
/*搜索框样式--结束*/
/*历史搜索--开始*/
.history{
  padding: 0 .3rem;
}
.history ul.top{
  display: flex;
  justify-content: space-between;
  margin-top: .6rem;
}
.history ul.top li.left{
  font-size: .4rem;
  color: rgb(51,51,51);
}
.history ul.top li.right img{
  width: .55rem;
}
.history ul.cont{
  margin-top: .1rem;
  padding: 0 .5rem;
}
.history ul.cont li{
  display: inline-block;
  width: auto;
  padding: .2rem .3rem;
  background-color: rgb(242,242,242);
  border-radius: .25rem;
  margin-right: .2rem;
  margin-top: .45rem;
  color: rgb(51,51,51);
}
.empty{
  width: 100%;
  text-align: center;
}
/*搜索后的名称显示在搜索框内*/
.nameShow{
  position: absolute;
  top: .05rem;
  left: .7rem;
  display: inline-block;
  height: .8rem;
  padding: 0 .2rem;
  border-radius: .8rem;
  background-color: rgb(210,210,210);
  z-index: 100;
  font-size: .3rem;
  font-weight: 400; 
}
/*搜索框中的删除按钮*/
.clear{
  position: absolute;
  top: 0;
  right: .3rem;
  font-size: .5rem;
  color: rgb(244,0,87);
}
/*历史搜索--结束*/
/*搜索后的结果订单展示--开始*/
.content{
  margin-top: .3rem;
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
}
.center .goodsExplain{
  padding-left: .1rem;
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
  font-size: .3rem;
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
/*搜索后的结果订单展示--结束*/

/*推荐*/
.title{
  height: .8rem;
  width: 100%;
  position: relative;
  display: flex;
  background: #f2f2f2;
  justify-content: center;
  align-items: center;
  margin-top: .3rem;
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
</style>
