<template lang="pug">
  .citySearch
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center")
        searchInput(placeholder="请输入城市名")
      .topRight(slot="right" @click="$router.go(-1)") 取消
    .location
      ul 
        li 当前定位
        li.icon
          img(src="../../../assets/img/citySearch.png") 
        li.cityShow(@click="goToHome($event)") 南京市
    .hotCity 热门城市
    .hotCityList
      ul
        li(v-for="(item,index) in hotCityList" @click="change(item,index)" :class="{active:selected==index}") {{item}}    
    .allCityList
      ul(v-for="(key,value,oIndex) in letterCityList")
        li.letters(:id="'anchor-'+oIndex") {{value}}
        li.letterCities(v-for="(item,index) in key.list" v-if="index<=num" @click="selects($event)") {{item}}
        li.viewMore(@click="viewMore(key,$event,oIndex)") {{key.words}}
    ul.letter
      li #
      li(v-for="(item,index) in letter" @click="goAnchor('#anchor-'+index)") {{item}} 
      li #  
</template>
<script>
  
  export default {
    name: 'citySearch',
    data () {
      return {
        statusNum: this.$route.query.routeParams,
        letter:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
        num:9,
        selected:0,
        hotCityList:["上海","北京","广州","深圳","杭州","武汉","南京","成都","重庆","西安","苏州","郑州"],
        letterCityList:{
          "A":{list:["阿坝","阿拉善","阿里","安康","安庆","鞍山","安顺","安阳","澳门"],words:"查看更多"},
          "B":{list:["北京","白银","保定","宝鸡","保山","包头","巴中","北海","蚌埠","本溪","毕节","滨州","百色","亳州"],words:"查看更多"},
          "C":{list:["重庆","成都","长沙","长春","沧州","常德","昌都","长治","常州","巢湖","潮州","承德","郴州","赤峰","池州","崇左","楚雄","滁州","朝阳"],words:"查看更多"},
          "D":{list:["大连","东莞","大理","丹东","大庆","大同","大兴安岭","德宏","德阳","德州","定西","迪庆","东营"],words:"查看更多"},
          "E":{list:["鄂尔多斯","恩施","鄂州"],words:"查看更多"},
          "F":{list:["福州","防城港","佛山","抚顺","抚州","阜新","阜阳"],words:"查看更多"},
          "G":{list:["广州","桂林","贵阳","甘南","赣州","甘孜","广安","广元","贵港","果洛"],words:"查看更多"},
          "H":{list:["杭州","哈尔滨","合肥","海口","呼和浩特","海北","海东","海南","海西","邯郸","汉中","鹤壁","河池","鹤岗","黑河","衡水","衡阳","河源","贺州","红河","淮安","淮北","怀化","淮南","黄冈","黄南","黄山","黄石","惠州","葫芦岛","呼伦贝尔","湖州","菏泽"],words:"查看更多"}
        }
     
      }
    },
    mounted () {
      window.onscroll = function() {};
    },
    methods: {
      change: function(item,index){
        this.selected = index;
        var cityShow = document.getElementsByClassName("cityShow")[0];
        cityShow.innerHTML = item + "市";
      },

      viewMore:function(key,e,oIndex){
        console.log(key);
        console.log(oIndex);
        console.log(e.target.innerText);  
        if(e.target.innerText == "收起更多"){
          this.num = 9;
          key.words = "查看更多";
        }
        if(e.target.innerText == "查看更多") {
          this.num = key.list.length;
          key.words = "收起更多";
        }
      },

      goAnchor:function(selector) {
        console.log("1");
        var anchor = this.$el.querySelector(selector);
        document.documentElement.scrollTop = anchor.offsetTop - 60;  
      },

      selects:function(e){
        console.log(e.target.innerText);
        var cityShow = document.getElementsByClassName("cityShow")[0];
        cityShow.innerHTML = e.target.innerText + "市";
        if(this.statusNum == 1){
          this.$router.push({
             name: '首页',
             query: {
                routeParams: e.target.innerText
             }    
          });
        }
        if(this.statusNum == 2){
          this.$router.push({
             name: '分类',
             query: {
                routeParams: e.target.innerText
             }    
          });
        }     
      },

      goToHome:function(e){
        console.log(e.target.innerText);
        var str = e.target.innerText.substr(0,e.target.innerText.length-1);
        if (this.statusNum == 1) {
          this.$router.push({
             name: '首页',
             query: {
                routeParams: str
             }    
          });
        }
        if (this.statusNum == 2) {
          this.$router.push({
             name: '分类',
             query: {
                routeParams: str
             }    
          });
        }
          
      }
    }
  }
</script>

<style scoped>
  .active{
    color: #fff;
    background-color: rgb(255,128,171) !important;
  }

  /*搜索框--开始*/
  .citySearch{
    background-color: rgb(242,242,242);
    padding-bottom: 2rem;
    min-height: 100vh;
    z-index: 100;
    position: absolute;
  }
  .citySearch .topRight{
    color: rgb(245,0,87);
    font-size: .45rem;
    font-weight: 400;
  }
  /*搜索框--结束*/
  /*当前定位--开始*/
  .location{
    height: 1.2rem;
    line-height: 1.2rem;
    margin-top: .4rem;
    background-color: #fff;
  }
  .location ul{
    display: flex;
    padding-left: .2rem;
  }
  .location ul li{
    font-size: .4rem;
    font-weight: 600;
  }
  .location ul li.icon{
    margin-left: .5rem;
  }
  .location ul li.icon img{
    width: .25rem;
  }
  .location ul li.cityShow{
    color: rgb(153,153,153);
    margin-left: .2rem;
  }

  /*当前定位--结束*/
  /*热门城市--开始*/
  .hotCity{
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .4rem;
    font-weight: 600;
    padding-left: .2rem;
  }
  .hotCityList{
    padding: .4rem .3rem;
    background-color: #fff;
  }
  .hotCityList ul{
    height: 4rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-around;
  }
  .hotCityList ul li{
    width: 2rem;
    height: .9rem;
    text-align: center;
    line-height: .9rem;
    font-size: .4rem;
    background-color: rgb(242,242,242);
    border-radius: .2rem;
  }
  /*热门城市--结束*/
  /*按英文字母表排序的城市--开始*/
  .allCityList{
    background-color: #fff;
    margin-top: .2rem;
  }
  .allCityList ul{
    background-color: rgb(242,242,242);
  }
  .allCityList ul li.letters{
    height: 1.2rem;
    line-height: 1.2rem;
    text-indent: .3rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .allCityList ul li.letterCities{
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-indent: .3rem;
    border-bottom: 1px solid rgb(229,229,229);
    background-color: #fff;
    font-size: .4rem;
  }
  .allCityList ul li.viewMore{
    height: 1.4rem;
    background-color: #fff;
    text-align: center;
    line-height: 1.4rem;
    font-size: .4rem;
    color: rgb(153,153,153);
  }
  /*按英文字母表排序的城市--结束*/
  /*右边显示的字母--开始*/
  .letter{
    width: .4rem;
    position: fixed;
    top: 3rem;
    right: 0;
  }
  .letter li{
    color: rgb(255,128,171);
    font-size: .4rem;
  }
  /*右边显示的字母--结束*/
</style>
