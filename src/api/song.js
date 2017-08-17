/**
 * Created by majunchang on 2017/8/1.
 */
import { commonParams } from './config'
import axios from 'axios'

// 在这里仿照 推荐页面的 歌单列表数据 使用axios配合代理去获取

export  function getLyric(mid) {
  const  url = '/api/lyric'

  const data = Object.assign({},commonParams,{
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}
