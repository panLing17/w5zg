<template lang="pug">
  .bottomList(:style="{background:background}")
    ul.goodsList.left(:style="{background:background}", ref="left")
      li(v-for="item in listData.left" , @click.prevent="goGoods(item.gspu_id)")
        img(:src="item.gi_image_url | img-filter")
        .text <span v-if="item.carry_type!==2">专柜提货</span>{{item.goods_name}}
        .price(v-if="userData.member_type !== '092'") {{item.price | price-filter}}
          span(v-if="item.economize_price!==0") 可省{{item.economize_price}}元
        .price(v-else) {{item.price | price-filter}}
    ul.goodsList.right(:style="{background:background}", ref="right")
      li(v-for="item in listData.right" , @click.prevent="goGoods(item.gspu_id)")
        img(:src="item.gi_image_url | img-filter")
        .text <span v-if="item.carry_type!==2">专柜提货</span>{{item.goods_name}}
        .price(v-if="userData.member_type !== '092'") {{item.price | price-filter}}
          span(v-if="item.economize_price!==0") 可省{{item.economize_price}}元
        .price(v-else) {{item.price | price-filter}}
    div(style="clear:both")
</template>

<script>
  import {mapState} from 'vuex'
  // 引入bus
  import {bus} from '../bus/index'

  export default {
    name: "bottom-list",
    props: ['background'],
    data() {
      return {
        listData: {
          left: [],
          right: []
        }
      }
    },
    computed: mapState(['userData']),
    mounted() {
      // 获取传入的方法，进行瀑布流式添加数据
      bus.$on('listPush', (newData, pageNum, pageSize) => {
        this.more(newData, pageNum, pageSize)
      })
    },
    methods: {
      goGoods(id) {
        this.$router.push({path: '/goodsDetailed', query: {id: id}})
      },
      more(newList, pageNum, pageSize) {
        let leftH = this.$refs.left.clientHeight
        let rightH = this.$refs.right.clientHeight
        // 页数为1可能为下拉刷新，置空数据,将左右高度置位0，否则如果当前左边比右边高，刷新后会出现位置错位
        if (pageNum === 1) {
          this.listData.left = []
          this.listData.right = []
          leftH = 0
          rightH = 0
        }
        // 计数，onload全部完毕后删除节点(数值超过size删除)
        let num = 0
        // left列表下的盒子，目的使图片与实际图片等宽
        let box = document.createElement('div')
        box.style.width = '100%'
        box.style.height = 0
        box.style.overflow = 'hidden'

        this.$refs.left.appendChild(box)

        newList.forEach((now, index) => {
          let imgaDom = document.createElement('img')
          imgaDom.style.opacity = 0
          imgaDom.style.width = '100%'
          imgaDom.src = process.env.IMG_URL + now.gi_image_url + '?x-oss-process=style/compress'
          box.appendChild(imgaDom)
          imgaDom.onload = () => {
            num += 1
            if (num >= pageSize) {
              this.$refs.left.removeChild(box)
            }
            if (leftH > rightH) {
              this.listData.right.push(now)
              rightH += imgaDom.clientHeight
            } else {
              this.listData.left.push(now)
              leftH += imgaDom.clientHeight
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .bottomList > .left {
    float: left;
  }

  .bottomList > .right {
    float: right;
  }

  .goodsList {
    width: calc(50% - .1rem);
    background: rgb(242, 242, 242);
  }

  .goodsList li {
    border: solid 1px #f2f2f2;
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
    margin-bottom: .2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .goodsList li img {
    width: 100%;
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*max-height: 4rem;*/
  }

  .text {
    margin: 0.2rem .1rem .1rem;
    /*height: .86rem;*/
    line-height: .46rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  .text span {
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
