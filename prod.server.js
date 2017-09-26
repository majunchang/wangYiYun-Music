var express = require('express');
var config = require('./config/index');
var axios = require('axios');

var port = process.env.PORT || config.build.port;

var app = express()

var apiRoutes = express.Router();

apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    //console.log(response);
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
})

apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    //  由于response 是一个jsonp格式的 所以我们要对这个 进行json转化
    var result = response.data;
    var regExe = /^\w+\(({[^()]+})\)$/
    var matchArr = result.match(regExe);
    if (matchArr) {
      res.json(JSON.parse(matchArr[1]));
    }
  }).catch((e) => {
    console.log(e);
  })
})

app.use('/api', apiRoutes);

app.use(express.static('./dist'))

module.export = app.listen(port, (err) => {
  if(err){
    console.log(err);
  }
  console.log('Listening at http://localhost:' + port + '\n');
})
