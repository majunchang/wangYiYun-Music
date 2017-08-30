/**
 * Created by majunchang on 2017/8/28.
 */
//  https://github.com/ustbhuangyi/storage
import storage from 'good-storage'

const search_key = '_search_';
const ArrMaxLen = 15;

const favorite_key = '_favorite_';
const favoriteMaxLen = 200;

function insertArr(arr, val, compare, maxLen) {
  var index = arr.findIndex(compare);
  if (index === 0) {
    return
  }
  else if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)

  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

// 保存搜索历史 以及获取搜索历史
export function saveSearch(query) {
  let searches = storage.get(search_key, []);
  /* 在这里声明一个方法  用来帮助我们 查找当前query在arr中的位置
   如果是第一个 直接return  如果不是删掉 并添加在第一位
   并判断 超过最大长度的时候 删除最后的
   */
  insertArr(searches, query, (item) => {
    return item === query
  }, ArrMaxLen);
  storage.set(search_key, searches);
  return searches
}

export function loadSearch() {
  console.log(storage.get(search_key, []));
  return storage.get(search_key, [])
}

export function saveFavorite(songTarget) {
  let songs = storage.get(favorite_key, []);
  insertArr(songs, songTarget, (item) => {
    return item.id === songTarget.id;
  },favoriteMaxLen);
  storage.set(favorite_key,songs);
  return songs;
}

export function deleteSearch(query) {

  let searches = storage.get(search_key,[]);
  deleteFromArray(searches,(item)=>{
    return item === query
  })
  storage.set(search_key,searches);
  return searches;
}
function deleteFromArray(arr,compare) {
  const index = arr.findIndex(compare);
  if(index>-1){
    app.splice(index,1);
  }
}
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(favorite_key,[]);
}


