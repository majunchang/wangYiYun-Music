<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" >
        <div class="icon">
          <i></i>
        </div>
        <div class="name">
          <p class='text'></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {search}  from '../../api/search'

  const TYPE_SINGER = 'singer'
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
    components: {},
    data(){
      return {}
    },
    created(){

    },
    computed: {},
    methods: {
      search(){
        this.page = 1;
        search(this.searchMsg,this.page,this.showSinger).then((res)=>{
            console.log(res);
            if(res.code===0){
                console.log(res);
                this.result = this.genResult(res.data);
            }
        })
      },
      genResult(){
        let ret = []
        if (data.zhida && data.zhida.singerid) {
            console.log({...data.zhida});
            console.log(...{type:TYPE_SINGER});
            console.log({...data.zhida, ...{type: TYPE_SINGER}});
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    watch: {
      searchMsg(newVal){
          console.log('tangyan');
        this.search(newVal)
      }
    }
  }
</script>

<style>

</style>
