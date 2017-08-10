/**
 * Created by majunchang on 2017/7/31.
 */
import * as types from './mutation-type'
import {playMode} from 'common/js/config'


export  const selectPlay = function ({commit,state},{list,index}) {
  // 在这个里面对多个commit进行封装 进行异步的调用
  commit(types.SET_SEQUENCE_LIST,list)
  commit(types.SET_PLAYLIST,list)
  commit(types.SET_CURRENT_INDEX,index)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}

