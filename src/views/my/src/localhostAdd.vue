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
      li(@click="show = true")
        label 地址&nbsp;&nbsp; <input type="text" v-model="locationName"  placeholder='请选择' disabled="disabled">
        img(src="" )
        .clickHack
      li(style="height:2rem")
        label.detailed(style="height:2rem") 详细地址 <textarea v-model="form.detailedAddr"></textarea>
      li(v-if="false")
        label 邮政编码 <input type="text" v-model="zipCode" placeholder='(选填)'>
      <!--li.checkbox-->
        <!--a(@click.stop="locationDefault(item.addressId , item.isdefault)")-->
          <!--w-checkbox(v-model="isdefault")-->
        <!--span 设为默认-->
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
        },
        requestFlag: true
      }
    },
    components: {citySelect},
    mounted(){
      if (this.$route.query.id) {
        this.getBase()
        this.title = '修改收货地址'
      }
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      getBase () {
        let self = this
        this.form.addressId = this.$route.query.id
        this.form.name = this.$store.state.transfer.ra_name
        this.form.phone = this.$store.state.transfer.ra_phone
        this.form.province = this.$store.state.transfer.ra_province
        this.form.city = this.$store.state.transfer.ra_city
        this.form.county = this.$store.state.transfer.ra_county
        this.form.detailedAddr = this.$store.state.transfer.ra_detailed_addr
        if (this.$store.state.transfer.ra_default) {
          this.isdefault = true
        } else {
          this.isdefault = false
        }

        this.locationName = `${self.$store.state.transfer.province_name},${self.$store.state.transfer.city_name},${self.$store.state.transfer.county_name}`
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
        if (!this.form.name) {
          this.$message.error('请输入收货人姓名')
          return
        }
        if (!/^1[0-9]{10}$/.test(this.form.phone)) {
          this.$message.error('请输入正确手机号')
          return
        }
        if (!this.locationName) {
          this.$message.error('请选择省市区')
          return
        }
        if (!this.form.detailedAddr) {
          this.$message.error('请输入详细地址')
          return
        }

        let self = this
        if (!this.requestFlag) {
          return
        }
        this.requestFlag = false
        let method = this.$route.query.id ? 'put' : 'post'
        if (this.isdefault) {
          this.form.isDefault = '1'
        } else {
          this.form.isDefault = '0'
        }
        self.$ajax({
          method:  method,
          url: self.$apiMember + 'receivingAddress/address',
          params: self.form,
        }).then(function (response) {
          self.requestFlag = true
          if (response) {
            self.$router.go(-1)
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
    overflow-y: hidden;
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
  /* 选择地址点击事件hack */
  .clickHack {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
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
