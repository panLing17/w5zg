<template lang="pug">
  .wrapNav
    .navbar
      .topLeft
        img(src="../../../assets/img/ic_order_return.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter {{mstype==='802'?'到货通知':'消息中心'}}
    .tabQ(v-if="mstype == ''")
      ul
        li(v-for="(item, index) in titles", :class="{cli:nums === index}", @click="tabQie(item, index)") {{item}}
          span {{ index===0?'('+recordS+')':'('+recordA+')' }}
      .lineDiv(ref="lineD", :class="{lefts:leftF}")
    .contList#collectMescroll(:class="{tops:topF}")
      router-view
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "inform",
    data(){
      return{
        paddingF: '',
        leftF: '',
        topF: '',
        titles: ['系统通知', '推荐活动'],
        recordS: '',
        recordA: '',
        nums: 0,
        mstype: ''
      }
    },
    computed: {
      ...mapState(['position'])
    },
    watch:{

    },
    activated(){
      this.judgeType()
      this.weiDuMessage()
      if (this.$route.path === '/inform/systemM') {
        this.nums = 0
        this.leftF = false
      } else{
        this.nums = 1
        this.leftF = true
      }

    },
    mounted(){
      this.weiDuMessage()
    },
    methods:{
      // 显示未读消息的条数
      weiDuMessage(){
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + '/ucMessage/queryMessageNum',
          params: {
          }
        }).then(function (res) {
          self.recordS = res.data.data.systemNum
          if (res.data.data.systemNum>99) {
            self.recordS = '99+'
          } else {
            self.recordS = res.data.data.systemNum
          }
          if (res.data.data.activityNum>99) {
            self.recordA = '99+'
          } else {
            self.recordA = res.data.data.activityNum
          }

        })
      },
      tabQie(item, index){
        this.nums = index
        if (index === 0) {
          this.leftF = false
          this.$router.replace({path:'/inform/systemM',query:{num:0}})
        }
        if (index === 1) {
          this.leftF = true
          this.$router.replace('/inform/activityM')
        }
        this.$refs.lineD.style.transition = 'left .5s'
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

  #collectMescroll{
    /*top: 2.21rem;*/
    /*bottom: 0;*/
    /*position: fixed;*/
    /*z-index: 100;*/
    /*background-color: #f2f2f2;*/
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
