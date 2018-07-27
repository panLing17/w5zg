<template lang="pug">
  .wrapNav
    nav-bar(background="rgb(244, 0, 87)")
      .topLeft(slot="left")
        img(src="../../../assets/img/ic_order_return.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 收藏夹
      .topRight(slot="right", @click="zhengli") {{zheng == 0 ?'整理':'完成'}}
    .contList
      ul
        li(v-for="item in contLists")
          .checkbox(v-if="zheng != 0")
            w-checkbox(@change="change", v-model="item.selected")
          .lefter
            img(:src="item.gi_image_url | img-filter")
          .righter
            .text {{item.gi_name}}
            .price <span>实付价:</span><strong>{{item.direct_supply_price | price-filter}}</strong>
      ul.lose(v-if="deleteFlag == 1")
        li.title
          .left 失效商品共<span>2</span>件
          .right(@click="deleteFlag = !deleteFlag") 清空失效商品
        li(v-for="item in lostList")
          .lefter
            .mask 失效
            img(src="")
          .righter
            .textLose 阿迪达斯三叶草男鞋女鞋2018春史密斯绿尾小白鞋运动鞋板鞋S75187
            .lost 该商品已失效，请重新选择
    .clearFixed(v-if="zheng != 0")
      .checkAll
        w-checkbox(@change="changeAll", v-model="selectedAll")
        span 全选
      .clearBtn(@click="deleteGoods()") 删除
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "collection",
    data() {
      return {
        clearFlag: 1,
        deleteFlag: 0,
        zheng: 0,
        selectedAll: '',
        contLists: [],
        lostList: [{}, {}]
      }
    },
    computed: mapState(['collectionCheckedAll']),
    activated(){
      this.getLists()
    },
    mounted() {
      //this.getLists()
    },
    methods:{
      deleteGoods(){
        let arr = []
        let b
        this.contLists.forEach((item)=>{
          if (item.selected === true) {
            arr.push(item.fi_id)
          }
        })
        console.log(arr)
        b = arr.join(',')
        let self = this
        self.$ajax({
          method: 'delete',
          url: self.$apiGoods + 'gcFavoritesInfo/cancelFavoriteList',
          params: {
            fiIdArray: b
          }
        }).then(function (res) {
          console.log(res)
          self.zheng = 0
          self.getLists()
        })
      },
      getLists(){
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'gcFavoritesInfo/queryFavoriteList',
          params: {}
        }).then(function (res) {
          console.log(res.data.data)
          for (let i=0; i<res.data.data.length; i++) {
            res.data.data[i].selected = false
          }
          self.contLists = res.data.data
          console.log(self.contLists)
        })
      },
      change(e){
        console.log(e)
        for (let i=0; i<this.contLists.length; i++) {
          if (this.contLists[i].selected === false) {
            return this.selectedAll = false
          }
        }
        return this.selectedAll = true
      },
      changeAll(e){
        this.contLists.forEach((i)=>{
          i.selected = e
        })
      },
      zhengli(){
        this.zheng = !this.zheng
        if (this.zheng != 0) {
          this.contLists.forEach((i)=>{
            i.selected = false
          })
          this.selectedAll = false
        }
      }
    }
  }
</script>

<style scoped>
.topLeft{
  padding-left: .36rem;
  padding-top: .1rem;
}
.topCenter{
  font-size: .48rem;
  color: #fff;
}
.topRight{
  font-size: .37rem;
  color: #fff;
  padding-top: .1rem;
  padding-right: .1rem;
}
/*内容列表*/
.contList{
  padding-top: .26rem;
  background-color: #f2f2f2;
  padding-bottom: 1.89rem;
}
.contList ul{
  background-color: #f2f2f2;
}
.contList li{
  padding: .26rem;
  background-color: #fff;
  margin-bottom: .05rem;
  display: flex;
  align-items: center;
}
.checkbox{
  margin-right: .26rem;
}
.contList li .lefter{
  width: 2.4rem;
  height: 2.4rem;
}
.contList li .lefter img{
  width: 2.4rem;
  height: 2.4rem;
}
.contList li .righter{
  width: 0;
  height: 2.4rem;
  flex-grow: 1;
  margin-left: .24rem;
  padding: .08rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.contList li .righter .text{
  font-size: .35rem;
  color: #666;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.contList li .righter .price span{
  color: #666;
  font-size: .35rem;
}
.contList li .righter .price strong{
  color: #F70057;
  font-size: .37rem;
}
.contList ul.lose{
  margin-top: 1.33rem;
}
ul.lose .textLose{
  color: #23262F;
  font-size: .32rem;
}
ul.lose .lost{
  font-size: .29rem;
  color: #666;
}
ul.lose li.title{
  margin-bottom: .03rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
ul.lose li.title .left{
  margin-left: .37rem;
  color: #666;
  font-size: .35rem;
}
ul.lose li.title .right{
  margin-right: .5rem;
  color: #F8085C;
  font-size: .32rem;
}
ul.lose .lefter{
  position: relative;
  border-radius: .13rem;
}
ul.lose .lefter img{
  border-radius: .13rem;
}
ul.lose .lefter .mask{
  border-radius: .13rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .3);
  text-align: center;
  line-height: 2.4rem;
  font-size: .32rem;
  color: #fff;
}
/*底部删除按钮*/
.clearFixed{
  height: 1.38rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: 1px solid #f2f2f2;
  background-color: #fff;
  padding: 0 .26rem;
}
.clearFixed .checkAll{
  display: flex;
}
.clearFixed .checkAll span{
  margin-left: .21rem;
  color: #999;
  font-size: .37rem;
}
.clearFixed .clearBtn{
  width: 2.66rem;
  height: .96rem;
  color: #fff;
  background-color: #F70057;
  border-radius: .13rem;
  text-align: center;
  line-height: .96rem;
  font-size: .42rem;
}
</style>
