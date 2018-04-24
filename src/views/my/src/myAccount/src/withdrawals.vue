<template lang="pug">
  .withdrawals
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 提现
      .topRight(slot="right")
    .content
      .contentTop
        .haveWrapper(v-if="bankInfo", @click="$router.push('/my/chooseBankCard')")
          img.icon(:src="bankInfo.bank_icon")
          .info
            .name {{bankInfo.bank_name}}
            .dec
              span 尾号{{bankInfo.bank_card | cardNo}}
              span {{bankInfo.mbc_type}}
        .nothing(v-if="!bankInfo", @click="$router.push('/my/addBankCard')")
          .icon
            img(src="../../../../../assets/img/add2@2x.png")
          .info 请添加银行卡
      .contentCenter
        .title 提现金额
        .inputWrapper
          label ￥
          input(type="number", v-model="form.money")
        .text
          .left(:class="{'active':textActive}") {{text}}
          .right(@click="all") 全部提现
      .bottomBtn(:style="{'background':btnBg}", @click="confirm") 确认提现
</template>

<script>
    export default {
      name: "withdrawals",
      data () {
        return {
          balance: 0,
          textActive: false,
          bankInfo:null,
          form:{
            money: '',
            bankId:'',
            desp:''
          }
        }
      },
      created () {
        this.getBankInfo();
        this.getBalance();
      },
      computed: {
        btnBg () {
          let col = '';
          if (parseFloat(this.form.money) > this.balance) {
            col = '#ff80ab';
          }else {
            col = '#f50057';
          }
          return col;
        },
        text () {
          let text = '';
          if (parseFloat(this.money) > this.balance) {
            text = '金额已超过可提现余额';
            this.textActive = true;
          }else {
            text = `当前可提现余额￥${Number(this.balance).toFixed(2)}`;
            this.textActive = false;
          }
          return text;
        }
      },
      filters: {
        cardNo(value) {
          return value && value.slice(value.length-5,value.length-1);
        }
      },
      methods: {
        getBankInfo() {
          let _this = this;
          this.$ajax({
            method: 'get',
            url: this.$apiMember + 'memberBank/memberbankcards',
            params:{}
          }).then(function (response) {
            if (response.data.code === '081') {
              _this.bankInfo = response.data.data[0];
              _this.form.bankId = _this.bankInfo.id
            }
          });
        },
        getBalance () {
          this.balance = Number(this.$store.state.userData.cash_balance);
        },
        all () {
          this.form.money = Number(this.balance).toFixed(2);
        },
        confirm () {
          if (parseFloat(this.form.money) > this.balance) {
            return;
          }
          let _this = this;
          this.form.desp = '测试';
          this.form.money = Number(this.form.money);
          this.form.bankId = parseInt(this.form.bankId);
          this.$ajax({
            method: 'post',
            url: this.$apiTransaction + 'withdraw',
            params: this.form,
          }).then(function (response) {
            _this.$message.success('提现成功')
            _this.$router.go(-1)
          })
        }
      }
    }
</script>

<style scoped>
  .withdrawals {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .contentTop {
    height: 1.86rem;
    background: #fff;
    margin-top: .26rem;
  }
  .haveWrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 .2rem;
    background: url("../../../../../assets/img/more@2x.png") no-repeat center right .2rem;
    background-size: .25rem auto;
  }
  .haveWrapper .icon {
    flex: none;
    width: 1rem;
    height: 1rem;
    background: #65aadd;
    border-radius: 50%;
  }
  .haveWrapper .icon img {
    width: 100%;
    height: 100%;
  }
  .haveWrapper .info {
    margin-left: .26rem;
    line-height: 1;
  }
  .info .name {
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .info .dec {
    margin-top: .33rem;
    font-size: .4rem;
    color: rgb(153,153,153);
  }
  .info .dec span {
    margin-right: .26rem;
  }
  .nothing {
    display: flex;
    align-items: center;
    padding: 0 .2rem 0 .55rem;
    height: 100%;
    background: url("../../../../../assets/img/more@2x.png") no-repeat center right .2rem;
    background-size: .25rem auto;
  }
  .nothing .icon {
    flex: none;
    width: .4rem;
  }
  .nothing .info {
    flex: none;
    font-size: .4rem;
    color: rgb(51,51,51);
    margin-left: .6rem;
  }
  .contentCenter {
    background: #fff;
    margin-top: .26rem;
    padding: 0 .2rem;
  }
  .contentCenter .title {
    line-height: 1.2rem;
    font-size: .4rem;
    color: rgb(153,153,153);
  }
  .contentCenter .inputWrapper {
    height: 1.6rem;
    line-height: 1.6rem;
    border-bottom: 1px solid rgb(153,153,153);
    font-weight: 400;
    font-size: .64rem;
    color: rgb(51,51,51);
    box-sizing: content-box;
  }
  input {
    border: none;
    outline: none;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    font-weight: 400;
    font-size: .64rem;
    color: rgb(51,51,51);
  }
  .contentCenter .text {
    height: 1rem;
    line-height: 1rem;
    display: flex;
    justify-content: space-between;
  }
  .text .left {
    color: rgb(153,153,153);
    font-size: .32rem;
  }
  .text .left.active {
    color: rgb(245,0,87);
  }
  .text .right {
    color: rgb(255,128,171);
    font-size: .32rem;
  }
  .bottomBtn {
    width: 68%;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    border-radius: .53rem;
    font-size: .4rem;
    color: #fff;
    margin: 1.6rem auto 0;
  }
</style>
