var http = require('http')
var net = require('net')
var url = require('url')

var util = require('./util')

class Proxy {
    constructor(){
    }

    createServer(port = 8888){
        http.createServer()
            .on('request', this.onRequestHandler.bind(this))
            .listen(port, '0.0.0.0')
        
        console.log(`proxy listen :${port}`)
    }

    onRequestHandler(clientRequest, clientResponse) {
        let beforeRequest = this.beforeRequestHook(clientRequest, clientResponse)

        beforeRequest
            .then(data => {
                console.log(data.message)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    request(clientRequest, clientResponse){
        let _url = url.parse(clientRequest.url)

        let options = {
            hostname: _url.hostname,
            port: _url.port || 80,
            path: _url.path,
            method : clientRequest.method,
            headers: clientRequest.headers
        }

        let proxyRequest = http.request(options, proxyResponse => {
            clientResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers)
            proxyResponse.pipe(clientResponse)
        }).on('error', e => {
                clientResponse.end()
            })
        clientRequest.pipe(proxyRequest)
    }

    beforeRequestHook(clientRequest, clientResponse){
        let _url = url.parse(clientRequest.url)
        if(_url.hostname){
            console.log('拦截到：' + clientRequest.url)
            return new Promise((resolve,reject) => {
                util.sendJSON(clientResponse, {
                    mock: true,
                    message: 'success'
                })
                resolve({
                    message: 'replace success'
                })
            })
        }
        return new Promise((resolve,reject) => {
            reject({
                message: 'fail'
            })
        })
    }


}

let proxy = new Proxy()
proxy.createServer()