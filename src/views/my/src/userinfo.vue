<template lang="pug">
  .userinfo
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 用户资料
    .avatar
      ul.wrap(@click="select(1)")
        li.left 头像
        li.right
          span.pic
            img(:src="userData.mi_head_sculpture | img-filter")
          img(src="../../../assets/img/next@2x.png")
      input(type="file", @change="uploadPhoto")
    .nickname
      ul.wrap(@click="routergo()")
        li.left 昵称
        li.right
          span.name {{userData.mi_nickname}}
          img(src="../../../assets/img/next@2x.png")
    .gender
      ul.wrap(@click="show = true")
        li.left 性别
        li.right
          span.sex {{sex}}
          img(src="../../../assets/img/next@2x.png")
    .birthDay(v-if="false")
      ul.wrap
        li.left 出生日期
        li.right
          span.day {{userData.mi_birthday}}
          img(src="../../../assets/img/next@2x.png")
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .seleteBg(v-if="show", @click="show = false")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .seleteMain(v-if="show")
        w-button(@click="selectSex('021')") 男
        w-button(@click="selectSex('022')") 女
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "userinfo",
    computed: { sex () {
        if (this.userData.mi_sex === 'm') {
          return '男'
        } else {
          return '女'
        }
      },
      // 使用对象展开运算符将此对象混入到外部对象中
      ...mapState(['userData'])
    },
    data(){
      return{
        show: false,
        name: this.$route.query.routeParams
      }
    },
    created(){
      this.$nextTick(()=>{
        console.log(this.$refs.refCon);
      })
    },
    methods:{
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
      // 选择性别
      selectSex (s) {
        // 关闭选择
        this.show = false
        // m为男，w为女
        let self = this
        self.$ajax({
          method: 'patch',
          url: self.$apiMember + 'member/memberProperty',
          params: {
            propertyName: 'sex',
            value: s
          },
        }).then(function (response) {
          self.getUserData()
        })
      },
      /* 上传头像 */
      // uploadPhoto (e) {
      //   // 请求
      //   let self = this
      //   let data = new FormData()
      //   data.append('imageFile', e.target.files[0])
      //   this.$ajax({
      //     method: 'post',
      //     url: self.$apiMember + 'member/uploadAvatar',
      //     data: data,
      //     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      //     processData: false,
      //   }).then(function (response) {
      //     self.headPicChange(response.data.data)
      //   })
      // },





      uploadPhoto (e) {
        // 校验格式，格式不对直接跳出
        let type = e.target.files[0].name.substr(e.target.files[0].name.lastIndexOf('.')+1)
        type = type.toLowerCase()
        if (['png', 'jpg', 'gif', 'jpeg' ,'bmp'].indexOf(type) === -1) {
          this.$message.error('上传图片格式不支持！')
          return false
        }

        let _this = this
        let fileObj = e.target.files[0]; // js 获取文件对象
        if(fileObj.size/1024 > 1025) { //大于1M，进行压缩上传
          this.photoCompress(fileObj, {
            quality: 0.5
          }, function(base64Codes){
            let temp = _this.dataURLtoFile(base64Codes, e.target.files[0].name)
            _this.upload(temp)
          });
        }else{ //小于等于1M 原图上传
          this.upload(fileObj)
        }

      },
      photoCompress(file,w,objDiv){
        let _this = this
        let ready=new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);
        ready.onload=function(e){
          let re= e.target.result.toString();
          _this.canvasDataURL(re,w,objDiv)
        }
      },
      canvasDataURL(path, obj, callback){
        let img = new Image();
        img.src = path;
        img.onload = function(){
          let that = this;
          // 默认按比例压缩
          let w = 150,
            h = 150;
          let quality = 0.7;  // 默认图片质量为0.7
          //生成canvas
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          // 创建属性节点
          let anw = document.createAttribute("width");
          anw.nodeValue = w;
          let anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if(obj.quality && obj.quality <= 1 && obj.quality > 0){
            quality = obj.quality;
          }
          // quality值越小，所绘制出的图像越模糊
          let base64 = canvas.toDataURL('image/', quality);
          // 回调函数返回base64的值
          callback(base64);
        }
      },
      // base64转file
      dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {type:mime});
      },
      upload (blobFile) {
        // 请求
        let self = this
        let data = new FormData()
        data.append('imageFile', blobFile)
        this.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/uploadAvatar',
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          processData: false,
        }).then(function (response) {
          self.headPicChange(response.data.data)
        })
      },

















      /* 修改用户头像 */
      headPicChange (url) {
        let self = this
        self.$ajax({
          method: 'patch',
          url: self.$apiMember + 'member/memberProperty',
          params: {
            propertyName: 'avatar',
            value: url
          },
        }).then(function (response) {
          self.getUserData()
        })
      },
      /* 更新用户信息 */
      getUserData () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          self.$store.commit('userDataChange',response.data.data)
        })
      }
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
    border-bottom: 1px solid #f2f2f2;
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
  .avatar {
    position: relative;
  }
  .avatar input{
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
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
  /* ------------------------ 选择性别 ---------------------------- */
  .seleteBg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
  }

  .seleteMain {
    background-color: white;
    width: 100%;
    height: 4rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
    padding: .5rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
</style>
