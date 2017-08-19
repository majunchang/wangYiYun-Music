/**
 * Created by majunchang on 2017/7/31.
 */
import * as types from './mutation-type'
import {playMode} from 'common/js/config'

import {shuffle} from "../../src/common/js/util"


function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id = song.id;
  })
}
export const selectPlay = function ({commit, state}, {list, index}) {
  // 在这个里面对多个commit进行封装 进行异步的调用
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 在这里 我们声明一个 action  当点击随机播放的时候  需要改变 playmode 歌曲的列表数组 顺序数组 当前的索引 以及歌曲全屏播放 和播放状态
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
