<template>
  <transition name='slide'>
    <music-list :title="title" :bg-image="bgImage" :songs="songs"> </music-list>
  </transition>
</template>

<script>
  import MusicList from '../../components/music-list/music-list.vue'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'

  export default{
    props: {},
    components: {
      MusicList
    },
    data(){
      return {
          songs:[]
      }
    },
    created(){

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

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
