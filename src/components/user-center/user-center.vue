<template>
  <transition name='slide'>
    <div class="user-center">
      <div class="back" @click='back'>
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div class="play-btn" ref='playBtn' @click='random'>
        <i class="icon-play"></i>
        <span class='text'>随机播放全部</span>
      </div>
      <div class="list-wrapper" ref='listWrapper'>
        <scroll ref="favoriteList" v-if="currentIndex===0" class="list-scroll" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong">
            </song-list>
          </div>
        </scroll>
        <scroll ref="searchList" v-if="currentIndex===1" class="list-scroll"
                :data="recentPlay">
          <div class="list-inner">
            <song-list :songs="recentPlay" @select="selectSong">
            </song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show='noResult'>
        <no-result :title='noResultDesc'></no-result>
      </div>
      <!--<div class="list-scroll">-->
      <!--<div class="list-inner">-->
      <!---->
      <!--</div>-->
      <!--</div>-->
    </div>
  </transition>
</template>

<script>
  import switches from '../../base/switch.vue'
  import Scroll from '../../base/scroll.vue'
  import SongList from '../../base/song-list/song-list.vue'
  import {playlistMixin} from '../../common/js/mixin'
  import {mapGetters, mapActions} from 'vuex'
  import NoResult from '../../base/ no-result/no-result.vue'

  // 引入歌曲构造函数
  import  Song from '../../common/js/song'

  export default{
    mixins: [playlistMixin],
    props: {},
    components: {
      switches,
      SongList,
      NoResult,
      Scroll
    },
    data(){
      return {
        currentIndex: 0,
        switches: [
          {
            name: '我喜欢的'
          },
          {
            name: '最近听的'
          }
        ]
      }
    },
    created(){

    },
    computed: {
      ...mapGetters([
        'favoriteList',
        'recentPlay'
      ]),
      noResult(){
        if(this.currentIndex === 0){
            return !this.favoriteList.length
        }else {
            return !this.recentPlay.length;
        }
      },
      noResultDesc(){
          if(this.currentIndex === 0){
              return '暂无收藏的歌曲'
          }else{
              return '你还没有听过任何歌曲,赶紧去试试吧'
          }
      }
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ]),
      switchItem(index) {
        this.currentIndex = index
      },
      selectSong(song, index){
        if (index != 0) {
          this.insertSong(new Song(song))
        }
      },
      back(){
        this.$router.back();
      },
      random(){
        // 1 首先判断列表 是哪一个列表 2 判断的列表数组的长度 3 遍历将他们使用song的构造函数 重新构造一遍
        let list = this.currentIndex === 0 ? this.favoriteList:this.recentPlay;
        if(list.length===0){
            return
        }
        list = list.map((song)=>{
            return new Song(song)
        })
        this.randomPlay({
          list
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .user-center
    position fixed
    top: 0
    bottom: 0
    z-index 100
    width 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
