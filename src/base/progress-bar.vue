<template>
  <div class="progress-bar" ref='progressBar' @click='progressBarClick'>
    <div class="bar-inner">
      <div class="progress" ref='progress'></div>
      <div class="progress-btn-wrapper" ref='progressBtn'
           @touchstart.prevent='touchStart'
           @touchmove.prevent='touchMove'
           @touchend='touchEnd'>
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
const transform = prefixStyle('transform')
  export default{
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    components: {},
    data () {
      return {}
    },
    created () {
      this.touch = {}
    },
    computed: {},
    methods: {
      touchStart (e) {
        this.touch.ininal = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      touchMove (e) {
        if (!this.touch.ininal) {
          return
        }
        const deltax = e.touches[0].pageX - this.touch.startX
        // 计算出  黄色按钮 在触摸之后 应该在哪个位置 进度条应该是多少的百分比
        var movex = Math.max(0, this.touch.left + deltax)
        // 但是到这里 就得做一下判断 移动的最大的举例 不得超过进度条的总宽度   不过也还好 我估计这种情况不会发生
        this.offset(movex)
      },
      touchEnd () {
        this.touch.ininal = false
        this.triggerPercent()
      },
      offset (moveWidth) {
        this.$refs.progressBtn.style[transform] = `translate3d(${moveWidth}px,0,0)`
        this.$refs.progress.style.width = `${moveWidth}px`
      },
      triggerPercent () {
        const totalWidth = this.$refs.progressBar.clientWidth
        const percent = this.$refs.progress.clientWidth / totalWidth
        this.$emit('percentChange', percent)
      },
      progressBarClick (e) {
        /*
         var moveWidth = e.offsetX;  这样获取的 moveWidth 在我们点击按钮的时候 会出现bug
         所以在这里 我们对他进行改造
         */
        var rect = this.$refs.progressBar.getBoundingClientRect()
        var moveWidth = e.pageX - rect.left
        this.offset(moveWidth)
        this.triggerPercent()
      }
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.ininal) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const movewidth = newPercent * barWidth
          // 黄色按钮图标 移动 进度条的宽度 加宽
          this.offset(movewidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
