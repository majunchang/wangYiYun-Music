<template>
  <div class="search-box">
    <i class='icon-search'></i>
    <input type="text" v-model='inputMsg' ref='input' class='box' :placeholder='placeholder'>
    <i @click='clearMsg' v-show='inputMsg' class='icon-dismiss'></i>
  </div>
</template>

<script>
  import {debounce}  from 'common/js/util'

  export default{
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    components: {},
    data(){
      return {
        inputMsg: ''
      }
    },
    created(){
        this.$watch('inputMsg',debounce((newVal)=>{
            // console.log(newVal);
            this.$emit('inputMsg',newVal)
        },200));
    },
    computed: {},
    methods: {
      clearMsg(){
        this.inputMsg = ''
      },
      setMsg(msg){
          this.inputMsg = msg
      },
      blur(){
        this.$refs.input.blur();
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
