// 引入 es6 api的解析插件 和 移动端点击延迟300毫秒的插件
import 'babel-polyfill'
import fastClick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入vuex
import store from './store'
// 引入懒加载插件
import VueLazyload from 'vue-lazyload'


import 'common/stylus/index.styl'
// 使用 fastclick插件
fastClick.attach(document.body);

Vue.config.productionTip = false
// 在这里使用 vue-lazy-load插件
Vue.use(VueLazyload,{
  loading: require('common/image/wangyi.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
