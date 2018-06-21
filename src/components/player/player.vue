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
        <div class="middle"
             @touchstart.prevent='middleTouchStart'
             @touchmove.prevent='middleTouchMove'
             @touchend='middleTouchEnd'
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class='cdCls'>
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref='lyricList' :data='currentLyric&&currentLyric.lines'>
            <div class="lyric-wrapper">
              <div v-if='currentLyric'>
                <p ref='lyricLine' class='text' :class="{'current':currentLineNum === index}"
                   v-for='(line,index) in currentLyric.lines'>{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class='dot' :class="{'active':currentShow==='cd'}"></span>
            <span class='dot' :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent='percent' @percentChange='percentChange'></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click='changeMode'>
              <i :class='iconMode'></i>
            </div>
            <span class='descPlayMode' v-show='modeDesDisapper'>{{modeDes}}</span>
            <div class="icon i-left" :class='disableCls'>
              <i class="icon-prev" @click='prev'></i>
            </div>
            <div class="icon i-center" :class='disableCls'>
              <i @click.stop='togglePlaying' :class='playIcon'></i>
            </div>
            <div class="icon i-right" :class='disableCls'>
              <i class="icon-next" @click='next'></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" class="'icon" :class="getFavoriteIcon(currentSong)"></i>
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
          <progress-circle :diameter='diameter' :percent='percent'>
            <i @click.stop="togglePlaying" class='icon-mini' :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop='showPlaylist'>
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref='playlist'></playlist>
    <audio :src="currentSong.url" ref='audio' @play='ready' @error='error' @timeupdate='timeupdate'
           @ended='end'></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {prefixStyle} from 'common/js/dom'
  import animations from 'create-keyframe-animation'
  // 引入 进度条基础组件
  import ProgressBar from '../../base/progress-bar'
  // 引入圆形 circle组件
  import ProgressCircle from '../../base/progress-circle.vue'
  // 引入 播放模式的 文件
  import {playMode} from '../../common/js/config'
  // 引入混乱数组的算法
  import {shuffle} from '../../common/js/util'
  // 引入解析歌词的插件
  import lyricParser from 'lyric-parser'
  // 引入滚动组件
  import scroll from '../../base/scroll.vue'
  // 引入播放列表组件
  import playlist from 'components/playlist/playlist'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    props: {},
    components: {
      ProgressBar,
      ProgressCircle,
      scroll,
      playlist
    },
    data () {
      return {
        songReady: false,
        currentTime: '',
        diameter: 32,
        modeDesDisapper: false,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    created () {
      this.touch = {}
    },
    mounted () {

    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList',
        'favoriteList'
      ]),
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdCls () {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls () {
        return this.songReady ? '' : 'disabled'
      },
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      iconMode () {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      modeDes () {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlaylist: 'SET_PLAYLIST'
      }),
      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      // 注册 cd img的动画效果
      enter (el, done) {
        const {x, y, scale} = this.getPosAndScale()

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
      afterEnter () {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave (el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.8s'
        const {x, y, scale} = this.getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave () {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      getPosAndScale () {
        // 在这里方法里面 我们需要计算出  偏移的x,y值 以及放大缩小的倍数
        // 这里的偏移是 根据中心点做计算的
        const smallWidth = 40
        const smallLeft = 40
        const smallBottom = 30
        const cdTop = 80
        const cdWidth = window.innerWidth * 0.8
        const scale = smallWidth / cdWidth
        const x = -(window.innerWidth / 2 - smallLeft)
        const y = window.innerHeight - cdTop - cdWidth / 2 - smallBottom
        return {
          x,
          y,
          scale
        }
      },
      togglePlaying () {
        this.setPlayingState(!this.playing)
        // 暂停的时候 歌词就不要继续进行了
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      prev () {
      //  实现上一曲下一曲的原理 是 通过改变索引值 利用songList的索引 改变当前的currentSong  这个以改变 我们的watch就会被触发  就会播放音乐
        if (!this.songReady) {
          return
        }
        //        console.log(this.playlist.length);
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.songReady = false
          if (!this.playing) {
            this.togglePlaying()
          }
          this.setCurrentIndex(index)
        }
      },
      next () {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.songReady = false
          if (!this.playing) {
            this.togglePlaying()
          }
          this.setCurrentIndex(index)
        }
      },
      ready () {
        this.songReady = true
      },
      error () {
        this.songReady = true
      },
      timeupdate (e) {
        //  e就是 播放器的触发元素
        /* 该事件在音频/视频的播放位置发生改变时触发  通常与currentTime属性一起使用 返回音频/视频的播放位置（以秒计） */
        this.currentTime = e.target.currentTime
        this.savePlayHistory(this.currentSong)
      },
      end () {
        // 当一首播放结束的时候 要判断市以什么方式播放的 如果市单曲循环的话 那么我们就不能直接能直接 播放下一个
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        // 单曲循环的时候  让歌词回到原点
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      format (interval) {
        // 该函数的作用是 将时间戳格式转化为我们的秒数格式
        // 首先将传入的数  进行向下取整  然后 获取分钟和秒数
        interval = interval | 0
        var minute = interval / 60 | 0
        var second = this.pad(interval % 60)
        return `${minute}:${second}`
      },
      pad (time, n = 2) {
        //  time的length 是否满足 我们定制的位数
        var len = time.toString().length
        while (len < n) {
          time = '0' + time
          len++
        }
        return time
      },
      percentChange (percent) {
        //  在这里需要将 audio标签的currentTime 更改了
        this.$refs.audio.currentTime = this.currentSong.duration * percent
        var currentPercentTime = this.currentSong.duration * percent
        if (!this.playing) {
          this.togglePlaying()
        }
        //        console.log(this.currentSong.duration);
        //        console.log(currentPercentTime);
        if (this.currentLyric) {
          this.currentLyric.seek(currentPercentTime * 1000)
        }
      },
      changeMode () {
        // 获取了mode  并更改了mode
        this.modeDesDisapper = true
        clearTimeout(timer)
        var timer = setTimeout(() => {
          this.modeDesDisapper = false
        }, 500)
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        // 根据mode  去改变歌曲列表的 数组
        let finalList = null
        if (mode === playMode.random) {
          finalList = shuffle(this.sequenceList)
        } else {
          finalList = this.sequenceList
        }

        // 当你改变播放模式的时候 当前播放的歌曲 不应该也被改变 所以我们在这里  需要借助一个方法  去保持当前的歌曲不被改变
        this.resetCurrentIndex(finalList)
        this.setPlaylist(finalList)
      },
      resetCurrentIndex (list) {
        var currentIndex = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(currentIndex)
      },
      getLyric () {
        // lyricParser
        this.currentSong.getLyrics().then((lyric) => {
          if (this.currentSong.lyric != lyric) {
            return
          }
          // 将歌词进行解析
          this.currentLyric = new lyricParser(lyric, this.handleLyric)
          if (this.playing) {
            // 这是lyric-parser自带的插件
            this.currentLyric.play()
          }
        })
      },
      handleLyric ({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (this.currentLineNum > 5) {
          let lineEle = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEle, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart (e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltax = touch.pageX - this.touch.startX
        const deltay = touch.pageY - this.touch.startY
        if (Math.abs(deltay) > Math.abs(deltax)) {
          return
        }
        // 首选算出 歌词页面 距离屏幕右边的距离
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, deltax + left))
        this.touch.percent = Math.abs(deltax / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd () {
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            // 在这里 我们约定 只要大于0。1  也就是说 滑动距离超过10%  那么我们就让它进行移动
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            // 这是从右向左划的时候
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      },
      showPlaylist () {
        //  调用组件里的方法
        this.$refs.playlist.show()
      },
      toggleFavorite (song) {
        if (this.isFavorite(song)) {
          this.deleteFavoriteList(song)
        } else {
          this.saveFavoriteList(song)
        }
      },
      isFavorite (song) {
        var index = this.favoriteList.findIndex((item) => {
          return item.id === song.id
        })
        return index > -1
      },
      getFavoriteIcon (song) {
        if (this.isFavorite(song)) {
          return 'icon-favorite'
        }
        return 'icon-not-favorite'
      },
      ...mapActions([
        'saveFavoriteList',
        'deleteFavoriteList',
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        //  切换歌曲的时候 去掉定时器
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          // 在这里将获取歌词并格式化的代码 封装为一个方法
          this.getLyric()
        }, 1000)
      },
      playing () {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          this.playing ? audio.play() : audio.pause()
        })
      }
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
          .descPlayMode
            position: absolute;
            top: 36px;
            left: 29px;
            font-size: 14px;
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
