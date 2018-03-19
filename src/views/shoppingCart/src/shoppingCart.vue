<template lang="pug">
  #mescroll.mescroll
    ul.data-list
      li(v-for="pd in list")
        p.pd-sold 已售{{pd.name}}件
</template>

<script>
  export default {
    name: 'home',
    data () {
      return {
        mescroll: null,
        list: []
      }
    },
    mounted () {
      this.$mescrollInt("mescroll",this.upCallback)
    },
    methods: {
      //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
      upCallback: function(page) {
        //联网加载数据
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if(page.num === 1) self.list = [];

          //更新列表数据
          self.list = self.list.concat(curPageData);

          //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
          console.log("page.num="+page.num+", page.size="+page.size+", curPageData.length="+curPageData.length+", self.list.length==" + self.list.length);

          //方法一(推荐): 后台接口有返回列表的总页数 totalPage
          //self.mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

          //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
          //self.mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

          //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
          //self.mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

          //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
          self.mescroll.endSuccess(curPageData.length);

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        //延时一秒,模拟联网
        setTimeout(function () {
//          	axios.get("xxxxxx", {
//					params: {
//						num: pageNum, //页码
//						size: pageSize //每页长度
//					}
//				})
//				.then(function(response) {

          successCallback&&successCallback({name:pageNum});//成功回调
//				})
//				.catch(function(error) {
//					errorCallback&&errorCallback()//失败回调
//				});
        },10)
      }
    },
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -webkit-tap-highlight-color:transparent;
  }
  /*mescroll滚动的区域*/
  .mescroll{
    position: fixed;
    top: 44px;
    bottom: 0;
    height: auto;
  }
  /*展示上拉加载的数据列表*/
  .data-list li{
    position: relative;
    padding: 10px 8px 10px 120px;
    border-bottom: 1px solid #eee;
  }
</style>
