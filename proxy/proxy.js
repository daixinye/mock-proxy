'use strict'
const http = require('http')
const net = require('net')
const url = require('url')
const querystring = require('querystring')

const hosts = require('./hosts')

class Proxy {
    constructor(config = {
        port:8989,
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
        let body = ''
        clientRequest.setEncoding('utf8')
        clientRequest.on('data', data => body+=data)
        clientRequest.on('end', function(){
            let _url = url.parse(clientRequest.url)

            let hostConfig = hosts.get(_url.hostname)
            let options = null

            if(hostConfig){
                clientRequest.headers['Host'] = _url.hostname
                clientRequest.headers['cookie'] += hostConfig.cookie || ''
                
                options = {
                    host: hostConfig.host,
                    port: hostConfig.port,
                    path: _url.path,
                    method: clientRequest.method, 
                    headers: clientRequest.headers
                }
                console.log('Proxy: %s %s => %s (%s)', clientRequest.method, clientRequest.url, hostConfig.host, hostConfig.des)
                    
                let mock
                switch(clientRequest.method){
                    case 'GET':
                        mock = querystring.parse(_url.query)._mock
                        break
                    case 'POST':
                        mock = querystring.parse(body)._mock
                        break
                }
                mock = JSON.parse(mock)
                mock._proxy = true
                mock._request = options
                clientResponse.end(JSON.stringify(mock))
            }else{
                // 正常走线上 转发
                options = {
                    hostname: _url.hostname,
                    port: _url.port || 80,
                    path: _url.path,
                    method : clientRequest.method,
                    headers: clientRequest.headers
                }
                // console.log('Proxy: %s %s', clientRequest.method, clientRequest.url)
                let proxyRequest = http.request(options, proxyResponse => {
                    clientResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers)
                    proxyResponse.pipe(clientResponse)
                }).on('error', e => {
                    console.log(e)
                })
                clientRequest.pipe(proxyRequest)
            }
        })
    }
}

module.exports = Proxy