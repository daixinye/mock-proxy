'use strict'
const http = require('http')
const net = require('net')
const url = require('url')

const hosts = require('./hosts')

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
        
        console.log('Proxy Server listening on %s', this.config.port)
    }

    onRequest(clientRequest, clientResponse) {
        // 判断是否需要走 mock
        let _url = url.parse(clientRequest.url)
        let mockData = this.format(hosts.get(_url.hostname))
        let options = null

        if(mockData){
            // 走 mock 
            clientRequest.headers['Host'] = _url.hostname
            options = {
                host: mockData.host,
                port: mockData.port || 80,
                path: _url.path,
                method: clientRequest.method, 
                headers: clientRequest.headers
            }
            console.log('%s %s => %s', clientRequest.method, clientRequest.url, mockData.host)
        }else{
            // 正常走线上 转发
            options = {
                hostname: _url.hostname,
                port: _url.port || 80,
                path: _url.path,
                method : clientRequest.method,
                headers: clientRequest.headers
            }
            console.log('%s %s', clientRequest.method, clientRequest.url)
        }

        let proxyRequest = http.request(options, proxyResponse => {
            clientResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers)
            proxyResponse.pipe(clientResponse)
        }).on('error', e => {
            console.log(e)
        })
        clientRequest.pipe(proxyRequest)
    }

    format(data = null){
        if(!data){
            return
        }

        let is_mock = data.valid === -1 ? false : true
        
        if(data && is_mock){
            let {
                hostname,
                config,
                valid
            } = data
            let validConfig = config[valid]
            return {
                hostname,
                host: validConfig.host,
                port: validConfig.port || 80
            }
        }else{
            return null
        }
    }
}

module.exports = Proxy