<template>
  <div class='search-list' v-show='searches.length'>
    <li class="search-item" v-for='item in searches'>
      <span class='text'>{{item}}</span>
      <span class='icon'>
      <i class='icon-delete'></i>
    </span>
    </li>
  </div>
</template>

<script>
  export default{
    props: {
      searches: {
        type: Array,
        defaulr: []
      }
    },
    components: {},
    data(){
      return {}
    },
    created(){
      console.log(this.searches);
    },
    computed: {},
    methods: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
