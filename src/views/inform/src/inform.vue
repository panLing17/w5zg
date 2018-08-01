<template lang="pug">
  .wrapNav
    nav-bar(background="rgb(244, 0, 87)")
      .topLeft(slot="left")
        img(src="../../../assets/img/ic_order_return.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 通知
    .empty(v-if="isEmpty") 暂无通知
    .contList.mescroll#collectMescroll
      ul
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
              .text(v-if="item.msType === '802'") 您关注的【<span>{{item.ms_title.toString().substring(0,22) + '...'}}</span>】已到货，手慢无哦！
              .text(v-if="item.msType !== '802'") {{item.ms_title}}
              .attr {{item.gspec_values.toString().split(',')[0]}}{{item.gspec_values.toString().split(',')[1]?';' + item.gspec_values.toString().split(',')[1]:''}}
              .price
                .leftP <span>实付价:</span><strong>{{item.new_direct_supply_price | price-filter}}</strong>
                .rightP(v-if="item.msType !== '802'") 已降价{{item.price_difference}}元

</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "inform",
    data(){
      return{
        number: this.$route.query.num,
        looked: 1,
        mstype: '',
        contLists: []
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
    activated(){
      this.judgeType()
      console.log(this.number)
      console.log(this.$route.query.num)
      console.log(this.number != this.$route.query.num)
      if (this.number != this.$route.query.num) {
        this.number = this.$route.query.num
        this.mescroll.triggerDownScroll()
      } else {
        this.position.forEach((now) => {
          if (now.path === this.$route.path) {
            this.mescroll.scrollTo(now.y, 0)
          }
        })
      }

    },
    beforeRouteLeave(to, from, next){
      console.log(from.path)
      if (to.path === '/my'){
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'ucMessage/updateMessageStatus',
          params:{
            msStatus: '5302'
          }
        }).then(function (res) {
          console.log(res)
        })
      }
      next()
    },
    mounted(){
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
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll(isLock)
      },
      goTogGoods(e){
        this.$router.push({
          path:'/goodsDetailed',
          query:{
            id: e.gspu_id
          }
        })
      },
      judgeType(){
        if (this.$route.query.num == 0) {
          this.mstype = ''
        }
        if (this.$route.query.num == 1){
          this.mstype = '802'
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
  .empty{
    width: 100%;
    line-height: 100vh;
    font-size: .5rem;
    text-align: center;
    color: #666;
    position: fixed;
    top: 1.28rem;
    bottom: 0;
  }
  #collectMescroll{
    top: 1.28rem;
    bottom: 0;
    position: fixed;
  }
  .active{
    font-weight: 600 !important;
    padding-left: 0 !important;
  }
  .topLeft{
    padding-left: .36rem;
    padding-top: .1rem;
  }
  .topCenter{
    font-size: .48rem;
    color: #fff;
  }
  /*内容列表*/
  .contList{
    padding-top: .26rem;
    background-color: #f2f2f2;
    padding-bottom: 1.89rem;
  }
  .contList li{
    margin-bottom: .26rem;
    padding-bottom: .4rem;
    background-color: #fff;
  }
  .contList li .topper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .32rem .53rem .32rem .16rem;
  }
  .contList li .topper .leftT{
    display: flex;
    align-items: center;
  }
  .contList li .topper .leftT .point{

  }
  .contList li .topper .leftT .point span{
    display: block;
    width: .21rem;
    height: .21rem;
    background-color: #F70057;
    border-radius: 50%;
    margin-right: .16rem;
  }
  .contList li .topper .leftT .title{
    color: #333;
    font-size: .42rem;
    font-weight: 500;
    padding-left: .37rem;
  }
  .contList li .topper .rightT{
    color: #999;
    font-size: .32rem;
    padding-left: .12rem;
  }
  .contList li .bottommer{
    margin: 0 .53rem;
    background-color: #f2f2f2;
    border-radius: .13rem;
    display: flex;
  }
  .contList li .bottommer .leftB{
    width: 2.4rem;
    height: 2.4rem;
  }
  .contList li .bottommer .leftB img{
    width: 2.4rem;
    height: 2.4rem;
  }
  .contList li .bottommer .rightB{
    width: 0;
    height: 2.4rem;
    flex-grow: 1;
    margin-left: .24rem;
    padding: .08rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .contList li .bottommer .rightB .text{
    color: #666;
    font-size: .35rem;
    margin-right: .24rem;
  }
  .contList li .bottommer .rightB .attr{
    font-size: .29rem;
    color: #999;
  }
  .contList li .bottommer .price{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .contList li .bottommer .price .leftP span{
    font-size: .29rem;
    color: #333;
  }
  .contList li .bottommer .price .leftP strong{
    font-size: .37rem;
    color: #F70057;
    font-weight: 400;
  }
  .contList li .bottommer .price .rightP{
    margin-right: .24rem;
    color: #FF005A;
    font-size: .29rem;
  }
</style>
