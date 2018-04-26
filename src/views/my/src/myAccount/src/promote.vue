<template lang="pug">
  .promote
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 申请商户资质
      .topRight(slot="right")
    .headerBox
    .content
      .form
        .block
          .left 机构名称:
          .right
            input(type="text", v-model="form.companyName")
        .block
          .left 联系人:
          .right
            input(type="number", v-model="form.phone")
        .block
          .left 所在地区:
          .right.arrow(@click="show=true")
            input(type="text", disabled="disabled", v-model="form.area")
        .block.big
          .left 详细地址:
          .right
            textarea(placeholder="请输入详细地址信息，如道路、小区、门牌号等", v-model="form.detail")
        .block
          .left 邮箱号:
          .right
            input(type="text", v-model="form.email", @input="poll")
      .btn(:style="{background:btn.btnBg,color:btn.col}", @click="check") {{btn.btnText}}
    city-select(:show="show", @close="show=false", @change="cityChange")
</template>

<script>
  import citySelect from '../../citySelect'
    export default {
      name: "promote",
      components: {
        citySelect
      },
      data () {
        return {
          show: false,
          form: {
            area: '',
            companyName: '',
            phone: '',
            detail: '',
            email: ''
          },
          btn: {
            btnText: '提交申请',
            btnBg: 'rgb(245,0,87)',
            col: '#fff'
          },
          flag: 0
        }
      },
      mounted () {

      },
      methods: {
        check () {
          if (this.form.companyName.trim().length <= 0) {
            this.$message.error('机构名称不能为空！')
            return
          }
          if (!/^1[3|4|5|8|9][0-9]\d{8}$/.test(this.form.phone)) {
            this.$message.error('手机号格式不正确！')
            return
          }
          if (this.form.area.trim().length <= 0) {
            this.$message.error('所在地区不能为空！')
            return
          }
          if (this.form.detail.trim().length <= 0) {
            this.$message.error('详细地址不能为空！')
            return
          }
          if (!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/.test(this.form.email)) {
            this.$message.error('邮箱格式不正确！')
            return
          }
          this.submitData()
        },
        submitData () {

        },
        cityChange (data) {
          this.form.area = data.pro.name+' '+data.city.name+' '+data.area.name
        }
      }
    }
</script>

<style scoped>
  textarea::-webkit-input-placeholder{
    color:rgb(153,153,153);
  }
  .promote {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .headerBox {
    height: 4rem;
    background: url("../../../../../assets/img/merchant@2x.png") no-repeat top center #ff80ab;
    background-size: auto 100%;
  }
  .content {
    height: calc(100vh - 5.3rem);
    position: relative;
    padding-top: .26rem;
    box-sizing: border-box;
  }
  .form {
    background: #fff;
    padding: 0 .2rem;
  }
  .block {
    min-height: 1.2rem;
    border-bottom: 1px solid rgb(153,153,153);
    display: flex;
    font-size: .4rem;
  }
  .block:last-child {
    border: none;
  }
  .left {
    flex: none;
    width: 2rem;
    line-height: 1.2rem;
    color: rgb(51,51,51);
  }
  .right {
    flex: 1;
    color: rgb(51,51,51);
  }
  .right input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    line-height: 1.2rem;
  }
  .arrow {
    background: url("../../../../../assets/img/next@2x.png") no-repeat center right;
    background-size: .2rem auto;
    line-height: 1.2rem;
  }
  .arrow input {
    width: calc(100% - .2rem);
    background: #fff;
    display: inline-block;
    vertical-align: top;
  }
  .block.big {
    height: 2.6rem;
  }
  .right textarea {
    resize: none;
    width: 100%;
    height: 100%;
    padding: .4rem .4rem 0 0;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-size: .4rem;
  }
  .btn {
    position: absolute;
    bottom: .26rem;
    left: 50%;
    transform: translateX(-50%);
    width: 6.8rem;
    height: 1rem;
    border-radius: .53rem;
    line-height: 1rem;
    text-align: center;
    color: #fff;
    font-size: .4rem;
  }
</style>
