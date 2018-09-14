<template lang="pug">
  .wraps
    .empty(v-if="!tabHList.length", :class="{tops:topF}")
      .imgs
        img(src="../../../assets/img/coupon-icon2@2x.png")
      .words 暂时没有推荐活动
      .goToHome(@click="$router.push('/home')") 去商城首页
    .activityCont.mescroll#activityMescroll
      ul.tabH
        li(v-for="items in tabHList")
          .times
            .timeSon {{items.notice_time_str}}
          .conts(@click="goToLinks(items)")
            .upper
              .lefters
                .pointer(v-if="items.ms_status === '5303'")
                .titleN(:class="{active2:items.ms_status === '5303'}") {{items.ms_title}}
              .righters 点击查看 ＞
            .centers
              img(:src="items.ms_thumbnail | img-filter")
            .downner <span>{{items.content}}</span>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
      name: "activityM",
      data(){
        return{
          topF: '',
          tabHList: []
        }
      },
      computed: {
        ...mapState(['position'])
      },
      beforeDestroy(){
        this.mescroll.hideTopBtn()
        this.mescroll.destroy()
      },
      activated(){
        // this.position.forEach((now) => {
        //   if (now.path === this.$route.path) {
        //     this.mescroll.scrollTo(now.y, 0)
        //   }
        // })
        this.mescroll.resetUpScroll()
      },
      mounted(){
        this.$mescrollInt('activityMescroll', this.upCallback, ()=>{

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
        // 活动通知点击后跳转哪个页面
        goToLinks(e){
          console.log(e)
          if (e.url_type === '603') {
            this.$router.push({path:'/goodsDetailed',query:{id:e.relate_id}})
          } else{
            window.location.href = e.url
          }
          if (e.ms_status === '5303') {
            let self = this
            self.$ajax({
              method: 'post',
              url: self.$apiMember + '/ucMessageActivity/viewMessage',
              params:{
                maoId: e.mao_id
              }
            }).then(function (res) {
              if (res.data.code === '081') {
                //self.mescroll.resetUpScroll()
              }
            })
          }
        },
        upCallback: function (page) {
          let self = this
          self.getListDataFromNet2(page.num, page.size, function (curPageData) {
            if (page.num === 1) self.tabHList = []
            self.tabHList = self.tabHList.concat(curPageData)
            self.mescroll.endSuccess(curPageData.length)
          }, function () {
            // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            self.mescroll.endErr()
          })
        },
        getListDataFromNet2 (pageNum,pageSize,successCallback,errorCallback) {
          let self = this
          self.$ajax({
            method: 'get',
            url: self.$apiMember + 'ucMessageActivity/queryMessageActivityPage',
            params: {
              page: pageNum,
              rows: pageSize
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            console.log(response.data.data.rows)
            successCallback&&successCallback(response.data.data.rows)//成功回调
          })
        }
      }
    }
</script>

<style scoped>
  .active2{
    font-weight: 600 !important;
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
  #activityMescroll{
    position: fixed;
    top: 2.21rem;
    bottom: 0;
    height: auto;
    background-color: #f2f2f2;
  }
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
  .downner span{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
