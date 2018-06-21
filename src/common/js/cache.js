/**
 * Created by majunchang on 2017/8/28.
 */
//  https://github.com/ustbhuangyi/storage
import storage from 'good-storage'

const search_key = '_search_'
const ArrMaxLen = 15

const favorite_key = '_favorite_'
const favoriteMaxLen = 200

// 制作  我最近听过的歌曲功能 所需要的参数

const play_key = '_play_'
const play_max_len = '50'

function insertArr (arr, val, compare, maxLen) {
  var index = arr.findIndex(compare)
  if (index === 0) {
    return
  } else if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)

  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 保存搜索历史 以及获取搜索历史
export function saveSearch (query) {
  let searches = storage.get(search_key, [])
  /* 在这里声明一个方法  用来帮助我们 查找当前query在arr中的位置
   如果是第一个 直接return  如果不是删掉 并添加在第一位
   并判断 超过最大长度的时候 删除最后的
   */
  insertArr(searches, query, (item) => {
    return item === query
  }, ArrMaxLen)
  storage.set(search_key, searches)
  return searches
}

export function loadSearch () {
  console.log(storage.get(search_key, []))
  return storage.get(search_key, [])
}
export function deleteSearch (query) {
  let searches = storage.get(search_key, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(search_key, searches)
  return searches
}
export function clearSearch () {
  storage.remove(search_key)
  return []
}

export function saveFavorite (songTarget) {
  let songs = storage.get(favorite_key, [])
  insertArr(songs, songTarget, (item) => {
    return item.id === songTarget.id
  }, favoriteMaxLen)
  storage.set(favorite_key, songs)
  return songs
}
export function deleteFavorite (song) {
  let songs = storage.get(favorite_key, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(favorite_key, songs)
  return songs
}
export function loadFavorite () {
  return storage.get(favorite_key, [])
}

export function savePlay (song) {
  let recentSongs = storage.get(play_key, [])
  insertArr(recentSongs, song, (item) => {
    return item.id === song.id
  }, play_max_len)
  storage.set(play_key, recentSongs)
  return recentSongs
}

export function loadPlay () {
  return storage.get(play_key, [])
}
