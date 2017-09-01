/**
 * Created by majunchang on 2017/8/18.
 */
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'


export  const playlistMixin = {
  computed:{
    ...mapGetters([
      'playlist'
    ]),
  },
  mounted(){
   this.handlePlaylist(this.playlist);
  },
  activated(){
    this.handlePlaylist(this.playlist);
  },
  watch: {
    playlist(newVal){
      this.handlePlaylist(newVal);
    }
  },
  methods:{
    handlePlaylist(){
      throw  new Error('component must implement handlePlaylist method')
    },
  }
}

// 由于再播放列表和歌单列表中  很多地方 有公用的关系 所以我们将公共模块提取出来

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      // 获取了mode  并更改了mode
      this.modeDesDisapper = true;
      clearTimeout(timer);
      var timer = setTimeout(() => {
        this.modeDesDisapper = false;
      }, 500)
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode)
      // 根据mode  去改变歌曲列表的 数组
      let finalList = null
      if (mode === playMode.random) {
        finalList = shuffle(this.sequenceList);
      } else {
        finalList = this.sequenceList
      }

      // 当你改变播放模式的时候 当前播放的歌曲 不应该也被改变 所以我们在这里  需要借助一个方法  去保持当前的歌曲不被改变
      this.resetCurrentIndex(finalList);
      this.setPlaylist(finalList);
    },
    resetCurrentIndex(list) {
      var currentIndex = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(currentIndex)
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }

}


export const searchMixin = {
  data(){
    return {
      searchMsg:'',
      refreshDelay:120
    }
  },
  computed:{
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods:{
    onInputMsg(searchMsg){
      console.log('majunchang');
      this.searchMsg = searchMsg
    },
    blurInput(){
      this.$refs.searchBox.blur()
    },
    addMsg(msg){
      this.$refs.searchBox.setMsg(msg);
    },
    deleteSearchHistory(msg){
      console.log('zhangtianai');
      this.deleteSearchHistory(msg);
    },
    saveSearch(){
      this.saveSearchHistory(this.searchMsg)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
