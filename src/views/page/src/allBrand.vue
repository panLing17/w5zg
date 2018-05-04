<template lang="pug">
  .wrapToggle
    .brand(@click="backLastPage()")
      img(src="../../../assets/img/backBtn.png") 
      span 品牌
    p.hot 热门
    .brandList
      ul
        li(v-for="(item,index) in brandList" :class="{active:num1 == index}" @click="check(index,$event,item.bi_id)") {{item.bi_name}}
    .allBrandList
      ul(v-for="(key,value,oIndex) in letterBrandList")
        li.letters(:id="'anchorz-'+oIndex") {{value}}
        li.letterBrands(v-for="(item,index) in key.list" v-if="index<=num" @click="selects($event,item.bi_id)") {{item.bi_name}}
        li.viewMore(@click="viewMore(key,$event,oIndex)") {{key.words}}
    ul.letter(v-show="false")
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
            brandNameId:"",
            num:9,
            num1:null,
            brandList:["阿迪达斯","耐克","金利来","丹尼尔·惠灵顿","阿迪达斯","耐克","金利来","丹尼尔·惠灵顿"],
            price:["0~500","500~1000","1000~2000","2000~5000","5000以上"],
            support:["可自提","不可自提"],
            letter:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            letterBrandList:{
              "A":{list:[],words:"查看更多"},
              "B":{list:[],words:"查看更多"},
              "C":{list:[],words:"查看更多"},
              "D":{list:[],words:"查看更多"},
              "E":{list:[],words:"查看更多"},
              "F":{list:[],words:"查看更多"},
              "G":{list:[],words:"查看更多"},
              "H":{list:[],words:"查看更多"},
              "I":{list:[],words:"查看更多"},
              "J":{list:[],words:"查看更多"},
              "K":{list:[],words:"查看更多"},
              "L":{list:[],words:"查看更多"},
              "M":{list:[],words:"查看更多"},
              "N":{list:[],words:"查看更多"},
              "O":{list:[],words:"查看更多"},
              "P":{list:[],words:"查看更多"},
              "Q":{list:[],words:"查看更多"},
              "R":{list:[],words:"查看更多"},
              "S":{list:[],words:"查看更多"},
              "T":{list:[],words:"查看更多"},
              "U":{list:[],words:"查看更多"},
              "V":{list:[],words:"查看更多"},
              "W":{list:[],words:"查看更多"},
              "X":{list:[],words:"查看更多"},
              "Y":{list:[],words:"查看更多"},
              "Z":{list:[],words:"查看更多"}
            }
          }
        },
        mounted(){
          //商品字母列表
          this.loading();
          //搜索的历史
          this.history();
        },
        methods:{
          //返回上一页
          backLastPage(){
            let data = {
              back:"yes"
            }
            this.$emit("backLast",data);
          },
          //选择热门品牌
          check(index,e,id){
            this.num1 = index;
            this.brandNameId = id;
            let data = {
              flag2:true,
              brandId2:id,
              brandName2:e.target.innerText
            }
            this.$emit('searchBrandHot',data);
          },
          hide(){
            let data = {
              flag : true
            };
            this.$emit('ievent',data); 
          },
          goAnchorz:function(selector) {
            var anchor = this.$el.querySelector(selector);
            var heightTop = document.documentElement.scrollTop || document.body.scrollTop;
            heightTop = anchor.offsetTop - 60;
          },
          viewMore:function(key,e,oIndex){  
            if(e.target.innerText == "收起更多"){
              if (key.list.length>=9) {
                this.num = 9;
              } else{
                this.num = key.list.length;
              }
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
              url:this.$apiGoods + "goods/brand/all",
              params:{},
            }).then(function(res){
              console.log(res.data.data);
              // self.letterBrandList = {}
              // for(let i in res.data.data) {
              //   self.letterBrandList[i] = {}
              //   self.letterBrandList[i].list = res.data.data[i]
              //   self.letterBrandList[i].words = "查看更多"
              // }
              if (res.data.data.i == undefined) {
                self.letterBrandList.I.list = "";
              }
              self.letterBrandList.A.list = res.data.data.a;
              self.letterBrandList.B.list = res.data.data.b;
              self.letterBrandList.C.list = res.data.data.c;
              self.letterBrandList.D.list = res.data.data.d;
              self.letterBrandList.E.list = res.data.data.e;
              self.letterBrandList.F.list = res.data.data.f;
              self.letterBrandList.G.list = res.data.data.g;
              self.letterBrandList.H.list = res.data.data.h;
              //self.letterBrandList.I.list = res.data.data.i;
              self.letterBrandList.J.list = res.data.data.j;
              self.letterBrandList.K.list = res.data.data.k;
              self.letterBrandList.L.list = res.data.data.l;
              self.letterBrandList.M.list = res.data.data.m;
              self.letterBrandList.N.list = res.data.data.n;
              self.letterBrandList.O.list = res.data.data.o;
              self.letterBrandList.P.list = res.data.data.p;
              self.letterBrandList.Q.list = res.data.data.q;
              self.letterBrandList.R.list = res.data.data.r;
              self.letterBrandList.S.list = res.data.data.s;
              self.letterBrandList.T.list = res.data.data.t;
              self.letterBrandList.U.list = res.data.data.u;
              self.letterBrandList.V.list = res.data.data.v;
              self.letterBrandList.W.list = res.data.data.w;
              self.letterBrandList.X.list = res.data.data.x;
              self.letterBrandList.Y.list = res.data.data.y;
              self.letterBrandList.Z.list = res.data.data.z;
            })
          },

          history(){
            let self = this;
            self.$ajax({
              method:"post",
              url:this.$apiGoods + "goods/recommendBrand",
              params:{},
            }).then(function(res){
              self.brandList = res.data.data;
            });  
          },

          //选择字母列表品牌名
          selects(e,id){
            console.log(id);
            this.brandNameId = id;
            let data = {
              flag2:true,
              brandId2:id,
              brandName2:e.target.innerText
            }
            this.$emit('searchBrand',data);
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
  height: 100%;
  padding: 0 .3rem .3rem .1rem;
  font-size: .4rem;
}
.brand span{
  margin-left: 2.3rem;
}
.brand img{ 
  width: .7rem;
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
