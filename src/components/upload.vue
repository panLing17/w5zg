<template lang="pug">
  .uploadBox
      input(type="file", @change="uploadPhoto")
      .box
        img(src="../assets/img/camera@3x.png")
</template>

<script>
  import Qs from 'qs'
  export default {
    name: "upload",
    props:{
      name: {
        type: String,
        default: 'imagefile'
      },
      url: {
        type: String
      }
    },
    methods:{
      uploadPhoto (e) {
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
          alert(1)
        })
      }
    }
  }
</script>

<style scoped>
  .uploadBox {
    position: relative;
    overflow: hidden;
    display: inline-block;
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
  }
  .box img{
    width: 100%;
    height: 100%;
  }
</style>
