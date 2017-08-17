/**
 * Created by majunchang on 2017/8/1.
 */
// 引入 获取歌词的方法
import {getLyric} from '../../api/song'

import {Base64} from 'js-base64'

export default class Song{
  constructor ({id,mid,singer,name,album,duration,image,url}){
    this.id = id;
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyrics(){
    /* 在这里 会产生 这样的一个问题 就是每当我的currentSong发生变化的时候  就会调用这个方法 那么如果说a歌曲已经调用过该方法 并且拿到了自己的歌词数据 再次调用就会很赘余  所以我们对这个方法 进行封装和改造 */
    if(this.lyric){
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve,reject)=>{
        getLyric(this.mid).then((res)=>{
          if(res.retcode===0){
            this.lyric = Base64.decode(res.lyric);
            console.log(this.lyric);
            resolve(this.lyric)
          }else {
            reject('no lyrics')
          }
        })
    })
  }
}


// 在这里声明一个 工厂构造函数
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

function filterSinger(singer) {
  let ret = [];
  singer.forEach((item)=>{
    ret.push(item.name)
  })

  return ret.join('/');
}
