<template lang="pug">
  ul.bottomListWrapper
    li.bottomItem(v-for="(item, index) in bottomList", :key="index", @click="$router.push({path: 'market'})")
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
        bottomList: [
          {
            name: '金鹰天地（江宁店）',
            address: '江苏省南京市江宁区双龙大道1888号'
          },
          {
            name: '金鹰天地（江宁店）',
            address: '江苏省南京市江宁区双龙大道1888号'
          },
          {
            name: '金鹰天地（江宁店）',
            address: '江苏省南京市江宁区双龙大道1888号'
          },
          {
            name: '金鹰天地（江宁店）',
            address: '江苏省南京市江宁区双龙大道1888号'
          },
          {
            name: '金鹰天地（江宁店）',
            address: '江苏省南京市江宁区双龙大道1888号'
          }
        ]
      }
    },
    beforeRouteUpdate (to, from, next) {
      console.log(to.query.id)
      next()
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
