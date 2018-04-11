<template lang="pug">
  .filtrate 
    .wrap(v-show="downList")
      .brand(@click="down()") 
        span 品牌
        img(src="../../../assets/img/right.png")
      .brandList
        ul
          li(v-for="(item,index) in brandList" :class="{active:num1 == index}" @click="check(index,$event)") {{item.bi_name}}
            .brandNameId(v-show="false") {{item.bi_id}}
      .price 价格区间
      .priceContent
        input(type="text" placeholder="最小金额" onkeyup="this.value=this.value.replace(/[^0-9-]/g,'')").min
        span ~
        input(type="text" placeholder="最大金额" onkeyup="this.value=this.value.replace(/[^0-9-]/g,'')").max
        ul
          li(v-for="(item,index) in price" :class="{active:num2 == index}" @click="checks(index,$event)").sections {{item}}
      .support 支持自提
        ul
          li(v-for="(item,index) in support" :class="{active:num3 == index}" @click="toggle(index,$event)") {{item}}  
    .button(v-show="downList")
      .reset(@click="reset()") 重置
      .affirm(@click="hide()") 确认             
</template>

<script>
    export default {
        name: "filtrate",
        props: {
          show: {
            type: Boolean,
            default: false
          }
        },
        data(){
          return{
            brandNameId:"",
            minVal:"",
            maxVal:"",
            pickUp:"",
            downList:true,
            brandName:false,
            num:9,
            num1:null,
            num2:null,
            num3:null,
            brandList:["阿迪达斯","耐克","金利来","丹尼尔·惠灵顿","阿迪达斯","耐克","金利来","丹尼尔·惠灵顿"],
            price:["0~500","500~1000","1000~2000","2000~5000","5000以上"],
            support:["可自提","不可自提"]
          }
        },
        mounted(){
          //品牌名
          this.brandNames();
          document.getElementsByClassName("filtrate")[0].style.overflow = "scroll";
        },
        methods:{
          //加载品牌名
          brandNames(){
            let self = this;
            self.$ajax({
              method:"post",
              url:self.$apiClassify + "goods/recommendBrand",
              params:{}
            }).then(function(res){
              console.log(res.data.data);
              self.brandList = res.data.data;
            })
          },
          //点击品牌名
          check(index,e){
            console.log(e.target.children[0].innerText);
            this.num1 = index;
            this.brandNameId = e.target.children[0].innerText;
          },
          //点击价格区间
          checks(index,e){
            this.num2 = index;
            console.log(e.target.innerText);
            var rel = e.target.innerText.split("~");
            console.log(parseInt(rel[1]));
            var min = document.getElementsByClassName("min")[0];
            var max = document.getElementsByClassName("max")[0];
            min.value = parseInt(rel[0]);
            this.minVal = min.value;
            if (isNaN(parseInt(rel[1]))) {
              max.value = "";
              this.maxVal = max.value;
            } else {
              max.value = parseInt(rel[1]);
              this.maxVal = max.value;
            }
          },
          //自提不自提
          toggle(index,e){
            this.num3 = index;
            this.pickUp = e.target.innerText;
          },
          reset(){
            this.num1 = null;
            this.num2 = null;
            this.num3 = null;
            var min = document.getElementsByClassName("min")[0];
            var max = document.getElementsByClassName("max")[0];
            min.value = "";
            max.value = "";
            this.minVal = min.value;
            this.maxVal = max.value;
            this.pickUp = "";
            this.brandNameId = ""; 
          },
          hide(){
            let data = {
              flag1 : true,
              brandId : this.brandNameId,
              minPrice : this.minVal,
              maxPrice : this.maxVal,
              pickUps : this.pickUp
            };
            this.$emit('ievent',data);

          },
          down(){
            let data = {
              a : 1
            };    
            this.$emit("showSon",data);
          },
          

        }
    }
</script>

<style scoped>
.active{
  color: #fff !important;
  background-color: rgb(255,128,171) !important;
}
.filtrate{
  width: 100%;
  height: 100%;
  background-color: #fff;
  /*float: right;*/
  z-index: 101;
}
.filtrate .wrap{
  padding: .5rem 0 2.9rem;
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
.support ul,
.priceContent ul,
.brandList ul{
  display: flex;
  padding: 0 .3rem;
  flex-wrap: wrap;
}
.support ul li,
.priceContent ul li,
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
.priceContent ul,
.support ul{
  padding: 0;
}
/*品牌--结束*/
/*价格区间--开始*/
.price{
  font-size: .4rem;
  padding: 0 .3rem;
  margin-top: .7rem;
}
.priceContent{
  padding: .4rem .3rem 0;
  display: flex;
  flex-wrap: wrap;
}
.priceContent input{
  width: 2.4rem;
  height: .8rem;
  border-width: 1px;
  border-color: rgb(204,204,204);
  font-size: .1rem;
  outline: none;
  text-indent: .1rem;
}
.priceContent span{
  display: inline-block;
  line-height: .8rem;
  font-size: .45rem;
  margin: 0 .3rem;
}
/*价格区间--结束*/
/*支持自提--开始*/
.support{
  font-size: .4rem;
  padding: 0 .3rem;
  margin-top: .7rem;
}
/*支持自提--结束*/
/*重置,确认--开始*/
.button{
  position: fixed;
  bottom: 0;
  width: 70%;
  height: 1.35rem;
  border: 1px solid rgb(244,0,87);
  display: flex;
}
.button div{
  width: 50%;
  text-align: center;
  font-size: .4rem;
  line-height: 1.35rem;
}
.button .reset{
  color: rgb(244,0,87);
  background-color: #fff;
}
.button .affirm{
  background-color: rgb(244,0,87);
  color: #fff;
}
/*重置,确认--结束*/

/*商品名列表--开始*/
.wrapToggle{
  padding: .5rem 0 2.9rem;
  position: relative;
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
  top: 3rem;
  right: 0;
}
.letter li{
  color: rgb(255,128,171);
  font-size: .4rem;
}
/*右边显示的字母--结束*/
</style>
