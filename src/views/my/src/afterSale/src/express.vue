<template lang="pug">
  .express
    nav-bar
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 填写快递
    <!--.addressee(@click="$router.push('/my/checkAddressee')")-->
      <!--.lefter-->
        <!--.name-->
          <!--span 收件人-->
          <!--span 张三三-->
          <!--span 025-23562356-->
        <!--.address-->
          <!--span 地址-->
          <!--strong 江苏省南京市玄武区 699-22 江苏软件园-->
      <!--.righter-->
        <!--img(src="../../../../../assets/img/right.png")-->
    .logistics
      ul.company(@click="$refs.logistics.showPop()")
        li.left 物流公司
        li.change
          input(type="text", placeholder="请选择", disabled="disabled", v-model="logistics.ultd_name")
      ul.number
        li.left 物流单号
        li.right
          input(type="text", placeholder="请输入物流单号", v-model="numbers")
    .upload
      .up
        span 上传凭证
      w-upload(url="goodsRejected/rejectedImage", :max="1", @success="getImageArr")
    .submit(@click="check") 提交
    <!--logCompany(:show="companyFlag", @selectType="", @close="closeCheckCom()")-->
    pop3(ref="logistics", :data="logisticsData", title="物流公司", item-key="ultd_name", @selected="logisticsChange")
</template>
<script>
  import pop2 from './pop2'
  import pop3 from './pop3'
  export default {
    name: 'express',
    components:{ pop2, pop3},
    data () {
      return {
        logisticsData:[],
        logistics: {},
        imageUrl: '',
        numbers: ''
      }
    },
    mounted () {

    },
    created () {
    //  获取物流公司列表
      this.getLogisticsData()
    },
    methods: {
      getLogisticsData () {
        let _this = this
        this.$ajax({
          method: 'post',
          url: this.$apiMember + 'logisticsThird/api/logistics',
          params:{
            page: 1,
            rows: 500
          }
        }).then(function (response) {
          if (response.data.code === '081') {
              _this.logisticsData = response.data.data
          }else {
            _this.$message.error(response.data.msg);
          }
        })
      },
      logisticsChange (logistics) {
        this.logistics = logistics
      },
      getImageArr (arr) {
        this.imageUrl = arr[0]
      },
      submitInfo () {
        let _this = this
        this.$ajax({
          method: 'post',
          url: this.$apiMember + 'orderLogistics/logistics',
          params:{
            companyId : this.logistics.ultd_id,
            orderOrRejectedId: this.$route.query.id,
            number: this.numbers,
            type: '322',
            ulImage: this.imageUrl
          }
        }).then(function (response) {
          if (response.data.code === '081') {
            _this.updateStatus()
          }else {
            _this.$message.error(response.data.msg);
          }
        })
      },
      check () {
        if (!this.logistics.ultd_id) {
          this.$message.error('请选择物流公司！')
          return
        }
        if (this.numbers.trim().length<=0) {
          this.$message.error('请输入物流单号！')
          return
        }
       this.submitInfo()
      },
      updateStatus () {
        let _this = this
        let form = {
          id: this.$route.query.id,
          company_storeId:this.logistics.ultd_id,
          type:'2'
        }
        this.$ajax({
          method: 'post',
          url: this.$apiTransaction + 'goodsRejected/updateRejected',
          params:form
        }).then(function (response) {
          if (response.data.code === '081') {
            // 跳转到退货列表
            _this.$router.go(-1)
          }else {
            _this.$message.error(response.data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .express{
    width: 100%;
    min-height: 100vh;
    position: absolute;
    z-index: 100;
    background-color: rgb(242,242,242);
  }
  .topCenter{
    font-size: .5rem;
    font-weight: 400;
  }
  .topRight img{
    width: .7rem;
  }
  /*收件人的姓名地址--开始*/
  .addressee{
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: .3rem;
  }
  .addressee .lefter {
    flex: 1;
  }
  .addressee .righter {
    flex: none;
  }
  .addressee .lefter span{
    margin-right: .2rem;
    font-size: .35rem;
    word-wrap: wrap;
  }
  .addressee .lefter span:nth-child(1){
    display: inline-block;
    width: 1.2rem;
    font-size: .4rem;
  }
  .lefter .address{
    margin-top: .2rem;
  }
  .lefter .address strong{
    display: inline-block;
    vertical-align: middle;
    font-weight: 400;
    width: 7rem;
    margin-top: -.1rem;
    color: rgb(153,153,153);
  }
  .righter img{
    width: .6rem;
    margin-top: .35rem;
  }
  /*收件人的姓名地址--结束*/
  /*物流公司--开始*/
  .logistics{
    margin-top: .2rem;
    background-color: #fff;
    padding: 0 .3rem;
  }
  .logistics ul{
    height: 1.5rem;
    font-size: .4rem;
    line-height: 1.5rem;
  }
  .logistics ul.company{
    border-bottom: 1px solid rgb(242,242,242);
    display: flex;
    justify-content: space-between;
  }
  .logistics ul.number{
    border-top: .5px solid rgb(242,242,242);
  }
  /*物流公司--结束*/
  /*图片上传--开始*/
  .upload{
    margin-top: .3rem;
    padding: .2rem .3rem;
    background-color: #fff;
  }
  .upload .up{
    margin-bottom: .2rem;
  }
  .upload .up span:nth-child(1){
    font-size: .4rem;
  }
  .upload .up span:nth-child(2){
    margin-left: .1rem;
    color: rgb(153,153,153);
  }
  /*图片上传--结束*/
  /*下一步--开始*/
  .submit{
    width: 6.5rem;
    height: 1.2rem;
    background-color: rgb(245,0,87);
    border-radius: 1.2rem;
    margin: 2rem auto 0;
    text-align: center;
    line-height: 1.2rem;
    color: #fff;
    font-size: .4rem;
  }
  /*下一步--结束*/
  .logisticsText {
    display: inline-block;
    width: 5rem;
    height: 100%;
  }
  li.left
  {
    flex: none;
  }
  li.right {
    flex: 1;
  }
  .company li.change{
    flex: 1;
    background: url("../../../../../assets/img/right.png") no-repeat center right;
    background-size: .6rem auto;

    padding-right: .8rem
  }
  .number {
    display: flex;
  }
  .right input {
    width: 100%;
    height: 100%;
    text-align: right;
    font-size: .29rem;
    border: none;
    outline: none;
    padding-right: .8rem;
    color: rgb(51,51,51);
  }
  li.change input {
    width: 100%;
    height: 100%;
    background: #fff;
    border: none;
    outline: none;
    text-align: right;
    color: rgb(51,51,51);
    font-size: .29rem;
  }
  input::placeholder{
    color: rgb(153,153,153);
  }
</style>
