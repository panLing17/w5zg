<template lang="pug">
  .listBox(v-if="list")
    ul.listWrapper
      li.listItem(v-for="(item, index) in list")
        .itemWrapper(v-if="sortType===0")
          .left(v-if="index%2===0")
            img.img(:src="item.img")
          .right.margin(v-if="index%2===0")
            p.title {{item.title}}
          .right(v-if="index%2===1")
            p.title {{item.title}}
          .left.margin(v-if="index%2===1")
            img.img(:src="item.img")
        .itemWrapper(v-if="sortType===1")
          .left(v-if="index%2===1")
            img.img(:src="item.img")
          .right.margin(v-if="index%2===1")
            p.title {{item.title}}
          .right(v-if="index%2===0")
            p.title {{item.title}}
          .left.margin(v-if="index%2===0")
            img.img(:src="item.img")
</template>

<script>
    export default {
      name: "list",
      data () {
        return {
          list:[
            {
              img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
              title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发几点几点几分绝地反击发打发第三方个人体会然后呢'
            },
            {
              img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
              title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发'
            },
            {
              img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
              title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发'
            },
            {
              img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
              title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发'
            },
            {
              img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
              title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发'
            }
          ],
          sortType:0
        }
      },
      watch: {
        '$route' (to, from) {
          this.sortType = Number(to.params.id)%2;
          this.list = null;
          let _this = this;
          setTimeout(() => {
            _this.list = [
              {
                img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
                title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发几点几点几分绝地反击发打发第三方个人体会然后呢'
              },
              {
                img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
                title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发'
              },
              {
                img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
                title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发'
              },
              {
                img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
                title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发'
              },
              {
                img: 'http://img4.imgtn.bdimg.com/it/u=724899012,942089236&fm=200&gp=0.jpg',
                title:'技术交底见覅时代峻峰ID见覅圣诞节覅京东方isID福建省地激发'
              }
            ]
          },10)
        }
      }
    }
</script>

<style scoped>
  .listBox {
    margin-top: 2.23rem;
    padding: 0 .2rem;
    background: #fff;
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
