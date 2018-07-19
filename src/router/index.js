import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
// 引入组  每一个tab栏  切换之后的 组件
// import recommend from '../components/recommend/recommend.vue'
// import singer from '../components/singer/singer.vue'
// import rank from '../components/rank/rank.vue'
// import search from '../components/search/search.vue'

const recommend = (resolve)=>{
  import('../components/recommend/recommend.vue').then((module)=>{
    resolve(module)
  })
}

const singer = (resolve)=>{
  import('../components/singer/singer.vue').then((module)=>{
    resolve(module)
  })
}

const rank = (resolve)=>{
  import('../components/rank/rank.vue').then((module)=>{
    resolve(module)
  })
}

const search = (resolve)=>{
  import('../components/search/search.vue').then((module)=>{
    resolve(module)
  })
}


// 引入歌手详情页
// import singerDetail from '../components/singer-detail/singer-detail.vue'
// // 引入 歌单详情页
// import Disc from '../components/disc/disc.vue'
// import topList from '../components/top-list/toplist.vue'
// // 引入用户中心组件
// import userCenter from '../components/user-center/user-center.vue'


const singerDetail = (resolve)=>{
  import('../components/singer-detail/singer-detail.vue').then((module)=>{
    resolve(module)
  })
}

const Disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
}
const topList = (resolve) => {
  import('../components/top-list/toplist.vue').then((module) => {
    resolve(module)
  })
}

const userCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
}


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
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
      component: rank,
      children: [
        {
          path: ':id',
          component: topList
        }
      ]
    },
    {
      path: '/search',
      component: search,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/user',
      component: userCenter
    }
  ]
})
