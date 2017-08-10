/**
 * Created by majunchang on 2017/7/23.
 */
import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const paramData = Object.assign({},commonParams,{
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url,paramData,options)
}

// 歌单列表
export function getDiscList() {
  const url='/api/getDiscList';

  // 需要拼接的数据
  const data = Object.assign({},commonParams,{
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url,{
      params:data
  }).then((res)=>{
    console.log(res);
    return Promise.resolve(res.data);
  })
}
