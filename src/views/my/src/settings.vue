<template lang="pug">
  .settings
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="goBackPage")
      .topCenter(slot="center") 设置
    .avatar
      ul.wrap(@click="routergoUser()")
        li.left
          span.pic
            img(:src="userData.mi_head_sculpture | img-filter")
        li.right
          span.name {{name}}
          img(src="../../../assets/img/next@2x.png")
    .accountBind
      ul.wrap(@click="notOpen()")
        li.left 账户绑定
        li.right
          img(src="../../../assets/img/next@2x.png")
    .accountSafety
      ul.wrap(@click="$router.push('/my/accountSafety')")
        li.left 账户安全
        li.right
          img(src="../../../assets/img/next@2x.png")
    .addressAdmin
      ul.wrap(@click="$router.push('/my/localAdmin')")
        li.left 地址管理
        li.right
          img(src="../../../assets/img/next@2x.png")
    .feedback
      ul.wrap(@click="$router.push('/my/feedback')")
        li.left 意见反馈
        li.right
          img(src="../../../assets/img/next@2x.png")
    .aboutUs
      ul.wrap(@click="$router.push('/my/aboutUs')")
        li.left 关于我们
        li.right
          img(src="../../../assets/img/next@2x.png")
    .logOut
      w-button(@click="logout") 退出登录
</template>
<script>
  import {mapState} from  'vuex'
  export default {
    name: 'settings',
    data () {
      return {
        name:this.$route.query.routeParams
      }
    },
    computed: mapState(['userData']),
    mounted () {

    },
    methods: {
      goBackPage:function(){
        this.$router.push('/my')
      },
      routergoUser:function(){
      	this.$router.push({
           name: '我的用户资料',
           query: {
              routeParams: this.name
           }
        });
      },
      notOpen:function(){
        var layer=document.createElement("div");
        layer.id="layer";
        layer.innerHTML="此功能未开放"
            var style={
                background:"rgba(0,0,0,0.2)",
                position:"fixed",
                zIndex:101,
                width:"4rem",
                height:"1rem",
                left:"3rem",
                bottom:"2rem",
                textAlign:"center",
                lineHeight:"1rem",
                color:"#fff",
                borderRadius:".5rem"
            }
            for(var i in style)
                layer.style[i]=style[i];
            if(document.getElementById("layer")==null){
                document.body.appendChild(layer);
                setTimeout("document.body.removeChild(layer)",2000);
            }
      },
      logout () {
        localStorage.clear()
        this.$router.push('/my')
      }
    }
  }
</script>

<style scoped>
  .settings{
    width: 100%;
    min-height: 100vh;
  	background-color: rgb(242,242,242);
    position: absolute;
    z-index: 100;
  	overflow: scroll;
  }
  .settings .topCenter{
  	font-size: .5rem;
  	font-weight: 400;
  	color: rgb(51,51,51);
  }
  /*账户安全,意见反馈,关于我们的上边距--开始*/
  .accountSafety,
  .feedback,
  .aboutUs{
  	margin-top: .3rem;
  }
  /*账户安全,意见反馈,关于我们的上边距--结束*/
  /*用户头像,账户安全,意见反馈,地址管理,关于我们共同样式--开始*/
  .avatar,
  .accountBind,
  .accountSafety,
  .addressAdmin,
  .feedback,
  .aboutUs{
    height: 2.2rem;
    padding: 0 .3rem;
    background-color: #fff;
  }
  .avatar ul.wrap,
  .accountBind ul.wrap,
  .accountSafety ul.wrap,
  .addressAdmin ul.wrap,
  .feedback ul.wrap,
  .aboutUs ul.wrap{
    height: 2.2rem;
    line-height: 2.2rem;
    display: flex;
    justify-content: space-between;
  }
  .avatar ul.wrap li.left,
  .accountBind ul.wrap li.left,
  .accountSafety ul.wrap li.left,
  .addressAdmin ul.wrap li.left,
  .feedback ul.wrap li.left,
  .aboutUs ul.wrap li.left{
    font-size: .4rem;
  }
  .avatar ul.wrap li.right img,
  .accountBind ul.wrap li.right img,
  .accountSafety ul.wrap li.right img,
  .addressAdmin ul.wrap li.right img,
  .feedback ul.wrap li.right img,
  .aboutUs ul.wrap li.right img{
    width: .2rem;
    vertical-align: middle;
    margin-left: .4rem;
    margin-top: -.1rem;
  }
  /*用户头像,账户安全,意见反馈,地址管理,关于我们共同样式--结束*/
  /*用户头像独立样式--开始*/
  .avatar ul.wrap li.left span.pic{
    display: inline-block;
    width: 1.3rem;
    height: 1.3rem;
    background-color: #aaa;
    border-radius: 50%;
    vertical-align: middle;
  }
  .avatar ul.wrap li.right span.name{
  	display: inline-block;
  	font-size: .4rem;
  	color: rgb(153,153,153);
  }
  .pic img {
    width: 100%;
    height: 100%;
  }
  /*用户头像独立样式--结束*/
  /*昵称,性别,出生日期共同的样式--开始*/
  .accountBind,
  .accountSafety,
  .addressAdmin,
  .feedback,
  .aboutUs{
    height: 1.4rem;
  }
  .accountBind ul.wrap,
  .accountSafety ul.wrap,
  .addressAdmin ul.wrap,
  .feedback ul.wrap,
  .aboutUs ul.wrap{
    height: 1.4rem;
    line-height: 1.4rem;
  }

  /*昵称,性别,出生日期共同的样式--结束*/
  /*用户头像,账户安全下方的边框--开始*/
  .avatar ul.wrap,
  .accountSafety ul.wrap{
	  border-bottom: 1px solid rgb(204,204,204);
  }
  /*用户头像,账户安全下方的边框--结束*/
  /*退出登录--开始*/
  .logOut{
    display: flex;
    justify-content: center;
    margin: 1.6rem auto;
  }
  /*退出登录--结束*/
</style>
