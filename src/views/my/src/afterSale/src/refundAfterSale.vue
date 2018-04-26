<template lang="pug">
  .refundAfterSale
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 退款/售后
      .topRight(slot="right")
        <!--img(src="../../../../../assets/img/searchInput搜索图标@2x.png").search-->
        img(src="../../../../../assets/img/msg_0.png").msg
    .orderStatus
      ul.wrapStatus
        li.status(v-for="(item,index) in status" @click="statusChange(index)" :class="{active:index===statusActive}") {{item}}
        li.line(:style="{left:statusActive*25+'%'}")
    .mescroll#saleMescroll
      .contentWrapper(ref="contentWrapper")
        .content(v-for="(item,index) in orderDetail", v-if="!isEmpty")
          .top
            .left
              span.orderNum 订单号:
              span.num {{item.reject_num}}
            .right#state {{item.gr_status | statusFilter}}
          div(v-for="(info, index) in item.rejectedDetail")
            .center
              .image
                img(:src="info.logo | img-filter")
              .goodsDetails
                  .words {{info.goods_name}}
                  .property
                    span(v-for="i in info.spec_json") {{i.gspec_value}}
                  .amount x
                    span {{info.gr_num}}
            .bottom
              .left
                .returnState {{item.gr_status | decFilter(item.reject_way)}}
              .right
                .button
                  .cancel(v-if="item.gr_status ==='审核中' || item.gr_status === '待发货'", @click.stop="confirm(item.id)") 取消退款
                  .cancel(@click.stop="$router.push({path: '/my/express',query: {id: item.id}})", v-if="item.gr_status==='待发货'&&item.reject_way!=='门店退货'") 发货
                  .pay( @click.stop="$router.push({path: '/my/returnDetails', query: {id:item.id, detailId:info.order_detail_id}})") 查看详情
    .noData(v-if="isEmpty")
      img(src="../../../../../assets/img/1@2x.png")
</template>

<script>
    export default {
      name: "refundAfterSale",
      data(){
        return{
          statusActive: 0,
          status:["全部","申请中","退款中","已完成"],
          orderDetail:[],
          cancelId:''
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
      filters: {
        statusFilter (value) {
          let text = ''
          if (value === '审核中') {
            text = '申请中'
          }else if(value === '待发货' || value === '卖家待收货') {
            text = '退款中'
          } else if(value === '已完成' || value==='审核拒绝') {
            text = '已完成'
          }
          return text
        },
        decFilter (value,way) {
          if (value === '待发货') {
            if (way!='门店退货') {
              return value
            }else {
              return '买家请退货至门店'
            }
          }else {
            return value
          }

        }
      },
      created(){

      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
        this.mescroll.destroy();
      },
      mounted(){
        // 获取数据
        this.$mescrollInt("saleMescroll",this.upCallback);
      },
      methods:{
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
          let form = {
            page: pageNum,
            rows: pageSize,
            status: this.statusActive+''
          }
          self.$ajax({
            method: 'post',
            url:this.$apiTransaction + 'goodsRejected/rejectedList',
            params: form,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            if (response.data.code === '081') {
              successCallback&&successCallback(response.data.data);//成功回调
            }else {
              self.mescroll.hideTopBtn();
              self.mescroll.endErr();
            }
          })
        },
        statusChange (index) {
          this.statusActive = index
          this.mescroll.scrollTo( 0, 300 );
          this.mescroll.destroy();
          this.$mescrollInt("saleMescroll",this.upCallback);
        },
        confirm (id) {
          this.cancelId = id
          this.$confirm({
            title: '取消退款',
            message: '确定取消退款申请吗？',
            confirm:this.cancel,
            noConfirm: function () {}
          })
        },
        // 取消退货
        cancel () {
          let _this = this
          this.$ajax({
            method: 'post',
            url:this.$apiTransaction + 'goodsRejected/cancelRejectedOrder',
            params: {
              rejectedTotalId: this.cancelId
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            if (response.data.code === '081') {
              _this.$message.success('取消成功！')
              _this.mescroll.resetUpScroll( true )
            }else {
              _this.$message.error(response.data.msg)
            }
          })
        }
      }
    }
</script>

<style scoped>
  .mescroll {
    position: fixed;
    top: 2.3rem;
    bottom: 0;
    height: auto;
  }
  .active{
    color: rgb(244,0,87) !important;
  }
  .a{
    background-color: #fff !important;
    color: rgb(244,0,87) !important;
  }
  .refundAfterSale{
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
  }
  .orderStatus ul.wrapStatus{
    display: flex;
    position: relative;
  }
  .orderStatus ul.wrapStatus li.status{
    line-height: 1rem;
    font-size: .4rem;
    color: rgb(153,153,153);
    flex: 1;
    text-align: center;
  }
  /*订单的状态--结束*/
  /*订单内容--开始*/
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
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    display: flex;
    height: 2.92rem;
    overflow: hidden;
    position: relative;
  }
  .center .image{
    flex: none;
  }
  .center .image img{
    width: 2.32rem;
    height: 2.32rem;
    border-radius: .2rem;
    margin-right: .3rem;
  }
  .center .goodsDetails{
    margin-left: .3rem;
    flex: 1;
    height: 100%;
    position: relative;
  }
  .center .goodsDetails .words{
    font-size: .35rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .center .goodsDetails .property{
    margin-top: .1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .property span{
    margin-right: .3rem;
  }
  .center .goodsDetails .amount{
    position: absolute;
    font-size: .35rem;
    color: rgb(153,153,153);
    bottom: 0;
    left: 0;
  }
  .bottom{
    background-color: #fff;
    padding: .2rem .2rem .2rem 0;
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
  .bottom .left .returnState{
    font-size: .4rem;
    color: rgb(244,0,87);
    line-height: 1rem;
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
  .bottom .right .button{
    display: flex;
    justify-content: space-around;
  }
  .bottom .right .button div{
    width: 2rem;
    height: .8rem;
    border-radius: .8rem;
    text-align: center;
    line-height: .8rem;
    font-size: .4rem;
  }
  .bottom .right .button .cancel{
    color: rgb(161,161,161);
    border: 1px solid rgb(161,161,161);
    margin-right: .3rem;
  }
  .bottom .right .button .pay{
    color: rgb(244,0,87);
    border: 1px solid rgb(244,0,87);
    background-color: #fff;

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
  }
  .noData img {
    width: 3.56rem;
  }
  .line {
    width: 25%;
    height: .053rem;
    background: rgb(245,0,87);
    position: absolute;
    bottom: 0;
    transition: all 0.5s;
  }
</style>
