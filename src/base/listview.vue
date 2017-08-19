<template>
  <scroll
    :data='data'
    class='listview'
    ref="listView"
    :listen-scroll='listenScroll'
    :probe-type="probeType"
    @scroll='scroll'>
    <ul>
      <li class='list-group' v-for='group in data' ref='listGroup'>
        <h2 class='list-group-title'>{{group.title}}</h2>
        <ul>
          <li class='list-group-item' v-for='item in group.items' @click='selectItem(item)'>
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent='onShortcutTouchStart'
         @touchmove.stop.prevent='onShortcutTouchMove'>
      <ul>
        <li v-for='(item,index) in shortcutList' :data-index='index' class='item'
            :class="{'current':currentIndex===index}">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref='fixed' v-show='fixedTitle'>
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </scroll>
</template>

<script>
  // 引入scroll 基础组件
  import Scroll from 'base/scroll'
  // 引入dom.js中的getdatda方法
  import {getData}from '../common/js/dom'


  const keyWordHeight = 18
  const TITLE_HEIGHT = 30;
  export default{
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      Scroll
    },
    data(){
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created(){
      this.touch = {};
      this.listenScroll = true;
      this.listHeight = [];
      this.probeType = 3
    },
    computed: {
      shortcutList(){
        return this.data.map((value) => {
          return value.title.substr(0, 1);
        })
      },
      fixedTitle(){
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      refresh(){
        this.$refs.listView.refresh();
      },
      selectItem(item){
        // 触发 父组件的方法
        this.$emit('select', item)
      },
      onShortcutTouchStart(e){
        // 我们的目的是获取到  你触摸的这个的index索引值
        let anchorIndex = getData(e.target, 'index');
        // js触摸事件 http://www.jianshu.com/p/832f36531df9
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex1 = anchorIndex;
        this._scroll(anchorIndex)
        this.$refs.listView.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
      },
      onShortcutTouchMove(e){
        let touchmove = e.touches[0];
        this.touch.y2 = touchmove.pageY;
        let chazhi = (this.touch.y2 - this.touch.y1) / keyWordHeight | 0;

        this.touch.anchorIndex2 = parseInt(this.touch.anchorIndex1) + chazhi;
        // 使用滚动具体距离事件
        this._scroll(this.touch.anchorIndex2)
        this.$refs.listView.scrollToElement(this.$refs.listGroup[this.touch.anchorIndex2], 0)
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      _scroll(index){
        // 当index 为null的时候   或者小于0  大于最大的索引的时候
        /*
         打印结果如下: 赋值 null  较大的数
         console.log(index);
         */
        if (!index) {
          return
        }
        if (index < 0) {
          index = 0;
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2;
        }
        this.scrollY = -this.listHeight[index];
      },
      _calculateHeight(){
        this.listHeight = [];
        const list = this.$refs.listGroup
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          height += item.clientHeight
          this.listHeight.push(height);
        }
      },
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY){
        // 监听滚动距离的变化 根据移动的y值 在高度数组中判断index值
        const listHeight = this.listHeight
        // 在初始的时候  你直接向下拉 那么滑动距离是正值 我们给他固定到 索引为0的地方就好
        if (newY > 0) {
          this.currentIndex = 0;
          return
        }
        //当你在中间移动的时候  滑动距离为负值 我们在判断区间的时候  去最后的那个值
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-newY > height1 && -newY <= height2) {
            // 在这里 在距离数组中 是出于i+1的索引 但是在我们的快速入口数组中 是位于i 因为快速入口数组是基于0的
            this.currentIndex = i;
            this.diff = height2 + newY;
            return
          }
        }
        // 滚动到底部的时候
        this.currentIndex = listHeight.length - 2;
        console.log(this.currentIndex);
      },
      diff(newVal){
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
