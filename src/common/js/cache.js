/**
 * Created by majunchang on 2017/8/28.
 */
//  https://github.com/ustbhuangyi/storage
import storage from 'good-storage'

const search_key = '_search_';
const ArrMaxLen = 15;

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
  console.log(storage.get(search_key,[]));
  return storage.get(search_key,[])
}
