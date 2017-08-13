<template>
  <div class="progress-circle">
    <svg :width='diameter' :height='diameter' viewBox='0 0 100 100' version='1.1' xmlns='http://www.w3.org/2000/svg'>
      <circle class='progress-background' r='50' cx='50' cy='50' fill='transparent'></circle>
      <circle class='progress-bar' r='50' cx='50' cy='50' fill='transparent' :stroke-dasharray='dashArray'
              :stroke-dashoffset='dashOffset'></circle>
    </svg>
    <!--资料文档 http://www.w3cplus.com/svg/svg-fill-stroke.html  -->
    <slot></slot>
  </div>
</template>

<script>
  /*
   stroke-dasharray 是用于设置虚线的属性。你可以使用它来设置每条划线长度以及划线之间空格的大
   第一个值是划线的长度，第二个值是各个划线之间的空格大小。如果你只设置了一个值（如上面的最后一个示例），它会默认设置相同划线长度和划线空格。
   stroke-dashoffset 它可以让你设置需要图案延迟绘制的距离。它可以接受任何单位的值，同样的，如果使用的是百分比，就是相对于当前视图的百分比。
   */
  export default{
    props: {
      diameter: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    components: {},
    data(){
      return {
        dashArray: Math.PI * 100
      }
    },
    created(){

    },
    computed: {
      dashOffset(){
        return (1 - this.percent) * this.dashArray;
      }
    },
    methods: {}
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
