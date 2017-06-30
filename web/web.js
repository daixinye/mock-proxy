// 这里开一个 web 服务器来处理mock请求
'use strict'
const http = require('http')
const koa = require('koa')
const fs = require('fs')

class Web {
    constructor(){
        this.app = new koa()
    }

    createServer(config = {
        port: '8080'
    }){
        this.app.listen(config.port, () => {
            console.log(`Web Server listening on ${config.port}`)
        })

        this.app.use(this.log)
        this.app.use(this.test)
        // this.app.use(this.static)
    }

    async log(ctx, next){
        console.log('%s %s', ctx.method, ctx.url)
        await next()
    }

    async static(ctx, next){
        let path = `${__dirname}/static${ctx.url}`
        let html = fs.readFileSync(path ,'utf-8')
        ctx.body = html
        await next()
    }

    async test(ctx, next){
        ctx.body = JSON.stringify(ctx.headers, null, 4)
        await next()
    }
}

module.exports = Web