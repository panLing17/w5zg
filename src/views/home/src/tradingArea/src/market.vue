<template lang="pug">
  .wrap
    .headerWrapper
      .header
        .back(@click="$router.go(-1)")
          img(src="../../../../../assets/img/back@2x.png")
        .title {{$route.query.name}}
    .mescroll#marketMescroll
      .brandWrapper
        .heading 全部品牌
        ul.brandList
          li.brandItem(v-for="(item, index) in brandList", :class="{active: brandItemActive===index}", :key="index", @click="brandCheck(index)")
            img.brandImg(:src="item.bi_pic_url | img-filter")
            .brandName {{item.bi_name}}
            .statusWrapper
              .status1(v-if="item.bs_type==='211'||item.bs_type==='213'") 专柜提货
              .status2(v-if="item.bs_type==='212'||item.bs_type==='213'") 预约体验
      router-view
</template>

<script>
  export default {
    name: "market",
    data () {
      return {
        brandItemActive: -1,
        brandList: [],
        marketId:''
      }
    },
    created () {
      this.marketId = this.$route.query.id
      this.getBrands()
    },
    activated () {
      this.brandItemActive = -1
      if (this.marketId!=this.$route.query.id) {
        this.marketId = this.$route.query.id
        this.getBrands()
      }
    },
    methods: {
      getBrands () {
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiApp + 'market/queryMarketBrands',
          params: {
            marketId  : this.marketId
          },
        }).then(function (response) {
          if (response) {
            self.brandList = response.data.data
          }

        })
      },
      brandCheck (index) {
        this.brandItemActive = index
        // this.$router.replace({path:'market',query:{id:this.marketId,name: this.$route.query.name,brandName:this.brandList[index].bi_name}})
        this.$router.push({path: '/goodsList', query: {name: this.brandList[index].bi_name, searchRuleConstant: 3}})
      }
    }
  }
</script>

<style scoped>
  #marketMescroll {
    position: fixed;
    top: 1.3rem;
    bottom: 0;
    height: auto;
  }
  .wrap {

  }
  .headerWrapper {
    height: 1.3rem;
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.3rem;
    border-bottom: 1px solid #f2f2f2;
    background: #fff;
    z-index: 500;
  }
  .back {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 .26rem;
    height: 1.3rem;
    display: flex;
    align-items: center;
  }
  .back img{
    width: .3rem;
  }
  .title {
    font-size: .4rem;
    font-weight: bold;
    text-align: center;
    line-height: 1.3rem;
  }
  .brandWrapper {
    padding: 0 .26rem .13rem;
    border-bottom: .53rem solid #f3f3f3;
  }
  .heading {
    font-size: .48rem;
    color: #333;
    font-weight: bold;
    padding: .4rem 0;
  }
  .brandList {
    display: flex;
    flex-wrap: wrap;
  }
  .brandItem {
    width: 2.933rem;
    height: 1.6rem;
    position: relative;
    margin: 0 .3333rem .26rem 0;
    border: 1px solid #fff;
    box-sizing: border-box;
    border-radius: 0.13rem;
    overflow: hidden;
  }
  .brandItem.active {
    border: 1px solid #f70057;
    background: #ffe8f0;
  }
  .brandItem:nth-child(3n) {
    margin-right: 0;
  }
  .brandItem.active .brandImg {
    display: none;
  }
  .brandImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: .13rem;
    z-index: -1;
  }
  .brandItem.active .brandName {
    color: #f70057;
    line-height: 1.6rem;
    margin: 0;
  }
  .brandName {
    font-size: .42rem;
    color: #fff;
    line-height: 1;
    margin-top: .73rem;
    text-align: center;
  }
  .brandItem.active .statusWrapper {
    display: none;
  }
  .statusWrapper {
    position: absolute;
    width: 100%;
    top: .13rem;
    left: 0;
  }
  .status1, .status2 {
    padding: 0 .05rem;
    height: .4rem;
    line-height: .4rem;
    text-align: center;
    font-size: .26rem;
    color: #fff;
    display: inline-block;
  }
  .status1 {
    background: #ff6565;
  }
  .status2 {
    background: #4dc57f;
  }
</style>
