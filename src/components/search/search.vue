<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref='searchBox' @inputMsg='onInputMsg'></search-box>
    </div>
    <div class="shortcut-wrapper" ref='shortcutWrapper' v-show='!searchMsg'>
      <div class="shortcut">
        <div class="hot-key">
          <h1 class='title'>热门搜索</h1>
          <ul>
            <li @click='addMsg(item.k)' class='item' v-for='item in hotKey'>
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show='searchMsg'>
      <suggest @listScroll="blurInput" :searchMsg='searchMsg' ref='suggest'></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from '../../base/search-box.vue'
  import {getHotKey} from '../../api/search'
  // 引入搜索结果页面
  import suggest from '../../components/suggest/suggest.vue'

  export default{
    components: {
      SearchBox,
      suggest
    },
    props: {},
    data(){
      return {
        hotKey: [],
        searchMsg: ''
      }
    },
    created(){
      this._getHotKey()
    },
    computed: {},
    methods: {
      onInputMsg(searchMsg){
        this.searchMsg = searchMsg
      },
      _getHotKey(){
        getHotKey().then((res) => {
          if (res.code === 0) {
            console.log(res.code);
            this.hotKey = res.data.hotkey.slice(0, 10);
          }
        })
      },
      addMsg(msg){
        this.$refs.searchBox.setMsg(msg);
      },
      blurInput(){
        this.$refs.searchBox.blur()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
