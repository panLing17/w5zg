<template lang="pug">
  .userinfo
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="routerback()")
      .topCenter(slot="center") 用户资料
    .avatar
      ul.wrap(@click="select(1)")
        li.left 头像
        li.right
          span.pic
            img(:src="userData.mi_head_sculpture | img-filter")
          img(src="../../../assets/img/next@2x.png")
    .nickname
      ul.wrap(@click="routergo()")
        li.left 昵称
        li.right
          span.name {{userData.mi_name}}
          img(src="../../../assets/img/next@2x.png")
    .gender
      ul.wrap(@click="select(3)")
        li.left 性别
        li.right
          span.sex {{userData.mi_sex}}
          img(src="../../../assets/img/next@2x.png")
    .birthDay
      ul.wrap
        li.left 出生日期
        li.right
          span.day {{userData.mi_birthday}}
          img(src="../../../assets/img/next@2x.png")
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .select(v-show="shows")
        ul
          li.first(@click="type($event)")
          li.second(@click="type($event)")
          li.cancel(@click="type($event)") 取消
    pdSelectBox
    pdSelectItem
    .oDiv(ref="refCon")
</template>

<script>
  import pdSelectBox from './selectBox.vue'
  import pdSelectItem from './selectitem.vue'
  import {mapState} from  'vuex'
  export default {
    name: "userinfo",
    computed: mapState(['userData']),
    components:{pdSelectBox,pdSelectItem},
    data(){
      return{
        show:'',
        shows:'',
        name:this.$route.query.routeParams
      }
    },
    created(){
      this.$nextTick(()=>{
        console.log(this.$refs.refCon);
      })
    },
    methods:{
      select:function(num){
        console.log(this.shows);
        this.shows = true;
        console.log(this.shows);
        if (num == 1) {
          var second = document.getElementsByClassName("second")[0];
          document.getElementsByClassName("first")[0].innerHTML = "相机";
          second.innerHTML = "选择相册";
          var inputs = document.createElement("input");
          inputs.setAttribute("type","file");
          second.append(inputs);
          second.style.position = "relative";

          inputs.style.cssText += "width: 90%;position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: 0 auto;opacity: 0;"
        }
        if (num == 3) {
          document.getElementsByClassName("first")[0].innerHTML = "男";
          document.getElementsByClassName("second")[0].innerHTML = "女";
        }
      },

      function (){
        var second = document.getElementsByClassName("second")[0];
        if (second.innerHTML == "选择相册") {
          var inputs = document.createElement("input");
          inputs.setAttribute("type","file");
          second.append(inputs);
        }
      },


      type:function(e){
        if (e.target.innerHTML=="男"||e.target.innerHTML=="女") {
          document.getElementsByClassName("sex")[0].innerHTML = e.target.innerHTML;
        }
          this.shows = false;
      },

      routergo:function(){
        this.$router.push({
           name: '我的昵称',
           query: {
              routeParams: this.name
           }
        });
      },

      routerback:function(){
        this.$router.push({
           name: '我的',
           query: {
              routeParams: this.name
           }
        });
      },


    }
  }
</script>

<style scoped>
  .bg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
  }
  .userinfo{
    width: 100%;
    min-height: 100vh;
  	background-color: #fff;
    position: absolute;
    z-index: 100;
  }
  .userinfo .topCenter{
    font-size: .5rem;
    font-weight: 400;
    color: rgb(51,51,51);
  }
  /*用户头像,昵称,性别,出生日期共同样式--开始*/
  .avatar,
  .nickname,
  .gender,
  .birthDay{
    height: 2.2rem;
    padding: 0 .3rem;
    background-color: #fff;
  }
  .avatar ul.wrap,
  .nickname ul.wrap,
  .gender ul.wrap,
  .birthDay ul.wrap{
    height: 2.2rem;
    line-height: 2.2rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(204,204,204);
  }
  .avatar ul.wrap li.left,
  .nickname ul.wrap li.left,
  .gender ul.wrap li.left,
  .birthDay ul.wrap li.left{
    font-size: .4rem;
  }
  .avatar ul.wrap li.right img,
  .nickname ul.wrap li.right img,
  .gender ul.wrap li.right img,
  .birthDay ul.wrap li.right img{
    width: .2rem;
    vertical-align: middle;
    margin-left: .4rem;
    margin-top: -.1rem;
  }
  /*用户头像,昵称,性别,出生日期共同样式--结束*/
  /*用户头像独立样式--开始*/
  .avatar ul.wrap li.right span.pic{
    display: inline-block;
    width: 1.3rem;
    height: 1.3rem;
    background-color: #aaa;
    border-radius: 50%;
    vertical-align: middle;
  }
  .pic img{
    width: 100% !important;
    height: 100% !important;
    vertical-align: baseline !important;
    margin-left: 0 !important;
    margin-top: 0 !important;
  }
  /*用户头像独立样式--结束*/
  /*昵称,性别,出生日期共同的样式--开始*/
  .nickname,
  .gender,
  .birthDay{
    height: 1.4rem;
  }
  .nickname ul.wrap,
  .gender ul.wrap,
  .birthDay ul.wrap{
    height: 1.4rem;
    line-height: 1.4rem;
  }
  .nickname ul.wrap li.right span.name,
  .gender ul.wrap li.right span.sex,
  .birthDay ul.wrap li.right span.day{
    color: rgb(176,176,176);
    font-size: .35rem;
  }
  /*昵称,性别,出生日期共同的样式--结束*/
  /*下方出现的选择及蒙板--开始*/
  .select{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3);
  }
  .select ul{
    width: 100%;
    height: 5rem;
    position: absolute;
    bottom: 1.6rem;
    padding-top: .37rem;
  }
  .select ul li{
    margin: 0 auto;
    width: 9rem;
    height: 1.4rem;
    background-color: #fff;
    text-align: center;
    line-height: 1.4rem;
    color: rgb(245,0,87);
    font-size: .5rem;
  }
  .select ul li.first{
    border-top-left-radius: .3rem;
    border-top-right-radius: .3rem;
    border-bottom: .25px solid rgb(234,234,236);
  }
  .select ul li.second{
    border-bottom-left-radius: .3rem;
    border-bottom-right-radius: .3rem;
    border-top: .25px solid rgb(234,234,236);
    position: relative;
  }
  .select ul li.second input{
    width: 90%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    opacity: 0;
  }
  .select ul li.cancel{
    border-radius: .3rem;
    margin-top: .2rem;
    color: rgb(255,128,171);
  }
  /*下方出现的选择及蒙板--结束*/
</style>
