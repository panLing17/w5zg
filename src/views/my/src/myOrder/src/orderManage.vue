<template lang="pug">
  .wrapNav
    nav-bar(background="#F70057")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/ic_order_return.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 订单管理
      .topRight(slot="right")
        img(src="../../../../../assets/img/searchInput搜索图标@2x.png" @click="jumpToSearch()" v-if="false").search
        img(src="../../../../../assets/img/msg_0.png" v-show="false").msg
    .orderStatus
      ul.wrapStatus
        li(v-for="(item,index) in status" @click="check(item,index)" :class="{active:index == num, underLine:index == num}").status {{item}}
        .lineDiv
    .orderManage.mescroll#orderManageMescroll
      transition(name="slide-fade")
        .wrapContent(v-if="contentFlag")
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
                      strong.priceNum {{item.oi_total_price | price-filter}}
            .button
              .cancel(@click="buttonLeft($event,item.total_order_id)" v-show="item.buttonL !== '再次购买' && item.buttonL !== '提醒发货' && item.buttonL !== '申请退款' && item.buttonL !== '物流信息' && item.buttonL !== '取消申请'") {{item.buttonL}}
              .pay(@click="buttonRight($event,item.total_order_id,item.oi_pay_price)" :class="{a:item.order_status !== '待付款'}" v-show="item.buttonR !== '删除订单' && item.buttonR !== '再次购买' && item.buttonR !== '确认收货' && item.buttonR !== '物流信息' && item.buttonR !== '提货码' && item.buttonR !== '物流信息' && item.buttonR !== '取消申请'") {{item.buttonR}}
      .noData(v-if="isEmpty")
        img(src="../../../../../assets/img/emptyOrder.png")
    cancel-reason(:shows = 'shows', @close = 'closes', :totalId = 'totalOrderId', @cancelSuc = 'cancelSuc')
</template>

<script>
  import {mapState} from 'vuex'
  import CancelReason from "./cancelReason";
  export default {
      name: "orderManage",
      components: {CancelReason},
      data(){
        return{
          totalOrderId: '',
          shows: false,
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
          buttonR:"",
          contentFlag:"", //控制所有订单内容的显隐
        }
      },
      computed: {
        // 判断数据是否为空
        isEmpty () {
          if (this.orderDetail == null || this.orderDetail.length === 0) {
            return true;
          }
          return false;
        },
        ...mapState(['position']),
      },
      created(){

      },
      activated () {
        this.position.forEach((now) => {
          if (now.path === this.$route.path) {
            this.mescroll.scrollTo(now.y, 0);
          }
        })
      },
      mounted(){
        this.keepStatus();
        this.$mescrollInt("orderManageMescroll",this.upCallback,()=>{

          }, (obj) => {
            this.$store.commit('setPosition', {
              path: this.$route.path,
              y: obj.preScrollY
            })
        });

      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
        this.mescroll.destroy();
      },
      methods:{
        // 取消订单成功
        cancelSuc() {
          this.mescroll.resetUpScroll()
          this.$message.success('取消成功！')
          this.shows = false
        },
        closes(){
          this.shows = false
        },
        //当无订单时，将end去掉
        emptys(){
          let mescrollUpwarp = document.getElementsByClassName("mescroll-upwarp")[0];
           mescrollUpwarp.style.visibility = "hidden";
        },
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

        //点击tab切换
        check(item,index){
          this.contentFlag = false;
          this.num = index;
          let lineDiv = document.getElementsByClassName("lineDiv")[0];
          lineDiv.style.transition = "all .5s";
          if (item === "全部") {
            this.state = "";
            lineDiv.style.left = 0;
            this.$router.replace({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          if (item === "待付款") {
            this.state = 1;
            lineDiv.style.left = "20%";
            this.$router.replace({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          if (item === "待发货") {
            this.state = 2;
            lineDiv.style.left = "40%";
            this.$router.replace({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          if (item === "待收货") {
            this.state = 4;
            lineDiv.style.left = "60%";
            this.$router.replace({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          if (item === "已完成") {
            this.state = 3;
            lineDiv.style.left = "80%";
            this.$router.replace({path:'/my/orderManage',query:{nums:index,states:this.state,lefts:lineDiv.style.left}});
          }
          this.mescroll.resetUpScroll();
        },
        //保持状态判断
        keepStatus(){
          let lineDiv = document.getElementsByClassName("lineDiv")[0];
          lineDiv.style.transition = "all .5s";
          if (this.$route.query.id) {
            if (this.$route.query.id == 1) {
              this.num = 1;
              this.state = 1;
              lineDiv.style.left = "20%";
            }
            if (this.$route.query.id == 2) {
              this.num = 2;
              this.state = 2;
              lineDiv.style.left = "40%";
            }
            if (this.$route.query.id == 3) {
              this.num = 3;
              this.state = 4;
              lineDiv.style.left = "60%";
            }
            if (this.$route.query.id == 4) {
              this.num = 4;
              this.state = 3;
              lineDiv.style.left = "80%";
            }
          } else {
            if (this.$route.query.nums == undefined) {
              this.num = 0;
            } else{
              this.num = this.$route.query.nums;
            }
            this.state = this.$route.query.states;
            lineDiv.style.left = this.$route.query.lefts;
          }
        },
        //判断两个按钮上的文字
        buttonLeft(e,id){
          if (e.target.innerText === "物流信息") {
            this.$router.push('/my/checkLogistics');
          }
          if (e.target.innerText === "取消订单") {
            this.shows = true
            this.totalOrderId = id
          }
          if (e.target.innerText === "删除订单") {
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
                  self.mescroll.resetUpScroll();
                  if (res.data.code === '186') {
                    self.$message('此商品存在退货情况！')
                  }
                  if (res.data.code === '081') {
                    self.$message.success('删除成功！');
                  }

                })
              },
              noConfirm: () => {

              }
            })
          }

        },
        buttonRight(e,id,price){
          if (e.target.innerText === "物流信息") {
            this.$router.push('/my/checkLogistics');
          }
          if (e.target.innerText === "支付") {
            this.$router.push({
              path:'/payment',
              query:{
                id:id,
                price:price
              }
            })
          }
          if (e.target.innerText === "再次购买") {

          }
          if (e.target.innerText === "确认收货") {
            let self = this;
            self.$ajax({
              method:"patch",
              url:self.$apiTransaction + "order/confirmTakeGood/"+id,
              params:{}
            }).then(function(res){
              self.mescroll.resetUpScroll();
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
            self.contentFlag = true;
            var arr = response.data.data;
            for (var i=0; i<arr.length; i++) {
              if (arr[i].order_status === "（退货）售后") {
                arr[i].buttonL = "取消申请";
                arr[i].buttonR = "取消申请";
                arr[i].orderStatus = "（退货）售后";
              }
              if (arr[i].order_status === "待付款") {
                arr[i].buttonL = "取消订单";
                arr[i].buttonR = "支付";
                arr[i].orderStatus = "待付款";
              }
              if (arr[i].order_status === "待收货/待提货") {
                if (arr[i].delivery_ways === "自提") {
                  arr[i].buttonL = "申请退款";
                  arr[i].buttonR = "提货码";
                  arr[i].orderStatus = "待自提";
                }
                if (arr[i].delivery_ways === "快递配送") {
                  arr[i].buttonL = "物流信息";
                  arr[i].buttonR = "确认收货";
                  arr[i].orderStatus = "待收货";
                }
              }
              if (arr[i].order_status === "待发货/待备货") {
                if (arr[i].delivery_ways === "自提") {
                  arr[i].buttonL = "申请退款";
                  arr[i].buttonR = "提货码";
                  arr[i].orderStatus = "待备货";
                }
                if (arr[i].delivery_ways === "快递配送") {
                  arr[i].buttonL = "提醒发货";
                  arr[i].buttonR = "物流信息";
                  arr[i].orderStatus = "待发货";
                }
              }
              if (response.data.data[i].order_status === "已取消") {
                arr[i].buttonL = "删除订单";
                arr[i].buttonR = "再次购买";
                arr[i].orderStatus = "已取消";
              }
              if (response.data.data[i].order_status === "已完成") {
                arr[i].buttonL = "取消申请";
                arr[i].buttonR = "再次购买";
                arr[i].orderStatus = "已完成";
              }
            }
            successCallback&&successCallback(arr);//成功回调
          })
        },
      }
    }
</script>

<style scoped>
  #orderManageMescroll{
    top: 2.2rem;
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
    padding-top: .3rem;
  }
  .topCenter{
    font-size: .5rem;
    font-weight: 400;
    color: #fff;
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
    position: fixed;
    top: 1.29rem;
    left: 0;
    right: 0;
    z-index: 200;
    border-top: 1px solid #f2f2f2;
    border-bottom: 1px solid #f2f2f2;
  }
  .orderStatus ul.wrapStatus{
    display: flex;
    justify-content: space-between;
  }
  .orderStatus ul.wrapStatus li.status{
    line-height: 1rem;
    font-size: .4rem;
    color: rgb(153,153,153);
    flex: 1;
    text-align: center;
  }
  .lineDiv{
    width: 20%;
    height: 2px;
    background-color: rgb(244,0,87);
    position: absolute;
    left: 0;
    bottom: 0;
  }
  /*订单的状态--结束*/
  /*订单内容--开始*/
  .content{
    margin-bottom: .3rem;
    box-shadow: 1px 1px 10px #e1e1e1;
  }
  .content .top{
    height: .8rem;
    border-bottom: 1px solid rgb(242,242,242);
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .3rem;
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
    align-items: center;
  }
  .centerZ{
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    white-space: normal !important;
    display: flex;
  }
  .center .image{
    width: 2.5rem;
  }
  .center .image img{
    width: 2.5rem;
    border-radius: .2rem;
  }
  .center .image img:nth-child(n+2){
    margin-left: .2rem;
  }
  .center .goodsDetails{
    width: 0;
    flex-grow: 1;
    padding-left: .2rem;
  }
  .center .goodsExplain{
    width: 100%;
  }
  .center .goodsExplain .words{
    font-size: .37rem;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
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
    z-index: 205;
  }
  .noData img{
    width: 4rem;
  }

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .6s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to{
    opacity: 0;
  }
</style>
