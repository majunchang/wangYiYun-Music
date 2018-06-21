/**
 * Created by majunchang on 2017/7/31.
 */
// 在这里  引入 types
import * as types from './mutation-type'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_TOPLIST] (state, topList) {
    state.topList = topList
  },
  [types.SET_SEARCHHISTORY] (state, searchHistory) {
    state.searchHistory = searchHistory
  },
  [types.SET_FAVORAITELIST] (state, favoriteList) {
    state.favoriteList = favoriteList
  },
  [types.SET_PLAY_HISTORY] (state, recentPlay) {
    state.recentPlay = recentPlay
  }

}

export default mutations
