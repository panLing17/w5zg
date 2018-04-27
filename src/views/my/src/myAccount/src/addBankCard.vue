<template lang="pug">
  .addBankCard
    nav-bar(background="white")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") 添加银行卡
      .topRight(slot="right")
    .content
      .title 请绑定持卡人本人的银行卡
      .blockWrapper
        .block(@click="chooseShow=true")
          .left 开户行
          .right.choose
            input(type="text", readonly="readonly", v-model="chooseBank")
        .block
          .left 支行名称
          .right
            input(type="text", placeholder="请输入支行名称", v-model="form.branchName")
        .block
          .left 银行卡号
          .right
            input(type="number", placeholder="请输入银行卡号", v-model="form.bankCard")
      .title 持卡人信息
      .blockWrapper
        .block
          .left 持卡人
          .right
            input(type="text", placeholder="请输入持卡人姓名", v-model="form.bankCardOwnerName")
        .block
          .left 身份证号
          .right
            input(type="text", placeholder="请输入身份证号", v-model="form.bankCardOwnerIdentity")
        .block
          .left 手机号
          .right
            input(type="number", placeholder="请输入手机号", v-model="form.bankCardOwnerPhone")
      .bottomBtn(@click="save") 完成
    transition(name="fade")
      .mask(v-show="chooseShow", @click="chooseShow=false")
    transition(name="fold")
      .pickerBox(v-if="chooseShow")
        .controlBar
          .cancel(@click="chooseShow=false") 取消
          .confirm(@click="confirm") 确定
        .pickerContent
          i.top
          i.bottom
          ul.list
            li.item(v-for="(item,index) in bankList", :class="{'active':chooseActive===index}", @click="selectedBank(index,item.tb_id, item.tb_bank_name)") {{item.tb_bank_name}}
</template>

<script>
    export default {
      name: "addBankCard",
      data () {
        return {
          bankList: [],
          chooseShow:false,
          chooseActive: -1,
          chooseBank:'',
          form: {
            bankId: '',
            branchName: '',
            bankCard: '',
            bankCardOwnerName: '',
            bankCardOwnerPhone: '',
            bankCardOwnerIdentity: ''
          }
        }
      },
      computed: {
      },
      mounted () {
        this.getBankList()
      },
      methods: {
        selectedBank (index, id, name) {
          this.chooseActive = index
          this.form.bankId = id
          this.chooseBank = name
        },
        confirm () {
          /* if (this.bankList[this.chooseActive]) {
            this.chooseBank = this.bankList[this.chooseActive].text;
          }else {
            this.chooseBank = '';
          } */
          this.chooseShow = false;
        },
        getBankList () {
          let self = this
          self.$ajax({
            method: 'get',
            url: self.$apiMember + 'memberBank/bankNames',
            params: self.form,
          }).then(function (response) {
            self.bankList = response.data.data
          })
        },
        save () {
          let self = this
          self.$ajax({
            method: 'post',
            url: self.$apiMember + 'memberBank/memberbankcard',
            params: self.form,
          }).then(function (response) {
            console.log(response.data.optSuc)
            self.$message.success('添加成功')
            self.$router.go(-1)
          })
        }
      }
    }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color:rgb(204,204,204);
  }
  .addBankCard {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .title {
    padding: .53rem .2rem .26rem;
    font-size: .4rem;
    color: rgb(153,153,153);
  }
  .blockWrapper {
    background: #fff;
    padding: 0 .2rem;
    box-sizing: border-box;
  }
  .block {
    height: 1.2rem;
    line-height: 1.2rem;
    display: flex;
    border-bottom: 1px solid rgb(153,153,153);
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .block:last-child {
    border: none;
  }
  .block .left{
    flex: none;
    height: 100%;
  }
  .block .right {
    flex: 1;
    height: 100%;
  }
  .block .right input {
    width: 100%;
    height: 100%;
    text-align: right;
    font-size: .4rem;
    color: rgb(51,51,51);
    border: none;
    outline: none;
    display: inline-block;
    vertical-align: top;
  }
  .block .right.choose {
    background: url("../../../../../assets/img/more@2x.png") no-repeat center right;
    background-size: .25rem auto;
    padding-right: .4rem;
  }
  .bottomBtn {
    width: 68%;
    height: 1rem;
    line-height: 1rem;
    margin: 1.6rem auto 0;
    background: #f50057;
    color: #fff;
    font-size: .37rem;
    text-align: center;
    border-radius: .53rem;
  }
  .mask {
    width: 100%;
    height: calc(100% - 1.3rem);
    position: fixed;
    top: 1.3rem;
    left: 0;
    z-index: 101;
    background: rgba(51,51,51,.5);
    opacity: 1;
  }
  .mask.fade-enter-active, .mask.fade-leave-active {
    transition: all 0.5s;
  }
  .mask.fade-enter, .mask.fade-leave-to {
    opacity: 0;
  }
  .pickerBox {
    transform: translate3d(0,0,0);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 150;
  }
  .pickerBox.fold-enter-active, .pickerBox.fold-leave-active {
    transition: all 0.5s;
  }
  .pickerBox.fold-enter, .pickerBox.fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .controlBar {
    height: 1rem;
    background: #fff;
    display: flex;
    justify-content: space-between;
  }
  .cancel, .confirm {
    padding: 0 .8rem;
    line-height: 1rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .confirm {
    flex: none;
  }
  .cancel {
    flex: none;
  }
  .pickerContent {
    height: 5.2rem;
    background: #f2f2f2;
    padding: .8rem 0 .53rem;
    position: relative;
  }
  .pickerContent .list {
    height: 100%;
    overflow: auto;
  }
  .pickerContent .item {
    text-align: center;
    font-size: .53rem;
    color: rgb(153,153,153);
  }
  .pickerContent .item:first-child{
    margin-top: .8rem;
  }
  .pickerContent .item:last-child {
    margin-bottom: .8rem;
  }
  .pickerContent .item.active {
    color: rgb(51,51,51);
    font-size: .66rem;
  }
  i.top {
    width: 100%;
    height: .8rem;
    position: absolute;
    top: .8rem;
    left: 0;
    background: linear-gradient(0deg,rgba(242,242,242,.4),rgba(242,242,242,.8));
  }
  i.bottom {
    width: 100%;
    height: .8rem;
    position: absolute;
    bottom: .53rem;
    left: 0;
    background: linear-gradient(0deg,rgba(242,242,242,.8),rgba(242,242,242,.4));
  }
  img {
    pointer-events: none;
  }
</style>
