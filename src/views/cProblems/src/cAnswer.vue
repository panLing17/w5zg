<template lang="pug">
  .wrapNav
    .navbar
      .topLeft
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter {{titleName}}
    .cont.mescroll#contM
      ul
        li(v-for="item in contList")
          .up(@click="item.ansFlag = !item.ansFlag")
            .left {{item.title}}
            .right
              img(src="../../../assets/img/zhankai@2x.png", v-if="!item.ansFlag")
              img(src="../../../assets/img/shouqi@2x.png", v-if="item.ansFlag")
          transition(name="slideInDown")
            .down(v-if="item.ansFlag")
              div(v-for="r in item.answers") {{r}}
</template>

<script>
  export default {
    name: "cAnswer",
    data() {
      return{
        contList: [],
        first: [
          {
            title: '专柜提货的正确打开方式',
            answers: ['选择带有【专柜提货】标识的商品。' ,
            '点击【加入购物车】或【立即购买】，配送方式中选择【专柜提货】，并选择您想要提货的专柜地址。' ,
            '下单成功后，您可在订单详情和短信中查看提货码和提货地址，该提货码为您提货凭证，请勿将提货码告知他人。'],
            ansFlag: true
          },
          {
            title: '为什么推荐使用专柜提货？',
            answers: ['我们推荐您到专柜比价，商城90%商品券后价，比专柜折后价便宜37%，买贵就白送。','我们推荐您到专柜体验，您在专柜比价/试穿/验货，满意后再购买。','我们推荐您到专柜提货，正品低价，新款现货，何必找代购。'],
            ansFlag: false
          },
          {
            title: '专柜提货声明',
            answers: ['因万物直供实付价太过优惠，品牌商担心专柜业绩受到严重冲击，因此，70%商品可专柜提货，30%商品暂不支持专柜提货，不支持专柜提货商品将由专柜配送，我们将陆续开放更多提货专柜。'],
            ansFlag: false
          },
          {
            title: '为什么要专柜配送？',
            answers: ['若您无法专柜提货，平台全部商品（超市商品除外）将由专柜为您配送，确保正品。'],
            ansFlag: false
          }
        ],
        second: [
          {
            title: '价格说明',
            answers: ['实付价：本商品在仅使用现金券情况下的最低付款价格，现金券不足时将返还通用券。','专柜价：本商品在南京地区专柜实际售价（非商场店庆等特殊活动价）。','专柜折后价：本商品在南京地区专柜打折后的促销价（非商场店庆等特殊活动价）。'],
            ansFlag: true
          },
          {
            title: '赔付承诺',
            answers: ['万物直供商城商品全部源自线下品牌专柜，商城90%商品券后价，比专柜折后价便宜37%。您到专柜提货，请对比专柜商品售价，如果您发现专柜价格（非周年庆等特殊活动或恶意行为）低于商城券后价，我们将按商城商品券后价赔付给您（单件商品仅赔付一次），赔付电话4008-947-999。'],
            ansFlag: false
          }
        ],
        third: [
          {
            title: '现金券从哪里获得？',
            answers: ['新人注册将获得1000元现金券；商城不定期通过微信公众号等媒介或大型促销活动发放现金券；您将商城商品分享给您的好友，将获得现金券。'],
            ansFlag: true
          },
          {
            title: '什么是现金券？',
            answers: ['A. 您在本商城购物，在专柜价的基础上抵扣30%-70%，按照不同品牌，为您省钱30-70%。','B. 您在本商城购物，商城自动抵扣可使用现金券的最高额，顾客仅支付用券后余额。','C. 您购物时，当1张现金券金额不够，本商城自动默认多张现金券累加使用；当现金券未使用完，会产生余额，下次购买时继续使用。','D. 现金券不可提现。'],
            ansFlag: false
          },
          {
            title: '商品退款怎么办？',
            answers: ['A. 您使用现金券购物，退款时，本商城按原路径返还现金和现金券。','B. 多件商品订单中，某件商品退款，本商城按实际用券额返还现金券。'],
            ansFlag: false
          },
          {
            title: '现金券有效期',
            answers: ['每张现金券有效期为3个月，到期后不可延期。'],
            ansFlag: false
          },
          {
            title: '现金券不够怎么办？',
            answers: ['现金券不足时，您以现金购买，本商城向您返还通用券，确认收货后，通用券进入您的账户。使用通用券在本商城购物，等同于现金。','譬如：您购买1000元商品，可使用现金券抵扣300元，您只有现金券100元。您需要支付900元现金，本商城返还200元通用券。'],
            ansFlag: false
          },
          {
            title: '现金券怎么查看余额？',
            answers: ['A. 点击“我的”—“现金券”，显示每张现金券。','B. 每个商品详情页中显示您所有现金券总额（不包含已过期的现金券）。'],
            ansFlag: false
          },
        ],
        fourth: [
          {
            title: '通用券从哪里获得？',
            answers: ['您在本商城购物，现金券不足（未使用现金券）时，通用券获得金额等于现金券不足金额，确认收货后，通用券将进入您的账户。'],
            ansFlag: true
          },
          {
            title: '通用券怎么使用？',
            answers: ['通用券在本商城等同于现金，没有使用限制，使用通用券后，订单最小支付金额为0元；','通用券未使用完的余额，下次购买时继续使用。'],
            ansFlag: false
          },
          {
            title: '商品退款怎么办？',
            answers: ['A. 您使用通用券购物，退款时，本商城按原路径返还支付的现金、现金券和通用券。','B. 您购买某商品时，本商城赠送给您通用券，若某商品退款，本商城将收回赠送的通用券。若赠送给您的通用券，您在购买其他商品时已使用，则某商品退款时，本商城将从退款现金中扣除通用券使用额。','C. 多件商品订单中，某件商品退款，本商城按实际用券额赠送通用券。'],
            ansFlag: false
          },
          {
            title: '通用券有有效期吗？',
            answers: ['通用券没有有效期。'],
            ansFlag: false
          },
          {
            title: '通用券怎么查看余额？',
            answers: ['A. 点击“我的”—”通用券”，显示通用券总额。','B. 每个商品详情页中显示通用券总额。'],
            ansFlag: false
          }
        ],
        fifth: [
          {
            title: '退货规则',
            answers: ['非质量问题货品，不支持退货；质量问题支持换货；尺码、颜色等非质量问题，支持换货。'],
            ansFlag: true
          },
          {
            title: '自提换货规则',
            answers: ['自提订单，门店当场验收自提货品，如需同款尺码、颜色更换，可直接在门店进行换货操作；如门店同款尺码、颜色无货，联系平台客服核实处理换货；如已离开自提门店，需出示订单及自提码至自提门店进行换货操作，或进行物流配送换货，物流配送换货需品牌确认货品不影响二次销售，方可寄出换货商品；'],
            ansFlag: false
          },
          {
            title: '配送换货规则',
            answers: ['配送换货订单，需联系平台客服，核实确认换货货品信息及退货地址，并且保证换货商品不影响二次销售。订单申请退货退款，上传凭证，品牌审核同意退货申请，邮寄商品并同步物流单号至本商城，品牌收货并确认不影响二次销售，由商城操作退款。您重新下单，品牌按照订单信息寄出新商品。若品牌拒绝换货申请，可联系平台客服介入订单处理。'],
            ansFlag: false
          },
          {
            title: '退款规则',
            answers: ['您发起退货退款申请，品牌会在24H内完成确认；品牌收到退货商品，商城会在3-5个工作日内原路退还至您的账户。'],
            ansFlag: false
          }
        ],
        titleName: ''
      }
    },
    activated() {
      // this.showTitle()
    },
    mounted() {
      this.showTitle()
      this.queList()
      this.$mescrollInt('contM', this.upCallback)
    },
    methods: {
      showTitle(){
        console.log(this.$route.query.flag)
        let rel = parseInt(this.$route.query.flag)
        let x = ''
        switch (rel) {
          case 1:
            x = '专柜提货与专柜配送'
            break
          case 2:
            x = '实付价与专柜价'
            break
          case 3:
            x = '现金券'
            break
          case 4:
            x = '通用券'
            break
          case 5:
            x = '退换货政策'
            break
        }
        this.titleName = x
      },
      queList() {
        let p = parseInt(this.$route.query.flag)
        let y = ''
        switch (p) {
          case 1:
            y = this.first
            break
          case 2:
            y = this.second
            break
          case 3:
            y = this.third
            break
          case 4:
            y = this.fourth
            break
          case 5:
            y = this.fifth
            break
        }
        this.contList = y
      },
      upCallback: function () {
        this.mescroll.endErr()
      },
    }
  }
</script>

<style scoped>
  #contM{
    position: fixed;
    top: 0;
    bottom: 0;
  }
  .wrapNav{
    width: 100%;
    height: 100vh;
    background-color: #fff;
    position: fixed;
  }
  .navbar{
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.28rem;
    border-bottom: 1px solid #f2f2f2;
    background: #fff;
    display: flex;
    align-items: center;
  }
  .navbar img{
    vertical-align: middle;
  }
  .topLeft{
    padding-left: .36rem;
    padding-top: .1rem;
  }
  .topCenter{
    font-size: .48rem;
    width: 60%;
    text-align: center;
    margin-left: 1.2rem;
  }
  .cont{
    margin-top: 1.28rem;
  }
  .cont ul{
    padding-top: .16rem;
    background-color: #f2f2f2;
  }
  .cont ul li{
    background-color: #fff;
  }
  .cont ul li .up{
    padding: .34rem .4rem .32rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
    font-size: .4rem;
    border-bottom: .05rem solid #f2f2f2;
  }
  .cont ul li .down{
    background-color: #f2f2f2;
    padding: .34rem .4rem;
    color: #666;
    font-size: .37rem;
  }
  .cont li .right img{
    width: .58rem;
    height: .58rem;
  }
  .slideInDown-enter-active,
  .slideInDown-leave-active{
    transition: all .2s ease-out;
  }
  .slideInDown-enter,
  .slideInDown-leave-to{
    transform: translateY(-5px);
    opacity: 0;
  }
</style>
