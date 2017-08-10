<template>
  <div class="player" v-show='playlist.length>0'>
    <transition name='normal'
                @enter='enter'
                @after-enter='afterEnter'
                @leave='leave'
                @after-leave='afterLeave'
    >
      <div class="normal-player" v-show='fullScreen'>
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class='cdCls'>
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">

            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class='disableCls'>
              <i class="icon-prev" @click='prev'></i>
            </div>
            <div class="icon i-center" :class='disableCls'>
              <i  @click.stop='togglePlaying' :class='playIcon'></i>
            </div>
            <div class="icon i-right" :class='disableCls'>
              <i class="icon-next" @click='next'></i>
            </div>
            <div class="icon i-right">
              <i class='icon icon-not-favorite'></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name='mini'>
      <div class="mini-player" v-show='!fullScreen' @click='open'>
        <div class="icon" :class='cdCls'>
          <img width='40' height='40' :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
            <i @click.stop="togglePlaying"  :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref='audio' @canplay = 'ready' @error='error' @timeupdate='timeupdate'></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {prefixStyle}  from 'common/js/dom'
  import animations from 'create-keyframe-animation'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default{
    props: {},
    components: {},
    data(){
      return {
        songReady:false,
        currentTime:''
      }
    },
    created(){

    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex'
      ]),
      playIcon(){
          return this.playing?'icon-pause':'icon-play'
      },
      miniIcon(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls(){
          return this.songReady?'':'disabled'
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX',
      }),
      back(){
        this.setFullScreen(false);
      },
      open(){
        this.setFullScreen(true);
      },
      // 注册 cd img的动画效果
      enter(el, done){
        const {x, y, scale} = this.getPosAndScale();

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 800,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter(){
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done){
        this.$refs.cdWrapper.style.transition = 'all 0.8s'
        const {x, y, scale} = this.getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave(){
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      getPosAndScale(){
        // 在这里方法里面 我们需要计算出  偏移的x,y值 以及放大缩小的倍数
        // 这里的偏移是 根据中心点做计算的
        const smallWidth = 40;
        const smallLeft = 40;
        const smallBottom = 30
        const cdTop = 80;
        const cdWidth = window.innerWidth * 0.8;
        const scale = smallWidth / cdWidth;
        const x = -(window.innerWidth / 2 - smallLeft);
        const y = window.innerHeight - cdTop - cdWidth / 2 - smallBottom;
        return {
          x,
          y,
          scale
        }
      },
      togglePlaying(){
        this.setPlayingState(!this.playing);
      },
      prev(){
          //  实现上一曲下一曲的原理 是 通过改变索引值 利用songList的索引 改变当前的currentSong  这个以改变 我们的watch就会被触发  就会播放音乐
        if(!this.songReady){
            return
        }
        let index = this.currentIndex - 1;
        if(index === 0){
            index = this.playlist.length-1;
        }
        this.songReady = true;
        if(!this.playing){
            this.togglePlaying()
        }
        this.setCurrentIndex(index)

      },
      next(){
        let index = this.currentIndex+1;
        if(index === this.playlist.length){
            index = 0
        }
        this.songReady = true;
        if(!this.playing){
            this.togglePlaying()
        }
        this.setCurrentIndex(index);
      },
      ready(){
        this.songReady = true;
      },
      error(){
        this.songReady = true;
      }
    },
    watch: {
      currentSong(){
        this.$nextTick(() => {
          this.$refs.audio.play();
        })
      },
      playing(){
        const  audio = this.$refs.audio;
        this.$nextTick(()=>{
            this.playing?audio.play():audio.pause();
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
