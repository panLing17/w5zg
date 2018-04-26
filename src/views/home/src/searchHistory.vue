<template lang="pug">
  .wrapNav
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="backRouter()")
      .topCenter(slot="center")
        .searchInput
          input(:type="type",placeholder="请输入商品名称" @focus="handFocus" v-model="msg" @keyup.enter="searchGoods()")
          img(src="../../../assets/img/searchInput搜索图标@2x.png" @click="searchGoods()")
      .topRight(slot="right" @click="backRouter()") 取消
    .searchHistory.mescroll#historyMescroll
      .wrapTwo  
        .history(v-show="searchFlag")
          ul.top
            li.left 历史搜索
            li.right(@click="clearHistory()")
              img(src="../../../assets/img/searchHistory_clear.png") 
          ul.cont(v-if="flag")
            li(v-for="(item,index) in record1" @click="change1(item,index)" :class="{active:selected1==index}") {{item}}
          .empty(v-else="flag") 暂无搜索历史          
        .discover(v-show="searchFlag")
          ul.top
            li.left 搜索发现
            li.right(@click="toggle")
              img(src="../../../assets/img/searchHistory显示图层.png" v-if="showDiscover")
              img(src="../../../assets/img/searchHistory隐藏图层.png" v-else="showDiscover") 
          ul.cont(v-show="showDiscover")
            li(v-for="(item,index) in record2" @click="change2(item,index)" :class="{active:selected2==index}") {{item}}
        .result(v-show="resultFlag")
          .words 没有搜索到
            span.strong 此类
            span 商品，及相关商品    
      .title
        .line
        p 推荐
      w-recommend#dataId(:listData="recommendGoods")
      .bottomPlaceholder       
</template>
<script>
 
  export default {
    name: 'searchHistory',
    data () {
      return {
        searchFlag:true, //历史搜索,搜索发现显隐
        resultFlag:false, //搜索结果的显隐
        recommendGoods:[], //推荐的数组
        selected1:null,
        selected2:null,
        flag:true,
        show:true,
        hide:false,
        showDiscover:true, //搜索发现的显隐
        record1:[],
        record2:[],
        msg:""
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
    mounted(){
      //商品推荐
      this.$mescrollInt("historyMescroll",this.upCallback);
      //历史搜索
      this.historys();
      //搜索发现
      this.searchDiscover();
      //显示搜索结果
      this.resultShow();
      //进页面时就让输入框聚焦
      this.toFocusOn();
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods: {
      //进页面时就让输入框聚焦
      toFocusOn(){
        var oInput = document.getElementsByTagName("input")[0];
        oInput.focus();
      },
      //判断回退事件
      backRouter(){
        // if (this.$route.query.relNum == 1) {
        //   this.$router.push('/home');
        // } else{
        //   this.$router.go(-1);
        // }
        this.$router.push('/home');
      },  
      //显示搜索结果
      resultShow(){
        if (this.$route.query.relNum == 1) {
          this.searchFlag = false;
          this.resultFlag = true;
        }
      },
      //搜索商品去商品展示页
      searchGoods(){
        let self = this;
        self.$router.push({path:'/page/commodityList',query:{msg:self.msg,flag:true}});
      },
      //历史搜索
      historys(){
        let self =this;
        self.$ajax({
          method:"post",
          url:self.$apiGoods + "goodsSearch/queryGoodsHistoryList",
          params:{}
        }).then(function(res){
          self.record1 = res.data.data;
        })
      },
      //搜索发现
      searchDiscover(){
        let self = this;
        self.$ajax({
          method:"post",
          url:self.$apiGoods + "goodsSearch/searchDiscovery",
          params:{}
        }).then(function(res){
          self.record2 = res.data.data;
        })
      },

      handFocus () {
        this.$emit('focus', this.msg);
      },

      //清除历史搜索记录
      clearHistory(){
        //this.flag = false;
        // let self = this;
        // self.$ajax({
        //   method:""
        // })
        if (this.flag != false) {
          this.$confirm({
            title: '确认',
            message: '真的要这样做吗',
            confirm: () => {
              //alert('确定')
              this.flag = false;
              let self = this;
              self.$ajax({
                method:"post",
                url:self.$apiGoods + "goodsSearch/deleteGoodsHistoryList",
                params:{}
              }).then(function(res){
                this.historys();
              })
            },
            noConfirm: () => {
              //alert('取消')
            }
          })
        }
        
      },

      toggle:function(){
        this.showDiscover = !this.showDiscover;
      },

      change1: function(item,index){
        this.selected1 = index;
        this.selected2 = null;
        this.msg = item;
        this.$router.push({path:'/page/commodityList',query:{msg:this.msg,flag:true}});
      },

      change2: function(item,index){
        this.selected2 = index;
        this.selected1 = null;
        this.msg = item;
        this.$router.push({path:'/page/commodityList',query:{msg:this.msg,flag:true}});
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
//            axios.get("xxxxxx", {
//          params: {
//            num: pageNum, //页码
//            size: pageSize //每页长度
//          }
//        })
//        .then(function(response)
        let self = this
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
      }

    }
  }
</script>

<style scoped>
#historyMescroll{
  position: fixed;
  top: 1.3rem;
  bottom: 0;
}
.searchHistory{
  width: 100%;
  position: absolute;
  min-height: 100vh;
  z-index: 103;
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
  margin-left: .4rem;
  background-color: rgb(238,238,238);
}
/*搜索框样式--结束*/
/*历史搜索--开始*/
.wrapTwo{
  background-color: #fff;
}
.history,
.discover{
  padding: .6rem .3rem .3rem;
  background-color: #fff;
}
.history ul.top,
.discover ul.top{
  display: flex;
  justify-content: space-between;
}
.history ul.top li.left,
.discover ul.top li.left{
  font-size: .4rem;
  color: rgb(51,51,51);
}
.history ul.top li.right img,
.discover ul.top li.right img{
  width: .55rem;
}
.history ul.cont,
.discover ul.cont{
  margin-top: .1rem;
  padding: 0 .5rem;
}
.history ul.cont li,
.discover ul.cont li{
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
/*历史搜索--结束*/
/*搜索结果显示--开始*/
.result{
  padding: .7rem .6rem 1.2rem;
  background-color: #fff;
}
.result .words{
  font-size: .4rem;
}
.result .words span.strong{
  color: rgb(244,0,87);
  margin: 0 .2rem;
}
/*搜索结果显示--结束*/
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
  background: #f2f2f2;
  padding: 0 .2rem;
}
.bottomPlaceholder {
  height: 1.5rem;
}
</style>
