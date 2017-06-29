var http = require('http')
var net = require('net')
var url = require('url')

var util = require('./util')

class Proxy {
    constructor(config = {
        port:8889,
        ip: '0.0.0.0'
    }){
        this.config = config
    }

    createServer(){
        http.createServer()
            .on('request', this.onRequest.bind(this))
            .listen(this.config.port, this.config.ip)
        
        console.log(`proxy listen :${this.config.port}`)
    }

    onRequest(clientRequest, clientResponse) {
        // 获取 mock 列表/配置
        let mockList = this.getMockList()

        // 判断是否需要走 mock
        let _url = url.parse(clientRequest.url)
        let mock = mockList[_url.hostname]
        let options = null

        if(mock){
            // 走 mock 
            clientRequest.headers['Host'] = _url.hostname
            options = {
                host: mock.host,
                port: mock.port || 80,
                path: _url.path,
                method: clientRequest.method, 
                headers: clientRequest.headers
            }
            console.log(`${clientRequest.method} ${clientRequest.url} => ${mock.host}`)
        }else{
            // 正常走线上 转发
            options = {
                hostname: _url.hostname,
                port: _url.port || 80,
                path: _url.path,
                method : clientRequest.method,
                headers: clientRequest.headers
            }
            console.log(`${clientRequest.method} ${clientRequest.url}`)
        }

        let proxyRequest = http.request(options, proxyResponse => {
            clientResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers)
            proxyResponse.pipe(clientResponse)
        }).on('error', e => {
            console.log(e)
        })
        clientRequest.pipe(proxyRequest)
    }

    getMockList(){
        return {
            'www.csdn.net': {
                des: 'test',
                host: '127.0.0.1',
                port: '8080'
            },
        }
    }
}

module.exports = Proxy