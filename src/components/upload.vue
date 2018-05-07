<template lang="pug">
  .uploadList
    .uploadBox(v-for="(item,index) in urlList", :key="index")
      input(type="file", @change="uploadPhoto($event,index)", v-if="!item.url")
      .box
        transition-group(tag="div",  enter-active-class="animated fadeInDown")
          .successImg( v-if="item.url", key="one")
            img(:src="item.url | img-filter", @click="item.edit = !item.edit")
            .delete(v-if="item.edit", @click="item.edit = !item.edit")
              p(@click="remove(index)") 删除
          img(src="../assets/img/add@2x.png", v-else, key="two" style="width:1rem; vertical-align:middle")
</template>

<script>
  // import Qs from 'qs'
  export default {
    name: "upload",
    data () {
      return {
        urlList:[
          {
            url: '',
            edit: false,
          }
        ]
      }
    },
    props:{
      name: {
        type: String,
        default: 'imagefile'
      },
      url: {
        type: String,
        default: ''
      },
      max: {
        type: Number,
        default:5
      },
      type: {
        type: Array,
        default() {
          return ['png', 'jpg', 'gif', 'jpeg' ,'bmp']
        }
      }
    },
    methods:{
      uploadPhoto (e,index) {
        // 校验格式，格式不对直接跳出
        let type = e.target.files[0].name.substr(e.target.files[0].name.lastIndexOf('.')+1)
        type = type.toLowerCase()
        if (this.type.indexOf(type) === -1) {
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
            _this.upload(temp, index)
          });
        }else{ //小于等于1M 原图上传
          this.upload(fileObj, index)
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
      /**
       * 将以base64的图片url数据转换为Blob
       * @param urlData
       *            用url方式表示的base64图片数据
       */
      convertBase64UrlToBlob (urlData) {
        let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
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
      upload (blobFile, index) {
        // 请求
        let self = this
        let data = new FormData()
        data.append(self.name, blobFile)
        data.append('W5MALLTOKEN', localStorage.getItem('token'))
        this.$ajax({
          method: 'post',
          url: self.$apiTransaction + self.url,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          processData: false,
        }).then(function (response) {
          if (response.data.code === '081') {
            self.urlList[index].url = response.data.data
            if (self.urlList.length < self.max) {
              self.urlList.push({
                url: '',
                edit: false
              })
            }
            // 请求成功后回调
            let array = []
            self.urlList.forEach((now,index)=>{
              array.push(now.url)
            })
            if (array[array.length-1].url === '') {
              array.splice(array.length-1,1)
            }
            self.$emit('success',array)
          }else {
            self.$message.error(response.data.msg)
          }

        })
      },
      remove (index) {
        this.urlList.splice(index,1)
        let data = this.urlList
        if (data.length < this.max) {
          if (data[data.length-1].url !== '') {
            data.push({
              url: '',
              edit: false
            })
          }
        }
        // 删除后回调
        let array = []
        this.urlList.forEach((now,index)=>{
          array.push(now.url)
        })
        array.splice(array.length-1,1)
        this.$emit('delete',array)
      }
    }
  }
</script>

<style scoped>
  .uploadList {
    display: flex;
    flex-wrap: wrap;
  }
  .uploadBox {
    flex: none;
    position: relative;
    overflow: hidden;
    /*display: inline-block;*/
    margin-right: .2rem;
    background-color: rgb(234,234,234);
  }
  .uploadBox input{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
  .box {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
  }
  .box img{
    width: 100%;
    height: 100%;
  }
  /* 成功请求后 图片样式 */
  .successImg {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .successImg img{
    width: 2rem;
    height: 2rem;
  }
  .delete {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

</style>
