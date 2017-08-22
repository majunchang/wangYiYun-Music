<template>
  <scroll class="suggest"
          ref='suggest'
          :data='result'
          :pullUpRefresh='pullUpRefresh'
          @UPEnd='searchMore'
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for='item in result'>
        <div class="icon">
          <i :class='getIconCls(item)'></i>
        </div>
        <div class="name">
          <p class='text' v-html='getDisPlayName(item)'></p>
        </div>
      </li>
      <loading v-show='hasMore' title=''></loading>
    </ul>
  </scroll>
</template>

<script>
  import {search}  from '../../api/search'
  import {createSong} from '../../common/js/song'
  //  引入scroll组件  将这个搜索结果变为滑动的
  import Scroll from '../../base/scroll.vue'
  // 引入懒加载组件
  import loading  from '../../base/loading.vue'

  const TYPE_SINGER = 'singer'
  const perpage = 20;

  export default{
    props: {
      searchMsg: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    components: {
      Scroll,
      loading
    },
    data(){
      return {
        result: [],
        pullUpRefresh: true,
        page: 1,
        hasMore: true
      }
    },
    created(){

    },
    computed: {},
    methods: {
      search(){
        //this.page = 1;
        this.hasMore = true;
        this.$refs.suggest.scrollTo(0,0);
        search(this.searchMsg, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result = this.genResult(res.data);
            //  在这里 我们需要检测一下 是否还有更多的项
            this.checkMore(res.data);
          }
        })
      },
      genResult(data){
        let ret = []
        if (data.zhida && data.zhida.singerid) {
//          console.log({...data.zhida});
//          console.log({...data.zhida, ...{type: TYPE_SINGER}});
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
//        console.log('final');
//        console.log(ret);
        return ret
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        //console.log(ret);
        return ret
      },
      getIconCls(item){
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisPlayName(item){
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      checkMore(data){
        const song = data.song;
        if (!song.list.length || song.curnum + song.curpage * perpage > song.totalnum) {
          this.hasMore = false;
        }
      },
      searchMore(){
        if (!this.hasMore) {
            console.log('lsk');
          return
        }
        console.log('ma');
        this.page++;
        search(this.searchMsg, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result = this.result.concat(this.genResult(res.data));
            //  在这里 我们需要检测一下 是否还有更多的项
            this.checkMore(res.data);
          }
        })
      }
    },
    watch: {
      searchMsg(newVal){
        this.search(newVal)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
