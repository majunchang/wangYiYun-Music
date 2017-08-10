<template>
  <div id="app">
    <Mheader></Mheader>
    <tab></tab>
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import Mheader from 'components/m-header/m-header.vue'
  import Tab from 'components/tab/tab.vue'
  // 在这里引入播放器组件
  import Player from 'components/player/player.vue'


  export default {
    name: 'app',
    components: {
      Mheader,
      Tab,
      Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
