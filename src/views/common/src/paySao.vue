<template lang="pug">
  .wrap
    .dec 支付测试
    qrcode.ewm(:value="img", :options="{ size: 180 }", tag="img")
    .dec1 长按识别
</template>

<script>
  export default {
    name: "paySao",
    data () {
      return {
        img: ''
      }
    },
    created () {
      this.getCode()
    },
    methods: {
      getCode () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiTransaction + 'thirdPay/wechat/native',
          params: {}
        }).then(function (response) {
          if (response) {
            self.img = response.data.data
          }
        })
      }
    }
  }
</script>

<style scoped>
 .wrap {
   text-align: center;
 }
  .ewm {
    margin-top: 3rem;
  }
  .dec, .dec1 {
    text-align: center;
    font-size: .5rem;
  }
  .dec {
    margin-top: 2rem;
  }
</style>
