<template lang="pug">
  .checkLogistics.mescroll#logisticsMescroll
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 查看物流
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png").msg
    .content
      .center
        .image
          img(src="../../../../../assets/img/my_goods.png")
        .goodsExplain
          .words 已发货
          .express 中通快递: 2467773999
          .contactWay 官方联系: 95311
    .logisticsAddress
      img(src="../../../../../assets/img/citySearch@2x.png")
      .address 
        span 收货地址:
        strong 江苏省南京市玄武区 699-22 江苏软件园24栋
    .logisticsMsg(:class="fadeInUp")
      ul
        li(v-for="(item,index) in states")
          .time
            span.wrap
              span {{item.time}}
          .messages 
            span.state {{item.state}}
            img(:src="item.imgSrc")
    .packDrop(@click="packDrop()")
      span {{packDrops}}
      img(src="../../../../../assets/img/pack.png")
    .recommend
      img(src="../../../../../assets/img/my_recommend@2x.png")
    .bottomList
        ul.goodsList#box
          li(v-for="item in recommendGoods" , @click="goGoods(item.goodsId)")
            img(src="../../../../../assets/img/my_goods.png")
            .wrapWords
              .text 商品拆散你都没法跟你阿萨德你看啥都能扩大萨德你看
              .price ￥516.22
              .bottom <span>江苏南京</span><span>2555人购买</span>
    .bottomPlaceholder                           
</template>

<script>
    import now from '../../../../../assets/img/now@2x.png'
    import past from '../../../../../assets/img/past@2x.png'
    export default {
      name: "checkLogistics",
      data(){
        return{
          packDrops:"点击收起详情",
          recommendGoods: [],
          states:[
            {
              time:"03-19 13:25",
              state:"运输中",
              imgSrc:now
            },
            {
              time:"03-18 13:25",
              state:"中通快递揽件",
              imgSrc:past
            },
            {
              time:"03-17 13:25",
              state:"卖家发货",
              imgSrc:past
            },
            {
              time:"03-17 10:25",
              state:"仓库开始处理",
              imgSrc:past
            },
            {
              time:"03-17 06:25",
              state:"已提交订单",
              imgSrc:past
            }
          ]
        }
      },
      created(){

      },
      mounted(){
        this.$mescrollInt("logisticsMescroll",this.upCallback);
      },
      methods:{
        packDrop(){
          if (this.packDrops == "点击收起详情") {
            this.packDrops = "点击查看更多详情";
            var logisticsMsg = document.getElementsByClassName("logisticsMsg")[0];
            logisticsMsg.style.height = "1.5rem";
            logisticsMsg.style.overflow = "hidden";
          }else{
            this.packDrops = "点击收起详情";
            var logisticsMsg = document.getElementsByClassName("logisticsMsg")[0];
            logisticsMsg.style.height = null;
            logisticsMsg.style.overflow = null;
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
  //        .then(function(response) {
            successCallback&&successCallback({});//成功回调
            successCallback&&successCallback({});//成功回调
            successCallback&&successCallback({});//成功回调
            successCallback&&successCallback({});//成功回调
  //        })
  //        .catch(function(error) {
  //          errorCallback&&errorCallback()//失败回调
  //        });
          },500)
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
    padding: .1rem 0 0 .3rem;
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
    font-size: .35rem;
  }
  /*订单内容--结束*/
  /*物流地址--开始*/
  .logisticsAddress{
    background-color: #fff;
    margin-top: .2rem;
    display: flex;
    justify-content: flex-end;
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
    background-color: #fff;
    padding-top: .3rem; 
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
    width: 18%;
    position: relative;
  }
  .logisticsMsg li .time span.wrap{
    position: absolute;
    top: -.3rem;
  }
  .logisticsMsg li .messages{
    width: 82%;
    height: 1.5rem;
    border-left: 1px solid rgb(153,153,153);
    text-indent: .4rem;
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
    top: -.15em;
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
  .recommend{
    height: 1rem;
    line-height: 1.2rem;
    text-align: center;
  }
  .recommend img{
    width: 5rem;
  }
  /*我的推荐--结束*/
  /*商品大图展示--开始*/
  .goodsList {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: .2rem;
    background: #fff;
  }
  .goodsList li{
    border: solid 1px #ccc;
    border-radius: 5px;
    overflow: hidden;
    width: 49%;
    float: left;
    margin-bottom: .2rem;
  }
  .goodsList li img {
    width: 100%;
  }
  .text{
    margin: .1rem;
  }
  .goodsList .price{
    margin: .2rem .1rem;
    color: rgb(246,0,87);
    font-weight: 600;
    font-size: .4rem;
  }
  .wrapWords .bottom{
    margin: .1rem;
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
  }
  /*商品大图展示--结束*/
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
