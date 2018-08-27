<template lang="pug">
  .bottomList(:style="{background:background}")
    ul.goodsList.left(:style="{background:background}", ref="left")
      li(v-for="item in listData.left")
        // 正常商品布局
        .goodsType(v-if="item.type === '0'", @click.prevent="goGoods(item.gspu_id)")
          img(:src="item.gi_image_url | img-filter")
          .text <span v-if="item.carry_type!==2">专柜提货</span>{{item.goods_name}}
          .price(v-if="userData.member_type !== '092'") <span>实付价:￥</span>{{item.direct_supply_price.toString().split('.')[0]}}<strong style="weight:500;font-size:.24rem;margin-top:.1rem">{{item.direct_supply_price.toString().split('.')[1]?'.'+item.direct_supply_price.toString().split('.')[1]:''}}</strong>
            //span(v-if="item.economize_price!==0") 可省{{item.economize_price}}元
          .price(v-else) <span>直供价</span>{{item.direct_supply_price | price-filter}}
          //.cabinetPrice {{item.counter_price>=item.retail_price ? '专柜价' : '专柜折后价'}} {{item.counter_price | price-filter}}
        // 广告图布局
        <!--.advertType(v-if="item.type === '333'", @click="goActivity(item)")-->
          <!--img(:src="item.image | img-filter")-->
        // 标签布局
        <!--ul.tagType(v-if="item.type === '334'")-->
          <!--.tagTitle-->
            <!--.text 细分-->
            <!--.line-->
          <!--li(v-for="(i,p) in item.data", :key="p", @click="searchKeyword(i)", :class="{tagTypeChecked:p<8}") {{i}}-->
    ul.goodsList.right(:style="{background:background}", ref="right")
      li(v-for="item in listData.right")
        // 正常商品布局
        .goodsType(v-if="item.type === '0'", @click.prevent="goGoods(item.gspu_id)")
          img(:src="item.gi_image_url | img-filter")
          .text <span v-if="item.carry_type!==2">专柜提货</span>{{item.goods_name}}
          .price(v-if="userData.member_type !== '092'") <span>实付价:￥</span>{{item.direct_supply_price.toString().split('.')[0]}}<strong style="weight:500;font-size:.24rem;margin-top:.1rem">{{item.direct_supply_price.toString().split('.')[1]?'.'+item.direct_supply_price.toString().split('.')[1]:''}}</strong>
            //span(v-if="item.economize_price!==0") 可省{{item.economize_price}}元
          .price(v-else) <span>直供价</span>{{item.direct_supply_price | price-filter}}
          //.cabinetPrice {{item.counter_price>=item.retail_price ? '专柜价' : '专柜折后价'}} {{item.counter_price | price-filter}}
        // 广告图布局
        <!--.advertType(v-if="item.type === '333'", @click="goActivity(item)")-->
          <!--img(:src="item.image | img-filter")-->
        // 标签布局
        <!--ul.tagType(v-if="item.type === '334'")-->
          <!--.tagTitle-->
            <!--.text 细分-->
            <!--.line-->
          <!--li(v-for="(i,p) in item.data", :key="p", @click="searchKeyword(i)", :class="{tagTypeChecked:p<8}") {{i}}-->
    div(style="clear:both")
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'bottom-list',
    props: ['background'],
    data() {
      return {
        tagsIndex: -1,
        advertIndex: -1,
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
        // 为了防止网速过慢导致的布局错乱问题，执行回调后则锁定上拉加载事件
        this.$parent.lockUpDown(true)
        // 将原始数据的每条加入type
        newList.forEach((now)=>{
          now.type = '0'
        })
        let leftH = this.$refs.left.clientHeight
        let rightH = this.$refs.right.clientHeight
        // 页数为1可能为下拉刷新，置空数据
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

        newList.forEach((now) => {
          let imgaDom = document.createElement('img')
          imgaDom.style.opacity = 0
          imgaDom.style.width = '100%'
          imgaDom.src = process.env.IMG_URL + now.gi_image_url + '?x-oss-process=style/compress'
          box.appendChild(imgaDom)
          // 图片出错也计数
          imgaDom.onerror = ()=>{
            num += 1
          }
          imgaDom.onload = () => {
            if (leftH > rightH) {
              this.listData.right.push(now)
              rightH += imgaDom.clientHeight
            } else {
              this.listData.left.push(now)
              leftH += imgaDom.clientHeight
            }
            num += 1
            // 若大于page，则证明已经成功加载完一页，移除盒子以及执行插入广告,并允许加载下一页
            if (num >= pageSize) {
              this.$refs.left.removeChild(box)
              this.advertInsert(pageNum, leftH, rightH)
              this.$parent.lockUpDown(false)
            }
          }
        })
      },
      advertInsert (pageNum, leftH, rightH) {
        let tagsIndex = this.tagsIndex // 标签被插了几次(上次被插索引)
        let advertIndex = this.advertIndex // 广告图被插了几次(上次被插索引)
        let fun = (data) => {
          if (leftH > rightH) {
            this.listData.right.push(data)
          } else {
            this.listData.left.push(data)
          }
        }
        if (pageNum%2===0) {
          if (this.tagsIndex+1 >= this.recommendAdvert.tags.length) {
            this.tagsIndex = 0
          } else {
            this.tagsIndex += 1
          }
          if (this.recommendAdvert.tags.length>0) {
            fun(this.recommendAdvert.tags[this.tagsIndex])
          }

        } else {  // 若为奇数
          if (this.advertIndex+1 >= this.recommendAdvert.advert.length) {
            this.advertIndex = 0
          } else {
            this.advertIndex += 1
          }
          if (this.recommendAdvert.advert.length>0) {
            fun(this.recommendAdvert.advert[this.advertIndex])
          }
        }
      },
      // 搜索关键字
      searchKeyword (keyWord) {
        this.$router.push({path:'/search',query:{key: keyWord, from: 1}})
      },
      // 前往活动
      goActivity (data) {
        this.$method.goActivity.call(this, data, 1)
        // switch (data.url_type) {
        //   // 跳外链
        //   case '143': window.location.href = data.url + '?shId=' + data.sh_id; break;
        //   // 跳3级页面 361代表从1级跳3级
        //   case '145': this.$router.push({path: '/home/sports',query:{parentType: '361',actId: data.id, title: data.title, shId: data.sh_id}}); break;
        //   // 跳商品详情页 取relate_id
        //   case '141': this.$router.push({ path: '/goodsDetailed', query: { id: data.relate_id }}); break;
        //   // 跳2级页面
        //   case '144': this.$router.push({path: '/home/largeCollection',query:{parentType: '361',actId: data.id, title: data.title, shId: data.sh_id}}); break;
        //   // 跳3级页面模板2
        //   case '149': this.$router.push({ path: '/activity', query: { actId: data.id, title: data.title, parentType: '361', shId: data.sh_id}}); break;
        //   // 跳三级页面模板2
        //   case '148': this.$router.push({path: '/twoLevel', query: {parentType: '361',actId: data.id, title: data.title, shId: data.sh_id}}); break;
        // }

        /*let {
          type: parentType,
          id: actId,
          title: title
        } = data
        this.$router.push({
          path:'/home/sports?parentType',
          query:{
            parentType:parentType,
            actId:actId,
            title:title
          }
        })*/
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
    min-height: 1px; /*保證左部是最短的，初次加載為左邊開始*/
  }

  .goodsList {
    width: calc(50% - .08rem);
    background: rgb(242, 242, 242);
  }

  .goodsList>li {
    /*border: solid 1px #f2f2f2;*/
    background: #fff;
    /*border-radius: 5px;*/
    overflow: hidden;
    width: 100%;
    margin-bottom: .16rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .goodsType>img {
    width: 100%;
    height: 4.8rem;
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*max-height: 4rem;*/
  }

  .text {
    /*position:relative;*/
    /*height: .92rem;*/

    margin: 0.2rem .25rem .1rem;
    line-height: .46rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  /*.text::after {*/
    /*content:"...";*/
    /*font-weight:bold;*/
    /*position:absolute;*/
    /*bottom:0;*/
    /*right:0;*/
    /*padding:0 20px 1px 45px;*/
    /*background:url(http://newimg88.b0.upaiyun.com/newimg88/2014/09/ellipsis_bg.png) repeat-y;*/
  /*}*/

  .text span {
    width: 1.04rem;
    height: .37rem;
    line-height: .37rem;
    font-size: .3rem;
    padding: 0 .1rem 0 .1rem;
    background-color: rgb(255, 87, 147);
    color: #fff;
    border-radius: .3rem;
    margin-right: .1rem;
  }

  .price {
    margin: .35rem .1rem .2rem .1rem;
    color: rgb(246, 0, 87);
    font-size: .48rem;
    display: flex;
    align-items: center;
  }

  .price span {
    font-weight: 500;
    font-size: .24rem !important;
    padding: 0 0 0 .15rem;
    border-radius: .5rem;
  }
  .cabinetPrice {
    margin-bottom: .2rem;
    padding: 0 .2rem;
    color: rgb(119,119,119);
  }
  .bottom {
    margin: .1rem;
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
  }
  /* 广告图布局 */
  .advertType {
    background-color: rgb(242, 242, 242);
  }
  .advertType> img{
    width: 100% !important;
    height: 100% !important;
  }
  /* 推荐标签布局 */
  .tagType {
    background-color:  rgb(242, 242, 242);
    padding: .5rem .25rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .tagTypeChecked{
    background-color: #E2EFFF !important;
  }
  .tagType>li{
    width: 47.5%;
    text-align: center;
    padding: .1rem .2rem;
    background-color: white;
    color: #666;
    float: left;
    margin-bottom: .2rem;
    border-radius: .2rem;
  }
  .tagTitle{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tagTitle .text{
    background-color: rgb(242,242,242);
    padding: 1px .2rem;
    position: relative;
    z-index: 5;
  }
  .tagTitle .line{
    width: 90%;
    height: 1px;
    background-color: #666;
    position: absolute;
  }
</style>
