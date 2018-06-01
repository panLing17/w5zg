<template lang="pug">
  ul.bottomListWrapper
    li.bottomItem(v-for="(item, index) in bottomList", :key="index", @click="$router.push({path: 'market',query:{id:item.id, name:item.name}})")
      .bottomItemLeft
        .bottomItemName {{item.name}}
        .bottomItemAddress {{item.address}}
      .bottomItemRight 挑选品牌
</template>

<script>
  export default {
    name: "tradingAreaBottom",
    data () {
      return {
        bottomList: [],
        businessDistrictId: ''
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.businessDistrictId = to.query.id
      this.getMarket()
      next()
    },
    created () {
      this.businessDistrictId = this.$route.query.id
      this.getMarket()
    },
    methods: {
      getMarket () {
        if (!this.businessDistrictId) {
          return
        }
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiApp + 'market/queryMarket',
          params: {
            businessDistrictId: this.businessDistrictId
          },
        }).then(function (response) {
          if (response) {
            self.bottomList = response.data.data
          }
        })
      }
    }
  }
</script>

<style scoped>
  .bottomItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: .4rem .26rem;
    border-bottom: .53rem solid #f3f3f3;
  }
  .bottomItem:last-child {
    border: none;
  }
  .bottomItemRight {
    flex: none;
    padding-right: .42rem;
    background: url("../../../../../assets/img/more.png") no-repeat center right;
    background-size: .16rem auto;
    font-size: .32rem;
    color: #999;
  }
  .bottomItemLeft {
    flex: 1;
    padding-right: .26rem;
  }
  .bottomItemName {
    font-size: .42rem;
    color: #333;
    line-height: 1.4;
  }
  .bottomItemAddress {
    font-size: .32rem;
    color: #999;
    line-height: 1.4;
    margin-top: .2rem;
  }
</style>
