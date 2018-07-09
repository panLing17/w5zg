<template lang="pug">
  .checkLogistics.mescroll#logisticsMescroll
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 查看物流
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png" v-show="false").msg
    .content
      .center
        .image
          img(:src="goodsPics | img-filter")
        .goodsExplain
          .words {{goodsStatus}}
          .express(v-if="companyFlag") {{goodsStatus!='暂无信息'?CourierName:CourierName2}}： {{goodsStatus!='暂无信息'?number:number2}}
          .contactWay(v-if="false") 官方联系: {{phone}}
    .logisticsAddress
      img(src="../../../../../assets/img/citySearch@2x.png")
      .address
        span 收货地址:
        strong {{address}}
    .logisticsMsg
      .emptyMsg(v-if="logisticsFlag") 对不起，暂无快递物流信息
      ul(v-else="logisticsFlag")
        li(v-for="(item,index) in states")
          .time
            span.wrap
              span {{item.time}}
          .messages
            span.state {{item.status}}
            img(src="../../../../../assets/img/now@2x.png" v-if="index==0")
            img(src="../../../../../assets/img/past@2x.png" v-else="index==0")
    .packDrop(@click="packDrop()" v-show="false")
      span {{packDrops}}
      img(src="../../../../../assets/img/pack.png")
    .title(v-show="recommendFlag")
      img(src="../../../../../assets/img/recommend.png")
    recommend#dataId(ref="recommend")
    .bottomPlaceholder
</template>

<script>
  import {mapState} from 'vuex'
  import recommend from './recommend'
  export default {
      name: "checkLogistics",
      components:{recommend},
      data(){
        return{
          companyFlag:"", // 物流公司名称显隐
          logisticsFlag:"", //物流信息显隐
          recommendFlag:true, //判断推荐的显隐
          goodsPics:this.$route.query.goodsPic, //商品的图片
          address:this.$route.query.address, //接收订单详情页面的地址
          ordertype:321, //订单类型
          sonOrder:this.$route.query.orderId, //子订单id
          goodsStatus:"", //货物的状态
          phone:"", //官方联系电话
          number:"", //快递的编号
          CourierName:"", //快递名字
          packDrops:"点击收起详情",
          recommendGoods: [],
          states:[],
          CourierName2:"", //快递名字2
          number2:"", //快递的编号2
        }
      },
      computed: mapState(['position']),
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
        this.$mescrollInt("logisticsMescroll",this.upCallback,()=>{
          this.position.forEach((now) => {
              if (now.path === this.$route.path) {
                this.mescroll.scrollTo(now.y, 0);
              }
            })
          }, (obj) => {
            this.$store.commit('setPosition', {
              path: this.$route.path,
              y: obj.preScrollY
            })
        });
        //加载执行
        this.execute();
        //判断是商品订单还是退货订单
        this.judgeOrderType();
      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
        this.mescroll.destroy();
      },
      methods:{
        // 锁定或者解锁上拉加载
        lockUpDown (isLock) {
          this.mescroll.lockUpScroll(isLock);
        },
        //判断是商品订单还是退货订单
        judgeOrderType(){
          if (true) {
            this.ordertype = 321;
          }else{
            this.ordertype = 322;
          }
        },
        //加载时执行
        execute(){
          let self = this;
          self.$ajax({
            method:"get",
            url:self.$apiMember + "orderLogistics/info",
            params:{orderId:self.sonOrder,orderType:self.ordertype}
          }).then(function(res){
            self.companyFlag = true;
            if (res.data.data.status == "205") {
              self.logisticsFlag = true;
              self.secondRequest();
            }
            if (res.data.data.status == "201") {
              self.logisticsFlag = true;
              self.companyFlag = false;
            }
            self.CourierName = res.data.data.result.expName;
            self.number = res.data.data.result.number;
            self.phone = res.data.data.result.expPhone;
            self.states = res.data.data.result.list;
            if (res.data.data.result.deliverystatus == 3) {
              self.goodsStatus = "已签收";
            }
            if (res.data.data.result.deliverystatus == 2) {
              self.goodsStatus = "正在派件";
            }
            if (res.data.data.result.deliverystatus == 1) {
              self.goodsStatus = "在途中";
            }
            if (res.data.data.result.deliverystatus == 4) {
              self.goodsStatus = "派送失败";
            }
            console.log(res.data.data.result == "")
            if (res.data.data.result == "") {
              self.goodsStatus = "暂无信息";
            }
          })
        },
        //在无物流信息时执行
        secondRequest(){
          let self = this;
          self.$ajax({
            method:"get",
            url:self.$apiMember + "orderLogistics/info/common",
            params:{orderId:self.sonOrder,orderType:self.ordertype}
          }).then(function(res){
            console.log(res.data.data);
            self.CourierName2 = res.data.data.ul_company_name;
            self.number2 = res.data.data.ul_number;
          })
        },
        //点击收起
        packDrop(){
          if (this.packDrops == "点击收起详情") {
            var logisticsMsg = document.getElementsByClassName("logisticsMsg")[0];
            logisticsMsg.style.height = "1.5rem";
            logisticsMsg.style.overflow = "hidden";
            logisticsMsg.style.transition = "all 1s";
            this.packDrops = "点击查看更多详情";
          }else{
            var logisticsMsg = document.getElementsByClassName("logisticsMsg")[0];
            logisticsMsg.style.height = "100%";
            logisticsMsg.style.transition = "all 1s";
            this.packDrops = "点击收起详情";
          }
        },

        upCallback: function(page) {
          let self = this;
          this.getListDataFromNet(page.num, page.size, function(curPageData) {
            // if(page.num === 1) self.recommendGoods = []
            // self.recommendGoods = self.recommendGoods.concat(curPageData)
            self.$refs.recommend.more(curPageData,page.num,page.size)
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
  .active{
    color: rgb(244,0,87) !important;
  }
  .a{
    background-color: #fff !important;
    color: rgb(244,0,87) !important;
  }
  .checkLogistics{
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
  /*订单内容--开始*/
  .content{
  }
  .center{
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    display: flex;
  }
  .center .image img{
    width: 2.5rem;
    border-radius: .2rem;
    margin-right: .3rem;
  }
  .center .goodsExplain{
    padding: .2rem 0 0 .3rem;
    width: 100%;
  }
  .center .goodsExplain .words{
    font-size: .45rem;
    color: rgb(244,0,87);
  }
  .center .goodsExplain .express,
  .center .goodsExplain .contactWay{
    margin-top: .3rem;
    color: rgb(153,153,153);
    font-size: .38rem;
  }
  /*订单内容--结束*/
  /*物流地址--开始*/
  .logisticsAddress{
    background-color: #fff;
    margin-top: .2rem;
    display: flex;
    justify-content: flex-start;
    text-align: center;
    padding: .4rem .3rem;
  }
  .logisticsAddress img{
    width: .25rem;
    height: .35rem;
  }
  .logisticsAddress .address{
    margin-top: -.1rem;
    margin-left: .2rem;
    font-size: .4rem;
    color: rgb(244,0,87);
  }
  .logisticsAddress .address strong{
    margin-left: .2rem;
    font-weight: 400;
  }
  /*物流地址--结束*/
  /*物流信息--开始*/
  .logisticsMsg{
    /*height: 100%;*/
    background-color: #fff;
    padding-top: .26rem;
    padding-bottom: .93rem;
  }
  .logisticsMsg li{
    width: 100%;
    padding: 0 .3rem;
    display: flex;
    font-size: .4rem;
    color: rgb(153,153,153);
  }
  .logisticsMsg li:first-child{
    color: rgb(244,0,87);
  }
  .logisticsMsg li .time{
    margin-right: .4rem;
    width: 20%;
    position: relative;
    font-size: .3rem;
  }
  .logisticsMsg li .time span.wrap{
    text-align: center;
    position: absolute;
    top: -.14rem;
  }
  .logisticsMsg li .messages{
    width: 80%;
    height: 1.5rem;
    border-left: 1px solid rgb(153,153,153);
    padding-left: .5rem;
    position: relative;
  }
  .logisticsMsg li:last-child .messages{
    border-color: #fff;
  }
  .logisticsMsg li .messages img{
    width: .4rem;
    height: .4rem;
    position: absolute;
    top: 0;
    left: -.21rem;
  }
  .logisticsMsg li .messages span.state{
    position: absolute;
    top: -.2em;
    font-size: .3rem;
  }
  .emptyMsg{
    width: 5.46rem;
    height: .88rem;
    border: 1px solid #666;
    color: #666;
    border-radius: .2rem;
    margin: 0 auto;
    font-size: .32rem;
    text-align: center;
    line-height: .88rem;
  }
  /*物流信息--结束*/
  /*点击收起下拉--开始*/
  .packDrop{
    background-color: #fff;
    font-size: .35rem;
    text-align: center;
    color: rgb(153,153,153);
    padding-bottom: .1rem;
  }
  .packDrop img{
    width: .6rem;
    vertical-align: middle;
    margin-top: -.1rem;
  }
  /*点击收起下拉--结束*/
  /*我的推荐--开始*/
  .title{
    height: 1rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
  }
  .title img{
    width: 55%;
  }
  /*我的推荐--结束*/

  .bottomPlaceholder {
    height: 1.5rem;
  }
  #logisticsMescroll{
    top: 0;
    bottom: 0;
    height: auto;
    position: fixed;
  }

</style>
