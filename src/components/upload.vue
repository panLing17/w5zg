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
            edit: false
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
          return ['png', 'jpg']
        }
      }
    },
    methods:{
      uploadPhoto (e,index) {
        // 校验格式，格式不对直接跳出
        let type = e.target.files[0].name.split('.')[1]
        if (this.type.indexOf(type) === -1) {
          return false
        }
        // 请求
        let self = this
        let data = new FormData()
        data.append(self.name, e.target.files[0])
        this.$ajax({
          method: 'post',
          url: self.$apiTransaction + self.url,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          processData: false,
        }).then(function (response) {
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
          array.splice(array.length-1,1)
          self.$emit('success',array)
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
  .uploadBox {
    position: relative;
    overflow: hidden;
    display: inline-block;
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
