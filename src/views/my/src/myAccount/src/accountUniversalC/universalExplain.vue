<template lang="pug">
  .universalExplain
    nav-bar(background="#f70057")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="./back.png", style="width:.586rem")
      .topCenter(slot="center", style="color:#fff") 通用券说明
      .topRight(slot="right")
    .explainWapper
      explain(:data="datas")
</template>

<script>
  import Explain from '../../../explain'
  export default {
    name: "universalExplain",
    data() {
      return {
        datas: [
          {
            question: '通用券从哪里获得？',
            answer: ['您在本商城购物，现金券不足（未使用现金券）时，通用券获得金额等于现金券不足金额，确认收货后，通用券将进入您的账户。']
          },
          {
            question: '通用券怎么使用？',
            answer: ['A. 通用券在本商城等同于现金，没有使用限制，使用通用券后，订单最小支付金额为0元；','B. 通用券未使用完的余额，下次购买时继续使用。']
          },
          {
            question: '商品退款怎么办？',
            answer:[
              'A. 您使用通用券购物，退款时，本商城按原路径返还支付的现金、现金券和通用券。',
              'B. 您购买某商品时，本商城赠送给您通用券，若某商品退款，本商城将收回赠送的通用券。若赠送给您的通用券，您在购买其他商品时已使用，则某商品退款时，本商城将从退款现金中扣除通用券使用额。',
              'C. 多件商品订单中，某件商品退款，本商城按实际用券额赠送通用券。'
            ]
          },
          {
            question: '通用券有有效期吗？',
            answer: ['通用券没有有效期。']
          },
          {
            question: '通用券怎么查看余额？',
            answer: [
              'A. 点击“我的”—”通用券”，显示通用券总额。',
              'B. 每个商品详情页中显示通用券总额。'
            ]
          }
        ]
      }
    },
    components: {
      Explain
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .explainWapper {
    height "calc(100vh - %s)" % $height-header;
  }
</style>
