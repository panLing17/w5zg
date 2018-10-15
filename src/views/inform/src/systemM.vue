<template lang="pug">
  .wraps
    .empty(v-if="!contLists.length", :class="{tops:topF}")
      .imgs
        img(src="../../../assets/img/coupon-icon1@2x.png")
      .words 暂时没有系统通知
      .goToHome(@click="$router.push('/home')") 去商城首页
    .systemCont.mescroll#systemMescroll(:class="{tops:topF}")
      ul.tabS
        li(v-for="item in contLists")
          .topper
            .leftT
              .point <span v-if="item.ms_status === '5303'"></span>
              .title(:class="{active:item.ms_status === '5303'}") {{item.ms_type === '802'?'到货通知':'购物车降价通知'}}
            .rightT {{item.notice_time}}
          .bottommer(@click="goTogGoods(item)")
            .leftB
              img(:src="item.ms_thumbnail | img-filter")
            .rightB
              .text(v-if="item.ms_type === '802'") 您关注的【<span>{{item.ms_title.toString().substring(0,29) + '...'}}</span>】已到货，手慢无哦！
              .text(v-if="item.ms_type !== '802'") {{item.ms_title}}
              .attr {{item.spec_value1}};{{item.spec_value2}}
              .price
                .leftP <span>实付价:</span><strong>{{item.new_direct_supply_price | price-filter}}</strong>
                .rightP(v-if="item.ms_type !== '802'") 已降价{{item.price_difference}}元,速抢!
                .rightP(v-if="item.ms_type === '802'") 到货啦,速抢!
</template>

<script>
    import {mapState} from 'vuex'
    export default {
      name: "systemM",
      data(){
        return{
          topF: '',
          contLists: []
        }
      },
      computed: {
        ...mapState(['position'])
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
            url: self.$apiMember + '/ucMessage/v2/updateMessageStatus',
            params:{
              msType: types
            }
          }).then( (res)=> {
            console.log('111')
            next()
          })
          next(false)
        } else {
          next()
        }
      },
      watch:{
        '$route'(to,from) {
          if (from.path === '/my') {
            console.log(this.$route.query.num)
            this.$store.commit('setInformNum', this.$route.query.num)
            this.judgeType()
            this.mescroll.resetUpScroll()
          } else {
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
      },
      mounted(){
        this.$store.commit('setInformNum', this.$route.query.num)
        this.judgeType()
        this.$mescrollInt('systemMescroll', this.upCallback, ()=>{

        }, (obj) => {
          this.$store.commit('setPosition', {
            path: this.$route.path,
            y: obj.preScrollY
          })
        })
      },
      methods:{
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
        // 锁定或者解锁上拉加载
        lockUpDown (isLock) {
          this.mescroll.lockUpScroll(isLock)
        },
        goTogGoods(e){
          this.$store.commit('setInformGoods', e)
          if (e.ms_type === '801') {
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

          } else if (e.ms_type === '802') {
            // 跳商品详情
            this.$router.push({
              path:'/goodsDetailed',
              query:{
                id: e.gspu_id
              }
            })
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
            url: self.$apiMember + '/ucMessage/v2/queryMemberMessagePage',
            params: {
              page: pageNum,
              rows: pageSize,
              msType: self.mstype
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            successCallback&&successCallback(response.data.data.rows)//成功回调
          })
        },
      }
    }
</script>

<style scoped>
  .active{
    font-weight: 600 !important;
    padding-left: 0 !important;
  }
  .tops{
    top: 1.28rem !important;
  }
  .empty{
    width: 100%;
    text-align: center;
    color: #666;
    background-color: #f2f2f2;
    position: fixed;
    top: 2.21rem;
    bottom: 0;
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
  #systemMescroll{
    position: fixed;
    top: 2.21rem;
    bottom: 0;
    height: auto;
    /*padding-bottom: 1.28rem;*/
    background-color: #f2f2f2;
  }
  ul.tabS li{
    margin-top: .26rem;
    margin-bottom: .26rem;
    padding-bottom: .4rem;
    background-color: #fff;
  }
  ul.tabS li .topper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .32rem .53rem .32rem .16rem;
  }
  ul.tabS li .topper .leftT{
    display: flex;
    align-items: center;
  }
  ul.tabS li .topper .leftT .point{

  }
  ul.tabS li .topper .leftT .point span{
    display: block;
    width: .21rem;
    height: .21rem;
    background-color: #F70057;
    border-radius: 50%;
    margin-right: .16rem;
  }
  ul.tabS li .topper .leftT .title{
    color: #333;
    font-size: .42rem;
    font-weight: 500;
    padding-left: .37rem;
  }
  ul.tabS li .topper .rightT{
    color: #999;
    font-size: .32rem;
    padding-left: .12rem;
  }
  ul.tabS li .bottommer{
    margin: 0 .53rem;
    background-color: #f2f2f2;
    border-radius: .13rem;
    display: flex;
  }
  ul.tabS li .bottommer .leftB{
    width: 2.4rem;
    height: 2.4rem;
  }
  ul.tabS li .bottommer .leftB img{
    width: 2.4rem;
    height: 2.4rem;
  }
  ul.tabS li .bottommer .rightB{
    width: 0;
    height: 2.4rem;
    flex-grow: 1;
    margin-left: .24rem;
    padding: .08rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  ul.tabS li .bottommer .rightB .text{
    color: #666;
    font-size: .35rem;
    margin-right: .24rem;
  }
  ul.tabS li .bottommer .rightB .attr{
    font-size: .29rem;
    color: #999;
  }
  ul.tabS li .bottommer .price{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  ul.tabS li .bottommer .price .leftP span{
    font-size: .29rem;
    color: #333;
  }
  ul.tabS li .bottommer .price .leftP strong{
    font-size: .37rem;
    color: #F70057;
    font-weight: 400;
  }
  ul.tabS li .bottommer .price .rightP{
    margin-right: .24rem;
    color: #FF005A;
    font-size: .29rem;
  }
</style>
