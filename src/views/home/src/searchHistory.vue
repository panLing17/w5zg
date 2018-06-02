<template lang="pug">
  .wrapNav
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="backRouter()")
      .topCenter(slot="center")
        .searchInput
          input(:type="type",placeholder="请输入商品名称" @focus="handFocus" v-model="msg" @keyup.enter="searchGoods()" autofocus="autofocus")
          img(src="../../../assets/img/searchInput搜索图标@2x.png" @click="searchGoods()")
      .topRight(slot="right" @click="backRouter()") 取消
    .searchHistory.mescroll#historyMescroll
      .wrapTwo
        .history(v-show="searchFlag")
          ul.top
            li.left 历史搜索
            li.right(@click="clearHistory()")
              img(src="../../../assets/img/searchHistory_clear.png")
          transition(name="slide-fade")
            ul.cont(v-if="flag")
              li(v-for="(item,index) in record1" @click="change1(item,index)" :class="{active:selected1==index}") {{item}}
            .empty(v-else="flag") 暂无搜索历史
        .discover(v-show="searchFlag")
          ul.top
            li.left 搜索发现
            li.right(@click="toggle")
              img(src="../../../assets/img/searchHistory显示图层.png" v-if="showDiscover")
              img(src="../../../assets/img/searchHistory隐藏图层.png" v-else="showDiscover")
          transition(name="slide-fade")
            ul.cont(v-show="showDiscover")
              li(v-for="(item,index) in record2" @click="change2(item,index)" :class="{active:selected2==index}") {{item}}
        transition(name="slide-fade")
          .result(v-show="resultFlag")
            .words 没有搜索到
              span.strong 此类
              span 商品，及相关商品
      .title
        img(src="../../../assets/img/recommend.png")
      recommend#dataId(background="white", ref="recommend")
      .bottomPlaceholder
</template>
<script>
  import {mapState} from 'vuex'
  import recommend from './recommend'
  export default {
    name: 'searchHistory',
    components:{recommend},
    data () {
      return {
        searchFlag:'', //历史搜索,搜索发现显隐
        resultFlag:'', //搜索结果的显隐
        recommendGoods:[], //推荐的数组
        selected1:null,
        selected2:null,
        flag:true,
        show:true,
        hide:false,
        showDiscover:this.$store.state.searchFlag, //搜索发现的显隐
        record1:[],
        record2:[],
        msg:this.$route.query.messages,
        jumps:this.$route.query.jumps, //判断是那个页面来的
      }
    },
    computed: mapState(['position']),
    directives:{
      focus:{
        inserted:function(el){
          el.focus()
        }
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
    activated () {
      this.msg = this.$route.query.messages;
      //显示搜索结果
      this.resultShow();
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0);
        }
      })
    },
    mounted(){
      //搜索发现
      //this.searchDiscover();
      //商品推荐
      this.$mescrollInt("historyMescroll",this.upCallback,()=>{
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
      //历史搜索
      this.historys();
      //显示搜索结果
      this.resultShow();
      console.log(this.$route.query.jumps);
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy();
    },
    methods: {
      //判断回退事件
      backRouter(){
        if (this.$route.query.jumps == 'page') {
          this.$router.push('/page');
        } else if (this.$route.query.jumps == 'home'){
          this.$router.push('/home');
        } else {
          this.$router.go(-1);
        }
      },
      //显示搜索结果
      resultShow(){
        if (this.$route.query.relNum == 1) {
          this.searchFlag = false;
          this.resultFlag = true;
        } else{
          this.searchFlag = true;
          this.resultFlag = false;
        }
      },
      //搜索商品去商品展示页
      searchGoods(){
        let self = this;
        self.$router.push({path:'/page/commodityList',query:{msg:self.msg,flags:1,jumps:self.jumps}});
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
          if (self.record1.length == 0) {
            self.flag = false;
          } else{
            self.flag = true;
          }
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
        this.searchFlag = true;
        this.resultFlag = false;
      },

      //清除历史搜索记录
      clearHistory(){
        if (this.flag != false) {
          this.$confirm({
            title: '确认',
            message: '真的要这样做吗',
            confirm: () => {
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

            }
          })
        }

      },

      toggle:function(){
        this.showDiscover = !this.showDiscover;
        this.$store.commit('getSearchDiscover', this.showDiscover);
        if (this.showDiscover == true) {
          this.searchDiscover();
        }
      },

      change1: function(item,index){
        this.selected1 = index;
        this.selected2 = null;
        this.msg = item;
        this.$router.push({path:'/page/commodityList',query:{msg:this.msg,flags:1,jumps:this.jumps}});
      },

      change2: function(item,index){
        this.selected2 = index;
        this.selected1 = null;
        this.msg = item;
        this.$router.push({path:'/page/commodityList',query:{msg:this.msg,flags:1,jumps:this.jumps}});
      },

      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          self.$refs.recommend.more(curPageData,page.num,page.size)
          self.mescroll.endSuccess(curPageData.length)
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
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
  min-height: 100vh;
  z-index: 103;
  background-color: rgb(242,242,242);
}
.active{
  color: #fff !important;
  background-color: rgb(255,128,171) !important;
}

.topRight{
  color: rgb(245,0,87);
  font-size: .4rem;
  font-weight: 400;
  margin-right: .1rem;
}
/*搜索框样式--开始*/
.searchInput{
  width: 6.5rem;
  height: .7rem;
  background-color: rgb(238,238,238);
  border-radius: .9rem;
  line-height: .7rem;
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
  vertical-align: middle;
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
  padding: 1.2rem 0 1.5rem;
  background-color: #fff;
  text-align: center;
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
.title img{
  width: 55%;
}
.bottomPlaceholder {
  height: 1.5rem;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  /*transform: translateX(30px);*/
  opacity: 0;
}
</style>
