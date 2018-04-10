<template lang="pug">
  .localhostAddBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{title}}
      .topRight(slot="right")
    ul.form
      li
        label 联系人&nbsp; <input type="text" v-model="form.name">
      li
        label 联系电话 <input type="text" v-model="form.phone">
    ul.form.bottomForm
      li
        label(@click="show=!show") 地址&nbsp;&nbsp; <input type="text" v-model="locationName" placeholder='请选择' disabled="disabled">
        img(src="" )
      li(style="height:2rem")
        label.detailed(style="height:2rem") 详细地址 <textarea v-model="form.detailedAddr"></textarea>
      li
        label 邮政编码 <input type="text" v-model="zipCode" placeholder='(选填)'>
      li.checkbox
        a(@click.stop="locationDefault(item.addressId , item.isdefault)")
          w-checkbox(v-model="isdefault")
        span 设为默认
    .bottomButton
      w-button(@click="locationSave") 保存
    city-select(:show="show", @close="show=false", @change="cityChange")
</template>

<script>
  import citySelect from './citySelect'
  export default {
    name: "localhost-add",
    data(){
      return {
        title: '添加收货地址',
        show: false,
        isdefault: false,
        locationName: '',
        zipCode: '',
        form: {
          name: '',
          phone: '',
          province: '',
          city: '',
          county: '',
          detailedAddr: '',
          isDefault: ''
        }
      }
    },
    components: {citySelect},
    mounted(){
      if (this.$route.query.id) {
        this.getBase()
      }
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      getBase () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'receivingAddress/address',
          params: {},
        }).then(function (response) {

        })
      },
      // 选择城市结束
      cityChange (data) {
        this.locationName = [data.pro.name,data.city.name,data.area.name].join('，')
        this.form.province = data.pro.number
        this.form.city = data.city.number
        this.form.county = data.area.number
        this.show = false
      },
      locationSave () {
        let self = this
        if (this.isdefault) {
          this.form.isDefault = '011'
        } else {
          this.form.isDefault = '012'
        }
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'receivingAddress/address',
          params: self.form,
        }).then(function (response) {
          self.$router.push('/my/localAdmin')
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
  /* 详细地址 */
  .detailed {
    display: flex;
    justify-content: space-between;
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
