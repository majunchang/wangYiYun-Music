/**
 * Created by majunchang on 2017/8/11.
 */
//  此处 添加一个 混乱数组的方法  将一个数组内部的元素 全部打乱
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


export function shuffle(arr) {
  var arr1 = arr.slice();
  for (var i = 0; i < arr1.length; i++) {
    var j = getRandomInt(0,i);
    var t = arr1[i];
    arr1[i] = arr1[j];
    arr1[j] = t;
  }
  return arr1
}





