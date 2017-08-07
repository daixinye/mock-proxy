const Proxy = require('../proxy/proxy')
const proxy = new Proxy()


const http = require('http')
setTimeout(function(){
    console.log('发起 http 请求')
    http.request({
        hostname: '0.0.0.0',
        port: 8989,
        path: '',
        method: 'get',
    }, res=> {
       console.log('获取 http 响应：', res) 
    }).end()
}, 1000)

proxy.createServer()
