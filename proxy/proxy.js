'use strict'
const http = require('http')
const net = require('net')
const url = require('url')
const querystring = require('querystring')

const Hosts = require('./hosts')
const hosts = new Hosts()

class Proxy {
    constructor(config = {
        port: 8989,
        ip: '0.0.0.0'
    }) {
        this.config = config

        this.clientRequest = null
        this.clientResponse = null
        this.body = ''
    }

    createServer() {
        let {
            port,
            ip
        } = this.config

        http.createServer()
            .on('request', this.onRequest.bind(this))
            .listen(port, ip)

        console.log('Proxy Server listening on %s', this.config.port)
    }

    onRequest(clientRequest, clientResponse) {
        this.clientRequest = clientRequest
        this.clientResponse = clientResponse

        clientRequest.setEncoding('utf-8')
        clientRequest.on('data', chunk => this.body += chunk)
        clientRequest.on('end', this.onEnd.bind(this))
    }

    onEnd() {
        let {
            clientRequest,
            clientResponse
        } = this

        let {
            hostname,
            port,
            path,
        } = url.parse(this.clientRequest.url)

        let {
            method,
            headers
        } = clientRequest

        let hostConfig = hosts.get(hostname)

        console.log('Proxy: %s %s', method, hostname + path)

        let options = null
        if (hostConfig) {
            Object.assign(headers, hostConfig.headers)
            Object.assign(headers, {
                cookie: headers.cookie + hostConfig.cookie,
            })
            options = {
                host: hostConfig.host,
                port: hostConfig.port,
                path,
                method,
                headers
            }
        } else {
            options = {
                hostname,
                port,
                path,
                method,
                headers
            }
        }

        let proxyRequest = http.request(options, proxyResponse => {
            clientResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers)
            proxyResponse.pipe(clientResponse)
        }).on('error', e => {
            console.log(e)
        })

        clientRequest.pipe(proxyRequest)
    }
}

module.exports = Proxy