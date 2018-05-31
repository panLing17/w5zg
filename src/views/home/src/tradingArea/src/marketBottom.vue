<template lang="pug">
  .wrap
    .tagWrapper
      ul.tagList
        li.tagItem(v-for="(item, index) in tagList", :class="{active: tagItemActive[index]}", :key="index", @click="tagCheck(index)") {{item.name}}
</template>

<script>
  export default {
    name: "marketBottom",
    data () {
      return {
        tagItemActive: [],
        tagList: [
          {
            name: '美妆护肤'
          },
          {
            name: '运动'
          },
          {
            name: '母婴'
          },
          {
            name: '日化'
          },
          {
            name: '配饰'
          },
          {
            name: '鞋'
          },
          {
            name: '数码3C'
          },
          {
            name: '进口食品'
          }
        ]
      }
    },
    created () {
      this.initTagItemActive()
    },
    beforeRouteUpdate (to, from, next) {
      console.log(to.query.id)
      next()
    },
    methods: {
      initTagItemActive () {
        let _this = this
        this.tagList.forEach(()=> {
          _this.tagItemActive.push(false)
        })
      },
      tagCheck (index) {
        this.tagItemActive.splice(index, 1, !this.tagItemActive[index])
      }
    }
  }
</script>

<style scoped>
  .tagWrapper {
    padding: .26rem .26rem .13rem;
  }
  .tagList {
    display: flex;
    flex-wrap: wrap;
  }
  .tagItem {
    width: 2.26rem;
    height: .8rem;
    text-align: center;
    line-height: .8rem;
    border: 1px solid #d7d7d7;
    border-radius: 1.33rem;
    margin: 0 .1466rem .13rem 0;
    box-sizing: border-box;
    font-size: .34rem;
    color: #333;
  }
  .tagItem:nth-child(4n) {
    margin-right: 0;
  }
  .tagItem.active {
    background: #ffe8f0;
    border: 1px solid #f70057;
    color: #f70057;
  }
</style>
