/**
 * Created by majunchang on 2017/7/31.
 */

// 引入设计模式
  import {playMode} from 'common/js/config'
  import {loadSearch} from 'common/js/cache'

const state = {
  singer:{},
  playing:false,
  fullScreen:false,
  playlist:[],
  sequenceList:[],
  mode:playMode.sequence,
  currentIndex:-1,
  disc:{},
  topList:{},
  searchHistory: loadSearch()
}



export default state



