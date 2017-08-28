/**
 * Created by majunchang on 2017/7/31.
 */
import * as types from './mutation-type'
import {playMode} from 'common/js/config'

import {shuffle} from "../../src/common/js/util"
import {saveSearch} from 'common/js/cache'


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

/*
 声明一个actions  是我们在 suggest的时候  但歌曲列表被检索出来的时候  我们点击歌曲列表 进行播放的事件

 为什么要这样做 因为用户在使用检索的时候 并不希望改变原先的歌曲列表
 我们在播放完  检索的这首歌之后  循环的时候 依然是循环我们原先的播放数组
 */

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequencelist = state.sequenceList.slice();
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  // 查找当前播放列表中 是否存在  待插入的歌曲 并返回起索引
  // 因为是插入歌曲 所以索引➕1
  // 插入这首歌 到当前索引的位置
  // 如果包含这首歌
  // 如果插入的序号 大于列表中的序号

  let currentSong = playlist[currentIndex];
  let findPlayIndex = findIndex(playlist, song);
  currentIndex++;
  playlist.splice(currentIndex, 0, song);

  if (findPlayIndex > -1) {
    if (currentIndex > findPlayIndex) {
      playlist.splice(findPlayIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(findPlayIndex + 1, 1);
    }
  }

  let currentSIndex = findIndex(sequencelist, song) + 1;
  let findSeqIndex = findIndex(sequencelist, song);

  sequencelist.splice(currentSIndex, 0, song);
  if (findSeqIndex > -1) {
    if (currentSIndex > findSeqIndex) {
      sequencelist.splice(findSeqIndex, 1);
    } else {
      sequencelist.splice(findSeqIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCHHISTORY, saveSearch(query))
}
