/**
 * Created by majunchang on 2017/8/1.
 */
import {commonParams} from "./config"

import axios from 'axios'

export function getLyrics(mid) {
  const url = '/api/lyric'

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
    return promise.resolve(res.data)
  })
}
