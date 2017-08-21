<template>
  <transition name='slide'>
    <music-list :rank='rank' :title='title' :bg-image='bgImage' :songs='songs'></music-list>
  </transition>
</template>

<script>
  import MusicList from '../../components/music-list/music-list.vue'
  import {getTopMUsicList} from '../../api/rank'
  import {mapGetters} from 'vuex'
  import {createSong} from '../../common/js/song'


  export default {
    props: {},
    components: {
      MusicList
    },
    data() {
      return {
        songs: [],
        rank:true
      }
    },
    created() {
      this._getTopMUsicList()
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    methods: {
      _getTopMUsicList(){
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getTopMUsicList(this.topList.id).then((res) => {
          if (res.code === 0) {
            console.log(res);
             this.songs = this.normalizeSongs(res.songlist)
          }
        })
      },
      normalizeSongs(list){
        let ret = [];
        list.forEach((musicData) => {
          if (musicData.data.songid && musicData.data.albummid) {
            ret.push(createSong(musicData.data));
          }
        })
        return ret;
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
