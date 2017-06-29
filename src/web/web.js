// 这里开一个 web 服务器来处理mock请求
const http = require('http')

class Web {
    constructor(){

    }

    createServer(config = {
        host: '127.0.0.1',
        port: '8080'
    }){
        let httpServer = http.createServer((req, res) => this.onRequest(req, res))

        httpServer.listen(config.port, config.host)
    }

    onRequest(req, res){
        this.sendHTML(res,`${req.url} ${req.headers.host}`)
    }

    sendHTML(res, html){
        res.writeHead('200',{
            'Content-TYpe': 'text/plain'
        })
        res.end(html)
    }


}

module.exports = Web