import Vue from 'vue'
import Router from 'vue-router'

// 引入组  每一个tab栏  切换之后的 组件
import recommend from '../components/recommend/recommend.vue'
import singer from '../components/singer/singer.vue'
import rank from '../components/rank/rank.vue'
import search from '../components/search/search.vue'

// 引入歌手详情页
import singerDetail from '../components/singer-detail/singer-detail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: recommend
    },
    {
      // /singer/${item.id}
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: rank
    },
    {
      path: '/search',
      component: search
    }
  ]
})
