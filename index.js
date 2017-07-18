const Proxy = require('./proxy/proxy')
const Web = require('./web/web')

// 开启正向代理服务
let proxy = new Proxy({
    port:8889,
    ip: '0.0.0.0'
})
proxy.createServer()

// 开启本地web服务器
let web = new Web({
    port:8080
})
web.createServer()