<template lang="pug">
  .counterBox(:style="{width:width,height:height,lineHeight:height}")
    span(@click="minus") -
    input( v-model="msg", @change='changeValue' , @focus="handleFocus" , type="number", :style="{height:height}")
    span(@click="plus") +
</template>

<script>
    export default {
        name: "w-counter",
        model:{
          prop:'msg',
          event:'cMsg'
        },
        props:{
          msg:{
            type:Number
          },
          min:{
            type:Number
          },
          max: {
            type: Number,
            default: 10000,
          },
          change:{
            type:Function
          },
          width:{
            type:String,
            default: '80px'
          },
          height:{
            type:String,
            default: '30px'
          }
        },
        methods:{
          changeValue(){
            if (this.msg > this.min && this.msg < this.max) {
              this.$emit('cMsg', this.msg)
              this.$emit('change')
            } else {
              this.$emit('cMsg', this.min)
            }

          },
          minus(){
            if (this.msg > this.min) {
              this.$emit('cMsg', this.msg-1)
              this.$emit('change')
            }
          },
          plus(){
            if (this.msg < this.max) {
              this.$emit('cMsg', this.msg-0+1)
              this.$emit('change')
            }
          },
          handleFocus(event) {
            this.$emit('focus', event);
            if (this.msg > this.min && this.msg < this.max) {
              this.$emit('cMsg', this.min)
            }
          }
        }
    }
</script>

<style scoped>
  .counterBox{
    width: 80px;
    line-height: 30px;
    display: flex;
    border-radius: 1px;
    border: solid 1px #ddd;
    justify-content: space-between;
  }
  .counterBox input {
    outline: none;
    width: 40px;
    height: 30px;
    background: none;
    border: none;
    text-align: center;
    color: #666;
  }
  .counterBox span {
    font-size: 18px;
    width: 30px;
    text-align: center;
    color: rgb(150,150,150);
    border: solid 1px #eee;
    border-top: none;
    border-bottom: none;
  }
</style>
