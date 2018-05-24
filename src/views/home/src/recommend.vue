<template lang="pug">
  .bottomList(:style="{background:background}")
    ul.goodsList.left(:style="{background:background}", ref="left")
      li(v-for="item in listData.left")
        // 正常商品布局
        .goodsType(v-if="item.type === '0'", @click.prevent="goGoods(item.gspu_id)")
          img(:src="item.gi_image_url | img-filter")
          .text <span v-if="item.carry_type!==2">专柜提货</span>{{item.goods_name}}
          .price(v-if="userData.member_type !== '092'") {{item.price | price-filter}}
            span(v-if="item.economize_price!==0") 可省{{item.economize_price}}元
          .price(v-else) {{item.price | price-filter}}
        // 广告图布局
        .advertType(v-if="item.type === '333'")
          img(:src="item.image | img-filter")
        // 标签布局
        ul.tagType(v-if="item.type === '334'")
          li(v-for="(i,p) in item.data", :key="p") {{i}}
    ul.goodsList.right(:style="{background:background}", ref="right")
      li(v-for="item in listData.right")
        // 正常商品布局
        .goodsType(v-if="item.type === '0'", @click.prevent="goGoods(item.gspu_id)")
          img(:src="item.gi_image_url | img-filter")
          .text <span v-if="item.carry_type!==2">专柜提货</span>{{item.goods_name}}
          .price(v-if="userData.member_type !== '092'") {{item.price | price-filter}}
            span(v-if="item.economize_price!==0") 可省{{item.economize_price}}元
          .price(v-else) {{item.price | price-filter}}
        // 广告图布局
        .advertType(v-if="item.type === '333'")
          img(:src="item.image | img-filter")
        // 标签布局
        ul.tagType(v-if="item.type === '334'")
          li(v-for="(i,p) in item.data", :key="p", @click="searchKeyword(i)") {{i}}
    div(style="clear:both")
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'bottom-list',
    props: ['background'],
    data() {
      return {
        listData: {
          left: [],
          right: []
        }
      }
    },
    computed: mapState(['userData', 'recommendAdvert']),
    methods: {
      goGoods(id) {
        this.$router.push({path: '/goodsDetailed', query: {id: id}})
      },
      more(newList, pageNum, pageSize) {
        // 将原始数据的每条加入type
        newList.forEach((now)=>{
          now.type = '0'
        })
        // 页数为1可能为下拉刷新，置空数据
        if (pageNum === 1) {
          this.listData.left = []
          this.listData.right = []
        }
        // 计数，onload全部完毕后删除节点(数值超过size删除)
        let num = 0
        // left列表下的盒子，目的使图片与实际图片等宽
        let box = document.createElement('div')
        box.style.width = '100%'
        box.style.height = 0
        box.style.overflow = 'hidden'

        this.$refs.left.appendChild(box)
        let leftH = this.$refs.left.clientHeight
        let rightH = this.$refs.right.clientHeight
        newList.forEach((now) => {
          let imgaDom = document.createElement('img')
          imgaDom.style.opacity = 0
          imgaDom.style.width = '100%'
          imgaDom.src = process.env.IMG_URL + now.gi_image_url + '?x-oss-process=style/compress'
          box.appendChild(imgaDom)
          imgaDom.onload = () => {
            if (leftH > rightH) {
              this.listData.right.push(now)
              rightH += imgaDom.clientHeight
            } else {
              this.listData.left.push(now)
              leftH += imgaDom.clientHeight
            }
            num += 1
            // 若大于page，则证明已经成功加载完一页，移除盒子以及执行插入广告
            if (num >= pageSize) {
              this.$refs.left.removeChild(box)
              this.advertInsert(pageNum, leftH, rightH)
            }
          }
        })
      },
      advertInsert (pageNum, leftH, rightH) {
        let tagsIndex = -1 // 标签被插了几次(上次被插索引)
        let advertIndex = -1 // 广告图被插了几次(上次被插索引)
        let fun = (data) => {
          if (leftH > rightH) {
            this.listData.right.push(data)
          } else {
            this.listData.left.push(data)
          }
        }
        if (pageNum%2===0) {
          if (tagsIndex >= this.recommendAdvert.tags.length) {
            tagsIndex = -1
          } else {
            tagsIndex += 1
          }
          fun(this.recommendAdvert.tags[tagsIndex])
        } else {  // 若为奇数
          if (advertIndex >= this.recommendAdvert.advert.length) {
            advertIndex = -1
          } else {
            advertIndex += 1
          }
          fun(this.recommendAdvert.advert[advertIndex])
        }
      },
      // 搜索关键字
      searchKeyword (keyWord) {
        this.$router.push({path:'/page/commodityList', query:{msg:keyWord,flag:'true'}})
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

  .goodsList>li {
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
  /* 广告图布局 */
  .advertType {
    height: 4rem;
  }
  .advertType> img{
    width: 100% !important;
    height: 100% !important;
  }
  /* 推荐标签布局 */
  .tagType {
    height: 4rem;
    background-color:  rgb(242, 242, 242);
    padding: .2rem;
  }
  .tagType>li{
    padding: .1rem .2rem;
    background-color: white;
    color: #aaaaaa;
    float: left;
    margin-right: .2rem;
    margin-bottom: .2rem;
    border-radius: .2rem;
  }
</style>
