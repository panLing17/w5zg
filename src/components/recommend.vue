<template lang="pug">
  .bottomList
    ul.goodsList(:style="{background:background}")
      li(v-for="item in listData" , @click.prevent="goGoods(item.gspu_id)")
        img(:src="item.gi_image_url | img-filter")
        .text <span v-if="item.carry_type!==2">专柜提货</span>{{item.goods_name}}
        .price(v-if="userData.member_type !== '092'") {{item.price | price-filter}}
          span(v-if="item.economize_price!==0") 可省{{item.economize_price}}元
        .price(v-else) {{item.price | price-filter}}
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "bottom-list",
    props: ['listData', 'background'],
    computed: mapState(['userData']),
    methods: {
      goGoods(id) {
        this.$router.push({path: '/goodsDetailed', query: {id: id}})
      }
    }
  }
</script>

<style scoped>
  .goodsList {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 .2rem;
    background: rgb(242,242,242);
  }

  .goodsList li {
    border: solid 1px #f2f2f2;
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
    width: 49%;
    float: left;
    margin-bottom: .2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .goodsList li img {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    max-height: 4rem;
  }

  .text {
    margin: 4.2rem .1rem .1rem;
    /*height: .86rem;*/
    line-height: .46rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .text span{
    font-size: .3rem;
    padding: 1px .2rem 0 .2rem;
    background-color: rgb(246, 0, 87);
    color: white;
    border-radius: .2rem;
    margin-right: .1rem;
  }
  .price {
    margin: .2rem .1rem;
    color: rgb(246, 0, 87);
    font-weight: 600;
    font-size: .4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price span {
    font-weight: 500;
    font-size: .3rem;
  }

  .bottom {
    margin: .1rem;
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
  }
</style>
