<template>
  <transition name='slide'>
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from '../../components/music-list/music-list.vue'
  import {mapGetters} from 'vuex'
  import {getSongList} from '../../api/recommend'
  import {createSong} from '../../common/js/song'

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
    created(){
      this.getSongListDetail()
    },
    computed: {
      title(){
        return this.disc.dissname
      },
      bgImage(){
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    methods: {
      getSongListDetail(){
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        console.log(this.disc);
        getSongList(this.disc.dissid).then((res) => {
//            console.log(res);
          if (res.code === 0) {
//            console.log(res.cdlis[0].songlist);
            this.songs = this.normalizeSongs(res.cdlis[0].songlist)
          }
        })
      },
      normalizeSongs(list){
        let ret = [];
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        })
        return ret;
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
