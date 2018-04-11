<template lang="pug">
  .searchHistory
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center")
        .searchInput
          img(src="../../../assets/img/searchInput搜索图标@2x.png" @click="searchGoods()")
          input(:type="type",placeholder="请输入商品名称" @focus="handFocus" v-model="msg")
      .topRight(slot="right" @click="$router.go(-1)") 取消
    .history
      ul.top
        li.left 历史搜索
        li.right(@click="clear")
          img(src="../../../assets/img/searchHistory_clear.png") 
      ul.cont(v-if="flag")
        li(v-for="(item,index) in record1" @click="change1(item,index)" :class="{active:selected1==index}") {{item}}
      .empty(v-else="flag") 暂无搜索历史          
    .discover
      ul.top
        li.left 搜索发现
        li.right(@click="toggle")
          img(src="../../../assets/img/searchHistory显示图层.png" v-show="show")
          img(src="../../../assets/img/searchHistory隐藏图层.png" v-show="hide") 
      ul.cont(v-show="show")
        li(v-for="(item,index) in record2" @click="change2(item,index)" :class="{active:selected2==index}") {{item}}
        
          
</template>
<script>
 
  export default {
    name: 'searchHistory',
    data () {
      return {
        selected1:null,
        selected2:null,
        flag:true,
        show:true,
        hide:false,
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
      //历史搜索
      this.historys();
      //搜索发现
      this.searchDiscover();
    },
    methods: {
      searchGoods(){
        console.log(this.msg);
        let self = this;
        self.$router.push({path:'/page/commodityList',query:{msg:self.msg,flag:true}});
      },
      historys(){
        let self =this;
        self.$ajax({
          method:"post",
          url:self.$apiGoods + "goodsSearch/queryGoodsHistoryList",
          params:{}
        }).then(function(res){
          console.log(res.data.data);
          self.record1 = res.data.data;
          console.log(self.record1);
        })
      },
      searchDiscover(){
        let self = this;
        self.$ajax({
          method:"post",
          url:this.$apiGoods + "goodsSearch/searchDiscovery",
          params:{}
        }).then(function(res){
          console.log(res.data.data);
          self.record2 = res.data.data;
          console.log(self.record2);
        })
      },


      handFocus () {
        this.$emit('focus', this.msg)
      },

      clear:function(){
        this.flag = false;
      },

      toggle:function(){
         this.show = !this.show;
         this.hide = !this.hide; 
      },

      change1: function(item,index){
        this.selected1 = index;
        this.selected2 = null;
        this.msg = item;
      },

      change2: function(item,index){
        this.selected2 = index;
        this.selected1 = null;
        this.msg = item;
      }
    }
  }
</script>

<style scoped>
.searchHistory{
  width: 100%;
  position: absolute;
  z-index: 100;
  min-height: 100vh;
  background-color: #fff;
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
  margin-left: .1rem;
  background-color: rgb(238,238,238);
}
/*搜索框样式--结束*/
/*历史搜索--开始*/
.history,
.discover{
  padding: 0 .3rem;
}
.history ul.top,
.discover ul.top{
  display: flex;
  justify-content: space-between;
  margin-top: .6rem;
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

</style>
