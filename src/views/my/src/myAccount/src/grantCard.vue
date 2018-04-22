<template lang="pug">
  .grantCardBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 发放现金券
      .topRight(slot="right")
    .formBox
      .item
        .itemDec 手机号：
        .itemContent
          input(placeholder="请输入领券手机号", type="number", v-model="form.mobile")
      .item
        .itemDec 金额：
        .itemContent
          input(placeholder="请输入发放金额", type="number", v-model="form.money")
    .confirmBtn(@click="grant") 确认
</template>

<script>
    export default {
      name: "grantCard",
      data () {
        return {
          form: {
            mobile: '',
            money: ''
          }
        }
      },
      methods:{
        grant () {
          let _this = this;
          this.$ajax({
            method: 'get',
            url: this.$apiTransaction + 'netcard/sendNetCard',
            params:{
              mobile: this.form.mobile,
              money: Number(this.form.money)
            }
          }).then(function (response) {
            if (response.data.code === '081') {
              _this.$message.success(response.data.msg)
              _this.$router.go(-1)
            }else {
              _this.$message.error(response.data.msg);
            }

          })
        }
      }
    }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color:rgb(204,204,204);
  }
.grantCardBox {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100vh;
  background: rgb(242,242,242);
}
.formBox {
  margin-top: .2rem;
  background: #fff;
  padding: 0 .2rem;
  box-sizing: border-box;
}
.item {
  height: 1.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(153,153,153);
}
.item:last-child {
  border: none;
}
.itemDec {
  flex: none;
  width: 1.8rem;
  font-size: .4rem;
  color: rgb(51,51,51);
}
.itemContent {
  flex: 1;
  height: 100%;
}
.itemContent input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: .4rem;
}
.confirmBtn {
  margin: 2rem auto 0;
  width: 68%;
  height: 1.3rem;
  background: #f50057;
  border-radius: 1.2rem;
  font-size: .4rem;
  text-align: center;
  line-height: 1.3rem;
  color: #fff;
}
</style>
