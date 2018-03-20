<template lang="pug">
  .localhostAddBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 添加收货地址
      .topRight(slot="right")
    ul.form
      li
        label 联系人&nbsp; <input type="text" v-model="name">
      li
        label 联系电话 <input type="text" v-model="mobile">
    ul.form.bottomForm
      li
        label(@click="locationSelect") 地址&nbsp;&nbsp; <input type="text" v-model="locationName" placeholder='请选择' disabled="disabled">
        img(src="" )
      li(style="height:2rem")
        label(style="height:2rem") 详细地址 <textarea v-model="address"></textarea>
      li
        label 邮政编码 <input type="text" v-model="mobile" placeholder='(选填)'>
      li.checkbox
        a(@click.stop="locationDefault(item.addressId , item.isdefault)")
          w-checkbox(v-model="isdefault")
        span 设为默认
    .bottomButton
      w-button 保存
    .selectBox(v-if="locationBox")
      w-top(background="white")
        .topLeft(slot="left", @click="hideSelect")
          img.topLeft(src="" )
        .topCenter(slot="center") {{selectType}}
        .topRight(slot="right")
      ul
        li(v-for="item in locationList" , @click="locationNext(item)") {{item}}
</template>

<script>
  import locationList from '../../../utils/locationJson.js'
  export default {
    name: "localhost-add",
    data(){
      return {
        title:'',
        selectType: '选择省',
        locationBox: false ,
        locationList: [],
        addressId: '',
        name: '',
        mobile: '',
        isdefault: false,
        locationName: ' ',
        provinceName: ' ',
        cityName: ' ',
        areaName: ' ',
        address: '',
        type: '0',
      }
    },
    mounted(){
      this.getProvince()
      this.getBase()
      this.$route.query.id ? this.addressId = this.$route.query.id : this.addressId =''
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      getBase () {
        if (this.$route.query.id) {
          this.title = '修改收货地址'
          this.name = this.$store.state.transfer.name
          this.mobile = this.$store.state.transfer.mobile
          this.provinceName = this.$store.state.transfer.provice
          this.cityName = this.$store.state.transfer.city
          this.areaName = this.$store.state.transfer.area
          this.address = this.$store.state.transfer.address
          this.locationName = this.provinceName +''+  this.cityName + ''+ this.areaName
          this.type = '1'
        } else {
          this.title = '添加收货地址'
        }
      },
      hideSelect () {
        this.locationBox = false
        this.locationList = []
      },
      getProvince () {
        this.selectType = '选择省'
        for(let i in locationList){
          this.locationList.push(i)
        }
      },
      goLocalhostAdd(){
        this.$router.push("/my/localhostAdd")
      },
      locationSelect () {
        this.locationBox = true
        this.getProvince()
      },
      locationNext (name) {
        this.locationList = []
        if (this.selectType === '选择区') {
          this.areaName = name
          this.locationName = this.provinceName+this.cityName+this.areaName
          this.locationBox = false
        }
        if (this.selectType === '选择市') {
          this.cityName = name
          this.selectType = '选择区'
          for(let b in locationList[this.provinceName][name]){
            this.locationList.push(locationList[this.provinceName][name][b])
          }
        }
        if (this.selectType === '选择省') {
          this.provinceName = name
          this.selectType = '选择市'
          for(let a in locationList[name]){
            this.locationList.push(a)
          }
        }
      },
      locationSave () {
        let _this = this
        _this.$ajax({
          method: 'post',
          url: 'memberAddress/addOrEditAddressForAndroid',
          params: {
            addressId: _this.addressId,
            name: _this.name,
            mobile: _this.mobile,
            provinceName: _this.provinceName,
            cityName: _this.cityName,
            areaName: _this.areaName,
            address: _this.address,
            isdefault: '0',
            type: _this.type
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          if (response.data.code === '100') {
            _this.$router.push('/my/localhostAdmin')
          }
        })
      }
    }
  }
</script>

<style scoped>
  .localhostAddBox{
    min-height: 100vh;
    background: rgb(242,242,242);
    position: relative;
    z-index: 100;
  }
  .topLeft{
    width: .2rem;
    margin-left: .2rem;
  }
  .topRight{
    margin-right: .2rem;
  }
  .form{

  }
  .form>li{
    position: relative;
    background: white;
    padding: 0 .3rem;
    height: 1.2rem;
    display: flex;
    align-items: center;
  }
  .form>li label{
    height: 1.2rem;
    line-height: 1.2rem;
    border-bottom: solid 1px #eee;
    width: 100%;
  }
  .form>li input{
    border: none;
    background: none;
    outline:none;
    height: .6rem;
    padding-left: .3rem;
    width: calc(100% - 2rem);

  }
  .bottomForm{

  }
  .bottomForm>li img{
    position: absolute;
    right: .3rem;
    width: .3rem;
  }
  .heightInput{
    height: 2rem;
  }
  .bottomForm textarea{
    margin-top: .3rem;
    background: none;
    border: none;
    outline:none;
    width: calc(100% - 2rem);
    height: 1.2rem;
  }
  .checkbox {
    display: flex;
    align-items: center;
  }
  .checkbox span{
    margin-left: 5px;
  }
  .bottomButton {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
  }
    /* 省市区选择 */
  .selectBox{
    padding-top: 1.3rem;
    height: 100vh;
    width: 100%;
    animation: change .3s;
    background: white;
    position: fixed;
    overflow-y: auto;
    top: 0;
    left: 0;
    z-index: 10000;
  }
  .selectBox>ul{

  }
  .selectBox>ul>li{
    line-height: 1.2rem;
    padding: 0 .3rem;
    border-bottom: solid 1px #eee;
  }
  @keyframes change {
    from {opacity: 0}
    to {opacity: 1}
  }
</style>
