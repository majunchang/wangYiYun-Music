<template>
  <div class="singer" ref='singer'>
    <!--子组件使用$emit 去触发父组件的方法  在父组件中要使用v-on去绑定一下 这个事件-->
    <list-view :data="singers" @select ='selectSinger' ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import  Singer from 'common/js/singer'
  import {resCode} from 'api/config'
  import listView from 'base/listview'
  // 从vuex中 引入这个mutation
  import {mapMutations} from 'vuex'

  const hotLength = 10;
  const hotName = '热门';
  export default{
    components: {
      listView
    },
    props: {},
    data(){
      return {
        singers: []
      }
    },
    created(){
      this._getSingerList();
    },
    computed: {},
    methods: {
        // mapMutations  在methods中声明
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      selectSinger(item){
          this.$router.push({
            path:`/singer/${item.id}`
          })
        // 将传入的参数对象 放入vuex中  item 也就是单个的歌手对象
        console.log(item);
        this.setSinger(item)
      },
      _getSingerList(){
        getSingerList().then((res) => {
          if (res.code === resCode) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list){
        let map = {
          hot: {
            title: hotName,
            items: []
          }
        };
        list.forEach((item, index) => {
          if (index < hotLength) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        //  我们得到了对象 但是对象的key值排布 是无序的 我们要对他进行有序的排列
        let CharArr = [];
        let hotArr = [];
        for (var k in map) {
          if (map[k].title.match(/[a-zA-Z]/)) {
            CharArr.push(map[k])
          } else if (map[k].title === hotName) {
            hotArr.push(map[k])
          }
        }
        // 此时得到了 热门数组和字符数组
        CharArr.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        })
        return hotArr.concat(CharArr);
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
