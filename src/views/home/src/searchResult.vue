<template lang="pug">
  .searchResult.mescroll#resultMescroll
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center")
        .searchInput
          img(src="../../../assets/img/searchInput搜索图标@2x.png")
          input(:type="type",placeholder="请输入商品名称" @focus="handFocus")
      .topRight(slot="right" @click="$router.go(-1)") 取消       
    .content
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
    name: 'searchResult',
    data () {
      return {
        recommendGoods: []
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
    mounted (){
      this.$mescrollInt("resultMescroll",this.upCallback);
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods: {
      handFocus () {
        this.$emit('focus', this.msg);
        this.$router.push('/home/searchHistory');
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
          console.log(response.data.data);
          successCallback&&successCallback(response.data.data);//成功回调
        })
      }

    }
  }
</script>

<style scoped>
.searchResult{
  min-height: 100vh;
  background-color: rgb(242,242,242);
  padding-bottom: 2rem;
  position: absolute;
  z-index: 101;
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
  border: 0;
  outline: none;
  font-size: .3rem;
  margin-left: .1rem;
  background-color: rgb(238,238,238);
}
/*搜索框样式--结束*/
/*搜索结果显示--开始*/
.content{
  padding: .7rem .6rem 1.2rem;
  background-color: #fff;
}
.content .words{
  font-size: .4rem;
}
.content .words span.strong{
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
  background: #f2f2f2 ;
  padding: 0 .2rem;
}
.bottomPlaceholder {
    height: 1.5rem;
}
</style>
