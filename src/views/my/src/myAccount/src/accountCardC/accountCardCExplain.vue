<template lang="pug">
  .accountCardCExplain
    nav-bar(background="#f70057")
      .topLeft(slot="left", @click="back")
        img(src="./back.png", style="width:.586rem")
      .topCenter(slot="center", style="color:#fff") 现金券说明
      .topRight(slot="right")
    .explainWapper
      explain(:data="datas")
        .title * 名词注解:【万物直供】APP商城(w5zg.com)，以下简称“本商城”
</template>

<script>
  import Explain from '../../../explain'
  export default {
    name: "accountCardCExplain",
    data() {
      return {
        datas: [
          {
            question: '现金券从哪里获得？',
            answer: ['新人注册将获得1000元现金券；商城不定期通过微信公众号等媒介或大型促销活动发放现金券；您将商城商品分享给您的好友，将获得现金券。']
          },
          {
            question: '什么是现金券？',
            answer:[
              'A. 您在本商城购物，在专柜价的基础上抵扣30%-70%，按照不同品牌，为您省钱30-70%。',
              'B. 您在本商城购物，商城自动抵扣可使用现金券的最高额，顾客仅支付用券后余额。',
              'C. 您购物时，当1张现金券金额不够，本商城自动默认多张现金券累加使用；当现金券未使用完，会产生余额，下次购买时继续使用。',
              'D. 现金券不可提现。'
            ]
          },
          {
            question: '商品退款怎么办？',
            answer: [
              'A. 您使用现金券购物，退款时，本商城按原路径返还现金和现金券。',
              'B. 多件商品订单中，某件商品退款，本商城按实际用券额返还现金券。'
            ]
          },
          {
            question: '现金券有效期？',
            answer: ['每张现金券有效期为3个月，到期后不可延期。']
          },
          {
            question: '现金券不够怎么办？',
            answer: ['现金券不足时，您以现金购买，本商城向您返还通用券，确认收货后，通用券进入您的账户。使用通用券在本商城购物，等同于现金。',
              '譬如：您购买1000元商品，可使用现金券抵扣300元，您只有现金券100元。您需要支付900元现金，本商城返还200元通用券。']
          },
          {
            question: '现金券怎么查看余额？',
            answer: ['A. 点击“我的”—“现金券”，显示每张现金券。', 'B. 每个商品详情页中显示您所有现金券总额（不包含已过期的现金券）。']
          }
        ]
      }
    },
    methods: {
      back() {
        this.$method.back.apply(this)
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
  .title {
    margin-bottom: .5rem;
    color: #777;
    font-size: .29rem;
  }
</style>
