<template lang="pug">
  .mescroll#newsMescroll
    .listBox(v-if="list")
      ul.listWrapper
        li.listItem(v-for="(item, index) in list", @click="toDetail(item.i_content_app)")
          .itemWrapper(v-if="sortType===0")
            .left(v-if="index%2===0")
              img.img(:src="item.i_photo")
            .right.margin(v-if="index%2===0")
              p.title {{item.i_abstract}}
            .right(v-if="index%2===1")
              p.title {{item.i_abstract}}
            .left.margin(v-if="index%2===1")
              img.img(:src="item.i_photo")
          .itemWrapper(v-if="sortType===1")
            .left(v-if="index%2===1")
              img.img(:src="item.i_photo")
            .right.margin(v-if="index%2===1")
              p.title {{item.i_abstract}}
            .right(v-if="index%2===0")
              p.title {{item.i_abstract}}
            .left.margin(v-if="index%2===0")
              img.img(:src="item.i_photo")
</template>

<script>
    export default {
      name: "list",
      data () {
        return {
          list:[],
          sortType:0,
          cataId: -1
        }
      },
      created () {
        // 第一次进页面获取第一个新闻类型cataId
        this.getFirstId();
      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
      },
      watch: {
        '$route' (to, from) {
          // 切换路由时必须先销毁，不然上拉加载和下拉刷新会持续增加
          this.mescroll.destroy();
          this.sortType = Number(to.params.index)%2;
          this.list = null;
          this.cataId = Number(to.params.cataId)
          this.$mescrollInt("newsMescroll",this.upCallback);
        }
      },
      methods: {
        getFirstId () {
          let _this = this;
          this.$ajax({
            method: 'get',
            url: this.$apiApp + 'index/acInformationCataList',
            params:{}
          }).then(function (response) {
            _this.cataId = response.data.data[0].ic_id;
            _this.$mescrollInt("newsMescroll",_this.upCallback);
          })
        },
        upCallback: function(page) {
          let self = this;
          this.getListDataFromNet(page.num, page.size, function(curPageData) {
            if(page.num === 1) self.list = []
            self.list = self.list.concat(curPageData)
            self.mescroll.endSuccess(curPageData.length)
          }, function() {
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            self.mescroll.endErr();
          })
        },
        getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
          let self = this;
          self.$ajax({
            method: 'get',
            url:self.$apiApp + 'index/acInformationByCataId',
            params: {
              page: pageNum,
              rows: pageSize,
              cataId:this.cataId
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            successCallback&&successCallback(response.data.data);//成功回调
          })
        },
        toDetail (data) {
          this.$store.commit('getHeadlinesDetail',data);
          this.$router.push('/home/headlinesDetail');
        }
      }
    }
</script>

<style scoped>
  .mescroll {
    margin-top: 2.23rem;
    padding: 0 .2rem 1rem;
    background: #fff;
    position: fixed;
    top: 0;
    bottom: 0;
    height: auto;
  }
  .listBox {


  }
  .listWrapper {

  }
  .listItem {
  }
  .itemWrapper {
    display: flex;
    align-items: center;
    padding: .26rem 0;
    border-bottom: 1px solid rgb(153,153,153);
  }
  .listItem:last-child .itemWrapper {
    border: none;
  }
  .left {
    flex: none;
    font-size: 0;
  }
  .right {
    flex: 1;
  }
  .left .img {
    width: 3.33rem;
    height: 2rem;
    display: inline-block;
    vertical-align: top;
  }
  .right .title {
    font-size: .4rem;
    color: rgb(51,51,51);
    line-height: 1.5;
    height: 3em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .margin {
    margin-left: .26rem;
  }

</style>
