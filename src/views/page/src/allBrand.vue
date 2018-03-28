<template lang="pug">
  .wrapToggle
    .brand 
      span 品牌
    p.hot 热门
    .brandList
      ul
        li(v-for="(item,index) in brandList" :class="{active:num1 == index}" @click="check(index)") {{item}}
    .allBrandList
      ul(v-for="(key,value,oIndex) in letterBrandList")
        li.letters(:id="'anchorz-'+oIndex") {{value}}
        li.letterBrands(v-for="(item,index) in key" v-if="index<=num" @click="selects($event)") {{item.bi_name}}
        li.viewMore(@click="viewMore(key,$event,oIndex)") {{key.words}}
    ul.letter
      li #
      li(v-for="(item,index) in letter" @click="goAnchorz('#anchorz-'+index)") {{item}} 
      li #             
</template>

<script>
    export default {
        name: "allBrand",
        props: {
          show: {
            type: Boolean,
            default: false
          }
        },
        data(){
          return{
            num:9,
            num1:null,
            brandList:["阿迪达斯","耐克","金利来","丹尼尔·惠灵顿","阿迪达斯","耐克","金利来","丹尼尔·惠灵顿"],
            price:["0~500","500~1000","1000~2000","2000~5000","5000以上"],
            support:["可自提","不可自提"],
            letter:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            letterBrandList:{
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
        mounted(){
          // window.onscroll = function() {};
          this.loading();
        },
        methods:{
          check(index){
            this.num1 = index;
          },
          hide(){
            let data = {
              flag : true
            };
            this.$emit('ievent',data); 
          },
          goAnchorz:function(selector) {
            var anchor = this.$el.querySelector(selector);
            console.log(anchor);
            var heightTop = document.documentElement.scrollTop || document.body.scrollTop;
            console.log(heightTop);
            heightTop = anchor.offsetTop - 60;
            console.log(heightTop); 
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
          loading(){
            let self = this;
            self.$ajax({
              method:"post",
              url:this.$apiMember2 + "goods/brand/all",
              params:{},
            }).then(function(res){
              console.log(res.data.data);
              self.letterBrandList = res.data.data;
            })
          }
        }
    }
</script>

<style scoped>
.wrapToggle{
  overflow: scroll;
}
.active{
  color: #fff !important;
  background-color: rgb(255,128,171) !important;
}
/*品牌--开始*/
.brand{
  padding: 0 .3rem;
  display: flex;
  justify-content: space-between;
  font-size: .4rem;
}
.brand img{ 
  width: .5rem;
  height: .5rem;
  vertical-align: middle;
}
.brandList ul{
  display: flex;
  padding: 0 .3rem;
  flex-wrap: wrap;
}
.brandList ul li{
  display: inline-block;
  height: .8rem;
  line-height: .8rem;
  background-color: rgb(242,242,242);
  border-radius: .25rem;
  padding: 0 .3rem;
  font-size: .3rem;
  color: rgb(51,51,51);
  margin-top: .3rem;
  margin-right: .35rem;
}
/*品牌--结束*/
/*商品名列表--开始*/
.wrapToggle{
  padding: .5rem 0 2.9rem;
  background-color: #fff;
}
.wrapToggle .hot{
  padding: .2rem .3rem 0;
  font-size: .35rem;
}
/*商品名列表--结束*/

/*按英文字母表排序的城市--开始*/
.allBrandList{
  background-color: #fff;
  margin-top: .2rem;
}
.allBrandList ul{
  background-color: rgb(242,242,242);
}
.allBrandList ul li.letters{
  height: 1.2rem;
  line-height: 1.2rem;
  text-indent: .3rem;
  font-size: .4rem;
  color: rgb(51,51,51);
}
.allBrandList ul li.letterBrands{
  width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
  text-indent: .3rem;
  border-bottom: 1px solid rgb(229,229,229);
  background-color: #fff;
  font-size: .4rem;
}
.allBrandList ul li.viewMore{
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
  text-align: center;
  position: fixed;
  top: 2.8rem;
  right: 0;
  z-index: 102;
}
.letter li{
  color: rgb(255,128,171);
  font-size: .4rem;
}
/*右边显示的字母--结束*/
</style>
