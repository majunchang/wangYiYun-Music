/**
 * Created by majunchang on 2017/7/23.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const paramData = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, paramData, options)
}

// 歌单列表
export function getDiscList () {
  const url = '/api/getDiscList'

  // 需要拼接的数据
  const data = Object.assign({}, commonParams, {
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

  return axios.get(url, {
    params: data
  }).then((res) => {
    // console.log(res);
    return Promise.resolve(res.data)
  })
}

// 获取歌单详情列表
export function getSongList (disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return jsonp(url, data, options)
}

/* 改造 歌单列表列表 */

//
// export function getDiscList() {
//   var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
//
//   // 需要拼接的数据
//   const data = Object.assign({},commonParams,{
//     g_tk:'5381',
//     jsonpCallback:'getPlaylistTags',
//     loginUin:'0',
//     hostUin:'0',
//     format:'jsonp',
//     inCharset:'utf8',
//     outCharset:'utf-8',
//     notice:0,
//     platform:'yqq',
//     needNewCode:0,
//   })
//
//   return jsonp(url,data,options)
// }
