<template lang="pug">
  .wrapNav
    .navbar
      .topLeft
        img(src="../../../assets/img/ic_order_return.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter {{mstype==='802'?'到货通知':'消息中心'}}
    .tabQ(v-if="mstype == ''")
      ul
        li(v-for="(item, index) in titles", :class="{cli:nums === index}", @click="tabQie(item, index)") {{item}}
          span {{index===0?'(0)':'(4)'}}
      .lineDiv(ref="lineD", :class="{lefts:leftF}")
    .empty(v-if="!contLists.length&&tabFlag==true", :class="{tops:topF}")
      .imgs
        img(src="../../../assets/img/coupon-icon1@2x.png")
      .words 暂时没有系统通知
      .goToHome(@click="$router.push('/home')") 去商城首页
    .empty(v-if="!tabHList.length&&tabFlag==false", :class="{tops:topF}")
      .imgs
        img(src="../../../assets/img/coupon-icon2@2x.png")
      .words 暂时没有推荐活动
      .goToHome(@click="$router.push('/home')") 去商城首页
    .contList.mescroll#collectMescroll(:class="{tops:topF, paddingS:!tabFlag}")
      ul(v-if="tabFlag").tabS
        li(v-for="item in contLists")
          .topper
            .leftT
              .point <span v-if="item.ms_status === '5303'"></span>
              .title(:class="{active:item.ms_status === '5303'}") {{item.msType === '802'?'到货通知':'购物车降价通知'}}
            .rightT {{item.notice_time}}
          .bottommer(@click="goTogGoods(item)")
            .leftB
              img(:src="item.ms_thumbnail | img-filter")
            .rightB
              .text(v-if="item.msType === '802'") 您关注的【<span>{{item.ms_title.toString().substring(0,29) + '...'}}</span>】已到货，手慢无哦！
              .text(v-if="item.msType !== '802'") {{item.ms_title}}
              .attr {{item.gspec_values.toString().split(',')[0]}}{{item.gspec_values.toString().split(',')[1]? ';' + item.gspec_values.toString().split(',')[1]:''}}
              .price
                .leftP <span>实付价:</span><strong>{{item.new_direct_supply_price | price-filter}}</strong>
                .rightP(v-if="item.msType !== '802'") 已降价{{item.price_difference}}元,速抢!
                .rightP(v-if="item.msType === '802'") 到货啦,速抢!
      ul(v-else).tabH
        li(v-for="items in tabHList")
          .times
            .timeSon 2018-08-29
          .conts(v-for="i in items.sonList")
            .upper
              .lefters
                .pointer
                .titleN 夏季防晒季！
              .righters 点击查看 ＞
            .centers
              img(src="")
            .downner <span>全场防晒隔离5折起！防晒喷雾50元、还有水宝宝、肌肤之钥、 OLAY小银瓶、ZA隔离霜、佰草集防晒套装，等你来抢！</span>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "inform",
    data(){
      return{
        widthTwoF: '',
        widthThreeF: '',
        tabFlag: true,
        paddingF: '',
        leftF: '',
        topF: '',
        titles: ['系统通知', '推荐活动'],
        nums: 0,
        number: this.$route.query.num,
        looked: 1,
        mstype: '',
        contLists: [],
        tabHList: [{sonList:[{}]}, {sonList:[{}]}, {sonList:[{}, {}]}],
        //tabHList: []
      }
    },
    computed: {
      isEmpty(){
        if (this.contLists.length === 0) {
          return true
        }
        return false
      },
      ...mapState(['position'])
    },
    watch:{
      '$route'(to,from) {
        if (from.path === '/my') {
          console.log(this.$route.query.num)
          this.$store.commit('setInformNum', this.$route.query.num)
          this.judgeType()
          this.nums = 0
          this.leftF = false
          this.tabFlag = true
          this.mescroll.resetUpScroll()
        }
        if (from.path === '/goodsDetailed') {
          this.position.forEach((now) => {
            if (now.path === this.$route.path) {
              this.mescroll.scrollTo(now.y, 0)
            }
          })
        }
      }
    },
    activated(){
      //this.judgeType()
      //this.nums = 0
      //this.leftF = false
      // if (this.number != this.$route.query.num) {
      //   this.number = this.$route.query.num
      //   this.mescroll.resetUpScroll()
      // }
      // else {
      //   this.position.forEach((now) => {
      //     if (now.path === this.$route.path) {
      //       this.mescroll.scrollTo(now.y, 0)
      //     }
      //   })
      // }

    },
    beforeDestroy(){
      this.mescroll.hideTopBtn()
      this.mescroll.destroy()
    },
    beforeRouteLeave(to, from, next){
      if (to.path === '/my') {
        let types = 0
        if (this.$store.state.informNum === 0) {
          types = ''
        }
        if (this.$store.state.informNum === 1) {
          types = 802
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'ucMessage/updateMessageStatus',
          params:{
            msType: types
          }
        }).then( (res)=> {
          console.log('111')
          //self.mescroll.resetUpScroll()
          next()
        })
        next(false)
      } else {
        next()
      }
    },
    mounted(){
      this.$store.commit('setInformNum', this.$route.query.num)
      this.judgeType()
      this.$mescrollInt('collectMescroll', this.upCallback, ()=>{

      }, (obj) => {
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
      })
    },
    methods:{
      tabQie(item, index){
        this.nums = index
        if (index === 0) {
          this.leftF = false
          this.tabFlag = true
        }
        if (index === 1) {
          this.leftF = true
          this.tabFlag = false
        }
        this.$refs.lineD.style.transition = 'left .5s'
      },
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll(isLock)
      },
      goTogGoods(e){
        this.$store.commit('setInformGoods', e)
        if (e.msType === '801') {
          // 跳购物车
          // 1.判断购物车里还有没有商品
          let self = this
          let isExits = false
          self.$ajax({
            method: 'get',
            url: self.$apiApp + 'shoppingCart/queryCarryShoppingCartList1',
            params: {},
          }).then(function (response) {
            response.data.data.commList.forEach((item) => {
              item.shoppingCartVOList.forEach((goods) => {
                if (e.rel_id === goods.sc_id && e.gspu_id === goods.gspu_id) {
                  self.$router.push('/shoppingCart')
                  isExits = true
                  return false
                }
              })
            })

            if (!isExits) {
              self.$ajax({
                method: 'get',
                url: self.$apiApp + 'shoppingCart/querySendShoppingCartList1',
                params: {},
              }).then(function (res) {
                res.data.data.commList.forEach((item) => {
                  item.shoppingCartVOList.forEach((goods) => {
                    if (e.rel_id == goods.sc_id && e.gspu_id === goods.gspu_id) {
                      self.$router.push('/shoppingCart/express')
                      isExits = true
                      return false
                    }
                  })
                })

                // 跳商品详情
                if (!isExits) {
                  self.$router.push({
                    path:'/goodsDetailed',
                    query:{
                      id: e.gspu_id
                    }
                  })
                }
              })
            }
          })

        } else if (e.msType === '802') {
          // 跳商品详情
          this.$router.push({
            path:'/goodsDetailed',
            query:{
              id: e.gspu_id
            }
          })
        }
      },
      judgeType(){
        if (this.$route.query.num == 0){
          this.mstype = ''
          this.topF = false
        }
        if (this.$route.query.num == 1){
          this.mstype = '802'
          this.topF = true
        }
      },
      upCallback: function (page) {
        let self = this
        self.getListDataFromNet(page.num, page.size, function (curPageData) {
          if (page.num === 1) self.contLists = []
          self.contLists = self.contLists.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr()
        })
      },
      getListDataFromNet (pageNum,pageSize,successCallback,errorCallback) {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'ucMessage/queryMemberMessagePage',
          params: {
            page: pageNum,
            rows: pageSize,
            msType: self.mstype
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          console.log(response.data.data.rows)
          successCallback&&successCallback(response.data.data.rows)//成功回调
        })
      },
    }
  }
</script>

<style scoped>
  .paddingS{
    padding-top: 0 !important;
  }
  .lefts{
    left: 6rem !important;
  }
  .tops{
    top: 1.28rem !important;
  }
  .cli{
    color: #F70057;
  }
  .wrapNav{
    position: fixed;
    top: 0;
    bottom: 0;
  }
  .tabQ{
    position: fixed;
    top: 1.28rem;
    width: 100%;
    height: .93rem;
    background-color: #fff;
    z-index: 200;
  }
  .tabQ ul{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tabQ ul li{
    width: 50%;
    text-align: center;
    line-height: .93rem;
    font-size: .37rem;
  }
  .lineDiv{
    width: 3rem;
    height: .08rem;
    background-color: #F70057;
    position: absolute;
    bottom: 0;
    left: 1rem;
  }
  .empty{
    width: 100%;
    text-align: center;
    color: #666;
    background-color: #f2f2f2;
    position: fixed;
    top: 2.21rem;
    bottom: 0;
    /*margin-top: 1.28rem;*/
    padding-top: 1.06rem;
    height: calc(100vh - 1.28rem);
    z-index: 200;
  }
  .imgs{
    /*margin-top: 1.06rem;*/
  }
  .imgs img{
    width: 2.66rem;
    height: 2.66rem;
  }
  .empty .words{
    font-size: .37rem;
    color: #777;
    margin-top: .26rem;
  }
  .goToHome{
    width: 4.26rem;
    height: 1.17rem;
    line-height: 1.17rem;
    margin: .74rem auto 0;
    background-color: #F70057;
    border-radius: .26rem;
    color: #fff;
    font-size: .4rem;
  }
  #collectMescroll{
    top: 2.21rem;
    bottom: 0;
    position: fixed;
    z-index: 100;
    background-color: #f2f2f2;
  }
  .active{
    font-weight: 600 !important;
    padding-left: 0 !important;
  }
  .navbar{
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.28rem;
    border-bottom: 1px solid #f2f2f2;
    background: rgb(244, 0, 87);
    display: flex;
    align-items: center;
  }
  .topLeft{
    padding-left: .36rem;
    padding-top: .1rem;
  }
  .topCenter{
    margin-left: 3.4rem;
    font-size: .48rem;
    color: #fff;
  }
  /*内容列表*/
  .contList{
    padding-top: .26rem;
    background-color: #f2f2f2;
    padding-bottom: 1.89rem;
  }
  .contList ul.tabS li{
    margin-bottom: .26rem;
    padding-bottom: .4rem;
    background-color: #fff;
  }
  .contList ul.tabS li .topper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .32rem .53rem .32rem .16rem;
  }
  .contList ul.tabS li .topper .leftT{
    display: flex;
    align-items: center;
  }
  .contList ul.tabS li .topper .leftT .point{

  }
  .contList ul.tabS li .topper .leftT .point span{
    display: block;
    width: .21rem;
    height: .21rem;
    background-color: #F70057;
    border-radius: 50%;
    margin-right: .16rem;
  }
  .contList ul.tabS li .topper .leftT .title{
    color: #333;
    font-size: .42rem;
    font-weight: 500;
    padding-left: .37rem;
  }
  .contList ul.tabS li .topper .rightT{
    color: #999;
    font-size: .32rem;
    padding-left: .12rem;
  }
  .contList ul.tabS li .bottommer{
    margin: 0 .53rem;
    background-color: #f2f2f2;
    border-radius: .13rem;
    display: flex;
  }
  .contList ul.tabS li .bottommer .leftB{
    width: 2.4rem;
    height: 2.4rem;
  }
  .contList ul.tabS li .bottommer .leftB img{
    width: 2.4rem;
    height: 2.4rem;
  }
  .contList ul.tabS li .bottommer .rightB{
    width: 0;
    height: 2.4rem;
    flex-grow: 1;
    margin-left: .24rem;
    padding: .08rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .contList ul.tabS li .bottommer .rightB .text{
    color: #666;
    font-size: .35rem;
    margin-right: .24rem;
  }
  .contList ul.tabS li .bottommer .rightB .attr{
    font-size: .29rem;
    color: #999;
  }
  .contList ul.tabS li .bottommer .price{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .contList ul.tabS li .bottommer .price .leftP span{
    font-size: .29rem;
    color: #333;
  }
  .contList ul.tabS li .bottommer .price .leftP strong{
    font-size: .37rem;
    color: #F70057;
    font-weight: 400;
  }
  .contList ul.tabS li .bottommer .price .rightP{
    margin-right: .24rem;
    color: #FF005A;
    font-size: .29rem;
  }

  /*推荐活动tab*/
  ul.tabH li .times{
    width: 100%;
    padding: .32rem 0;
    background-color: #f2f2f2;
  }
  ul.tabH li .times .timeSon{
    width: 2.35rem;
    height: .53rem;
    text-align: center;
    line-height: .54rem;
    font-size: .32rem;
    color: #fff;
    background-color: #ccc;
    border-radius: .1rem;
    margin: 0 auto;
  }
  .conts{
    background-color: #fff;
    padding: 0 .42rem;
    margin-bottom: .26rem;
  }
  .conts:last-child{
    margin-bottom: 0;
  }
  .conts .upper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .26rem 0;
  }
  .conts .upper .lefters{
    display: flex;
    align-items: center;
  }
  .conts .upper .lefters .pointer{
    width: .21rem;
    height: .21rem;
    border-radius: 50%;
    background-color: #F70057;
    margin-right: .16rem;
  }
  .conts .upper .lefters .titleN{
    font-size: .37rem;
    color: #333;
  }
  .conts .upper .righters{
    font-size: .3rem;
    color: #aaa;
  }
  .conts .centers{
    width: 9.17rem;
    height: 3.2rem;
  }
  .conts .centers img{
    width: 9.17rem;
    height: 3.2rem;
  }
  .conts .downner{
    padding: .3rem 0;
    font-size: .32rem;
    color: #666;
    line-height: .53rem;
  }
</style>
