<template lang="pug">
  .homeBox
    nav-bar(background="white")
      .topLeft(slot="left")
      .topCenter(slot="center") 首页
      .topRight(slot="right")
    .myInput(v-loading="checked")
      w-input(v-model="a", label="标题：", label-width="1.5rem", input-button=true, :error="message", required, button-cover)
        .inputButton(slot="button") 55s
      w-input(label="标题：", placeholder="这是个不一样的占位符", label-width="1.5rem", required)
      w-input(label-width="0")
      w-input(label-width="0", input-button=true, :type="passwordType", v-model="b")
        div(slot="button").passwordSwitch
          transition(name="fade", mode="in-out")
            img(src="../../../assets/img/visible@2x.png", v-if="showPassword", @click="passwordSwitch(false)", style="position:absolute;right:0")
          transition(name="fade", mode="in-out", style="position:absolute;right:0")
            img(src="../../../assets/img/invisible@2x.png", v-if="!showPassword", @click="passwordSwitch(true)", style="position:absolute;right:0")
    button(@click="message=''") 清空
    button(@click="message='输错了，重试吧'") 错误
    p {{a}}
    .demo
      button(@click="aaa") 确认信息
      w-checkbox(v-model = "checked")
</template>
<script>
  import WCheckbox from '../../../components/checkbox'

  export default {
    components: {WCheckbox},
    name: 'home',
    data () {
      return {
        checked: false,
        showPassword: false,
        passwordType: 'password',
        message: '',
        a: '',
        b: ''
      }
    },
    mounted () {

    },
    methods: {
      passwordSwitch (show) {
        if (show) {
          this.showPassword = true
          this.passwordType = 'text'
        } else {
          this.showPassword = false
          this.passwordType = 'password'
        }
      },
      aaa () {
        this.$confirm({
          title: '确认',
          message: '真的要这样做吗',
          confirm: () => {
            alert('确定')
          },
          noConfirm: () => {
            alert('取消')
          }
        })
      }
    }
  }
</script>

<style scoped>
  .homeBox {
    height: 100vh;
    width: 100%;
    background: white;
  }
  .myInput{
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
  }
  .demo {
    width: 3rem;
    height: 3rem;
    background: white;
  }
  .inputButton{
    width: 2rem;
    height: .9rem;
    border-radius: 1rem;
    background: rgb(245,0,87);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .passwordSwitch{
    position: relative;
    display: flex;
    height: .8rem;
    align-items: center;
  }
  .passwordSwitch img{
    width: .7rem;
  }
</style>
