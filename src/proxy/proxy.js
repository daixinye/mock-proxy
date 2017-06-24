var http = require('http');
var net = require('net');
var url = require('url');

class Proxy {
    constructor(){
        this.clientRequest = null
        this.clientResponse = null
    }

    createServer(port){
        http.createServer()
            .on('request', this.onRequestHandler.bind(this))
            .listen(port, '0.0.0.0')
    }

    onRequestHandler(clientRequest, clientResponse) {
        this.clientRequest = clientRequest
        this.clientResponse = clientResponse

        let beforeRequest = this.beforeRequestHook.call(this)

        beforeRequest
            .then(this.request.bind(this))
            .catch(err => {
                console.log(err.message)
            })
    }

    request(){
        let _url = url.parse(this.clientRequest.url)

        let options = {
            hostname: _url.hostname,
            port: _url.port || 80,
            path: _url.path,
            method : this.clientRequest.method,
            headers: this.clientRequest.headers
        }

        let proxyRequest = http.request(options, this.onResponseHandler.bind(this))
            .on('error', e => {
                this.clientResponse.end()
            })
        
        this.clientRequest.pipe(proxyRequest)
    }

    onResponseHandler(proxyResponse){
        this.clientResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers)
        proxyResponse.pipe(this.clientResponse)
    }

    beforeRequestHook(){
        let _url = url.parse(this.clientRequest.url)
        if(_url.hostname){
            console.log('拦截到：' + this.clientRequest.url)
            return new Promise((resolve,reject) => {
                resolve({
                    message: 'success'
                })
            })
        }


        return new Promise((resolve,reject) => {
            reject({
                message: 'fail'
            })
        })
    }

    sendJSON(response, data){
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        response.end(JSON.stringify(data))
    }
}

let proxy = new Proxy()
proxy.createServer(8888)