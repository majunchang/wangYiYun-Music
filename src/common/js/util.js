/**
 * Created by majunchang on 2017/8/11.
 */
//  此处 添加一个 混乱数组的方法  将一个数组内部的元素 全部打乱
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


export function shuffle(arr) {
  for (var i = 0; i < arr.length; i++) {
    var j = getRandomInt(0,i);
    var t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr
}





