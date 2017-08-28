<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref='searchBox' @inputMsg='onInputMsg'></search-box>
    </div>
    <div class="shortcut-wrapper" ref='shortcutWrapper' v-show='!searchMsg'>
      <div class="shortcut" ref='shortcut'>
        <div class="hot-key">
          <h1 class='title'>热门搜索</h1>
          <ul>
            <li @click='addMsg(item.k)' class='item' v-for='item in hotKey'>
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show='searchHistory.length'>
          <h1 class="title">
            <span class='text'>搜索历史</span>
            <span class="clear">
            <i class='icon-clear'></i>
          </span>
          </h1>
          <search-list :searches='searchHistory'></search-list>
        </div>
    </div>
    </div>
    <div class="search-result" v-show='searchMsg' ref='searchResult'>
      <suggest @listScroll="blurInput" :searchMsg='searchMsg' ref='suggest' @selected='saveSearch'></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from '../../base/search-box.vue'
  import {getHotKey} from '../../api/search'
  // 引入搜索结果页面
  import suggest from '../../components/suggest/suggest.vue'
  import {mapActions, mapGetters} from 'vuex'
  // 引入歌曲搜索列表
  import searchList from '../../base/search-list.vue'
  import {playlistMixin} from 'common/js/mixin'

  export default{
    mixins: [playlistMixin],
    components: {
      SearchBox,
      suggest,
      searchList
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
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
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
      },
      saveSearch(){
        this.saveSearchHistory(this.searchMsg)
      },
      ...mapActions([
        'saveSearchHistory',
      ]),
      handlePlaylist(playlist){
        var bottom = playlist.length > 0 ? '60px' : 0;
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        //this.$refs.shortcut.refresh()
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
