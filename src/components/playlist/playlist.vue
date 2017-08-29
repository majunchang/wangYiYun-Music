<template>
  <transition name='list-fade'>
    <div class="playlist" @click='hide' v-show='showflag'>
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class='title'>
            <i class="icon"></i>
            <span class='text'></span>
            <span class='clear' @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
          </h1>
        </div>
        <scroll class="list-content" ref='listContent'>
          <ul ref='ul'>
            <li class='item' ref='list' v-for='(item,index) in sequenceList' @click='selectItem(item,index)'>
              <i class='current' :class='getCurrentIcon(item)'></i>
              <span class='text'>{{item.name}}</span>
              <span class='like'>
                <i class='icon-favorite'></i>
              </span>
              <span class='delete' @click.stop='deleteOne(item)'>
                <i class='icon-delete'></i>
              </span>
            </li>
          </ul>
        </scroll>
        <div class='list-operate'>
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click='hide'>
          <span>关闭</span>
        </div>
      </div>
      <confirm ref='confirm' @confirm='confirmClear' text='是否清空播放列表' confirmBtnText='清空'>

      </confirm>
    </div>
  </transition>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {playMode} from 'common/js/config'
  import Scroll from 'base/scroll'
  import Confirm from '../../base/confirm.vue'

  export default{
    props: {},
    components: {
      Scroll,
      Confirm
    },
    data(){
      return {
        showflag: false,
      }
    },
    created(){

    },
    computed: {
      ...mapGetters([
        'sequenceList',
        'currentSong',
        'mode',
        'playlist'
      ])
    },
    methods: {
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ]),
      hide(){
        this.showflag = false
      },
      show(){
        this.showflag = true;
        setTimeout(() => {
          this.$refs.listContent.refresh();
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
      getCurrentIcon(item){
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
      selectItem(item, index){
        // 当播放模式为 随机播放模式的时候 这个依靠顺序列表的index是无法正确匹配随机列表的  我们要根据song的id  来找到 在随机列表数组的index
        if (this.mode === playMode.random) {
          index = this.playlist.findIndex((song) => {
            return song.id === item.id;
          })
        }
        // 当播放模式为 循环列表或者单曲循环的时候
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      scrollToCurrent(current){
        // 找出当前播放的歌曲 在sequcenlist的索引 然后映射到dom上
        const index = this.sequenceList.findIndex((song) => {
          return song.id === current.id;
        })
        this.$refs.listContent.scrollToElement(this.$refs.list[index], 300);
      },
      deleteOne(item){
        this.deleteSong(item);
        if(!this.playlist.length){
            this.hide();
        }
      },
      showConfirm(){
        this.$refs.confirm.show()
      },
      confirmClear(){
        this.deleteSongList();
        this.hide();
      }
    },
    watch: {
      currentSong(newSong, oldSong){
        if (!this.showflag || newSong.id === oldSong.id) {
          return
        }
        this.scrollToCurrent(newSong);
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
