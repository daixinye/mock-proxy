// 这里开一个 web 服务器来处理mock请求
'use strict'
const http = require('http')
const koa = require('koa')
const fs = require('fs')

const mockDataList = require('./../config/mock.json')

class Web {
    constructor(config = {
        port: '8080'
    }){
        this.config = config
        this.app = new koa()
    }

    createServer(){
        this.app.listen(this.config.port, () => {
            console.log(`Web Server listening on ${this.config.port}`)
        })

        this.app.use(this.log)
        this.app.use(this.mock)
        this.app.use(this.setResHeader)
    }

    async log(ctx, next){
        console.log('LocalWeb: %s %s', ctx.method, ctx.url)
        await next()
    }

    async setResHeader(ctx, next){
        // 支持 ajax 带 cookie (request with Credentials)
        ctx.set("access-control-allow-credentials", "true")
        // 支持跨域
        ctx.set("Access-Control-Allow-Origin", ctx.request.headers.origin)

        await next()
    }

    async mock(ctx, next){
        let mock = {
            _status: 'proxy',
            ctx,
        }
        ctx.body = JSON.stringify({
            method: ctx.method,
            query: ctx.request
        })
        await next()
    }
}

module.exports = Web