<template>
  <transition name='slide'>
    <music-list :title='title' :bg-image='bgImage' :songs='songs'></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from '../../api/singer'
  import {resCode} from '../../api/config'
  import {createSong}  from 'common/js/song'
  // 引入 music-list组件
  import MusicList from '../../components/music-list/music-list.vue'

  export default{
    props: {},
    components: {
      MusicList
    },
    data(){
      return {
        songs: []
      }
    },
    computed: {
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      // mapgetters需要在计算属性中 声明
      ...mapGetters([
        'singer'
      ])
    },
    created(){
      // 此时 我们可以根据this.singer这样写 获得我们需要的数据
      // 调用一个获取歌手详情的方法
      this._getDetail()
    },
    mounted(){

    },
    methods: {
      _getDetail(){
        //  如果singer没有这个id  那么设置一下跳转 让他 调到歌手页那里
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === resCode) {
            // console.log(res.data.list)  ;
            this.songs = this.normalizeSongs(res.data.list);
          }
        })
      },
      normalizeSongs(list){
        let ret = [];
        list.forEach((item) => {
          // 对象的解构赋值 等同于 var musicData = item.musicData
          let {musicData} = item;
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret;
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
