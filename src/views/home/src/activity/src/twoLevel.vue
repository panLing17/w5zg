<template lang="pug">
  .wrap
    nav-bar(background="white")
      .topLeft(slot="left", @click="back")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="width: 5rem;text-align: center;") 美妆
      .topRight(slot="right")
    .mescroll#twoLevelMescroll
      .contentWrapper
        .block
          .blockTitle
            .name 大牌推荐
            .more(v-if="brand.show", :class="{down: !brand.status, up: brand.status}", @click="dropCheck(0)")
          ul.brandList(:style="{'max-height': brand.height}", ref="brand")
            li.brandItem(v-for="(item, index) in brandList", :key="index")
              img.brandImg(:src="item.img")
              .brandName {{item.name}}
        .block
          .blockTitle
            .name 精选分类
            .more(v-if="category.show", :class="{down: !category.status, up: category.status}", @click="dropCheck(1)")
          ul.categoryList(:style="{'max-height': category.height}", ref="category")
            li.categoryItem(v-for="(item, index) in categoryList", :key="index")
              img.categoryImg(:src="item.img")
              .categoryName {{item.name}}
        img.louceng(src="../../../../../assets/img/louceng2.png")
</template>

<script>
  export default {
    name: "twoLevel",
    data () {
      return {
        brand: {
          show: true,
          status: false,
          height: '5.32rem',
          auto: ''
        },
        category: {
          show: true,
          status: false,
          height: '3.36rem',
          auto: ''
        },
        brandList: [
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          },
          {
            img: 'http://img5.imgtn.bdimg.com/it/u=211538858,2454809367&fm=27&gp=0.jpg',
            name: '雅诗兰黛'
          }
        ],
        categoryList: [
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=118412108,1954933262&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
          {
            img: 'http://img4.imgtn.bdimg.com/it/u=3179922072,3856683512&fm=27&gp=0.jpg',
            name: '美妆'
          },
        ]
      }
    },
    mounted () {
      this.getHeight()
    },
    methods: {
      getHeight () {
        if (this.brandList.length <= 6) {
          this.brand.show = false
        }
        if (this.categoryList.length <= 10) {
          this.category.show = false
        }
        this.brand.height = 'none'
        this.category.height = 'none'
        this.$nextTick(()=>{
          this.brand.auto = this.$refs.brand.offsetHeight + 'px'
          this.category.auto = this.$refs.category.offsetHeight + 'px'
          this.brand.height = '5.32rem'
          this.category.height = '3.36rem'
        })
      },
      dropCheck (index) {
        if (index === 0) {
          this.brand.status = !this.brand.status
          if (this.brand.status) {
            this.brand.height = this.brand.auto
          } else {
            this.brand.height = '5.32rem'
          }
        }

        if (index === 1) {
          this.category.status = !this.category.status
          if (this.category.status) {
            this.category.height = this.category.auto
          } else {
            this.category.height = '3.36rem'
          }
        }
      },
      back () {
        if (window.history.length<=2) {
          this.$router.push('/home')
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style scoped>
  .mescroll {
    position: fixed;
    top: 1.3rem;
    left: 0;
    bottom: 0;
    height: auto;
  }
  .block {
    padding: 0 .26rem;
  }
  .blockTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.2rem;
  }
  .name {
    flex: none;
    font-size: .48rem;
    color: #333;
    font-weight: bold;
  }
  .more {
    flex: none;
    width: 1rem;
    height: 1rem;
  }
  .more.down {
    background: url("../../../../../assets/img/ic_page_xljt@2x.png") no-repeat center right;
    background-size: .37rem;
  }
  .more.up {
    background: url("../../../../../assets/img/ic_page_fhjt@2x.png") no-repeat center right;
    background-size: .37rem;
  }
  .brandList {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    transition: all 0.5s;
  }
  .brandItem {
    width: 2.933rem;
    height: 1.6rem;
    position: relative;
    margin: 0 .3333rem .26rem 0;
    border: 1px solid #fff;
    box-sizing: border-box;
    border-radius: 0.13rem;
    overflow: hidden;
  }
  .brandItem:nth-child(3n) {
    margin-right: 0;
  }
  .brandImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: .13rem;
    z-index: -1;
  }
  .brandName {
    font-size: .42rem;
    color: #fff;
    line-height: 1;
    margin-top: .73rem;
    text-align: center;
  }
  .categoryList {
    padding: 0 .26rem;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    transition: all 0.5s;
  }
  .categoryItem {
    margin: 0 .8rem .26rem 0;
    width: 1.133rem;
    height: 1.55rem;
    overflow: hidden;
    position: relative;
  }
  .categoryItem:nth-child(5n) {
    margin-right: 0;
  }
  .categoryImg {
    width: 1.133rem;
    height: 1.133rem;
    pointer-events: none;
  }
  .categoryName {
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
    font-size: .26rem;
    color: #333;
    width: 100%;
  }
  .louceng {
    margin-top: .26rem;
    width: 100%;
    pointer-events: none;
  }
</style>
