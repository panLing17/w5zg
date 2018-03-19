<template lang="pug">
  .box
    .inputBox
      .label(:style="{width:labelWidth}")
        span.required(v-if="required") *
        span {{label}}
      input(:type="type", :placeholder="placeholder", v-model="msg", @input="changeValue", @change="handChange", @focus="handFocus", @blur="handBlur")
    .button(v-if="inputButton", :class="{cover:buttonCover}")
      slot(name="button")
    transition(name="fade", mode="out-in")
      p(:style="{paddingLeft:labelWidth}", v-if="error.length>0").error {{error}}
      .errorPlaceholder(v-else)
</template>

<script>
  export default {
    name: 'input',
    model: {
      prop: 'msg',
      event: 'cMsg'
    },
    props: {
      msg: {
        type: String
      },
      type: {
        type: String,
        default: 'text'
      },
      label: {
        type: String
      },
      labelWidth: {
        type: String,
        default: '1.5rem'
      },
      placeholder: {
        type: String,
        default: '请输入'
      },
      required: {
        type: Boolean,
        default: false
      },
      inputButton: {
        type: Boolean,
        default: false
      },
      buttonCover: {
        type: Boolean,
        default: false
      },
      error: {
        type: String,
        default: ''
      }
    },
    methods: {
      changeValue () {
        this.$emit('cMsg', this.msg)
      },
      handChange () {
        this.$emit('change', this.msg)
      },
      handFocus () {
        this.$emit('focus', this.msg)
      },
      handBlur () {
        this.$emit('blur', this.msg)
      }
    }
  }
</script>

<style scoped>
  .box {
    position: relative;
  }

  .label {
    height: .8rem;
    display: flex;
    align-items: center;
    font-size: .35rem;
  }

  .required {
    font-size: .6rem;
    padding-top: .3rem;
  }

  .inputBox {
    width: 8rem;
    display: flex;
  }

  .inputBox input {
    flex-grow: 1;
    height: .8rem;
    border: none;
    outline: none;
    border-bottom: solid 1px rgb(51, 51, 51);
    /* -webkit-box-shadow: 0 0 0 400px rgb(242,242,242) inset;*/
    background: none;
  }

  .button {
    width: 2.5rem;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }
  .cover{
    background: rgb(242,242,242);
  }
  .error {
    height: .8rem;
    line-height: .8rem;
    font-size: .3rem;
    color: rgb(245, 0, 87);
  }

  .errorPlaceholder {
    height: .8rem;
  }
</style>
