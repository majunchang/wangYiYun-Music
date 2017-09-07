# 网易云音乐

## 项目截图



![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/142620768.png)  ![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/142712573.png)

![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/142654033.png)   ![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/142855284.png)

![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/142929183.png)  ![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/142948018.png)

![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/143034498.png)  ![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/143128496.png)

![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/143200457.png) ![mark](http://oneg19f80.bkt.clouddn.com/blog/20170907/143303362.png)

### 准备工作

> 我们使用 jsonp配合node代理  借用了qq音乐接口实现的 音乐播放器 

> 这是jsonp代码 

```
/**
 * Created by majunchang on 2017/7/23.
 */
import originJsonp from 'jsonp'

// 三个参数分别为 目标url 需要拼接在url上的参数 以及jsonp插件 需要的option
export default function jsonp(url,paramdata,options) {
  // 在这里引入一个  拼接字符串的方法
  url += (url.indexOf('?')< 0 ? '?':'&')+param(paramdata);

  // 在这里返回一个Promise对象
  return new Promise((resolve,reject)=>{
    // 在这里的data 跟上面的paramdata是不一样的  一个是 json的返回对象  一个是你传入的参数
    originJsonp(url,options,(err,data)=>{
      if(!err){
        resolve(data)
      }
      else {
        reject(err)
      }
    })
  })
}


function param(paramdata) {
  let url='';
  for(var k in paramdata){
    //  对参数对象里的每一项进行判断
    let value = paramdata[k] ==  undefined ? '': paramdata[k];
    url+= `&${k}=${encodeURIComponent(value)}`
  }
  // 循环结束  url 拼接完毕 将其返回
  return url
}
```

> 这是配置接口的js

```
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
```

> 这是nodejs 代码   仅仅推荐页面 用到了这个axios  其余的都是使用接口配置jsonp实现的

```
var app = express()
var apiRoutes = express.Router()

apiRoutes.get('/getDiscList',function (req,res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios.get(url,{
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e);
  })

})
app.use('/api',apiRoutes);
```

## 推荐页面

> 使用jsonp的方式 获取到数据  



#### 轮播图部分

> [https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg]()

> 部分代码如下：

```
        <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" @load='loadImg' :src="item.picUrl">
              </a>
            </div>
          </slider>
```

```
 methods: {
      _initScroll(){
          console.log(this.listenScroll);
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if(this.listenScroll){
            let _this = this;
            this.scroll.on('scroll',(pos)=>{
                _this.$emit('scroll',pos);
            })
        }
      }
```

1. 使用 better-scroll插件  将轮播图部分抽象成为一个组件 使用solt插槽 往里面填充内容
2. 使用插件的内容的相关api  和轮播组件里面的 props的 控制图片的轮播速度 间隔时间 和是否轮播 在此基础上 增加dots 也就是图片底部的圆点
3. 监听window的resize事件  当用户改变屏幕的时候 轮播效果不会发生改变
4. 访问连接 以及返回格式 数据 

#### 歌单列表部分

> [https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg](http://note.youdao.com/)

1. 由于qq音乐 对访问对象 做了限制 所以我们通过配置代理的方式 进行访问 npm run dev的时候 会在dev-server中运行 我们结合axios和express框架 配置使用代理
2. 加入loading组件和懒加载组件 在网速较低的情况下 提高了用户的体验 
3. 后台代理代码

```
var app = express()
var apiRoutes = express.Router()

apiRoutes.get('/getDiscList',function (req,res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios.get(url,{
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e);
  })

})
app.use('/api',apiRoutes);
```

## 歌手页面

> 分为歌手列表页和歌手详情页  歌手列表页需要做出左右联动 类似于 手机通讯录那样的 歌手详情页要要出模拟原生app的 滑动感觉  

### 歌手列表页

> 将他封装成了 一个 基本组件  我们需要实现以下功能

- 滑动左边 右边的不同字母 要显示当相应的颜色 
- 点击右边的首字母  左右要滚动到响应的位置 

**实现详解：**

1. 子组件使用事件监听 scroll事件 然后触发父组件的方法 根据滑动距离（也就是y值）来跟高度数组作比较
2. 点击右边的首字母之后 触发父组件的点击事件 将高度数组的相应索引的值  赋给scrolly  然后使用watch 去监听这个值 最后调用better-scroll的方法 使页面滑动到相应的位置
3. 要配合移动端的touch事件 start move end 以及使用e.touches[0]

#### 相关的代码

```
onShortcutTouchStart(e){
        // 我们的目的是获取到  你触摸的这个的index索引值
        let anchorIndex = getData(e.target, 'index');
        // js触摸事件 http://www.jianshu.com/p/832f36531df9
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex1 = anchorIndex;
        this._scroll(anchorIndex)
        this.$refs.listView.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
      },
      onShortcutTouchMove(e){
        let touchmove = e.touches[0];
        this.touch.y2 = touchmove.pageY;
        let chazhi = (this.touch.y2 - this.touch.y1) / keyWordHeight | 0;

        this.touch.anchorIndex2 = parseInt(this.touch.anchorIndex1) + chazhi;
        // 使用滚动具体距离事件
        this._scroll(this.touch.anchorIndex2)
        this.$refs.listView.scrollToElement(this.$refs.listGroup[this.touch.anchorIndex2], 0)
      },
      scroll(pos){
        this.scrollY = pos.y
      },
```

### 歌手详情页

> 技术实现难点：模拟原生移动应用实现 上滑和下滑的时候的效果

> 更多的是在于如何使用css+scroll组件 实现这些效果

```
scrollY(newVal){
        // 在这里监听 scroll的变化 并改变头部图片的值
        /*
         我们要达到两个效果 第一个效果：歌单列表向上滑动的时候 遮罩层随着向上（有一个向上的最大距离） 往下滑的时候（图片要随着你下滑的距离 有一个放大的效果）
         */
        let translateY = Math.max(this.minTransalteY, newVal);
        let scale = 1;
        let zIndex = 0;
        let blur = 0;
        const percent = Math.abs(newVal / this.imageHeight);
        if (newVal > 0) {
          scale = 1 + percent;
          zIndex = 10;
        } else {
          blur = Math.min(20, percent * 20)
        }
        // 当列表向上滑动的时候 有一个高斯模糊的效果
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        if (newVal < this.minTransalteY) {
          zIndex = 10;
          this.$refs.bgImage.style.height = `${leftHeigth}px`;
          this.$refs.bgImage.style.paddingTop = 0;
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
```

## 播放详解

#### music的获取，播放以及和vuex的联动原理详解



```
graph TD
A[api/singer/getSingerDetail方法获取到数据]-->B(components/singer-detail使用构造函数,初始化songs数组)
B-->C(singer-datail->music-list->song-list 当我们点击歌曲之后 触发了actions 将歌曲列表和歌曲索引传递)
C-->D{  state中存储了歌手 播放 状态是否全屏等信息}

```

> 我们在 vuex中存储的信息 是为了我们在多个组件之中可以  获取到歌曲的状态 从而操作audio标签 来实现我们想要的功能 

#### 歌曲播放界面---》 player.vue文件

> 切换动效部分使用了贝塞尔曲线   唱片的旋转部分使用了 css的旋转特效

> 对于歌词的解析部分使用了 插件lyric-parser           https://github.com/ustbhuangyi/lyric-parser

> 底部的圆圈 使用了svg 以及相关一些属性模拟进度

## 排行页面

> 排行页面与歌手页面非常相似  对于这样的基础组件 我们进行了复用 代码如下   文件是song—list  区别就是
>
> 在排行页面中  我们点击的歌单 使用奖杯图片以及排名的

```javascript
<template>
  <div class="song-list">
    <ul>
      <li class='item' @click='selectItem(song,index)' v-for="(song,index) in songs">
        <div class="rank" v-show='rank'>
          <span :class='getRankClass(index)' v-text='getRankText(index)'></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
          
     getRankClass(index){
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText(index){
        if (index > 2) {
          return index + 1
        }
      }        
```

## 搜索页面

> 有一个searchBox组件 充当搜索框 下面是一些热门搜索的标签 当我们进行搜索的时候 搜索结果 会复用scroll组件 

#### 对于搜索框 也就是search-box的input进行截流处理

```javascript
export  function debounce(func,delay) {
let timer;
  return function(...args){
    //  这是es6的rest参数
    if(timer){
      clearTimeout(timer);
    }
    //console.log(args);
    timer = setTimeout(()=>{
      func.apply(this,args)
    },delay);
  }
}

// 在组件中的create钩子函数中 这样使用 
 created(){
        this.$watch('inputMsg',debounce((newVal)=>{
            // console.log(newVal);
            this.$emit('inputMsg',newVal)
        },200));
    },
```

#### 在搜索之后的建议中  点击 会对你点击的对象 也就是包括了歌手和歌曲的对象进行区别

```javascript
selectItem(item) {
        /*
        判断为歌手的 选项 跳转路由 设置mumation 触发事件
         */
        if (item.type === TYPE_SINGER) {
          // 构造一个singer实例
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })

          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer);
        } else {
          this.insertSong(item)
        }
        this.$emit('selected',item)
      },
```

## 比较经典的方法

#### 封装jsonp方法

```javascript
/**
 * Created by majunchang on 2017/7/23.
 */
import originJsonp from 'jsonp'

// 三个参数粉笔为 目标url 需要拼接在url上的参数 以及jsonp插件 需要的option
export default function jsonp(url,paramdata,options) {
  // 在这里引入一个  拼接字符串的方法
  url += (url.indexOf('?')< 0 ? '?':'&')+param(paramdata);

  // 在这里返回一个Promise对象
  return new Promise((resolve,reject)=>{
    // 在这里的data 跟上面的paramdata是不一样的  一个是 json的返回对象  一个是你传入的参数
    originJsonp(url,options,(err,data)=>{
      if(!err){
        resolve(data)
      }
      else {
        reject(err)
      }
    })
  })
}


function param(paramdata) {
  let url='';
  for(var k in paramdata){
    //  对参数对象里的每一项进行判断
    let value = paramdata[k] ==  undefined ? '': paramdata[k];
    url+= `&${k}=${encodeURIComponent(value)}`
  }
  // 循环结束  url 拼接完毕 将其返回
  return url
}
```

### 混乱数组方法

```javascript
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
```

### 使用localstorage存储最近喜欢的

```javascript
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
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function saveFavorite(songTarget) {
  let songs = storage.get(favorite_key, []);
  insertArr(songs, songTarget, (item) => {
    return item.id === songTarget.id;
  }, favoriteMaxLen);
  storage.set(favorite_key, songs);
  return songs;
}
export function deleteFavorite(song) {
  let songs = storage.get(favorite_key, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(favorite_key, songs)
  return songs
}
export function loadFavorite() {
  return storage.get(favorite_key, []);
}
```

### actions中在原先的歌曲列表中插入一首歌曲的方法

```javascript
/*
 声明一个actions  是我们在 suggest的时候  但歌曲列表被检索出来的时候  我们点击歌曲列表 进行播放的事件

 为什么要这样做 因为用户在使用检索的时候 并不希望改变原先的歌曲列表
 我们在播放完  检索的这首歌之后  循环的时候 依然是循环我们原先的播放数组
 */

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequencelist = state.sequenceList.slice();
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  // 查找当前播放列表中 是否存在  待插入的歌曲 并返回起索引
  // 因为是插入歌曲 所以索引➕1
  // 插入这首歌 到当前索引的位置
  // 如果包含这首歌
  // 如果插入的序号 大于列表中的序号

  let currentSong = playlist[currentIndex];
  let findPlayIndex = findIndex(playlist, song);
  currentIndex++;
  playlist.splice(currentIndex, 0, song);

  if (findPlayIndex > -1) {
    if (currentIndex > findPlayIndex) {
      playlist.splice(findPlayIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(findPlayIndex + 1, 1);
    }
  }

  let currentSIndex = findIndex(sequencelist, song) + 1;
  let findSeqIndex = findIndex(sequencelist, song);

  sequencelist.splice(currentSIndex, 0, song);
  if (findSeqIndex > -1) {
    if (currentSIndex > findSeqIndex) {
      sequencelist.splice(findSeqIndex, 1);
    } else {
      sequencelist.splice(findSeqIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
```

